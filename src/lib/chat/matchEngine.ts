import MiniSearch from "minisearch";
import { KBEntry, MatchTier } from "./types";
import { faqPatterns, conversationalEntries, fallbackResponses } from "./knowledgeBase";
import { normalizeText, snapTypos, STOPWORDS } from "./normalize";

export interface EngineReply {
  response: string;
  quickReplies?: string[];
  tier: MatchTier | "exact";
  entryId: string | null;
  /** Top alternatives, used to build "Did you mean…?" chips on medium tier */
  alternatives: { id: string; title: string }[];
}

// ---- Index construction (module-level, built once) ----

function processTerm(term: string): string | null {
  const t = term.toLowerCase();
  if (t.length < 2 || STOPWORDS.has(t)) return null;
  return t;
}

const miniSearch = new MiniSearch<{ id: string; title: string; utterances: string; keywords: string }>({
  fields: ["utterances", "keywords", "title"],
  storeFields: ["id"],
  processTerm,
  searchOptions: {
    boost: { utterances: 3, keywords: 2, title: 1 },
    // No fuzzing on short tokens — "ate" must not match "rate"
    fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
    prefix: true,
    combineWith: "OR",
  },
});

miniSearch.addAll(
  faqPatterns.map((entry) => ({
    id: entry.id,
    title: entry.title,
    utterances: entry.utterances.join(" . "),
    keywords: entry.keywords.join(" "),
  }))
);

const entryById = new Map<string, KBEntry>(faqPatterns.map((e) => [e.id, e]));
const entryByTitle = new Map<string, KBEntry>(faqPatterns.map((e) => [e.title.toLowerCase(), e]));

/** Vocabulary for typo snapping — every content token in the KB. */
const vocabulary: Set<string> = (() => {
  const vocab = new Set<string>();
  for (const entry of faqPatterns) {
    for (const text of [...entry.utterances, ...entry.keywords, entry.title]) {
      for (const token of normalizeText(text).split(" ")) {
        if (token.length >= 2 && !STOPWORDS.has(token)) vocab.add(token);
      }
    }
  }
  return vocab;
})();

export function getEntryById(id: string): KBEntry | undefined {
  return entryById.get(id);
}

export function getEntryByTitle(title: string): KBEntry | undefined {
  return entryByTitle.get(title.toLowerCase());
}

/** The answer to show for an entry — computed fresh when it has a resolver. */
export function responseFor(entry: KBEntry): string {
  return entry.resolve ? entry.resolve() : entry.response;
}

// ---- Confidence thresholds (tuned against the test corpus) ----
// MiniSearch BM25 scores for this index: clear hits land 8+, partial
// single-term overlaps land 2–6, noise stays under 2.
const STRONG_SCORE = 7;
const MEDIUM_SCORE = 2;
const PAGE_BOOST = 1.4;

let fallbackCursor = Math.floor(Math.random() * fallbackResponses.length);

function nextFallback(): EngineReply {
  fallbackCursor = (fallbackCursor + 1) % fallbackResponses.length;
  const fb = fallbackResponses[fallbackCursor];
  return {
    response: fb.response,
    quickReplies: fb.quickReplies,
    tier: "fallback",
    entryId: null,
    alternatives: [],
  };
}

function entryReply(entry: KBEntry, tier: MatchTier | "exact", alternatives: { id: string; title: string }[] = []): EngineReply {
  return {
    response: responseFor(entry),
    quickReplies: entry.quickReplies,
    tier,
    entryId: entry.id,
    alternatives,
  };
}

/**
 * Match a user message against the knowledge base.
 *
 * Pipeline: exact conversational pre-pass → normalize + typo-snap →
 * BM25 search with page-aware boosting → three-tier confidence gate.
 */
export function matchMessage(userMessage: string, opts?: { pathname?: string }): EngineReply {
  const raw = userMessage.slice(0, 500);
  const normalized = normalizeText(raw);

  // 1. Exact conversational pre-pass — greetings/thanks/goodbyes only ever
  //    match exactly, so their short tokens can't hijack real questions.
  for (const conv of conversationalEntries) {
    if (conv.phrases.includes(normalized)) {
      const ref = conv.entryRef ? entryById.get(conv.entryRef) : undefined;
      return {
        response: (ref ? responseFor(ref) : conv.response) ?? "",
        quickReplies: ref?.quickReplies ?? conv.quickReplies,
        tier: "exact",
        entryId: ref?.id ?? null,
        alternatives: [],
      };
    }
  }

  // 2. Typo snap on content tokens ("shabat" → "shabbat")
  const tokens = normalized.split(" ").filter(Boolean);
  const snapped = snapTypos(tokens, vocabulary).join(" ");

  // 3. BM25 search
  const results = miniSearch.search(snapped);
  if (results.length === 0) return nextFallback();

  // 4. Page-aware boost — on /shabbat, service-time intents float up, etc.
  const pathname = opts?.pathname ?? "";
  const scored = results.map((r) => {
    const entry = entryById.get(r.id as string)!;
    const boosted = entry.boostOn?.some((prefix) => pathname.startsWith(prefix))
      ? r.score * PAGE_BOOST
      : r.score;
    // Count distinct QUERY words that matched, not index terms: with prefix
    // matching one word ("live", typo-snapped from "love") hits both "live"
    // and "livestream", which r.terms counts twice — that let "i love
    // pizza" pass the two-term gate as a strong livestream answer.
    return { entry, score: boosted, matchedTerms: r.queryTerms.length };
  });
  scored.sort((a, b) => b.score - a.score);

  const top = scored[0];
  const alternatives = scored.slice(0, 3).map(({ entry }) => ({ id: entry.id, title: entry.title }));
  const contentTokens = snapped.split(" ").filter((t) => t.length >= 2 && !STOPWORDS.has(t)).length;

  // 5. Confidence gate. A single overlapping term on a multi-word question
  //    is never "strong" — that's how compliments matched the redesign pitch.
  if (top.score >= STRONG_SCORE && (top.matchedTerms >= 2 || contentTokens <= 1)) {
    return entryReply(top.entry, "strong");
  }
  if (top.score >= MEDIUM_SCORE) {
    // Close call — clarify instead of confidently answering the wrong thing
    return {
      response: "I want to make sure I get this right — are you asking about one of these?",
      quickReplies: alternatives.map((a) => a.title),
      tier: "medium",
      entryId: top.entry.id,
      alternatives,
    };
  }
  return nextFallback();
}
