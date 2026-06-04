import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronRight, BookOpen } from "lucide-react";
import { BottomDock } from "@/components/bible/BottomDock";
import { CopticCross, CopticWatermark } from "@/components/coptic";

export const Route = createFileRoute("/katameros/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "ألفا — القطمارس" },
      { name: "description", content: "قراءات الكنيسة اليومية من القطمارس." },
    ],
  }),
  component: KatamerosHome,
});

function KatamerosHome() {
  const router = useRouter();
  return (
    <div dir="rtl" className="relative min-h-dvh bg-[#faf3e3]">
      <CopticWatermark />

      <header
        className="relative z-10 mx-auto w-full max-w-[430px] px-4 flex items-center justify-between"
        style={{ paddingTop: "max(env(safe-area-inset-top), 14px)", paddingBottom: 8 }}
      >
        <button
          type="button"
          onClick={() => router.history.back()}
          aria-label="رجوع"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/70 backdrop-blur border border-[#ead9b1] text-[#3a2a18] active:scale-90 transition-transform shadow-[0_4px_10px_-8px_rgba(120,80,30,0.5)]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <div className="flex flex-col items-center -mt-1">
          <CopticCross className="text-[#b8893a]" size={18} />
          <h1 className="font-arabic-serif text-[20px] font-extrabold text-[#3a2a18] leading-tight">
            القطمارس
          </h1>
          <p className="text-[10.5px] text-[#6a543a] -mt-0.5">قراءات الكنيسة اليومية</p>
        </div>
        <span className="h-10 w-10" aria-hidden />
      </header>

      <main
        className="relative z-10 mx-auto w-full max-w-[430px] px-4"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 110px)" }}
      >
        <div className="mt-4 rounded-2xl bg-white border border-[#ead9b1] p-6 text-center shadow-[0_14px_30px_-22px_rgba(120,80,30,0.5)]">
          <BookOpen className="mx-auto h-8 w-8 text-[#6a4ab5]" />
          <h2 className="font-arabic-serif text-[18px] font-extrabold text-[#3a2a18] mt-3">
            قراءات اليوم
          </h2>
          <p className="text-[12.5px] text-[#6a543a] mt-2 leading-relaxed">
            قريباً — ستجد هنا قراءات القطمارس اليومية: العشية والباكر والقداس،
            مرتبة حسب التقويم الكنسي.
          </p>
        </div>
      </main>

      <BottomDock />
    </div>
  );
}
