/// <reference lib="webworker" />

/**
 * Semantic matching Web Worker.
 *
 * Loads the MiniLM embedding model (transformers.js, WASM/WebGPU) and the
 * build-time KB embeddings from /chat-embeddings.json. At runtime only the
 * QUERY is embedded (~50–200ms warm); KB vectors are precomputed.
 *
 * Lives entirely off the main thread — Core Web Vitals untouched.
 */

interface KBVector {
  id: string;
  v: number[];
}

interface EmbeddingsFile {
  model: string;
  dim: number;
  entries: KBVector[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let extractor: any = null;
let kbVectors: KBVector[] = [];

function cosine(a: number[], b: Float32Array | number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

async function warm(embeddingsUrl: string): Promise<void> {
  try {
    const embeddingsResponse = await fetch(embeddingsUrl);
    if (!embeddingsResponse.ok) throw new Error("embeddings not found");
    const file: EmbeddingsFile = await embeddingsResponse.json();
    kbVectors = file.entries;

    const { pipeline } = await import("@huggingface/transformers");
    extractor = await pipeline("feature-extraction", file.model, { dtype: "q8" });

    self.postMessage({ type: "ready" });
  } catch (err) {
    self.postMessage({ type: "error", message: String(err) });
  }
}

async function query(id: number, text: string): Promise<void> {
  try {
    const output = await extractor(text, { pooling: "mean", normalize: true });
    const queryVector: Float32Array = output.data;

    let best: { id: string; similarity: number } | null = null;
    for (const entry of kbVectors) {
      const similarity = cosine(entry.v, queryVector);
      if (!best || similarity > best.similarity) {
        best = { id: entry.id, similarity };
      }
    }
    self.postMessage({ type: "result", id, best });
  } catch {
    self.postMessage({ type: "result", id, best: null });
  }
}

self.onmessage = (event: MessageEvent) => {
  const msg = event.data;
  if (msg.type === "warm") warm(msg.embeddingsUrl);
  else if (msg.type === "query") query(msg.id, msg.text);
};
