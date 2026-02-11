export type SeverityLevel = "info" | "warning" | "error" | "critical";

export interface ErrorLog {
  id: number;
  created_at: string;
  brand: string;
  test_id: string;
  variation: string;
  error_type: string;
  severity: SeverityLevel;
  message: string;
  occurrences: number;
  last_seen_at: string;
  session_id?: string;
}

export interface DashboardStats {
  info: number;
  critical: number;
  error: number;
}

export interface BrandStats {
  brand: string;
  errorCount: number;
  criticalCount: number;
  infoCount: number;
}
