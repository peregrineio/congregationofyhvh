// Torah Portions Utilities
// Helper functions for Torah portion date calculations and categorization

export type TorahBook = 'genesis' | 'exodus' | 'leviticus' | 'numbers' | 'deuteronomy';

export interface TorahPortionWithDate {
  number: number;
  name: string;
  hebrewName: string;
  torahReading: string;
  haftarah: string;
  britChadashah: string;
  book: TorahBook;
  date: string; // e.g., "17 OCT 2025"
  combined?: boolean; // true for combined portions like Vayakhel-Pekudei
}

// Torah portion dates for the 5786 cycle (2025-2026)
const PORTIONS_5786: TorahPortionWithDate[] = [
  // GENESIS (Oct-Dec 2025) - Portions 1-12
  { number: 1, name: "In the Beginning", hebrewName: "Beresheet", torahReading: "Genesis 1:1–6:8", haftarah: "Isaiah 42:5–43:10", britChadashah: "John 1:1–18", book: "genesis", date: "18 OCT 2025" },
  { number: 2, name: "Noah", hebrewName: "Noach", torahReading: "Genesis 6:9–11:32", haftarah: "Isaiah 54:1–55:5", britChadashah: "Matthew 24:36–46", book: "genesis", date: "25 OCT 2025" },
  { number: 3, name: "Go Forth", hebrewName: "Lech Lecha", torahReading: "Genesis 12:1–17:27", haftarah: "Isaiah 40:27–41:16", britChadashah: "Romans 4:1–25", book: "genesis", date: "1 NOV 2025" },
  { number: 4, name: "He Appeared", hebrewName: "Vayera", torahReading: "Genesis 18:1–22:24", haftarah: "2 Kings 4:1–37", britChadashah: "Luke 1:26–38", book: "genesis", date: "8 NOV 2025" },
  { number: 5, name: "Life of Sarah", hebrewName: "Chayei Sarah", torahReading: "Genesis 23:1–25:18", haftarah: "1 Kings 1:1–31", britChadashah: "Matthew 8:19–22", book: "genesis", date: "15 NOV 2025" },
  { number: 6, name: "Generations", hebrewName: "Toldot", torahReading: "Genesis 25:19–28:9", haftarah: "Malachi 1:1–2:7", britChadashah: "Romans 9:6–16", book: "genesis", date: "22 NOV 2025" },
  { number: 7, name: "He Went Out", hebrewName: "Vayetze", torahReading: "Genesis 28:10–32:3", haftarah: "Hosea 12:13–14:10", britChadashah: "John 1:43–51", book: "genesis", date: "29 NOV 2025" },
  { number: 8, name: "He Sent", hebrewName: "Vayishlach", torahReading: "Genesis 32:4–36:43", haftarah: "Obadiah 1:1–21", britChadashah: "Hebrews 11:11–20", book: "genesis", date: "6 DEC 2025" },
  { number: 9, name: "He Settled", hebrewName: "Vayeshev", torahReading: "Genesis 37:1–40:23", haftarah: "Amos 2:6–3:8", britChadashah: "Acts 7:9–16", book: "genesis", date: "13 DEC 2025" },
  { number: 10, name: "At the End", hebrewName: "Miketz", torahReading: "Genesis 41:1–44:17", haftarah: "1 Kings 3:15–4:1", britChadashah: "Luke 4:16–30", book: "genesis", date: "20 DEC 2025" },
  { number: 11, name: "He Approached", hebrewName: "Vayigash", torahReading: "Genesis 44:18–47:27", haftarah: "Ezekiel 37:15–28", britChadashah: "Ephesians 2:1–22", book: "genesis", date: "27 DEC 2025" },
  { number: 12, name: "He Lived", hebrewName: "Vayechi", torahReading: "Genesis 47:28–50:26", haftarah: "1 Kings 2:1–12", britChadashah: "1 Peter 1:3–9", book: "genesis", date: "3 JAN 2026" },

  // EXODUS (Jan-Mar 2026) - Portions 13-23
  { number: 13, name: "Names", hebrewName: "Shemot", torahReading: "Exodus 1:1–6:1", haftarah: "Isaiah 27:6–28:13", britChadashah: "Acts 7:17–35", book: "exodus", date: "10 JAN 2026" },
  { number: 14, name: "I Appeared", hebrewName: "Va'eira", torahReading: "Exodus 6:2–9:35", haftarah: "Ezekiel 28:25–29:21", britChadashah: "Revelation 15:1–8", book: "exodus", date: "17 JAN 2026" },
  { number: 15, name: "Go/Come", hebrewName: "Bo", torahReading: "Exodus 10:1–13:16", haftarah: "Jeremiah 46:13–28", britChadashah: "Luke 22:7–20", book: "exodus", date: "24 JAN 2026" },
  { number: 16, name: "When He Sent", hebrewName: "Beshalach", torahReading: "Exodus 13:17–17:16", haftarah: "Judges 4:4–5:31", britChadashah: "John 6:22–40", book: "exodus", date: "31 JAN 2026" },
  { number: 17, name: "He Heard", hebrewName: "Yitro", torahReading: "Exodus 18:1–20:23", haftarah: "Isaiah 6:1–7:6", britChadashah: "Matthew 5:17–20", book: "exodus", date: "7 FEB 2026" },
  { number: 18, name: "Judgments", hebrewName: "Mishpatim", torahReading: "Exodus 21:1–24:18", haftarah: "Jeremiah 34:8–22", britChadashah: "Hebrews 9:15–22", book: "exodus", date: "14 FEB 2026" },
  { number: 19, name: "Contribution", hebrewName: "Terumah", torahReading: "Exodus 25:1–27:19", haftarah: "1 Kings 5:12–6:13", britChadashah: "2 Corinthians 9:1–15", book: "exodus", date: "21 FEB 2026" },
  { number: 20, name: "You Shall Command", hebrewName: "Tetzaveh", torahReading: "Exodus 27:20–30:10", haftarah: "Ezekiel 43:10–27", britChadashah: "Hebrews 13:10–16", book: "exodus", date: "28 FEB 2026" },
  { number: 21, name: "When You Take", hebrewName: "Ki Tisa", torahReading: "Exodus 30:11–34:35", haftarah: "1 Kings 18:1–39", britChadashah: "2 Corinthians 3:1–18", book: "exodus", date: "7 MAR 2026" },
  { number: 22, name: "He Assembled / Accounts", hebrewName: "Vayakhel-Pekudei", torahReading: "Exodus 35:1–40:38", haftarah: "1 Kings 7:40–8:21", britChadashah: "Hebrews 9:1–14", book: "exodus", date: "14 MAR 2026", combined: true },

  // LEVITICUS (Mar-May 2026) - Portions 24-33
  { number: 23, name: "He Called", hebrewName: "Vayikra", torahReading: "Leviticus 1:1–5:26", haftarah: "Isaiah 43:21–44:23", britChadashah: "Hebrews 10:1–18", book: "leviticus", date: "21 MAR 2026" },
  { number: 24, name: "Command", hebrewName: "Tzav", torahReading: "Leviticus 6:1–8:36", haftarah: "Jeremiah 7:21–8:3", britChadashah: "Hebrews 7:23–28", book: "leviticus", date: "28 MAR 2026" },
  { number: 25, name: "Eighth", hebrewName: "Shemini", torahReading: "Leviticus 9:1–11:47", haftarah: "2 Samuel 6:1–7:17", britChadashah: "Acts 10:1–35", book: "leviticus", date: "11 APR 2026" },
  { number: 26, name: "She Conceives / Infected", hebrewName: "Tazria-Metzora", torahReading: "Leviticus 12:1–15:33", haftarah: "2 Kings 4:42–5:19", britChadashah: "Luke 5:12–16", book: "leviticus", date: "18 APR 2026", combined: true },
  { number: 27, name: "After Death / Holy", hebrewName: "Acharei Mot-Kedoshim", torahReading: "Leviticus 16:1–20:27", haftarah: "Amos 9:7–15", britChadashah: "1 Peter 1:13–21", book: "leviticus", date: "25 APR 2026", combined: true },
  { number: 28, name: "Say", hebrewName: "Emor", torahReading: "Leviticus 21:1–24:23", haftarah: "Ezekiel 44:15–31", britChadashah: "Luke 14:12–24", book: "leviticus", date: "2 MAY 2026" },
  { number: 29, name: "On the Mount / In My Statutes", hebrewName: "Behar-Bechukotai", torahReading: "Leviticus 25:1–27:34", haftarah: "Jeremiah 16:19–17:14", britChadashah: "John 14:15–21", book: "leviticus", date: "9 MAY 2026", combined: true },

  // NUMBERS (May-Jul 2026) - Portions 34-43
  { number: 30, name: "In the Wilderness", hebrewName: "Bamidbar", torahReading: "Numbers 1:1–4:20", haftarah: "Hosea 2:1–22", britChadashah: "Romans 9:22–33", book: "numbers", date: "16 MAY 2026" },
  { number: 31, name: "Take Up", hebrewName: "Naso", torahReading: "Numbers 4:21–7:89", haftarah: "Judges 13:2–25", britChadashah: "Acts 21:17–26", book: "numbers", date: "30 MAY 2026" },
  { number: 32, name: "When You Set Up", hebrewName: "Beha'alotcha", torahReading: "Numbers 8:1–12:16", haftarah: "Zechariah 2:14–4:7", britChadashah: "John 6:1–14", book: "numbers", date: "6 JUN 2026" },
  { number: 33, name: "Send for Yourself", hebrewName: "Shelach", torahReading: "Numbers 13:1–15:41", haftarah: "Joshua 2:1–24", britChadashah: "Hebrews 3:7–19", book: "numbers", date: "13 JUN 2026" },
  { number: 34, name: "Korach", hebrewName: "Korach", torahReading: "Numbers 16:1–18:32", haftarah: "1 Samuel 11:14–12:22", britChadashah: "Jude 1:1–25", book: "numbers", date: "20 JUN 2026" },
  { number: 35, name: "Statute / Balak", hebrewName: "Chukat-Balak", torahReading: "Numbers 19:1–25:9", haftarah: "Micah 5:6–6:8", britChadashah: "John 3:10–21", book: "numbers", date: "27 JUN 2026", combined: true },
  { number: 36, name: "Phinehas", hebrewName: "Pinchas", torahReading: "Numbers 25:10–30:1", haftarah: "1 Kings 18:46–19:21", britChadashah: "John 2:13–22", book: "numbers", date: "4 JUL 2026" },
  { number: 37, name: "Tribes / Journeys", hebrewName: "Matot-Masei", torahReading: "Numbers 30:2–36:13", haftarah: "Jeremiah 2:4–2:28", britChadashah: "James 4:1–12", book: "numbers", date: "11 JUL 2026", combined: true },

  // DEUTERONOMY (Jul-Oct 2026) - Portions 44-54
  { number: 38, name: "Words", hebrewName: "Devarim", torahReading: "Deuteronomy 1:1–3:22", haftarah: "Isaiah 1:1–27", britChadashah: "Acts 9:1–21", book: "deuteronomy", date: "18 JUL 2026" },
  { number: 39, name: "I Pleaded", hebrewName: "Va'etchanan", torahReading: "Deuteronomy 3:23–7:11", haftarah: "Isaiah 40:1–26", britChadashah: "Matthew 23:31–39", book: "deuteronomy", date: "25 JUL 2026" },
  { number: 40, name: "Because", hebrewName: "Eikev", torahReading: "Deuteronomy 7:12–11:25", haftarah: "Isaiah 49:14–51:3", britChadashah: "Hebrews 11:8–16", book: "deuteronomy", date: "1 AUG 2026" },
  { number: 41, name: "See", hebrewName: "Re'eh", torahReading: "Deuteronomy 11:26–16:17", haftarah: "Isaiah 54:11–55:5", britChadashah: "1 John 4:1–6", book: "deuteronomy", date: "8 AUG 2026" },
  { number: 42, name: "Judges", hebrewName: "Shoftim", torahReading: "Deuteronomy 16:18–21:9", haftarah: "Isaiah 51:12–52:12", britChadashah: "Matthew 5:38–42", book: "deuteronomy", date: "15 AUG 2026" },
  { number: 43, name: "When You Go Out", hebrewName: "Ki Teitzei", torahReading: "Deuteronomy 21:10–25:19", haftarah: "Isaiah 54:1–10", britChadashah: "1 Corinthians 5:1–5", book: "deuteronomy", date: "22 AUG 2026" },
  { number: 44, name: "When You Come In", hebrewName: "Ki Tavo", torahReading: "Deuteronomy 26:1–29:8", haftarah: "Isaiah 60:1–22", britChadashah: "Luke 24:44–53", book: "deuteronomy", date: "29 AUG 2026" },
  { number: 45, name: "You Stand / He Went", hebrewName: "Nitzavim-Vayelech", torahReading: "Deuteronomy 29:9–31:30", haftarah: "Isaiah 61:10–63:9", britChadashah: "Romans 9:30–10:13", book: "deuteronomy", date: "5 SEP 2026", combined: true },
  { number: 46, name: "Give Ear", hebrewName: "Ha'azinu", torahReading: "Deuteronomy 32:1–52", haftarah: "2 Samuel 22:1–51", britChadashah: "Romans 10:14–21", book: "deuteronomy", date: "19 SEP 2026" },
  { number: 47, name: "The Blessing", hebrewName: "V'Zot HaBerachah", torahReading: "Deuteronomy 33:1–34:12", haftarah: "Joshua 1:1–18", britChadashah: "Revelation 22:1–5", book: "deuteronomy", date: "4 OCT 2026" },
];

// Torah portion dates for the 5787 cycle (2026-2027), Diaspora schedule per
// Hebcal. 5787 is a leap year, so Vayakhel/Pekudei, Tazria/Metzora, Acharei
// Mot/Kedoshim and Behar/Bechukotai are read on separate weeks. Numbers here
// are each portion's place among the 54 (a combined reading takes the number
// of its first half).
const PORTIONS_5787: TorahPortionWithDate[] = [
  // GENESIS (Oct-Dec 2026)
  { number: 1, name: "In the Beginning", hebrewName: "Beresheet", torahReading: "Genesis 1:1–6:8", haftarah: "Isaiah 42:5–43:10", britChadashah: "John 1:1–18", book: "genesis", date: "10 OCT 2026" },
  { number: 2, name: "Noah", hebrewName: "Noach", torahReading: "Genesis 6:9–11:32", haftarah: "Isaiah 54:1–55:5", britChadashah: "Matthew 24:36–46", book: "genesis", date: "17 OCT 2026" },
  { number: 3, name: "Go Forth", hebrewName: "Lech Lecha", torahReading: "Genesis 12:1–17:27", haftarah: "Isaiah 40:27–41:16", britChadashah: "Romans 4:1–25", book: "genesis", date: "24 OCT 2026" },
  { number: 4, name: "He Appeared", hebrewName: "Vayera", torahReading: "Genesis 18:1–22:24", haftarah: "2 Kings 4:1–37", britChadashah: "Luke 1:26–38", book: "genesis", date: "31 OCT 2026" },
  { number: 5, name: "Life of Sarah", hebrewName: "Chayei Sarah", torahReading: "Genesis 23:1–25:18", haftarah: "1 Kings 1:1–31", britChadashah: "Matthew 8:19–22", book: "genesis", date: "7 NOV 2026" },
  { number: 6, name: "Generations", hebrewName: "Toldot", torahReading: "Genesis 25:19–28:9", haftarah: "Malachi 1:1–2:7", britChadashah: "Romans 9:6–16", book: "genesis", date: "14 NOV 2026" },
  { number: 7, name: "He Went Out", hebrewName: "Vayetze", torahReading: "Genesis 28:10–32:3", haftarah: "Hosea 12:13–14:10", britChadashah: "John 1:43–51", book: "genesis", date: "21 NOV 2026" },
  { number: 8, name: "He Sent", hebrewName: "Vayishlach", torahReading: "Genesis 32:4–36:43", haftarah: "Obadiah 1:1–21", britChadashah: "Hebrews 11:11–20", book: "genesis", date: "28 NOV 2026" },
  { number: 9, name: "He Settled", hebrewName: "Vayeshev", torahReading: "Genesis 37:1–40:23", haftarah: "Amos 2:6–3:8", britChadashah: "Acts 7:9–16", book: "genesis", date: "5 DEC 2026" },
  { number: 10, name: "At the End", hebrewName: "Miketz", torahReading: "Genesis 41:1–44:17", haftarah: "1 Kings 3:15–4:1", britChadashah: "Luke 4:16–30", book: "genesis", date: "12 DEC 2026" },
  { number: 11, name: "He Approached", hebrewName: "Vayigash", torahReading: "Genesis 44:18–47:27", haftarah: "Ezekiel 37:15–28", britChadashah: "Ephesians 2:1–22", book: "genesis", date: "19 DEC 2026" },
  { number: 12, name: "He Lived", hebrewName: "Vayechi", torahReading: "Genesis 47:28–50:26", haftarah: "1 Kings 2:1–12", britChadashah: "1 Peter 1:3–9", book: "genesis", date: "26 DEC 2026" },

  // EXODUS (Jan-Mar 2027)
  { number: 13, name: "Names", hebrewName: "Shemot", torahReading: "Exodus 1:1–6:1", haftarah: "Isaiah 27:6–28:13", britChadashah: "Acts 7:17–35", book: "exodus", date: "2 JAN 2027" },
  { number: 14, name: "I Appeared", hebrewName: "Va'eira", torahReading: "Exodus 6:2–9:35", haftarah: "Ezekiel 28:25–29:21", britChadashah: "Revelation 15:1–8", book: "exodus", date: "9 JAN 2027" },
  { number: 15, name: "Go/Come", hebrewName: "Bo", torahReading: "Exodus 10:1–13:16", haftarah: "Jeremiah 46:13–28", britChadashah: "Luke 22:7–20", book: "exodus", date: "16 JAN 2027" },
  { number: 16, name: "When He Sent", hebrewName: "Beshalach", torahReading: "Exodus 13:17–17:16", haftarah: "Judges 4:4–5:31", britChadashah: "John 6:22–40", book: "exodus", date: "23 JAN 2027" },
  { number: 17, name: "He Heard", hebrewName: "Yitro", torahReading: "Exodus 18:1–20:23", haftarah: "Isaiah 6:1–7:6", britChadashah: "Matthew 5:17–20", book: "exodus", date: "30 JAN 2027" },
  { number: 18, name: "Judgments", hebrewName: "Mishpatim", torahReading: "Exodus 21:1–24:18", haftarah: "Jeremiah 34:8–22", britChadashah: "Hebrews 9:15–22", book: "exodus", date: "6 FEB 2027" },
  { number: 19, name: "Contribution", hebrewName: "Terumah", torahReading: "Exodus 25:1–27:19", haftarah: "1 Kings 5:12–6:13", britChadashah: "2 Corinthians 9:1–15", book: "exodus", date: "13 FEB 2027" },
  { number: 20, name: "You Shall Command", hebrewName: "Tetzaveh", torahReading: "Exodus 27:20–30:10", haftarah: "Ezekiel 43:10–27", britChadashah: "Hebrews 13:10–16", book: "exodus", date: "20 FEB 2027" },
  { number: 21, name: "When You Take", hebrewName: "Ki Tisa", torahReading: "Exodus 30:11–34:35", haftarah: "1 Kings 18:1–39", britChadashah: "2 Corinthians 3:1–18", book: "exodus", date: "27 FEB 2027" },
  { number: 22, name: "He Assembled", hebrewName: "Vayakhel", torahReading: "Exodus 35:1–38:20", haftarah: "1 Kings 7:40–50", britChadashah: "Hebrews 9:1–14", book: "exodus", date: "6 MAR 2027" },
  { number: 23, name: "Accounts", hebrewName: "Pekudei", torahReading: "Exodus 38:21–40:38", haftarah: "1 Kings 7:51–8:21", britChadashah: "Revelation 15:5–8", book: "exodus", date: "13 MAR 2027" },

  // LEVITICUS (Mar-May 2027)
  { number: 24, name: "He Called", hebrewName: "Vayikra", torahReading: "Leviticus 1:1–5:26", haftarah: "Isaiah 43:21–44:23", britChadashah: "Hebrews 10:1–18", book: "leviticus", date: "20 MAR 2027" },
  { number: 25, name: "Command", hebrewName: "Tzav", torahReading: "Leviticus 6:1–8:36", haftarah: "Jeremiah 7:21–8:3", britChadashah: "Hebrews 7:23–28", book: "leviticus", date: "27 MAR 2027" },
  { number: 26, name: "Eighth", hebrewName: "Shemini", torahReading: "Leviticus 9:1–11:47", haftarah: "2 Samuel 6:1–7:17", britChadashah: "Acts 10:1–35", book: "leviticus", date: "3 APR 2027" },
  { number: 27, name: "She Conceives", hebrewName: "Tazria", torahReading: "Leviticus 12:1–13:59", haftarah: "2 Kings 4:42–5:19", britChadashah: "Luke 5:12–16", book: "leviticus", date: "10 APR 2027" },
  { number: 28, name: "Infected One", hebrewName: "Metzora", torahReading: "Leviticus 14:1–15:33", haftarah: "2 Kings 7:3–20", britChadashah: "Matthew 9:20–26", book: "leviticus", date: "17 APR 2027" },
  { number: 29, name: "After the Death", hebrewName: "Acharei Mot", torahReading: "Leviticus 16:1–18:30", haftarah: "Ezekiel 22:1–19", britChadashah: "Hebrews 9:11–28", book: "leviticus", date: "1 MAY 2027" },
  { number: 30, name: "Holy", hebrewName: "Kedoshim", torahReading: "Leviticus 19:1–20:27", haftarah: "Amos 9:7–15", britChadashah: "1 Peter 1:13–21", book: "leviticus", date: "8 MAY 2027" },
  { number: 31, name: "Say", hebrewName: "Emor", torahReading: "Leviticus 21:1–24:23", haftarah: "Ezekiel 44:15–31", britChadashah: "Luke 14:12–24", book: "leviticus", date: "15 MAY 2027" },
  { number: 32, name: "On the Mount", hebrewName: "Behar", torahReading: "Leviticus 25:1–26:2", haftarah: "Jeremiah 32:6–27", britChadashah: "Luke 4:16–21", book: "leviticus", date: "22 MAY 2027" },
  { number: 33, name: "In My Statutes", hebrewName: "Bechukotai", torahReading: "Leviticus 26:3–27:34", haftarah: "Jeremiah 16:19–17:14", britChadashah: "John 14:15–21", book: "leviticus", date: "29 MAY 2027" },

  // NUMBERS (Jun-Jul 2027)
  { number: 34, name: "In the Wilderness", hebrewName: "Bamidbar", torahReading: "Numbers 1:1–4:20", haftarah: "Hosea 2:1–22", britChadashah: "Romans 9:22–33", book: "numbers", date: "5 JUN 2027" },
  { number: 35, name: "Take Up", hebrewName: "Naso", torahReading: "Numbers 4:21–7:89", haftarah: "Judges 13:2–25", britChadashah: "Acts 21:17–26", book: "numbers", date: "19 JUN 2027" },
  { number: 36, name: "When You Set Up", hebrewName: "Beha'alotcha", torahReading: "Numbers 8:1–12:16", haftarah: "Zechariah 2:14–4:7", britChadashah: "John 6:1–14", book: "numbers", date: "26 JUN 2027" },
  { number: 37, name: "Send for Yourself", hebrewName: "Shelach", torahReading: "Numbers 13:1–15:41", haftarah: "Joshua 2:1–24", britChadashah: "Hebrews 3:7–19", book: "numbers", date: "3 JUL 2027" },
  { number: 38, name: "Korach", hebrewName: "Korach", torahReading: "Numbers 16:1–18:32", haftarah: "1 Samuel 11:14–12:22", britChadashah: "Jude 1:1–25", book: "numbers", date: "10 JUL 2027" },
  { number: 39, name: "Statute / Balak", hebrewName: "Chukat-Balak", torahReading: "Numbers 19:1–25:9", haftarah: "Micah 5:6–6:8", britChadashah: "John 3:10–21", book: "numbers", date: "17 JUL 2027", combined: true },
  { number: 41, name: "Phinehas", hebrewName: "Pinchas", torahReading: "Numbers 25:10–30:1", haftarah: "1 Kings 18:46–19:21", britChadashah: "John 2:13–22", book: "numbers", date: "24 JUL 2027" },
  { number: 42, name: "Tribes / Journeys", hebrewName: "Matot-Masei", torahReading: "Numbers 30:2–36:13", haftarah: "Jeremiah 2:4–2:28", britChadashah: "James 4:1–12", book: "numbers", date: "31 JUL 2027", combined: true },

  // DEUTERONOMY (Aug-Oct 2027)
  { number: 44, name: "Words", hebrewName: "Devarim", torahReading: "Deuteronomy 1:1–3:22", haftarah: "Isaiah 1:1–27", britChadashah: "Acts 9:1–21", book: "deuteronomy", date: "7 AUG 2027" },
  { number: 45, name: "I Pleaded", hebrewName: "Va'etchanan", torahReading: "Deuteronomy 3:23–7:11", haftarah: "Isaiah 40:1–26", britChadashah: "Matthew 23:31–39", book: "deuteronomy", date: "14 AUG 2027" },
  { number: 46, name: "Because", hebrewName: "Eikev", torahReading: "Deuteronomy 7:12–11:25", haftarah: "Isaiah 49:14–51:3", britChadashah: "Hebrews 11:8–16", book: "deuteronomy", date: "21 AUG 2027" },
  { number: 47, name: "See", hebrewName: "Re'eh", torahReading: "Deuteronomy 11:26–16:17", haftarah: "Isaiah 54:11–55:5", britChadashah: "1 John 4:1–6", book: "deuteronomy", date: "28 AUG 2027" },
  { number: 48, name: "Judges", hebrewName: "Shoftim", torahReading: "Deuteronomy 16:18–21:9", haftarah: "Isaiah 51:12–52:12", britChadashah: "Matthew 5:38–42", book: "deuteronomy", date: "4 SEP 2027" },
  { number: 49, name: "When You Go Out", hebrewName: "Ki Teitzei", torahReading: "Deuteronomy 21:10–25:19", haftarah: "Isaiah 54:1–10", britChadashah: "1 Corinthians 5:1–5", book: "deuteronomy", date: "11 SEP 2027" },
  { number: 50, name: "When You Come In", hebrewName: "Ki Tavo", torahReading: "Deuteronomy 26:1–29:8", haftarah: "Isaiah 60:1–22", britChadashah: "Luke 24:44–53", book: "deuteronomy", date: "18 SEP 2027" },
  { number: 51, name: "You Stand / He Went", hebrewName: "Nitzavim-Vayelech", torahReading: "Deuteronomy 29:9–31:30", haftarah: "Isaiah 61:10–63:9", britChadashah: "Romans 9:30–10:13", book: "deuteronomy", date: "25 SEP 2027", combined: true },
  { number: 53, name: "Give Ear", hebrewName: "Ha'azinu", torahReading: "Deuteronomy 32:1–52", haftarah: "2 Samuel 22:1–51", britChadashah: "Romans 10:14–21", book: "deuteronomy", date: "9 OCT 2027" },
  { number: 54, name: "The Blessing", hebrewName: "V'Zot HaBerachah", torahReading: "Deuteronomy 33:1–34:12", haftarah: "Joshua 1:1–18", britChadashah: "Revelation 22:1–5", book: "deuteronomy", date: "24 OCT 2027" },
];

/** Each annual cycle, oldest first. Add the next year here when it is published. */
export const TORAH_CYCLES: { year: number; portions: TorahPortionWithDate[] }[] = [
  { year: 5786, portions: PORTIONS_5786 },
  { year: 5787, portions: PORTIONS_5787 },
];

/** The congregation's time zone. "Today" is always the calendar date here,
 *  not on the server (Vercel runs in UTC, which rolled the week over at
 *  7 PM CDT on Saturday). */
export const CONGREGATION_TIME_ZONE = 'America/Chicago';

/**
 * Today's date in Houston, as a Date at local midnight -- the same shape
 * parsePortionDate returns, so the two compare directly. Changeover is at
 * local midnight; there is no sunset logic.
 */
export function chicagoToday(now: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: CONGREGATION_TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(now);
  const get = (type: string) =>
    parseInt(parts.find(part => part.type === type)?.value ?? '', 10);
  return new Date(get('year'), get('month') - 1, get('day'));
}

/**
 * Every dated portion across all cycles, in reading order. Hebrew names repeat
 * once per cycle, so look a portion up with getPortionByHebrewName (which picks
 * the nearest reading) rather than a bare .find on the name.
 */
export const TORAH_PORTIONS_WITH_DATES: TorahPortionWithDate[] = TORAH_CYCLES.flatMap(
  cycle => cycle.portions,
);

/**
 * "This week's" portion: the reading for the upcoming Shabbat, i.e. the first
 * reading on or after `today` (on Shabbat itself, that day's). Every page that
 * says "this week" uses this, so home, /shabbat, /resources and /events agree
 * midweek. After the last dated reading it stays on that last one.
 */
export function getCurrentPortionEntry(today: Date = chicagoToday()): TorahPortionWithDate {
  return (
    getNextPortion(today) ??
    TORAH_PORTIONS_WITH_DATES[TORAH_PORTIONS_WITH_DATES.length - 1]
  );
}

/**
 * Get the current Torah portion based on today's date
 */
export function getCurrentPortion(today: Date = chicagoToday()): string {
  return getCurrentPortionEntry(today).hebrewName;
}

/**
 * The cycle that holds this week's portion. The Torah Portions page shows only
 * this one, so it always contains the portion the page highlights.
 */
export function getCurrentCycle(today: Date = chicagoToday()): TorahPortionWithDate[] {
  const entry = getCurrentPortionEntry(today);
  return (TORAH_CYCLES.find(cycle => cycle.portions.includes(entry)) ?? TORAH_CYCLES[0]).portions;
}

/**
 * Parse a portion date string like "17 OCT 2025" to a Date object
 */
export function parsePortionDate(dateStr: string): Date | null {
  const months: Record<string, number> = {
    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
    'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
  };

  const parts = dateStr.split(' ');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = months[parts[1]];
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || month === undefined || isNaN(year)) return null;

  return new Date(year, month, day);
}

/**
 * Get all portions for a specific book
 */
export function getPortionsByBook(book: TorahBook): TorahPortionWithDate[] {
  return getCurrentCycle().filter(p => p.book === book);
}

/**
 * Get the book that contains the current portion
 */
export function getCurrentBook(): TorahBook {
  return getCurrentPortionEntry().book;
}

/**
 * Book display names
 */
export const BOOK_NAMES: Record<TorahBook, string> = {
  genesis: 'GENESIS',
  exodus: 'EXODUS',
  leviticus: 'LEVITICUS',
  numbers: 'NUMBERS',
  deuteronomy: 'DEUTERONOMY',
};

/**
 * Get a portion by its Hebrew name. Each name appears once per cycle, so this
 * returns the reading whose date is nearest `near` (today by default).
 */
export function getPortionByHebrewName(
  hebrewName: string,
  near: Date = chicagoToday(),
): TorahPortionWithDate | undefined {
  let best: TorahPortionWithDate | undefined;
  let bestDistance = Infinity;

  for (const portion of TORAH_PORTIONS_WITH_DATES) {
    if (portion.hebrewName !== hebrewName) continue;
    const date = parsePortionDate(portion.date);
    const distance = date ? Math.abs(date.getTime() - near.getTime()) : Infinity;
    if (!best || distance < bestDistance) {
      best = portion;
      bestDistance = distance;
    }
  }

  return best;
}

// ============================================================
// Calendar helpers (Upcoming Events page)
// ============================================================

/** Local YYYY-MM-DD. Never use toISOString() here -- it converts to UTC and
 *  shifts the date by a day for anyone west of Greenwich, which is everyone
 *  in this congregation. */
export function toDateKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Every portion in the cycle keyed by the Saturday it is read. */
export function getPortionsByDateKey(): Map<string, TorahPortionWithDate> {
  const map = new Map<string, TorahPortionWithDate>();

  for (const portion of TORAH_PORTIONS_WITH_DATES) {
    const date = parsePortionDate(portion.date);
    if (date) map.set(toDateKey(date), portion);
  }

  return map;
}

/** The portion read on a specific day, if that day is a reading Saturday. */
export function getPortionOnDate(date: Date): TorahPortionWithDate | undefined {
  return getPortionsByDateKey().get(toDateKey(date));
}

/** First reading Saturday on or after `from`. Undefined once the cycle ends. */
export function getNextPortion(from: Date = chicagoToday()): TorahPortionWithDate | undefined {
  const cutoff = new Date(from);
  cutoff.setHours(0, 0, 0, 0);

  return TORAH_PORTIONS_WITH_DATES.filter(portion => {
    const date = parsePortionDate(portion.date);
    return date !== null && date >= cutoff;
  })[0];
}

/** Bounds of the reading cycle, for clamping calendar navigation. */
export function getCycleRange(): { first: Date; last: Date } | null {
  const dates = TORAH_PORTIONS_WITH_DATES
    .map(portion => parsePortionDate(portion.date))
    .filter((date): date is Date => date !== null)
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length === 0) return null;
  return { first: dates[0], last: dates[dates.length - 1] };
}
