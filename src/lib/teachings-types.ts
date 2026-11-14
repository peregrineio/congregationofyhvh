// Types for the /teachings library (blueprint §3.2). A plain module, so client
// components can import the types without pulling in any server code.

export type SeriesGroup = "torah" | "teacher" | "spanish" | "topic"; // "topic" = fallback buckets
export type SeriesIcon = "book" | "mic" | "languages" | "flame" | "play";

export interface TeachingVideo {
  id: string;
  title: string;
  /** ISO date the video was published */
  publishedAt: string;
  /** maxres (or high) thumbnail URL */
  thumbnail: string;
  /** hqdefault, used once if the first thumbnail fails */
  thumbnailFallback: string;
  durationSeconds?: number;
  durationLabel?: string;
  /** https://www.youtube.com/watch?v={id} */
  url: string;
}

export interface Series {
  /** playlist id, or the topic id for the fallback buckets */
  id: string;
  slug: string;
  /** verbatim from YouTube (never mapped or renamed) */
  title: string;
  description?: string;
  /** the playlist's first sentence, else a default for its group */
  blurb: string;
  group: SeriesGroup;
  icon: SeriesIcon;
  /** newest first */
  videoIds: string[];
  count: number;
  /** true when id is a real YouTube playlist (the card adds &list=) */
  isPlaylist: boolean;
}

export interface TeachingsLibrary {
  source: "playlists" | "uploads" | "rss" | "none";
  /** display order */
  series: Series[];
  videos: Record<string, TeachingVideo>;
  /** union of every video, newest first */
  allIds: string[];
  featuredSlug?: string;
  fetchedAt: string;
}

export interface ChannelPlaylist {
  id: string;
  title: string;
  description: string;
  itemCount: number;
  /** the API's return order = the channel's own order */
  position: number;
}
