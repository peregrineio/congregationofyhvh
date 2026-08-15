"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * Client feedback widget — staging only, never production.
 *
 * Follows the workspace standard: provider-agnostic, driven entirely by
 * NEXT_PUBLIC_DEPLOY_ENV / _FEEDBACK_PROVIDER / _FEEDBACK_KEY, and inert
 * unless all three say otherwise.
 *
 * One addition specific to this project. Here a single production
 * deployment serves two audiences: the custom domain (gated to the
 * under-construction notice) and the *.vercel.app URL (the real site,
 * used as staging). There is no separate Vercel preview environment to
 * scope the env vars to, so DEPLOY_ENV alone would follow the site onto
 * congregationofyhvh.com the moment CONSTRUCTION_HOSTS is cleared at
 * go-live — and start showing "Report a bug" to the congregation.
 *
 * So the host is checked too: the widget mounts only on a *.vercel.app
 * hostname. Forgetting to unset an env var can no longer leak it to real
 * visitors; taking the site live is enough on its own.
 */

const STAGING_HOST_PATTERN = /\.vercel\.app$/i;

export function FeedbackWidget() {
  const env = process.env.NEXT_PUBLIC_DEPLOY_ENV;
  const provider = process.env.NEXT_PUBLIC_FEEDBACK_PROVIDER;
  const key = process.env.NEXT_PUBLIC_FEEDBACK_KEY;

  // Host is only knowable after mount; starting false means the widget can
  // never appear in server-rendered HTML, on any host.
  const [onStagingHost, setOnStagingHost] = useState(false);

  useEffect(() => {
    setOnStagingHost(STAGING_HOST_PATTERN.test(window.location.hostname));
  }, []);

  if (env !== "staging" || !provider || !key) return null;
  if (!onStagingHost) return null;

  if (provider === "marker-io") {
    return (
      <>
        <Script id="marker-config" strategy="afterInteractive">
          {`window.markerConfig = { project: ${JSON.stringify(key)}, source: "snippet" };`}
        </Script>
        <Script src="https://edge.marker.io/latest/shim.js" strategy="afterInteractive" />
      </>
    );
  }

  if (provider === "bugherd") {
    return (
      <Script
        src={`https://www.bugherd.com/sidebarv2.js?apikey=${encodeURIComponent(key)}`}
        strategy="afterInteractive"
      />
    );
  }

  return null;
}
