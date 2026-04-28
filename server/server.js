const express = require('express');
const puppeteer = require('puppeteer');
const Anthropic = require('@anthropic-ai/sdk');
const cors = require('cors');

require('dotenv').config(); 

const app = express();
app.use(cors());
app.use(express.json()); 

const PORT = process.env.PORT || 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const DUNE_SIM_KEY = process.env.DUNE_SIM_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY environment variable is required');
}

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// ── DOMAIN → TOKEN LOOKUP MAP ────────────────────────────
// Maps known Web3/Solana domains to their token mint addresses
const DOMAIN_TOKEN_MAP = {
  'jupiter.ag': 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
  'jup.ag': 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
  'raydium.io': '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
  'orca.so': 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE',
  'marinade.finance': 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey',
  'kamino.finance': 'KMNo3nJsBXfcpJTVhZcXLW7RmTwTt4GVFE7suUBo9sS',
  'drift.trade': 'DriFtupjxFonAppuegsMDq17CYoTXBpAKdXmgMWDHPV',
  'mango.markets': 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac',
  'bonk.io': 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  'pyth.network': 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3',
  'solend.fi': 'SLNDpmoWTVADgEdndyvWzroNL7zSi1dF9PC3xHGtPwp',
  'fluxbeam.xyz': 'FLUXBmPhT3Fd1EDEVCiDEBgMpSqHSyZPkfzAnywcVSE',
  'tensor.trade': 'TNSRxcUxoT9xBG3de7PiJyTDYu7kskLqcpddxnEJAS6',
  'magic eden': 'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5',
  'stepfinance.io': 'StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT',
  'sunny.ag': 'SUNNYWgPQmFxe9wTZzNK7iPnJ3vYDrkgnxJRJm1s3ag',
  'raenest.com': null,
  'paystack.com': null,
  'flutterwave.com': null,
};

// ── DUNE SIM: FETCH ON-CHAIN DATA ─────────────────────────
async function fetchOnChainData(domain) {
  try {
    const cleanDomain = domain.replace('www.', '');

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
      const nameQuery = cleanDomain.split('.')[0];
      const searchResult = await duneSIMRequest('GET', `/v1/solana/tokens/search?query=${encodeURIComponent(nameQuery)}&limit=1`);
      if (searchResult?.tokens?.length > 0) {
        tokenMint = searchResult.tokens[0].mint;
      }
    }

    if (!tokenMint) {
      return {
        hasOnChainData: false,
        message: 'No on-chain data found for this domain. If this project has a token, enter the mint address manually.',
        domain: cleanDomain
      };
    }

    // Fetch token info, price, and top holders in parallel
    const [tokenInfo, priceData, holdersData, activityData] = await Promise.allSettled([
      duneSIMRequest('GET', `/v1/solana/tokens/${tokenMint}`),
      duneSIMRequest('GET', `/v1/solana/tokens/${tokenMint}/price`),
      duneSIMRequest('GET', `/v1/solana/tokens/${tokenMint}/holders?limit=10`),
      duneSIMRequest('GET', `/v1/solana/tokens/${tokenMint}/transfers?limit=20`)
    ]);

    const token = tokenInfo.status === 'fulfilled' ? tokenInfo.value : null;
    const price = priceData.status === 'fulfilled' ? priceData.value : null;
    const holders = holdersData.status === 'fulfilled' ? holdersData.value : null;
    const activity = activityData.status === 'fulfilled' ? activityData.value : null;

    // Calculate 24h transfer volume
    const transfers = activity?.transfers || [];
    const totalVolume = transfers.reduce((sum, t) => sum + (t.amount || 0), 0);
    const uniqueWallets = new Set(transfers.map(t => t.from_address)).size;

    return {
      hasOnChainData: true,
      tokenMint,
      symbol: token?.symbol || 'Unknown',
      name: token?.name || cleanDomain,
      decimals: token?.decimals || 9,
      totalSupply: token?.total_supply ? formatNumber(token.total_supply / Math.pow(10, token.decimals || 9)) : 'Unknown',
      price: price?.price ? `$${parseFloat(price.price).toFixed(6)}` : 'Unavailable',
      priceChange24h: price?.price_change_24h ? `${price.price_change_24h > 0 ? '+' : ''}${parseFloat(price.price_change_24h).toFixed(2)}%` : 'N/A',
      marketCap: price?.market_cap ? `$${formatNumber(price.market_cap)}` : 'Unavailable',
      holderCount: holders?.total_holders ? formatNumber(holders.total_holders) : 'Unknown',
      topHolders: (holders?.holders || []).slice(0, 5).map(h => ({
        address: h.address ? h.address.slice(0, 6) + '...' + h.address.slice(-4) : 'Unknown',
        balance: h.balance ? formatNumber(h.balance / Math.pow(10, token?.decimals || 9)) : '0',
        percentage: h.percentage ? `${parseFloat(h.percentage).toFixed(2)}%` : '0%'
      })),
      recentTransfers24h: transfers.length,
      uniqueWallets24h: uniqueWallets,
      volume24h: formatNumber(totalVolume),
      dataSource: 'Dune SIM',
      poweredBy: 'Dune Analytics'
    };
  } catch (err) {
    console.error(`[Dune SIM] Error for ${domain}:`, err.message);
    return {
      hasOnChainData: false,
      message: 'On-chain data temporarily unavailable.',
      error: err.message
    };
  }
}

async function duneSIMRequest(method, path) {
  const baseUrl = 'https://api.sim.dune.com';
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'X-Sim-Api-Key': DUNE_SIM_KEY,
      'Content-Type': 'application/json'
    },
    signal: AbortSignal.timeout(10000)
  });
  if (!res.ok) throw new Error(`Dune SIM ${res.status}: ${await res.text()}`);
  return res.json();
}

function formatNumber(num) {
  if (!num || isNaN(num)) return '0';
  const n = parseFloat(num);
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
  return n.toFixed(2);
}

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Mirra backend', version: '2.0.0', features: ['vision', 'dune-sim'] });
});

// Manual token lookup endpoint
app.post('/onchain', async (req, res) => {
  const { domain, tokenMint } = req.body;
  if (!domain) return res.status(400).json({ error: 'domain required' });

  // If manual mint provided, inject it into the map temporarily
  if (tokenMint) {
    DOMAIN_TOKEN_MAP[domain.replace('www.','')] = tokenMint;
  }

  const data = await fetchOnChainData(domain);
  res.json({ success: true, onChainData: data });
});

// Main analysis endpoint
app.post('/analyze', async (req, res) => { 
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let normalizedUrl = url;
  if (!normalizedUrl.startsWith('http')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  let domain;
  try {
    domain = new URL(normalizedUrl).hostname.replace('www.', '');
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  console.log(`Analyzing: ${normalizedUrl}`);

  let browser;
  try {
    // Launch both Puppeteer AND Dune SIM in parallel
    const [browserResult, onChainData] = await Promise.allSettled([
      launchAndScreenshot(normalizedUrl),
      fetchOnChainData(domain)
    ]);

    const screenshotBase64 = browserResult.status === 'fulfilled' ? browserResult.value : null;
    const chainData = onChainData.status === 'fulfilled' ? onChainData.value : { hasOnChainData: false, message: 'On-chain lookup failed.' };

    console.log(`Screenshot: ${screenshotBase64 ? 'OK' : 'FAILED'} | Dune SIM: ${chainData.hasOnChainData ? 'found' : 'none'}`);

    const prompt = buildPrompt(normalizedUrl, domain);

    const messageContent = screenshotBase64
      ? [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: screenshotBase64 } },
          { type: 'text', text: prompt }
        ]
      : [{ type: 'text', text: prompt }];

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{ role: 'user', content: messageContent }]
    });

    const raw = response.content.map(b => b.text || '').join('').trim();
    console.log(`Claude responded for ${domain}`);

    const result = extractJSON(raw);
    if (!result) {
      return res.status(500).json({ error: 'Could not parse AI response. Try again.' });
    }

    // Attach Dune SIM on-chain data to result
    result.onChainData = chainData;

    res.json({ success: true, result, usedScreenshot: !!screenshotBase64 });

  } catch (err) {
    if (browser) {
      try { await browser.close(); } catch (_) {}
    }
    console.error(`Error analyzing ${domain}:`, err.message);
    res.status(500).json({ error: err.message || 'Analysis failed. Try again.' });
  }
});

async function launchAndScreenshot(normalizedUrl) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote',
      '--single-process', '--disable-gpu'
    ]
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.goto(normalizedUrl, { waitUntil: 'networkidle2', timeout: 25000 });
    await new Promise(r => setTimeout(r, 2000));
    const buf = await page.screenshot({ type: 'jpeg', quality: 80, fullPage: false });
    await browser.close();
    return buf.toString('base64');
  } catch (e) {
    await browser.close();
    throw e;
  }
}

function buildPrompt(url, domain) {
  return `You are Mirra, an expert competitive intelligence analyst. You are looking at a REAL LIVE SCREENSHOT of ${domain} (${url}).

Analyze EXACTLY what you see in this screenshot. Do not use prior knowledge — only analyze what is visible in the image.

Look for:
- Navigation: what links, structure, sticky header?
- Hero section: what is the headline, subheadline, CTA?
- Primary CTA: button text, color, placement?
- Social proof: logos, numbers, testimonials visible?
- Pricing: visible or not?
- Trust signals: badges, certifications, guarantees?
- Value proposition: how clear is it?
- Mobile/UX: overall visual quality?

CRITICAL: Return ONLY a raw JSON object. Start with { and end with }. No markdown, no backticks, no explanation.

{
  "domain": "${domain}",
  "overallScore": <0-100, based only on what you see>,
  "limitedKnowledge": false,
  "summary": "<2-3 sentences describing exactly what you see on this page — specific headlines, CTAs, design choices>",
  "components": [
    {"name":"Navigation","detail":"<exactly what you see>","status":"strong|partial|missing|unknown","color":"#1D6AF8"},
    {"name":"Hero Section","detail":"<exact headline and subheadline you can read>","status":"strong|partial|missing|unknown","color":"#6B3FD4"},
    {"name":"Primary CTA","detail":"<exact button text and color>","status":"strong|partial|missing|unknown","color":"#D93030"},
    {"name":"Social Proof","detail":"<exactly what logos or numbers you see>","status":"strong|partial|missing|unknown","color":"#C07A00"},
    {"name":"Pricing Display","detail":"<visible or not — what you see>","status":"strong|partial|missing|unknown","color":"#0F9E52"},
    {"name":"Trust Signals","detail":"<any badges or certifications visible>","status":"strong|partial|missing|unknown","color":"#0891B2"},
    {"name":"Value Proposition","detail":"<how clear is the why-us message>","status":"strong|partial|missing|unknown","color":"#6B3FD4"},
    {"name":"Mobile Experience","detail":"<visual quality and layout observations>","status":"strong|partial|missing|unknown","color":"#1D6AF8"}
  ],
  "insights":[
    {"type":"steal","title":"<4-6 word title>","text":"<specific thing visible in screenshot that is done well>","action":"Steal"},
    {"type":"steal","title":"<4-6 word title>","text":"<another specific strength visible>","action":"Steal"},
    {"type":"gap","title":"<4-6 word title>","text":"<specific weakness visible in screenshot>","action":"Exploit"},
    {"type":"gap","title":"<4-6 word title>","text":"<another specific weakness>","action":"Exploit"},
    {"type":"watch","title":"<4-6 word title>","text":"<interesting pattern worth noting>","action":"Note"}
  ],
  "scoreBreakdown":{
    "Visual Design":<0-100>,
    "CTA Clarity":<0-100>,
    "Social Proof":<0-100>,
    "Navigation":<0-100>,
    "Trust Signals":<0-100>
  }
}`;
}

function extractJSON(text) {
  // Try direct parse
  try { return JSON.parse(text); } catch (_) {}

  // Strip markdown fences
  const stripped = text.replace(/^```json\s*/,'').replace(/^```\s*/,'').replace(/\s*```$/,'').trim();
  try { return JSON.parse(stripped); } catch (_) {}

  // Find first { last }
  const fi = text.indexOf('{');
  const li = text.lastIndexOf('}');
  if (fi !== -1 && li > fi) {
    try { return JSON.parse(text.slice(fi, li + 1)); } catch (_) {}
  }

  return null;
}

app.use("*", (req,res)=> {
    res.send("Unknown path")
})

app.listen(PORT, () => {
  console.log(`Mirra backend running on port  http://localhost:${PORT}`);
});