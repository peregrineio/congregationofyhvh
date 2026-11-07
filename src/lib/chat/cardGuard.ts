// The chat assistant never takes card details. A message containing what looks like a card
// number (a run of 13–19 digits, single spaces or dashes allowed between them) is never
// added to the conversation, never stored in the browser, never sent anywhere.
const CARD_RUN = /(?:\d[ -]?){12,18}\d/;

export const CARD_WARNING = "Please don't type card numbers here. Use the secure **[Give page](/give#give-online)**.";

export function looksLikeCardNumber(text: string): boolean {
  return CARD_RUN.test(text);
}

/** Server-side belt and braces: blank out any card-like run before anything is emailed. */
export function redactCardNumbers(text: string): string {
  return text.replace(new RegExp(CARD_RUN.source, "g"), "[removed]");
}
