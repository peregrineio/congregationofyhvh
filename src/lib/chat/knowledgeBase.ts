import { KBEntry } from "./types";
import { SITE_CONFIG } from "../constants";
import { getNextPortion, parsePortionDate } from "../torah-utils";

/**
 * Every answer here restates something the site already says — the
 * Statement of Faith, the FAQ, the Shabbat page, SITE_CONFIG. The bot must
 * never become a second, unreviewed source of doctrine: if a question needs
 * a pastoral answer, it routes to a person.
 *
 * After editing this file run `npm run chat:embeddings` so the semantic
 * layer sees the change.
 */

/**
 * Public channel URL. Duplicated from src/lib/youtube.ts on purpose — that
 * module holds the API key path and must never reach a client bundle.
 */
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@CongregationofYHVH";

const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE_CONFIG.address)}`;

export const congregationInfo = {
  name: SITE_CONFIG.name,
  email: SITE_CONFIG.email,
  address: SITE_CONFIG.address,
  serviceDay: SITE_CONFIG.serviceDay,
  serviceTime: SITE_CONFIG.serviceTime,
  kidsTime: "2:00 to 2:45 PM",
};

// ---- Week-to-week answers ----

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

/**
 * The next service: today if it is Saturday and the 3:00 PM service hasn't
 * started, otherwise the coming Saturday. Uses the visitor's clock, which
 * is Central for nearly everyone who will attend.
 */
function nextShabbatDate(from: Date = new Date()): Date {
  const date = new Date(from);
  const startedToday = date.getDay() === 6 && date.getHours() >= 15;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + ((6 - date.getDay() + 7) % 7 || (startedToday ? 7 : 0)));
  return date;
}

function serviceTimesAnswer(): string {
  const shabbat = nextShabbatDate();
  const isToday = shabbat.toDateString() === new Date().toDateString();
  const when = isToday ? "**today**" : `this **${formatShortDate(shabbat)}**`;
  return (
    `We gather every Shabbat (Saturday) at **${congregationInfo.serviceTime}** — ${when} is the next one.\n\n` +
    `There's a children's service from **${congregationInfo.kidsTime}**, just before the main service.\n\n` +
    `📍 ${congregationInfo.address} — **[get directions](${MAPS_URL})**`
  );
}

function torahPortionAnswer(): string {
  const portion = getNextPortion();
  if (!portion) {
    return (
      "We've just finished the yearly reading cycle — it begins again with **Beresheet** (Genesis 1:1–6:8).\n\n" +
      "**[See all the Torah portions](/resources/torah-portions)**"
    );
  }
  const date = parsePortionDate(portion.date);
  // Not every reading falls on a Saturday — V'Zot HaBerachah is read on
  // Simchat Torah — so only say "this Shabbat" when it actually is one.
  const opener = !date
    ? "The next Torah portion is"
    : date.getDay() === 6
      ? `This Shabbat's portion (${formatShortDate(date)}) is`
      : `The next reading, on ${formatShortDate(date)}, is`;
  return (
    `${opener} **${portion.hebrewName}** — "${portion.name}":\n\n` +
    `• Torah: ${portion.torahReading}\n• Haftarah: ${portion.haftarah}\n• Brit Chadashah: ${portion.britChadashah}\n\n` +
    "**[See all the Torah portions](/resources/torah-portions)**"
  );
}

/**
 * Exact-phrase conversational entries. These match ONLY via the exact-match
 * pre-pass (never indexed) so short tokens like "hi"/"yo" can't hijack
 * unrelated questions.
 */
export const conversationalEntries: { phrases: string[]; response?: string; quickReplies?: string[]; entryRef?: string }[] = [
  {
    // Stopword-only identity questions can't be retrieved — route exactly
    phrases: ["who are you", "what are you", "who am i talking to", "who is this", "what is this", "are you a real person", "are you human"],
    entryRef: "bot-identity",
  },
  {
    phrases: ["shabbat shalom", "good shabbos", "shabbat shalom everyone"],
    response: "Shabbat shalom! 🕯️ How can I help you today?",
    quickReplies: ["Service times", "This week's Torah portion", "Watch online"],
  },
  {
    phrases: ["hi", "hello", "hey", "shalom", "howdy", "good morning", "good afternoon", "good evening", "hey there", "hi there", "hello there", "shalom shalom"],
    response:
      "Shalom! 👋 I can answer questions about Shabbat services, what we believe, and visiting — or pass a prayer request along to the congregation.",
    quickReplies: ["Service times", "Plan a visit", "Share a prayer request", "Talk to someone"],
  },
  {
    phrases: ["thanks", "thank you", "thanks a lot", "thank you so much", "appreciate it", "todah", "toda", "todah rabah", "toda raba", "awesome", "great", "perfect", "cool", "nice"],
    response: "You're very welcome! I'm here anytime. We'd love to see you on Shabbat. 🕯️",
    quickReplies: ["Service times", "Plan a visit"],
  },
  {
    phrases: ["bye", "goodbye", "see you", "later", "see ya", "gotta go", "blessings", "be blessed"],
    response: "Shalom — be blessed! I'll be right here if anything comes up. 👋",
  },
];

export const faqPatterns: KBEntry[] = [
  // ---- Visiting ----
  {
    id: "service-times",
    title: "Service times",
    utterances: [
      "when is your service",
      "what time is service",
      "when do you meet",
      "what time does shabbat service start",
      "are you open saturday",
      "when is the next service",
      "what day do you worship",
      "service schedule",
    ],
    keywords: ["time", "times", "service", "schedule", "saturday", "when", "start", "meet", "hours"],
    response: `We gather every Shabbat (Saturday) at ${SITE_CONFIG.serviceTime}, with a children's service from 2:00 to 2:45 PM. ${SITE_CONFIG.address}.`,
    resolve: serviceTimesAnswer,
    quickReplies: ["Get directions", "What to expect", "Plan a visit"],
    boostOn: ["/shabbat", "/events"],
  },
  {
    id: "location",
    title: "Get directions",
    utterances: [
      "where are you located",
      "what is your address",
      "how do i get there",
      "where do you meet",
      "directions to the congregation",
      "is there parking",
      "where is the building",
    ],
    keywords: ["address", "location", "located", "directions", "where", "map", "parking", "houston", "little york"],
    response:
      `We meet at **${SITE_CONFIG.address}**.\n\n**[Get directions in Google Maps](${MAPS_URL})** — or see the map on our **[contact page](/contact)**.`,
    quickReplies: ["Service times", "Plan a visit"],
    boostOn: ["/contact"],
  },
  {
    id: "what-to-expect",
    title: "What to expect",
    utterances: [
      "what should i expect at a shabbat service",
      "what happens at a service",
      "what is the service like",
      "how long is the service",
      "what is a shabbat service",
      "first time visiting what happens",
      "what do you do during service",
    ],
    keywords: ["expect", "happens", "service", "first", "visit", "visiting", "order", "shofar", "worship", "fellowship"],
    response:
      "A Shabbat service with us includes:\n\n• **The shofar** calling the congregation to worship\n• **Praise** — songs of thanksgiving to YHVH\n• **The readings** — the week's Torah, Haftarah and Brit Chadashah portions\n• **Teaching** grounded in Scripture\n• **Prayer**\n• **Fellowship** — a shared meal afterwards\n\nWe aim for a reverent yet welcoming atmosphere. **[More about Shabbat](/shabbat)**",
    quickReplies: ["Service times", "Plan a visit", "Are children welcome?"],
    boostOn: ["/shabbat"],
  },
  {
    id: "children",
    title: "Are children welcome?",
    utterances: [
      "are children welcome",
      "can i bring my kids",
      "do you have a kids program",
      "is there childrens church",
      "do you have something for children",
      "is there a youth group",
    ],
    keywords: ["children", "kids", "child", "youth", "family", "families", "childrens", "son", "daughter"],
    response:
      "Yes! Children are an important part of our congregation — we believe in generational discipleship.\n\nThere's a **children's service from 2:00 to 2:45 PM**, right before the main 3:00 PM service.",
    quickReplies: ["Service times", "Plan a visit"],
    boostOn: ["/shabbat"],
  },
  {
    id: "jewish",
    title: "Do I need to be Jewish?",
    utterances: [
      "do i need to be jewish to attend",
      "can non jews come",
      "i am not jewish can i visit",
      "is this only for jewish people",
      "can gentiles attend",
      "i am a christian can i come",
    ],
    keywords: ["jewish", "jew", "gentile", "gentiles", "non", "christian", "convert", "background"],
    response:
      "Absolutely not. Our congregation welcomes people from all backgrounds and nations.\n\nWe believe that through faith in Yahshua, all believers are grafted into the commonwealth of Israel and share in the covenants and promises of YHVH.",
    quickReplies: ["What is a Messianic congregation?", "Plan a visit"],
  },
  {
    id: "livestream",
    title: "Watch online",
    utterances: [
      "do you livestream",
      "can i watch online",
      "is the service streamed",
      "where can i watch your teachings",
      "do you have a youtube channel",
      "where are the sermons",
      "can i watch past teachings",
    ],
    keywords: ["livestream", "live", "stream", "streaming", "online", "watch", "youtube", "video", "videos", "sermon", "sermons", "teachings", "recording"],
    response:
      `Yes — Shabbat services stream live on our **[YouTube channel](${YOUTUBE_CHANNEL_URL})**, and past teachings are there too. You can also browse them by topic on our **[Teachings page](/teachings)**.\n\nOn the **[Events page](/events)**, each Shabbat links to the teaching for that week's Torah portion.`,
    quickReplies: ["Service times", "This week's Torah portion"],
    boostOn: ["/events"],
  },

  // ---- Shabbat, Torah, appointed times ----
  {
    id: "torah-portion",
    title: "This week's Torah portion",
    utterances: [
      "what is this weeks torah portion",
      "what is the parasha this week",
      "what are we reading this shabbat",
      "what is the reading for saturday",
      "which portion are we on",
      "weekly torah reading",
    ],
    keywords: ["portion", "parasha", "parashah", "parsha", "reading", "readings", "torah", "haftarah", "week", "weekly"],
    response: "Each Shabbat we read a Torah portion, a Haftarah reading and a Brit Chadashah reading. See the full schedule on the Torah Portions page.",
    resolve: torahPortionAnswer,
    quickReplies: ["Watch online", "Service times"],
    boostOn: ["/resources/torah-portions", "/events"],
  },
  {
    id: "why-saturday",
    title: "Why Saturday?",
    utterances: [
      "why do you meet on saturday instead of sunday",
      "why saturday",
      "why not sunday",
      "what is the sabbath",
      "what is shabbat",
      "when does shabbat start",
    ],
    keywords: ["saturday", "sunday", "sabbath", "shabbat", "seventh", "day", "friday"],
    response:
      "We observe the biblical Shabbat (Sabbath), which begins on Friday evening and ends on Saturday evening.\n\nThe Shabbat was established by YHVH at creation and is one of the Ten Commandments. We honor this appointed time as an act of obedience and worship.",
    quickReplies: ["Service times", "What to expect"],
    boostOn: ["/shabbat"],
  },
  {
    id: "feasts",
    title: "Biblical feasts",
    utterances: [
      "do you celebrate christmas and easter",
      "what holidays do you keep",
      "do you celebrate passover",
      "what are the appointed times",
      "when is the next feast",
      "do you keep the feasts",
      "what are the moedim",
    ],
    keywords: ["christmas", "easter", "holiday", "holidays", "feast", "feasts", "passover", "pesach", "sukkot", "tabernacles", "shavuot", "pentecost", "trumpets", "atonement", "kippur", "moedim", "appointed"],
    response:
      "We observe the biblical appointed times (moedim) found in Leviticus 23:\n\n• Passover (Pesach)\n• Unleavened Bread\n• Firstfruits\n• Pentecost (Shavuot)\n• Feast of Trumpets (Yom Teruah)\n• Day of Atonement (Yom Kippur)\n• Tabernacles (Sukkot)\n\n**[See the Biblical Calendar](/resources/calendar)** for dates.",
    quickReplies: ["Why Saturday?", "Service times"],
    boostOn: ["/resources/calendar", "/events"],
  },
  {
    id: "events",
    title: "Upcoming events",
    utterances: [
      "what events are coming up",
      "do you have any events",
      "what is happening this month",
      "is there a calendar",
      "can i subscribe to your calendar",
      "do you have bible study",
      "do you have small groups",
    ],
    keywords: ["events", "event", "calendar", "upcoming", "happening", "subscribe", "study", "groups", "fellowship", "ministries"],
    response:
      "Every Shabbat is on our **[Events calendar](/events)** with that week's Torah portion — and you can **subscribe** so it lands in your own calendar app.\n\nStudy groups and other fellowships are coming soon; watch the **[Ministries page](/ministries)**.",
    quickReplies: ["Service times", "This week's Torah portion"],
    boostOn: ["/events", "/ministries"],
  },

  // ---- Beliefs (restated from the Statement of Faith and FAQ) ----
  {
    id: "messianic",
    title: "What is a Messianic congregation?",
    utterances: [
      "what is a messianic congregation",
      "what does messianic mean",
      "are you a church",
      "are you jewish or christian",
      "what denomination are you",
      "is this hebrew roots",
    ],
    keywords: ["messianic", "church", "denomination", "hebrew", "roots", "synagogue", "christian"],
    response:
      "A Messianic congregation is a community of believers who follow Yahshua (Jesus) as the Messiah while also honoring the Torah (the first five books of the Bible) and the biblical feasts.\n\nWe embrace both the Tanakh (Old Testament) and the Brit Chadashah (New Testament) as the inspired Word of YHVH.",
    quickReplies: ["What we believe", "Do I need to be Jewish?"],
    boostOn: ["/about", "/resources/faq"],
  },
  {
    id: "yhvh",
    title: "What does YHVH mean?",
    utterances: [
      "what does yhvh mean",
      "what is yhvh",
      "who is yahuah",
      "is yhvh the same as yahweh",
      "why do you say yhvh",
      "what is the tetragrammaton",
    ],
    keywords: ["yhvh", "yahuah", "yahweh", "name", "tetragrammaton", "jehovah", "god", "elohim"],
    response:
      "YHVH (often transliterated as Yahuah or Yahweh) represents the sacred name of the Creator as revealed in the Hebrew Scriptures.\n\nIt comes from the four Hebrew letters Yod-He-Vav-He and is sometimes called the Tetragrammaton.",
    quickReplies: ["Who is Yahshua?", "What we believe"],
  },
  {
    id: "yahshua",
    title: "Who is Yahshua?",
    utterances: [
      "who is yahshua",
      "do you believe in jesus",
      "is yahshua jesus",
      "do you believe jesus is the messiah",
      "what do you believe about jesus",
      "who is yeshua",
    ],
    keywords: ["yahshua", "yeshua", "yahusha", "jesus", "messiah", "christ", "son"],
    response:
      "Yes. We believe Yahshua (Jesus) is the promised Messiah of Israel, the Son of the living Elohim, born of a virgin, who lived a sinless life, died as an atoning sacrifice, rose from the dead, and ascended to the right hand of the Father.\n\n**[Read our Statement of Faith](/about/statement-of-faith)**",
    quickReplies: ["What we believe", "Salvation and the Torah"],
  },
  {
    id: "beliefs",
    title: "What we believe",
    utterances: [
      "what do you believe",
      "what is your statement of faith",
      "what are your beliefs",
      "what is your doctrine",
      "what do you teach",
    ],
    keywords: ["believe", "beliefs", "belief", "faith", "statement", "doctrine", "doctrinal", "teach", "theology"],
    response:
      "We are devoted to the Scriptures as the inspired Word of YHVH. We believe in Yahshua the Messiah, salvation by grace through faith, and a life transformed by obedience through the power of the Holy Spirit.\n\nRead more:\n• **[Statement of Faith](/about/statement-of-faith)**\n• **[What We Believe — 12 points](/about/what-we-believe)**\n• **[Core Values](/about/core-values)**",
    quickReplies: ["Who is Yahshua?", "Salvation and the Torah", "Vision & mission"],
    boostOn: ["/about"],
  },
  {
    id: "salvation-torah",
    title: "Salvation and the Torah",
    utterances: [
      "do i have to keep the law to be saved",
      "are you saved by keeping the torah",
      "why do you keep the torah",
      "is the law done away with",
      "how is someone saved",
      "are you legalistic",
      "do you keep the commandments",
    ],
    keywords: ["saved", "salvation", "law", "torah", "commandments", "grace", "works", "legalistic", "obedience", "covenant"],
    response:
      "We believe salvation is by grace through faith in Yahshua the Messiah alone — it cannot be earned by works.\n\nYet true saving faith produces repentance (teshuvah) and obedience to YHVH's commandments, not as a means of salvation, but as an expression of love, faithfulness and covenant identity.\n\n**[Read the 12 points of what we believe](/about/what-we-believe)**",
    quickReplies: ["What we believe", "Talk to someone"],
    boostOn: ["/about"],
  },
  {
    id: "israel",
    title: "Israel and the nations",
    utterances: [
      "what do you believe about israel",
      "do you support israel",
      "what does grafted in mean",
      "are believers part of israel",
    ],
    keywords: ["israel", "nations", "grafted", "jerusalem", "commonwealth"],
    response:
      "We believe Israel remains YHVH's chosen people. Through faith in Yahshua, believers from all nations are grafted into the commonwealth of Israel and become partakers of the covenants and promises.\n\nWe stand with Israel and pray for the peace of Jerusalem.",
    quickReplies: ["What we believe", "Do I need to be Jewish?"],
  },
  {
    id: "set-apart",
    title: "Kosher and set-apart living",
    utterances: [
      "do you eat kosher",
      "do i have to eat kosher",
      "what are the food laws",
      "do you eat pork",
      "what does set apart mean",
    ],
    keywords: ["kosher", "clean", "food", "eat", "eating", "pork", "diet", "set", "apart", "holy", "modesty"],
    response:
      "We observe the biblical appointed times and set-apart practices such as clean eating (kosher), as acts of worship and covenant identity.\n\nWe pursue lives that reflect YHVH's character in speech, conduct, relationships and worship.\n\nIf you're exploring what this looks like day to day, the best next step is a conversation with someone from the congregation.",
    quickReplies: ["Talk to someone", "What we believe"],
  },
  {
    id: "vision-mission",
    title: "Vision & mission",
    utterances: [
      "what is your mission",
      "what is your vision",
      "what is your purpose",
      "what are your core values",
      "what are you about",
    ],
    keywords: ["mission", "vision", "purpose", "values", "core", "goal"],
    response:
      "**Our mission** is to make disciples, equip them with the Word of YHVH, strengthen families in righteous living, and raise the next generation to walk faithfully in obedience to His commandments through faith in Yahshua the Messiah.\n\n**[Vision & Mission](/about/vision-mission)** · **[Core Values](/about/core-values)**",
    quickReplies: ["What we believe", "Plan a visit"],
    boostOn: ["/about"],
  },
  {
    id: "leadership",
    title: "Our leadership",
    utterances: [
      "who is the pastor",
      "who leads the congregation",
      "who is your rabbi",
      "who is in charge",
      "can i meet the pastor",
      "who is on your team",
    ],
    keywords: ["pastor", "rabbi", "leader", "leaders", "leadership", "team", "elder", "elders", "frank"],
    response:
      "The congregation is led by **Pastor Frank**. You can meet him and the rest of the team on Shabbat.\n\n**[Meet our team](/about/our-team)** — or I can pass a message along.",
    quickReplies: ["Talk to someone", "Plan a visit"],
    boostOn: ["/about"],
  },

  // ---- Giving, contact, getting involved ----
  {
    id: "give",
    title: "How to give",
    utterances: [
      "how can i give",
      "can i donate online",
      "how do i tithe",
      "where do i send an offering",
      "can i give by mail",
      "do you accept donations",
    ],
    keywords: ["give", "giving", "donate", "donation", "donations", "tithe", "tithes", "offering", "offerings", "support", "money"],
    response:
      `Thank you for your heart to give. 🙏 We give freewill offerings, joyfully and from the heart, never out of necessity.\n\nOnline giving is **coming soon**. For now you can give **in person** on Shabbat, or **by mail** to ${SITE_CONFIG.address}.\n\n**[More on giving](/give)**`,
    quickReplies: ["Get involved", "Service times"],
    boostOn: ["/give"],
  },
  {
    id: "contact",
    title: "Contact the congregation",
    utterances: [
      "how do i contact you",
      "what is your phone number",
      "what is your email",
      "how can i reach someone",
    ],
    keywords: ["contact", "phone", "call", "email", "reach", "number", "message"],
    response:
      `The best way to reach us is email: 📧 **[${SITE_CONFIG.email}](mailto:${SITE_CONFIG.email})**\n\nOr use the **[contact page](/contact)** — or I can pass a message along right here.`,
    quickReplies: ["Talk to someone", "Get directions"],
    boostOn: ["/contact"],
  },
  {
    id: "get-involved",
    title: "Get involved",
    utterances: [
      "how can i get involved",
      "how do i become a member",
      "can i volunteer",
      "how can i serve",
      "how do i join",
    ],
    keywords: ["involved", "member", "membership", "volunteer", "serve", "join", "help", "ministry"],
    response:
      "The best way to get involved is to join us for a Shabbat service. From there, you can connect with our leadership about ways to serve within the community.\n\nYou can also give your time and talents, and partner with us in prayer.",
    quickReplies: ["Plan a visit", "Talk to someone"],
    boostOn: ["/ministries", "/give"],
  },
  {
    id: "plan-visit",
    title: "Plan a visit",
    utterances: [
      "i'd like to plan a visit",
      "i want to plan a visit",
      "i want to visit",
      "can i come visit",
      "i'm thinking of visiting",
      "i would like to come this saturday",
      "first time visiting",
    ],
    keywords: ["plan", "visit", "visiting", "come", "attend"],
    response: "We'd love to have you! 🕯️ Tap below and I'll let the congregation know you're coming.",
    quickReplies: ["Plan a visit", "What to expect", "Service times"],
  },
  {
    id: "prayer",
    title: "Share a prayer request",
    utterances: [
      "can you pray for me",
      "i need prayer",
      "i have a prayer request",
      "please pray for my family",
      "how do i submit a prayer request",
      "can someone pray with me",
    ],
    keywords: ["pray", "prayer", "prayers", "praying", "request", "sick", "healing", "hurting"],
    response:
      "I'd be honored to pass a prayer request along to the congregation. 🙏 Tap below to share it.",
    quickReplies: ["Share a prayer request", "Talk to someone"],
  },

  // ---- About the bot ----
  {
    id: "bot-identity",
    title: "About this assistant",
    utterances: [
      "are you a bot",
      "am i talking to a computer",
      "is this automated",
      "are you ai",
      "can i talk to a real person",
    ],
    keywords: ["bot", "robot", "ai", "automated", "computer", "assistant"],
    response:
      "I'm a simple assistant for the Congregation of YHVH website — I answer common questions using what's on this site.\n\nFor anything pastoral or personal, I'll pass your message to a real person.",
    quickReplies: ["Talk to someone", "Service times"],
  },
  {
    id: "privacy",
    title: "Is this private?",
    utterances: [
      "is this private",
      "who sees what i type",
      "do you store my messages",
      "is this chat recorded",
      "where does my information go",
    ],
    keywords: ["private", "privacy", "store", "stored", "recorded", "information", "data", "confidential"],
    response:
      "This assistant runs in your browser. Nothing you type here is sent anywhere **unless you choose to send it** — a prayer request, a visit, or a message for someone.\n\nWhen you do, it's emailed to the congregation's inbox so someone can respond.",
    quickReplies: ["Share a prayer request", "Talk to someone"],
  },
  {
    id: "frustrated",
    title: "Something's not working",
    utterances: [
      "this is not helpful",
      "you are not understanding me",
      "that is not what i asked",
      "this is useless",
      "you are wrong",
      "that did not answer my question",
    ],
    keywords: ["unhelpful", "useless", "wrong", "frustrating", "understand"],
    response:
      "I'm sorry — I'm a simple assistant and I missed that one. Let me get your question to a real person instead.",
    quickReplies: ["Talk to someone", "Contact the congregation"],
  },
];

/** Randomized fallback responses — varied wording reads less robotic. */
export const fallbackResponses: { response: string; quickReplies: string[] }[] = [
  {
    response:
      "I don't have a good answer for that one — but someone from the congregation will.\n\nWant me to pass your question along? Or try one of these:",
    quickReplies: ["Talk to someone", "Service times", "What we believe"],
  },
  {
    response:
      "That's outside what I know, and I'd rather not guess. 🙏\n\nI can send your question to the congregation — or one of these might help:",
    quickReplies: ["Talk to someone", "What to expect", "Watch online"],
  },
  {
    response:
      "Good question — it deserves a real answer from a real person.\n\nMeanwhile, here's what I *can* help with:",
    quickReplies: ["Talk to someone", "Service times", "Plan a visit"],
  },
];
