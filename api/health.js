const { json } = require('../lib/auth');

// Protected by Vercel's CRON_SECRET convention: when CRON_SECRET is set,
// Vercel automatically sends `Authorization: Bearer <CRON_SECRET>` on
// scheduled invocations, so only the cron (or someone with the secret)
// can trigger this real, billed OpenRouter call.
module.exports = async function handler(req, res) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.authorization || '';
    if (auth !== `Bearer ${cronSecret}`) return json(res, 401, { healthy: false, reason: 'Unauthorized' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('[health] OPENROUTER_API_KEY is not set');
    return json(res, 200, { healthy: false, reason: 'OPENROUTER_API_KEY not set' });
  }

  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: AbortSignal.timeout(10000),
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        max_tokens: 5,
        messages: [{ role: 'user', content: 'ping' }],
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => '');
      console.error(`[health] OpenRouter check failed: ${upstream.status} ${errText.slice(0, 300)}`);
      return json(res, 200, { healthy: false, reason: `OpenRouter ${upstream.status}: ${errText.slice(0, 200)}` });
    }

    console.log('[health] OpenRouter check OK');
    return json(res, 200, { healthy: true });
  } catch (error) {
    console.error('[health] OpenRouter check errored:', error.message);
    return json(res, 200, { healthy: false, reason: error.message });
  }
};
