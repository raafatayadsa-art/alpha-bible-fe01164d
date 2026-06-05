import imgChurch from "@/assets/home/card-church.jpg";
import imgMass from "@/assets/home/news-mass.jpg";
import imgCandle from "@/assets/home/news-candle.jpg";
import imgYouth from "@/assets/home/news-youth.jpg";
import imgHeavenly from "@/assets/home/heavenly-church.png";
import imgAgpeya from "@/assets/home/card-agpeya.jpg";
import imgKatameros from "@/assets/home/card-katameros.jpg";
import imgChildren from "@/assets/home/card-children.jpg";

export type PlaceKind = "church" | "monastery" | "landmark";

export type ServiceTime = { label: string; time: string };

export type ChurchPlace = {
  id: string;
  name: string;
  type: string;            // e.g. "كنيسة قبطية أرثوذكسية"
  description: string;
  city: string;
  region?: string;
  country: string;         // Arabic country name
  countryFlag: string;     // Emoji flag
  kind: PlaceKind;
  distanceKm: number;
  image: string;
  coords: { lat: number; lng: number };
  priest?: string;
  phone?: string;
  email?: string;
  website?: string;
  address: string;
  serviceTimes?: ServiceTime[];
  liturgy?: ServiceTime[];
  meetings?: ServiceTime[];
  liveStream?: boolean;
};

export const CHURCH_PLACES: ChurchPlace[] = [
  {
    id: "mar-girgis-nasr",
    name: "كنيسة الشهيد مار جرجس",
    type: "كنيسة قبطية أرثوذكسية",
    description:
      "كنيسة عريقة في قلب مدينة نصر، تخدم آلاف الأسر بليتورجيات يومية وخدمات شبابية وتربوية متكاملة.",
    city: "مدينة نصر",
    region: "القاهرة",
    country: "مصر",
    countryFlag: "🇪🇬",
    kind: "church",
    distanceKm: 0.4,
    image: imgChurch,
    coords: { lat: 30.0626, lng: 31.347 },
    priest: "القمص بولس عطية",
    phone: "+20 2 2401 0000",
    email: "info@margergesnasr.org",
    website: "https://margergesnasr.org",
    address: "شارع عباس العقاد، مدينة نصر، القاهرة، مصر",
    serviceTimes: [
      { label: "تسبحة باكر", time: "6:30 صباحًا" },
      { label: "رفع بخور عشية", time: "5:30 مساءً" },
    ],
    liturgy: [
      { label: "قداس الأحد", time: "7:00 — 10:30 صباحًا" },
      { label: "قداس الجمعة", time: "8:00 — 11:00 صباحًا" },
    ],
    meetings: [
      { label: "اجتماع الشباب", time: "الجمعة 7:30 مساءً" },
      { label: "مدارس الأحد", time: "الأحد 11:00 صباحًا" },
    ],
    liveStream: true,
  },
  {
    id: "anba-rweis",
    name: "الكاتدرائية المرقسية — الأنبا رويس",
    type: "كاتدرائية قبطية أرثوذكسية",
    description:
      "مقر البابا ومركز الكرازة المرقسية، تستضيف القداسات البطريركية والاحتفالات الكبرى.",
    city: "العباسية",
    region: "القاهرة",
    country: "مصر",
    countryFlag: "🇪🇬",
    kind: "church",
    distanceKm: 3.2,
    image: imgMass,
    coords: { lat: 30.0723, lng: 31.2773 },
    priest: "قداسة البابا تواضروس الثاني",
    phone: "+20 2 2682 5374",
    website: "https://copticorthodox.church",
    address: "شارع رمسيس، العباسية، القاهرة، مصر",
    liturgy: [{ label: "قداس الأحد البطريركي", time: "8:00 — 11:30 صباحًا" }],
    liveStream: true,
  },
  {
    id: "muallaqa",
    name: "الكنيسة المعلقة",
    type: "كنيسة أثرية قبطية",
    description:
      "من أقدم كنائس مصر، شُيّدت فوق برجي حصن بابليون الروماني وتحمل تراثًا فنيًا ولاهوتيًا فريدًا.",
    city: "مصر القديمة",
    region: "القاهرة",
    country: "مصر",
    countryFlag: "🇪🇬",
    kind: "landmark",
    distanceKm: 9.1,
    image: imgHeavenly,
    coords: { lat: 30.005, lng: 31.2299 },
    address: "شارع مار جرجس، مصر القديمة، القاهرة، مصر",
    serviceTimes: [{ label: "زيارة سياحية", time: "9 صباحًا — 4 مساءً" }],
  },
  {
    id: "abu-serga",
    name: "كنيسة أبو سرجة",
    type: "كنيسة أثرية قبطية",
    description:
      "تُعرف بمغارة العائلة المقدسة، يُعتقد أن السيد المسيح ووالدته القديسة مريم استراحوا فيها خلال رحلة العائلة إلى مصر.",
    city: "مصر القديمة",
    region: "القاهرة",
    country: "مصر",
    countryFlag: "🇪🇬",
    kind: "landmark",
    distanceKm: 9.4,
    image: imgCandle,
    coords: { lat: 30.0055, lng: 31.2316 },
    address: "حارة كنيسة مار جرجس، مصر القديمة، القاهرة، مصر",
  },
  {
    id: "deir-makar",
    name: "دير القديس أنبا مقار",
    type: "دير قبطي أرثوذكسي",
    description:
      "أحد أقدم وأهم أديرة وادي النطرون، يضم رفات الكثير من القديسين والباباوات السكندريين.",
    city: "وادي النطرون",
    region: "البحيرة",
    country: "مصر",
    countryFlag: "🇪🇬",
    kind: "monastery",
    distanceKm: 92,
    image: imgKatameros,
    coords: { lat: 30.3527, lng: 30.3463 },
    address: "وادي النطرون، البحيرة، مصر",
    liturgy: [{ label: "قداس يومي", time: "4:00 صباحًا" }],
  },
  {
    id: "deir-baramous",
    name: "دير البراموس",
    type: "دير قبطي أرثوذكسي",
    description:
      "أقدم أديرة وادي النطرون، أسسه القديس مقاريوس على اسم القديسين مكسيموس ودوماديوس.",
    city: "وادي النطرون",
    region: "البحيرة",
    country: "مصر",
    countryFlag: "🇪🇬",
    kind: "monastery",
    distanceKm: 96,
    image: imgAgpeya,
    coords: { lat: 30.4044, lng: 30.3211 },
    address: "وادي النطرون، البحيرة، مصر",
  },
  {
    id: "deir-suryan",
    name: "دير السريان",
    type: "دير قبطي أرثوذكسي",
    description:
      "يحتوي على مكتبة من أعرق المكتبات القبطية وأيقونات نادرة يعود تاريخها لقرون.",
    city: "وادي النطرون",
    region: "البحيرة",
    country: "مصر",
    countryFlag: "🇪🇬",
    kind: "monastery",
    distanceKm: 95,
    image: imgChildren,
    coords: { lat: 30.3556, lng: 30.3553 },
    address: "وادي النطرون، البحيرة، مصر",
  },
  {
    id: "deir-anba-bishoy",
    name: "دير الأنبا بيشوي",
    type: "دير قبطي أرثوذكسي",
    description:
      "يضم جسد القديس أنبا بيشوي حبيب مخلصنا الصالح، ومقصد للحجاج من كل أنحاء العالم.",
    city: "وادي النطرون",
    region: "البحيرة",
    country: "مصر",
    countryFlag: "🇪🇬",
    kind: "monastery",
    distanceKm: 94,
    image: imgYouth,
    coords: { lat: 30.348, lng: 30.358 },
    address: "وادي النطرون، البحيرة، مصر",
    liveStream: true,
  },
  {
    id: "st-mary-zeitoun",
    name: "كنيسة العذراء بالزيتون",
    type: "كنيسة قبطية أرثوذكسية",
    description:
      "موقع ظهور السيدة العذراء مريم عام 1968، ومن أشهر مزارات العذراء في العالم.",
    city: "الزيتون",
    region: "القاهرة",
    country: "مصر",
    countryFlag: "🇪🇬",
    kind: "church",
    distanceKm: 5.6,
    image: imgChurch,
    coords: { lat: 30.1264, lng: 31.3127 },
    priest: "القمص يوحنا ميلاد",
    address: "شارع التومنباي، الزيتون، القاهرة، مصر",
    liturgy: [{ label: "قداس الأحد", time: "7:30 — 10:30 صباحًا" }],
  },
  {
    id: "st-anthony",
    name: "دير القديس أنطونيوس",
    type: "دير قبطي أرثوذكسي",
    description:
      "أقدم دير مسيحي في العالم، أسسه أتباع أب الرهبان القديس أنطونيوس في القرن الرابع.",
    city: "الزعفرانة",
    region: "البحر الأحمر",
    country: "مصر",
    countryFlag: "🇪🇬",
    kind: "monastery",
    distanceKm: 280,
    image: imgMass,
    coords: { lat: 28.9219, lng: 32.3506 },
    address: "جبل القلزم، البحر الأحمر، مصر",
  },
  {
    id: "mar-girgis-khobar",
    name: "كنيسة الشهيد مار جرجس",
    type: "كنيسة قبطية أرثوذكسية",
    description:
      "كنيسة قبطية تخدم الجالية المصرية في المنطقة الشرقية بالمملكة العربية السعودية.",
    city: "الخبر",
    region: "المنطقة الشرقية",
    country: "السعودية",
    countryFlag: "🇸🇦",
    kind: "church",
    distanceKm: 1450,
    image: imgChurch,
    coords: { lat: 26.2172, lng: 50.1971 },
    priest: "القس مرقس فايز",
    address: "الخبر، المنطقة الشرقية، المملكة العربية السعودية",
    liturgy: [{ label: "قداس الجمعة", time: "8:00 — 11:00 صباحًا" }],
  },
  {
    id: "st-mark-riyadh",
    name: "كنيسة القديس مارمرقس",
    type: "كنيسة قبطية أرثوذكسية",
    description:
      "تخدم العائلات القبطية في العاصمة الرياض وتقدم خدمات تربوية وأسرية متكاملة.",
    city: "الرياض",
    region: "منطقة الرياض",
    country: "السعودية",
    countryFlag: "🇸🇦",
    kind: "church",
    distanceKm: 1610,
    image: imgMass,
    coords: { lat: 24.7136, lng: 46.6753 },
    priest: "القس بيشوي عماد",
    address: "الرياض، المملكة العربية السعودية",
  },
  {
    id: "st-george-dubai",
    name: "كنيسة الشهيد مار جرجس",
    type: "كنيسة قبطية أرثوذكسية",
    description:
      "إيبارشية الخليج، تخدم الأقباط في الإمارات وتقدم قداسات يومية ومناسبات روحية.",
    city: "جبل علي، دبي",
    region: "دبي",
    country: "الإمارات",
    countryFlag: "🇦🇪",
    kind: "church",
    distanceKm: 2400,
    image: imgYouth,
    coords: { lat: 24.9824, lng: 55.1216 },
    priest: "القمص أنطونيوس صموئيل",
    address: "جبل علي، دبي، الإمارات العربية المتحدة",
    liturgy: [{ label: "قداس الجمعة", time: "7:00 — 10:30 صباحًا" }],
    liveStream: true,
  },
];

export const KIND_LABEL: Record<PlaceKind, string> = {
  church: "كنيسة",
  monastery: "دير",
  landmark: "مزار",
};

export const PLACE_STATS = {
  churches: CHURCH_PLACES.filter((p) => p.kind === "church").length,
  monasteries: CHURCH_PLACES.filter((p) => p.kind === "monastery").length,
  landmarks: CHURCH_PLACES.filter((p) => p.kind === "landmark").length,
};

export function mapsUrlFor(p: Pick<ChurchPlace, "coords">) {
  return `https://www.google.com/maps/search/?api=1&query=${p.coords.lat},${p.coords.lng}`;
}

export function findPlace(id: string) {
  return CHURCH_PLACES.find((p) => p.id === id);
}

export function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} م`;
  if (km < 100) return `${km.toFixed(1)} كم`;
  return `${Math.round(km)} كم`;
}

/* ---------- Recently viewed (localStorage) ---------- */
const RECENT_KEY = "alpha:church-directory:recent";
const RECENT_MAX = 6;

export function getRecentPlaceIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x: unknown) => typeof x === "string") : [];
  } catch { return []; }
}

export function pushRecentPlace(id: string) {
  if (typeof window === "undefined") return;
  try {
    const current = getRecentPlaceIds().filter((x) => x !== id);
    current.unshift(id);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(current.slice(0, RECENT_MAX)));
  } catch { /* ignore */ }
}
