// Content-Security-Policy for /give and /give/* (Prompt 10, legal delta req 1): scripts only
// from this site (nonce + strict-dynamic), no frames, forms may post only here or to Stripe
// Checkout, images from here or Stripe. Fonts are self-hosted, so font-src 'self' holds.

/** /give and everything under it; nothing else. */
export function isGivePath(pathname: string): boolean {
  return pathname === "/give" || pathname.startsWith("/give/");
}

export function giveCsp(nonce: string, dev = false): string {
  return [
    "default-src 'self'",
    // next dev evaluates code at runtime; production never gets 'unsafe-eval'
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://*.stripe.com",
    "font-src 'self'",
    `connect-src 'self'${dev ? " ws:" : ""}`,
    "form-action 'self' https://checkout.stripe.com",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export function newNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}
