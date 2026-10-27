export interface ProductionInfoSeedData {
  id?: number;
  /** 1-indexed position in AnthologiesSeed — the anthology this belongs to. */
  anthology_id: number;
  binding_type?: string;
  printed_by?: string;
  print_run?: number;
  printing_cost?: number;
  page_count?: number;
  cover_image_file_link?: string;
  design_files_link?: string;
  dimensions?: string;
  weight_in_grams?: number;
  foreword_author?: string;
  number_of_students?: number;
}

// Production metadata taken from the publications spreadsheet.
export const ProductionInfoSeed: ProductionInfoSeedData[] = [
  // Walk a Mile in Our Shoes
  {
    anthology_id: 1,
    binding_type: 'Saddle Stitch',
    dimensions: '5.5"x8.5" (Half-Letter)',
    printed_by: 'FlashPrint',
    page_count: 39,
    number_of_students: 17,
    design_files_link:
      'https://www.dropbox.com/scl/fo/j40bqvkqd41eus5ysqjkz/ABvN78lPyAgzxEWEK2Sg-3o?rlkey=i8jgs2asrr52aaav7odd8v1dy&st=c4s89o4p&dl=0',
  },
  // Utopia vs. Dystopia
  {
    anthology_id: 2,
    binding_type: 'Tape Bound/Binding Strips',
    dimensions: '5.5"x8.5" (Half-Letter)',
    printed_by: 'FlashPrint',
    page_count: 192,
    print_run: 100,
    number_of_students: 42,
    printing_cost: 574.5,
    design_files_link:
      'https://www.dropbox.com/scl/fo/n7wd89x6shehztlr4v9rb/AF-aCJ20sbArzjyW6btJ0WE?rlkey=uebax0hoozk3ce4zkbwn07oei&st=vzi47d54&dl=0',
  },
  // I'll Light Up My Own Sky
  {
    anthology_id: 3,
    binding_type: 'Perfect Bound',
    dimensions: '7"x7"',
    printed_by: 'Marquis',
    foreword_author: 'Agnes Ugoji',
    page_count: 132,
    print_run: 500,
    number_of_students: 53,
    printing_cost: 2906.4,
    weight_in_grams: 176.0,
    design_files_link:
      'https://www.dropbox.com/scl/fo/47057xdi0lyg99spgr3j9/AE7-Lh3bmQ-8EjpYw6qM4o4?rlkey=v91fswjaidflztbm86nhrlykd&st=1sbqgvkv&dl=0',
  },
  // To The People Like Us
  {
    anthology_id: 4,
    binding_type: 'Perfect Bound',
    dimensions: '5.5"x8.5" (Half-Letter)',
    printed_by: 'PaperGraphics',
    foreword_author: 'Mfoniso Udofia',
    page_count: 104,
    print_run: 500,
    number_of_students: 11,
    printing_cost: 2924.23,
    weight_in_grams: 133.0,
    design_files_link:
      'https://www.dropbox.com/scl/fo/8f0t0sdi2iervhqkxpx4u/ABcZ6wh-Oh_RGKemMyB0RB8?rlkey=buwu9aztmmezs1veh923zl5im&st=fb47s6gc&dl=0',
  },
  // I Am Bravery Itself
  {
    anthology_id: 5,
    binding_type: 'Tape Bound/Binding Strips',
    dimensions: '5.5"x8.5" (Half-Letter)',
    printed_by: 'FlashPrint',
    page_count: 54,
    print_run: 120,
    number_of_students: 34,
    printing_cost: 359.0,
    design_files_link:
      'https://www.dropbox.com/scl/fo/xxnf0wo7ssjjffq52bstp/AAj6-ymUOhBk43Bbo5AfSdM?rlkey=pu5jxz1l4ccthterfb47o8bay&st=9o97gkh2&dl=0',
  },
  // In Everday Things
  {
    anthology_id: 6,
    binding_type: 'Perfect Bound',
    dimensions: '5"x8"',
    printed_by: 'PaperGraphics',
    page_count: 68,
    print_run: 320,
    number_of_students: 8,
    printing_cost: 1778.45,
    weight_in_grams: 91.0,
    design_files_link:
      'https://www.dropbox.com/scl/fo/tnvujufbk8mqskt85j3d0/AJBL-vX9rysY9epRl2lX0m8?rlkey=w9zljba9wnxvx5r15x43edt9m&st=9h6x1aro&dl=0',
  },
  // Nothing Suspicious Was Going On
  {
    anthology_id: 7,
    binding_type: 'Tape Bound/Binding Strips',
    dimensions: '4.25"x5.5"(Quarter Letter)',
    printed_by: 'FlashPrint',
    page_count: 206,
    print_run: 150,
    number_of_students: 29,
    printing_cost: 464.46,
    weight_in_grams: 128.0,
    design_files_link:
      'https://www.dropbox.com/scl/fo/wl8jqbd92buscjcafr2i6/ADteyjbfZIVov_44QHZ4yoE?rlkey=kahsehu3ctsmu5rt13oyl9b7f&st=5bndzrw5&dl=0',
  },
  // Who Are You?
  {
    anthology_id: 8,
    binding_type: 'Perfect Bound',
    dimensions: '7"x7"',
    printed_by: 'Country Press',
    page_count: 84,
    print_run: 100,
    number_of_students: 30,
    weight_in_grams: 136.0,
    design_files_link:
      'https://www.dropbox.com/scl/fo/wl8jqbd92buscjcafr2i6/ADteyjbfZIVov_44QHZ4yoE?rlkey=k0zu1vu4du71x27wx7j7yf9fb&st=3uw6gq3c&dl=0',
  },
  // The Great Cost of Freedom
  {
    anthology_id: 9,
    binding_type: 'Perfect Bound',
    dimensions: '7"x7"',
    printed_by: 'Country Press',
    page_count: 161,
    print_run: 150,
    number_of_students: 68,
    printing_cost: 1162.24,
    weight_in_grams: 260.0,
    design_files_link:
      'https://www.dropbox.com/scl/fo/u87x3au5bne92cxcuxpk4/ADYWo0_YyS7FPjY-4eg1lmY?rlkey=0181iqtirbanyrm1bdrvryluo&st=tbnh5pk7&dl=0',
  },
  // Us, From the Inside and Out
  {
    anthology_id: 10,
    binding_type: 'Tape Bound/Binding Strips',
    printed_by: 'FlashPrint',
    page_count: 50,
    print_run: 100,
    number_of_students: 30,
    printing_cost: 225.0,
    design_files_link:
      'https://www.dropbox.com/scl/fo/12hijkuggakfl8qh4495g/AH2zpDKUrcFHSTBspmWUdbI?rlkey=4c3uc8bina8f47510j7pox6ti&st=rj9lu3dq&dl=0',
  },
  // Rubix Literay Magazine #12 - Futures
  {
    anthology_id: 11,
    binding_type: 'Perfect Bound',
    dimensions: '7"x7"',
    printed_by: 'Country Press',
    page_count: 88,
    print_run: 75,
    number_of_students: 35,
    printing_cost: 586.83,
    design_files_link:
      'https://www.dropbox.com/scl/fo/d4cyxw0k1dtydscbszecl/AO70OVxn7HlHQZcfExV_WWM?rlkey=dwqsstlreiaimlbnw347rwmvg&dl=0',
  },
  // I Closed My Eyes and Imagined
  {
    anthology_id: 12,
    binding_type: 'Perfect Bound',
    dimensions: '6"x8.25"',
    printed_by: 'PaperGraphics',
    foreword_author: 'Jennifer De Leon',
    page_count: 191,
    number_of_students: 48,
    weight_in_grams: 336.0,
    design_files_link:
      'https://www.dropbox.com/scl/fo/86qo9gahft55hl18y5y0s/AFORb624HQDbcmVpbuRJFMM?rlkey=uf06g9edfy6h5vbjim5061l24&st=h7ypp011&dl=0',
  },
  // All Kinds of Flavor
  {
    anthology_id: 13,
    binding_type: 'Perfect Bound',
    dimensions: '6"x9"',
    printed_by: 'Country Press',
    foreword_author: 'Jerrelle Guy',
    page_count: 129,
    print_run: 350,
    number_of_students: 23,
    printing_cost: 1716.0,
    weight_in_grams: 258.0,
    design_files_link:
      'https://www.dropbox.com/scl/fi/p70a5ye0lrtpz02dd0j6d/BTU_Interior_060118_Final.pdf?rlkey=c6n833i2p6em11s2feqk8egpk&st=dybp6fgn&dl=0',
  },
  // It’s Not The Stone That Brings You Strength
  {
    anthology_id: 14,
    binding_type: 'Perfect Bound',
    dimensions: '6"x9"',
    printed_by: 'McNaughton and Gunn Inc.',
    foreword_author: 'Gregory Maguire',
    page_count: 148,
    print_run: 34,
    number_of_students: 52,
    weight_in_grams: 243.0,
  },
  // Like the Sun in Dark Spaces
  {
    anthology_id: 15,
    binding_type: 'Perfect Bound',
    dimensions: '7"x11"',
    printed_by: 'Puritan Capital',
    foreword_author: 'Danielle Legros Georges',
    page_count: 134,
    print_run: 500,
    printing_cost: 15994.0,
    weight_in_grams: 476.0,
  },
  // With a Crunch and a Slurp
  {
    anthology_id: 16,
    binding_type: 'Perfect Bound',
    dimensions: '6"x9"',
    printed_by: 'Country Press',
    page_count: 111,
    print_run: 350,
    number_of_students: 16,
    printing_cost: 1939.44,
    weight_in_grams: 217.0,
  },
  // A Long Walk To Healthy
  {
    anthology_id: 17,
    binding_type: 'Perfect Bound',
    dimensions: '6"x9"',
    printed_by: 'Country Press',
    foreword_author: 'Josh Trautwein',
    page_count: 92,
    print_run: 350,
    number_of_students: 19,
    printing_cost: 2140.41,
    weight_in_grams: 186.0,
    design_files_link:
      'https://www.dropbox.com/scl/fi/byqmlfrfwx3lqnhqavlht/Burke_Interior_053018_ProofV3-1.pdf?rlkey=5do1sy8kh4djit8d985ho2lx7&st=1059xaf9&dl=0',
  },
  // Before This Place Filled with Zombies
  {
    anthology_id: 18,
    binding_type: 'Perfect Bound',
    dimensions: '8"x6"',
    printed_by: 'Thompson-Shore',
    foreword_author: 'Lois Lowry',
    page_count: 168,
    print_run: 48,
    number_of_students: 40,
    weight_in_grams: 2.86,
    design_files_link:
      'https://www.dropbox.com/scl/fo/x8xa32xurqruyjfmr7jyd/ADzPycWZyKUtYwMyo_ieAlI?rlkey=cnv73nixdlymtckb3xloabhxm&st=axrciw31&dl=0',
  },
  // I’m a Flame You Can’t Put Out
  {
    anthology_id: 19,
    binding_type: 'Perfect Bound',
    dimensions: '6"x9"',
    printed_by: 'McNaughton and Gunn Inc.',
    foreword_author: 'Ben Parad',
    page_count: 202,
    number_of_students: 43,
    printing_cost: 3200.0,
    weight_in_grams: 386.0,
  },
  // My Generation Can
  {
    anthology_id: 20,
    binding_type: 'Perfect Bound',
    dimensions: '6"x9"',
    printed_by: 'Country Press',
    foreword_author: 'Sonia Chang-Díaz',
    page_count: 100,
    weight_in_grams: 301.0,
    design_files_link:
      'https://www.dropbox.com/scl/fo/6xtv7s7qrsrodxt2kw3rn/AC_B25Lwwp17cylczNG1n9g?rlkey=4q7j6h6i8j5s7604rco72wdon&st=7wp6geqy&dl=0',
  },
  // What if the World Needs You?
  {
    anthology_id: 21,
    binding_type: 'Perfect Bound',
    dimensions: '11"x8.5"',
    printed_by: 'PaperGraphics',
    foreword_author: 'Meredith Goldstein',
    page_count: 245,
    print_run: 600,
    number_of_students: 91,
    printing_cost: 8548.28,
    design_files_link:
      'https://www.dropbox.com/s/d09jdd4i4elij8z/what if the world needs you_FULL.pdf?st=tc9mgpir&dl=0',
  },
  // 85 Cents Might Not Sound Like a Lot
  {
    anthology_id: 22,
    binding_type: 'Perfect Bound',
    dimensions: '8.5"x11" (Letter)',
    printed_by: 'Puritan Capital',
    page_count: 71,
    print_run: 500,
    number_of_students: 36,
    printing_cost: 8972.0,
  },
  // I Was Meant For This
  {
    anthology_id: 23,
    binding_type: 'Perfect Bound',
    dimensions: '6"x9.5"',
    printed_by: 'PaperGraphics',
    foreword_author: 'Adrian Walker',
    page_count: 146,
    print_run: 500,
    number_of_students: 40,
    printing_cost: 4315.58,
    weight_in_grams: 306.0,
    design_files_link:
      'https://drive.google.com/drive/folders/1-mTIYFIb8zE2OYvPVPxL0XvkWIl51k5o?usp=sharing',
  },
  // We Think You’re Old Enough to Know
  {
    anthology_id: 24,
    binding_type: 'Perfect Bound',
    dimensions: '8"x8"',
    foreword_author: 'Steve Carell',
    page_count: 175,
    weight_in_grams: 463.0,
  },
  // We Turned Back to See Where We Came From
  {
    anthology_id: 25,
    binding_type: 'Perfect Bound',
    dimensions: '6.5"x6.5"',
    printed_by: 'Westcan Printing Group',
    foreword_author: 'Maria Hinojosa',
    page_count: 136,
    number_of_students: 31,
    weight_in_grams: 246.0,
    design_files_link:
      'https://www.dropbox.com/scl/fi/3fmp0loowtb05mcauovhl/The-Making-of-We-Turned-Back-to-See-Where-We-Came-From.mp4?rlkey=ndjyiesvawje3fbytz77tjvu7&st=v8oqwpkx&dl=0',
  },
  // I Rate Today a -1,000
  {
    anthology_id: 26,
    binding_type: 'Perfect Bound',
    dimensions: '6"x9"',
    printed_by: 'McNaughton and Gunn Inc.',
    foreword_author: 'Jeff Kinney',
    page_count: 314,
    print_run: 600,
    number_of_students: 68,
    printing_cost: 2982.73,
    weight_in_grams: 506.0,
  },
  // Invincible: Book 1
  {
    anthology_id: 27,
    binding_type: 'Tape Bound/Binding Strips',
    dimensions: '4.25"x5.5"(Quarter Letter)',
    printed_by: 'FlashPrint',
    page_count: 195,
    print_run: 152,
    number_of_students: 37,
    printing_cost: 373.92,
    weight_in_grams: 125.0,
  },
  // Oh My Chocolate
  {
    anthology_id: 28,
    binding_type: 'Tape Bound/Binding Strips',
    dimensions: '4.25"x5.5"(Quarter Letter)',
    printed_by: 'FlashPrint',
    page_count: 122,
    print_run: 188,
    printing_cost: 402.32,
    weight_in_grams: 83.0,
    design_files_link:
      'https://www.dropbox.com/scl/fo/erla0ypev9em9mtdxit0u/AKDX9WUhvUCNwP8OvSD5DQY?rlkey=syad25l2mm0vsmw1sgb54vmkh&st=te2vojzz&dl=0',
  },
  // Wait, Whaaa? Where Am I?
  {
    anthology_id: 29,
    binding_type: 'Tape Bound/Binding Strips',
    printed_by: 'FlashPrint',
    page_count: 196,
    print_run: 160,
    number_of_students: 23,
    printing_cost: 472.0,
    design_files_link:
      'https://826boston.org/publications/wait-whaaa-where-am-i/',
  },
  // Small Things Can Grow Tall
  {
    anthology_id: 30,
    binding_type: 'Tape Bound/Binding Strips',
    dimensions: '5.5"x8.5" (Half-Letter)',
    foreword_author: 'Sherman Alexie',
    page_count: 124,
    weight_in_grams: 188.0,
  },
  // Rubix Literary Magazine #9: The Connections Issue
  {
    anthology_id: 31,
    binding_type: 'Perfect Bound',
    printed_by: 'Country Press',
    page_count: 84,
    number_of_students: 23,
  },
];
