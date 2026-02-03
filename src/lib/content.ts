// ============================================================
// Congregation of YHVH -- All Doctrinal & Page Content
// Extracted from Pastor Frank's documents via blueprint
// ============================================================

// ------ VISION & MISSION ------

export const VISION_STATEMENT =
  "Our vision is to cultivate a community where every member is firmly grounded in the Torah and the teachings of YHVH, faithfully walking in obedience to His Word, empowered by the Holy Spirit, and anchored in the testimony of Yahshua the Messiah.";

export const ABOUT_US =
  "We are a Messianic congregation devoted to honoring YHVH through faith in Yahshua the Messiah & obedience to His Commandments. We gather weekly on Shabbat to worship, study the Torah, and grow together as a covenant community.";

export const MISSION_STATEMENT =
  "Our mission is to make disciples, equip them with the Word of YHVH, strengthen families in righteous living, and raise the next generation to walk faithfully in obedience to His commandments through faith in Yahshua the Messiah.";

// ------ STATEMENT OF FAITH ------

export const STATEMENT_OF_FAITH_SHORT =
  "We are a Messianic congregation devoted to the Scriptures as the inspired Word of YHVH. We believe in Yahshua the Messiah, salvation by grace through faith, and a life transformed by obedience through the power of the Holy Spirit.";

export const STATEMENT_OF_FAITH_FULL = [
  "We believe the Scriptures, both the Tanakh (Old Testament) and the Brit Chadashah (New Testament), are the inspired, inerrant Word of YHVH and the final authority in all matters of faith and practice.",
  "We believe in one Elohim, YHVH, the Creator of heaven and earth, who has revealed Himself through His Word, His creation, and ultimately through His Son, Yahshua the Messiah.",
  "We believe Yahshua (Jesus) is the promised Messiah of Israel, the Son of the living Elohim, born of a virgin, who lived a sinless life, died as an atoning sacrifice, rose from the dead, and ascended to the right hand of the Father.",
  "We believe salvation is by grace through faith in Yahshua the Messiah alone, not by works, but that true faith produces obedience to the commandments of YHVH as evidence of a transformed life.",
  "We believe the Ruach HaKodesh (Holy Spirit) empowers believers to live set-apart lives, convicts of sin, teaches truth, and distributes gifts for the building up of the body of Messiah.",
  "We believe that through faith in Yahshua, believers from all nations are grafted into the commonwealth of Israel and become partakers of the covenants and promises of YHVH.",
  "We believe in the importance of family and generational discipleship, raising children in the fear and instruction of YHVH, and building homes that reflect His kingdom.",
  "We believe in the literal, physical return of Yahshua the Messiah to establish His kingdom on earth, the resurrection of the dead, and the final judgment of all mankind.",
];

// ------ WHAT WE BELIEVE (12 DOCTRINAL POINTS) ------

export interface DoctrinalPoint {
  number: number;
  title: string;
  hebrewTerm?: string;
  description: string;
  scriptures: string[];
}

export const WHAT_WE_BELIEVE: DoctrinalPoint[] = [
  {
    number: 1,
    title: "Yahuah \u2014 The One Elohim",
    description:
      "We believe in one Elohim, YHVH (Yahuah), the Creator of the heavens and the earth, who is eternal, sovereign, and set apart. He has revealed Himself through His Word, His creation, and ultimately through His Son, Yahshua the Messiah.",
    scriptures: ["Deuteronomy 6:4", "Isaiah 45:5\u20136", "Genesis 1:1"],
  },
  {
    number: 2,
    title: "Yahshua the Messiah",
    description:
      "We believe Yahshua (Jesus) is the promised Messiah of Israel, the Son of the living Elohim, born of a virgin, who lived a sinless life in perfect obedience to the Torah. He died as the atoning sacrifice for the sins of mankind, rose bodily from the dead on the third day, and ascended to the right hand of the Father, where He now intercedes for His people.",
    scriptures: [
      "Isaiah 53",
      "Matthew 1:21\u201323",
      "1 Corinthians 15:3\u20134",
      "Hebrews 7:25",
    ],
  },
  {
    number: 3,
    title: "The Scriptures",
    description:
      "We believe the Scriptures, both the Tanakh (Old Testament) and the Brit Chadashah (New Testament), are the inspired, inerrant, and authoritative Word of YHVH. They are the foundation for all faith, doctrine, and practice, and are profitable for teaching, correction, and training in righteousness.",
    scriptures: ["2 Timothy 3:16\u201317", "Psalm 119:105", "Isaiah 40:8"],
  },
  {
    number: 4,
    title: "Salvation and Repentance",
    hebrewTerm: "Teshuvah",
    description:
      "We believe salvation is by grace through faith in Yahshua the Messiah alone. It cannot be earned by works, yet true saving faith produces repentance (teshuvah) and a turning toward obedience to YHVH\u2019s commandments as evidence of a transformed heart.",
    scriptures: [
      "Ephesians 2:8\u20139",
      "James 2:17\u201326",
      "Acts 2:38",
      "1 John 2:3\u20136",
    ],
  },
  {
    number: 5,
    title: "Covenant Obedience",
    description:
      "We believe that through faith in Yahshua, believers are called to walk in obedience to YHVH\u2019s Torah (instructions), not as a means of salvation, but as an expression of love, faithfulness, and covenant identity. The Torah is eternal and remains the standard for righteous living.",
    scriptures: [
      "Matthew 5:17\u201319",
      "1 John 5:3",
      "Romans 3:31",
      "Psalm 119:1\u20132",
    ],
  },
  {
    number: 6,
    title: "The Holy Spirit",
    hebrewTerm: "The Ruach Ha\u2019Qodesh",
    description:
      "We believe the Ruach HaKodesh (Holy Spirit) is the Spirit of YHVH, given to all who believe in Yahshua. He empowers believers to walk in obedience, convicts of sin, teaches truth, comforts, and distributes gifts for the building up of the body of Messiah.",
    scriptures: [
      "Joel 2:28\u201329",
      "John 14:26",
      "Acts 1:8",
      "1 Corinthians 12:4\u201311",
    ],
  },
  {
    number: 7,
    title: "Israel and the Nations",
    description:
      "We believe that Israel remains YHVH\u2019s chosen people. Through faith in Yahshua, believers from all nations are grafted into the commonwealth of Israel and become partakers of the covenants and promises. We stand with Israel and pray for the peace of Jerusalem.",
    scriptures: [
      "Romans 11:17\u201324",
      "Ephesians 2:11\u201313",
      "Genesis 12:3",
      "Psalm 122:6",
    ],
  },
  {
    number: 8,
    title: "Appointed Times and Set-Apart Practices",
    description:
      "We believe in observing the biblical appointed times (moedim) of YHVH, including the weekly Shabbat, the seven annual feasts (Leviticus 23), and set-apart practices such as clean eating (kosher), as acts of worship, covenant identity, and prophetic significance.",
    scriptures: [
      "Leviticus 23",
      "Colossians 2:16\u201317",
      "Isaiah 56:6\u20137",
      "Leviticus 11",
    ],
  },
  {
    number: 9,
    title: "Family and Generational Discipleship",
    description:
      "We believe the family is the primary unit of discipleship. Parents are called to raise their children in the fear and instruction of YHVH, passing down faith, obedience, and kingdom values from generation to generation.",
    scriptures: [
      "Deuteronomy 6:6\u20139",
      "Proverbs 22:6",
      "Ephesians 6:4",
      "Psalm 78:4\u20137",
    ],
  },
  {
    number: 10,
    title: "Set-Apart Living",
    hebrewTerm: "Kedushah",
    description:
      "We believe that believers are called to live set-apart (holy) lives, reflecting the character of YHVH in their speech, conduct, relationships, and worship. We pursue purity, modesty, and integrity in all areas of life.",
    scriptures: [
      "Leviticus 19:2",
      "1 Peter 1:15\u201316",
      "Romans 12:1\u20132",
      "Hebrews 12:14",
    ],
  },
  {
    number: 11,
    title: "The Assembly",
    hebrewTerm: "Kehillah",
    description:
      "We believe in the importance of gathering together as a local body of believers for worship, teaching, fellowship, prayer, and mutual edification. The congregation is a spiritual family, united by faith in Yahshua and commitment to YHVH\u2019s Word.",
    scriptures: [
      "Hebrews 10:24\u201325",
      "Acts 2:42\u201347",
      "1 Corinthians 12:12\u201327",
    ],
  },
  {
    number: 12,
    title: "The Return of the King and the Kingdom",
    description:
      "We believe in the literal, physical return of Yahshua the Messiah to establish His kingdom on earth. He will judge the living and the dead, restore all things, and reign forever. We eagerly await His coming and live in light of that blessed hope.",
    scriptures: [
      "Acts 1:11",
      "Revelation 19:11\u201316",
      "Titus 2:13",
      "Zechariah 14:9",
    ],
  },
];

// ------ CORE VALUES (9 VALUES) ------

export interface CoreValue {
  number: number;
  title: string;
  hebrewTerm?: string;
  description: string;
  scripture: string;
  scriptureRef: string;
}

export const CORE_VALUES: CoreValue[] = [
  {
    number: 1,
    title: "Yahuah \u2014 The One Elohim",
    description:
      "We honor YHVH as the one true Elohim \u2014 Creator, Sustainer, and Sovereign over all. Everything we do flows from a heart of reverence for His name and obedience to His will.",
    scripture:
      "Hear, O Israel: YHVH our Elohim, YHVH is one.",
    scriptureRef: "Deuteronomy 6:4",
  },
  {
    number: 2,
    title: "Yahusha the Messiah",
    description:
      "We believe Yahshua is the promised Messiah, the Son of the living Elohim. Through His life, death, and resurrection, He is the way, the truth, and the life.",
    scripture:
      "I am the way, the truth, and the life. No one comes to the Father except through Me.",
    scriptureRef: "John 14:6",
  },
  {
    number: 3,
    title: "The Word of Yahuah",
    hebrewTerm: "Torah & Testimony",
    description:
      "We hold the Scriptures as the inspired, inerrant Word of YHVH \u2014 our foundation for truth, instruction, and righteous living.",
    scripture:
      "Your word is a lamp to my feet and a light to my path.",
    scriptureRef: "Psalm 119:105",
  },
  {
    number: 4,
    title: "Covenant Obedience",
    description:
      "We walk in obedience to YHVH\u2019s Torah not to earn salvation, but as an expression of love, faith, and our covenant relationship with Him.",
    scripture:
      "If you love Me, keep My commandments.",
    scriptureRef: "John 14:15",
  },
  {
    number: 5,
    title: "The Ruach Ha\u2019Qodesh",
    description:
      "We depend on the Holy Spirit for power, guidance, conviction, and transformation \u2014 walking not in the flesh, but in the Spirit.",
    scripture:
      "But you shall receive power when the Ruach HaKodesh has come upon you.",
    scriptureRef: "Acts 1:8",
  },
  {
    number: 6,
    title: "Family & Generational Discipleship",
    description:
      "We believe the family is the primary unit of spiritual growth. Parents are called to raise their children in the fear of YHVH, passing down truth from generation to generation.",
    scripture:
      "Train up a child in the way he should go; even when he is old he will not depart from it.",
    scriptureRef: "Proverbs 22:6",
  },
  {
    number: 7,
    title: "Community",
    hebrewTerm: "Kehillah",
    description:
      "We are a spiritual family united by faith in Yahshua. We gather to worship, study, pray, encourage, and walk through life together in love and accountability.",
    scripture:
      "And let us consider how to stir up one another to love and good works, not neglecting to meet together.",
    scriptureRef: "Hebrews 10:24\u201325",
  },
  {
    number: 8,
    title: "Set-Apart Living",
    hebrewTerm: "Kedushah",
    description:
      "We are called to live holy, set-apart lives \u2014 reflecting the character of YHVH in our speech, conduct, relationships, and worship.",
    scripture: "Be holy, for I am holy.",
    scriptureRef: "1 Peter 1:16",
  },
  {
    number: 9,
    title: "Training the Next Generation",
    description:
      "We are committed to investing in children and youth through intentional teaching, mentorship, and age-appropriate discipleship rooted in Scripture.",
    scripture:
      "We will tell the next generation the praiseworthy deeds of YHVH, His power, and the wonders He has done.",
    scriptureRef: "Psalm 78:4",
  },
];

// ------ CLOSING AFFIRMATION ------

export const CLOSING_AFFIRMATION =
  "We commit to walking in faith in Yahshua the Messiah, obedience to the Word of Yahuah, and dependence on the Ruach Ha\u2019Qodesh \u2014 to strengthen families, raise faithful generations, and bring honor to the Name of Yahuah.";

// ------ CLOSING INVITATION ------

export const CLOSING_INVITATION =
  "You are welcome to come learn, worship, and walk with us as we pursue faithfulness to YAHUAH through His Son, Yahshua the Messiah. Whether you are new to the faith or have been walking this path for years, there is a place for you here.";

// ------ PASTOR WELCOME ------

export const PASTOR_WELCOME =
  "You are welcome to come learn, worship, and walk with us as we pursue faithfulness to YAHUAH through His Son, Yahshua the Messiah. Whether you are new to the faith or have been walking this path for years, there is a place for you here.";

// ------ FAQ ------

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What is a Messianic congregation?",
    answer:
      "A Messianic congregation is a community of believers who follow Yahshua (Jesus) as the Messiah while also honoring the Torah (the first five books of the Bible) and the biblical feasts. We embrace both the Tanakh (Old Testament) and the Brit Chadashah (New Testament) as the inspired Word of YHVH.",
  },
  {
    question: "Do I need to be Jewish to attend?",
    answer:
      "Absolutely not. Our congregation welcomes people from all backgrounds and nations. We believe that through faith in Yahshua, all believers are grafted into the commonwealth of Israel and share in the covenants and promises of YHVH.",
  },
  {
    question: "Why do you meet on Saturday instead of Sunday?",
    answer:
      "We observe the biblical Shabbat (Sabbath), which begins on Friday evening and ends on Saturday evening. The Shabbat was established by YHVH at creation and is one of the Ten Commandments. We honor this appointed time as an act of obedience and worship.",
  },
  {
    question: "What should I expect at a Shabbat service?",
    answer:
      "Our services include worship through song, the sounding of the shofar, the reading and teaching of the Torah portion for the week, prayer, and fellowship. We strive to create a reverent yet welcoming atmosphere for all who attend.",
  },
  {
    question: "Do you celebrate Christmas and Easter?",
    answer:
      "We observe the biblical appointed times (moedim) found in Leviticus 23, which include Passover (Pesach), Unleavened Bread, Firstfruits, Pentecost (Shavuot), Feast of Trumpets (Yom Teruah), Day of Atonement (Yom Kippur), and Tabernacles (Sukkot).",
  },
  {
    question: "What does YHVH mean?",
    answer:
      "YHVH (often transliterated as Yahuah or Yahweh) represents the sacred name of the Creator as revealed in the Hebrew Scriptures. It is derived from the four Hebrew letters Yod-He-Vav-He and is sometimes referred to as the Tetragrammaton.",
  },
  {
    question: "Are children welcome?",
    answer:
      "Yes! Children are an important part of our congregation. We believe in generational discipleship and are working to develop dedicated children\u2019s programming to help young ones grow in their understanding of YHVH\u2019s Word.",
  },
  {
    question: "How can I get involved?",
    answer:
      "The best way to get involved is to join us for a Shabbat service. From there, you can connect with our leadership to learn about volunteer opportunities, small groups, and ways to serve within the community.",
  },
];

// ------ FEAST DAYS / BIBLICAL CALENDAR (2026 estimates) ------

export interface FeastDay {
  name: string;
  hebrewName: string;
  dates: string;
  description: string;
  scripture: string;
}

export const FEAST_DAYS_2026: FeastDay[] = [
  {
    name: "Passover",
    hebrewName: "Pesach",
    dates: "April 1\u20132, 2026",
    description:
      "Commemorates YHVH\u2019s deliverance of Israel from slavery in Egypt. Prophetically fulfilled in the sacrifice of Yahshua, the Lamb of Elohim.",
    scripture: "Leviticus 23:5",
  },
  {
    name: "Unleavened Bread",
    hebrewName: "Chag HaMatzot",
    dates: "April 2\u20138, 2026",
    description:
      "A seven-day feast of removing leaven (sin) from our homes and lives. Points to Yahshua\u2019s sinless body and our call to walk in purity.",
    scripture: "Leviticus 23:6\u20138",
  },
  {
    name: "Firstfruits",
    hebrewName: "Yom HaBikkurim",
    dates: "April 5, 2026",
    description:
      "Celebrates the first harvest offering to YHVH. Fulfilled in Yahshua\u2019s resurrection \u2014 the firstfruits of those who have fallen asleep.",
    scripture: "Leviticus 23:9\u201314",
  },
  {
    name: "Pentecost",
    hebrewName: "Shavuot",
    dates: "May 24, 2026",
    description:
      "Celebrates the giving of the Torah at Mount Sinai and the outpouring of the Ruach HaKodesh (Holy Spirit) on the early believers.",
    scripture: "Leviticus 23:15\u201321",
  },
  {
    name: "Feast of Trumpets",
    hebrewName: "Yom Teruah",
    dates: "September 12\u201313, 2026",
    description:
      "A day of blowing the shofar, calling the people to repentance and awakening. Prophetically points to the return of Yahshua the Messiah.",
    scripture: "Leviticus 23:23\u201325",
  },
  {
    name: "Day of Atonement",
    hebrewName: "Yom Kippur",
    dates: "September 21\u201322, 2026",
    description:
      "The most solemn day of the year \u2014 a day of fasting, repentance, and seeking YHVH\u2019s forgiveness. Fulfilled in Yahshua\u2019s atoning sacrifice.",
    scripture: "Leviticus 23:26\u201332",
  },
  {
    name: "Tabernacles",
    hebrewName: "Sukkot",
    dates: "September 26\u2013October 2, 2026",
    description:
      "A joyful seven-day feast dwelling in temporary shelters, remembering YHVH\u2019s faithfulness in the wilderness. Points to Yahshua tabernacling among us.",
    scripture: "Leviticus 23:33\u201343",
  },
  {
    name: "Eighth Day Assembly",
    hebrewName: "Shemini Atzeret",
    dates: "October 3, 2026",
    description:
      "A solemn assembly immediately following Sukkot. A day of intimate gathering with YHVH, pointing to the eternal rest in His kingdom.",
    scripture: "Leviticus 23:36",
  },
];

// ------ TORAH PORTIONS (sample of the annual cycle) ------

export interface TorahPortion {
  number: number;
  name: string;
  hebrewName: string;
  torahReading: string;
  haftarah: string;
  britChadashah: string;
}

export const TORAH_PORTIONS: TorahPortion[] = [
  { number: 1, name: "In the Beginning", hebrewName: "Beresheet", torahReading: "Genesis 1:1\u20136:8", haftarah: "Isaiah 42:5\u201343:10", britChadashah: "John 1:1\u201318" },
  { number: 2, name: "Noah", hebrewName: "Noach", torahReading: "Genesis 6:9\u201311:32", haftarah: "Isaiah 54:1\u201355:5", britChadashah: "Matthew 24:36\u201346" },
  { number: 3, name: "Go Forth", hebrewName: "Lech Lecha", torahReading: "Genesis 12:1\u201317:27", haftarah: "Isaiah 40:27\u201341:16", britChadashah: "Romans 4:1\u201325" },
  { number: 4, name: "He Appeared", hebrewName: "Vayera", torahReading: "Genesis 18:1\u201322:24", haftarah: "2 Kings 4:1\u201337", britChadashah: "Luke 1:26\u201338" },
  { number: 5, name: "Life of Sarah", hebrewName: "Chayei Sarah", torahReading: "Genesis 23:1\u201325:18", haftarah: "1 Kings 1:1\u201331", britChadashah: "Matthew 8:19\u201322" },
  { number: 6, name: "Generations", hebrewName: "Toldot", torahReading: "Genesis 25:19\u201328:9", haftarah: "Malachi 1:1\u20132:7", britChadashah: "Romans 9:6\u201316" },
  { number: 7, name: "He Went Out", hebrewName: "Vayetze", torahReading: "Genesis 28:10\u201332:3", haftarah: "Hosea 12:13\u201314:10", britChadashah: "John 1:43\u201351" },
  { number: 8, name: "He Sent", hebrewName: "Vayishlach", torahReading: "Genesis 32:4\u201336:43", haftarah: "Obadiah 1:1\u201321", britChadashah: "Hebrews 11:11\u201320" },
  { number: 9, name: "He Settled", hebrewName: "Vayeshev", torahReading: "Genesis 37:1\u201340:23", haftarah: "Amos 2:6\u20133:8", britChadashah: "Acts 7:9\u201316" },
  { number: 10, name: "At the End", hebrewName: "Miketz", torahReading: "Genesis 41:1\u201344:17", haftarah: "1 Kings 3:15\u20134:1", britChadashah: "Luke 4:16\u201330" },
  { number: 11, name: "He Approached", hebrewName: "Vayigash", torahReading: "Genesis 44:18\u201347:27", haftarah: "Ezekiel 37:15\u201328", britChadashah: "Ephesians 2:1\u201322" },
  { number: 12, name: "He Lived", hebrewName: "Vayechi", torahReading: "Genesis 47:28\u201350:26", haftarah: "1 Kings 2:1\u201312", britChadashah: "1 Peter 1:3\u20139" },
  { number: 13, name: "Names", hebrewName: "Shemot", torahReading: "Exodus 1:1\u20136:1", haftarah: "Isaiah 27:6\u201328:13", britChadashah: "Acts 7:17\u201335" },
  { number: 14, name: "I Appeared", hebrewName: "Va'eira", torahReading: "Exodus 6:2\u20139:35", haftarah: "Ezekiel 28:25\u201329:21", britChadashah: "Revelation 15:1\u20138" },
  { number: 15, name: "Go/Come", hebrewName: "Bo", torahReading: "Exodus 10:1\u201313:16", haftarah: "Jeremiah 46:13\u201328", britChadashah: "Luke 22:7\u201320" },
  { number: 16, name: "When He Sent", hebrewName: "Beshalach", torahReading: "Exodus 13:17\u201317:16", haftarah: "Judges 4:4\u20135:31", britChadashah: "John 6:22\u201340" },
  { number: 17, name: "He Heard", hebrewName: "Yitro", torahReading: "Exodus 18:1\u201320:23", haftarah: "Isaiah 6:1\u20137:6", britChadashah: "Matthew 5:17\u201320" },
  { number: 18, name: "Judgments", hebrewName: "Mishpatim", torahReading: "Exodus 21:1\u201324:18", haftarah: "Jeremiah 34:8\u201322", britChadashah: "Hebrews 9:15\u201322" },
  { number: 19, name: "Contribution", hebrewName: "Terumah", torahReading: "Exodus 25:1\u201327:19", haftarah: "1 Kings 5:12\u20136:13", britChadashah: "2 Corinthians 9:1\u201315" },
  { number: 20, name: "You Shall Command", hebrewName: "Tetzaveh", torahReading: "Exodus 27:20\u201330:10", haftarah: "Ezekiel 43:10\u201327", britChadashah: "Hebrews 13:10\u201316" },
  { number: 21, name: "When You Take", hebrewName: "Ki Tisa", torahReading: "Exodus 30:11\u201334:35", haftarah: "1 Kings 18:1\u201339", britChadashah: "2 Corinthians 3:1\u201318" },
  { number: 22, name: "He Assembled", hebrewName: "Vayakhel", torahReading: "Exodus 35:1\u201338:20", haftarah: "1 Kings 7:40\u201350", britChadashah: "Hebrews 9:1\u201314" },
  { number: 23, name: "Accounts", hebrewName: "Pekudei", torahReading: "Exodus 38:21\u201340:38", haftarah: "1 Kings 7:51\u20138:21", britChadashah: "Revelation 15:5\u20138" },
  { number: 24, name: "He Called", hebrewName: "Vayikra", torahReading: "Leviticus 1:1\u20135:26", haftarah: "Isaiah 43:21\u201344:23", britChadashah: "Hebrews 10:1\u201318" },
  { number: 25, name: "Command", hebrewName: "Tzav", torahReading: "Leviticus 6:1\u20138:36", haftarah: "Jeremiah 7:21\u20138:3", britChadashah: "Hebrews 7:23\u201328" },
  { number: 26, name: "Eighth", hebrewName: "Shemini", torahReading: "Leviticus 9:1\u201311:47", haftarah: "2 Samuel 6:1\u20137:17", britChadashah: "Acts 10:1\u201335" },
  { number: 27, name: "She Conceives", hebrewName: "Tazria", torahReading: "Leviticus 12:1\u201313:59", haftarah: "2 Kings 4:42\u20135:19", britChadashah: "Luke 5:12\u201316" },
  { number: 28, name: "Infected One", hebrewName: "Metzora", torahReading: "Leviticus 14:1\u201315:33", haftarah: "2 Kings 7:3\u201320", britChadashah: "Matthew 9:20\u201326" },
  { number: 29, name: "After the Death", hebrewName: "Acharei Mot", torahReading: "Leviticus 16:1\u201318:30", haftarah: "Ezekiel 22:1\u201319", britChadashah: "Hebrews 9:11\u201328" },
  { number: 30, name: "Holy", hebrewName: "Kedoshim", torahReading: "Leviticus 19:1\u201320:27", haftarah: "Amos 9:7\u201315", britChadashah: "1 Peter 1:13\u201321" },
  { number: 31, name: "Say", hebrewName: "Emor", torahReading: "Leviticus 21:1\u201324:23", haftarah: "Ezekiel 44:15\u201331", britChadashah: "Luke 14:12\u201324" },
  { number: 32, name: "On the Mount", hebrewName: "Behar", torahReading: "Leviticus 25:1\u201326:2", haftarah: "Jeremiah 32:6\u201327", britChadashah: "Luke 4:16\u201321" },
  { number: 33, name: "In My Statutes", hebrewName: "Bechukotai", torahReading: "Leviticus 26:3\u201327:34", haftarah: "Jeremiah 16:19\u201317:14", britChadashah: "John 14:15\u201321" },
  { number: 34, name: "In the Wilderness", hebrewName: "Bamidbar", torahReading: "Numbers 1:1\u20134:20", haftarah: "Hosea 2:1\u201322", britChadashah: "Romans 9:22\u201333" },
  { number: 35, name: "Take Up", hebrewName: "Naso", torahReading: "Numbers 4:21\u20137:89", haftarah: "Judges 13:2\u201325", britChadashah: "Acts 21:17\u201326" },
  { number: 36, name: "When You Set Up", hebrewName: "Beha'alotcha", torahReading: "Numbers 8:1\u201312:16", haftarah: "Zechariah 2:14\u20134:7", britChadashah: "John 6:1\u201314" },
  { number: 37, name: "Send for Yourself", hebrewName: "Shelach", torahReading: "Numbers 13:1\u201315:41", haftarah: "Joshua 2:1\u201324", britChadashah: "Hebrews 3:7\u201319" },
  { number: 38, name: "Korach", hebrewName: "Korach", torahReading: "Numbers 16:1\u201318:32", haftarah: "1 Samuel 11:14\u201312:22", britChadashah: "Jude 1:1\u201325" },
  { number: 39, name: "Statute", hebrewName: "Chukat", torahReading: "Numbers 19:1\u201322:1", haftarah: "Judges 11:1\u201333", britChadashah: "John 3:10\u201321" },
  { number: 40, name: "Balak", hebrewName: "Balak", torahReading: "Numbers 22:2\u201325:9", haftarah: "Micah 5:6\u20136:8", britChadashah: "Revelation 2:12\u201317" },
  { number: 41, name: "Phinehas", hebrewName: "Pinchas", torahReading: "Numbers 25:10\u201330:1", haftarah: "1 Kings 18:46\u201319:21", britChadashah: "John 2:13\u201322" },
  { number: 42, name: "Tribes", hebrewName: "Matot", torahReading: "Numbers 30:2\u201332:42", haftarah: "Jeremiah 1:1\u20132:3", britChadashah: "Matthew 5:33\u201337" },
  { number: 43, name: "Journeys", hebrewName: "Masei", torahReading: "Numbers 33:1\u201336:13", haftarah: "Jeremiah 2:4\u20132:28", britChadashah: "James 4:1\u201312" },
  { number: 44, name: "Words", hebrewName: "Devarim", torahReading: "Deuteronomy 1:1\u20133:22", haftarah: "Isaiah 1:1\u201327", britChadashah: "Acts 9:1\u201321" },
  { number: 45, name: "I Pleaded", hebrewName: "Va'etchanan", torahReading: "Deuteronomy 3:23\u20137:11", haftarah: "Isaiah 40:1\u201326", britChadashah: "Matthew 23:31\u201339" },
  { number: 46, name: "Because", hebrewName: "Eikev", torahReading: "Deuteronomy 7:12\u201311:25", haftarah: "Isaiah 49:14\u201351:3", britChadashah: "Hebrews 11:8\u201316" },
  { number: 47, name: "See", hebrewName: "Re'eh", torahReading: "Deuteronomy 11:26\u201316:17", haftarah: "Isaiah 54:11\u201355:5", britChadashah: "1 John 4:1\u20136" },
  { number: 48, name: "Judges", hebrewName: "Shoftim", torahReading: "Deuteronomy 16:18\u201321:9", haftarah: "Isaiah 51:12\u201352:12", britChadashah: "Matthew 5:38\u201342" },
  { number: 49, name: "When You Go Out", hebrewName: "Ki Teitzei", torahReading: "Deuteronomy 21:10\u201325:19", haftarah: "Isaiah 54:1\u201310", britChadashah: "1 Corinthians 5:1\u20135" },
  { number: 50, name: "When You Come In", hebrewName: "Ki Tavo", torahReading: "Deuteronomy 26:1\u201329:8", haftarah: "Isaiah 60:1\u201322", britChadashah: "Luke 24:44\u201353" },
  { number: 51, name: "You Stand", hebrewName: "Nitzavim", torahReading: "Deuteronomy 29:9\u201330:20", haftarah: "Isaiah 61:10\u201363:9", britChadashah: "Romans 9:30\u201310:13" },
  { number: 52, name: "He Went", hebrewName: "Vayelech", torahReading: "Deuteronomy 31:1\u201330", haftarah: "Hosea 14:2\u20139", britChadashah: "Hebrews 13:5\u20138" },
  { number: 53, name: "Give Ear", hebrewName: "Ha'azinu", torahReading: "Deuteronomy 32:1\u201352", haftarah: "2 Samuel 22:1\u201351", britChadashah: "Romans 10:14\u201321" },
  { number: 54, name: "The Blessing", hebrewName: "V'Zot HaBerachah", torahReading: "Deuteronomy 33:1\u201334:12", haftarah: "Joshua 1:1\u201318", britChadashah: "Revelation 22:1\u20135" },
];
