import "server-only";

// The /teachings library, server-side only. This is the ONE module that reads
// YOUTUBE_API_KEY for the page (the repo is public: the key is never logged,
// never sent to a client, never committed). The fetchers themselves take the
// key as a parameter and live in ./teachings-api.

import { getPortionMatchNames } from "./torah-utils";
import { forcedSource } from "./teachings";
import { buildTeachingsLibrary } from "./teachings-api";
import type { TeachingsLibrary } from "./teachings-types";

export { getChannelPlaylists, getDurations, getPlaylistVideos, YouTubeApiError } from "./teachings-api";

/** The /teachings library for the page (blueprint §3.6). Never throws. */
export function getTeachingsLibrary(): Promise<TeachingsLibrary> {
  // TEACHINGS_FORCE_SOURCE is a local QA aid only; forcedSource() ignores it in production
  return buildTeachingsLibrary(process.env.YOUTUBE_API_KEY || undefined, getPortionMatchNames(), forcedSource({ VERCEL_ENV: process.env.VERCEL_ENV, TEACHINGS_FORCE_SOURCE: process.env.TEACHINGS_FORCE_SOURCE }));
}
