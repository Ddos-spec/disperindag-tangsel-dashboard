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

Dokumen Renja Murni 2026:
- Total Pagu Anggaran 2026: Rp 22.530.794.319,- (semuanya Belanja Operasi, Belanja Modal Rp 0)
- Perkiraan Pagu Anggaran 2027: Rp 26.115.080.473,-
- Struktur program: 10 Program, 22 Kegiatan, dan 59 Sub-kegiatan.
- Target Indikator 2026: Kontribusi Industri ke PDRB 8.23% (target Renstra 8.52%), Kontribusi Perdagangan ke PDRB 16.76% (target Renstra 16.91%), Proporsi Industri Pengolahan Unggulan 3.75% (target Renstra 3.78%), Proporsi Perdagangan Barang Unggulan 15.85% (target Renstra 17.58%).
- Prioritas Pembangunan 2026: Peningkatan Pendampingan HKI/Haki bagi IKM (target 2 dokumen HKI, 1 SNI, GMP) dan Optimalisasi Pemasaran IKM/UMKM lewat kemitraan ritel modern.
- Hambatan Utama 2026: Belum ada Rencana Induk Pembangunan Industri Kota (RPIK); RDTR membatasi zona industri besar (hanya skala kecil); daya beli produk lokal lemah; persaingan produk impor; bahan pokok mayoritas dari luar daerah (eksternal hulu); kuantitas/kualitas SDM pengawas kurang.

STRUKTUR ORGANISASI DISPERINDAG (per RENJA 2026):
- Sekretariat.
- Bidang Perdagangan (urusan 3.30): pengampu Program 3.30.02 (Perizinan & Pendaftaran Perusahaan), 3.30.03 (Sarana Distribusi Perdagangan), 3.30.05 (Pengembangan Ekspor), 3.30.07 (Penggunaan & Pemasaran Produk Dalam Negeri).
- Bidang Perindustrian/Industri (urusan 3.31): pengampu 3.31.02 (Perencanaan & Pembangunan Industri/IKM), 3.31.03 (Pengendalian Izin Usaha Industri), 3.31.04 (Sistem Informasi Industri Nasional/SIINas).
- Bidang Stabilisasi Harga dan Pengawasan: unit yang disebut eksplisit di RENJA 2026 (tabel perjenjangan kinerja, hal. 55-57) sebagai pengampu Program 3.30.04 (Stabilisasi Harga Barang Kebutuhan Pokok dan Barang Penting) dan pengawasan distribusi/pengemasan/pelabelan bahan berbahaya (B2). Cakupannya: ketersediaan & aksesibilitas barang pokok, pengendalian harga & stok pasar, operasi pasar reguler/khusus, pengawasan B2, dan metrologi legal (tera/tera ulang UTTP, Program 3.30.06, dijalankan UPTD Pelayanan Metrologi Legal). JADI: kalau ditanya "apakah ada Bidang Stabilisasi Harga dan Pengawasan" jawabannya ADA — ini bidang/unit riil yang eksplisit disebut namanya di dokumen resmi RENJA, bukan program yang berdiri sendiri.

MATRIKS KESELARASAN KKR RPJMD-RKPD 2027 (per program & subkegiatan, sumber: KKR-ditinjut-OPD.xlsx):
Urusan Perdagangan (3.30):
- 3.30.02 Perizinan & Pendaftaran Perusahaan: mayoritas subkegiatan TIDAK SELARAS pagu Rp 0 — izin pasar/toko swalayan & NIB (bergeser ke skema NIB/OSS berbasis risiko sesuai PP 28/2025 & Permen Investasi 5/2025), STPW waralaba luar negeri (belum ada pengajuan izin, Disperindag hanya verifikator teknis, penerbit izin ada di DPMPTSP), izin minuman beralkohol gol. B-C (Perda Tangsel No.4/2014 belum mengakomodir, belum ada Perwal turunan), SKA/Surat Keterangan Asal (Disperindag Tangsel belum ditunjuk sebagai instansi penerbit sesuai Permendag 933/2021), sebagian pengawasan B2 (info penjualan bahan berbahaya terbatas, perlu koordinasi dengan Disperindag Provinsi & BPOM). Yang SELARAS: Tanda Daftar Gudang/TDG (Rp 15,44 juta), verifikasi berkas STPW dalam negeri (Rp 7,81 juta), pengawasan distribusi/pelabelan B2 (Rp 10,03 juta).
- 3.30.03 Peningkatan Sarana Distribusi Perdagangan: SELARAS, pagu besar — penyediaan sarana distribusi UPTD Pasar (Rp 748,4 juta), fasilitasi pengelolaan sarana distribusi (Rp 583 juta), pembinaan pengelola sarana distribusi (Rp 37,1 juta & Rp 33,7 juta). TIDAK SELARAS: Sistem Resi Gudang/SRG dan identifikasi komoditas SRG (Rp 0, alasan: Tangsel kota jasa bukan kawasan agraris, lahan pertanian/perkebunan terbatas).
- 3.30.04 Stabilisasi Harga Barang Kebutuhan Pokok dan Barang Penting: SELARAS — koordinasi ketersediaan barang pokok di agen/pasar rakyat (Rp 5 juta), pemantauan harga & stok terintegrasi sistem informasi perdagangan (Rp 30 juta), operasi pasar reguler/khusus (Rp 250 juta). TIDAK SELARAS: pengawasan pupuk/pestisida bersubsidi (Rp 0, alasan: Tangsel tidak memenuhi kriteria penerima alokasi pupuk bersubsidi sesuai Permentan 6/2025 karena wilayah urban bukan sentra pertanian).
- 3.30.05 Pengembangan Ekspor: SELARAS — pameran dagang nasional (Rp 85 juta), pameran dagang lokal (Rp 160 juta), misi dagang produk ekspor unggulan (Rp 29,2 juta), peningkatan citra produk ekspor (Rp 30 juta).
- 3.30.06 Standardisasi & Perlindungan Konsumen (Metrologi Legal): SELARAS — tera/tera ulang alat ukur-takar-timbang di UPTD Pelayanan Metrologi Legal (Rp 38,6 juta).
- 3.30.07 Penggunaan & Pemasaran Produk Dalam Negeri: SELARAS — fasilitasi UMKM ke retail/marketplace/hotel (Rp 55,2 juta).
Urusan Perindustrian (3.31) — SEMUA SELARAS: 3.31.02 Perencanaan & Pembangunan Industri (proporsi IKM kota, target 58); 3.31.03 Pengendalian Izin Usaha Industri (izin usaha industri terbit 98,9%); 3.31.04 Sistem Informasi Industri Nasional/SIINas (ketersediaan data industri 94,44%).

AKAR PENYEBAB SUBKEGIATAN TIDAK SELARAS (5 pola utama):
1. Transisi regulasi perizinan pusat ke skema NIB/OSS berbasis risiko (PP 28/2025, Permen Investasi 5/2025) — desain subkegiatan lama (izin pasar/toko swalayan) belum disesuaikan.
2. Keterbatasan mandat/penunjukan formal — SKA (Disperindag Tangsel belum ditunjuk Kemendag), STPW waralaba luar negeri (kewenangan penerbitan ada di DPMPTSP, Disperindag hanya verifikator teknis).
3. Karakter kota jasa/urban, bukan agraris — Sistem Resi Gudang (SRG) dan pengawasan pupuk bersubsidi tidak relevan untuk konteks Tangsel.
4. Kekosongan payung hukum lokal — izin minuman beralkohol gol. B-C butuh Perwal baru karena Perda Tangsel No.4/2014 belum mengakomodir.
5. Keterbatasan data & koordinasi lintas level pemerintahan — pengawasan B2 (bahan berbahaya) butuh kerja sama dengan Disperindag Provinsi dan BPOM.

KORELASI RENSTRA 2025-2029 DENGAN KKR 2027: Renstra adalah layer strategi (SWOT, visi, target kontribusi PDRB Industri 8.09%→8.45% dan Perdagangan 16.68%→16.87%); KKR adalah layer operasional (program & subkegiatan). Kekuatan/peluang Renstra (SDM ±162 orang, mandat kelembagaan, peluang e-commerce & kemitraan ritel modern) terwujud sebagai program-program berstatus Selaras di atas. Kelemahan/ancaman Renstra (data industri/IKM belum terintegrasi, karakter kota jasa berlahan terbatas, fluktuasi harga/bahan baku) muncul persis sebagai subkegiatan Tidak Selaras yang perlu dikoreksi lewat ABT 2026 (pemetaan & baseline data) dan RPIK 2027 (arah industri berbasis data & tata ruang RTRW/RDTR).
`;

function localFallback(question) {
  const q = String(question || '').toLowerCase();
  if (/renja|2026|anggaran|pagu/.test(q)) {
    return '<b>Rekomendasi eksekutif:</b> Pagu indikatif Renja Murni 2026 adalah Rp 22.530.794.319,- (Belanja Operasi, Belanja Modal Rp 0). Prioritas utama adalah Peningkatan Pendampingan Legalitas HKI bagi IKM dan Pemasaran IKM lewat kemitraan ritel modern. Pagu perkiraan 2027 adalah Rp 26.115.080.473,-.';
  }
  if (/perizinan|oss|nib|3\.30\.02/.test(q)) {
    return '<b>Rekomendasi eksekutif:</b> Redesign program 3.30.02 menjadi fungsi verifikasi teknis dan pendampingan OSS/NIB. Pastikan SOP baru, matriks kewenangan dengan DPMPTSP, dan integrasi data OSS–SIINas masuk agenda ABT/RKPD.';
  }
  if (/bidang|struktur organisasi|stabilisasi harga|pengawasan/.test(q)) {
    return '<b>Rekomendasi eksekutif:</b> Ada. Bidang Stabilisasi Harga dan Pengawasan disebut eksplisit di RENJA 2026 (hal. 55-57) sebagai pengampu Program 3.30.04 (Stabilisasi Harga Barang Kebutuhan Pokok dan Barang Penting) dan pengawasan bahan berbahaya (B2). Struktur lengkapnya: Sekretariat, Bidang Perdagangan (3.30.02/03/05/07), Bidang Perindustrian (3.31.02/03/04), dan Bidang Stabilisasi Harga dan Pengawasan (3.30.04, 3.30.06 metrologi legal, pengawasan B2).';
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
          { role: 'system', content: `Anda adalah AI planning copilot eksekutif untuk Disperindag Tangsel. Gunakan bahasa Indonesia. Jangan mengarang data di luar konteks. Anda punya akses hasil pencarian internet terbaru untuk pertanyaan yang butuh info di luar data dashboard (regulasi terbaru, berita, data eksternal) — pakai itu kalau relevan dan sebutkan sumbernya.

Sesuaikan gaya jawaban dengan jenis pertanyaannya, tanpa diminta:
- Pertanyaan singkat/status/keputusan cepat → jawab ringkas dan langsung actionable, format rekomendasi pimpinan (2-4 kalimat).
- Pertanyaan yang minta alasan/detail/analisis ("kenapa", "jelaskan", "apa dasarnya") → beri uraian analitis lebih rinci berbasis bukti dokumen, poin per poin.
- Pertanyaan skenario/hipotetis ("kalau begini", "bagaimana jika", simulasi anggaran/keputusan) → beri proyeksi langkah-langkah simulasi keputusan, bernomor.
Default ke gaya ringkas kalau jenis pertanyaannya ambigu.` },
          { role: 'user', content: `${knowledge}\n\nPertanyaan: ${question}` }
        ]
      })
    });
    const data = await upstream.json().catch(() => ({}));
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
    console.error('[copilot] OpenRouter call failed:', error.message);
    return json(res, 200, { ok: true, source: 'local-fallback', warning: error.message, answer: localFallback(question), evidence: fallbackEvidence });
  }
};
