/**
 * Input normalization layer (RiveScript-style substitutions).
 * Runs BEFORE matching so the engine sees clean, canonical text.
 */

const SUBSTITUTIONS: Record<string, string> = {
  "what's": "what is",
  "whats": "what is",
  "how's": "how is",
  "who's": "who is",
  "where's": "where is",
  "i'm": "i am",
  "im": "i am",
  "don't": "do not",
  "dont": "do not",
  "can't": "can not",
  "cant": "can not",
  "won't": "will not",
  "doesn't": "does not",
  "doesnt": "does not",
  "isn't": "is not",
  "isnt": "is not",
  "you're": "you are",
  "youre": "you are",
  "i've": "i have",
  "ive": "i have",
  "we're": "we are",
  "it's": "it is",
  "u": "you",
  "ur": "your",
  "r": "are",
  "thx": "thanks",
  "ty": "thanks",
  "pls": "please",
  "plz": "please",
  "yall": "you all",
  "wanna": "want to",
  "gonna": "going to",
  "kinda": "kind of",
  "info": "information",
};

/**
 * Stopwords excluded from term matching. These are the words that caused
 * the old engine's false positives ("a" matching "ai", "i" matching
 * "investment", "yo" landmines). Content words are never in this list.
 */
export const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "am", "was", "were", "be", "been",
  "i", "we", "you", "your", "yours", "our", "ours", "my", "me", "us",
  "it", "its", "this", "that", "these", "those", "there",
  "do", "does", "did", "can", "could", "would", "will", "shall", "should",
  "have", "has", "had", "want", "need",
  "what", "who", "whom", "which", "when", "where", "why", "how",
  "of", "in", "on", "for", "to", "with", "at", "by", "from", "as", "into",
  "and", "or", "but", "if", "so", "than", "then", "too", "very",
  "about", "any", "some", "just", "like", "get", "got", "go",
  "please", "tell", "know", "see", "looking", "interested",
]);

export function normalizeText(text: string): string {
  let normalized = text
    .toLowerCase()
    .replace(/[^\w\s$'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  normalized = normalized
    .split(" ")
    .map((word) => SUBSTITUTIONS[word.replace(/'/g, "")] ?? SUBSTITUTIONS[word] ?? word)
    .join(" ")
    .replace(/'/g, "");

  return normalized;
}

/** Levenshtein distance, early-exit beyond `max`. */
export function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev = new Array(b.length + 1).fill(0).map((_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let cur = i;
    let rowMin = i;
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      cur = Math.min(prev[j] + 1, cur + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
      prev[j] = cur;
      if (cur < rowMin) rowMin = cur;
    }
    if (rowMin > max) return max + 1;
  }
  return prev[b.length];
}

/**
 * Snap typo'd tokens to the nearest known vocabulary word.
 * "pricng" → "pricing", "porfolio" → "portfolio".
 * Only applies to tokens ≥4 chars that aren't already known.
 */
export function snapTypos(tokens: string[], vocabulary: Set<string>): string[] {
  return tokens.map((token) => {
    if (token.length < 4 || vocabulary.has(token) || STOPWORDS.has(token)) return token;
    const maxDist = token.length >= 7 ? 2 : 1;
    let best: string | null = null;
    let bestDist = maxDist + 1;
    for (const word of vocabulary) {
      if (Math.abs(word.length - token.length) > maxDist) continue;
      const d = editDistance(token, word, maxDist);
      if (d < bestDist) {
        bestDist = d;
        best = word;
        if (d === 0) break;
      }
    }
    return best && bestDist <= maxDist ? best : token;
  });
}

/** Affirmations — interpreted against the bot's previous question. */
const AFFIRMATIONS = new Set([
  "yes", "yeah", "yep", "yup", "sure", "ok", "okay", "sounds good",
  "yes please", "lets do it", "let us do it", "go ahead", "alright", "definitely",
]);

export function isAffirmation(text: string): boolean {
  return AFFIRMATIONS.has(normalizeText(text));
}

const NEGATIONS = new Set(["no", "nope", "nah", "not now", "no thanks", "no thank you"]);

export function isNegation(text: string): boolean {
  return NEGATIONS.has(normalizeText(text));
}

/** Explicit human-handoff signals — must ALWAYS work (research takeaway #3). */
const HUMAN_PATTERNS = [
  "human", "real person", "a person", "an agent", "live agent",
  "talk to someone", "speak to someone", "representative", "speak with someone",
];

export function wantsHuman(text: string): boolean {
  const normalized = normalizeText(text);
  return HUMAN_PATTERNS.some(
    (p) => normalized === p || normalized.includes(p)
  );
}
