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
      "Hear, O Israel: The LORD our God, the LORD is one!",
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
      "But you shall receive power when the Holy Spirit has come upon you.",
    scriptureRef: "Acts 1:8",
  },
  {
    number: 6,
    title: "Family & Generational Discipleship",
    description:
      "We believe the family is the primary unit of spiritual growth. Parents are called to raise their children in the fear of YHVH, passing down truth from generation to generation.",
    scripture:
      "Train up a child in the way he should go, and when he is old he will not depart from it.",
    scriptureRef: "Proverbs 22:6",
  },
  {
    number: 7,
    title: "Community",
    hebrewTerm: "Kehillah",
    description:
      "We are a spiritual family united by faith in Yahshua. We gather to worship, study, pray, encourage, and walk through life together in love and accountability.",
    scripture:
      "And let us consider one another in order to stir up love and good works, not forsaking the assembling of ourselves together.",
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
      "We will not hide them from their children, telling to the generation to come the praises of the LORD, and His strength and His wonderful works that He has done.",
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

export type FAQCategory =
  | "About YHVH"
  | "Faith & Beliefs"
  | "Worship & Shabbat"
  | "Visiting"
  | "Get Involved";

export interface FAQItem {
  question: string;
  answer: string;
  category: FAQCategory;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What is a Messianic congregation?",
    category: "Faith & Beliefs",
    answer:
      "A Messianic congregation is a community of believers who follow Yahshua (Jesus) as the Messiah while also honoring the Torah (the first five books of the Bible) and the biblical feasts. We embrace both the Tanakh (Old Testament) and the Brit Chadashah (New Testament) as the inspired Word of YHVH.",
  },
  {
    question: "Do I need to be Jewish to attend?",
    category: "Visiting",
    answer:
      "Absolutely not. Our congregation welcomes people from all backgrounds and nations. We believe that through faith in Yahshua, all believers are grafted into the commonwealth of Israel and share in the covenants and promises of YHVH.",
  },
  {
    question: "Why do you meet on Saturday instead of Sunday?",
    category: "Worship & Shabbat",
    answer:
      "We observe the biblical Shabbat (Sabbath), which begins on Friday evening and ends on Saturday evening. The Shabbat was established by YHVH at creation and is one of the Ten Commandments. We honor this appointed time as an act of obedience and worship.",
  },
  {
    question: "What should I expect at a Shabbat service?",
    category: "Worship & Shabbat",
    answer:
      "Our services include worship through song, the sounding of the shofar, the reading and teaching of the Torah portion for the week, prayer, and fellowship. We strive to create a reverent yet welcoming atmosphere for all who attend.",
  },
  {
    question: "Do you celebrate Christmas and Easter?",
    category: "Faith & Beliefs",
    answer:
      "We observe the biblical appointed times (moedim) found in Leviticus 23, which include Passover (Pesach), Unleavened Bread, Firstfruits, Pentecost (Shavuot), Feast of Trumpets (Yom Teruah), Day of Atonement (Yom Kippur), and Tabernacles (Sukkot).",
  },
  {
    question: "What does YHVH mean?",
    category: "About YHVH",
    answer:
      "YHVH (often transliterated as Yahuah or Yahweh) represents the sacred name of the Creator as revealed in the Hebrew Scriptures. It is derived from the four Hebrew letters Yod-He-Vav-He and is sometimes referred to as the Tetragrammaton.",
  },
  {
    question: "Are children welcome?",
    category: "Visiting",
    answer:
      "Yes! Children are an important part of our congregation. We believe in generational discipleship and are working to develop dedicated children\u2019s programming to help young ones grow in their understanding of YHVH\u2019s Word.",
  },
  {
    question: "How can I get involved?",
    category: "Get Involved",
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
  /** First day of the feast, ISO. Used to order and to find what is next. */
  isoStart: string;
  /** Illustration for the biblical calendar and the appointed-times band. */
  image: string;
}

export const FEAST_DAYS_2026: FeastDay[] = [
  {
    name: "Passover",
    hebrewName: "Pesach",
    dates: "April 1\u20132, 2026",
    description:
      "Commemorates YHVH\u2019s deliverance of Israel from slavery in Egypt. Prophetically fulfilled in the sacrifice of Yahshua, the Lamb of Elohim.",
    scripture: "Leviticus 23:5",
    isoStart: "2026-04-01",
    image: "/images/gs/feast-pesach.webp",
  },
  {
    name: "Unleavened Bread",
    hebrewName: "Chag HaMatzot",
    dates: "April 2\u20138, 2026",
    description:
      "A seven-day feast of removing leaven (sin) from our homes and lives. Points to Yahshua\u2019s sinless body and our call to walk in purity.",
    scripture: "Leviticus 23:6\u20138",
    isoStart: "2026-04-02",
    image: "/images/gs/feast-matzot.webp",
  },
  {
    name: "Firstfruits",
    hebrewName: "Yom HaBikkurim",
    dates: "April 5, 2026",
    description:
      "Celebrates the first harvest offering to YHVH. Fulfilled in Yahshua\u2019s resurrection \u2014 the firstfruits of those who have fallen asleep.",
    scripture: "Leviticus 23:9\u201314",
    isoStart: "2026-04-05",
    image: "/images/gs/feast-bikkurim.webp",
  },
  {
    name: "Pentecost",
    hebrewName: "Shavuot",
    dates: "May 24, 2026",
    description:
      "Celebrates the giving of the Torah at Mount Sinai and the outpouring of the Ruach HaKodesh (Holy Spirit) on the early believers.",
    scripture: "Leviticus 23:15\u201321",
    isoStart: "2026-05-24",
    image: "/images/gs/feast-shavuot.webp",
  },
  {
    name: "Feast of Trumpets",
    hebrewName: "Yom Teruah",
    dates: "September 12\u201313, 2026",
    description:
      "A day of blowing the shofar, calling the people to repentance and awakening. Prophetically points to the return of Yahshua the Messiah.",
    scripture: "Leviticus 23:23\u201325",
    isoStart: "2026-09-12",
    image: "/images/gs/feast-teruah.webp",
  },
  {
    name: "Day of Atonement",
    hebrewName: "Yom Kippur",
    dates: "September 21\u201322, 2026",
    description:
      "The most solemn day of the year \u2014 a day of fasting, repentance, and seeking YHVH\u2019s forgiveness. Fulfilled in Yahshua\u2019s atoning sacrifice.",
    scripture: "Leviticus 23:26\u201332",
    isoStart: "2026-09-21",
    image: "/images/gs/feast-kippur.webp",
  },
  {
    name: "Tabernacles",
    hebrewName: "Sukkot",
    dates: "September 26\u2013October 2, 2026",
    description:
      "A joyful seven-day feast dwelling in temporary shelters, remembering YHVH\u2019s faithfulness in the wilderness. Points to Yahshua tabernacling among us.",
    scripture: "Leviticus 23:33\u201343",
    isoStart: "2026-09-26",
    image: "/images/gs/feast-sukkot.webp",
  },
  {
    name: "Eighth Day Assembly",
    hebrewName: "Shemini Atzeret",
    dates: "October 3, 2026",
    description:
      "A solemn assembly immediately following Sukkot. A day of intimate gathering with YHVH, pointing to the eternal rest in His kingdom.",
    scripture: "Leviticus 23:36",
    isoStart: "2026-10-03",
    image: "/images/gs/feast-shemini.webp",
  },
];

