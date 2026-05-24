import { useEffect } from "react";
import { useDictionary } from "@/lib/dictionary";
import { supabase } from "@/integrations/supabase/client";

/**
 * Tiny diagnostic pill — bottom-left, low-opacity. Shows the number of
 * alpha_dictionary rows loaded into the client and logs the Supabase URL
 * + table on every load. Does not affect layout.
 */
export function DictionaryDebugBadge() {
  const { data, isLoading, error } = useDictionary();

  useEffect(() => {
    const url =
      (import.meta as any)?.env?.VITE_SUPABASE_URL ??
      (supabase as any)?.supabaseUrl ??
      "(unknown)";
    // eslint-disable-next-line no-console
    console.log("[alpha_dictionary] runtime source:", {
      url,
      table: "public.alpha_dictionary",
      rows: data?.length ?? 0,
      status: error ? "error" : isLoading ? "loading" : "ok",
    });
  }, [data, isLoading, error]);

  const label = error
    ? "dict: error"
    : isLoading
      ? "dict: …"
      : `dict: ${data?.length ?? 0}`;

  return (
    <div
      dir="ltr"
      className="pointer-events-none fixed bottom-1 left-1 z-[9999] rounded-md bg-black/55 px-1.5 py-0.5 font-mono text-[10px] leading-none text-white/85 shadow-sm"
    >
      {label}
    </div>
  );
}
