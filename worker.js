// ─── Anusree Poetry — Cloudflare Worker Proxy ───────────────
// Deployed at: https://anusree-ai.YOUR-SUBDOMAIN.workers.dev
// API key stored as Worker Secret (never in code / GitHub)

export default {
  async fetch(request, env) {
    // ── CORS preflight ──
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // ── Rate limit: 60 requests per IP per hour ──
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateLimitKey = `ratelimit:${ip}:${Math.floor(Date.now() / 3600000)}`;

    if (env.KV) {
      const count = parseInt(await env.KV.get(rateLimitKey) || '0');
      if (count >= 60) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: corsHeaders(),
        });
      }
      await env.KV.put(rateLimitKey, String(count + 1), { expirationTtl: 3600 });
    }

    // ── Forward to Gemini API ──
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400, headers: corsHeaders()
      });
    }

    const model = 'gemini-3.1-flash-lite-preview';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await geminiRes.text();

    return new Response(data, {
      status: geminiRes.status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(),
      },
    });
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
