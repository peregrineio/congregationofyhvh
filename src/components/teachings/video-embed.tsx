"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "@/components/icons";

/**
 * Click-to-play YouTube embed. The page can list dozens of teachings, so it
 * shows the thumbnail and loads the player (from youtube-nocookie.com) only
 * when someone presses play, instead of mounting an iframe per video.
 */
export function VideoEmbed({
  id,
  title,
  thumbnail,
}: {
  id: string;
  title: string;
  thumbnail: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full rounded-lg"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play: ${title}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-yhvh-gold"
    >
      <Image
        src={thumbnail}
        alt=""
        fill
        unoptimized
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-warm-black/25 transition-colors group-hover:bg-warm-black/10"
      />
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 inline-flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-yhvh-gold text-white shadow-lg transition-transform group-hover:scale-110"
      >
        <Play className="ml-1 size-6" />
      </span>
    </button>
  );
}
