import { supabase } from "@/lib/supabase";
import { BrandStats, ErrorLog } from "@/types";

export const LogService = {
  async deleteLog(id: number) {
    const { error } = await supabase.from("error_logs").delete().eq("id", id);

    if (error) throw error;
    return true;
  },
  async getLogs(brandFilter: string | null): Promise<ErrorLog[]> {
    let query = supabase
      .from("error_logs")
      .select("*")
      .order("last_seen_at", { ascending: false });

    if (brandFilter && brandFilter !== "Tümü") {
      query = query.eq("brand", brandFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    return (data as ErrorLog[]) || [];
  },

  async getBrands(): Promise<string[]> {
    const { data } = await supabase
      .from("error_logs")
      .select("brand")
      .order("brand");

    const brands = data
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ["Tümü", ...new Set(data.map((item: any) => item.brand))]
      : ["Tümü"];

    return brands as string[];
  },

  async getBrandStats(): Promise<BrandStats[]> {
    const { data, error } = await supabase
      .from("error_logs")
      .select("brand, severity");

    if (error) {
      console.error("Brand stats error:", error);
      return [];
    }

    const statsMap = new Map<string, BrandStats>();

    data.forEach((log) => {
      const brand = log.brand || "Genel";

      if (!statsMap.has(brand)) {
        statsMap.set(brand, {
          brand,
          errorCount: 0,
          criticalCount: 0,
          infoCount: 0,
        });
      }

      const stat = statsMap.get(brand)!;

      if (log.severity === "critical") stat.criticalCount++;
      else if (log.severity === "info") stat.infoCount++;
      else stat.errorCount++;
    });

    return Array.from(statsMap.values()).sort((a, b) =>
      a.brand.localeCompare(b.brand),
    );
  },
};
