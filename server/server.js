const express = require("express");
const puppeteer = require("puppeteer");
const Anthropic = require("@anthropic-ai/sdk");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const DUNE_SIM_KEY = process.env.DUNE_SIM_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error("ERROR: ANTHROPIC_API_KEY environment variable is required");
}

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// ── DOMAIN → TOKEN LOOKUP MAP ────────────────────────────
// Maps known Web3/Solana domains to their token mint addresses
const DOMAIN_TOKEN_MAP = {
  "jupiter.ag": "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  "jup.ag": "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  "raydium.io": "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
  "orca.so": "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
  "marinade.finance": "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
  "kamino.finance": "KMNo3nJsBXfcpJTVhZcXLW7RmTwTt4GVFE7suUBo9sS",
  "drift.trade": "DriFtupjxFonAppuegsMDq17CYoTXBpAKdXmgMWDHPV",
  "mango.markets": "MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac",
  "bonk.io": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  "pyth.network": "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
  "solend.fi": "SLNDpmoWTVADgEdndyvWzroNL7zSi1dF9PC3xHGtPwp",
  "fluxbeam.xyz": "FLUXBmPhT3Fd1EDEVCiDEBgMpSqHSyZPkfzAnywcVSE",
  "tensor.trade": "TNSRxcUxoT9xBG3de7PiJyTDYu7kskLqcpddxnEJAS6",
  "magic eden": "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5",
  "stepfinance.io": "StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT",
  "sunny.ag": "SUNNYWgPQmFxe9wTZzNK7iPnJ3vYDrkgnxJRJm1s3ag",
  "raenest.com": null,
  "paystack.com": null,
  "flutterwave.com": null,
};

// ── DUNE SIM: FETCH ON-CHAIN DATA ─────────────────────────
async function fetchOnChainData(domain) {
  try {
    const cleanDomain = domain.replace("www.", "");

    // Check if domain has a known token
    let tokenMint = DOMAIN_TOKEN_MAP[cleanDomain];

    // If not in map, try to detect from domain name
    if (tokenMint === undefined) {
      // Unknown domain — attempt generic lookup via EVM address search
      // For unknown Solana projects, we'll still try to surface data
      tokenMint = null;
    }

    if (tokenMint === null && !(cleanDomain in DOMAIN_TOKEN_MAP)) {
      // Completely unknown — try Dune SIM token search by name
      const nameQuery = cleanDomain.split(".")[0];
      const searchResult = await duneSIMRequest(
        "GET",
        `/v1/solana/tokens/search?query=${encodeURIComponent(nameQuery)}&limit=1`,
      );
      if (searchResult?.tokens?.length > 0) {
        tokenMint = searchResult.tokens[0].mint;
      }
    }

    if (!tokenMint) {
      return {
        hasOnChainData: false,
        message:
          "No on-chain data found for this domain. If this project has a token, enter the mint address manually.",
        domain: cleanDomain,
      };
    }

    // Fetch token info, price, and top holders in parallel
    const [tokenInfo, priceData, holdersData, activityData] =
      await Promise.allSettled([
        duneSIMRequest("GET", `/v1/solana/tokens/${tokenMint}`),
        duneSIMRequest("GET", `/v1/solana/tokens/${tokenMint}/price`),
        duneSIMRequest(
          "GET",
          `/v1/solana/tokens/${tokenMint}/holders?limit=10`,
        ),
        duneSIMRequest(
          "GET",
          `/v1/solana/tokens/${tokenMint}/transfers?limit=20`,
        ),
      ]);

    const token = tokenInfo.status === "fulfilled" ? tokenInfo.value : null;
    const price = priceData.status === "fulfilled" ? priceData.value : null;
    const holders =
      holdersData.status === "fulfilled" ? holdersData.value : null;
    const activity =
      activityData.status === "fulfilled" ? activityData.value : null;

    // Calculate 24h transfer volume
    const transfers = activity?.transfers || [];
    const totalVolume = transfers.reduce((sum, t) => sum + (t.amount || 0), 0);
    const uniqueWallets = new Set(transfers.map((t) => t.from_address)).size;

    return {
      hasOnChainData: true,
      tokenMint,
      symbol: token?.symbol || "Unknown",
      name: token?.name || cleanDomain,
      decimals: token?.decimals || 9,
      totalSupply: token?.total_supply
        ? formatNumber(token.total_supply / Math.pow(10, token.decimals || 9))
        : "Unknown",
      price: price?.price
        ? `$${parseFloat(price.price).toFixed(6)}`
        : "Unavailable",
      priceChange24h: price?.price_change_24h
        ? `${price.price_change_24h > 0 ? "+" : ""}${parseFloat(price.price_change_24h).toFixed(2)}%`
        : "N/A",
      marketCap: price?.market_cap
        ? `$${formatNumber(price.market_cap)}`
        : "Unavailable",
      holderCount: holders?.total_holders
        ? formatNumber(holders.total_holders)
        : "Unknown",
      topHolders: (holders?.holders || []).slice(0, 5).map((h) => ({
        address: h.address
          ? h.address.slice(0, 6) + "..." + h.address.slice(-4)
          : "Unknown",
        balance: h.balance
          ? formatNumber(h.balance / Math.pow(10, token?.decimals || 9))
          : "0",
        percentage: h.percentage
          ? `${parseFloat(h.percentage).toFixed(2)}%`
          : "0%",
      })),
      recentTransfers24h: transfers.length,
      uniqueWallets24h: uniqueWallets,
      volume24h: formatNumber(totalVolume),
      dataSource: "Dune SIM",
      poweredBy: "Dune Analytics",
    };
  } catch (err) {
    console.error(`[Dune SIM] Error for ${domain}:`, err.message);
    return {
      hasOnChainData: false,
      message: "On-chain data temporarily unavailable.",
      error: err.message,
    };
  }
}

async function duneSIMRequest(method, path) {
  const baseUrl = "https://api.sim.dune.com";
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "X-Sim-Api-Key": DUNE_SIM_KEY,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Dune SIM ${res.status}: ${await res.text()}`);
  return res.json();
}

function formatNumber(num) {
  if (!num || isNaN(num)) return "0";
  const n = parseFloat(num);
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
  return n.toFixed(2);
}

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "Mirra backend",
    version: "2.0.0",
    features: ["vision", "dune-sim"],
  });
});

// Manual token lookup endpoint
app.post("/onchain", async (req, res) => {
  const { domain, tokenMint } = req.body;
  if (!domain) return res.status(400).json({ error: "domain required" });

  // If manual mint provided, inject it into the map temporarily
  if (tokenMint) {
    DOMAIN_TOKEN_MAP[domain.replace("www.", "")] = tokenMint;
  }

  const data = await fetchOnChainData(domain);
  res.json({ success: true, onChainData: data });
});

async function fetchReviews(domain) {
  try {
    const brandName = domain.split(".")[0];
    const query = `${brandName} reviews complaints site:trustpilot.com OR site:g2.com OR site:reddit.com`;

    console.log(`[ScaleSerp] Searching for: ${brandName}`);
    const res = await fetch(
      `https://api.scaleserp.com/search?q=${encodeURIComponent(query)}&num=10&api_key=${process.env.SERPAPI_KEY}`,
      { signal: AbortSignal.timeout(15000) },
    );

    if (!res.ok) throw new Error(`SerpAPI ${res.status}`);
    const data = await res.json();

    const snippets = (data.organic_results || [])
      .map((r) => ({
        source: r.displayed_link || r.link,
        title: r.title || "",
        snippet: r.snippet || "",
      }))
      .filter((r) => r.snippet.length > 40)
      .slice(0, 8);

    return { hasReviews: snippets.length > 0, snippets };
  } catch (err) {
    console.error(`[SerpAPI] Error:`, err.message);
    return { hasReviews: false, snippets: [] };
  }
}
async function fetchTraffic(domain) {
  try {
    console.log(`[Traffic] Fetching for ${domain}`);
    const res = await fetch(
      `https://data.similarweb.com/api/v1/data?domain=${domain}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) throw new Error(`SimilarWeb ${res.status}`);
    const data = await res.json();

    const visits = data.EstimatedMonthlyVisits;
    const sortedMonths = visits
      ? Object.entries(visits).sort((a, b) => a[0].localeCompare(b[0]))
      : [];
    const lastTwo = sortedMonths.slice(-2);
    const latest = lastTwo[1] ? lastTwo[1][1] : null;
    const previous = lastTwo[0] ? lastTwo[0][1] : null;

    let trend = "Unknown";
    let changePercent = null;
    if (latest && previous && previous > 0) {
      const change = ((latest - previous) / previous) * 100;
      changePercent = change.toFixed(1);
      trend = change > 5 ? "Growing" : change < -5 ? "Declining" : "Stable";
    }

    return {
      hasTrafficData: true,
      monthlyVisits: latest ? formatNumber(latest) : "Unknown",
      trend,
      changePercent: changePercent
        ? `${changePercent > 0 ? "+" : ""}${changePercent}%`
        : "N/A",
      bounceRate: data.Engagments?.BounceRate
        ? `${(data.Engagments.BounceRate * 100).toFixed(1)}%`
        : "N/A",
      pagesPerVisit: data.Engagments?.PagePerVisit
        ? parseFloat(data.Engagments.PagePerVisit).toFixed(1)
        : "N/A",
      avgVisitDuration: data.Engagments?.TimeOnSite
        ? `${Math.floor(data.Engagments.TimeOnSite / 60)}m ${Math.round(data.Engagments.TimeOnSite % 60)}s`
        : "N/A",
      topSources: data.TrafficSources
        ? {
            direct: `${((data.TrafficSources.Direct || 0) * 100).toFixed(1)}%`,
            search: `${((data.TrafficSources.Search || 0) * 100).toFixed(1)}%`,
            social: `${((data.TrafficSources.Social || 0) * 100).toFixed(1)}%`,
            referral: `${((data.TrafficSources.Referrals || 0) * 100).toFixed(1)}%`,
          }
        : null,
      globalRank: data.GlobalRank?.Rank
        ? formatNumber(data.GlobalRank.Rank)
        : "N/A",
    };
  } catch (err) {
    console.error(`[Traffic] Error:`, err.message);
    return { hasTrafficData: false, message: "Traffic data unavailable." };
  }
}

async function fetchNews(domain) {
  try {
    console.log(`[News] Fetching for ${domain}`);
    const brandName = domain.split(".")[0];

    const res = await fetch(
      `https://api.scaleserp.com/search?api_key=${process.env.SERPAPI_KEY}&q=${encodeURIComponent(brandName)}&search_type=news&time_period=last_month&num=6`,
      { signal: AbortSignal.timeout(15000) },
    );
    if (!res.ok) throw new Error(`ScaleSerp News ${res.status}`);
    const data = await res.json();

    const articles = (data.news_results || [])
      .map((r) => ({
        title: r.title || "",
        source: r.source?.name || r.displayed_link || "",
        snippet: r.snippet || "",
        date: r.date || "",
      }))
      .filter((r) => r.title.length > 10)
      .slice(0, 5);

    return { hasNews: articles.length > 0, articles };
  } catch (err) {
    console.error(`[News] Error:`, err.message);
    return { hasNews: false, articles: [] };
  }
}

// Main analysis endpoint
app.post("/analyze", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  let normalizedUrl = url;
  if (!normalizedUrl.startsWith("http")) {
    normalizedUrl = "https://" + normalizedUrl;
  }

  let domain;
  try {
    domain = new URL(normalizedUrl).hostname.replace("www.", "");
  } catch (e) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  console.log(`Analyzing: ${normalizedUrl}`);

  let browser;
  try {
    const [browserResult, onChainData, reviewData, trafficData, newsData] =
      await Promise.allSettled([
        launchAndScreenshot(normalizedUrl),
        fetchOnChainData(domain),
        fetchReviews(domain),
        fetchTraffic(domain),
        fetchNews(domain),
      ]);

    const reviews =
      reviewData.status === "fulfilled"
        ? reviewData.value
        : { hasReviews: false, snippets: [] };
    const traffic =
      trafficData.status === "fulfilled"
        ? trafficData.value
        : { hasTrafficData: false };
    const news =
      newsData.status === "fulfilled"
        ? newsData.value
        : { hasNews: false, articles: [] };

        
const screenshotBase64 = browserResult.status === 'fulfilled' ? browserResult.value : null;
const chainData = onChainData.status === 'fulfilled' ? onChainData.value : { hasOnChainData: false, message: 'On-chain lookup failed.' };


console.log(`Reviews: ${reviews.snippets.length} snippets | Traffic: ${traffic.hasTrafficData ? traffic.monthlyVisits + '/mo' : 'none'} | News: ${news.articles.length} articles`);

   

    const prompt = buildPrompt(normalizedUrl, domain, reviews, traffic, news);

    const messageContent = screenshotBase64
      ? [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: screenshotBase64,
            },
          },
          { type: "text", text: prompt },
        ]
      : [{ type: "text", text: prompt }];

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4000,
      messages: [{ role: "user", content: messageContent }],
    });

    const raw = response.content
      .map((b) => b.text || "")
      .join("")
      .trim();
    console.log(`Claude responded for ${domain}`);

    const result = extractJSON(raw);
    if (!result) {
      return res
        .status(500)
        .json({ error: "Could not parse AI response. Try again." });
    }

    result.onChainData = chainData;
    result.trafficData = traffic;
    result.newsData = news;

    res.json({ success: true, result, usedScreenshot: !!screenshotBase64 });
    
  } catch (err) {
    if (browser) {
      try {
        await browser.close();
      } catch (_) {}
    }
    console.error(`Error analyzing ${domain}:`, err.message);
    res
      .status(500)
      .json({ error: err.message || "Analysis failed. Try again." });
  }
});

async function launchAndScreenshot(normalizedUrl) {
  console.log(`[Puppeteer] Launching for ${normalizedUrl}`);
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
    ],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    );
    console.log(`[Puppeteer] Navigating...`);
    await page.goto(normalizedUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
    console.log(`[Puppeteer] Page loaded`);
    await new Promise((r) => setTimeout(r, 2000));
    const buf = await page.screenshot({
      type: "jpeg",
      quality: 80,
      fullPage: false,
    });
    console.log(`[Puppeteer] Screenshot taken: ${buf.length} bytes`);
    await browser.close();
    return buf.toString("base64");
  } catch (e) {
    console.error(`[Puppeteer] FAILED:`, e.message);
    try {
      await browser.close();
    } catch (_) {}
    throw e;
  }
}

function buildPrompt(url, domain, reviews, traffic, news) {
  const reviewBlock = reviews.hasReviews
    ? `REAL CUSTOMER REVIEWS:\n${reviews.snippets.map((r, i) => `[${i + 1}] Source: ${r.source}\n"${r.snippet}"`).join("\n\n")}`
    : "No public reviews found.";

  const trafficBlock = traffic.hasTrafficData
    ? `TRAFFIC DATA (SimilarWeb):
- Monthly visits: ${traffic.monthlyVisits}
- Trend: ${traffic.trend} (${traffic.changePercent} vs last month)
- Bounce rate: ${traffic.bounceRate}
- Pages per visit: ${traffic.pagesPerVisit}
- Avg visit duration: ${traffic.avgVisitDuration}
- Global rank: #${traffic.globalRank}
- Top sources: Direct ${traffic.topSources?.direct}, Search ${traffic.topSources?.search}, Social ${traffic.topSources?.social}, Referral ${traffic.topSources?.referral}`
    : "Traffic data unavailable.";

  const newsBlock = news.hasNews
    ? `RECENT NEWS (last 30 days):\n${news.articles.map((a, i) => `[${i + 1}] ${a.date} — ${a.source}: "${a.title}" — ${a.snippet}`).join("\n")}`
    : "No recent news found.";

  return `You are Mirra, an expert competitive intelligence analyst.

You have four data sources:
1. A real live screenshot of ${domain}'s website
2. Real customer review snippets from Trustpilot, G2, and Reddit  
3. Real traffic data from SimilarWeb
4. Recent news articles from the last 30 days

${reviewBlock}

${trafficBlock}

${newsBlock}

Use ALL available data to build your analysis. Every claim must be grounded in the data above.

CRITICAL: Return ONLY a raw JSON object. Start with { and end with }. No markdown, no backticks.

{
  "domain": "${domain}",
  "threatLevel": "High|Medium|Low",
  "gapScore": <0-100>,
  "marketPosition": "Growing|Plateau|Declining",
  "executiveSummary": {
    "what": "<one sentence>",
    "strengths": ["<with evidence>", "<with evidence>"],
    "weaknesses": ["<from reviews or data>", "<from reviews or data>"],
    "verdict": "Serious threat|Beatable|Opportunity"
  },
  "customerAmmunition": [
    {
      "complaint": "<real complaint pattern>",
      "quote": "<real quote from snippets>",
      "frequency": "High|Medium|Low",
      "yourAngle": "<how to position against this>"
    }
  ],
  "trafficIntelligence": {
    "summary": "<one sentence on what the traffic data means>",
    "isGrowing": true,
    "keyInsight": "<most important thing the traffic data reveals about their business health>"
  },
  "recentMoves": [
    {
      "headline": "<news headline or signal>",
      "whatItMeans": "<implication for you as a competitor>"
    }
  ],
  "momentumSignals": {
    "overall": "Accelerating|Stable|Slowing|Unknown",
    "signals": [
      {"emoji": "📈", "text": "<signal from screenshot, reviews, traffic, or news>"},
      {"emoji": "⚠️", "text": "<warning signal>"}
    ],
    "whatItMeans": "<one sentence implication>"
  },
  "priorityActions": [
    {
      "action": "<specific action>",
      "why": "<linked to weakness or complaint>",
      "effort": "Low|Medium|High",
      "impact": "Low|Medium|High"
    }
  ],
  "beatThemBrief": {
    "headline": "<positioning headline exploiting their weakness>",
    "offerAngle": "<based on unmet need>",
    "cta": "<based on user frustration>",
    "whereToFindCustomers": "<specific channel>",
    "persuasionAngle": "<based on complaints>"
  },
  "components": [
    {"name":"Navigation","detail":"<what you see>","status":"strong|partial|missing","color":"#1D6AF8"},
    {"name":"Hero Section","detail":"<exact headline>","status":"strong|partial|missing","color":"#6B3FD4"},
    {"name":"Primary CTA","detail":"<exact button text>","status":"strong|partial|missing","color":"#D93030"},
    {"name":"Social Proof","detail":"<what you see>","status":"strong|partial|missing","color":"#C07A00"},
    {"name":"Trust Signals","detail":"<what you see>","status":"strong|partial|missing","color":"#0891B2"}
  ],
  "overallScore": <0-100>
}`;
}

function extractJSON(text) {
  // Try direct parse
  try {
    return JSON.parse(text);
  } catch (_) {}

  // Strip markdown fences
  const stripped = text
    .replace(/^```json\s*/, "")
    .replace(/^```\s*/, "")
    .replace(/\s*```$/, "")
    .trim();
  try {
    return JSON.parse(stripped);
  } catch (_) {}

  // Find first { last }
  const fi = text.indexOf("{");
  const li = text.lastIndexOf("}");
  if (fi !== -1 && li > fi) {
    try {
      return JSON.parse(text.slice(fi, li + 1));
    } catch (_) {}
  }

  return null;
}

app.use("*", (req, res) => {
  res.send("Unknown path");
});

app.listen(PORT, () => {
  console.log(`Mirra backend running on port  http://localhost:${PORT}`);
});
