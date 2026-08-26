import PptxGenJS from "pptxgenjs";

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 inches (16:9)
pptx.author = "Tim QC Inisiator";
pptx.company = "Smart Quality Inspection System";
pptx.subject = "SQIS — Digitalisasi Quality Control";
pptx.title = "Smart Quality Inspection System (SQIS) — Presentasi 20 Slide";

// ── COLOR PALETTE ─────────────────────────────────────────
const C = {
  navyDeep: "020C1B",
  navyMid: "071428",
  navyCard: "0A1F3D",
  cyan: "00C8E8",
  cyanDim: "0088AA",
  blue: "2563EB",
  green: "22C55E",
  red: "EF4444",
  yellow: "F59E0B",
  purple: "8B5CF6",
  orange: "F97316",
  teal: "06B6D4",
  white: "F1F5F9",
  gray: "94A3B8",
  grayDim: "475569",
};

// ── HELPER FUNCTIONS ──────────────────────────────────────

function addBg(slide) {
  slide.background = { fill: C.navyDeep };
  // Grid overlay (subtle)
  for (let x = 0; x < 14; x++) {
    slide.addShape(pptx.ShapeType.line, {
      x: x, y: 0, w: 0, h: 7.5,
      line: { color: C.cyan, width: 0.2, transparency: 92 },
    });
  }
  for (let y = 0; y < 8; y++) {
    slide.addShape(pptx.ShapeType.line, {
      x: 0, y: y, w: 13.33, h: 0,
      line: { color: C.cyan, width: 0.2, transparency: 92 },
    });
  }
}

function addHeader(slide, n, title, sub) {
  // Header bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.55,
    fill: { color: C.navyMid },
    line: { color: C.cyan, width: 0.5, transparency: 80 },
  });
  // Slide number badge
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.18, y: 0.1, w: 0.35, h: 0.35,
    fill: { color: C.navyCard },
    line: { color: C.cyan, width: 0.8, transparency: 70 },
    rectRadius: 0.04,
  });
  slide.addText(String(n).padStart(2, "0"), {
    x: 0.18, y: 0.1, w: 0.35, h: 0.35,
    fontSize: 8, bold: true, color: C.cyan,
    fontFace: "Courier New", align: "center", valign: "middle",
  });
  // Title
  slide.addText(title, {
    x: 0.65, y: 0.05, w: 10, h: 0.3,
    fontSize: 13, bold: true, color: C.white, fontFace: "Arial",
    valign: "middle",
  });
  if (sub) {
    slide.addText(sub, {
      x: 0.65, y: 0.33, w: 10, h: 0.18,
      fontSize: 7.5, color: C.cyan, fontFace: "Arial",
      transparency: 40,
    });
  }
}

function addNavBar(slide, n, total, hubLink) {
  // Bottom bar bg
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 7.1, w: 13.33, h: 0.4,
    fill: { color: "030F1F" },
    line: { color: C.cyan, width: 0.3, transparency: 85 },
  });
  // Slide counter
  slide.addText(`${n} / ${total}`, {
    x: 12.5, y: 7.13, w: 0.8, h: 0.25,
    fontSize: 7, color: C.grayDim, fontFace: "Courier New",
  });
  // Progress dots
  const dotW = 0.08, dotH = 0.08, startX = 5.5, dotY = 7.21;
  for (let i = 0; i < total; i++) {
    const active = i === n - 1;
    slide.addShape(pptx.ShapeType.ellipse, {
      x: startX + i * 0.13, y: dotY, w: active ? 0.2 : dotW, h: dotH,
      fill: { color: active ? C.cyan : C.grayDim },
      line: { color: active ? C.cyan : C.grayDim, width: 0 },
    });
  }
  // Hub button
  if (hubLink && n !== 7) {
    slide.addText("⌂ Hub", {
      x: 12.0, y: 7.13, w: 0.45, h: 0.25,
      fontSize: 7, color: C.cyan, fontFace: "Arial",
      hyperlink: { slide: 7 },
    });
  }
}

function card(slide, x, y, w, h, color = C.navyCard, borderColor = null) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h,
    fill: { color },
    line: { color: borderColor || C.grayDim, width: 0.5, transparency: 60 },
    rectRadius: 0.1,
    shadow: { type: "outer", blur: 8, offset: 2, angle: 45, color: "000000", transparency: 70 },
  });
}

function accentLine(slide, x, y, w, color = C.cyan) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h: 0.03,
    fill: { color },
    line: { color, width: 0 },
    rectRadius: 0.02,
  });
}

function bullet(slide, x, y, text, color = C.gray, dotColor = C.cyan) {
  slide.addShape(pptx.ShapeType.ellipse, {
    x: x, y: y + 0.06, w: 0.07, h: 0.07,
    fill: { color: dotColor },
  });
  slide.addText(text, {
    x: x + 0.12, y, w: 2.8, h: 0.22,
    fontSize: 8, color, fontFace: "Arial",
  });
}

// ── SLIDE 01 — COVER ──────────────────────────────────────
{
  const sl = pptx.addSlide();
  sl.transition = { type: "fade", durations: 800 };
  addBg(sl);

  // Glow circle
  sl.addShape(pptx.ShapeType.ellipse, {
    x: 2, y: 1, w: 5, h: 5,
    fill: { color: "003060", transparency: 70 },
    line: { color: "000000", width: 0 },
  });

  // Logo box
  sl.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 0.8, w: 0.8, h: 0.8,
    fill: { color: C.navyCard },
    line: { color: C.cyan, width: 1, transparency: 60 },
    rectRadius: 0.1,
  });
  sl.addText("QC", { x: 0.6, y: 0.8, w: 0.8, h: 0.8, fontSize: 20, bold: true, color: C.cyan, fontFace: "Arial", align: "center", valign: "middle" });

  // SQIS tag
  sl.addText("SMART QUALITY INSPECTION SYSTEM", { x: 1.55, y: 0.85, w: 7, h: 0.25, fontSize: 8, color: C.cyan, fontFace: "Arial", charSpacing: 3 });
  sl.addText("Industri Makanan / Manufaktur", { x: 1.55, y: 1.1, w: 5, h: 0.2, fontSize: 8, color: C.grayDim, fontFace: "Arial" });

  // Main Title
  sl.addText("Digitalisasi", { x: 0.6, y: 1.8, w: 8, h: 0.85, fontSize: 52, bold: true, color: C.white, fontFace: "Arial" });
  sl.addText("Quality Control", { x: 0.6, y: 2.55, w: 9, h: 0.85, fontSize: 52, bold: true, color: C.cyan, fontFace: "Arial" });

  accentLine(sl, 0.6, 3.45, 1.8, C.cyan);
  accentLine(sl, 2.55, 3.45, 1.5, C.blue);

  sl.addText("Transformasi proses inspeksi QC dari 3 form kertas manual menjadi platform\ndigital real-time terintegrasi menggunakan framework DMAIC.", {
    x: 0.6, y: 3.6, w: 7.5, h: 0.7,
    fontSize: 10.5, color: C.gray, fontFace: "Arial", lineSpacingMultiple: 1.3,
  });

  // Badges
  const badges = ["📋 3 Form Digitized", "⚡ 8 Mesin Real-time", "📊 Dashboard Supervisor", "✅ FSSC 22000 Ready"];
  badges.forEach((b, i) => {
    const bx = 0.6 + i * 2.7;
    sl.addShape(pptx.ShapeType.rect, { x: bx, y: 4.45, w: 2.55, h: 0.3, fill: { color: C.navyCard }, line: { color: C.grayDim, width: 0.4, transparency: 50 }, rectRadius: 0.15 });
    sl.addText(b, { x: bx, y: 4.45, w: 2.55, h: 0.3, fontSize: 8, color: C.gray, fontFace: "Arial", align: "center", valign: "middle" });
  });

  // Start Button
  sl.addShape(pptx.ShapeType.rect, { x: 0.6, y: 5.0, w: 2.2, h: 0.5, fill: { color: C.cyan }, line: { color: C.cyan, width: 0 }, rectRadius: 0.1 });
  sl.addText("Mulai Presentasi →", { x: 0.6, y: 5.0, w: 2.2, h: 0.5, fontSize: 10, bold: true, color: C.navyDeep, fontFace: "Arial", align: "center", valign: "middle", hyperlink: { slide: 2 } });

  // Right side mockup
  card(sl, 9.8, 1.2, 3.0, 3.8, C.navyMid, C.cyan);
  sl.addShape(pptx.ShapeType.rect, { x: 9.8, y: 1.2, w: 3.0, h: 0.4, fill: { color: C.navyCard }, line: { color: C.cyan, width: 0.5, transparency: 75 }, rectRadius: 0.1 });
  sl.addText("sqis · dashboard", { x: 10.2, y: 1.28, w: 2.2, h: 0.22, fontSize: 7, color: C.grayDim, fontFace: "Courier New" });
  const dashData = [["Total Inspeksi","2",C.cyan],["Line Selesai","1",C.green],["Belum Diperiksa","5",C.yellow],["Mesin OFF","1",C.red]];
  dashData.forEach(([l,v,c], i) => {
    sl.addText(l, { x: 10.0, y: 1.75 + i * 0.35, w: 1.8, h: 0.25, fontSize: 8, color: C.grayDim, fontFace: "Arial" });
    sl.addText(v, { x: 12.2, y: 1.75 + i * 0.35, w: 0.5, h: 0.25, fontSize: 12, bold: true, color: c, fontFace: "Courier New", align: "right" });
  });

  addNavBar(sl, 1, 20, false);
}

// ── SLIDE 02 — EXECUTIVE SUMMARY ─────────────────────────
{
  const sl = pptx.addSlide();
  sl.transition = { type: "morph", durations: 600 };
  addBg(sl);
  addHeader(sl, 2, "Executive Summary & Latar Belakang Masalah", "Akar inefisiensi QC manual — 3 form kertas");

  // Problem statement banner
  sl.addShape(pptx.ShapeType.rect, { x: 0.3, y: 0.65, w: 12.73, h: 0.65, fill: { color: "001830" }, line: { color: C.cyan, width: 0.6, transparency: 70 }, rectRadius: 0.08 });
  sl.addText("PROBLEM STATEMENT", { x: 0.5, y: 0.68, w: 2.5, h: 0.2, fontSize: 7, bold: true, color: C.cyan, fontFace: "Courier New", charSpacing: 2 });
  sl.addText("Proses QC Packaging saat ini bergantung pada 3 form kertas terpisah. Hal ini menimbulkan bottleneck waktu, risiko kehilangan data, serta keterlambatan respon atas ketidaksesuaian di lini produksi.", {
    x: 0.5, y: 0.88, w: 12.33, h: 0.35, fontSize: 9, color: C.gray, fontFace: "Arial",
  });

  // Impact stats
  const stats = [["3","Form Kertas","Tidak terintegrasi",C.red],["120","Menit / Shift","Waktu tunggu approval",C.yellow],["8","Mesin","Tanpa monitoring real-time",C.orange]];
  stats.forEach(([v,l,s,c], i) => {
    const x = 0.3 + i * 4.3;
    card(sl, x, 1.4, 4.0, 1.0, C.navyCard, c);
    sl.addText(v, { x, y: 1.45, w: 1.2, h: 0.9, fontSize: 44, bold: true, color: c, fontFace: "Arial", align: "center", valign: "middle" });
    sl.addText(l, { x: x + 1.1, y: 1.5, w: 2.8, h: 0.35, fontSize: 14, bold: true, color: C.white, fontFace: "Arial" });
    sl.addText(s, { x: x + 1.1, y: 1.85, w: 2.8, h: 0.25, fontSize: 8, color: C.grayDim, fontFace: "Arial" });
  });

  // Problem cards
  const probs = [
    ["📄","3 Form Kertas Manual","Laporan Harian QC, Setting Mesin, Log Sampel — terpisah dan tidak terintegrasi satu sama lain.", C.red],
    ["⏱️","Bottleneck Waktu","Approval dan rekap data membutuhkan hingga 120 menit per shift — non-value-added time.", C.yellow],
    ["⚠️","Risiko Human Error","Pencatatan manual berpotensi kehilangan data atau kesalahan input di 8 mesin setiap shift.", C.orange],
  ];
  probs.forEach(([icon, title, desc, c], i) => {
    const x = 0.3 + i * 4.3;
    card(sl, x, 2.55, 4.0, 2.4, C.navyCard, c);
    sl.addText(icon, { x: x + 0.15, y: 2.65, w: 0.6, h: 0.6, fontSize: 24, align: "center" });
    sl.addText(title, { x: x + 0.15, y: 3.3, w: 3.7, h: 0.3, fontSize: 10, bold: true, color: C.white, fontFace: "Arial" });
    sl.addText(desc, { x: x + 0.15, y: 3.65, w: 3.7, h: 0.9, fontSize: 8.5, color: C.gray, fontFace: "Arial", lineSpacingMultiple: 1.3 });
    accentLine(sl, x + 0.15, 4.85, 3.4, c);
  });

  // Bottom note + link to DMAIC
  card(sl, 0.3, 5.1, 12.73, 0.55, C.navyMid, C.cyanDim);
  sl.addText("💡  Diperlukan solusi digitalisasi sistemik berbasis teknologi yang menjawab semua dimensi 5M+1E sekaligus.", {
    x: 0.5, y: 5.15, w: 10, h: 0.45, fontSize: 9, color: C.gray, fontFace: "Arial",
  });
  sl.addShape(pptx.ShapeType.rect, { x: 11.2, y: 5.18, w: 1.8, h: 0.38, fill: { color: C.navyCard }, line: { color: C.cyan, width: 0.6, transparency: 60 }, rectRadius: 0.08 });
  sl.addText("Lihat DMAIC →", { x: 11.2, y: 5.18, w: 1.8, h: 0.38, fontSize: 8, bold: true, color: C.cyan, fontFace: "Arial", align: "center", valign: "middle", hyperlink: { slide: 7 } });

  addNavBar(sl, 2, 20, true);
}

// ── SLIDE 03 — FISHBONE FULL ──────────────────────────────
{
  const sl = pptx.addSlide();
  sl.transition = { type: "morph", durations: 700 };
  addBg(sl);
  addHeader(sl, 3, "Analisis Akar Masalah — Fishbone Diagram 5M+1E", "Klik cabang untuk Deep Dive detail");

  // Spine
  sl.addShape(pptx.ShapeType.line, { x: 0.5, y: 3.8, w: 11.3, h: 0, line: { color: C.cyan, width: 2.5 } });
  // Arrow head
  sl.addShape(pptx.ShapeType.rect, { x: 11.5, y: 3.55, w: 0.8, h: 0.5, fill: { color: C.navyCard }, line: { color: C.cyan, width: 1 }, rectRadius: 0.06 });
  sl.addText("Inefisiensi\nQC Manual", { x: 11.5, y: 3.55, w: 0.8, h: 0.5, fontSize: 7, bold: true, color: C.cyan, fontFace: "Arial", align: "center", valign: "middle" });

  // Branches
  const topBranches = [
    { label: "MAN", x: 2.5, color: C.blue, causes: ["Human error", "Kelelahan operator", "Kurang training"] },
    { label: "METHOD", x: 5.5, color: C.purple, causes: ["Form manual", "Approval lambat", "SOP tidak update"] },
    { label: "MACHINE", x: 8.5, color: C.yellow, causes: ["Tidak real-time", "Parameter manual", "Tidak terintegrasi"] },
  ];
  const botBranches = [
    { label: "MATERIAL", x: 2.5, color: C.green, causes: ["Variasi bahan baku", "Tidak ter-track", "Shelf life manual"] },
    { label: "MEASUREMENT", x: 5.5, color: C.teal, causes: ["Validasi manual", "Histori sulit", "Alat tidak terkalibrasi"] },
    { label: "ENVIRONMENT", x: 8.5, color: C.orange, causes: ["Area basah", "Form rusak", "Suhu tidak tercatat"] },
  ];

  topBranches.forEach(b => {
    sl.addShape(pptx.ShapeType.line, { x: b.x, y: 2.4, w: 0.8, h: 1.4, line: { color: b.color, width: 2 } });
    sl.addShape(pptx.ShapeType.rect, { x: b.x - 0.5, y: 1.6, w: 1.8, h: 0.55, fill: { color: C.navyCard }, line: { color: b.color, width: 1, transparency: 40 }, rectRadius: 0.08 });
    sl.addText(b.label, { x: b.x - 0.5, y: 1.6, w: 1.8, h: 0.35, fontSize: 11, bold: true, color: b.color, fontFace: "Arial", align: "center", valign: "middle" });
    b.causes.forEach((c, ci) => {
      sl.addShape(pptx.ShapeType.line, { x: b.x - 0.3 + ci * 0.2, y: 2.3 - ci * 0.3, w: -0.4, h: 0, line: { color: b.color, width: 1, transparency: 50 } });
      sl.addText(c, { x: b.x - 1.1 + ci * 0.1, y: 2.1 - ci * 0.28, w: 1.5, h: 0.2, fontSize: 7, color: C.gray, fontFace: "Arial" });
    });
  });

  botBranches.forEach(b => {
    sl.addShape(pptx.ShapeType.line, { x: b.x, y: 3.8, w: 0.8, h: 1.4, line: { color: b.color, width: 2 } });
    sl.addShape(pptx.ShapeType.rect, { x: b.x - 0.5, y: 5.35, w: 1.8, h: 0.55, fill: { color: C.navyCard }, line: { color: b.color, width: 1, transparency: 40 }, rectRadius: 0.08 });
    sl.addText(b.label, { x: b.x - 0.5, y: 5.35, w: 1.8, h: 0.35, fontSize: 10, bold: true, color: b.color, fontFace: "Arial", align: "center", valign: "middle" });
    b.causes.forEach((c, ci) => {
      sl.addText(c, { x: b.x - 1.1 + ci * 0.1, y: 5.1 + ci * 0.25, w: 1.5, h: 0.2, fontSize: 7, color: C.gray, fontFace: "Arial" });
    });
  });

  // Navigation buttons
  sl.addShape(pptx.ShapeType.rect, { x: 0.3, y: 6.5, w: 6.2, h: 0.38, fill: { color: "001838" }, line: { color: C.blue, width: 0.8, transparency: 50 }, rectRadius: 0.08 });
  sl.addText("→ Deep Dive: Man / Method / Machine", { x: 0.3, y: 6.5, w: 6.2, h: 0.38, fontSize: 9, bold: true, color: C.blue, fontFace: "Arial", align: "center", valign: "middle", hyperlink: { slide: 4 } });
  sl.addShape(pptx.ShapeType.rect, { x: 6.8, y: 6.5, w: 6.2, h: 0.38, fill: { color: "001822" }, line: { color: C.green, width: 0.8, transparency: 50 }, rectRadius: 0.08 });
  sl.addText("→ Deep Dive: Material / Measurement / Environment", { x: 6.8, y: 6.5, w: 6.2, h: 0.38, fontSize: 9, bold: true, color: C.green, fontFace: "Arial", align: "center", valign: "middle", hyperlink: { slide: 5 } });

  addNavBar(sl, 3, 20, true);
}

// ── SLIDE 04 — FISHBONE DEEP DIVE 1 ──────────────────────
{
  const sl = pptx.addSlide();
  sl.transition = { type: "morph", durations: 700 };
  addBg(sl);
  addHeader(sl, 4, "Deep Dive Fishbone: Man, Method & Machine", "Zoom In — Cabang Atas");

  const cats = [
    { color: C.blue, icon: "👤", title: "Man", items: ["Operator lelah setelah shift panjang","Pencatatan manual tidak konsisten","Training SOP tidak terdokumentasi","Key person risk — bergantung 1 orang"] },
    { color: C.purple, icon: "📋", title: "Method", items: ["3 form kertas terpisah tidak ter-link","Approval supervisor harus hadir fisik","Prosedur eskalasi temuan NG lambat","Tidak ada format standar yang seragam"] },
    { color: C.yellow, icon: "⚙️", title: "Machine", items: ["8 mesin tanpa koneksi data real-time","Pencatatan suhu & kecepatan manual","Tidak ada peringatan otomatis deviasi","Histori parameter tidak tersimpan digital"] },
  ];

  cats.forEach((c, i) => {
    const x = 0.3 + i * 4.35;
    card(sl, x, 0.65, 4.1, 5.8, C.navyCard, c.color);
    sl.addShape(pptx.ShapeType.rect, { x, y: 0.65, w: 4.1, h: 0.75, fill: { color: c.color + "20" }, line: { color: c.color, width: 0.5, transparency: 40 }, rectRadius: 0.1 });
    sl.addText(c.icon, { x, y: 0.68, w: 0.7, h: 0.65, fontSize: 22, align: "center", valign: "middle" });
    sl.addText(c.title, { x: x + 0.65, y: 0.72, w: 2.5, h: 0.32, fontSize: 16, bold: true, color: c.color, fontFace: "Arial" });
    sl.addText("AKAR MASALAH", { x: x + 0.65, y: 1.04, w: 2.5, h: 0.2, fontSize: 7, color: c.color, fontFace: "Courier New", charSpacing: 1 });
    c.items.forEach((it, ii) => {
      sl.addShape(pptx.ShapeType.ellipse, { x: x + 0.2, y: 1.6 + ii * 0.85 + 0.08, w: 0.08, h: 0.08, fill: { color: c.color }, line: { color: c.color, width: 0 } });
      sl.addText(it, { x: x + 0.35, y: 1.55 + ii * 0.85, w: 3.6, h: 0.7, fontSize: 9, color: C.gray, fontFace: "Arial", lineSpacingMultiple: 1.3 });
    });
    accentLine(sl, x + 0.2, 6.28, 3.5, c.color);
  });

  sl.addShape(pptx.ShapeType.rect, { x: 0.3, y: 6.5, w: 6.2, h: 0.38, fill: { color: C.navyMid }, line: { color: C.grayDim, width: 0.4, transparency: 60 }, rectRadius: 0.08 });
  sl.addText("← Kembali ke Fishbone Lengkap", { x: 0.3, y: 6.5, w: 6.2, h: 0.38, fontSize: 9, color: C.grayDim, fontFace: "Arial", align: "center", valign: "middle", hyperlink: { slide: 3 } });
  sl.addShape(pptx.ShapeType.rect, { x: 6.8, y: 6.5, w: 6.2, h: 0.38, fill: { color: "001822" }, line: { color: C.green, width: 0.8, transparency: 50 }, rectRadius: 0.08 });
  sl.addText("Lanjut: Material / Measurement / Environment →", { x: 6.8, y: 6.5, w: 6.2, h: 0.38, fontSize: 9, bold: true, color: C.green, fontFace: "Arial", align: "center", valign: "middle", hyperlink: { slide: 5 } });

  addNavBar(sl, 4, 20, true);
}

// ── SLIDE 05 — FISHBONE DEEP DIVE 2 ──────────────────────
{
  const sl = pptx.addSlide();
  sl.transition = { type: "morph", durations: 700 };
  addBg(sl);
  addHeader(sl, 5, "Deep Dive Fishbone: Material, Measurement & Environment", "Zoom In — Cabang Bawah");

  const cats = [
    { color: C.green, icon: "📦", title: "Material", items: ["Variasi bahan baku dari supplier berbeda","Tidak ada tracking per batch bahan masuk","Standar kadar air berbeda per produk","Shelf life bahan belum terdigitalisasi"] },
    { color: C.teal, icon: "📏", title: "Measurement", items: ["Validasi akurasi alat ukur manual","Histori kadar air per sampel sulit dicari","Alat higrometer tidak terkalibrasi rutin","Hasil pengukuran tidak ter-link ke batch"] },
    { color: C.orange, icon: "🌡️", title: "Environment", items: ["Area packaging basah & lembap","Form kertas rusak terkena air","Suhu ruangan tidak tercatat per shift","Kondisi lingkungan tidak terkorelasi ke NG"] },
  ];

  cats.forEach((c, i) => {
    const x = 0.3 + i * 4.35;
    card(sl, x, 0.65, 4.1, 5.8, C.navyCard, c.color);
    sl.addShape(pptx.ShapeType.rect, { x, y: 0.65, w: 4.1, h: 0.75, fill: { color: c.color + "20" }, line: { color: c.color, width: 0.5, transparency: 40 }, rectRadius: 0.1 });
    sl.addText(c.icon, { x, y: 0.68, w: 0.7, h: 0.65, fontSize: 22, align: "center", valign: "middle" });
    sl.addText(c.title, { x: x + 0.65, y: 0.72, w: 2.5, h: 0.32, fontSize: 16, bold: true, color: c.color, fontFace: "Arial" });
    sl.addText("AKAR MASALAH", { x: x + 0.65, y: 1.04, w: 2.5, h: 0.2, fontSize: 7, color: c.color, fontFace: "Courier New", charSpacing: 1 });
    c.items.forEach((it, ii) => {
      sl.addShape(pptx.ShapeType.ellipse, { x: x + 0.2, y: 1.6 + ii * 0.85 + 0.08, w: 0.08, h: 0.08, fill: { color: c.color }, line: { color: c.color, width: 0 } });
      sl.addText(it, { x: x + 0.35, y: 1.55 + ii * 0.85, w: 3.6, h: 0.7, fontSize: 9, color: C.gray, fontFace: "Arial", lineSpacingMultiple: 1.3 });
    });
    accentLine(sl, x + 0.2, 6.28, 3.5, c.color);
  });

  sl.addShape(pptx.ShapeType.rect, { x: 0.3, y: 6.5, w: 6.2, h: 0.38, fill: { color: C.navyMid }, line: { color: C.grayDim, width: 0.4, transparency: 60 }, rectRadius: 0.08 });
  sl.addText("← Kembali ke Fishbone Lengkap", { x: 0.3, y: 6.5, w: 6.2, h: 0.38, fontSize: 9, color: C.grayDim, fontFace: "Arial", align: "center", valign: "middle", hyperlink: { slide: 3 } });
  sl.addShape(pptx.ShapeType.rect, { x: 6.8, y: 6.5, w: 6.2, h: 0.38, fill: { color: "001820" }, line: { color: C.cyan, width: 0.8, transparency: 50 }, rectRadius: 0.08 });
  sl.addText("Lanjut: Pemetaan 5W+1H →", { x: 6.8, y: 6.5, w: 6.2, h: 0.38, fontSize: 9, bold: true, color: C.cyan, fontFace: "Arial", align: "center", valign: "middle", hyperlink: { slide: 6 } });

  addNavBar(sl, 5, 20, true);
}

// ── SLIDE 06 — 5W+1H MATRIX ──────────────────────────────
{
  const sl = pptx.addSlide();
  sl.transition = { type: "morph", durations: 600 };
  addBg(sl);
  addHeader(sl, 6, "Pemetaan Masalah 5W + 1H", "Konteks & scope permasalahan QC inefisiensi manual");

  const cells = [
    { q:"What", icon:"❓", color:C.blue, ans:"Proses pencatatan inspeksi QC manual di lini packaging", det:"3 form kertas: Laporan Harian QC, Setting Mesin, Log Sampel" },
    { q:"Why", icon:"💡", color:C.purple, ans:"Metode konvensional menciptakan inefisiensi & risiko kesalahan", det:"Tidak ada validasi otomatis, duplikasi kerja, approval terlambat" },
    { q:"Where", icon:"📍", color:C.yellow, ans:"Lini Packaging — Area Produksi (kondisi basah / lembap)", det:"8 mesin sealer di 3 lini aktif, ruang supervisor terpisah" },
    { q:"When", icon:"⏰", color:C.green, ans:"Setiap shift (3× per hari), setiap inspeksi QC dilakukan", det:"Bottleneck terjadi saat pergantian shift & saat approval" },
    { q:"Who", icon:"👥", color:C.teal, ans:"QC Inspector, Supervisor QC, Tim Produksi, Management", det:"QC Inspector isi form → Supervisor approval → Produksi terima" },
    { q:"How", icon:"🔧", color:C.orange, ans:"Implementasi SQIS: platform digital tablet + cloud DB", det:"Framework DMAIC, pilot lini 1, rollout bertahap 16 minggu" },
  ];

  cells.forEach((c, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.3 + col * 4.35;
    const y = 0.68 + row * 3.0;
    card(sl, x, y, 4.1, 2.75, C.navyCard, c.color);
    sl.addShape(pptx.ShapeType.rect, { x, y, w: 4.1, h: 0.6, fill: { color: c.color + "15" }, line: { color: c.color, width: 0.4, transparency: 40 }, rectRadius: 0.08 });
    sl.addText(c.icon, { x, y: y + 0.05, w: 0.6, h: 0.5, fontSize: 18, align: "center", valign: "middle" });
    sl.addText(c.q, { x: x + 0.58, y: y + 0.12, w: 2.5, h: 0.38, fontSize: 18, bold: true, color: c.color, fontFace: "Arial" });
    sl.addText(c.ans, { x: x + 0.15, y: y + 0.72, w: 3.8, h: 0.75, fontSize: 9, bold: true, color: C.white, fontFace: "Arial", lineSpacingMultiple: 1.3 });
    sl.addText(c.det, { x: x + 0.15, y: y + 1.5, w: 3.8, h: 0.8, fontSize: 8, color: C.grayDim, fontFace: "Arial", lineSpacingMultiple: 1.3 });
  });

  addNavBar(sl, 6, 20, true);
}

// ── SLIDE 07 — DMAIC HUB (Interactive) ───────────────────
{
  const sl = pptx.addSlide();
  sl.transition = { type: "morph", durations: 600 };
  addBg(sl);
  addHeader(sl, 7, "Kerangka Kerja DMAIC — Interactive Main Hub", "Klik setiap tahap untuk navigasi langsung ke slide detail");

  sl.addText("METHODOLOGY", { x: 0.3, y: 0.65, w: 4, h: 0.25, fontSize: 7, color: C.grayDim, fontFace: "Courier New", charSpacing: 3 });

  const stages = [
    { id:"D", label:"Define",   color:C.blue,   slide:2,  desc:"Definisi masalah & latar belakang",  detail:"Slide 2 — Executive Summary" },
    { id:"M", label:"Measure",  color:C.teal,   slide:8,  desc:"VSM & pengukuran baseline Lead Time", detail:"Slide 8 — Value Stream Mapping" },
    { id:"A", label:"Analyze",  color:C.purple, slide:3,  desc:"Fishbone 5M+1E & analisis akar",      detail:"Slide 3 — Fishbone Diagram" },
    { id:"I", label:"Improve",  color:C.green,  slide:9,  desc:"Transformasi alur kerja & UI SQIS",   detail:"Slide 9 — Workflow Comparison" },
    { id:"C", label:"Control",  color:C.yellow, slide:15, desc:"Fitur kontrol & role access sistem",  detail:"Slide 15 — Role Access" },
  ];

  // Pentagon-like layout positions
  const positions = [
    { x: 2.0, y: 1.0 }, { x: 3.8, y: 0.7 }, { x: 5.2, y: 1.8 },
    { x: 4.4, y: 3.2 }, { x: 2.8, y: 3.2 },
  ];

  // Center circle
  sl.addShape(pptx.ShapeType.ellipse, { x: 2.8, y: 1.5, w: 1.8, h: 1.8, fill: { color: C.navyCard }, line: { color: C.cyan, width: 1, transparency: 50 } });
  sl.addText("DMAIC", { x: 2.8, y: 1.9, w: 1.8, h: 0.4, fontSize: 16, bold: true, color: C.cyan, fontFace: "Arial", align: "center" });
  sl.addText("Framework", { x: 2.8, y: 2.3, w: 1.8, h: 0.3, fontSize: 8, color: C.grayDim, fontFace: "Arial", align: "center" });

  // Outer ring
  sl.addShape(pptx.ShapeType.ellipse, { x: 1.3, y: 0.8, w: 4.8, h: 4.0, fill: { color: "000000", transparency: 100 }, line: { color: C.cyan, width: 0.5, transparency: 80 } });

  // Stage nodes
  stages.forEach((s, i) => {
    const pos = positions[i];
    sl.addShape(pptx.ShapeType.ellipse, { x: pos.x, y: pos.y, w: 1.1, h: 1.1, fill: { color: s.color + "20" }, line: { color: s.color, width: 1.5 } });
    sl.addText(s.id, { x: pos.x, y: pos.y + 0.1, w: 1.1, h: 0.55, fontSize: 22, bold: true, color: s.color, fontFace: "Arial", align: "center" });
    sl.addText(s.label, { x: pos.x, y: pos.y + 0.65, w: 1.1, h: 0.28, fontSize: 7.5, bold: true, color: s.color, fontFace: "Arial", align: "center" });
    // Make clickable
    sl.addShape(pptx.ShapeType.ellipse, {
      x: pos.x, y: pos.y, w: 1.1, h: 1.1,
      fill: { color: "000000", transparency: 100 },
      line: { color: "000000", width: 0 },
      hyperlink: { slide: s.slide },
    });
  });

  // Right side: stage cards
  sl.addText("KLIK TAHAP UNTUK NAVIGASI LANGSUNG →", { x: 7.5, y: 0.7, w: 5.5, h: 0.25, fontSize: 7, color: C.grayDim, fontFace: "Courier New", charSpacing: 1.5 });

  stages.forEach((s, i) => {
    const y = 1.0 + i * 1.14;
    card(sl, 7.5, y, 5.5, 1.0, C.navyCard, s.color);
    sl.addShape(pptx.ShapeType.rect, { x: 7.5, y, w: 0.85, h: 1.0, fill: { color: s.color + "20" }, line: { color: s.color, width: 0.5, transparency: 50 }, rectRadius: 0.08 });
    sl.addText(s.id, { x: 7.5, y, w: 0.85, h: 1.0, fontSize: 28, bold: true, color: s.color, fontFace: "Arial", align: "center", valign: "middle" });
    sl.addText(s.label, { x: 8.5, y: y + 0.12, w: 3.0, h: 0.3, fontSize: 13, bold: true, color: C.white, fontFace: "Arial" });
    sl.addText(s.desc, { x: 8.5, y: y + 0.42, w: 3.0, h: 0.4, fontSize: 8, color: C.gray, fontFace: "Arial" });
    sl.addText(s.detail, { x: 11.5, y: y + 0.35, w: 1.4, h: 0.3, fontSize: 7.5, color: s.color, fontFace: "Arial", align: "right" });
    // Clickable overlay
    sl.addShape(pptx.ShapeType.rect, { x: 7.5, y, w: 5.5, h: 1.0, fill: { color: "000000", transparency: 100 }, line: { color: "000000", width: 0 }, hyperlink: { slide: s.slide } });
  });

  addNavBar(sl, 7, 20, false);
}

// ── SLIDE 08 — VALUE STREAM MAPPING ──────────────────────
{
  const sl = pptx.addSlide();
  sl.transition = { type: "morph", durations: 700 };
  addBg(sl);
  addHeader(sl, 8, "Value Stream Mapping — Current vs Future State", "Measure: Reduksi Lead Time inspeksi 87.5%");

  // Big stat comparison
  const stats = [[C.red,"CURRENT STATE — MANUAL","120","menit per inspeksi shift"],[C.green,"FUTURE STATE — SQIS","15","menit per inspeksi shift"]];
  stats.forEach(([c,lbl,v,sub], i) => {
    card(sl, 0.3 + i * 6.5, 0.65, 6.2, 1.0, C.navyCard, c);
    sl.addText(lbl, { x: 0.5 + i * 6.5, y: 0.7, w: 5.8, h: 0.22, fontSize: 7.5, color: c, fontFace: "Courier New", charSpacing: 1 });
    sl.addText(v, { x: 0.5 + i * 6.5, y: 0.9, w: 1.2, h: 0.6, fontSize: 36, bold: true, color: c, fontFace: "Arial" });
    sl.addText(sub, { x: 1.8 + i * 6.5, y: 1.05, w: 4, h: 0.4, fontSize: 10, color: C.gray, fontFace: "Arial" });
  });

  // Before steps
  const before = ["Tulis form kertas (3 lembar)","Tunggu supervisor hadir","Approval tanda tangan fisik","Rekap data di komputer","Distribusi laporan via WA/email","Arsip fisik & filling"];
  const bTimes = ["15 min","30 min","20 min","25 min","20 min","10 min"];

  sl.addText("BEFORE — BOTTLENECK FLOW", { x: 0.3, y: 1.8, w: 6, h: 0.22, fontSize: 7.5, color: C.red, fontFace: "Courier New", charSpacing: 1.5 });
  before.forEach((s, i) => {
    card(sl, 0.3, 2.08 + i * 0.77, 6.2, 0.65, C.navyCard, C.red);
    sl.addShape(pptx.ShapeType.rect, { x: 0.3, y: 2.08 + i * 0.77, w: 0.28, h: 0.65, fill: { color: C.red + "25" }, line: { color: C.red, width: 0, transparency: 100 }, rectRadius: 0.06 });
    sl.addText(String(i + 1), { x: 0.3, y: 2.08 + i * 0.77, w: 0.28, h: 0.65, fontSize: 10, bold: true, color: C.red, fontFace: "Arial", align: "center", valign: "middle" });
    sl.addText(s, { x: 0.65, y: 2.13 + i * 0.77, w: 4.2, h: 0.55, fontSize: 9, color: C.gray, fontFace: "Arial", valign: "middle" });
    sl.addText(bTimes[i], { x: 5.0, y: 2.13 + i * 0.77, w: 1.4, h: 0.55, fontSize: 9, bold: true, color: C.red, fontFace: "Courier New", align: "right", valign: "middle" });
  });

  // After steps
  const after = ["Input digital via tablet (QR Scan)","Auto-validasi sistem instan","Notifikasi supervisor real-time","Approval e-signature digital","Report auto-generate PDF/Excel","Cloud archive otomatis terenkripsi"];
  const aTimes = ["3 min","0 min","1 min","5 min","2 min","0 min"];

  sl.addText("AFTER — STREAMLINED SQIS", { x: 6.8, y: 1.8, w: 6.2, h: 0.22, fontSize: 7.5, color: C.green, fontFace: "Courier New", charSpacing: 1.5 });
  after.forEach((s, i) => {
    card(sl, 6.8, 2.08 + i * 0.77, 6.2, 0.65, C.navyCard, C.green);
    sl.addShape(pptx.ShapeType.rect, { x: 6.8, y: 2.08 + i * 0.77, w: 0.28, h: 0.65, fill: { color: C.green + "25" }, line: { color: "000000", width: 0 }, rectRadius: 0.06 });
    sl.addText("✓", { x: 6.8, y: 2.08 + i * 0.77, w: 0.28, h: 0.65, fontSize: 10, bold: true, color: C.green, fontFace: "Arial", align: "center", valign: "middle" });
    sl.addText(s, { x: 7.15, y: 2.13 + i * 0.77, w: 4.2, h: 0.55, fontSize: 9, color: C.gray, fontFace: "Arial", valign: "middle" });
    sl.addText(aTimes[i], { x: 11.6, y: 2.13 + i * 0.77, w: 1.3, h: 0.55, fontSize: 9, bold: true, color: C.green, fontFace: "Courier New", align: "right", valign: "middle" });
  });

  addNavBar(sl, 8, 20, true);
}

// ── SLIDE 09 — WORKFLOW COMPARISON ───────────────────────
{
  const sl = pptx.addSlide();
  sl.transition = { type: "morph", durations: 700 };
  addBg(sl);
  addHeader(sl, 9, "Matriks Perbandingan Alur Kerja — Before vs After", "Improve: 6 langkah manual → 6 langkah digital");

  const steps = [
    ["Tulis form QC kertas (3 lembar terpisah)","Scan QR Line → Load data batch otomatis"],
    ["Isi parameter manual per mesin tanpa validasi","Input digital dengan validasi toleransi otomatis"],
    ["Catat kadar air di logbook terpisah","Tracking sampel terhubung ke Sample ID digital"],
    ["Foto/kirim laporan ke supervisor via WA","Notifikasi real-time langsung ke dashboard supervisor"],
    ["Supervisor tanda tangan fisik — butuh hadir","Approval e-signature dari device mana pun, kapan saja"],
    ["Rekap & arsip manual di komputer office","Auto-generate laporan + cloud archive terenkripsi"],
  ];

  // Headers
  card(sl, 0.3, 0.65, 6.1, 0.45, "100010", C.red);
  sl.addText("📄  BEFORE — Manual Konvensional", { x: 0.3, y: 0.65, w: 6.1, h: 0.45, fontSize: 9.5, bold: true, color: C.red, fontFace: "Arial", align: "center", valign: "middle" });
  card(sl, 6.9, 0.65, 6.1, 0.45, "001008", C.green);
  sl.addText("📱  AFTER — SQIS Digital", { x: 6.9, y: 0.65, w: 6.1, h: 0.45, fontSize: 9.5, bold: true, color: C.green, fontFace: "Arial", align: "center", valign: "middle" });

  steps.forEach(([b, a], i) => {
    const y = 1.2 + i * 0.93;
    card(sl, 0.3, y, 6.1, 0.8, C.navyCard, C.red);
    sl.addShape(pptx.ShapeType.rect, { x: 0.3, y, w: 0.32, h: 0.8, fill: { color: C.red + "20" }, line: { color: "000000", width: 0 }, rectRadius: 0.06 });
    sl.addText(String(i + 1), { x: 0.3, y, w: 0.32, h: 0.8, fontSize: 10, bold: true, color: C.red, fontFace: "Arial", align: "center", valign: "middle" });
    sl.addText(b, { x: 0.68, y: y + 0.1, w: 5.6, h: 0.6, fontSize: 9, color: C.gray, fontFace: "Arial", lineSpacingMultiple: 1.3, valign: "middle" });

    sl.addText("→", { x: 6.5, y: y + 0.2, w: 0.4, h: 0.4, fontSize: 14, color: C.cyan, fontFace: "Arial", align: "center" });

    card(sl, 6.9, y, 6.1, 0.8, C.navyCard, C.green);
    sl.addShape(pptx.ShapeType.rect, { x: 6.9, y, w: 0.32, h: 0.8, fill: { color: C.green + "20" }, line: { color: "000000", width: 0 }, rectRadius: 0.06 });
    sl.addText("✓", { x: 6.9, y, w: 0.32, h: 0.8, fontSize: 10, bold: true, color: C.green, fontFace: "Arial", align: "center", valign: "middle" });
    sl.addText(a, { x: 7.28, y: y + 0.1, w: 5.6, h: 0.6, fontSize: 9, color: C.white, fontFace: "Arial", lineSpacingMultiple: 1.3, valign: "middle" });
  });

  card(sl, 0.3, 6.82, 12.73, 0.38, C.navyMid, C.cyanDim);
  sl.addText("Transformasi ini tidak mengubah standar kualitas — hanya mempercepat eksekusi dan memvalidasi input data secara langsung di lapangan.", {
    x: 0.5, y: 6.84, w: 12.33, h: 0.34, fontSize: 8, color: C.grayDim, fontFace: "Arial", align: "center",
  });

  addNavBar(sl, 9, 20, true);
}

// ── SLIDES 10–13 — VISUAL TRANSFORMS ─────────────────────
const transforms = [
  {
    n: 10, title: "Transformasi Visual 1: Cek Awal & Validasi Batch",
    sub: "Form kertas Laporan Harian QC → UI Tablet SQIS Validasi Produk & Batch",
    beforeTitle: "📄 Form Kertas — Laporan Harian QC",
    beforeLines: ["Tanggal: __/__/____  Shift: ___", "Produk: ________________", "Nomor Batch: ___________", "Kode Produk: ____________", "— — — — — — — — — — — — —", "Catatan manual, rentan salah tulis,", "tidak ada validasi cross-check.", "Duplikasi antar 3 form berbeda.", "⚠ Batch salah tidak terdeteksi", "⚠ Data hilang/basah/tidak terbaca"],
    afterTitle: "📱 UI Tablet SQIS — Validasi Produk & Batch",
    afterLines: ["QR SCAN RESULT — QR-LINE-01", "Produk: Biskuit Susu (BSK-002)", "Batch: 123 ✓ Valid", "Status: Running ✓", "— — — — — — — — — — — — —", "✓ Batch Valid — Cross-check otomatis", "⚡ Real-time validasi instan", "🚫 Duplicate prevention aktif", "✓ Tidak bisa input batch berbeda", "✓ QR Scan mencegah salah ketik"],
    afterColor: C.green,
  },
  {
    n: 11, title: "Transformasi Visual 2: Setting & Parameter Mesin",
    sub: "Form Setting Mesin manual → UI Input Parameter 8 Mesin SQIS dengan Auto Alert",
    beforeTitle: "📄 Form Setting Mesin Manual",
    beforeLines: ["Mesin 1: H=__  V=__  Spd=__  Paraf: _","Mesin 2: H=__  V=__  Spd=__  Paraf: _","Mesin 3: H=__  V=__  Spd=__  Paraf: _","Mesin 4: H=__  V=__  Spd=__  Paraf: _","Mesin 5: H=__  V=__  Spd=__  Paraf: _","Mesin 6: H=__  V=__  Spd=__  Paraf: _","Mesin 7: H=__  V=__  Spd=__  Paraf: _","Mesin 8: H=__  V=__  Spd=__  Paraf: _","⚠ Tidak ada alert jika nilai menyimpang","⚠ Supervisor tidak bisa pantau real-time"],
    afterTitle: "📱 SQIS — 8 Mesin + Auto Alert Deviasi",
    afterLines: ["M1: H=25  V=25  Spd=25  ✓ OK","M2: H=25  V=25  Spd=25  ✓ OK","M3: H=25  V=25  Spd=25  ✓ OK","M4: H=25  V=55  Spd=25  ⚠ NG (V tinggi)","M5: —  —  —  ⚠ OFF (Maintenance)","M6: H=25  V=25  Spd=5   ⚠ NG (Spd low)","M7: H=25  V=25  Spd=25  ✓ OK","M8: H=25  V=25  Spd=25  ✓ OK","⚡ Alert otomatis dikirim ke Supervisor","⚡ Peringatan instan saat nilai menyimpang"],
    afterColor: C.teal,
  },
  {
    n: 12, title: "Transformasi Visual 3: Kadar Air & Sample Management",
    sub: "Logbook kertas sampel → UI Sample Management & Tracking Kadar Air SQIS",
    beforeTitle: "📖 Logbook Kertas Sampel",
    beforeLines: ["Tgl: 16/08/26  Shift 1  QC: Siti","Sampel 1: Kadar Air = 3.2%","Sampel 2: Kadar Air = 2.8%","Sampel 3: Kadar Air = 3.5%","...","⚠ Penelusuran histori sulit","⚠ Harus cari halaman manual","⚠ Tidak ter-link ke Batch/Produk","⚠ Saat komplain: cari data jam-jaman","⚠ Risiko hilang jika buku rusak/basah"],
    afterTitle: "📱 SQIS — Sample ID + Tracking Kadar Air",
    afterLines: ["🔍 Search: BSK-002-16082026-01","— Data ditemukan instan —","09:03 | Kadar Air: 2.55%  ✓ OK","11:20 | Kadar Air: 3.20%  ✓ OK","13:45 | Kadar Air: 3.80%  ⚠ WARN","15:00 | Kadar Air: 3.10%  ✓ OK","— — — — — — — — — — — — —","✓ Terhubung ke Batch & Produk","✓ Histori instan via Sample ID","✓ Siap untuk traceability & komplain"],
    afterColor: C.cyan,
  },
  {
    n: 13, title: "Transformasi Visual 4: Overlap Shift & Handover Logbook",
    sub: "Catatan tangan Serah Terima → Modul Overlap Shift Digital + E-Signature",
    beforeTitle: "✍️ Catatan Tangan Serah Terima Shift",
    beforeLines: ["Shift 1 → Shift 2  |  16 Agustus 2026","- - - - - - - - - - - - - -","M3 breakdown, tunggu maint...","Coding M5 NG sdh dihentikan","Sampel akhir belum diambil","TTD: ____________________","- - - - - - - - - - - - - -","⚠ Tulisan tidak terbaca","⚠ Informasi tidak lengkap/bias","⚠ Tidak ada verifikasi digital"],
    afterTitle: "📱 SQIS — Modul Overlap Shift Digital",
    afterLines: ["QC Inspector: Siti Rahayu | NIK: 3001","Shift Masuk: Shift 2  |  14:00","— — — — — — — — — — — — —","🔧 M3 breakdown — Tiket #TKT-0821","⚠ Coding M5 NG — Pending verifikasi","🧪 Sampel akhir belum diambil","— Delegasi ke Shift 2 —","— — — — — — — — — — — — —","✍️ E-Signature: Siti Rahayu ✓ Verified","✅ Serah terima terstruktur & ter-log"],
    afterColor: C.blue,
  },
];

transforms.forEach(t => {
  const sl = pptx.addSlide();
  sl.transition = { type: "morph", durations: 700 };
  addBg(sl);
  addHeader(sl, t.n, t.title, t.sub);

  // Before panel
  card(sl, 0.3, 0.7, 6.15, 6.25, C.navyCard, C.red);
  sl.addShape(pptx.ShapeType.rect, { x: 0.3, y: 0.7, w: 6.15, h: 0.45, fill: { color: C.red + "15" }, line: { color: C.red, width: 0.5, transparency: 50 }, rectRadius: 0.08 });
  sl.addText(t.beforeTitle, { x: 0.45, y: 0.73, w: 5.85, h: 0.38, fontSize: 9, bold: true, color: C.red, fontFace: "Arial", valign: "middle" });
  sl.addShape(pptx.ShapeType.rect, { x: 0.45, y: 1.25, w: 5.85, h: 5.5, fill: { color: "030F1F" }, line: { color: C.grayDim, width: 0.3, transparency: 70 }, rectRadius: 0.06 });
  t.beforeLines.forEach((line, li) => {
    const isWarn = line.startsWith("⚠");
    sl.addText(line, { x: 0.6, y: 1.35 + li * 0.5, w: 5.55, h: 0.42, fontSize: 8.5, color: isWarn ? C.red : C.gray, fontFace: "Courier New", valign: "middle" });
  });

  // Arrow
  sl.addShape(pptx.ShapeType.line, { x: 6.5, y: 3.6, w: 0.3, h: 0, line: { color: C.cyan, width: 2 } });
  sl.addText("→", { x: 6.5, y: 3.3, w: 0.3, h: 0.6, fontSize: 18, color: C.cyan, fontFace: "Arial", align: "center" });

  // After panel
  card(sl, 6.88, 0.7, 6.15, 6.25, C.navyCard, t.afterColor);
  sl.addShape(pptx.ShapeType.rect, { x: 6.88, y: 0.7, w: 6.15, h: 0.45, fill: { color: t.afterColor + "15" }, line: { color: t.afterColor, width: 0.5, transparency: 50 }, rectRadius: 0.08 });
  sl.addText(t.afterTitle, { x: 7.03, y: 0.73, w: 5.85, h: 0.38, fontSize: 9, bold: true, color: t.afterColor, fontFace: "Arial", valign: "middle" });
  sl.addShape(pptx.ShapeType.rect, { x: 7.03, y: 1.25, w: 5.85, h: 5.5, fill: { color: "030F1F" }, line: { color: t.afterColor, width: 0.3, transparency: 70 }, rectRadius: 0.06 });
  t.afterLines.forEach((line, li) => {
    const isGood = line.startsWith("✓") || line.startsWith("✅") || line.startsWith("⚡");
    const isWarn = line.startsWith("⚠");
    sl.addText(line, { x: 7.18, y: 1.35 + li * 0.5, w: 5.55, h: 0.42, fontSize: 8.5,
      color: isGood ? t.afterColor : isWarn ? C.yellow : C.gray,
      fontFace: "Courier New", valign: "middle" });
  });

  addNavBar(sl, t.n, 20, true);
});

// ── SLIDE 14 — FEATURE HUB ────────────────────────────────
{
  const sl = pptx.addSlide();
  sl.transition = { type: "morph", durations: 600 };
  addBg(sl);
  addHeader(sl, 14, "Fitur Utama Aplikasi SQIS — Feature Interactive Hub", "6 modul terintegrasi — klik kartu untuk navigasi ke detail");

  const features = [
    { icon:"📊", title:"Dashboard QC", desc:"Real-time status semua lini & mesin produksi", color:C.teal, slide:16 },
    { icon:"🔷", title:"Validasi QR Code", desc:"Scan QR untuk load data batch & produk otomatis", color:C.blue, slide:9 },
    { icon:"📈", title:"Dashboard Supervisor", desc:"Live monitoring & persetujuan e-signature digital", color:C.purple, slide:16 },
    { icon:"🧪", title:"Sample ID & Kadar Air", desc:"Tracking sampel & histori pengukuran kadar air", color:C.green, slide:12 },
    { icon:"📤", title:"Export Laporan", desc:"Generate PDF/Excel otomatis per shift atau periodik", color:C.yellow, slide:17 },
    { icon:"🔒", title:"Audit Trail", desc:"Log lengkap semua aksi pengguna + e-signature", color:C.red, slide:15 },
  ];

  sl.addText("KLIK KARTU FITUR UNTUK NAVIGASI KE SLIDE DETAIL →", { x: 0.3, y: 0.65, w: 12.73, h: 0.22, fontSize: 7, color: C.grayDim, fontFace: "Courier New", charSpacing: 1.5, align: "center" });

  features.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.3 + col * 4.35;
    const y = 0.98 + row * 3.0;
    card(sl, x, y, 4.1, 2.75, C.navyCard, f.color);
    sl.addShape(pptx.ShapeType.rect, { x, y, w: 1.1, h: 1.1, fill: { color: f.color + "20" }, line: { color: "000000", width: 0 }, rectRadius: 0.08 });
    sl.addText(f.icon, { x, y: y + 0.1, w: 1.1, h: 0.9, fontSize: 30, align: "center", valign: "middle" });
    sl.addText(f.title, { x: x + 0.15, y: y + 1.18, w: 3.8, h: 0.35, fontSize: 11, bold: true, color: C.white, fontFace: "Arial" });
    sl.addText(f.desc, { x: x + 0.15, y: y + 1.55, w: 3.8, h: 0.55, fontSize: 8.5, color: C.gray, fontFace: "Arial", lineSpacingMultiple: 1.3 });
    accentLine(sl, x + 0.15, y + 2.55, 3.5, f.color);
    sl.addText("Lihat Detail →", { x: x + 0.15, y: y + 2.6, w: 3.8, h: 0.25, fontSize: 7.5, color: f.color, fontFace: "Arial" });
    // Clickable overlay
    sl.addShape(pptx.ShapeType.rect, { x, y, w: 4.1, h: 2.75, fill: { color: "000000", transparency: 100 }, line: { color: "000000", width: 0 }, hyperlink: { slide: f.slide } });
  });

  addNavBar(sl, 14, 20, false);
}

// ── SLIDE 15 — ARCHITECTURE & ROLE ACCESS ────────────────
{
  const sl = pptx.addSlide();
  sl.transition = { type: "morph", durations: 600 };
  addBg(sl);
  addHeader(sl, 15, "Arsitektur Sistem & Hak Akses Pengguna (Role Access)", "4 fase alur sistem + matriks role access");

  const phases = [
    { id:"Login", icon:"🔐", color:C.blue, desc:"Autentikasi NIK + Password" },
    { id:"Inspeksi", icon:"🔍", color:C.green, desc:"Input data lapangan real-time" },
    { id:"Approval", icon:"✅", color:C.yellow, desc:"Review & e-signature supervisor" },
    { id:"Audit", icon:"📊", color:C.purple, desc:"Log & arsip otomatis cloud" },
  ];

  phases.forEach((p, i) => {
    const x = 0.3 + i * 3.3;
    card(sl, x, 0.65, 3.0, 1.55, C.navyCard, p.color);
    sl.addText(p.icon, { x, y: 0.7, w: 1.0, h: 1.0, fontSize: 28, align: "center", valign: "middle" });
    sl.addText(p.id, { x: x + 0.95, y: 0.82, w: 2.0, h: 0.4, fontSize: 14, bold: true, color: p.color, fontFace: "Arial" });
    sl.addText(p.desc, { x: x + 0.95, y: 1.22, w: 2.0, h: 0.5, fontSize: 8.5, color: C.gray, fontFace: "Arial", lineSpacingMultiple: 1.3 });
    if (i < phases.length - 1) {
      sl.addText("→", { x: x + 3.05, y: 1.05, w: 0.35, h: 0.4, fontSize: 18, color: C.cyan, fontFace: "Arial", align: "center" });
    }
  });

  // Role matrix
  sl.addText("MATRIKS HAK AKSES PENGGUNA", { x: 0.3, y: 2.38, w: 12.73, h: 0.25, fontSize: 7.5, color: C.grayDim, fontFace: "Courier New", charSpacing: 2 });

  // Table header
  card(sl, 0.3, 2.7, 12.73, 0.45, C.navyCard, C.cyan);
  sl.addShape(pptx.ShapeType.rect, { x: 0.3, y: 2.7, w: 12.73, h: 0.45, fill: { color: C.navyCard }, line: { color: C.cyan, width: 0.4, transparency: 60 }, rectRadius: 0.06 });
  const headers = ["Role", "Login", "Inspeksi", "Approval", "Audit Trail", "Export Laporan"];
  const colW = [2.5, 1.8, 2.0, 2.0, 2.0, 2.43];
  let cx2 = 0.3;
  headers.forEach((h, i) => {
    sl.addText(h, { x: cx2, y: 2.72, w: colW[i], h: 0.4, fontSize: 9, bold: true, color: C.cyan, fontFace: "Arial", valign: "middle", margin: [0, 0.1, 0, 0] });
    cx2 += colW[i];
  });

  const roles = [
    ["QC Inspector", "✓", "✓ Full Input", "—", "View Only", "—"],
    ["Supervisor QC", "✓", "✓ View", "✓ Full Approve", "✓ Full", "✓ Generate"],
    ["Tim Produksi", "✓", "✓ View Status", "—", "View Only", "—"],
    ["Admin Sistem", "✓", "✓ Full", "✓ Full", "✓ Full", "✓ Full Admin"],
  ];
  const rowColors = [C.navyCard, "071020", C.navyCard, "071020"];

  roles.forEach((r, ri) => {
    card(sl, 0.3, 3.22 + ri * 0.82, 12.73, 0.75, rowColors[ri], C.grayDim);
    let rx = 0.3;
    r.forEach((cell, ci) => {
      const isFull = cell.includes("Full");
      const isNone = cell === "—";
      const color2 = ci === 0 ? C.white : isFull ? C.green : isNone ? C.grayDim : C.cyan;
      sl.addText(cell, { x: rx, y: 3.24 + ri * 0.82, w: colW[ci], h: 0.7, fontSize: ci === 0 ? 9.5 : 8.5, bold: ci === 0, color: color2, fontFace: "Arial", valign: "middle", margin: [0, 0.1, 0, 0] });
      rx += colW[ci];
    });
  });

  addNavBar(sl, 15, 20, true);
}

// ── SLIDE 16 — LIVE DASHBOARD ─────────────────────────────
{
  const sl = pptx.addSlide();
  sl.transition = { type: "morph", durations: 700 };
  addBg(sl);
  addHeader(sl, 16, "Live Monitoring & Dashboard Supervisor", "Real-time status lini produksi & tren temuan NG");

  const kpis = [["4",C.cyan,"Total Inspeksi"],["2",C.red,"Total NG"],["1",C.yellow,"Mesin OFF"],["1/4",C.green,"Line Selesai"]];
  kpis.forEach(([v,c,l], i) => {
    card(sl, 0.3 + i * 3.3, 0.65, 3.0, 1.2, C.navyCard, c);
    sl.addText(v, { x: 0.3 + i * 3.3, y: 0.72, w: 3.0, h: 0.75, fontSize: 38, bold: true, color: c, fontFace: "Arial", align: "center", valign: "middle" });
    sl.addText(l, { x: 0.3 + i * 3.3, y: 1.42, w: 3.0, h: 0.3, fontSize: 8, color: C.grayDim, fontFace: "Arial", align: "center" });
  });

  // Line status table
  sl.addText("STATUS MONITORING LINE REAL-TIME", { x: 0.3, y: 2.0, w: 7, h: 0.22, fontSize: 7.5, color: C.grayDim, fontFace: "Courier New", charSpacing: 1.5 });
  card(sl, 0.3, 2.28, 7.3, 4.2, C.navyCard, C.grayDim);
  const lineHdr = ["Line","Produk","Batch","NG","Status"];
  const lColW = [1.0, 2.2, 1.3, 0.8, 2.0];
  let lx = 0.4;
  lineHdr.forEach((h, i) => {
    sl.addText(h, { x: lx, y: 2.35, w: lColW[i], h: 0.3, fontSize: 8.5, bold: true, color: C.cyan, fontFace: "Arial" });
    lx += lColW[i];
  });
  sl.addShape(pptx.ShapeType.line, { x: 0.4, y: 2.65, w: 7.1, h: 0, line: { color: C.grayDim, width: 0.5, transparency: 60 } });

  const lines = [
    ["Line 1","Biskuit Susu","123","0","✓ Selesai",C.green],
    ["Line 2","Cokelat Kering","RAN675","1","● Berjalan",C.cyan],
    ["Line 3","Wafer Stik","WPS75","0","● Berjalan",C.cyan],
    ["Line 4","—","—","0","○ Belum Mulai",C.grayDim],
  ];
  lines.forEach(([l,p,b,ng,st,stc], i) => {
    const ry = 2.72 + i * 0.88;
    if (i % 2 === 1) {
      sl.addShape(pptx.ShapeType.rect, { x: 0.3, y: ry, w: 7.3, h: 0.78, fill: { color: "030F1F" }, line: { color: "000000", width: 0 } });
    }
    let dx = 0.4;
    [l,p,b,ng,st].forEach((val, vi) => {
      const vc = vi === 3 && Number(ng) > 0 ? C.red : vi === 4 ? stc : vi === 0 ? C.white : C.gray;
      sl.addText(val, { x: dx, y: ry + 0.1, w: lColW[vi], h: 0.58, fontSize: vi === 0 ? 9 : 8.5, bold: vi === 0, color: vc, fontFace: "Arial", valign: "middle" });
      dx += lColW[vi];
    });
  });

  // NG Trend chart
  sl.addText("TREN NG — 12 JAM TERAKHIR", { x: 7.9, y: 2.0, w: 5.1, h: 0.22, fontSize: 7.5, color: C.grayDim, fontFace: "Courier New", charSpacing: 1.5 });
  card(sl, 7.9, 2.28, 5.1, 4.2, C.navyCard, C.grayDim);

  const ngData = [2, 0, 3, 1, 2, 0, 1, 0, 2, 1, 0, 2];
  const maxNg = 3;
  const chartH = 3.2, chartY = 2.45, barW = 0.33;
  ngData.forEach((v, i) => {
    const bH = (v / maxNg) * chartH;
    const bx = 8.05 + i * (barW + 0.07);
    const by = chartY + chartH - bH;
    sl.addShape(pptx.ShapeType.rect, {
      x: bx, y: by, w: barW, h: bH,
      fill: { color: v > 1 ? C.red : C.green },
      line: { color: "000000", width: 0 },
      rectRadius: 0.04,
    });
    sl.addText(`${9 + Math.floor(i / 2)}h`, { x: bx, y: chartY + chartH + 0.08, w: barW, h: 0.2, fontSize: 6.5, color: C.grayDim, fontFace: "Arial", align: "center" });
  });
  sl.addShape(pptx.ShapeType.line, { x: 8.05, y: chartY + chartH, w: 4.8, h: 0, line: { color: C.grayDim, width: 0.5, transparency: 50 } });

  addNavBar(sl, 16, 20, true);
}

// ── SLIDE 17 — COPQ ANALYSIS ──────────────────────────────
{
  const sl = pptx.addSlide();
  sl.transition = { type: "morph", durations: 700 };
  addBg(sl);
  addHeader(sl, 17, "Analisis Biaya: Cost of Poor Quality (COPQ)", "Dampak finansial sebelum & sesudah implementasi SQIS");

  card(sl, 0.3, 0.65, 12.73, 0.55, C.navyCard, C.purple);
  sl.addText("COST OF POOR QUALITY (COPQ) — Before vs After SQIS", { x: 0.5, y: 0.7, w: 12.33, h: 0.35, fontSize: 8, bold: true, color: C.purple, fontFace: "Courier New", charSpacing: 1.5, align: "center", valign: "middle" });

  const cats = [
    { cat:"Waktu Inspeksi per Shift", before:120, after:15, unit:"menit", pct:87 },
    { cat:"Biaya Kertas & Arsip per Bulan", before:100, after:0, unit:"% relatif", pct:100 },
    { cat:"Internal Failure (Rework)", before:100, after:25, unit:"% relatif", pct:75 },
    { cat:"External Failure (Komplain)", before:100, after:5, unit:"% relatif", pct:95 },
  ];

  cats.forEach((c, i) => {
    const y = 1.35 + i * 1.3;
    sl.addText(c.cat, { x: 0.3, y: y, w: 5, h: 0.35, fontSize: 10.5, bold: true, color: C.white, fontFace: "Arial" });
    sl.addText(`Before: ${c.before} ${c.unit}`, { x: 5.4, y: y, w: 3.0, h: 0.3, fontSize: 8.5, color: C.red, fontFace: "Courier New" });
    sl.addText(`After: ${c.after} ${c.unit}`, { x: 8.5, y: y, w: 2.5, h: 0.3, fontSize: 8.5, color: C.green, fontFace: "Courier New" });
    sl.addText(`-${c.pct}%`, { x: 11.1, y: y, w: 2.0, h: 0.3, fontSize: 12, bold: true, color: C.cyan, fontFace: "Arial", align: "right" });

    // Bar background (before)
    sl.addShape(pptx.ShapeType.rect, { x: 0.3, y: y + 0.42, w: 12.73, h: 0.55, fill: { color: C.red + "18" }, line: { color: C.red, width: 0.3, transparency: 70 }, rectRadius: 0.06 });
    // Bar after
    const afterW = (1 - c.after / c.before) * 12.73;
    sl.addShape(pptx.ShapeType.rect, { x: 0.3, y: y + 0.42, w: afterW > 0 ? afterW : 0.2, h: 0.55, fill: { color: C.green }, line: { color: "000000", width: 0 }, rectRadius: 0.06 });
    if (c.after === 0) {
      sl.addText("✓ ELIMINATED", { x: 0.5, y: y + 0.44, w: 5, h: 0.5, fontSize: 10, bold: true, color: C.navyDeep, fontFace: "Arial", valign: "middle" });
    }
  });

  // Bottom KPIs
  const kpis = [["87.5%","Reduksi Lead Time",C.cyan],["100%","Eliminasi Biaya Kertas",C.green],["~75%","Reduksi Rework Cost",C.yellow]];
  kpis.forEach(([v,l,c], i) => {
    card(sl, 0.3 + i * 4.35, 6.55, 4.1, 0.65, C.navyCard, c);
    sl.addText(v, { x: 0.3 + i * 4.35, y: 6.58, w: 1.5, h: 0.55, fontSize: 24, bold: true, color: c, fontFace: "Arial", align: "center", valign: "middle" });
    sl.addText(l, { x: 1.8 + i * 4.35, y: 6.67, w: 2.75, h: 0.38, fontSize: 9, color: C.gray, fontFace: "Arial", valign: "middle" });
  });

  addNavBar(sl, 17, 20, true);
}

// ── SLIDE 18 — ROI & BENEFITS ─────────────────────────────
{
  const sl = pptx.addSlide();
  sl.transition = { type: "morph", durations: 600 };
  addBg(sl);
  addHeader(sl, 18, "Manfaat Bisnis & Proyeksi ROI", "Kuantitatif & kualitatif — FSSC 22000 & ISO 22000 ready");

  const kpis = [
    { v:"100%", l:"Paperless", sub:"Form digital menggantikan 3 jenis form kertas", c:C.green },
    { v:"85%", l:"Efisiensi Waktu", sub:"Dari 120 menit menjadi ~15 menit per shift", c:C.cyan },
    { v:"8×", l:"Mesin Terpantau", sub:"Parameter real-time + alert deviasi otomatis", c:C.blue },
    { v:"< 6", l:"Bulan Payback", sub:"Berdasarkan penghematan biaya operasional", c:C.yellow },
  ];

  kpis.forEach((k, i) => {
    card(sl, 0.3 + i * 3.3, 0.65, 3.0, 1.7, C.navyCard, k.c);
    sl.addText(k.v, { x: 0.3 + i * 3.3, y: 0.7, w: 3.0, h: 0.95, fontSize: 44, bold: true, color: k.c, fontFace: "Arial", align: "center", valign: "middle" });
    sl.addText(k.l, { x: 0.3 + i * 3.3, y: 1.62, w: 3.0, h: 0.35, fontSize: 11, bold: true, color: C.white, fontFace: "Arial", align: "center" });
    sl.addText(k.sub, { x: 0.3 + i * 3.3, y: 1.95, w: 3.0, h: 0.35, fontSize: 7.5, color: C.grayDim, fontFace: "Arial", align: "center" });
  });

  // Qualitative benefits
  sl.addText("MANFAAT KUALITATIF", { x: 0.3, y: 2.5, w: 6.5, h: 0.25, fontSize: 7.5, color: C.grayDim, fontFace: "Courier New", charSpacing: 2 });
  card(sl, 0.3, 2.82, 6.5, 4.3, C.navyCard, C.cyanDim);
  const quals = [
    "Kesiapan Audit HACCP / FSSC 22000 / ISO 22000",
    "Traceability lengkap: bahan baku → produk jadi",
    "Pengurangan dependensi pada individu (key person risk)",
    "Dashboard supervisor real-time → keputusan lebih cepat",
    "Ekspansi ke QES (Quality Enterprise System)",
    "Dokumentasi digital memenuhi syarat audit mutu pangan",
  ];
  quals.forEach((q, i) => {
    sl.addShape(pptx.ShapeType.ellipse, { x: 0.5, y: 3.0 + i * 0.62 + 0.09, w: 0.1, h: 0.1, fill: { color: C.cyan }, line: { color: C.cyan, width: 0 } });
    sl.addText(q, { x: 0.7, y: 2.97 + i * 0.62, w: 5.9, h: 0.5, fontSize: 9.5, color: C.gray, fontFace: "Arial", lineSpacingMultiple: 1.3, valign: "middle" });
  });

  // Standards
  sl.addText("STANDAR KUALITAS", { x: 7.1, y: 2.5, w: 5.9, h: 0.25, fontSize: 7.5, color: C.grayDim, fontFace: "Courier New", charSpacing: 2 });
  const stds = [
    { name:"FSSC 22000", desc:"Food Safety System Certification — Audit-ready dengan SQIS", c:C.yellow },
    { name:"ISO 22000:2018", desc:"Food Safety Management System — Traceability & record keeping digital", c:C.blue },
    { name:"HACCP Principles", desc:"Hazard Analysis — Dokumentasi kontrol titik kritis terpenuhi", c:C.green },
  ];
  stds.forEach((s, i) => {
    card(sl, 7.1, 2.82 + i * 1.38, 5.9, 1.2, C.navyCard, s.c);
    sl.addShape(pptx.ShapeType.rect, { x: 7.1, y: 2.82 + i * 1.38, w: 1.0, h: 1.2, fill: { color: s.c + "20" }, line: { color: "000000", width: 0 }, rectRadius: 0.08 });
    sl.addText("🏅", { x: 7.1, y: 2.92 + i * 1.38, w: 1.0, h: 0.8, fontSize: 26, align: "center" });
    sl.addText(s.name, { x: 8.2, y: 2.92 + i * 1.38, w: 4.7, h: 0.35, fontSize: 13, bold: true, color: s.c, fontFace: "Arial" });
    sl.addText(s.desc, { x: 8.2, y: 3.27 + i * 1.38, w: 4.7, h: 0.6, fontSize: 8.5, color: C.gray, fontFace: "Arial", lineSpacingMultiple: 1.3 });
  });

  addNavBar(sl, 18, 20, true);
}

// ── SLIDE 19 — ROADMAP ────────────────────────────────────
{
  const sl = pptx.addSlide();
  sl.transition = { type: "morph", durations: 700 };
  addBg(sl);
  addHeader(sl, 19, "Roadmap Implementasi — Fase 0 hingga Fase 4", "16 minggu — Pilot Lini 1 → Full Rollout → QES Expansion");

  const phases = [
    { ph:"Fase 0", title:"Persiapan", weeks:"W1–2", color:C.blue, items:["Kick-off & stakeholder alignment","Mapping requirement detail","Setup infrastruktur server & jaringan"] },
    { ph:"Fase 1", title:"Development", weeks:"W3–6", color:C.purple, items:["UI/UX design & prototyping tablet","Backend API & database development","Integration testing & QA"] },
    { ph:"Fase 2", title:"Pilot Lini 1", weeks:"W7–10", color:C.yellow, items:["Deploy 8 tablet IP65 di lini 1","Training QC Inspector & Supervisor","UAT, parallel run & bug fixing"] },
    { ph:"Fase 3", title:"Full Rollout", weeks:"W11–14", color:C.green, items:["Rollout ke semua lini aktif","Go-live monitoring & support","Parallel run dengan form kertas"] },
    { ph:"Fase 4", title:"QES Expansion", weeks:"W15–16", color:C.cyan, items:["Integrasi ke QES/ERP/SAP","Advanced analytics & reporting","Continuous improvement cycle"] },
  ];

  // Timeline bar
  phases.forEach((p, i) => {
    sl.addShape(pptx.ShapeType.rect, { x: 0.3 + i * 2.58, y: 0.65, w: 2.5, h: 0.45, fill: { color: p.color }, line: { color: "000000", width: 0 }, rectRadius: i === 0 ? 0.08 : i === 4 ? 0.08 : 0 });
    sl.addText(p.ph, { x: 0.3 + i * 2.58, y: 0.65, w: 2.5, h: 0.45, fontSize: 8, bold: true, color: C.navyDeep, fontFace: "Arial", align: "center", valign: "middle" });
    sl.addText(p.weeks, { x: 0.3 + i * 2.58, y: 1.12, w: 2.5, h: 0.22, fontSize: 7.5, color: p.color, fontFace: "Courier New", align: "center" });
  });

  // Phase cards
  phases.forEach((p, i) => {
    const x = 0.3 + i * 2.58;
    card(sl, x, 1.42, 2.5, 5.5, C.navyCard, p.color);
    sl.addShape(pptx.ShapeType.rect, { x, y: 1.42, w: 2.5, h: 0.7, fill: { color: p.color + "20" }, line: { color: p.color, width: 0.5, transparency: 50 }, rectRadius: 0.08 });
    sl.addText(p.title, { x, y: 1.47, w: 2.5, h: 0.38, fontSize: 12, bold: true, color: p.color, fontFace: "Arial", align: "center" });
    sl.addText(p.weeks, { x, y: 1.82, w: 2.5, h: 0.22, fontSize: 7.5, color: p.color, fontFace: "Courier New", align: "center" });
    p.items.forEach((it, ii) => {
      sl.addShape(pptx.ShapeType.ellipse, { x: x + 0.18, y: 2.28 + ii * 1.38 + 0.08, w: 0.08, h: 0.08, fill: { color: p.color }, line: { color: p.color, width: 0 } });
      sl.addText(it, { x: x + 0.3, y: 2.22 + ii * 1.38, w: 2.1, h: 1.1, fontSize: 8.5, color: C.gray, fontFace: "Arial", lineSpacingMultiple: 1.3 });
    });
    accentLine(sl, x + 0.2, 6.6, 2.1, p.color);
  });

  // Bottom stats
  const sts = [["16 Minggu","Total Durasi",C.cyan],["5 Fase","Implementasi Bertahap",C.blue],["Lini 1 → Semua","Pilot → Full Rollout",C.green]];
  sts.forEach(([v,l,c], i) => {
    card(sl, 0.3 + i * 4.35, 6.72, 4.1, 0.48, C.navyMid, c);
    sl.addText(v, { x: 0.3 + i * 4.35, y: 6.75, w: 2.0, h: 0.42, fontSize: 13, bold: true, color: c, fontFace: "Arial", align: "center", valign: "middle" });
    sl.addText(l, { x: 2.3 + i * 4.35, y: 6.8, w: 2.3, h: 0.32, fontSize: 8, color: C.grayDim, fontFace: "Arial", valign: "middle" });
  });

  addNavBar(sl, 19, 20, true);
}

// ── SLIDE 20 — CLOSING & LIVE DEMO ───────────────────────
{
  const sl = pptx.addSlide();
  sl.transition = { type: "morph", durations: 600 };
  addBg(sl);
  addHeader(sl, 20, "Penutup, Alokasi Resource & Simulasi Live Demo", "Kesimpulan & Call to Action — SQIS Transformasi QC Digital");

  // Summary cards
  const sums = [
    { icon:"🔬", title:"Analisis Mendalam", desc:"Fishbone 5M+1E, VSM, DMAIC framework sebagai landasan ilmiah" },
    { icon:"📱", title:"Solusi Digital Nyata", desc:"4 form transformasi, 6 modul terintegrasi, UI tablet field-proof" },
    { icon:"📈", title:"ROI Terukur", desc:"87.5% reduksi lead time, 100% paperless, payback < 6 bulan" },
  ];
  sums.forEach((s, i) => {
    card(sl, 0.3 + i * 4.35, 0.65, 4.1, 0.95, C.navyCard, C.cyan);
    sl.addText(s.icon, { x: 0.3 + i * 4.35, y: 0.68, w: 0.85, h: 0.85, fontSize: 24, align: "center", valign: "middle" });
    sl.addText(s.title, { x: 1.15 + i * 4.35, y: 0.72, w: 3.2, h: 0.3, fontSize: 10, bold: true, color: C.white, fontFace: "Arial" });
    sl.addText(s.desc, { x: 1.15 + i * 4.35, y: 1.02, w: 3.2, h: 0.45, fontSize: 8, color: C.gray, fontFace: "Arial", lineSpacingMultiple: 1.3 });
  });

  // Resource table
  sl.addText("ALOKASI RESOURCE — KEBUTUHAN IMPLEMENTASI", { x: 0.3, y: 1.75, w: 12.73, h: 0.22, fontSize: 7.5, color: C.grayDim, fontFace: "Courier New", charSpacing: 2 });

  // Table header
  sl.addShape(pptx.ShapeType.rect, { x: 0.3, y: 2.03, w: 12.73, h: 0.42, fill: { color: C.navyCard }, line: { color: C.cyan, width: 0.4, transparency: 60 }, rectRadius: 0.06 });
  const tHdrs = ["Kategori Resource", "Spesifikasi Kebutuhan", "Jumlah", "Tujuan & Keterangan"];
  const tColW = [2.8, 4.0, 1.5, 4.43];
  let tx = 0.4;
  tHdrs.forEach((h, i) => {
    sl.addText(h, { x: tx, y: 2.06, w: tColW[i], h: 0.35, fontSize: 8.5, bold: true, color: C.cyan, fontFace: "Arial", valign: "middle" });
    tx += tColW[i];
  });

  const resources = [
    ["Hardware Lapangan","Tablet Industrial Waterproof (IP65)","8 Unit","Inspeksi QC langsung di lini packaging basah/lembap"],
    ["Hardware Manajemen","Monitor LED Display 55\"","2 Unit","Dashboard Live Monitoring Supervisor & Production Control"],
    ["Infrastruktur Network","Access Point Wi-Fi Industrial","4 Unit","Konektivitas real-time data sync di pabrik tanpa putus"],
    ["Software & Database","Server Database Local / Cloud Hybrid","1 Package","Penyimpanan Audit Trail dan arsip digital terenkripsi"],
    ["Kepatuhan Standard","Modul Validasi HACCP / ISO 22000","1 Set","Memastikan log digital memenuhi syarat aturan audit mutu"],
  ];

  resources.forEach((r, ri) => {
    const ry = 2.52 + ri * 0.72;
    const bg = ri % 2 === 0 ? C.navyCard : "030F1F";
    sl.addShape(pptx.ShapeType.rect, { x: 0.3, y: ry, w: 12.73, h: 0.65, fill: { color: bg }, line: { color: C.grayDim, width: 0.3, transparency: 75 } });
    let dx = 0.4;
    r.forEach((cell, ci) => {
      const color2 = ci === 0 ? C.cyan : ci === 2 ? C.white : C.gray;
      sl.addText(cell, { x: dx, y: ry + 0.05, w: tColW[ci], h: 0.55, fontSize: ci === 2 ? 10 : 8.5, bold: ci === 2, color: color2, fontFace: ci === 0 ? "Arial" : "Arial", valign: "middle" });
      dx += tColW[ci];
    });
  });

  // CTA + closing quote
  const ctaY = 6.22;
  sl.addShape(pptx.ShapeType.rect, { x: 0.3, y: ctaY, w: 12.73, h: 0.72, fill: { color: C.navyCard }, line: { color: C.cyan, width: 0.8, transparency: 50 }, rectRadius: 0.1 });
  // Gradient overlay
  sl.addShape(pptx.ShapeType.rect, { x: 0.3, y: ctaY, w: 6.0, h: 0.72, fill: { color: C.cyan, transparency: 92 }, line: { color: "000000", width: 0 }, rectRadius: 0.1 });
  sl.addText("SQIS adalah langkah nyata transformasi QC digital. Kami memohon dukungan manajemen untuk alokasi resource hardware tablet dan infrastruktur pendukung.", {
    x: 0.5, y: ctaY + 0.06, w: 9.5, h: 0.6, fontSize: 9, color: C.gray, fontFace: "Arial", lineSpacingMultiple: 1.35, valign: "middle",
  });

  // Back to start button
  sl.addShape(pptx.ShapeType.rect, { x: 10.2, y: ctaY + 0.12, w: 2.8, h: 0.45, fill: { color: C.cyan }, line: { color: C.cyan, width: 0 }, rectRadius: 0.08 });
  sl.addText("⚡ Lihat Hub DMAIC", { x: 10.2, y: ctaY + 0.12, w: 2.8, h: 0.45, fontSize: 9.5, bold: true, color: C.navyDeep, fontFace: "Arial", align: "center", valign: "middle", hyperlink: { slide: 7 } });

  addNavBar(sl, 20, 20, true);
}

// ── SAVE ──────────────────────────────────────────────────
const outputPath = "/workspaces/default/code/public/SQIS_Presentasi_20Slide.pptx";
pptx.writeFile({ fileName: outputPath })
  .then(() => {
    console.log("✅ BERHASIL! File PPT disimpan di:", outputPath);
    console.log("📁 Unduh via: http://localhost:8443/SQIS_Presentasi_20Slide.pptx");
  })
  .catch(err => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
