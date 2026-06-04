import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import splashPhase1 from "@/assets/splash-phase1.png";

// =====================================================================
// TEMPORARY TEST MODE
// ---------------------------------------------------------------------
// Splash, Onboarding and Interests screens are temporarily bypassed so
// the app launches directly into the Home screen for fast testing and
// external link navigation.
//
// Nothing is deleted — to restore the original flow, set
// TEMPORARY_TEST_MODE to `false` below. The original SplashScreen
// component is preserved untouched underneath.
// =====================================================================
const TEMPORARY_TEST_MODE = true;

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "ألفا — البيت الرقمي للأقباط الأرثوذكس" },
      { name: "description", content: "مرحبًا بك في ألفا — ابدأ رحلتك الروحية." },
    ],
  }),
  component: RouteEntry,
});

function RouteEntry() {
  // TEMPORARY TEST MODE — go straight to Home.
  if (TEMPORARY_TEST_MODE) {
    return <Navigate to="/home" replace />;
  }
  return <SplashScreen />;
}

function SplashScreen() {
  // Phase 1: Opening Atmosphere — black screen → cinematic fade-in of image.
  // No logo, no app name, no slogan, no CTA, no text.
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      dir="rtl"
      className="relative h-[100dvh] w-screen overflow-hidden bg-black"
    >
      {/* Background image — cinematic reveal from darkness */}
      <img
        src={splashPhase1}
        alt=""
        aria-hidden
        draggable={false}
        className={[
          "absolute inset-0 h-full w-full object-cover object-center select-none",
          "transition-opacity ease-out",
          "[transition-duration:1800ms]",
          revealed ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      {/* Soft light bloom — appears gently with the image */}
      <div
        aria-hidden
        className={[
          "pointer-events-none absolute inset-0 transition-opacity ease-out",
          "[transition-duration:2000ms]",
          revealed ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{
          background:
            "radial-gradient(60% 40% at 50% 38%, rgba(255, 224, 160, 0.18), transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
