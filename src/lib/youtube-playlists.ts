import "server-only";

// The /teachings library, server-side only. This is the ONE module that reads
// YOUTUBE_API_KEY for the page (the repo is public: the key is never logged,
// never sent to a client, never committed). The fetchers themselves take the
// key as a parameter and live in ./teachings-api.

export { getChannelPlaylists, getPlaylistVideos, YouTubeApiError } from "./teachings-api";
