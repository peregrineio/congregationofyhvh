import { Hero } from "@/components/sections/hero";
import { Welcome } from "@/components/sections/welcome";
import { QuickAccess } from "@/components/sections/quick-access";
import { UpcomingShabbat } from "@/components/sections/upcoming-shabbat";
import { Location } from "@/components/sections/location";

// UpcomingShabbat shows this week's portion, so the page cannot be frozen at
// build time.
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />
      <Welcome />
      <QuickAccess />
      <UpcomingShabbat />
      <Location />
    </>
  );
}
