import { getEntryById, responseFor } from "./matchEngine";

/**
 * Phase 4 — optional in-browser semantic matching layer.
 *
 * A MiniLM embedding model (~25MB, one-time download, cached by the
 * browser) runs in a Web Worker and catches paraphrases the lexical
 * engine misses ("can my kids come along" → children). Zero API cost,
 * zero data leaves the page.
 *
 * Everything degrades gracefully: if the worker, the model download, or
 * the precomputed embeddings are unavailable, refineSemantic() resolves
 * null and the regular fallback flow takes over.
 */

interface SemanticHit {
  response: string;
  quickReplies?: string[];
}

type WorkerState = "idle" | "loading" | "ready" | "failed";

let worker: Worker | null = null;
let state: WorkerState = "idle";
let queryCounter = 0;
const pending = new Map<number, (result: { id: string; similarity: number } | null) => void>();

// Tuned empirically: true paraphrases land 0.44–0.70, noise stays ≤0.27
const SIMILARITY_THRESHOLD = 0.45;
const QUERY_TIMEOUT_MS = 3000;

/** Kick off the lazy model load. Called when the chat first opens. */
/**
 * Off unless NEXT_PUBLIC_CHAT_SEMANTIC=1. The model and its WASM runtime
 * load from huggingface.co and cdn.jsdelivr.net (tens of MB, and the
 * visitor's IP goes to both), so by default the chat answers from the
 * lexical engine alone and nothing loads from a third party.
 */
const SEMANTIC_ENABLED = process.env.NEXT_PUBLIC_CHAT_SEMANTIC === "1";

export function warmSemantic(): void {
  if (state !== "idle") return;
  if (!SEMANTIC_ENABLED) {
    state = "failed";
    return;
  }
  if (typeof window === "undefined" || typeof Worker === "undefined") {
    state = "failed";
    return;
  }
  state = "loading";
  try {
    worker = new Worker(new URL("./semantic.worker.ts", import.meta.url));
    worker.onmessage = (event: MessageEvent) => {
      const msg = event.data;
      if (msg.type === "ready") {
        state = "ready";
      } else if (msg.type === "error") {
        state = "failed";
        worker?.terminate();
        worker = null;
      } else if (msg.type === "result") {
        const resolve = pending.get(msg.id);
        if (resolve) {
          pending.delete(msg.id);
          resolve(msg.best ?? null);
        }
      }
    };
    worker.onerror = () => {
      state = "failed";
      worker?.terminate();
      worker = null;
      pending.forEach((resolve) => resolve(null));
      pending.clear();
    };
    // Absolute URL — the worker runs from a blob: URL in dev, where
    // relative fetches have no resolvable base
    worker.postMessage({
      type: "warm",
      embeddingsUrl: new URL("/chat-embeddings.json", window.location.origin).href,
    });
  } catch {
    state = "failed";
  }
}

/**
 * Try to semantically match a message the lexical engine couldn't.
 * Resolves null when the model isn't ready — never blocks the fallback.
 */
export async function refineSemantic(query: string): Promise<SemanticHit | null> {
  if (state !== "ready" || !worker) return null;

  const id = ++queryCounter;
  const best = await new Promise<{ id: string; similarity: number } | null>((resolve) => {
    const timeout = setTimeout(() => {
      pending.delete(id);
      resolve(null);
    }, QUERY_TIMEOUT_MS);
    pending.set(id, (result) => {
      clearTimeout(timeout);
      resolve(result);
    });
    worker!.postMessage({ type: "query", id, text: query });
  });

  if (!best || best.similarity < SIMILARITY_THRESHOLD) return null;
  const entry = getEntryById(best.id);
  if (!entry) return null;
  return { response: responseFor(entry), quickReplies: entry.quickReplies };
}
