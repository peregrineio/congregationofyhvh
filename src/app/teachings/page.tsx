import type { Metadata } from "next";
import { TORAH_PORTIONS_WITH_DATES } from "@/lib/torah-utils";
import {
  getChannelVideos,
  YOUTUBE_CHANNEL_URL,
  type YouTubeVideo,
} from "@/lib/youtube";
import { AboutHero } from "@/components/about/about-hero";
import { VideoEmbed } from "@/components/teachings/video-embed";
import { GoldButton } from "@/components/ui/gold-button";
import { Youtube } from "@/components/icons";

export const metadata: Metadata = {
  title: "Teachings | Congregation of YHVH",
  description:
    "Video teachings from the Congregation of YHVH: weekly Torah portions, the appointed feasts, and more, from our YouTube channel.",
};

// Same cadence as /events: the channel list revalidates every 15 minutes.
export const revalidate = 900;

const FEAST_WORDS = [
  "feast",
  "pesach",
  "passover",
  "matzot",
  "unleavened",
  "shavuot",
  "pentecost",
  "teruah",
  "trumpets",
  "yom kippur",
  "atonement",
  "sukkot",
  "tabernacles",
  "shemini",
  "hanukkah",
  "chanukah",
  "purim",
  "first fruits",
  "bikkurim",
];

// Extra Spanish cues for titles the shared detector in lib/youtube misses
// (e.g. "Deberían Los Cristianos Seguir Observando Las Fiestas Bíblicas").
const SPANISH_WORDS = /\b(deberían|cristianos|fiestas|bíblicas|nuestro|dios|iglesia|enseñanza|porción)\b/i;

interface Topic {
  id: string;
  title: string;
  blurb: string;
  videos: YouTubeVideo[];
}

/**
 * Group by topic from the title alone. Order matters: Spanish first (a
 * Spanish Torah teaching belongs with the other Spanish ones), then Torah
 * portions, then the feasts, and everything else under "More Teachings".
 */
function groupByTopic(videos: YouTubeVideo[]): Topic[] {
  const topics: Topic[] = [
    {
      id: "torah-portions",
      title: "Torah Portions",
      blurb: "The weekly reading, taught portion by portion.",
      videos: [],
    },
    {
      id: "feasts",
      title: "The Appointed Feasts",
      blurb: "The moedim of YHVH and what they teach us.",
      videos: [],
    },
    {
      id: "more",
      title: "More Teachings",
      blurb: "Messages and studies beyond the weekly portion.",
      videos: [],
    },
    {
      id: "espanol",
      title: "En Español",
      blurb: "Enseñanzas en español.",
      videos: [],
    },
  ];
  const [torah, feasts, more, spanish] = topics;

  for (const video of videos) {
    const lower = video.title.toLowerCase();
    if (video.isSpanish || SPANISH_WORDS.test(video.title)) spanish.videos.push(video);
    // Titles that say "Torah Portion" count even when the portion name is
    // spelled differently from our data (Bereshit vs Bereishit).
    else if (video.portionHebrewName || lower.includes("torah portion")) torah.videos.push(video);
    else if (FEAST_WORDS.some((word) => lower.includes(word)))
      feasts.videos.push(video);
    else more.videos.push(video);
  }

  return topics.filter((topic) => topic.videos.length > 0);
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    timeZone: "America/Chicago",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function TeachingsPage() {
  const portionNames = [
    ...new Set(TORAH_PORTIONS_WITH_DATES.map((portion) => portion.hebrewName)),
  ];
  const videos = await getChannelVideos(portionNames);
  const topics = groupByTopic(videos);

  return (
    <>
      <AboutHero
        eyebrow="From Our Channel"
        title={["Teachings"]}
        tagline="Study the Word with us, any day of the week"
        image={{ src: "/images/gs/torah-hero.webp" }}
      >
        <p>
          Every Shabbat teaching is recorded and shared on our YouTube channel.
          Browse them here by topic, or subscribe on YouTube to see each new
          one.
        </p>
        <a
          href={YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block"
        >
          <GoldButton>
            <Youtube className="size-4" aria-hidden /> Watch on YouTube
          </GoldButton>
        </a>
      </AboutHero>

      <div className="mx-auto max-w-7xl space-y-14 px-4 pb-20 sm:px-6 lg:px-8">
        {topics.length > 0 && (
          <nav
            aria-label="Teaching topics"
            className="flex flex-wrap justify-center gap-3"
          >
            {topics.map((topic) => (
              <a
                key={topic.id}
                href={`#${topic.id}`}
                className="rounded-full border border-yhvh-gold/30 px-4 py-2 font-subheading text-xs font-semibold uppercase tracking-[0.15em] text-yhvh-gold-dark transition-colors hover:bg-yhvh-gold/10"
              >
                {topic.title} ({topic.videos.length})
              </a>
            ))}
          </nav>
        )}

        {topics.map((topic) => (
          <section key={topic.id} id={topic.id} className="scroll-mt-36">
            <h2 className="font-heading text-3xl text-foreground">
              {topic.title}
            </h2>
            <p className="mt-2 font-body text-muted-foreground">
              {topic.blurb}
            </p>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topic.videos.map((video) => (
                <li key={video.id} className="parchment-plate rounded-xl p-3">
                  <VideoEmbed
                    id={video.id}
                    title={video.title}
                    thumbnail={video.thumbnail}
                  />
                  <h3 className="mt-3 px-1 font-subheading text-base font-semibold leading-snug text-foreground">
                    {video.title}
                  </h3>
                  <p className="mt-1 px-1 pb-1 font-body text-sm text-muted-foreground">
                    {formatDate(video.published)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {topics.length === 0 && (
          <section className="parchment-plate rounded-xl p-9 text-center">
            <h2 className="font-heading text-2xl text-foreground">
              Teachings are on YouTube
            </h2>
            <p className="mt-3 font-body text-muted-foreground">
              We couldn&apos;t load the video list just now. Every teaching is
              on our channel.
            </p>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block"
            >
              <GoldButton>Open our YouTube channel</GoldButton>
            </a>
          </section>
        )}
      </div>
    </>
  );
}
