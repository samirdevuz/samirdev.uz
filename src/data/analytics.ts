export type AnalyticsBreakdown = {
  label: string;
  value: number;
};

export type AnalyticsTrendPoint = {
  date: string;
  visitors: number;
  pageViews: number;
};

export type AnalyticsSummary = {
  days: number;
  generatedAt: string;
  visitors: number;
  pageViews: number;
  contactClicks: number;
  projectClicks: number;
  liveVisitors: number;
  trend: AnalyticsTrendPoint[];
  sources: AnalyticsBreakdown[];
  campaigns: AnalyticsBreakdown[];
  pages: AnalyticsBreakdown[];
  countries: AnalyticsBreakdown[];
  devices: AnalyticsBreakdown[];
  events: AnalyticsBreakdown[];
};

export const analyticsEventNames = [
  "page_view",
  "project_view",
  "milliyprep_click",
  "email_copy",
  "email_open",
  "social_click",
  "blog_open",
  "language_change",
  "theme_change",
  "command_menu_open",
  "scroll_25",
  "scroll_50",
  "scroll_75",
  "scroll_100",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];

export function isAnalyticsEventName(value: unknown): value is AnalyticsEventName {
  return (
    typeof value === "string" &&
    (analyticsEventNames as readonly string[]).includes(value)
  );
}
