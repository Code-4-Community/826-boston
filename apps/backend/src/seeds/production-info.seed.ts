export interface ProductionInfoSeedData {
  id?: number;
  /** 1-indexed position in AnthologiesSeed — the anthology this belongs to. */
  anthologyId: number;
  bindingType?: string;
  printedBy?: string;
  printRun?: number;
  printingCost?: number;
  pageCount?: number;
  coverImageFileLink?: string;
  designFilesLink?: string;
  dimensions?: string;
  weightInGrams?: number;
  forewordAuthor?: string;
  numberOfStudents?: number;
}

// Production metadata taken from the publications spreadsheet.
export const ProductionInfoSeed: ProductionInfoSeedData[] = [
  // Walk a Mile in Our Shoes
  {
    anthologyId: 1,
    bindingType: 'Saddle Stitch',
    dimensions: '5.5"x8.5" (Half-Letter)',
    printedBy: 'FlashPrint',
    pageCount: 39,
    numberOfStudents: 17,
    designFilesLink:
      'https://www.dropbox.com/scl/fo/j40bqvkqd41eus5ysqjkz/ABvN78lPyAgzxEWEK2Sg-3o?rlkey=i8jgs2asrr52aaav7odd8v1dy&st=c4s89o4p&dl=0',
  },
  // Utopia vs. Dystopia
  {
    anthologyId: 2,
    bindingType: 'Tape Bound/Binding Strips',
    dimensions: '5.5"x8.5" (Half-Letter)',
    printedBy: 'FlashPrint',
    pageCount: 192,
    printRun: 100,
    numberOfStudents: 42,
    printingCost: 574.5,
    designFilesLink:
      'https://www.dropbox.com/scl/fo/n7wd89x6shehztlr4v9rb/AF-aCJ20sbArzjyW6btJ0WE?rlkey=uebax0hoozk3ce4zkbwn07oei&st=vzi47d54&dl=0',
  },
  // I'll Light Up My Own Sky
  {
    anthologyId: 3,
    bindingType: 'Perfect Bound',
    dimensions: '7"x7"',
    printedBy: 'Marquis',
    forewordAuthor: 'Agnes Ugoji',
    pageCount: 132,
    printRun: 500,
    numberOfStudents: 53,
    printingCost: 2906.4,
    weightInGrams: 176.0,
    designFilesLink:
      'https://www.dropbox.com/scl/fo/47057xdi0lyg99spgr3j9/AE7-Lh3bmQ-8EjpYw6qM4o4?rlkey=v91fswjaidflztbm86nhrlykd&st=1sbqgvkv&dl=0',
  },
  // To The People Like Us
  {
    anthologyId: 4,
    bindingType: 'Perfect Bound',
    dimensions: '5.5"x8.5" (Half-Letter)',
    printedBy: 'PaperGraphics',
    forewordAuthor: 'Mfoniso Udofia',
    pageCount: 104,
    printRun: 500,
    numberOfStudents: 11,
    printingCost: 2924.23,
    weightInGrams: 133.0,
    designFilesLink:
      'https://www.dropbox.com/scl/fo/8f0t0sdi2iervhqkxpx4u/ABcZ6wh-Oh_RGKemMyB0RB8?rlkey=buwu9aztmmezs1veh923zl5im&st=fb47s6gc&dl=0',
  },
  // I Am Bravery Itself
  {
    anthologyId: 5,
    bindingType: 'Tape Bound/Binding Strips',
    dimensions: '5.5"x8.5" (Half-Letter)',
    printedBy: 'FlashPrint',
    pageCount: 54,
    printRun: 120,
    numberOfStudents: 34,
    printingCost: 359.0,
    designFilesLink:
      'https://www.dropbox.com/scl/fo/xxnf0wo7ssjjffq52bstp/AAj6-ymUOhBk43Bbo5AfSdM?rlkey=pu5jxz1l4ccthterfb47o8bay&st=9o97gkh2&dl=0',
  },
  // In Everday Things
  {
    anthologyId: 6,
    bindingType: 'Perfect Bound',
    dimensions: '5"x8"',
    printedBy: 'PaperGraphics',
    pageCount: 68,
    printRun: 320,
    numberOfStudents: 8,
    printingCost: 1778.45,
    weightInGrams: 91.0,
    designFilesLink:
      'https://www.dropbox.com/scl/fo/tnvujufbk8mqskt85j3d0/AJBL-vX9rysY9epRl2lX0m8?rlkey=w9zljba9wnxvx5r15x43edt9m&st=9h6x1aro&dl=0',
  },
  // Nothing Suspicious Was Going On
  {
    anthologyId: 7,
    bindingType: 'Tape Bound/Binding Strips',
    dimensions: '4.25"x5.5"(Quarter Letter)',
    printedBy: 'FlashPrint',
    pageCount: 206,
    printRun: 150,
    numberOfStudents: 29,
    printingCost: 464.46,
    weightInGrams: 128.0,
    designFilesLink:
      'https://www.dropbox.com/scl/fo/wl8jqbd92buscjcafr2i6/ADteyjbfZIVov_44QHZ4yoE?rlkey=kahsehu3ctsmu5rt13oyl9b7f&st=5bndzrw5&dl=0',
  },
  // Who Are You?
  {
    anthologyId: 8,
    bindingType: 'Perfect Bound',
    dimensions: '7"x7"',
    printedBy: 'Country Press',
    pageCount: 84,
    printRun: 100,
    numberOfStudents: 30,
    weightInGrams: 136.0,
    designFilesLink:
      'https://www.dropbox.com/scl/fo/wl8jqbd92buscjcafr2i6/ADteyjbfZIVov_44QHZ4yoE?rlkey=k0zu1vu4du71x27wx7j7yf9fb&st=3uw6gq3c&dl=0',
  },
  // The Great Cost of Freedom
  {
    anthologyId: 9,
    bindingType: 'Perfect Bound',
    dimensions: '7"x7"',
    printedBy: 'Country Press',
    pageCount: 161,
    printRun: 150,
    numberOfStudents: 68,
    printingCost: 1162.24,
    weightInGrams: 260.0,
    designFilesLink:
      'https://www.dropbox.com/scl/fo/u87x3au5bne92cxcuxpk4/ADYWo0_YyS7FPjY-4eg1lmY?rlkey=0181iqtirbanyrm1bdrvryluo&st=tbnh5pk7&dl=0',
  },
  // Us, From the Inside and Out
  {
    anthologyId: 10,
    bindingType: 'Tape Bound/Binding Strips',
    printedBy: 'FlashPrint',
    pageCount: 50,
    printRun: 100,
    numberOfStudents: 30,
    printingCost: 225.0,
    designFilesLink:
      'https://www.dropbox.com/scl/fo/12hijkuggakfl8qh4495g/AH2zpDKUrcFHSTBspmWUdbI?rlkey=4c3uc8bina8f47510j7pox6ti&st=rj9lu3dq&dl=0',
  },
  // Rubix Literay Magazine #12 - Futures
  {
    anthologyId: 11,
    bindingType: 'Perfect Bound',
    dimensions: '7"x7"',
    printedBy: 'Country Press',
    pageCount: 88,
    printRun: 75,
    numberOfStudents: 35,
    printingCost: 586.83,
    designFilesLink:
      'https://www.dropbox.com/scl/fo/d4cyxw0k1dtydscbszecl/AO70OVxn7HlHQZcfExV_WWM?rlkey=dwqsstlreiaimlbnw347rwmvg&dl=0',
  },
  // I Closed My Eyes and Imagined
  {
    anthologyId: 12,
    bindingType: 'Perfect Bound',
    dimensions: '6"x8.25"',
    printedBy: 'PaperGraphics',
    forewordAuthor: 'Jennifer De Leon',
    pageCount: 191,
    numberOfStudents: 48,
    weightInGrams: 336.0,
    designFilesLink:
      'https://www.dropbox.com/scl/fo/86qo9gahft55hl18y5y0s/AFORb624HQDbcmVpbuRJFMM?rlkey=uf06g9edfy6h5vbjim5061l24&st=h7ypp011&dl=0',
  },
  // All Kinds of Flavor
  {
    anthologyId: 13,
    bindingType: 'Perfect Bound',
    dimensions: '6"x9"',
    printedBy: 'Country Press',
    forewordAuthor: 'Jerrelle Guy',
    pageCount: 129,
    printRun: 350,
    numberOfStudents: 23,
    printingCost: 1716.0,
    weightInGrams: 258.0,
    designFilesLink:
      'https://www.dropbox.com/scl/fi/p70a5ye0lrtpz02dd0j6d/BTU_Interior_060118_Final.pdf?rlkey=c6n833i2p6em11s2feqk8egpk&st=dybp6fgn&dl=0',
  },
  // It’s Not The Stone That Brings You Strength
  {
    anthologyId: 14,
    bindingType: 'Perfect Bound',
    dimensions: '6"x9"',
    printedBy: 'McNaughton and Gunn Inc.',
    forewordAuthor: 'Gregory Maguire',
    pageCount: 148,
    printRun: 34,
    numberOfStudents: 52,
    weightInGrams: 243.0,
  },
  // Like the Sun in Dark Spaces
  {
    anthologyId: 15,
    bindingType: 'Perfect Bound',
    dimensions: '7"x11"',
    printedBy: 'Puritan Capital',
    forewordAuthor: 'Danielle Legros Georges',
    pageCount: 134,
    printRun: 500,
    printingCost: 15994.0,
    weightInGrams: 476.0,
  },
  // With a Crunch and a Slurp
  {
    anthologyId: 16,
    bindingType: 'Perfect Bound',
    dimensions: '6"x9"',
    printedBy: 'Country Press',
    pageCount: 111,
    printRun: 350,
    numberOfStudents: 16,
    printingCost: 1939.44,
    weightInGrams: 217.0,
  },
  // A Long Walk To Healthy
  {
    anthologyId: 17,
    bindingType: 'Perfect Bound',
    dimensions: '6"x9"',
    printedBy: 'Country Press',
    forewordAuthor: 'Josh Trautwein',
    pageCount: 92,
    printRun: 350,
    numberOfStudents: 19,
    printingCost: 2140.41,
    weightInGrams: 186.0,
    designFilesLink:
      'https://www.dropbox.com/scl/fi/byqmlfrfwx3lqnhqavlht/Burke_Interior_053018_ProofV3-1.pdf?rlkey=5do1sy8kh4djit8d985ho2lx7&st=1059xaf9&dl=0',
  },
  // Before This Place Filled with Zombies
  {
    anthologyId: 18,
    bindingType: 'Perfect Bound',
    dimensions: '8"x6"',
    printedBy: 'Thompson-Shore',
    forewordAuthor: 'Lois Lowry',
    pageCount: 168,
    printRun: 48,
    numberOfStudents: 40,
    weightInGrams: 2.86,
    designFilesLink:
      'https://www.dropbox.com/scl/fo/x8xa32xurqruyjfmr7jyd/ADzPycWZyKUtYwMyo_ieAlI?rlkey=cnv73nixdlymtckb3xloabhxm&st=axrciw31&dl=0',
  },
  // I’m a Flame You Can’t Put Out
  {
    anthologyId: 19,
    bindingType: 'Perfect Bound',
    dimensions: '6"x9"',
    printedBy: 'McNaughton and Gunn Inc.',
    forewordAuthor: 'Ben Parad',
    pageCount: 202,
    numberOfStudents: 43,
    printingCost: 3200.0,
    weightInGrams: 386.0,
  },
  // My Generation Can
  {
    anthologyId: 20,
    bindingType: 'Perfect Bound',
    dimensions: '6"x9"',
    printedBy: 'Country Press',
    forewordAuthor: 'Sonia Chang-Díaz',
    pageCount: 100,
    weightInGrams: 301.0,
    designFilesLink:
      'https://www.dropbox.com/scl/fo/6xtv7s7qrsrodxt2kw3rn/AC_B25Lwwp17cylczNG1n9g?rlkey=4q7j6h6i8j5s7604rco72wdon&st=7wp6geqy&dl=0',
  },
  // What if the World Needs You?
  {
    anthologyId: 21,
    bindingType: 'Perfect Bound',
    dimensions: '11"x8.5"',
    printedBy: 'PaperGraphics',
    forewordAuthor: 'Meredith Goldstein',
    pageCount: 245,
    printRun: 600,
    numberOfStudents: 91,
    printingCost: 8548.28,
    designFilesLink:
      'https://www.dropbox.com/s/d09jdd4i4elij8z/what if the world needs you_FULL.pdf?st=tc9mgpir&dl=0',
  },
  // 85 Cents Might Not Sound Like a Lot
  {
    anthologyId: 22,
    bindingType: 'Perfect Bound',
    dimensions: '8.5"x11" (Letter)',
    printedBy: 'Puritan Capital',
    pageCount: 71,
    printRun: 500,
    numberOfStudents: 36,
    printingCost: 8972.0,
  },
  // I Was Meant For This
  {
    anthologyId: 23,
    bindingType: 'Perfect Bound',
    dimensions: '6"x9.5"',
    printedBy: 'PaperGraphics',
    forewordAuthor: 'Adrian Walker',
    pageCount: 146,
    printRun: 500,
    numberOfStudents: 40,
    printingCost: 4315.58,
    weightInGrams: 306.0,
    designFilesLink:
      'https://drive.google.com/drive/folders/1-mTIYFIb8zE2OYvPVPxL0XvkWIl51k5o?usp=sharing',
  },
  // We Think You’re Old Enough to Know
  {
    anthologyId: 24,
    bindingType: 'Perfect Bound',
    dimensions: '8"x8"',
    forewordAuthor: 'Steve Carell',
    pageCount: 175,
    weightInGrams: 463.0,
  },
  // We Turned Back to See Where We Came From
  {
    anthologyId: 25,
    bindingType: 'Perfect Bound',
    dimensions: '6.5"x6.5"',
    printedBy: 'Westcan Printing Group',
    forewordAuthor: 'Maria Hinojosa',
    pageCount: 136,
    numberOfStudents: 31,
    weightInGrams: 246.0,
    designFilesLink:
      'https://www.dropbox.com/scl/fi/3fmp0loowtb05mcauovhl/The-Making-of-We-Turned-Back-to-See-Where-We-Came-From.mp4?rlkey=ndjyiesvawje3fbytz77tjvu7&st=v8oqwpkx&dl=0',
  },
  // I Rate Today a -1,000
  {
    anthologyId: 26,
    bindingType: 'Perfect Bound',
    dimensions: '6"x9"',
    printedBy: 'McNaughton and Gunn Inc.',
    forewordAuthor: 'Jeff Kinney',
    pageCount: 314,
    printRun: 600,
    numberOfStudents: 68,
    printingCost: 2982.73,
    weightInGrams: 506.0,
  },
  // Invincible: Book 1
  {
    anthologyId: 27,
    bindingType: 'Tape Bound/Binding Strips',
    dimensions: '4.25"x5.5"(Quarter Letter)',
    printedBy: 'FlashPrint',
    pageCount: 195,
    printRun: 152,
    numberOfStudents: 37,
    printingCost: 373.92,
    weightInGrams: 125.0,
  },
  // Oh My Chocolate
  {
    anthologyId: 28,
    bindingType: 'Tape Bound/Binding Strips',
    dimensions: '4.25"x5.5"(Quarter Letter)',
    printedBy: 'FlashPrint',
    pageCount: 122,
    printRun: 188,
    printingCost: 402.32,
    weightInGrams: 83.0,
    designFilesLink:
      'https://www.dropbox.com/scl/fo/erla0ypev9em9mtdxit0u/AKDX9WUhvUCNwP8OvSD5DQY?rlkey=syad25l2mm0vsmw1sgb54vmkh&st=te2vojzz&dl=0',
  },
  // Wait, Whaaa? Where Am I?
  {
    anthologyId: 29,
    bindingType: 'Tape Bound/Binding Strips',
    printedBy: 'FlashPrint',
    pageCount: 196,
    printRun: 160,
    numberOfStudents: 23,
    printingCost: 472.0,
    designFilesLink:
      'https://826boston.org/publications/wait-whaaa-where-am-i/',
  },
  // Small Things Can Grow Tall
  {
    anthologyId: 30,
    bindingType: 'Tape Bound/Binding Strips',
    dimensions: '5.5"x8.5" (Half-Letter)',
    forewordAuthor: 'Sherman Alexie',
    pageCount: 124,
    weightInGrams: 188.0,
  },
  // Rubix Literary Magazine #9: The Connections Issue
  {
    anthologyId: 31,
    bindingType: 'Perfect Bound',
    printedBy: 'Country Press',
    pageCount: 84,
    numberOfStudents: 23,
  },
];
