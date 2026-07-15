/**
 * DEMO ONLY — product→aisle classification from brand & product knowledge
 * (SA / grocery retail commons), NOT naive “substring in name” keywords.
 *
 * Used with the offline barcode index while live categories are unavailable.
 * Prefer looking up `data/demo-category-by-barcode.json` (built by
 * `scripts/build-demo-categories.mjs`) so runtime is stable.
 */

import { CATEGORIES } from "@/lib/catalog";
import { normalizeSearchText } from "@/lib/search-query";

export type DemoAisleSlug = (typeof CATEGORIES)[number]["slug"];

type Rule = {
  slug: DemoAisleSlug;
  /** Match if any phrase appears as a whole-ish token sequence in the name */
  phrases: string[];
};

function categoryMeta(slug: string): { name: string; slug: string } | null {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return null;
  return { name: cat.name, slug: cat.slug };
}

/** Match phrase as substring only when bounded sensibly (avoid “wine” in “wine gums”). */
function includesPhrase(name: string, phrase: string): boolean {
  const p = normalizeSearchText(phrase);
  if (!p) return false;
  if (!name.includes(p)) return false;
  // prefer word-boundary-ish: start, end, or spaces around
  const re = new RegExp(
    `(^|\\s)${p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`
  );
  if (re.test(name)) return true;
  // allow compact joins for brands like cocacola already normalized
  return name.includes(` ${p}`) || name.startsWith(p);
}

/**
 * Known brands → primary aisle (retail knowledge).
 * Checked as a leading brand token / early in the product name.
 */
const BRAND_AISLES: { brand: string; slug: DemoAisleSlug }[] = [
  // Dairy
  { brand: "clover", slug: "milk-dairy" },
  { brand: "parmalat", slug: "milk-dairy" },
  { brand: "lancewood", slug: "milk-dairy" },
  { brand: "danone", slug: "milk-dairy" },
  { brand: "first choice", slug: "milk-dairy" },
  { brand: "fair cape", slug: "milk-dairy" },
  { brand: "woolworths milk", slug: "milk-dairy" },
  // Soft drinks / juice
  { brand: "coca-cola", slug: "beverages-juices" },
  { brand: "coca cola", slug: "beverages-juices" },
  { brand: "cocacola", slug: "beverages-juices" },
  { brand: "sprite", slug: "beverages-juices" },
  { brand: "fanta", slug: "beverages-juices" },
  { brand: "sparletta", slug: "beverages-juices" },
  { brand: "stoney", slug: "beverages-juices" },
  { brand: "appletiser", slug: "beverages-juices" },
  { brand: "tropika", slug: "beverages-juices" },
  { brand: "oros", slug: "beverages-juices" },
  { brand: "liquifruit", slug: "beverages-juices" },
  { brand: "cappy", slug: "beverages-juices" },
  { brand: "krush", slug: "beverages-juices" },
  { brand: "aquelle", slug: "beverages-juices" },
  { brand: "thirsti", slug: "beverages-juices" },
  { brand: "bonaqua", slug: "beverages-juices" },
  { brand: "powerade", slug: "beverages-juices" },
  { brand: "energade", slug: "beverages-juices" },
  { brand: "monster", slug: "beverages-juices" },
  { brand: "red bull", slug: "beverages-juices" },
  { brand: "nescafe", slug: "beverages-juices" },
  { brand: "nescafé", slug: "beverages-juices" },
  { brand: "jacobs", slug: "beverages-juices" },
  { brand: "ricoffy", slug: "beverages-juices" },
  { brand: "five roses", slug: "beverages-juices" },
  { brand: "rooibos", slug: "beverages-juices" },
  // Coffee/tea also via product type
  // Cleaning / laundry
  { brand: "omo", slug: "cleaning" },
  { brand: "sunlight", slug: "cleaning" },
  { brand: "sta-soft", slug: "cleaning" },
  { brand: "stasoft", slug: "cleaning" },
  { brand: "domestos", slug: "cleaning" },
  { brand: "jik", slug: "cleaning" },
  { brand: "harpic", slug: "cleaning" },
  { brand: "dettol", slug: "cleaning" },
  { brand: "plush", slug: "cleaning" },
  { brand: "handy andy", slug: "cleaning" },
  { brand: "mr muscle", slug: "cleaning" },
  { brand: "glade", slug: "household" },
  // Personal care / beauty
  { brand: "nivea", slug: "skincare" },
  { brand: "dove", slug: "bath-and-body" },
  { brand: "colgate", slug: "toiletries" },
  { brand: "aquafresh", slug: "toiletries" },
  { brand: "sensodyne", slug: "toiletries" },
  { brand: "renew", slug: "toiletries" },
  { brand: "rexona", slug: "toiletries" },
  { brand: "shield", slug: "toiletries" },
  { brand: "revlon", slug: "makeup" },
  { brand: "maybelline", slug: "makeup" },
  { brand: "loreal", slug: "skincare" },
  { brand: "l'oreal", slug: "skincare" },
  { brand: "garnier", slug: "haircare" },
  { brand: "tresemme", slug: "haircare" },
  { brand: "pantene", slug: "haircare" },
  { brand: "head & shoulders", slug: "haircare" },
  { brand: "johnsons", slug: "kids-baby" },
  { brand: "johnson's", slug: "kids-baby" },
  { brand: "purity", slug: "kids-baby" },
  { brand: "pampers", slug: "kids-baby" },
  { brand: "huggies", slug: "kids-baby" },
  { brand: "lillets", slug: "toiletries" },
  { brand: "always", slug: "toiletries" },
  { brand: "kotex", slug: "toiletries" },
  // Food brands
  { brand: "kellogg", slug: "pantry" },
  { brand: "kellogg's", slug: "pantry" },
  { brand: "jungle", slug: "pantry" },
  { brand: "futurelife", slug: "pantry" },
  { brand: "bakers", slug: "bakery" },
  { brand: "albany", slug: "bakery" },
  { brand: "sasko", slug: "bakery" },
  { brand: "blue ribbon", slug: "bakery" },
  { brand: "snowflake", slug: "pantry" },
  { brand: "knorr", slug: "pantry" },
  { brand: "robertsons", slug: "pantry" },
  { brand: "hinds", slug: "pantry" },
  { brand: "koo", slug: "pantry" },
  { brand: "rhodes", slug: "pantry" },
  { brand: "all gold", slug: "pantry" },
  { brand: "black cat", slug: "pantry" },
  { brand: "yumnuts", slug: "pantry" },
  { brand: "cadbury", slug: "pantry" },
  { brand: "lindt", slug: "pantry" },
  { brand: "nestle", slug: "pantry" },
  { brand: "nestlé", slug: "pantry" },
  { brand: "simba", slug: "pantry" },
  { brand: "willards", slug: "pantry" },
  { brand: "maynards", slug: "pantry" },
  { brand: "beacon", slug: "pantry" },
  { brand: "mccain", slug: "frozen" },
  { brand: "sea harvest", slug: "meat-poultry-fish" },
  { brand: "eskort", slug: "meat-poultry-fish" },
  { brand: "enterprise", slug: "meat-poultry-fish" },
  { brand: "rainbow chicken", slug: "meat-poultry-fish" },
  { brand: "rainbow", slug: "meat-poultry-fish" },
  // Wine / alcohol
  { brand: "namaqua", slug: "wine-bubbles" },
  { brand: "drostdy", slug: "wine-bubbles" },
  { brand: "nederburg", slug: "wine-bubbles" },
  { brand: "castle", slug: "wine-bubbles" },
  { brand: "black label", slug: "wine-bubbles" },
  { brand: "hunter's", slug: "wine-bubbles" },
  { brand: "hunters", slug: "wine-bubbles" },
  { brand: "savanna", slug: "wine-bubbles" },
  { brand: "amstel", slug: "wine-bubbles" },
  { brand: "heineken", slug: "wine-bubbles" },
  // Pharmacy / med-ish → toiletries or skincare for demo
  { brand: "medirite", slug: "toiletries" },
  { brand: "dischem", slug: "toiletries" },
  { brand: "panado", slug: "toiletries" },
  { brand: "grand-pa", slug: "toiletries" },
  { brand: "grandpa", slug: "toiletries" },
  { brand: "cepacol", slug: "toiletries" },
  { brand: "panamor", slug: "toiletries" },
  { brand: "himalaya", slug: "skincare" },
  // Stationery / non-grocery → household catch-all for demo filters
  { brand: "staedtler", slug: "household" },
  { brand: "penflex", slug: "household" },
  { brand: "bic", slug: "household" },
];

/**
 * Product *identity* rules — what the item is.
 * More specific / disambiguating rules first.
 */
const PRODUCT_TYPE_RULES: Rule[] = [
  // Confectionery before wine / fruit words
  {
    slug: "pantry",
    phrases: [
      "wine gums",
      "wine gum",
      "jelly babies",
      "jellies",
      "sweets",
      "chocolate",
      "choc",
      "chips",
      "crisps",
      "snack bar",
      "energy bar",
      "biscuits",
      "cookies",
      "rusks",
      "chewing gum",
      "sugar free gum",
      "tomato sauce",
      "tomato ketchup",
      "ketchup",
      "flavour essence",
      "flavor essence",
      "custard",
    ],
  },
  {
    slug: "toiletries",
    phrases: [
      "deodorant",
      "anti-perspirant",
      "antiperspirant",
      "roll-on",
      "hot medication",
      "paediatric syrup",
      "pediatric syrup",
      "medicated drink",
    ],
  },
  {
    slug: "wine-bubbles",
    phrases: [
      "pinotage",
      "merlot",
      "chenin blanc",
      "chardonnay",
      "sauvignon blanc",
      "shiraz",
      "cabernet",
      "red wine",
      "white wine",
      "rose wine",
      "rosé",
      "sparkling wine",
      "methode cap",
      "brut",
      "prosecco",
      "champagne",
      "cider",
      "lager",
      "pilsener",
      "pilsner",
      "beer",
      "ale",
      "wine box",
      "wine bottle",
      "liqueur",
      "herbal liqueur",
    ],
  },
  {
    slug: "milk-dairy",
    phrases: [
      "full cream milk",
      "low fat milk",
      "fat free milk",
      "uht milk",
      "fresh milk",
      "drinking yoghurt",
      "drinking yogurt",
      "double cream yoghurt",
      "greek yoghurt",
      "plain yoghurt",
      "flavoured yoghurt",
      "cottage cheese",
      "cream cheese",
      "cheddar",
      "gouda",
      "mozzarella",
      "feta",
      "butter",
      "margarine",
      "whipping cream",
      "fresh cream",
      "ama",
      "maas",
      "inkomazi",
    ],
  },
  {
    slug: "meat-poultry-fish",
    phrases: [
      "boerewors",
      "wors",
      "biltong",
      "droewors",
      "chicken",
      "beef mince",
      "mince",
      "beef",
      "pork",
      "lamb",
      "bacon",
      "ham",
      "polony",
      "viennas",
      "sausage",
      "steak",
      "fillets",
      "fish fillet",
      "hake",
      "tuna",
      "salmon",
      "prawn",
      "calamari",
    ],
  },
  {
    slug: "frozen",
    phrases: [
      "ice cream",
      "ice-cream",
      "frozen",
      "crumbed fish",
      "oven chips",
      "frozen vegetables",
      "frozen veg",
    ],
  },
  {
    slug: "bakery",
    phrases: [
      "white bread",
      "brown bread",
      "seed loaf",
      "bread",
      "hot dog rolls",
      "burger buns",
      "rolls",
      "croissant",
      "muffin",
      "cupcake",
      "cake",
      "tart",
      "pastry",
      "wraps",
      "tortilla",
      "pita",
    ],
  },
  {
    slug: "fruits-vegetables",
    phrases: [
      "per kg",
      "punnet",
      "fresh produce",
      "baby spinach",
      "iceberg lettuce",
      "butter lettuce",
      "english cucumber",
      "cherry tomato",
      "rosa tomato",
      "sweet potato",
      "butternut",
      "gem squash",
      "avocado",
      "bananas",
      "apples",
      "oranges",
      "carrots",
      "broccoli",
      "cauliflower",
      "mangoes",
      "pears",
      "lemons",
      "grapes",
      "strawberries",
      "blueberries",
      "raspberries",
      "spinach",
    ],
  },
  {
    slug: "beverages-juices",
    phrases: [
      "soft drink",
      "cold drink",
      "carbonated",
      "cola",
      "fruit juice",
      "100% juice",
      "juice blend",
      "energy drink",
      "sports drink",
      "mineral water",
      "sparkling water",
      "still water",
      "flavoured water",
      "iced tea",
      "instant coffee",
      "coffee capsules",
      "tea bags",
      "rooibos tea",
      "burst drink",
      "sports drink",
    ],
  },
  {
    slug: "cleaning",
    phrases: [
      "washing powder",
      "laundry liquid",
      "fabric softener",
      "dishwashing liquid",
      "dishwasher",
      "bleach",
      "disinfectant",
      "multipurpose cleaner",
      "bathroom cleaner",
      "toilet cleaner",
      "floor cleaner",
      "carpet foam",
      "stain remover",
    ],
  },
  {
    slug: "household",
    phrases: [
      "toilet paper",
      "paper towel",
      "kitchen towel",
      "facial tissues",
      "tissues",
      "bin bags",
      "refuse bags",
      "cling wrap",
      "foil",
      "baking paper",
      "light bulb",
      "battery",
      "batteries",
      "candle",
      "air freshener",
    ],
  },
  {
    slug: "toiletries",
    phrases: [
      "toothpaste",
      "toothbrush",
      "mouthwash",
      "dental floss",
      "deodorant",
      "anti-perspirant",
      "antiperspirant",
      "roll-on",
      "sanitary pad",
      "sanitary pads",
      "tampon",
      "pantyliner",
      "cotton wool",
      "plasters",
      "bandage",
    ],
  },
  {
    slug: "haircare",
    phrases: [
      "shampoo",
      "conditioner",
      "hair gel",
      "hair spray",
      "hair colour",
      "hair color",
      "relaxer",
    ],
  },
  {
    slug: "skincare",
    phrases: [
      "face cream",
      "facial",
      "moisturiser",
      "moisturizer",
      "serum",
      "cleanser",
      "toner",
      "sunscreen",
      "spf",
      "day cream",
      "night cream",
      "eye cream",
    ],
  },
  {
    slug: "makeup",
    phrases: [
      "lipstick",
      "mascara",
      "foundation",
      "concealer",
      "eyeliner",
      "eyeshadow",
      "blush",
      "nail polish",
      "lipstick",
    ],
  },
  {
    slug: "fragrance",
    phrases: [
      "eau de parfum",
      "eau de toilette",
      "perfume",
      "cologne",
      "body spray",
      "edt",
      "edp",
    ],
  },
  {
    slug: "bath-and-body",
    phrases: [
      "body wash",
      "shower gel",
      "bath soap",
      "hand wash",
      "hand soap",
      "body lotion",
      "body cream",
      "bubble bath",
    ],
  },
  {
    slug: "mens-grooming",
    phrases: [
      "shave gel",
      "shaving foam",
      "aftershave",
      "razor",
      "cartridge blades",
      "beard oil",
    ],
  },
  {
    slug: "kids-baby",
    phrases: [
      "nappies",
      "nappy",
      "baby wipes",
      "baby formula",
      "infant formula",
      "from 6 months",
      "from 7 months",
      "from 8 months",
      "toddler",
      "baby food",
      "teething",
      "yogi",
      "fruiti",
      "veggi",
    ],
  },
  {
    slug: "deli",
    phrases: [
      "mayonnaise",
      "salad cream",
      "mustard",
      "chutney",
      "relish",
      "pate",
      "pâté",
    ],
  },
  {
    slug: "pantry",
    phrases: [
      "pasta",
      "spaghetti",
      "macaroni",
      "rice",
      "maize meal",
      "mealie meal",
      "flour",
      "cake flour",
      "sugar",
      "cooking oil",
      "olive oil",
      "vinegar",
      "baked beans",
      "tinned",
      "canned",
      "stock cubes",
      "soup",
      "sauce",
      "spice",
      "seasoning",
      "peanut butter",
      "jam",
      "cereal",
      "oats",
      "corn flakes",
      "noodles",
      "2 minute",
    ],
  },
  {
    slug: "cellphones",
    phrases: [
      "usb cable",
      "usb-c",
      "lightning cable",
      "phone charger",
      "earbuds",
      "earphones",
      "headphones",
      "phone case",
      "power bank",
    ],
  },
];

function matchBrand(name: string): DemoAisleSlug | null {
  for (const { brand, slug } of BRAND_AISLES) {
    const b = normalizeSearchText(brand);
    if (!b) continue;
    if (name.startsWith(b + " ") || name === b || name.startsWith(b)) {
      return slug;
    }
  }
  return null;
}

function matchProductType(name: string): DemoAisleSlug | null {
  for (const rule of PRODUCT_TYPE_RULES) {
    for (const phrase of rule.phrases) {
      if (includesPhrase(name, phrase)) return rule.slug;
    }
  }
  return null;
}

/**
 * Classify a product from what it *is* (product identity + brand knowledge).
 * DEMO ONLY — not a live retailer taxonomy.
 *
 * Specific product phrases win first (roll-on, washing powder, wine gums…);
 * known brands fill gaps. Avoids treating flavour words as fresh produce.
 */
export function classifyProductToAisle(
  productName: string
): { name: string; slug: string } | null {
  const name = normalizeSearchText(productName);
  if (!name) return null;

  const slug = matchProductType(name) ?? matchBrand(name);
  if (!slug) return null;
  return categoryMeta(slug);
}

/** @deprecated use classifyProductToAisle — kept name for earlier call sites */
export function inferDemoCategory(productName: string) {
  return classifyProductToAisle(productName);
}
