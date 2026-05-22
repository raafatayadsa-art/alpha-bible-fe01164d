// Canonical Arabic Van Dyke book names for grouping & ordering.
export const OLD_TESTAMENT: string[] = [
  "التكوين", "الخروج", "اللاويين", "العدد", "التثنية",
  "يشوع", "القضاة", "راعوث",
  "صموئيل الأول", "صموئيل الثاني",
  "الملوك الأول", "الملوك الثاني",
  "أخبار الأيام الأول", "أخبار الأيام الثاني",
  "عزرا", "نحميا", "أستير", "أيوب",
  "المزامير", "الأمثال", "الجامعة", "نشيد الأنشاد",
  "إشعياء", "إرميا", "مراثي إرميا", "حزقيال", "دانيال",
  "هوشع", "يوئيل", "عاموس", "عوبديا", "يونان",
  "ميخا", "ناحوم", "حبقوق", "صفنيا", "حجي", "زكريا", "ملاخي",
];

export const NEW_TESTAMENT: string[] = [
  "متى", "مرقس", "لوقا", "يوحنا", "أعمال الرسل",
  "رومية", "كورنثوس الأولى", "كورنثوس الثانية",
  "غلاطية", "أفسس", "فيلبي", "كولوسي",
  "تسالونيكي الأولى", "تسالونيكي الثانية",
  "تيموثاوس الأولى", "تيموثاوس الثانية",
  "تيطس", "فليمون", "العبرانيين", "يعقوب",
  "بطرس الأولى", "بطرس الثانية",
  "يوحنا الأولى", "يوحنا الثانية", "يوحنا الثالثة",
  "يهوذا", "رؤيا يوحنا",
];

const NT_SET = new Set(NEW_TESTAMENT);

function norm(s: string): string {
  return s
    .replace(/[\u064B-\u065F\u0670]/g, "") // diacritics
    .replace(/[إأآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();
}

const OT_NORM = new Map(OLD_TESTAMENT.map((b, i) => [norm(b), i]));
const NT_NORM = new Map(NEW_TESTAMENT.map((b, i) => [norm(b), i]));

export function groupBooks(books: string[]): {
  old: string[];
  neu: string[];
  other: string[];
} {
  const old: string[] = [];
  const neu: string[] = [];
  const other: string[] = [];
  for (const b of books) {
    const n = norm(b);
    if (OT_NORM.has(n)) old.push(b);
    else if (NT_NORM.has(n) || NT_SET.has(b)) neu.push(b);
    else other.push(b);
  }
  const orderOT = (a: string, b: string) =>
    (OT_NORM.get(norm(a)) ?? 999) - (OT_NORM.get(norm(b)) ?? 999);
  const orderNT = (a: string, b: string) =>
    (NT_NORM.get(norm(a)) ?? 999) - (NT_NORM.get(norm(b)) ?? 999);
  old.sort(orderOT);
  neu.sort(orderNT);
  other.sort();
  return { old, neu, other };
}
