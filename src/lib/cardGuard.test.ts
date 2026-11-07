// node --import tsx --test src/lib/cardGuard.test.ts   (npm test)
import { test } from "node:test";
import assert from "node:assert/strict";
import { looksLikeCardNumber, redactCardNumbers } from "./chat/cardGuard";

test("card-number-like messages are caught: plain, spaced, dashed, 13–19 digits", () => {
  for (const s of ["4242 4242 4242 4242", "4242-4242-4242-4242", "my card is 4242424242424242 exp 12/30", "378282246310005", "4000 0566 5566 5556 123"])
    assert.equal(looksLikeCardNumber(s), true, s);
});

test("phone numbers, dates, amounts and short numbers pass through", () => {
  for (const s of ["713-555-0123", "(713) 555-0123", "+1 713 555 0123", "Give $100 on 11/07/2026", "Exodus 25:2", "PO Box 12345"])
    assert.equal(looksLikeCardNumber(s), false, s);
});

test("server redaction blanks the run and keeps the rest", () => {
  assert.equal(redactCardNumbers("pay with 4242 4242 4242 4242 please"), "pay with [removed] please");
  assert.equal(redactCardNumbers("call 713-555-0123"), "call 713-555-0123");
});
