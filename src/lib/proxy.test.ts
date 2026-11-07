// node --import tsx --test src/lib/proxy.test.ts   (npm test)
import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { giveCsp, isGivePath } from "./give-csp";

// the gate reads CONSTRUCTION_HOSTS when the module loads
process.env.CONSTRUCTION_HOSTS = "locked.example";
let proxy: (r: NextRequest) => Response;
test.before(async () => {
  proxy = (await import("../proxy")).default;
});

const req = (path: string, host = "congregation-yhvh.vercel.app") =>
  new NextRequest(`https://${host}${path}`, { headers: { host } });
const csp = (path: string, host?: string) => proxy(req(path, host)).headers.get("content-security-policy");

test("isGivePath: /give and /give/* only", () => {
  for (const p of ["/give", "/give/thank-you"]) assert.equal(isGivePath(p), true, p);
  for (const p of ["/", "/about", "/giver", "/giveaway", "/api/give/checkout"]) assert.equal(isGivePath(p), false, p);
});

test("/give and /give/thank-you get the CSP with a fresh nonce each request", () => {
  const a = csp("/give");
  const b = csp("/give");
  assert.ok(a && b);
  const nonce = (s: string) => /'nonce-([^']+)'/.exec(s)?.[1];
  assert.ok(nonce(a!) && nonce(b!) && nonce(a!) !== nonce(b!));
  assert.equal(a, giveCsp(nonce(a!)!));
  assert.ok(csp("/give/thank-you"));
  for (const part of ["default-src 'self'", "'strict-dynamic'", "font-src 'self'", "connect-src 'self'", "form-action 'self' https://checkout.stripe.com", "frame-src 'none'", "frame-ancestors 'none'", "object-src 'none'", "img-src 'self' data: https://*.stripe.com"])
    assert.ok(a!.includes(part), part);
  assert.ok(!a!.includes("unsafe-eval"));
});

test("other routes get no CSP", () => {
  for (const p of ["/", "/about", "/shabbat", "/api/give/checkout"]) assert.equal(csp(p), null, p);
});

test("construction gate still serves the notice on a locked host, without the giving CSP", () => {
  const res = proxy(req("/give", "locked.example"));
  assert.match(res.headers.get("x-middleware-rewrite") ?? "", /\/construction\.html$/);
  assert.equal(res.headers.get("content-security-policy"), null);
  assert.equal(res.headers.get("x-robots-tag"), "noindex, nofollow");
});

test("the Stripe webhook is never sent to the construction notice", () => {
  const res = proxy(req("/api/give/webhook", "locked.example"));
  assert.equal(res.headers.get("x-middleware-rewrite"), null);
  assert.equal(res.headers.get("x-middleware-next"), "1");
});
