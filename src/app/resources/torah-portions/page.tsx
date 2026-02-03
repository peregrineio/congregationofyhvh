import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { TORAH_PORTIONS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Torah Portions | Congregation of YHVH",
  description:
    "The complete annual Torah portion reading schedule with all 54 parashot, Haftarah, and Brit Chadashah readings.",
};

export default function TorahPortionsPage() {
  // In production, the "current" portion would be calculated by date
  const currentPortionNumber = 1;

  return (
    <>
      <PageHero
        title="Torah Portions"
        subtitle="The Annual Parashot Reading Schedule"
        scripture={{
          quote: "Your word is a lamp to my feet and a light to my path.",
          reference: "Psalm 119:105",
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-border/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-card">
                <th className="px-4 py-3 text-left font-subheading text-xs font-semibold uppercase tracking-wider text-primary">
                  #
                </th>
                <th className="px-4 py-3 text-left font-subheading text-xs font-semibold uppercase tracking-wider text-primary">
                  Portion
                </th>
                <th className="px-4 py-3 text-left font-subheading text-xs font-semibold uppercase tracking-wider text-primary hidden sm:table-cell">
                  Hebrew
                </th>
                <th className="px-4 py-3 text-left font-subheading text-xs font-semibold uppercase tracking-wider text-primary">
                  Torah Reading
                </th>
                <th className="px-4 py-3 text-left font-subheading text-xs font-semibold uppercase tracking-wider text-primary hidden md:table-cell">
                  Haftarah
                </th>
                <th className="px-4 py-3 text-left font-subheading text-xs font-semibold uppercase tracking-wider text-primary hidden lg:table-cell">
                  Brit Chadashah
                </th>
              </tr>
            </thead>
            <tbody>
              {TORAH_PORTIONS.map((portion) => {
                const isCurrent = portion.number === currentPortionNumber;
                return (
                  <tr
                    key={portion.number}
                    className={`border-b border-border/20 transition-colors hover:bg-card/50 ${
                      isCurrent ? "bg-primary/5 border-l-2 border-l-primary" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      {isCurrent ? (
                        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          {portion.number}
                        </span>
                      ) : (
                        portion.number
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">
                        {portion.name}
                      </span>
                      <span className="sm:hidden block text-xs text-primary/70 mt-0.5">
                        {portion.hebrewName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-primary/80 font-subheading hidden sm:table-cell">
                      {portion.hebrewName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {portion.torahReading}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {portion.haftarah}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {portion.britChadashah}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-center text-xs text-muted-foreground/50 pt-6">
          The highlighted portion indicates the current week&apos;s reading. The
          annual cycle restarts on Simchat Torah.
        </p>
      </div>
    </>
  );
}
