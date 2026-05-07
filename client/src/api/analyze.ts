const BASE = "http://localhost:8080" ;

export interface AnalysisResult {
  domain: string;
  threatLevel: "High" | "Medium" | "Low";
  gapScore: number;
  marketPosition: "Growing" | "Plateau" | "Declining";
  overallScore: number;
  executiveSummary: {
    what: string;
    strengths: string[];
    weaknesses: string[];
    verdict: string;
  };
  customerAmmunition: {
    complaint: string;
    quote: string;
    frequency: "High" | "Medium" | "Low";
    yourAngle: string;
  }[];
  momentumSignals: {
    overall: string;
    signals: { emoji: string; text: string }[];
    whatItMeans: string;
  };
  priorityActions: {
    action: string;
    why: string;
    effort: "Low" | "Medium" | "High";
    impact: "Low" | "Medium" | "High";
  }[];
  beatThemBrief: {
    headline: string;
    offerAngle: string;
    cta: string;
    whereToFindCustomers: string;
    persuasionAngle: string;
  };
  components: {
    name: string;
    detail: string;
    status: "strong" | "partial" | "missing";
    color: string;
  }[];
  onChainData: {
    hasOnChainData: boolean;
    message?: string;
    symbol?: string;
    price?: string;
    priceChange24h?: string;
    marketCap?: string;
    holderCount?: string;
    volume24h?: string;
  };

  trafficData?: {
    hasTrafficData: boolean;
    monthlyVisits?: string;
    trend?: string;
    changePercent?: string;
    bounceRate?: string;
    pagesPerVisit?: string;
    avgVisitDuration?: string;
    globalRank?: string;
    topSources?: Record<string, string>;
    message?: string;
  };
  newsData?: {
    hasNews: boolean;
    articles: {
      title: string;
      source: string;
      snippet: string;
      date: string;
    }[];
  };
  trafficIntelligence?: {
    summary: string;
    isGrowing: boolean;
    keyInsight: string;
  };
  recentMoves?: { headline: string; whatItMeans: string }[];
}

export async function analyze(url: string): Promise<AnalysisResult> {
  const res = await fetch(`${BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Analysis failed");
  return data.result;
}
