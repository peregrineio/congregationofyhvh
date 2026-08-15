import { NextResponse, type NextRequest } from "next/server";

/**
 * Under-construction gate.
 *
 * Requests arriving on a "locked" hostname get the static construction notice.
 * Every other hostname -- localhost, the *.vercel.app production URL, branch
 * previews -- serves the real site, so the site stays fully editable and
 * viewable while the public domain shows the placeholder.
 *
 * TO TAKE THE SITE LIVE: set CONSTRUCTION_HOSTS to an empty string in the
 * Vercel production environment and redeploy. No code change needed.
 * (Deleting this file also works, but the env var is the reversible option.)
 */

const DEFAULT_LOCKED_HOSTS = [
  "congregationofyhvh.com",
  "www.congregationofyhvh.com",
];

// An explicitly-set CONSTRUCTION_HOSTS always wins -- including when it is set
// to "", which unlocks every host. Unset falls back to the defaults above so
// the gate works with no dashboard configuration.
const LOCKED_HOSTS =
  process.env.CONSTRUCTION_HOSTS !== undefined
    ? process.env.CONSTRUCTION_HOSTS.split(",")
        .map((host) => host.trim().toLowerCase())
        .filter(Boolean)
    : DEFAULT_LOCKED_HOSTS;

// Optional escape hatch for viewing the real site on the locked domain:
// visit https://<locked-host>/?preview=<token> once to set a cookie.
// Unset = no bypass (use the *.vercel.app URL instead). Never hardcode a
// value here -- this repository is public.
const BYPASS_TOKEN = process.env.CONSTRUCTION_BYPASS_TOKEN;
const BYPASS_COOKIE = "cyhvh_preview";

export default function proxy(request: NextRequest) {
  if (LOCKED_HOSTS.length === 0) return NextResponse.next();

  const host = (request.headers.get("host") ?? "")
    .toLowerCase()
    .split(":")[0];

  if (!LOCKED_HOSTS.includes(host)) return NextResponse.next();

  if (BYPASS_TOKEN) {
    const url = request.nextUrl;

    // ?preview=<token> -- store the cookie, then strip the param from the URL
    // so the token does not linger in the address bar or in referrer headers.
    if (url.searchParams.get("preview") === BYPASS_TOKEN) {
      const clean = new URL(url);
      clean.searchParams.delete("preview");
      const response = NextResponse.redirect(clean);
      response.cookies.set(BYPASS_COOKIE, BYPASS_TOKEN, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    if (request.cookies.get(BYPASS_COOKIE)?.value === BYPASS_TOKEN) {
      return NextResponse.next();
    }
  }

  // Keep crawlers off the placeholder entirely.
  if (request.nextUrl.pathname === "/robots.txt") {
    return NextResponse.rewrite(
      new URL("/construction-robots.txt", request.url),
    );
  }

  const response = NextResponse.rewrite(
    new URL("/construction.html", request.url),
  );
  response.headers.set("x-robots-tag", "noindex, nofollow");
  return response;
}

export const config = {
  // Everything except the assets the construction page itself needs, plus
  // Next's own static output. Without these exclusions the image request
  // would be rewritten back to the HTML and the page would render blank.
  //
  // The icon entries matter as much as the image ones: the App Router serves
  // icon.png and apple-icon.png as routes, so without them listed the gate
  // answers those requests with the placeholder HTML and the tab icon breaks
  // on the live domain while still working on staging.
  matcher: [
    "/((?!_next/static|_next/image|images/|videos/|construction\\.html|construction-robots\\.txt|favicon\\.ico|icon\\.png|apple-icon\\.png).*)",
  ],
};
