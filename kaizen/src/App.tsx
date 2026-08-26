import { useState, useEffect, useCallback, useContext, createContext, useRef } from "react"
import costAnalysisImg from "@/imports/image.png"
import costPdfUrl from "@/imports/SQIS_Estimasi_Waktu_MTM_updated.pdf?url"

type Trans = "fwd" | "bwd" | "zi" | "zo" | "morph"
type GoFn = (n: number, t?: Trans) => void

const TOTAL = 18
const TC: Record<Trans, string> = {
  fwd: "slide-fwd", bwd: "slide-bwd", zi: "slide-zi", zo: "slide-zo", morph: "slide-morph",
}

const NAV = [
  { label: "Define",  from: 0, to: 1  },
  { label: "Measure", from: 2, to: 2  },
  { label: "Analyze", from: 3, to: 3  },
  { label: "Improve", from: 4, to: 11 },
  { label: "Control", from: 12, to: 17 },
]

// ── Content store ──────────────────────────────────────────
type ContentStore = Record<string, string>

const DEFAULT_CONTENT: ContentStore = {
  // Slide titles & subs
  "slide.0.title": "Digitalisasi Quality Control: SQIS",
  "slide.1.title": "Executive Summary & Latar Belakang Masalah",
  "slide.1.sub": "Akar inefisiensi QC manual — form kertas manual",
  "slide.2.title": "Analisis Akar Masalah — Fishbone Diagram 5M+1E",
  "slide.2.sub": "Visualisasi penyebab inefisiensi QC manual",
  "slide.3.title": "Pemetaan Masalah 5W + 1H",
  "slide.3.sub": "Konteks & scope permasalahan QC",
  "slide.4.title": "Kerangka Kerja DMAIC — Interactive Hub",
  "slide.4.sub": "Klik tahap untuk navigasi langsung",
  "slide.5.title": "Value Stream Mapping — Current vs Future State",
  "slide.5.sub": "Measure: Reduksi Lead Time 87.5%",
  "slide.6.title": "Matriks Perbandingan Alur Kerja — Before vs After",
  "slide.6.sub": "Improve: 6 langkah manual → 6 langkah digital",
  "slide.7.title": "Transformasi Visual 1: Cek Awal & Validasi Batch",
  "slide.7.sub": "Form kertas → UI Tablet SQIS",
  "slide.8.title": "Transformasi Visual 2: Setting & Parameter Mesin",
  "slide.8.sub": "Manual vs Digital — 8 Mesin + Auto Alert",
  "slide.9.title": "Transformasi Visual 3: Kadar Air & Sample Management",
  "slide.9.sub": "Logbook → Digital Sample Tracker",
  "slide.10.title": "Transformasi Visual 4: Overlap Shift & Handover Logbook",
  "slide.10.sub": "Catatan tangan → E-Signature Digital",
  "slide.11.title": "Fitur Utama Aplikasi SQIS — Feature Interactive Hub",
  "slide.11.sub": "6 modul terintegrasi — klik kartu untuk detail",
  "slide.12.title": "Arsitektur Sistem & Hak Akses Pengguna",
  "slide.12.sub": "4 fase alur + matriks role access",
  "slide.13.title": "Live Monitoring & Dashboard Supervisor",
  "slide.13.sub": "Real-time status lini produksi & tren NG",
  "slide.14.title": "Analisis Biaya: Cost of Poor Quality (COPQ)",
  "slide.14.sub": "Dampak finansial sebelum & sesudah SQIS",
  "slide.15.title": "Manfaat Bisnis & Proyeksi ROI",
  "slide.15.sub": "Kuantitatif & kualitatif — FSSC 22000 ready",
  "slide.16.title": "Roadmap Implementasi — Fase 0 hingga Fase 4",
  "slide.16.sub": "16 minggu — pilot Lini 1 → Full Rollout",
  "slide.17.title": "Penutup, Alokasi Resource & Simulasi Live Demo",
  "slide.17.sub": "Kesimpulan & call to action",

  // S01 Cover
  "s01.badge": "Smart Quality Inspection System",
  "s01.industry": "Industri Makanan / Manufaktur",
  "s01.headline1": "Digitalisasi",
  "s01.headline2": "Quality Control",
  "s01.desc": "Transformasi inspeksi QC dari form kertas manual menjadi platform digital real-time terintegrasi — meningkatkan efisiensi, mencegah human error, dan mendukung standar audit FSSC 22000.",
  "s01.tag0": "📋 Form Digitized",
  "s01.tag1": "⚡ 8 Mesin Real-time",
  "s01.tag2": "📊 Dashboard Supervisor",
  "s01.tag3": "✅ FSSC 22000 Ready",
  "s01.cta": "Mulai Presentasi →",

  // S02 Executive Summary
  "s02.statement": "Proses QC Packaging saat ini bergantung pada form kertas manual yang terpisah. Hal ini menimbulkan bottleneck waktu, risiko kehilangan data, serta keterlambatan respon atas ketidaksesuaian di lini produksi.",
  "s02.p0.icon": "📄",
  "s02.p0.title": "Form Manual",
  "s02.p0.detail": "Laporan Harian QC, Setting Mesin, Log Sampel — terpisah dan tidak terintegrasi.",
  "s02.p1.icon": "⏱️",
  "s02.p1.title": "Bottleneck Waktu",
  "s02.p1.detail": "Approval dan rekap data membutuhkan hingga 120 menit per shift.",
  "s02.p2.icon": "⚠️",
  "s02.p2.title": "Risiko Human Error",
  "s02.p2.detail": "Pencatatan manual berpotensi kehilangan data atau kesalahan input di 8 mesin.",
  "s02.stat0.v": "Form", "s02.stat0.u": "Manual", "s02.stat0.sub": "Tidak terintegrasi",
  "s02.stat1.v": "120", "s02.stat1.u": "Menit/Shift", "s02.stat1.sub": "Waktu tunggu approval",
  "s02.stat2.v": "8", "s02.stat2.u": "Mesin", "s02.stat2.sub": "Tanpa monitoring real-time",
  "s02.note": "Penelusuran histori kadar air sampel memerlukan waktu hingga berjam-jam karena pencatatan terpisah. Diperlukan solusi digitalisasi sistemik berbasis teknologi.",

  // S04 Fishbone Deep Dive 1
  "s04.c0.title": "Man",
  "s04.c0.i0": "Operator lelah setelah shift panjang",
  "s04.c0.i1": "Pencatatan manual tidak konsisten",
  "s04.c0.i2": "Training SOP tidak terdokumentasi",
  "s04.c0.i3": "Ketergantungan pada satu orang key person",
  "s04.c1.title": "Method",
  "s04.c1.i0": "Form manual tidak ter-link satu sama lain",
  "s04.c1.i1": "Approval supervisor membutuhkan kehadiran fisik",
  "s04.c1.i2": "Prosedur eskalasi temuan NG lambat",
  "s04.c1.i3": "Tidak ada standar format yang seragam",
  "s04.c2.title": "Machine",
  "s04.c2.i0": "Mesin tanpa koneksi data real-time",
  "s04.c2.i1": "Data mesin dicatat secara manual",
  "s04.c2.i2": "Tidak ada peringatan otomatis deviasi",
  "s04.c2.i3": "Histori parameter tidak tersimpan digital",

  // S05 Fishbone Deep Dive 2
  "s05.c0.title": "Material",
  "s05.c0.i0": "Spesifikasi bahan baku belum terstandarisasi",
  "s05.c0.i1": "Tidak ada tracking per batch bahan masuk",
  "s05.c0.i2": "Standar kadar air berbeda per produk",
  "s05.c0.i3": "Shelf life bahan belum terdigitalisasi",
  "s05.c1.title": "Measurement",
  "s05.c1.i0": "Validasi akurasi alat ukur manual",
  "s05.c1.i1": "Histori kadar air per sampel sulit dicari",
  "s05.c1.i2": "Jadwal kalibrasi masih dikelola manual",
  "s05.c1.i3": "Hasil pengukuran tidak ter-link ke batch",
  "s05.c2.title": "Environment",
  "s05.c2.i0": "Kondisi area produksi memerlukan media khusus",
  "s05.c2.i1": "Media pencatatan fisik rawan kerusakan",
  "s05.c2.i2": "Data lingkungan belum terdokumentasi digital",
  "s05.c2.i3": "Korelasi kondisi lingkungan ke NG belum terlacak",

  // S06 5W+1H
  "s06.what.answer": "Proses pencatatan inspeksi QC manual di lini packaging",
  "s06.what.detail": "3 form kertas: Laporan Harian QC, Setting Mesin, Log Sampel",
  "s06.why.answer": "Metode konvensional menciptakan inefisiensi dan risiko kesalahan data",
  "s06.why.detail": "Tidak ada validasi otomatis, duplikasi kerja, approval terlambat",
  "s06.where.answer": "Lini Packaging — Area Produksi",
  "s06.where.detail": "8 mesin sealer di 3 lini aktif, ruang supervisor terpisah",
  "s06.when.answer": "Setiap shift (3× per hari), setiap kali ada inspeksi QC",
  "s06.when.detail": "Bottleneck terbesar terjadi pada pergantian shift dan saat approval",
  "s06.who.answer": "QC Inspector, Supervisor QC, Tim Produksi, Management",
  "s06.who.detail": "QC Inspector mengisi form → Supervisor approval → Produksi terima info",
  "s06.how.answer": "Implementasi SQIS: platform digital berbasis tablet + cloud DB",
  "s06.how.detail": "Framework DMAIC, pilot lini 1, rollout bertahap 16 minggu",

  // S07 DMAIC Hub
  "s07.d.label": "Define", "s07.d.desc": "Definisi masalah & latar belakang",
  "s07.m.label": "Measure", "s07.m.desc": "VSM & pengukuran baseline",
  "s07.a.label": "Analyze", "s07.a.desc": "Fishbone & analisis akar masalah",
  "s07.i.label": "Improve", "s07.i.desc": "Transformasi alur kerja & UI",
  "s07.c.label": "Control", "s07.c.desc": "Fitur kontrol & role access",

  // S08 VSM
  "s08.before.t0": "15 min", "s08.before.l0": "Tulis form kertas",
  "s08.before.t1": "30 min", "s08.before.l1": "Tunggu supervisor",
  "s08.before.t2": "20 min", "s08.before.l2": "Approval tanda tangan",
  "s08.before.t3": "25 min", "s08.before.l3": "Rekap di komputer",
  "s08.before.t4": "20 min", "s08.before.l4": "Distribusi laporan",
  "s08.before.t5": "10 min", "s08.before.l5": "Arsip fisik",
  "s08.after.t0": "3 min", "s08.after.l0": "Input digital (tablet)",
  "s08.after.t1": "0 min", "s08.after.l1": "Auto-validasi sistem",
  "s08.after.t2": "1 min", "s08.after.l2": "Notif real-time supervisor",
  "s08.after.t3": "5 min", "s08.after.l3": "Approval digital (e-sign)",
  "s08.after.t4": "2 min", "s08.after.l4": "Report auto-generate",
  "s08.after.t5": "0 min", "s08.after.l5": "Cloud archive otomatis",
  "s08.before.total": "120", "s08.after.total": "15",
  "s08.reduction": "87.5%",

  // S09 Workflow
  "s09.b0": "Tulis form QC kertas (3 lembar)", "s09.a0": "Scan QR Line → Load data otomatis",
  "s09.b1": "Isi parameter manual per mesin", "s09.a1": "Input digital dengan validasi toleransi",
  "s09.b2": "Catat kadar air di logbook terpisah", "s09.a2": "Tracking sampel terhubung ke Sample ID",
  "s09.b3": "Foto/kirim laporan ke supervisor", "s09.a3": "Notifikasi real-time ke supervisor",
  "s09.b4": "Supervisor tanda tangan fisik", "s09.a4": "Approval e-signature dari device mana pun",
  "s09.b5": "Rekap & arsip manual di komputer", "s09.a5": "Auto-generate laporan + cloud archive",
  "s09.note": "Transformasi ini tidak mengubah standar kualitas — hanya mempercepat eksekusi dan memvalidasi input data secara langsung di lapangan.",

  // S17 COPQ
  "s17.r0.cat": "Waktu Inspeksi", "s17.r0.before": "120", "s17.r0.after": "15", "s17.r0.unit": "min",
  "s17.r1.cat": "Biaya Kertas & Arsip", "s17.r1.before": "2400", "s17.r1.after": "0", "s17.r1.unit": "rb/bln",
  "s17.r2.cat": "Internal Failure (Rework)", "s17.r2.before": "8", "s17.r2.after": "1", "s17.r2.unit": "kasus/minggu",
  "s17.r3.cat": "External Failure", "s17.r3.before": "3", "s17.r3.after": "0", "s17.r3.unit": "komplain/bln",

  // S18 ROI
  "s18.k0.v": "100%", "s18.k0.l": "Paperless", "s18.k0.sub": "Form digital menggantikan 3 jenis form kertas",
  "s18.k1.v": "85%", "s18.k1.l": "Efisiensi Waktu", "s18.k1.sub": "Dari 120 menit menjadi ~15 menit per shift",
  "s18.k2.v": "8×", "s18.k2.l": "Mesin Terpantau", "s18.k2.sub": "Parameter real-time, alert otomatis deviasi",
  "s18.k3.v": "0", "s18.k3.l": "Data Hilang", "s18.k3.sub": "Cloud backup + audit trail terenkripsi",
  "s18.q0": "Kesiapan Audit HACCP / FSSC 22000 / ISO 22000",
  "s18.q1": "Traceability lengkap dari batch bahan baku ke produk jadi",
  "s18.q2": "Pengurangan dependensi pada individu (key person risk)",
  "s18.q3": "Dashboard supervisor real-time → keputusan lebih cepat",
  "s18.q4": "Ekspansi ke QES (Quality Enterprise System) jangka panjang",
  "s18.roi": "< 6",
  "s18.roi.sub": "bulan payback period",

  // S19 Roadmap
  "s19.p0.ph": "Fase 0", "s19.p0.title": "Persiapan", "s19.p0.weeks": "W1–2",
  "s19.p0.i0": "Kick-off & stakeholder alignment",
  "s19.p0.i1": "Mapping requirement detail",
  "s19.p0.i2": "Setup infrastruktur server",
  "s19.p1.ph": "Fase 1", "s19.p1.title": "Development", "s19.p1.weeks": "W3–6",
  "s19.p1.i0": "UI/UX design & prototyping",
  "s19.p1.i1": "Backend API development",
  "s19.p1.i2": "Database setup & testing",
  "s19.p2.ph": "Fase 2", "s19.p2.title": "Pilot — Lini 1", "s19.p2.weeks": "W7–10",
  "s19.p2.i0": "Deploy tablet 8 mesin",
  "s19.p2.i1": "Training QC Inspector & Supervisor",
  "s19.p2.i2": "UAT & bug fixing",
  "s19.p3.ph": "Fase 3", "s19.p3.title": "Full Rollout", "s19.p3.weeks": "W11–14",
  "s19.p3.i0": "Rollout ke semua lini",
  "s19.p3.i1": "Go-live monitoring",
  "s19.p3.i2": "Parallel run dengan form kertas",
  "s19.p4.ph": "Fase 4", "s19.p4.title": "QES Expansion", "s19.p4.weeks": "W15–16",
  "s19.p4.i0": "Integrasi ke QES",
  "s19.p4.i1": "Export ke ERP/SAP",
  "s19.p4.i2": "Continuous improvement",

  // S20 Closing
  "s20.sum0.icon": "🔬", "s20.sum0.title": "Analisis Mendalam", "s20.sum0.desc": "Fishbone 5M+1E, VSM, DMAIC framework",
  "s20.sum1.icon": "📱", "s20.sum1.title": "Solusi Digital", "s20.sum1.desc": "4 form transformasi, 6 modul terintegrasi",
  "s20.sum2.icon": "📈", "s20.sum2.title": "Efisiensi Terukur", "s20.sum2.desc": "87.5% reduksi lead time inspeksi per shift",
  "s20.r0.cat": "Hardware Lapangan", "s20.r0.spec": "Tablet Industrial Waterproof (IP65)", "s20.r0.qty": "8 Unit", "s20.r0.note": "Inspeksi QC lini produksi aktif",
  "s20.r1.cat": "Hardware Manajemen", "s20.r1.spec": "Monitor LED Display 55\"", "s20.r1.qty": "2 Unit", "s20.r1.note": "Dashboard Supervisor & Production",
  "s20.r2.cat": "Infrastruktur Network", "s20.r2.spec": "Access Point Wi-Fi Industrial", "s20.r2.qty": "4 Unit", "s20.r2.note": "Konektivitas real-time tanpa putus",
  "s20.r3.cat": "Software & Database", "s20.r3.spec": "Server Database Local / Cloud Hybrid", "s20.r3.qty": "1 Package", "s20.r3.note": "Audit Trail terenkripsi",
  "s20.r4.cat": "Kepatuhan Standard", "s20.r4.spec": "Modul Validasi HACCP / ISO 22000", "s20.r4.qty": "1 Set", "s20.r4.note": "Log digital standar audit mutu pangan",
  "s20.cta.headline": "SQIS adalah langkah nyata transformasi QC digital.",
  "s20.cta.body": "Kami memohon dukungan manajemen untuk alokasi resource hardware tablet dan infrastruktur pendukung pilot project.",
}

// Edit field labels for the panel
const SLIDE_FIELDS: Record<number, Array<{ key: string; label: string; multiline?: boolean }>> = {
  0: [
    { key:"slide.0.title", label:"Judul Slide" },
    { key:"s01.badge", label:"Badge SQIS" },
    { key:"s01.headline1", label:"Judul Besar Baris 1" },
    { key:"s01.headline2", label:"Judul Besar Baris 2 (warna)" },
    { key:"s01.desc", label:"Deskripsi", multiline: true },
    { key:"s01.tag0", label:"Tag 1" }, { key:"s01.tag1", label:"Tag 2" },
    { key:"s01.tag2", label:"Tag 3" }, { key:"s01.tag3", label:"Tag 4" },
    { key:"s01.cta", label:"Tombol CTA" },
  ],
  1: [
    { key:"slide.1.title", label:"Judul Slide" }, { key:"slide.1.sub", label:"Subjudul" },
    { key:"s02.statement", label:"Problem Statement", multiline: true },
    { key:"s02.stat0.v", label:"Stat 1: Angka" }, { key:"s02.stat0.u", label:"Stat 1: Unit" }, { key:"s02.stat0.sub", label:"Stat 1: Sub" },
    { key:"s02.stat1.v", label:"Stat 2: Angka" }, { key:"s02.stat1.u", label:"Stat 2: Unit" }, { key:"s02.stat1.sub", label:"Stat 2: Sub" },
    { key:"s02.stat2.v", label:"Stat 3: Angka" }, { key:"s02.stat2.u", label:"Stat 3: Unit" }, { key:"s02.stat2.sub", label:"Stat 3: Sub" },
    { key:"s02.p0.title", label:"Masalah 1: Judul" }, { key:"s02.p0.detail", label:"Masalah 1: Detail", multiline: true },
    { key:"s02.p1.title", label:"Masalah 2: Judul" }, { key:"s02.p1.detail", label:"Masalah 2: Detail", multiline: true },
    { key:"s02.p2.title", label:"Masalah 3: Judul" }, { key:"s02.p2.detail", label:"Masalah 3: Detail", multiline: true },
    { key:"s02.note", label:"Catatan Bawah", multiline: true },
  ],
  2: [
    { key:"slide.2.title", label:"Judul Slide" }, { key:"slide.2.sub", label:"Subjudul" },
  ],
  3: [
    { key:"slide.3.title", label:"Judul Slide" }, { key:"slide.3.sub", label:"Subjudul" },
    { key:"s06.what.answer", label:"What — Jawaban" }, { key:"s06.what.detail", label:"What — Detail", multiline: true },
    { key:"s06.why.answer", label:"Why — Jawaban" }, { key:"s06.why.detail", label:"Why — Detail", multiline: true },
    { key:"s06.where.answer", label:"Where — Jawaban" }, { key:"s06.where.detail", label:"Where — Detail", multiline: true },
    { key:"s06.when.answer", label:"When — Jawaban" }, { key:"s06.when.detail", label:"When — Detail", multiline: true },
    { key:"s06.who.answer", label:"Who — Jawaban" }, { key:"s06.who.detail", label:"Who — Detail", multiline: true },
    { key:"s06.how.answer", label:"How — Jawaban" }, { key:"s06.how.detail", label:"How — Detail", multiline: true },
  ],
  4: [
    { key:"slide.4.title", label:"Judul Slide" }, { key:"slide.4.sub", label:"Subjudul" },
    { key:"s07.d.label", label:"D — Label" }, { key:"s07.d.desc", label:"D — Deskripsi" },
    { key:"s07.m.label", label:"M — Label" }, { key:"s07.m.desc", label:"M — Deskripsi" },
    { key:"s07.a.label", label:"A — Label" }, { key:"s07.a.desc", label:"A — Deskripsi" },
    { key:"s07.i.label", label:"I — Label" }, { key:"s07.i.desc", label:"I — Deskripsi" },
    { key:"s07.c.label", label:"C — Label" }, { key:"s07.c.desc", label:"C — Deskripsi" },
  ],
  5: [
    { key:"slide.5.title", label:"Judul Slide" }, { key:"slide.5.sub", label:"Subjudul" },
    { key:"s08.before.total", label:"Total Waktu BEFORE (angka)" }, { key:"s08.after.total", label:"Total Waktu AFTER (angka)" },
    { key:"s08.reduction", label:"Persentase Reduksi" },
    { key:"s08.before.l0", label:"Before Langkah 1" }, { key:"s08.before.t0", label:"Before Waktu 1" },
    { key:"s08.before.l1", label:"Before Langkah 2" }, { key:"s08.before.t1", label:"Before Waktu 2" },
    { key:"s08.before.l2", label:"Before Langkah 3" }, { key:"s08.before.t2", label:"Before Waktu 3" },
    { key:"s08.before.l3", label:"Before Langkah 4" }, { key:"s08.before.t3", label:"Before Waktu 4" },
    { key:"s08.before.l4", label:"Before Langkah 5" }, { key:"s08.before.t4", label:"Before Waktu 5" },
    { key:"s08.before.l5", label:"Before Langkah 6" }, { key:"s08.before.t5", label:"Before Waktu 6" },
    { key:"s08.after.l0", label:"After Langkah 1" }, { key:"s08.after.t0", label:"After Waktu 1" },
    { key:"s08.after.l1", label:"After Langkah 2" }, { key:"s08.after.t1", label:"After Waktu 2" },
    { key:"s08.after.l2", label:"After Langkah 3" }, { key:"s08.after.t2", label:"After Waktu 3" },
    { key:"s08.after.l3", label:"After Langkah 4" }, { key:"s08.after.t3", label:"After Waktu 4" },
    { key:"s08.after.l4", label:"After Langkah 5" }, { key:"s08.after.t4", label:"After Waktu 5" },
    { key:"s08.after.l5", label:"After Langkah 6" }, { key:"s08.after.t5", label:"After Waktu 6" },
  ],
  6: [
    { key:"slide.6.title", label:"Judul Slide" }, { key:"slide.6.sub", label:"Subjudul" },
    { key:"s09.b0", label:"Step 1 Before" }, { key:"s09.a0", label:"Step 1 After" },
    { key:"s09.b1", label:"Step 2 Before" }, { key:"s09.a1", label:"Step 2 After" },
    { key:"s09.b2", label:"Step 3 Before" }, { key:"s09.a2", label:"Step 3 After" },
    { key:"s09.b3", label:"Step 4 Before" }, { key:"s09.a3", label:"Step 4 After" },
    { key:"s09.b4", label:"Step 5 Before" }, { key:"s09.a4", label:"Step 5 After" },
    { key:"s09.b5", label:"Step 6 Before" }, { key:"s09.a5", label:"Step 6 After" },
    { key:"s09.note", label:"Catatan Bawah", multiline: true },
  ],
  14: [
    { key:"slide.14.title", label:"Judul Slide" }, { key:"slide.14.sub", label:"Subjudul" },
    { key:"s17.r0.cat", label:"Baris 1: Kategori" }, { key:"s17.r0.before", label:"Baris 1: Before" }, { key:"s17.r0.after", label:"Baris 1: After" }, { key:"s17.r0.unit", label:"Baris 1: Satuan" },
    { key:"s17.r1.cat", label:"Baris 2: Kategori" }, { key:"s17.r1.before", label:"Baris 2: Before" }, { key:"s17.r1.after", label:"Baris 2: After" }, { key:"s17.r1.unit", label:"Baris 2: Satuan" },
    { key:"s17.r2.cat", label:"Baris 3: Kategori" }, { key:"s17.r2.before", label:"Baris 3: Before" }, { key:"s17.r2.after", label:"Baris 3: After" }, { key:"s17.r2.unit", label:"Baris 3: Satuan" },
    { key:"s17.r3.cat", label:"Baris 4: Kategori" }, { key:"s17.r3.before", label:"Baris 4: Before" }, { key:"s17.r3.after", label:"Baris 4: After" }, { key:"s17.r3.unit", label:"Baris 4: Satuan" },
  ],
  15: [
    { key:"slide.15.title", label:"Judul Slide" }, { key:"slide.15.sub", label:"Subjudul" },
    { key:"s18.k0.v", label:"KPI 1: Angka" }, { key:"s18.k0.l", label:"KPI 1: Label" }, { key:"s18.k0.sub", label:"KPI 1: Sub" },
    { key:"s18.k1.v", label:"KPI 2: Angka" }, { key:"s18.k1.l", label:"KPI 2: Label" }, { key:"s18.k1.sub", label:"KPI 2: Sub" },
    { key:"s18.k2.v", label:"KPI 3: Angka" }, { key:"s18.k2.l", label:"KPI 3: Label" }, { key:"s18.k2.sub", label:"KPI 3: Sub" },
    { key:"s18.k3.v", label:"KPI 4: Angka" }, { key:"s18.k3.l", label:"KPI 4: Label" }, { key:"s18.k3.sub", label:"KPI 4: Sub" },
    { key:"s18.q0", label:"Manfaat 1" }, { key:"s18.q1", label:"Manfaat 2" }, { key:"s18.q2", label:"Manfaat 3" },
    { key:"s18.q3", label:"Manfaat 4" }, { key:"s18.q4", label:"Manfaat 5" },
    { key:"s18.roi", label:"ROI Angka" }, { key:"s18.roi.sub", label:"ROI Sub-teks" },
  ],
  16: [
    { key:"slide.16.title", label:"Judul Slide" }, { key:"slide.16.sub", label:"Subjudul" },
    { key:"s19.p0.ph", label:"Fase 0: Kode" }, { key:"s19.p0.title", label:"Fase 0: Nama" }, { key:"s19.p0.weeks", label:"Fase 0: Minggu" },
    { key:"s19.p0.i0", label:"Fase 0 Item 1" }, { key:"s19.p0.i1", label:"Fase 0 Item 2" }, { key:"s19.p0.i2", label:"Fase 0 Item 3" },
    { key:"s19.p1.ph", label:"Fase 1: Kode" }, { key:"s19.p1.title", label:"Fase 1: Nama" }, { key:"s19.p1.weeks", label:"Fase 1: Minggu" },
    { key:"s19.p1.i0", label:"Fase 1 Item 1" }, { key:"s19.p1.i1", label:"Fase 1 Item 2" }, { key:"s19.p1.i2", label:"Fase 1 Item 3" },
    { key:"s19.p2.ph", label:"Fase 2: Kode" }, { key:"s19.p2.title", label:"Fase 2: Nama" }, { key:"s19.p2.weeks", label:"Fase 2: Minggu" },
    { key:"s19.p2.i0", label:"Fase 2 Item 1" }, { key:"s19.p2.i1", label:"Fase 2 Item 2" }, { key:"s19.p2.i2", label:"Fase 2 Item 3" },
    { key:"s19.p3.ph", label:"Fase 3: Kode" }, { key:"s19.p3.title", label:"Fase 3: Nama" }, { key:"s19.p3.weeks", label:"Fase 3: Minggu" },
    { key:"s19.p3.i0", label:"Fase 3 Item 1" }, { key:"s19.p3.i1", label:"Fase 3 Item 2" }, { key:"s19.p3.i2", label:"Fase 3 Item 3" },
    { key:"s19.p4.ph", label:"Fase 4: Kode" }, { key:"s19.p4.title", label:"Fase 4: Nama" }, { key:"s19.p4.weeks", label:"Fase 4: Minggu" },
    { key:"s19.p4.i0", label:"Fase 4 Item 1" }, { key:"s19.p4.i1", label:"Fase 4 Item 2" }, { key:"s19.p4.i2", label:"Fase 4 Item 3" },
  ],
  17: [
    { key:"slide.17.title", label:"Judul Slide" }, { key:"slide.17.sub", label:"Subjudul" },
    { key:"s20.sum0.title", label:"Ringkasan 1: Judul" }, { key:"s20.sum0.desc", label:"Ringkasan 1: Deskripsi" },
    { key:"s20.sum1.title", label:"Ringkasan 2: Judul" }, { key:"s20.sum1.desc", label:"Ringkasan 2: Deskripsi" },
    { key:"s20.sum2.title", label:"Ringkasan 3: Judul" }, { key:"s20.sum2.desc", label:"Ringkasan 3: Deskripsi" },
    { key:"s20.r0.cat", label:"Resource 1: Kategori" }, { key:"s20.r0.spec", label:"Resource 1: Spesifikasi" }, { key:"s20.r0.qty", label:"Resource 1: Jumlah" }, { key:"s20.r0.note", label:"Resource 1: Tujuan" },
    { key:"s20.r1.cat", label:"Resource 2: Kategori" }, { key:"s20.r1.spec", label:"Resource 2: Spesifikasi" }, { key:"s20.r1.qty", label:"Resource 2: Jumlah" }, { key:"s20.r1.note", label:"Resource 2: Tujuan" },
    { key:"s20.r2.cat", label:"Resource 3: Kategori" }, { key:"s20.r2.spec", label:"Resource 3: Spesifikasi" }, { key:"s20.r2.qty", label:"Resource 3: Jumlah" }, { key:"s20.r2.note", label:"Resource 3: Tujuan" },
    { key:"s20.r3.cat", label:"Resource 4: Kategori" }, { key:"s20.r3.spec", label:"Resource 4: Spesifikasi" }, { key:"s20.r3.qty", label:"Resource 4: Jumlah" }, { key:"s20.r3.note", label:"Resource 4: Tujuan" },
    { key:"s20.r4.cat", label:"Resource 5: Kategori" }, { key:"s20.r4.spec", label:"Resource 5: Spesifikasi" }, { key:"s20.r4.qty", label:"Resource 5: Jumlah" }, { key:"s20.r4.note", label:"Resource 5: Tujuan" },
    { key:"s20.cta.headline", label:"CTA: Headline" }, { key:"s20.cta.body", label:"CTA: Body", multiline: true },
  ],
}

// ── Content Context ────────────────────────────────────────
const ContentCtx = createContext<{
  c: ContentStore
  set: (key: string, val: string) => void
  reset: () => void
  editMode: boolean
  setEditMode: (v: boolean) => void
}>({ c: DEFAULT_CONTENT, set: () => {}, reset: () => {}, editMode: false, setEditMode: () => {} })

function ContentProvider({ children }: { children: React.ReactNode }) {
  const [c, setC] = useState<ContentStore>(() => {
    try {
      const saved = localStorage.getItem("sqis-content")
      return saved ? { ...DEFAULT_CONTENT, ...JSON.parse(saved) } : DEFAULT_CONTENT
    } catch { return DEFAULT_CONTENT }
  })
  const [editMode, setEditMode] = useState(false)

  function set(key: string, val: string) {
    setC(prev => {
      const next = { ...prev, [key]: val }
      localStorage.setItem("sqis-content", JSON.stringify(next))
      return next
    })
  }

  function reset() {
    localStorage.removeItem("sqis-content")
    setC(DEFAULT_CONTENT)
  }

  return (
    <ContentCtx.Provider value={{ c, set, reset, editMode, setEditMode }}>
      {children}
    </ContentCtx.Provider>
  )
}

function useC() { return useContext(ContentCtx) }
function useGet() {
  const { c } = useC()
  return (key: string) => c[key] ?? DEFAULT_CONTENT[key] ?? key
}

// ── Edit Panel ─────────────────────────────────────────────
function EditPanel({ idx, onClose }: { idx: number; onClose: () => void }) {
  const { c, set, reset } = useC()
  const fields = SLIDE_FIELDS[idx] ?? [
    { key: `slide.${idx}.title`, label: "Judul Slide" },
    { key: `slide.${idx}.sub`, label: "Subjudul" },
  ]
  const [saved, setSaved] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  function handleChange(key: string, val: string) {
    set(key, val)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div
      ref={panelRef}
      className="fixed right-0 top-0 bottom-0 w-[340px] z-50 flex flex-col"
      style={{
        background: "#020c1b",
        borderLeft: "1px solid rgba(0,200,232,0.2)",
        boxShadow: "-8px 0 32px rgba(0,0,0,0.6)",
      }}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-400/15 flex-shrink-0">
        <div>
          <p className="text-cyan-400 text-xs font-mono font-bold">✏ EDIT KONTEN</p>
          <p className="text-slate-500 text-[10px] mt-0.5">Slide {idx + 1} — Perubahan tersimpan otomatis</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-green-400 text-[10px] font-mono">✓ Tersimpan</span>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-xs hover:text-white hover:border-slate-500 transition-all flex items-center justify-center"
          >✕</button>
        </div>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {fields.map(f => (
          <div key={f.key} className="flex flex-col gap-1">
            <label className="text-slate-500 text-[10px] font-mono">{f.label}</label>
            {f.multiline ? (
              <textarea
                value={c[f.key] ?? DEFAULT_CONTENT[f.key] ?? ""}
                onChange={e => handleChange(f.key, e.target.value)}
                rows={3}
                className="w-full rounded-lg bg-[#071428] border border-slate-700/60 text-slate-200 text-xs px-3 py-2 focus:outline-none focus:border-cyan-400/50 resize-none leading-relaxed"
              />
            ) : (
              <input
                type="text"
                value={c[f.key] ?? DEFAULT_CONTENT[f.key] ?? ""}
                onChange={e => handleChange(f.key, e.target.value)}
                className="w-full rounded-lg bg-[#071428] border border-slate-700/60 text-slate-200 text-xs px-3 py-2 focus:outline-none focus:border-cyan-400/50"
              />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-slate-700/40 space-y-2">
        <p className="text-slate-600 text-[10px]">Data disimpan di browser (localStorage). Tidak hilang saat refresh.</p>
        <button
          onClick={() => { if (confirm("Reset SEMUA konten ke default?")) reset() }}
          className="w-full py-2 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400 text-xs hover:bg-red-400/15 transition-all"
        >
          🔄 Reset Semua ke Default
        </button>
      </div>
    </div>
  )
}

// ── Slide navigation ───────────────────────────────────────
function useSlides() {
  const [idx, setIdx] = useState(0)
  const [key, setKey] = useState(0)
  const [tc, setTc] = useState<Trans>("fwd")
  const go = useCallback((n: number, t?: Trans) => {
    const to = Math.max(0, Math.min(TOTAL - 1, n))
    setTc(t ?? (to > idx ? "fwd" : "bwd"))
    setIdx(to); setKey(k => k + 1)
  }, [idx])
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (["ArrowRight", " ", "PageDown"].includes(e.key)) { e.preventDefault(); go(idx + 1) }
      if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(idx - 1) }
    }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [idx, go])
  return { idx, key, tc, go }
}


// ── Shared components ──────────────────────────────────────
function NavBar({ idx, go, editMode, onToggleEdit }: { idx: number; go: GoFn; editMode: boolean; onToggleEdit: () => void }) {
  return (
    <div className="flex-shrink-0 bg-[#030f1f]/95 border-t border-cyan-400/10 px-6 py-2.5 flex items-center justify-between">
      <div className="flex gap-2">
        <a href="/SQIS_Presentasi_20Slide.pptx" download
          className="px-3 py-1.5 rounded-lg bg-cyan-400 text-[#020c1b] text-xs font-bold hover:bg-cyan-300 transition-all flex items-center gap-1.5">
          ⬇ Download .pptx
        </a>
        <button
          onClick={onToggleEdit}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 ${
            editMode
              ? "bg-amber-400/15 border-amber-400/50 text-amber-400 hover:bg-amber-400/20"
              : "bg-[#071428] border-slate-700/50 text-slate-400 hover:border-amber-400/40 hover:text-amber-400"
          }`}
        >
          {editMode ? "✕ Tutup Edit" : "✏ Edit Konten"}
        </button>
        <button onClick={() => go(idx - 1)} disabled={idx === 0}
          className="px-3 py-1.5 rounded-lg bg-[#071428] border border-slate-700/50 text-slate-400 text-xs hover:border-cyan-400/40 hover:text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed">
          ← Prev
        </button>
        <button onClick={() => go(idx + 1)} disabled={idx === TOTAL - 1}
          className="px-3 py-1.5 rounded-lg bg-[#071428] border border-slate-700/50 text-slate-400 text-xs hover:border-cyan-400/40 hover:text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed">
          Next →
        </button>
      </div>
      <div className="flex items-center gap-1">
        {Array.from({length: TOTAL}).map((_, i) => (
          <button key={i} onClick={() => go(i)}
            className={`rounded-full transition-all duration-200 ${i === idx ? "w-5 h-2 bg-cyan-400" : "w-1.5 h-1.5 bg-slate-700 hover:bg-slate-500"}`} />
        ))}
      </div>
      <div className="flex items-center gap-3">
        {idx !== 4 && idx !== 0 && (
          <button onClick={() => go(4, "zo")}
            className="px-2.5 py-1 rounded border border-slate-700/40 text-slate-500 text-[11px] hover:border-cyan-400/30 hover:text-cyan-400 transition-all">
            ⌂ Hub
          </button>
        )}
        <span className="text-slate-600 text-xs font-mono">{idx + 1}/{TOTAL}</span>
      </div>
    </div>
  )
}

function SHdr({ n, title, sub }: { n: number; title: string; sub?: string }) {
  return (
    <div className="flex-shrink-0 bg-[#071428]/80 border-b border-cyan-400/15 px-8 py-3 flex items-center gap-3">
      <span className="text-cyan-400/50 font-mono text-xs w-6">{String(n).padStart(2,"0")}</span>
      <div className="w-px h-7 bg-cyan-400/20" />
      <div>
        <h1 className="text-white text-base font-bold leading-tight">{title}</h1>
        {sub && <p className="text-cyan-400/50 text-[11px]">{sub}</p>}
      </div>
    </div>
  )
}

function Cd({ className="", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`bg-[#071428] border border-slate-700/40 rounded-xl ${className}`}>{children}</div>
}

// ── SLIDE 01 ───────────────────────────────────────────────
function S01({ go }: { go: GoFn }) {
  const g = useGet()
  return (
    <div className="flex-1 relative overflow-hidden bg-[#020c1b] flex items-center">
      <div className="absolute inset-0 opacity-[0.035]"
        style={{backgroundImage:"linear-gradient(rgba(0,200,232,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,232,1) 1px,transparent 1px)",backgroundSize:"44px 44px"}} />
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
        style={{background:"radial-gradient(circle,rgba(0,80,140,0.18) 0%,transparent 70%)"}} />
      <div className="relative z-10 px-16 max-w-[55%]">
        <div className="s1 flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center pulse-glow">
            <span className="text-cyan-400 font-black text-lg">QC</span>
          </div>
          <div>
            <p className="text-cyan-400/80 text-[11px] font-mono tracking-[0.22em] uppercase">{g("s01.badge")}</p>
            <p className="text-slate-500 text-[11px]">{g("s01.industry")}</p>
          </div>
        </div>
        <h1 className="s2 text-[3.4rem] font-black text-white leading-[1.08] mb-3">
          {g("s01.headline1")}<br/><span className="text-cyan-400">{g("s01.headline2")}</span>
        </h1>
        <div className="s3 w-20 h-1 rounded-full mb-5" style={{background:"linear-gradient(90deg,#00c8e8,#2563eb)"}} />
        <p className="s4 text-slate-300 text-[14px] leading-relaxed max-w-lg mb-7">{g("s01.desc")}</p>
        <div className="s5 flex flex-wrap gap-2 mb-8">
          {[g("s01.tag0"),g("s01.tag1"),g("s01.tag2"),g("s01.tag3")].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-[#071428] border border-slate-700/50 text-slate-300 text-[11px]">{b}</span>
          ))}
        </div>
        <button onClick={() => go(1)} className="s6 px-8 py-3.5 rounded-xl bg-cyan-400 text-[#020c1b] font-bold text-sm hover:bg-cyan-300 transition-all hover:scale-105 active:scale-100 shadow-lg shadow-cyan-400/20">
          {g("s01.cta")}
        </button>
      </div>
      <div className="s1 absolute right-10 top-1/2 -translate-y-1/2 w-60">
        <div className="rounded-2xl bg-[#071428] border border-cyan-400/20 overflow-hidden shadow-2xl shadow-cyan-400/5">
          <div className="bg-[#0a1f3d] px-4 py-2.5 border-b border-cyan-400/10 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400/70" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/70" />
            <div className="w-1.5 h-1.5 rounded-full bg-green-400/70" />
            <span className="text-slate-500 text-[10px] ml-2 font-mono">sqis · dashboard</span>
          </div>
          <div className="p-3.5 space-y-2.5 text-[11px]">
            {[["Total Inspeksi","2","text-cyan-400"],["Line Selesai","1","text-green-400"],["Belum Diperiksa","5","text-yellow-400"],["Mesin OFF","1","text-red-400"]].map(([l,v,c]) => (
              <div key={l} className="flex items-center justify-between">
                <span className="text-slate-500">{l}</span>
                <span className={`font-mono font-bold ${c}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── SLIDE 02 ───────────────────────────────────────────────
function S02({ go }: { go: GoFn }) {
  const g = useGet()
  const problems = [
    { icon:g("s02.p0.icon"), title:g("s02.p0.title"), detail:g("s02.p0.detail") },
    { icon:g("s02.p1.icon"), title:g("s02.p1.title"), detail:g("s02.p1.detail") },
    { icon:g("s02.p2.icon"), title:g("s02.p2.title"), detail:g("s02.p2.detail") },
  ]
  const impacts = [
    { v:g("s02.stat0.v"), u:g("s02.stat0.u"), c:"text-red-400", sub:g("s02.stat0.sub") },
    { v:g("s02.stat1.v"), u:g("s02.stat1.u"), c:"text-yellow-400", sub:g("s02.stat1.sub") },
    { v:g("s02.stat2.v"), u:g("s02.stat2.u"), c:"text-orange-400", sub:g("s02.stat2.sub") },
  ]
  return (
    <div className="flex-1 overflow-hidden px-8 py-5 flex flex-col gap-4">
      <div className="s1 p-4 rounded-xl border border-cyan-400/20 bg-cyan-400/5">
        <p className="text-cyan-400 text-xs font-mono mb-1">PROBLEM STATEMENT</p>
        <p className="text-slate-200 text-sm leading-relaxed">{g("s02.statement")}</p>
      </div>
      <div className="grid grid-cols-3 gap-3 s2">
        {impacts.map(i => (
          <Cd key={i.u} className="p-4 text-center">
            <div className={`text-4xl font-black ${i.c} count-pop`}>{i.v}</div>
            <div className="text-white text-sm font-semibold">{i.u}</div>
            <div className="text-slate-500 text-[11px] mt-0.5">{i.sub}</div>
          </Cd>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-3 gap-3">
        {problems.map((p, i) => (
          <Cd key={i} className={`p-4 flex flex-col gap-3 s${i+3}`}>
            <div className="text-3xl">{p.icon}</div>
            <h3 className="text-white text-sm font-semibold">{p.title}</h3>
            <p className="text-slate-400 text-[12px] leading-relaxed flex-1">{p.detail}</p>
            <div className="w-full h-0.5 rounded-full bg-red-400/30" />
          </Cd>
        ))}
      </div>
      <div className="s6 p-3 rounded-xl border border-slate-700/40 bg-[#071428] flex items-center gap-3">
        <span className="text-2xl">💡</span>
        <p className="text-slate-400 text-[12px]">{g("s02.note")}</p>
        <button onClick={() => go(4, "fwd")} className="ml-auto flex-shrink-0 px-3 py-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs hover:bg-cyan-400/20 transition-all">
          Lihat DMAIC →
        </button>
      </div>
    </div>
  )
}

// ── SLIDE 03 ───────────────────────────────────────────────
function S03() {
  const W=1120, H=510, SY=255, topY=48, botY=462
  const bxs:[number,number,number]=[178,400,622]
  const bdx=68
  const branches = [
    { id:"Man",         top:true,  bi:0 as const, color:"#60a5fa", causes:[
      ["Variasi pencatatan manual","antar operator"],
      ["Konsistensi kinerja menurun","pada shift panjang"],
      ["Kurva adaptasi prosedur","& standar baru"],
    ]},
    { id:"Method",      top:true,  bi:1 as const, color:"#a78bfa", causes:[
      ["Penelusuran akar masalah","membutuhkan waktu"],
      ["Alur approval berjenjang","membutuhkan waktu"],
      ["Prosedur kerja belum","terdigitalisasi"],
    ]},
    { id:"Machine",     top:true,  bi:2 as const, color:"#f59e0b", causes:[
      ["Pencatatan data mesin","masih manual"],
      ["Pencatatan kadang tidak","konsisten/kurang terbaca"],
      ["Belum ada notifikasi","otomatis saat anomali"],
    ]},
    { id:"Material",    top:false, bi:0 as const, color:"#34d399", causes:[
      ["Pelacakan batch FG","masih manual"],
      ["Serah terima antar shift","belum tercatat sistematis"],
      ["Verifikasi spesifikasi","bahan baku masih manual"],
    ]},
    { id:"Measurement", top:false, bi:1 as const, color:"#06b6d4", causes:[
      ["Pencarian histori data","memakan waktu"],
      ["Data batch belum","terhubung otomatis"],
      ["Validasi akurasi","dilakukan manual"],
    ]},
    { id:"Environment", top:false, bi:2 as const, color:"#f97316", causes:[
      ["Kondisi batch belum","terkorelasi data produksi"],
      ["Pencatatan data batch","masih manual"],
      ["Media pencatatan","masih berbasis kertas"],
    ]},
  ]
  return (
    <div className="flex-1 flex items-center justify-center overflow-hidden p-1">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
        {/* Spine */}
        <line x1={50} y1={SY} x2={953} y2={SY} stroke="#00c8e8" strokeWidth="2.5"/>
        <polygon points={`957,${SY} 943,${SY-7} 943,${SY+7}`} fill="#00c8e8"/>
        {/* Effect box */}
        <rect x={959} y={SY-40} width="155" height="80" rx="8" fill="#071428" stroke="#00c8e8" strokeWidth="1.5"/>
        {["Proses QC Packaging","Masih Dapat","Ditingkatkan","Efektivitasnya"].map((ln,i) => (
          <text key={i} x={1036} y={SY-22+i*14} textAnchor="middle" fill="#00c8e8" fontSize="8" fontWeight="700">{ln}</text>
        ))}
        {branches.map((b,_bi) => {
          const sx=bxs[b.bi], ex=sx+bdx, ey=b.top?topY:botY
          const pts=[0.27,0.52,0.77].map(t=>({x:sx+(ex-sx)*t, y:SY+(ey-SY)*t}))
          const LL=58
          return (
            <g key={b.id}>
              <line x1={sx} y1={SY} x2={ex} y2={ey} stroke={b.color} strokeWidth="2" opacity="0.85"/>
              {/* Category label */}
              <text x={ex} y={b.top?ey-22:ey+30} textAnchor="middle" fill={b.color} fontSize="10.5" fontWeight="900">{b.id.toUpperCase()}</text>
              <rect x={ex-45} y={b.top?ey-18:ey+2} width="90" height="17" rx="4" fill="#071428" stroke={b.color} strokeWidth="1.2"/>
              <text x={ex} y={b.top?ey-6:ey+14} textAnchor="middle" fill={b.color} fontSize="7.5" fontWeight="700">{b.id}</text>
              {/* Cause bones */}
              {pts.map((pt,ci) => (
                <g key={ci}>
                  <line x1={pt.x-LL} y1={pt.y} x2={pt.x} y2={pt.y} stroke={b.color} strokeWidth="1" opacity="0.4"/>
                  {b.causes[ci].map((ln,li) => (
                    <text key={li} x={pt.x-LL-4} y={pt.y+(li-(b.causes[ci].length-1)/2)*9+3} textAnchor="end" fill="#94a3b8" fontSize="7">{ln}</text>
                  ))}
                </g>
              ))}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ── SLIDE 06 ───────────────────────────────────────────────
function S06() {
  const g = useGet()
  const cells = [
    { q:"What", icon:"❓", color:"#60a5fa", answer:g("s06.what.answer"), detail:g("s06.what.detail") },
    { q:"Why", icon:"💡", color:"#a78bfa", answer:g("s06.why.answer"), detail:g("s06.why.detail") },
    { q:"Where", icon:"📍", color:"#f59e0b", answer:g("s06.where.answer"), detail:g("s06.where.detail") },
    { q:"When", icon:"⏰", color:"#34d399", answer:g("s06.when.answer"), detail:g("s06.when.detail") },
    { q:"Who", icon:"👥", color:"#06b6d4", answer:g("s06.who.answer"), detail:g("s06.who.detail") },
    { q:"How", icon:"🔧", color:"#f97316", answer:g("s06.how.answer"), detail:g("s06.how.detail") },
  ]
  return (
    <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-3 px-8 py-5">
      {cells.map((c,i) => (
        <div key={c.q} className={`s${i+1} rounded-xl border overflow-hidden flex flex-col`} style={{borderColor:c.color+"25",background:"#071428"}}>
          <div className="px-4 py-3 flex items-center gap-2 border-b" style={{borderColor:c.color+"15",background:c.color+"08"}}>
            <span className="text-xl">{c.icon}</span>
            <span className="font-black text-lg" style={{color:c.color}}>{c.q}</span>
          </div>
          <div className="flex-1 p-4 flex flex-col gap-2">
            <p className="text-white text-[13px] font-semibold leading-snug">{c.answer}</p>
            <p className="text-slate-500 text-[11px] leading-relaxed mt-auto">{c.detail}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── SLIDE 07 ───────────────────────────────────────────────
function S07({ go }: { go: GoFn }) {
  const g = useGet()
  const stages = [
    { id:"D", label:g("s07.d.label"), color:"#3b82f6", slide:1, desc:g("s07.d.desc") },
    { id:"M", label:g("s07.m.label"), color:"#06b6d4", slide:5, desc:g("s07.m.desc") },
    { id:"A", label:g("s07.a.label"), color:"#8b5cf6", slide:2, desc:g("s07.a.desc") },
    { id:"I", label:g("s07.i.label"), color:"#22c55e", slide:6, desc:g("s07.i.desc") },
    { id:"C", label:g("s07.c.label"), color:"#f59e0b", slide:12, desc:g("s07.c.desc") },
  ]
  const R=115, cx=200, cy=155
  const pts = stages.map((_,i) => { const a=(i*72-90)*Math.PI/180; return {x:cx+R*Math.cos(a),y:cy+R*Math.sin(a)} })
  return (
    <div className="flex-1 flex px-8 py-5 gap-6">
      <div className="flex items-center justify-center w-[420px] flex-shrink-0">
        <svg viewBox="0 0 400 310" className="w-full">
          <circle cx={cx} cy={cy} r={R+28} fill="none" stroke="#00c8e820" strokeWidth="1" className="ring-pulse"/>
          <circle cx={cx} cy={cy} r={R+14} fill="none" stroke="#00c8e815" strokeWidth="1"/>
          {pts.map((p,i) => (<line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#1e3a5f" strokeWidth="1.5"/>))}
          <circle cx={cx} cy={cy} r="40" fill="#071428" stroke="#00c8e840" strokeWidth="1.5"/>
          <text x={cx} y={cy-6} textAnchor="middle" fill="#00c8e8" fontSize="13" fontWeight="800">DMAIC</text>
          <text x={cx} y={cy+8} textAnchor="middle" fill="#64748b" fontSize="8">Framework</text>
          {stages.map((s,i) => (
            <g key={s.id} onClick={() => go(s.slide,"zi")} className="cursor-pointer" style={{filter:`drop-shadow(0 0 8px ${s.color}60)`}}>
              <circle cx={pts[i].x} cy={pts[i].y} r="28" fill="#071428" stroke={s.color} strokeWidth="2" className="s2"/>
              <circle cx={pts[i].x} cy={pts[i].y} r="28" fill={s.color+"12"}/>
              <text x={pts[i].x} y={pts[i].y-4} textAnchor="middle" fill={s.color} fontSize="15" fontWeight="900">{s.id}</text>
              <text x={pts[i].x} y={pts[i].y+9} textAnchor="middle" fill={s.color} fontSize="7.5" fontWeight="600">{s.label}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="flex-1 flex flex-col gap-2.5 justify-center">
        <p className="text-slate-500 text-xs mb-1 font-mono">KLIK TAHAP UNTUK NAVIGASI LANGSUNG →</p>
        {stages.map((s,i) => (
          <button key={s.id} onClick={() => go(s.slide,"zi")}
            className={`s${i+1} w-full text-left p-3.5 rounded-xl border transition-all hover:scale-[1.01] active:scale-100`}
            style={{borderColor:s.color+"30",background:s.color+"08"}}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg" style={{background:s.color+"20",color:s.color}}>{s.id}</div>
              <div><p className="text-white font-semibold text-sm">{s.label}</p><p className="text-slate-500 text-[11px]">{s.desc}</p></div>
              <span className="ml-auto text-slate-600 text-xs">→ Slide {s.slide+1}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── SLIDE 08 ───────────────────────────────────────────────
function S08() {
  const g = useGet()
  const before = [0,1,2,3,4,5].map(i => ({label:g(`s08.before.l${i}`),t:g(`s08.before.t${i}`)}))
  const after  = [0,1,2,3,4,5].map(i => ({label:g(`s08.after.l${i}`), t:g(`s08.after.t${i}`)}))
  return (
    <div className="flex-1 px-8 py-5 flex flex-col gap-4">
      <div className="s1 grid grid-cols-2 gap-6">
        <div className="p-4 rounded-xl bg-red-400/5 border border-red-400/20 text-center">
          <p className="text-red-400 text-xs font-mono mb-1">CURRENT STATE — MANUAL</p>
          <p className="text-4xl font-black text-red-400 count-pop">{g("s08.before.total")}</p>
          <p className="text-slate-400 text-sm">menit per inspeksi shift</p>
        </div>
        <div className="p-4 rounded-xl bg-green-400/5 border border-green-400/20 text-center">
          <p className="text-green-400 text-xs font-mono mb-1">FUTURE STATE — SQIS</p>
          <p className="text-4xl font-black text-green-400 count-pop">{g("s08.after.total")}</p>
          <p className="text-slate-400 text-sm">menit per inspeksi shift</p>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="s2">
          <p className="text-red-400 text-xs font-mono mb-2">BEFORE — BOTTLENECK FLOW</p>
          <div className="space-y-1.5">
            {before.map((s,i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-red-400/5 border border-red-400/10">
                <div className="w-5 h-5 rounded-full bg-red-400/20 flex items-center justify-center text-red-400 text-[10px] font-bold">{i+1}</div>
                <span className="text-slate-300 text-[12px] flex-1">{s.label}</span>
                <span className="font-mono text-red-400 text-[11px] bg-red-400/10 px-2 py-0.5 rounded">{s.t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="s3">
          <p className="text-green-400 text-xs font-mono mb-2">AFTER — STREAMLINED SQIS</p>
          <div className="space-y-1.5">
            {after.map((s,i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-green-400/5 border border-green-400/10">
                <div className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center text-green-400 text-[10px] font-bold">{i+1}</div>
                <span className="text-slate-300 text-[12px] flex-1">{s.label}</span>
                <span className="font-mono text-green-400 text-[11px] bg-green-400/10 px-2 py-0.5 rounded">{s.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="s4 p-3 rounded-xl bg-cyan-400/5 border border-cyan-400/15 flex items-center gap-4">
        <div className="text-center"><span className="text-cyan-400 font-black text-2xl">{g("s08.reduction")}</span><p className="text-slate-500 text-[10px]">Reduksi Lead Time</p></div>
        <div className="w-px h-10 bg-cyan-400/20"/>
        <div className="flex-1 h-3 rounded-full bg-[#0a1f3d] overflow-hidden"><div className="bar1 h-full rounded-full" style={{background:"linear-gradient(90deg,#22c55e,#00c8e8)",width:"87.5%"}}/></div>
        <span className="text-slate-400 text-xs">{g("s08.before.total")} min → {g("s08.after.total")} min</span>
      </div>
    </div>
  )
}

// ── SLIDE 09 ───────────────────────────────────────────────
function S09() {
  const g = useGet()
  const steps = [0,1,2,3,4,5].map(i => [g(`s09.b${i}`),g(`s09.a${i}`)])
  return (
    <div className="flex-1 px-8 py-5 flex flex-col gap-3">
      <div className="s1 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-400/10 border border-red-400/20"><span className="text-red-400 text-sm">📄</span><span className="text-red-400 text-xs font-semibold">BEFORE — Manual Konvensional</span></div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-green-400/10 border border-green-400/20"><span className="text-green-400 text-sm">📱</span><span className="text-green-400 text-xs font-semibold">AFTER — SQIS Digital</span></div>
      </div>
      <div className="flex-1 space-y-2">
        {steps.map(([b,a],i) => (
          <div key={i} className={`s${i+2} grid grid-cols-[1fr,auto,1fr] gap-3 items-center`}>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-400/5 border border-red-400/15">
              <span className="w-5 h-5 rounded-full bg-red-400/20 text-red-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
              <span className="text-slate-300 text-[12px]">{b}</span>
            </div>
            <div className="text-cyan-400 text-xs">→</div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-green-400/5 border border-green-400/15">
              <span className="w-5 h-5 rounded-full bg-green-400/20 text-green-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">✓</span>
              <span className="text-slate-200 text-[12px]">{a}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="s7 p-3 rounded-xl bg-cyan-400/5 border border-cyan-400/15 text-center">
        <p className="text-slate-400 text-xs">{g("s09.note")}</p>
      </div>
    </div>
  )
}

// ── SLIDE 10 ───────────────────────────────────────────────
function S10() {
  return (
    <div className="flex-1 px-8 py-5 flex flex-col gap-4">
      <div className="s1 p-3 rounded-lg bg-cyan-400/5 border border-cyan-400/15"><span className="text-cyan-400 font-mono text-xs">MORPH TRANSFORM 01 — CEK AWAL & VALIDASI BATCH</span></div>
      <div className="flex-1 grid grid-cols-2 gap-6">
        <div className="s2 flex flex-col rounded-xl border border-red-400/20 bg-[#071428] overflow-hidden">
          <div className="px-4 py-3 border-b border-red-400/15 bg-red-400/5"><span className="text-red-400 text-xs font-semibold">📄 FORM KERTAS — Laporan Harian QC</span></div>
          <div className="flex-1 p-4">
            <div className="rounded-lg bg-[#030f1f] p-3 font-mono text-[11px] space-y-2 h-full border border-slate-700/30">
              <p className="text-slate-500">Tanggal: __/__/____  Shift: ___</p>
              <p className="text-slate-500">Produk: ________________</p>
              <p className="text-slate-500">Nomor Batch: ___________</p>
              <div className="border-t border-slate-700/30 my-2"/>
              <p className="text-slate-600 text-[10px]">Catatan manual, rentan salah tulis.</p>
              <div className="mt-3 p-2 rounded bg-red-400/5 border border-red-400/15">
                <p className="text-red-400 text-[10px]">⚠ Risiko: Batch salah tidak terdeteksi</p>
                <p className="text-red-400 text-[10px]">⚠ Risiko: Data hilang/basah/tidak terbaca</p>
              </div>
            </div>
          </div>
        </div>
        <div className="s3 flex flex-col rounded-xl border border-green-400/20 bg-[#071428] overflow-hidden">
          <div className="px-4 py-3 border-b border-green-400/15 bg-green-400/5"><span className="text-green-400 text-xs font-semibold">📱 UI TABLET SQIS — Validasi Produk & Batch</span></div>
          <div className="flex-1 p-4 flex flex-col gap-2.5">
            <div className="p-3 rounded-lg bg-[#0a2e1a] border border-green-400/20">
              <p className="text-green-400/60 text-[10px] mb-1">QR SCAN RESULT — QR-LINE-01</p>
              {[["Produk","Biskuit Susu (BSK-002)"],["Batch","123"],["Status","Running ✓"],["Shift","Shift 1 — Siti Rahayu"]].map(([k,v]) => (
                <div key={k} className="flex justify-between text-[11px]"><span className="text-slate-500">{k}</span><span className="text-green-400 font-mono">{v}</span></div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-green-400/5 border border-green-400/15 text-center"><p className="text-green-400 text-xs font-bold">✓ Batch Valid</p><p className="text-slate-500 text-[10px]">Cross-check otomatis</p></div>
              <div className="p-2.5 rounded-lg bg-cyan-400/5 border border-cyan-400/15 text-center"><p className="text-cyan-400 text-xs font-bold">⚡ Real-time</p><p className="text-slate-500 text-[10px]">Validasi instan</p></div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0a1f3d] border border-slate-700/30"><span className="text-slate-400 text-[11px]">🚫 Duplicate prevention aktif</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── SLIDE 11 ───────────────────────────────────────────────
function S11() {
  const machines = [{id:1,h:25,v:25,spd:25,status:"OK"},{id:2,h:25,v:25,spd:25,status:"OK"},{id:3,h:25,v:25,spd:25,status:"OK"},{id:4,h:25,v:55,spd:25,status:"NG"},{id:5,h:"-",v:"-",spd:"-",status:"OFF"},{id:6,h:25,v:25,spd:5,status:"NG"},{id:7,h:25,v:25,spd:25,status:"OK"},{id:8,h:25,v:25,spd:25,status:"OK"}]
  return (
    <div className="flex-1 px-8 py-5 flex flex-col gap-4">
      <div className="s1 p-3 rounded-lg bg-cyan-400/5 border border-cyan-400/15"><span className="text-cyan-400 font-mono text-xs">MORPH TRANSFORM 02 — SETTING & PARAMETER 8 MESIN</span></div>
      <div className="flex-1 grid grid-cols-2 gap-6">
        <div className="s2 flex flex-col rounded-xl border border-red-400/20 bg-[#071428] overflow-hidden">
          <div className="px-4 py-3 border-b border-red-400/15 bg-red-400/5"><span className="text-red-400 text-xs font-semibold">📄 Form Setting Mesin Manual</span></div>
          <div className="flex-1 p-3">
            <div className="rounded-lg bg-[#030f1f] p-3 font-mono text-[10px] space-y-1.5 border border-slate-700/30">
              {[1,2,3,4].map(n => <p key={n} className="text-slate-500">Mesin {n}: H=__  V=__  Spd=__  Paraf: _</p>)}
              <p className="text-slate-700">... (total 8 baris manual) ...</p>
              <div className="border-t border-slate-700/20 my-2"/>
              <p className="text-red-400/70 text-[9px]">⚠ Tidak ada alert jika nilai menyimpang</p>
              <p className="text-red-400/70 text-[9px]">⚠ Supervisor tidak bisa pantau real-time</p>
            </div>
          </div>
        </div>
        <div className="s3 flex flex-col rounded-xl border border-green-400/20 bg-[#071428] overflow-hidden">
          <div className="px-4 py-3 border-b border-green-400/15 bg-green-400/5"><span className="text-green-400 text-xs font-semibold">📱 UI SQIS — Parameter 8 Mesin + Auto Alert</span></div>
          <div className="flex-1 overflow-auto p-2">
            <table className="w-full text-[10px] font-mono">
              <thead><tr className="border-b border-slate-700/30">{["Mesin","H","V","Spd","Status"].map(h => <th key={h} className="text-slate-500 px-2 py-1.5 text-left">{h}</th>)}</tr></thead>
              <tbody>
                {machines.map(m => (
                  <tr key={m.id} className={`border-b border-slate-700/20 ${m.status==="NG"?"bg-red-400/5":m.status==="OFF"?"bg-yellow-400/5":""}`}>
                    <td className="px-2 py-1.5 text-slate-400">M{m.id}</td>
                    <td className="px-2 py-1.5 text-slate-300">{m.h}</td>
                    <td className={`px-2 py-1.5 font-bold ${m.v===55?"text-red-400":"text-slate-300"}`}>{m.v}</td>
                    <td className={`px-2 py-1.5 font-bold ${m.spd===5?"text-red-400":"text-slate-300"}`}>{m.spd}</td>
                    <td className="px-2 py-1.5"><span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${m.status==="OK"?"bg-green-400/15 text-green-400":m.status==="NG"?"bg-red-400/15 text-red-400":"bg-yellow-400/15 text-yellow-400"}`}>{m.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-2.5 border-t border-red-400/15 bg-red-400/5"><p className="text-red-400 text-[10px]">⚡ Alert: M4 V=55 menyimpang | M5 OFF | M6 Spd=5 low</p></div>
        </div>
      </div>
    </div>
  )
}

// ── SLIDE 12 ───────────────────────────────────────────────
function S12() {
  return (
    <div className="flex-1 px-8 py-5 flex flex-col gap-4">
      <div className="s1 p-3 rounded-lg bg-cyan-400/5 border border-cyan-400/15"><span className="text-cyan-400 font-mono text-xs">MORPH TRANSFORM 03 — KADAR AIR & SAMPLE MANAGEMENT</span></div>
      <div className="flex-1 grid grid-cols-2 gap-6">
        <div className="s2 flex flex-col rounded-xl border border-red-400/20 bg-[#071428] overflow-hidden">
          <div className="px-4 py-3 border-b border-red-400/15 bg-red-400/5"><span className="text-red-400 text-xs font-semibold">📖 Logbook Kertas Sampel</span></div>
          <div className="flex-1 p-3">
            <div className="rounded-lg bg-[#030f1f] p-3 font-mono text-[10px] space-y-1.5 border border-slate-700/30 h-full">
              <p className="text-slate-500">Tgl: 16/08/26  Shift 1  QC: Siti</p>
              {[["Sampel 1","3.2%"],["Sampel 2","2.8%"],["Sampel 3","3.5%"]].map(([s,v]) => <p key={s} className="text-slate-500">{s}: Kadar Air = {v}</p>)}
              <div className="border-t border-slate-700/20 my-2"/>
              <p className="text-red-400/70 text-[9px]">⚠ Penelusuran histori sulit</p>
              <p className="text-red-400/70 text-[9px]">⚠ Tidak ter-link ke Batch/Produk</p>
            </div>
          </div>
        </div>
        <div className="s3 flex flex-col rounded-xl border border-cyan-400/20 bg-[#071428] overflow-hidden">
          <div className="px-4 py-3 border-b border-cyan-400/15 bg-cyan-400/5"><span className="text-cyan-400 text-xs font-semibold">📱 SQIS — Sample Management + Tracking</span></div>
          <div className="flex-1 p-3 flex flex-col gap-2.5">
            <div className="p-2.5 rounded-lg bg-[#0a1f3d] border border-slate-700/30">
              <p className="text-slate-500 text-[10px] mb-2">🔍 Cari Sampel — Quick Search</p>
              <div className="flex items-center gap-2 p-2 rounded bg-[#030f1f] border border-slate-700/30">
                <span className="text-slate-600 text-[10px] font-mono">Sample ID: </span>
                <span className="text-cyan-400 text-[10px] font-mono">BSK-002-16082026-01</span>
                <span className="ml-auto text-green-400 text-[10px]">✓ Found</span>
              </div>
            </div>
            <div className="flex-1 rounded-lg bg-[#030f1f] border border-slate-700/30 p-2.5">
              <p className="text-slate-500 text-[10px] mb-2">HISTORI KADAR AIR — BSK-002</p>
              {[{t:"09:03",v:"2.55%",s:"OK"},{t:"11:20",v:"3.2%",s:"OK"},{t:"13:45",v:"3.8%",s:"WARN"},{t:"15:00",v:"3.1%",s:"OK"}].map(r => (
                <div key={r.t} className="flex items-center gap-2 py-1 border-b border-slate-800/50 last:border-0">
                  <span className="text-slate-600 text-[10px] font-mono w-10">{r.t}</span>
                  <span className="text-slate-300 text-[10px] font-mono flex-1">{r.v}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${r.s==="WARN"?"bg-yellow-400/15 text-yellow-400":"bg-green-400/15 text-green-400"}`}>{r.s}</span>
                </div>
              ))}
            </div>
            <div className="p-2 rounded-lg bg-green-400/5 border border-green-400/15"><p className="text-green-400 text-[10px]">⚡ Penelusuran histori instan via Sample ID</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── SLIDE 13 ───────────────────────────────────────────────
function S13() {
  return (
    <div className="flex-1 px-8 py-5 flex flex-col gap-4">
      <div className="s1 p-3 rounded-lg bg-cyan-400/5 border border-cyan-400/15"><span className="text-cyan-400 font-mono text-xs">MORPH TRANSFORM 04 — OVERLAP SHIFT & HANDOVER LOGBOOK</span></div>
      <div className="flex-1 grid grid-cols-2 gap-6">
        <div className="s2 flex flex-col rounded-xl border border-red-400/20 bg-[#071428] overflow-hidden">
          <div className="px-4 py-3 border-b border-red-400/15 bg-red-400/5"><span className="text-red-400 text-xs font-semibold">✍️ Catatan Tangan — Serah Terima Shift</span></div>
          <div className="flex-1 p-3">
            <div className="rounded-lg bg-[#030f1f] p-3 font-mono text-[10px] space-y-2 border border-slate-700/30 h-full" style={{fontFamily:"cursive,Georgia,serif",color:"#94a3b8"}}>
              <p>Shift 1 → Shift 2 — 16 Agu</p>
              <p>M3 breakdown, tunggu maint...</p>
              <p>Coding M5 NG sdh dihentikan</p>
              <p className="text-slate-700">TTD: ____________________</p>
              <div className="border-t border-slate-700/30 my-2"/>
              <p className="text-red-400/70 text-[9px]">⚠ Tulisan tidak terbaca / tidak lengkap</p>
            </div>
          </div>
        </div>
        <div className="s3 flex flex-col rounded-xl border border-blue-400/20 bg-[#071428] overflow-hidden">
          <div className="px-4 py-3 border-b border-blue-400/15 bg-blue-400/5"><span className="text-blue-400 text-xs font-semibold">📱 SQIS — Modul Overlap Shift Digital</span></div>
          <div className="flex-1 p-3 flex flex-col gap-2.5">
            <div className="flex-1 rounded-lg bg-[#030f1f] border border-slate-700/30 p-2.5">
              <p className="text-slate-500 text-[10px] mb-2">📋 CATATAN SERAH TERIMA TERSTRUKTUR</p>
              {[{icon:"🔧",text:"M3 breakdown — Menunggu maintenance (tiket #TKT-0821)"},{icon:"⚠️",text:"Coding M5 NG — Sudah dihentikan, pending verifikasi"},{icon:"🧪",text:"Sampel akhir belum diambil — Delegasi ke Shift 2"}].map(n => (
                <div key={n.text} className="flex items-start gap-2 py-1.5 border-b border-slate-800/40 last:border-0">
                  <span className="text-sm flex-shrink-0">{n.icon}</span>
                  <span className="text-slate-300 text-[10px] leading-relaxed">{n.text}</span>
                </div>
              ))}
            </div>
            <div className="p-2.5 rounded-lg bg-green-400/5 border border-green-400/15 flex items-center gap-2">
              <span className="text-green-400 text-xs">✍️ E-Signature</span>
              <div className="flex-1 h-1 bg-green-400/20 rounded-full"><div className="h-full w-3/4 bg-green-400/60 rounded-full"/></div>
              <span className="text-green-400 text-[10px]">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── SLIDE 14 ───────────────────────────────────────────────
function S14({ go }: { go: GoFn }) {
  const features = [
    {icon:"📊",title:"Dashboard QC",desc:"Real-time status semua lini & mesin",color:"#06b6d4",slide:13},
    {icon:"🔷",title:"Validasi QR",desc:"Scan QR untuk load data batch & produk",color:"#3b82f6",slide:7},
    {icon:"📈",title:"Dashboard Supervisor",desc:"Live monitoring & persetujuan digital",color:"#8b5cf6",slide:13},
    {icon:"🧪",title:"Sample ID & Kadar Air",desc:"Tracking sampel & histori pengukuran",color:"#22c55e",slide:9},
    {icon:"📤",title:"Export Laporan",desc:"PDF/Excel otomatis per shift/period",color:"#f59e0b",slide:14},
    {icon:"🔒",title:"Audit Trail",desc:"Log lengkap semua aksi + e-signature",color:"#ef4444",slide:12},
  ]
  return (
    <div className="flex-1 flex flex-col px-8 py-5 gap-4">
      <div className="s1 p-3 rounded-lg bg-cyan-400/5 border border-cyan-400/15 flex items-center justify-between">
        <span className="text-cyan-400 font-mono text-xs">6 MODUL UTAMA SQIS — Klik kartu untuk navigasi ke detail</span>
        <span className="text-slate-500 text-xs">Interactive Feature Hub</span>
      </div>
      <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-4">
        {features.map((f,i) => (
          <button key={i} onClick={() => go(f.slide,"zi")}
            className={`s${i+1} text-left rounded-xl border p-4 flex flex-col gap-3 transition-all hover:scale-[1.02] active:scale-100`}
            style={{borderColor:f.color+"30",background:f.color+"08"}}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{background:f.color+"15"}}>{f.icon}</div>
            <div><h3 className="text-white font-semibold text-sm">{f.title}</h3><p className="text-slate-500 text-[11px] mt-0.5">{f.desc}</p></div>
            <div className="mt-auto flex items-center gap-1.5"><div className="flex-1 h-0.5 rounded-full" style={{background:f.color+"30"}}/><span className="text-[10px]" style={{color:f.color}}>Lihat Detail →</span></div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── SLIDE 15 ───────────────────────────────────────────────
function S15() {
  const phases = [{id:"Login",icon:"🔐",color:"#3b82f6",desc:"Autentikasi NIK + Password"},{id:"Inspeksi",icon:"🔍",color:"#22c55e",desc:"Input data lapangan real-time"},{id:"Approval",icon:"✅",color:"#f59e0b",desc:"Review & e-signature supervisor"},{id:"Audit",icon:"📊",color:"#a78bfa",desc:"Log & arsip otomatis cloud"}]
  const roles = [{role:"QC Inspector",login:"✓",inspect:"✓ Full",approve:"—",audit:"View",exp:"—"},{role:"Supervisor",login:"✓",inspect:"✓ View",approve:"✓ Full",audit:"Full",exp:"✓"},{role:"Produksi",login:"✓",inspect:"✓ View",approve:"—",audit:"View",exp:"—"},{role:"Admin",login:"✓",inspect:"✓ Full",approve:"✓ Full",audit:"✓ Full",exp:"✓ Full"}]
  return (
    <div className="flex-1 px-8 py-5 flex flex-col gap-4">
      <div className="s1 flex items-center gap-2">
        {phases.map((p,i) => (
          <div key={p.id} className="flex items-center flex-1">
            <div className="flex-1 p-3 rounded-xl border text-center" style={{borderColor:p.color+"30",background:p.color+"08"}}>
              <div className="text-xl mb-1">{p.icon}</div>
              <p className="text-white font-bold text-sm">{p.id}</p>
              <p className="text-slate-500 text-[10px]">{p.desc}</p>
            </div>
            {i<phases.length-1 && <div className="text-slate-600 text-sm px-2">→</div>}
          </div>
        ))}
      </div>
      <div className="s2 flex-1 flex flex-col">
        <p className="text-slate-500 text-xs font-mono mb-2">MATRIKS HAK AKSES PENGGUNA</p>
        <div className="flex-1 rounded-xl border border-slate-700/40 overflow-hidden bg-[#071428]">
          <table className="w-full text-[12px]">
            <thead><tr className="bg-[#0a1f3d] border-b border-slate-700/30">{["Role","Login","Inspeksi","Approval","Audit Trail","Export"].map(h => <th key={h} className="px-4 py-2.5 text-left text-slate-400 font-semibold text-xs">{h}</th>)}</tr></thead>
            <tbody>
              {roles.map((r,i) => (
                <tr key={r.role} className={`border-b border-slate-700/20 ${i%2===0?"bg-[#071428]":"bg-[#030f1f]"}`}>
                  <td className="px-4 py-3 text-white font-semibold">{r.role}</td>
                  {[r.login,r.inspect,r.approve,r.audit,r.exp].map((v,vi) => (
                    <td key={vi} className={`px-4 py-3 font-mono text-xs ${v.includes("Full")?"text-green-400":v==="✓"?"text-cyan-400":v==="—"?"text-slate-700":"text-yellow-400"}`}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── SLIDE 16 ───────────────────────────────────────────────
function S16() {
  const lines = [{line:"Line 1",product:"Biskuit Susu",batch:"123",status:"Selesai",ng:0},{line:"Line 2",product:"Cokelat Kering",batch:"RAN675",status:"Berjalan",ng:1},{line:"Line 3",product:"Wafer Stik",batch:"WPS75",status:"Berjalan",ng:0},{line:"Line 4",product:"—",batch:"—",status:"Belum Mulai",ng:0}]
  const ngData = [2,0,3,1,2,0,1,0,2,1,0,2]; const maxNg = Math.max(...ngData)
  return (
    <div className="flex-1 px-8 py-5 flex flex-col gap-4">
      <div className="s1 grid grid-cols-4 gap-3">
        {[{l:"Inspeksi Hari Ini",v:"4",c:"text-cyan-400"},{l:"Total NG Ditemukan",v:"2",c:"text-red-400"},{l:"Mesin OFF",v:"1",c:"text-yellow-400"},{l:"Line Selesai",v:"1 / 4",c:"text-green-400"}].map((k,i) => (
          <Cd key={i} className="p-3 text-center"><div className={`text-3xl font-black count-pop ${k.c}`}>{k.v}</div><div className="text-slate-500 text-[10px] mt-0.5">{k.l}</div></Cd>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="s2 flex flex-col">
          <p className="text-slate-500 text-xs font-mono mb-2">STATUS MONITORING LINE REAL-TIME</p>
          <div className="flex-1 rounded-xl border border-slate-700/40 overflow-hidden bg-[#071428]">
            <table className="w-full text-[11px]">
              <thead><tr className="bg-[#0a1f3d] border-b border-slate-700/30">{["Line","Produk","Batch","NG","Status"].map(h => <th key={h} className="px-3 py-2 text-left text-slate-400 text-[10px]">{h}</th>)}</tr></thead>
              <tbody>{lines.map(l => (
                <tr key={l.line} className="border-b border-slate-700/20">
                  <td className="px-3 py-2.5 text-slate-300 font-semibold">{l.line}</td>
                  <td className="px-3 py-2.5 text-slate-400">{l.product}</td>
                  <td className="px-3 py-2.5 text-slate-500 font-mono">{l.batch}</td>
                  <td className={`px-3 py-2.5 font-bold ${l.ng>0?"text-red-400":"text-slate-600"}`}>{l.ng}</td>
                  <td className="px-3 py-2.5"><span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${l.status==="Selesai"?"bg-green-400/15 text-green-400":l.status==="Berjalan"?"bg-cyan-400/15 text-cyan-400":"bg-slate-700/40 text-slate-500"}`}>{l.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
        <div className="s3 flex flex-col">
          <p className="text-slate-500 text-xs font-mono mb-2">TREN NG — 12 JAM TERAKHIR</p>
          <Cd className="flex-1 p-4 flex flex-col">
            <div className="flex-1 flex items-end gap-1.5">
              {ngData.map((v,i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t bar1" style={{height:`${(v/maxNg)*80+8}%`,background:v>1?"linear-gradient(180deg,#ef4444,#dc2626)":"linear-gradient(180deg,#22c55e,#16a34a)",animationDelay:`${0.5+i*0.08}s`}}/>
                  <span className="text-slate-700 text-[8px] font-mono">{String(9+Math.floor(i/2)).padStart(2,"0")}h</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-700/30">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-400"/><span className="text-slate-500 text-[10px]">OK</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400"/><span className="text-slate-500 text-[10px]">&gt;1 NG</span></div>
              <span className="ml-auto text-slate-600 text-[10px] font-mono">Realtime · /5min</span>
            </div>
          </Cd>
        </div>
      </div>
    </div>
  )
}

// ── SLIDE 17 ───────────────────────────────────────────────
function S17() {
  const g = useGet()
  const categories = [0,1,2,3].map(i => ({cat:g(`s17.r${i}.cat`),before:Number(g(`s17.r${i}.before`)),after:Number(g(`s17.r${i}.after`)),unit:g(`s17.r${i}.unit`)}))
  const maxBefore = Math.max(...categories.map(c => c.before))
  return (
    <div className="flex-1 px-8 py-5 flex flex-col gap-5">
      <div className="s1 p-3 rounded-lg bg-purple-400/5 border border-purple-400/15"><span className="text-purple-400 font-mono text-xs">COST OF POOR QUALITY (COPQ) — Before vs After SQIS</span></div>
      <div className="flex-1 flex flex-col gap-3">
        {categories.map((c,i) => (
          <div key={c.cat} className={`s${i+2} flex-1 flex flex-col gap-1.5`}>
            <div className="flex justify-between items-center">
              <span className="text-white text-sm font-semibold">{c.cat}</span>
              <div className="flex items-center gap-4">
                <span className="text-red-400 font-mono text-xs">Before: {c.before} {c.unit}</span>
                <span className="text-green-400 font-mono text-xs">After: {c.after} {c.unit}</span>
                <span className="text-cyan-400 font-mono text-xs font-bold">-{c.before>0?Math.round((1-c.after/c.before)*100):0}%</span>
              </div>
            </div>
            <div className="flex items-center gap-2 h-5">
              <div className="flex-1 h-full rounded-full bg-[#0a1f3d] relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 rounded-full bg-red-400/30" style={{width:"100%"}}/>
                <div className={`bar${i+1} absolute inset-y-0 left-0 rounded-full`} style={{width:`${maxBefore>0?(c.after/maxBefore)*100:0}%`,background:c.after===0?"transparent":"linear-gradient(90deg,#22c55e,#06b6d4)"}}/>
              </div>
              {c.after===0 && <span className="text-green-400 text-xs font-bold whitespace-nowrap">✓ Eliminated</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="s6 flex gap-4">
        <div className="flex-1 grid grid-cols-3 gap-3">
          {[{v:"87.5%",l:"Reduksi Lead Time",c:"text-cyan-400"},{v:"100%",l:"Penghematan Kertas",c:"text-green-400"},{v:"~75%",l:"Reduksi Rework Cost",c:"text-yellow-400"}].map((k,i) => (
            <Cd key={i} className="p-3.5 text-center"><div className={`text-3xl font-black count-pop ${k.c}`}>{k.v}</div><div className="text-slate-500 text-[10px] mt-1">{k.l}</div></Cd>
          ))}
        </div>
        <Cd className="p-2 flex flex-col gap-1" style={{width:"220px",flexShrink:0}}>
          <p className="text-slate-500 text-[9px] font-mono px-1">ANALISIS BIAYA LANGSUNG</p>
          <img src={costAnalysisImg} alt="Analisis biaya kertas vs hosting SQIS" className="w-full rounded object-contain" style={{maxHeight:"72px"}}/>
          <a href={costPdfUrl} target="_blank" rel="noopener noreferrer" className="mt-0.5 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-400/10 border border-purple-400/20 hover:bg-purple-400/20 transition-all">
            <span className="text-purple-400 text-[9px]">📄</span>
            <span className="text-purple-300 text-[9px] font-medium">Lihat Perhitungan Lengkap →</span>
          </a>
        </Cd>
      </div>
    </div>
  )
}

// ── SLIDE 18 ───────────────────────────────────────────────
function S18() {
  const g = useGet()
  const kpis = [
    {v:g("s18.k0.v"),l:g("s18.k0.l"),sub:g("s18.k0.sub"),c:"text-green-400",bc:"border-green-400/20 bg-green-400/5"},
    {v:g("s18.k1.v"),l:g("s18.k1.l"),sub:g("s18.k1.sub"),c:"text-cyan-400",bc:"border-cyan-400/20 bg-cyan-400/5"},
    {v:g("s18.k2.v"),l:g("s18.k2.l"),sub:g("s18.k2.sub"),c:"text-blue-400",bc:"border-blue-400/20 bg-blue-400/5"},
    {v:g("s18.k3.v"),l:g("s18.k3.l"),sub:g("s18.k3.sub"),c:"text-yellow-400",bc:"border-yellow-400/20 bg-yellow-400/5"},
  ]
  const qualitative = [0,1,2,3,4].map(i => g(`s18.q${i}`))
  return (
    <div className="flex-1 px-8 py-5 flex flex-col gap-5">
      <div className="s1 grid grid-cols-4 gap-3">
        {kpis.map((k,i) => (
          <div key={i} className={`s${i+1} p-4 rounded-xl border ${k.bc} text-center`}>
            <div className={`text-4xl font-black count-pop ${k.c}`}>{k.v}</div>
            <div className="text-white font-semibold text-sm mt-1">{k.l}</div>
            <div className="text-slate-500 text-[10px] mt-1 leading-snug">{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="s5 flex-1 grid grid-cols-2 gap-4">
        <Cd className="p-5 flex flex-col gap-3">
          <h3 className="text-cyan-400 text-sm font-semibold font-mono">MANFAAT KUALITATIF</h3>
          {qualitative.map((q,i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-cyan-400/15 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-cyan-400 text-[10px]">✓</span></div>
              <span className="text-slate-300 text-[12px] leading-relaxed">{q}</span>
            </div>
          ))}
        </Cd>
        <div className="flex flex-col gap-3">
          <Cd className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-2xl">🏅</div>
            <div><p className="text-white font-bold text-sm">FSSC 22000</p><p className="text-slate-500 text-xs">Food Safety System Certification</p><p className="text-green-400 text-xs mt-0.5">✓ Audit-ready dengan SQIS</p></div>
          </Cd>
          <Cd className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-2xl">📋</div>
            <div><p className="text-white font-bold text-sm">ISO 22000:2018</p><p className="text-slate-500 text-xs">Food Safety Management System</p><p className="text-green-400 text-xs mt-0.5">✓ Traceability & record keeping</p></div>
          </Cd>
          <Cd className="flex-1 p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-400/10 border border-green-400/20 flex items-center justify-center text-2xl">✅</div>
            <div><p className="text-white font-bold text-sm">HACCP</p><p className="text-slate-500 text-xs">Hazard Analysis Critical Control Points</p><p className="text-green-400 text-xs mt-0.5">✓ Dokumentasi digital terintegrasi</p></div>
          </Cd>
        </div>
      </div>
    </div>
  )
}

// ── SLIDE 19 ───────────────────────────────────────────────
function S19() {
  const g = useGet()
  const phases = [0,1,2,3,4].map(i => ({ph:g(`s19.p${i}.ph`),title:g(`s19.p${i}.title`),weeks:g(`s19.p${i}.weeks`),items:[g(`s19.p${i}.i0`),g(`s19.p${i}.i1`),g(`s19.p${i}.i2`)],color:["#3b82f6","#8b5cf6","#f59e0b","#22c55e","#06b6d4"][i]}))
  return (
    <div className="flex-1 px-8 py-5 flex flex-col gap-5">
      <div className="s1">
        <div className="flex items-center gap-2 mb-3"><span className="text-slate-500 text-xs font-mono">TIMELINE 16 MINGGU</span><div className="flex-1 h-px bg-slate-700/40"/><span className="text-cyan-400 text-xs font-mono">5 Fase Implementasi</span></div>
        <div className="flex rounded-full overflow-hidden h-4">
          {phases.map(p => <div key={p.ph} className="tl-fill flex-1 flex items-center justify-center text-[9px] font-bold text-white/80" style={{background:p.color}}>{p.ph}</div>)}
        </div>
        <div className="flex mt-1">{phases.map(p => <div key={p.ph} className="flex-1 text-center"><span className="text-[9px] font-mono" style={{color:p.color}}>{p.weeks}</span></div>)}</div>
      </div>
      <div className="flex-1 grid grid-cols-5 gap-3">
        {phases.map((p,i) => (
          <div key={p.ph} className={`s${i+2} flex flex-col rounded-xl border overflow-hidden`} style={{borderColor:p.color+"30",background:"#071428"}}>
            <div className="px-3 py-2.5 border-b" style={{borderColor:p.color+"20",background:p.color+"10"}}>
              <span className="font-black text-xs" style={{color:p.color}}>{p.ph}</span>
              <p className="text-white font-semibold text-xs mt-0.5">{p.title}</p>
              <p className="text-[10px] font-mono mt-0.5" style={{color:p.color}}>{p.weeks}</p>
            </div>
            <div className="flex-1 p-3 space-y-2">
              {p.items.map((it,ii) => (<div key={ii} className="flex items-start gap-1.5"><div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{background:p.color}}/><span className="text-slate-400 text-[10px] leading-snug">{it}</span></div>))}
            </div>
          </div>
        ))}
      </div>
      <div className="s7 grid grid-cols-3 gap-3">
        {[{v:"16 Minggu",l:"Total Durasi",c:"text-cyan-400"},{v:"5 Fase",l:"Implementasi Bertahap",c:"text-blue-400"},{v:"Lini 1 → Semua",l:"Pilot → Full Rollout",c:"text-green-400"}].map((k,i) => (
          <div key={i} className="p-3 rounded-xl border border-slate-700/30 bg-[#071428] text-center">
            <div className={`font-black text-lg count-pop ${k.c}`}>{k.v}</div>
            <div className="text-slate-600 text-[10px] mt-0.5">{k.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SLIDE 20 ───────────────────────────────────────────────
function S20({ go }: { go: GoFn }) {
  const g = useGet()
  const summaries = [0,1,2].map(i => ({icon:g(`s20.sum${i}.icon`),title:g(`s20.sum${i}.title`),desc:g(`s20.sum${i}.desc`)}))
  const resources = [0,1,2,3,4].map(i => ({cat:g(`s20.r${i}.cat`),spec:g(`s20.r${i}.spec`),qty:g(`s20.r${i}.qty`),note:g(`s20.r${i}.note`)}))
  return (
    <div className="flex-1 px-8 py-5 flex flex-col gap-4">
      <div className="s1 grid grid-cols-3 gap-3">
        {summaries.map((s,i) => (
          <Cd key={s.title} className={`s${i+1} p-4 flex items-center gap-3`}>
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center text-xl flex-shrink-0">{s.icon}</div>
            <div><p className="text-white font-semibold text-sm">{s.title}</p><p className="text-slate-500 text-[11px]">{s.desc}</p></div>
          </Cd>
        ))}
      </div>
      <div className="s4 flex-1 flex flex-col">
        <p className="text-slate-500 text-xs font-mono mb-2">ALOKASI RESOURCE — KEBUTUHAN IMPLEMENTASI</p>
        <Cd className="flex-1 overflow-hidden">
          <table className="w-full text-[11px]">
            <thead><tr className="bg-[#0a1f3d] border-b border-slate-700/30">{["Kategori","Spesifikasi","Jumlah","Tujuan"].map(h => <th key={h} className="px-4 py-2.5 text-left text-slate-400 text-xs">{h}</th>)}</tr></thead>
            <tbody>
              {resources.map((r,i) => (
                <tr key={r.cat} className={`border-b border-slate-700/20 ${i%2===0?"bg-[#071428]":"bg-[#030f1f]"}`}>
                  <td className="px-4 py-2.5 text-cyan-400 font-semibold">{r.cat}</td>
                  <td className="px-4 py-2.5 text-slate-300">{r.spec}</td>
                  <td className="px-4 py-2.5 text-white font-bold font-mono">{r.qty}</td>
                  <td className="px-4 py-2.5 text-slate-500">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Cd>
      </div>
      <div className="s5 flex gap-4 items-center p-4 rounded-xl bg-gradient-to-r from-cyan-400/10 to-blue-600/10 border border-cyan-400/20">
        <div className="flex-1">
          <p className="text-white font-bold text-sm mb-1">{g("s20.cta.headline")}</p>
          <p className="text-slate-400 text-xs">{g("s20.cta.body")}</p>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button onClick={() => go(0,"bwd")} className="px-5 py-2.5 rounded-xl bg-[#071428] border border-slate-700/50 text-slate-300 text-sm hover:border-cyan-400/40 hover:text-white transition-all">← Kembali ke Awal</button>
          <a href="https://pixel-perfect-clone-54801.vercel.app/dashboard" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl bg-cyan-400 text-[#020c1b] font-bold text-sm hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/20 inline-block">⚡ Mulai Live Demo</a>
        </div>
      </div>
    </div>
  )
}

// ── Slide registry ─────────────────────────────────────────
const SLIDE_COMPONENTS: Array<React.FC<{go: GoFn}>> = [
  S01,S02,S03,S06,S07,S08,S09,S10,
  S11,S12,S13,S14,S15,S16,S17,S18,S19,S20,
]

// ── Main App ───────────────────────────────────────────────
function AppInner() {
  const { idx, key, tc, go } = useSlides()
  const { c, editMode, setEditMode } = useC()
  const title = c[`slide.${idx}.title`] ?? DEFAULT_CONTENT[`slide.${idx}.title`] ?? ""
  const sub = c[`slide.${idx}.sub`] ?? DEFAULT_CONTENT[`slide.${idx}.sub`]
  const SlideComp = SLIDE_COMPONENTS[idx]
  return (
    <div className="w-full h-screen bg-[#020c1b] flex flex-col overflow-hidden"
      style={{fontFamily:"'Inter',sans-serif",paddingRight:editMode?"340px":"0",transition:"padding-right 0.3s ease"}}>
      {idx !== 0 && <SHdr n={idx+1} title={title} sub={sub}/>}
      <div key={key} className={`flex-1 flex flex-col overflow-hidden ${TC[tc]}`}>
        <SlideComp go={go}/>
      </div>
      <NavBar idx={idx} go={go} editMode={editMode} onToggleEdit={() => setEditMode(!editMode)}/>
      {editMode && <EditPanel idx={idx} onClose={() => setEditMode(false)}/>}
    </div>
  )
}

export default function App() {
  return (
    <ContentProvider>
      <AppInner/>
    </ContentProvider>
  )
}
