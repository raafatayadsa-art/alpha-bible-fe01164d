import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  Leaf,
  Headphones,
  HandHeart,
  Radio as RadioIcon,
  Church,
  Baby,
  MapPin,
  Check,
  Tv,
} from "lucide-react";
import splashImage from "@/assets/splash.png";


export const Route = createFileRoute("/onboarding")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "اختر اهتماماتك — ألفا" },
      {
        name: "description",
        content: "اختر اهتماماتك لنقدم لك تجربة روحية مخصصة كل يوم.",
      },
    ],
  }),
  component: OnboardingScreen,
});

type Interest = {
  id: string;
  title: string;
  description: string;
  Icon: typeof BookOpen;
  tint: string; // gradient classes for the icon disc
  ring: string; // shadow color for the disc
  titleColor: string;
};

const INTERESTS: Interest[] = [
  {
    id: "bible",
    title: "الكتاب المقدس",
    description: "قراءة وتأمل في كلمة الله كل يوم",
    Icon: BookOpen,
    tint: "from-[#6b4a8a] to-[#3f2a5a]",
    ring: "shadow-[0_10px_24px_-10px_rgba(90,55,140,0.55)]",
    titleColor: "text-[#3f2a5a]",
  },
  {
    id: "devotions",
    title: "تأملات يومية",
    description: "كلام روحي ملهم لبداية يومك",
    Icon: Leaf,
    tint: "from-[#5d7a3a] to-[#36501f]",
    ring: "shadow-[0_10px_24px_-10px_rgba(70,100,40,0.55)]",
    titleColor: "text-[#36501f]",
  },
  {
    id: "audio",
    title: "صوتيات وترانيم",
    description: "استمع إلى صوتيات وترانيم ملهمة",
    Icon: Headphones,
    tint: "from-[#b04a32] to-[#7a2e1c]",
    ring: "shadow-[0_10px_24px_-10px_rgba(150,55,30,0.55)]",
    titleColor: "text-[#7a2e1c]",
  },
  {
    id: "prayer",
    title: "دعم وصلاة",
    description: "اطلب وصلوات ودعم في وقت احتياجك",
    Icon: HandHeart,
    tint: "from-[#d6a849] to-[#9a7626]",
    ring: "shadow-[0_10px_24px_-10px_rgba(180,140,50,0.6)]",
    titleColor: "text-[#7a5a18]",
  },
  {
    id: "live",
    title: "البث المباشر",
    description: "شاهد البث المباشر للخدمات والبرامج",
    Icon: Tv,
    tint: "from-[#6b4a8a] to-[#3f2a5a]",
    ring: "shadow-[0_10px_24px_-10px_rgba(90,55,140,0.55)]",
    titleColor: "text-[#3f2a5a]",
  },
  {
    id: "radio",
    title: "راديو الكنيسة",
    description: "استمع لراديو الكنيسة على مدار اليوم",
    Icon: RadioIcon,
    tint: "from-[#3a5d8a] to-[#1f3a5c]",
    ring: "shadow-[0_10px_24px_-10px_rgba(40,80,140,0.55)]",
    titleColor: "text-[#1f3a5c]",
  },
  {
    id: "churches",
    title: "الكنائس",
    description: "ابحث عن الكنائس وتعرف على خدماتها",
    Icon: Church,
    tint: "from-[#3a5d8a] to-[#1f3a5c]",
    ring: "shadow-[0_10px_24px_-10px_rgba(40,80,140,0.55)]",
    titleColor: "text-[#1f3a5c]",
  },
  {
    id: "kids",
    title: "أطفالنا",
    description: "محتوى آمن وممتع للأطفال",
    Icon: Baby,
    tint: "from-[#c44a32] to-[#7a2c1c]",
    ring: "shadow-[0_10px_24px_-10px_rgba(180,70,40,0.55)]",
    titleColor: "text-[#7a2c1c]",
  },
  {
    id: "map",
    title: "الخريطة",
    description: "اكتشف الكنائس القريبة واتجاهات الوصول",
    Icon: MapPin,
    tint: "from-[#6b4a8a] to-[#3f2a5a]",
    ring: "shadow-[0_10px_24px_-10px_rgba(90,55,140,0.55)]",
    titleColor: "text-[#3f2a5a]",
  },
];

function OnboardingScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pressed, setPressed] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const canContinue = selected.size > 0 && !leaving;

  const handleContinue = () => {
    if (!canContinue) return;
    try {
      localStorage.setItem(
        "alpha.interests",
        JSON.stringify(Array.from(selected)),
      );
    } catch {
      // ignore storage errors
    }
    setLeaving(true);
    setTimeout(() => navigate({ to: "/books" }), 350);
  };

  return (
    <div
      dir="rtl"
      className="relative h-screen w-screen overflow-hidden"
    >
      {/* Original splash background — untouched */}
      <img
        src={splashImage}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-center"
        draggable={false}
      />
      {/* Soft warm wash so cards read clearly on top of artwork */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(244,234,216,0.35) 0%, rgba(244,234,216,0.55) 45%, rgba(244,234,216,0.8) 100%)",
        }}
      />

      <main className="relative z-10 flex h-full w-full max-w-md mx-auto flex-col px-4 pt-6 pb-[14%]">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[22px] font-bold leading-tight text-[#2a3a6e]">
            اختر اهتماماتك
          </h1>
          <p className="mt-1 text-[12px] leading-snug text-[#6b5836]">
            لنقدم لك تجربة مخصصة تلهم روحك كل يوم
          </p>
        </div>

        {/* Interests grid — fills remaining height, equal-size cards, no scroll */}
        <ul className="mt-3 grid flex-1 min-h-0 grid-cols-3 grid-rows-3 gap-2">
          {INTERESTS.map((it) => {
            const isSelected = selected.has(it.id);
            return (
              <li key={it.id} className="min-h-0">
                <button
                  type="button"
                  onClick={() => toggle(it.id)}
                  aria-pressed={isSelected}
                  className={[
                    "relative flex h-full w-full flex-col items-center justify-center rounded-2xl px-1.5 py-2",
                    "border transition-all duration-300 ease-out backdrop-blur-md",
                    "active:scale-[0.97]",
                    isSelected
                      ? "border-[#d6a849]/80 bg-[rgba(255,247,225,0.92)] shadow-[0_10px_24px_-12px_rgba(214,168,73,0.65),0_0_0_3px_rgba(214,168,73,0.18)]"
                      : "border-white/60 bg-[rgba(255,250,235,0.7)] shadow-[0_6px_16px_-12px_rgba(120,90,40,0.4)]",
                  ].join(" ")}
                >
                  <span
                    aria-hidden
                    className={[
                      "absolute left-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border transition-all",
                      isSelected
                        ? "border-[#d6a849] bg-gradient-to-b from-[#e7c97a] to-[#b8862e] text-white shadow-[0_2px_6px_rgba(180,130,40,0.5)]"
                        : "border-[#d8c89a]/70 bg-white/70",
                    ].join(" ")}
                  >
                    {isSelected ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                  </span>

                  <span
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b ring-1 ring-white/40",
                      it.tint,
                      it.ring,
                    ].join(" ")}
                  >
                    <it.Icon className="h-5 w-5 text-white" strokeWidth={1.8} />
                  </span>

                  <span
                    className={[
                      "mt-1.5 text-[11px] font-bold leading-tight text-center",
                      it.titleColor,
                    ].join(" ")}
                  >
                    {it.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </main>

      {/* Fixed bottom CTA — matches splash button (size/position/color) */}
      <button
        type="button"
        disabled={!canContinue}
        onClick={handleContinue}
        onPointerDown={() => canContinue && setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        onPointerCancel={() => setPressed(false)}
        aria-label="ابدأ رحلتك الروحية"
        className={[
          "absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center rounded-full",
          "text-[15px] font-bold text-white",
          "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "bg-gradient-to-b from-[#e7c97a] via-[#d4a849] to-[#a8782a]",
          "shadow-[0_14px_28px_-10px_rgba(180,130,40,0.55),0_0_0_1px_rgba(255,240,200,0.4)_inset]",
          canContinue ? "opacity-100" : "opacity-60",
          pressed && canContinue ? "scale-[0.97]" : "scale-100",
        ].join(" ")}
        style={{ bottom: "55px", width: "70%", height: "58px" }}
      >
        ابدأ رحلتك الروحية
      </button>

      {/* Leave veil */}
      <div
        aria-hidden
        className={[
          "pointer-events-none fixed inset-0 z-30 bg-[#f4ead8] transition-opacity duration-300",
          leaving ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
    </div>
  );
}

