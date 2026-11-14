// YouTube Data API v3 fetchers for /teachings (blueprint §3.2). The API key is
// a PARAMETER here: this module never reads the environment. The only caller
// that reads process.env.YOUTUBE_API_KEY is the server-only module
// src/lib/youtube-playlists.ts. Same style as getArchiveVideos() in
// lib/youtube.ts: bounded pagination, cached fetches, private/deleted dropped.

import { YOUTUBE_CHANNEL_ID } from "./youtube";
import type { ChannelPlaylist, TeachingVideo } from "./teachings-types";
import { parseIsoDuration } from "./teachings";

const API = "https://www.googleapis.com/youtube/v3";
const CACHE: RequestInit = { next: { revalidate: 3600, tags: ["youtube-playlists"] } };

/** A non-OK API response (403 quota, 5xx…), so the caller can choose a fallback. */
export class YouTubeApiError extends Error {
  constructor(public status: number) {
    super(`YouTube API responded ${status}`);
    this.name = "YouTubeApiError";
  }
}

export const hqThumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

/** The channel's playlists, in channel order. At most 4 pages of 50. */
export async function getChannelPlaylists(apiKey: string): Promise<ChannelPlaylist[]> {
  const out: ChannelPlaylist[] = [];
  let pageToken: string | undefined;
  for (let page = 0; page < 4; page++) {
    const url = new URL(`${API}/playlists`);
    url.searchParams.set("part", "snippet,contentDetails");
    url.searchParams.set("channelId", YOUTUBE_CHANNEL_ID);
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("key", apiKey);
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const res = await fetch(url, CACHE);
    if (!res.ok) throw new YouTubeApiError(res.status);
    const payload = (await res.json()) as {
      nextPageToken?: string;
      items?: { id?: string; snippet?: { title?: string; description?: string }; contentDetails?: { itemCount?: number } }[];
    };
    for (const item of payload.items ?? []) {
      if (!item.id || !item.snippet?.title) continue;
      out.push({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description ?? "",
        itemCount: item.contentDetails?.itemCount ?? 0,
        position: out.length,
      });
    }
    pageToken = payload.nextPageToken;
    if (!pageToken) break;
  }
  return out;
}

type Thumbs = { maxres?: { url?: string }; high?: { url?: string } };

/** A playlist's playable videos, newest first. At most 10 pages of 50. */
export async function getPlaylistVideos(apiKey: string, playlistId: string): Promise<TeachingVideo[]> {
  const out: TeachingVideo[] = [];
  let pageToken: string | undefined;
  for (let page = 0; page < 10; page++) {
    const url = new URL(`${API}/playlistItems`);
    url.searchParams.set("part", "snippet,contentDetails");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("key", apiKey);
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const res = await fetch(url, CACHE);
    if (!res.ok) throw new YouTubeApiError(res.status);
    const payload = (await res.json()) as {
      nextPageToken?: string;
      items?: {
        snippet?: { title?: string; publishedAt?: string; thumbnails?: Thumbs; resourceId?: { videoId?: string } };
        contentDetails?: { videoId?: string; videoPublishedAt?: string };
      }[];
    };
    for (const item of payload.items ?? []) {
      const id = item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId;
      const title = item.snippet?.title;
      // "Private video" / "Deleted video" placeholders keep their slot; they can't be watched.
      if (!id || !title || title === "Private video" || title === "Deleted video") continue;
      const publishedAt = item.contentDetails?.videoPublishedAt ?? item.snippet?.publishedAt ?? "";
      const t = item.snippet?.thumbnails;
      out.push({
        id,
        title,
        publishedAt,
        thumbnail: t?.maxres?.url ?? t?.high?.url ?? hqThumbnail(id),
        thumbnailFallback: hqThumbnail(id),
        url: watchUrl(id),
      });
    }
    pageToken = payload.nextPageToken;
    if (!pageToken) break;
  }
  return out.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/**
 * Durations in seconds via videos.list (contentDetails), 50 ids per call, at most
 * 10 calls. A failed chunk is skipped; P0D / live / upcoming give no entry, so the
 * card simply hides its clock.
 */
export async function getDurations(apiKey: string, ids: readonly string[]): Promise<Map<string, number>> {
  const unique = [...new Set(ids)];
  const out = new Map<string, number>();
  for (let i = 0, calls = 0; i < unique.length && calls < 10; i += 50, calls++) {
    const chunk = unique.slice(i, i + 50);
    const url = new URL(`${API}/videos`);
    url.searchParams.set("part", "contentDetails");
    url.searchParams.set("id", chunk.join(","));
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("key", apiKey);
    try {
      const res = await fetch(url, CACHE);
      if (!res.ok) continue;
      const payload = (await res.json()) as { items?: { id?: string; contentDetails?: { duration?: string } }[] };
      for (const item of payload.items ?? []) {
        const seconds = parseIsoDuration(item.contentDetails?.duration);
        if (item.id && seconds) out.set(item.id, seconds);
      }
    } catch {
      // skip this chunk: those videos just show no duration
    }
  }
  return out;
}
