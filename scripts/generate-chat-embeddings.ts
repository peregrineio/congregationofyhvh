/**
 * Build-time KB embedding generation for the chatbot's semantic layer.
 *
 * Run whenever knowledgeBase.ts changes:
 *   npm run chat:embeddings
 *
 * Downloads the MiniLM model once (~25MB, cached in ~/.cache/huggingface),
 * embeds every KB entry, and writes public/chat-embeddings.json. The
 * browser worker then only ever embeds the user's QUERY at runtime.
 */
import { pipeline } from "@huggingface/transformers";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { faqPatterns } from "../src/lib/chat/knowledgeBase";

const MODEL = "Xenova/all-MiniLM-L6-v2";

async function main() {
  console.log(`Loading ${MODEL}...`);
  const extractor = await pipeline("feature-extraction", MODEL, { dtype: "q8" });

  // One vector PER UTTERANCE (not per entry) — averaging a whole entry's
  // utterances dilutes the vector and tanks paraphrase similarity. The
  // worker takes the max similarity across an entry's utterance vectors.
  const entries: { id: string; v: number[] }[] = [];
  for (const entry of faqPatterns) {
    for (const utterance of [entry.title, ...entry.utterances]) {
      const output = await extractor(utterance, { pooling: "mean", normalize: true });
      const vector = Array.from(output.data as Float32Array).map((x) => Number(x.toFixed(5)));
      entries.push({ id: entry.id, v: vector });
    }
    console.log(`  embedded: ${entry.id} (${entry.utterances.length + 1} vectors)`);
  }

  const outPath = join(process.cwd(), "public", "chat-embeddings.json");
  writeFileSync(
    outPath,
    JSON.stringify({ model: MODEL, dim: entries[0].v.length, entries })
  );
  console.log(`\nWrote ${entries.length} embeddings to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
