const { isAuthenticated, readJson, json } = require('../lib/auth');

const fallbackEvidence = [
  { title: 'ABT 2026', detail: 'Prioritas tertinggi: pemetaan klaster IKM dan kajian subsektor/rantai pasok untuk fondasi RPIK 2027.' },
  { title: 'RPIK 2027', detail: 'Kesiapan baru 25%; gap utama ada pada baseline data IKM, peta klaster, dan integrasi SIINas–OSS.' }
];

const knowledge = `
Dashboard Strategis Disperindag Kota Tangerang Selatan 2027.
Fakta inti: 6 dari 9 program selaras; 3 program perlu penyesuaian; 5 isu prioritas kritis.
RPIK 2027 readiness 25%; gap utama baseline data IKM, peta klaster, rantai pasok, sinkronisasi RTRW, integrasi SIINas-OSS.
ABT 2026 prioritas: pemetaan klaster IKM, baseline data industri/IKM dan integrasi SIINas, kajian sarana/logistik urban-RTRW, kajian subsektor unggulan dan rantai pasok, redesign perizinan OSS/NIB.
Perizinan 3.30.02 perlu redesign dari penerbit izin menjadi verifikator teknis dan pendamping OSS/NIB karena PP 28/2025 dan Permen Investasi 5/2025.
Industri: izin usaha industri 98.9%, data SIINas 94.44%, target IKM kota 58.
`;

function localFallback(question) {
  const q = String(question || '').toLowerCase();
  if (/perizinan|oss|nib|3\.30\.02/.test(q)) {
    return '<b>Rekomendasi eksekutif:</b> Redesign program 3.30.02 menjadi fungsi verifikasi teknis dan pendampingan OSS/NIB. Pastikan SOP baru, matriks kewenangan dengan DPMPTSP, dan integrasi data OSS–SIINas masuk agenda ABT/RKPD.';
  }
  if (/rpik|klaster|baseline|ikm|siinas/.test(q)) {
    return '<b>Rekomendasi eksekutif:</b> Kunci RPIK 2027 adalah baseline data IKM, peta klaster per kecamatan, dan kajian subsektor/rantai pasok. Kesiapan baru 25%, jadi ABT 2026 perlu mengunci data sebelum program 2027 final.';
  }
  return '<b>Rekomendasi eksekutif:</b> Prioritas tertinggi adalah pemetaan klaster IKM dan kajian subsektor/rantai pasok untuk fondasi RPIK 2027, lalu integrasi SIINas–OSS dan redesign perizinan 3.30.02.';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}

function markdownToSafeHtml(value) {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\n/g, '<br>');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed' });
  if (!isAuthenticated(req)) return json(res, 401, { ok: false, error: 'Unauthorized' });
  let body;
  try { body = await readJson(req); } catch { return json(res, 400, { ok: false, error: 'Invalid JSON' }); }
  const question = String(body.question || '').slice(0, 2000);
  const mode = String(body.mode || 'eksekutif').slice(0, 40);
  if (!question.trim()) return json(res, 400, { ok: false, error: 'Pertanyaan kosong.' });

  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
  if (!apiKey) return json(res, 200, { ok: true, source: 'local-fallback', answer: localFallback(question), evidence: fallbackEvidence });

  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: AbortSignal.timeout(20000),
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://disperindag-tangsel-dashboard.vercel.app',
        'X-Title': 'Disperindag Tangsel Strategic Dashboard'
      },
      body: JSON.stringify({
        model: `${model}:online`,
        temperature: 0.2,
        max_tokens: 900,
        plugins: [{ id: 'web', max_results: 3 }],
        messages: [
          { role: 'system', content: `Anda adalah AI planning copilot eksekutif untuk Disperindag Tangsel. Jawab ringkas, berbasis bukti dashboard, mode ${mode}. Gunakan bahasa Indonesia. Jangan mengarang data di luar konteks. Format jawaban sebagai rekomendasi pimpinan yang praktis. Anda punya akses hasil pencarian internet terbaru untuk pertanyaan yang butuh info di luar data dashboard (regulasi terbaru, berita, data eksternal) — pakai itu kalau relevan dan sebutkan sumbernya.` },
          { role: 'user', content: `${knowledge}\n\nPertanyaan: ${question}` }
        ]
      })
    });
    const data = await upstream.json().catch(() => ({}));
    if (body.__debug) return json(res, 200, { ok: true, raw: data });
    if (!upstream.ok) throw new Error(data.error?.message || `OpenRouter ${upstream.status}`);
    const message = data.choices?.[0]?.message || {};
    const text = message.content || '';
    const answer = text ? markdownToSafeHtml(text) : localFallback(question);
    const citations = Array.isArray(message.annotations)
      ? message.annotations
          .filter(a => a.type === 'url_citation' && a.url_citation)
          .map(a => ({ title: a.url_citation.title || a.url_citation.url, detail: a.url_citation.url }))
      : [];
    const evidence = citations.length ? citations : fallbackEvidence;
    return json(res, 200, { ok: true, source: 'openrouter', model, answer, evidence });
  } catch (error) {
    return json(res, 200, { ok: true, source: 'local-fallback', warning: error.message, answer: localFallback(question), evidence: fallbackEvidence });
  }
};
