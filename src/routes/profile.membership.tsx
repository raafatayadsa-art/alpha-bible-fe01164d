import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronRight, Share2, Download, Copy, Check, ScanLine, BadgeCheck,
  Crown, Church, Hash, Calendar, X,
} from "lucide-react";
import { CopticWatermark, CopticCross } from "@/components/coptic";

export const Route = createFileRoute("/profile/membership")({
  ssr: false,
  head: () => ({
    meta: [{ title: "ألفا — بطاقة العضوية" }],
  }),
  component: MembershipScreen,
});

const MEMBER = {
  name: "مينا عاطف",
  role: "خادم مدارس الأحد",
  church: "كنيسة الشهيد مار جرجس",
  membershipNo: "AC-2024-00187",
  status: "عضو فعّال",
  joinDate: "12 يناير 2019",
  verified: true,
};

const QR_LARGE = `https://api.qrserver.com/v1/create-qr-code/?size=520x520&ecc=H&margin=2&bgcolor=fbf3e1&color=2a1a0d&data=${encodeURIComponent(
  `alpha://member/${MEMBER.membershipNo}`,
)}`;

function MembershipScreen() {
  const [copied, setCopied] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(MEMBER.membershipNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const share = async () => {
    const data = {
      title: "بطاقة عضوية Alpha Coptic",
      text: `${MEMBER.name} — ${MEMBER.membershipNo}\n${MEMBER.church}`,
      url: `https://alpha-bible.lovable.app/m/${MEMBER.membershipNo}`,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(data.url);
    } catch {}
  };

  return (
    <div dir="rtl" className="relative min-h-screen w-full overflow-x-hidden">
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 55% at 50% 0%, rgba(231,201,122,0.4), transparent 60%)," +
            "linear-gradient(180deg,#f7eed6 0%,#f4ead8 50%,#ecdcb6 100%)",
        }}
      />
      <CopticWatermark />

      <div className="relative mx-auto w-full max-w-[440px] px-4 pb-20 pt-[max(env(safe-area-inset-top),10px)]">
        <header className="flex items-center justify-between gap-2 pt-1">
          <Link to={"/profile" as any} aria-label="رجوع" className="grid h-9 w-9 place-items-center rounded-full border border-[#efe2c4] bg-white/70 backdrop-blur-xl shadow-[0_4px_12px_-8px_rgba(120,80,30,0.4)] active:scale-95 transition">
            <ChevronRight className="h-4.5 w-4.5 text-[#3a2a18]" />
          </Link>
          <h1 className="text-[14px] font-extrabold text-[#3a2a18]">بطاقة العضوية</h1>
          <button
            onClick={() => setScannerOpen(true)}
            aria-label="مسح عضو"
            className="grid h-9 w-9 place-items-center rounded-full border border-[#efe2c4] bg-white/70 backdrop-blur-xl shadow-[0_4px_12px_-8px_rgba(120,80,30,0.4)] active:scale-95 transition"
          >
            <ScanLine className="h-4 w-4 text-[#3a2a18]" />
          </button>
        </header>

        {/* Membership card */}
        <div
          className="relative mt-4 overflow-hidden rounded-[26px] border border-[#efe2c4] p-5"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 0%, rgba(231,201,122,0.4), transparent 65%)," +
              "linear-gradient(180deg,#fbf3e1 0%,#f4ead8 100%)",
            boxShadow:
              "0 22px 44px -22px rgba(120,80,30,0.55), inset 0 1px 0 rgba(255,255,255,0.85), inset 0 0 0 1px rgba(216,138,42,0.25)",
          }}
        >
          {/* manuscript texture */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, #b8893a 0.6px, transparent 1px), radial-gradient(circle at 70% 80%, #b8893a 0.6px, transparent 1px)",
              backgroundSize: "14px 14px, 18px 18px",
            }}
          />
          <div aria-hidden className="absolute -right-6 -bottom-8 text-[180px] leading-none font-bold text-[#d88a2a] opacity-[0.06] select-none">☧</div>

          <div className="relative flex items-center justify-between mb-3 pb-3 border-b border-dashed border-[#d88a2a]/40">
            <div className="flex items-center gap-1.5 text-[#b8893a]">
              <CopticCross size={14} />
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider">Alpha Coptic</span>
            </div>
            <span className="text-[10px] font-bold text-[#b8893a]">بطاقة عضوية رسمية</span>
          </div>

          {/* QR large */}
          <div className="relative mx-auto mt-2 grid place-items-center rounded-2xl bg-[#fbf3e1] p-3 border border-[#efe2c4] w-fit shadow-[inset_0_0_0_1px_rgba(216,138,42,0.3)]">
            <img src={QR_LARGE} alt="QR العضوية" className="h-[220px] w-[220px]" />
            <span
              className="absolute inset-0 m-auto grid h-[44px] w-[44px] place-items-center rounded-lg text-[20px] font-extrabold"
              style={{
                background: "linear-gradient(135deg,#fbf3e1,#f0d78c)",
                color: "#3a2a18",
                boxShadow: "0 0 0 3px #fbf3e1, 0 0 0 4.5px #b8893a, 0 4px 10px rgba(0,0,0,0.25)",
              }}
              aria-hidden
            >
              ⲁ
            </span>
          </div>

          {/* Member info */}
          <div className="relative mt-4 text-center">
            <h2 className="text-[18px] font-extrabold text-[#3a2a18]">{MEMBER.name}</h2>
            <p className="mt-0.5 text-[12px] text-[#6a543a] inline-flex items-center justify-center gap-1.5">
              <Crown className="h-3 w-3 text-[#b8893a]" /> {MEMBER.role}
            </p>
            {MEMBER.verified && (
              <span
                className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold text-white border"
                style={{
                  background: "linear-gradient(135deg, rgba(94,224,160,0.95), rgba(31,158,99,1))",
                  borderColor: "rgba(20,112,74,0.6)",
                  boxShadow: "0 0 12px rgba(46,204,113,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
                }}
              >
                <BadgeCheck className="h-3 w-3" strokeWidth={2.8} /> عضو كنسي موثق
              </span>
            )}
          </div>

          {/* Details grid */}
          <div className="relative mt-4 grid grid-cols-1 gap-2 text-[11.5px]">
            <Detail icon={<Hash className="h-3 w-3" />} label="رقم العضوية" value={MEMBER.membershipNo} mono />
            <Detail icon={<Church className="h-3 w-3" />} label="الكنيسة" value={MEMBER.church} />
            <Detail
              icon={<span className="h-1.5 w-1.5 rounded-full bg-[#2f7a4a] shadow-[0_0_6px_rgba(47,122,74,0.8)]" />}
              label="الحالة"
              value={MEMBER.status}
              valueClass="text-[#2f7a4a]"
            />
            <Detail icon={<Calendar className="h-3 w-3" />} label="تاريخ الانضمام" value={MEMBER.joinDate} />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <ActionBtn onClick={share} icon={<Share2 className="h-4 w-4" />} label="مشاركة" />
          <ActionBtn onClick={() => window.print()} icon={<Download className="h-4 w-4" />} label="حفظ" />
          <ActionBtn
            onClick={copyId}
            icon={copied ? <Check className="h-4 w-4 text-[#2f7a4a]" /> : <Copy className="h-4 w-4" />}
            label={copied ? "تم النسخ" : "نسخ الرقم"}
          />
        </div>

        {/* Scan member */}
        <button
          onClick={() => setScannerOpen(true)}
          className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl border border-[#efe2c4] bg-white/80 backdrop-blur-xl py-3.5 text-[13px] font-extrabold text-[#3a2a18] shadow-[0_8px_20px_-12px_rgba(120,80,30,0.5)] active:scale-[0.99] transition"
        >
          <ScanLine className="h-4.5 w-4.5 text-[#b8893a]" /> مسح عضو آخر
        </button>
        <p className="mt-2 text-center text-[10px] text-[#9a7e5a]">
          للتحقق من العضوية وحضور الفعاليات الكنسية
        </p>
      </div>

      {/* Scanner modal */}
      {scannerOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setScannerOpen(false)}>
          <div className="relative w-full max-w-[340px] rounded-3xl border border-[#efe2c4] bg-gradient-to-b from-[#fbf3e1] to-[#f4ead8] p-5 text-center" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setScannerOpen(false)} className="absolute top-3 left-3 grid h-8 w-8 place-items-center rounded-full bg-white/80 border border-[#efe2c4]">
              <X className="h-4 w-4 text-[#3a2a18]" />
            </button>
            <div className="mx-auto mt-2 grid h-14 w-14 place-items-center rounded-2xl border border-[#efe2c4] bg-white/70">
              <ScanLine className="h-7 w-7 text-[#b8893a]" />
            </div>
            <h3 className="mt-3 text-[15px] font-extrabold text-[#3a2a18]">مسح عضو</h3>
            <p className="mt-1 text-[11.5px] text-[#6a543a] leading-relaxed">
              وجّه الكاميرا نحو رمز QR الخاص بالعضو للتحقق من العضوية وتسجيل الحضور.
            </p>
            <div className="relative mx-auto mt-4 aspect-square w-[200px] rounded-2xl border-2 border-dashed border-[#b8893a]/50 bg-[#1e120a]/5 grid place-items-center overflow-hidden">
              <div className="absolute inset-x-4 top-1/2 h-px bg-gradient-to-r from-transparent via-[#d88a2a] to-transparent animate-pulse" />
              <span className="text-[10px] text-[#9a7e5a]">معاينة الكاميرا</span>
            </div>
            <p className="mt-3 text-[10px] text-[#9a7e5a]">قريباً — قيد التطوير</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ icon, label, value, mono, valueClass = "text-[#3a2a18]" }: { icon: React.ReactNode; label: string; value: string; mono?: boolean; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#efe2c4] bg-white/60 backdrop-blur px-3 py-2">
      <span className="text-[#9a7e5a] inline-flex items-center gap-1.5">{icon} {label}</span>
      <span className={`${valueClass} font-extrabold ${mono ? "tabular-nums" : ""}`}>{value}</span>
    </div>
  );
}

function ActionBtn({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 rounded-2xl border border-[#efe2c4] bg-white/80 backdrop-blur-xl py-3 text-[11.5px] font-extrabold text-[#3a2a18] shadow-[0_6px_14px_-10px_rgba(120,80,30,0.5)] active:scale-[0.97] transition"
    >
      <span className="text-[#b8893a]">{icon}</span>
      {label}
    </button>
  );
}
