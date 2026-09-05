import logoUrl from "@/assets/autovere-logo.png";

/** Premium light print palette — deliberately independent of the dark
 * Admin dashboard theme. Every color below is chosen for a white page. */
const INK: [number, number, number] = [15, 23, 42]; // near-black, titles & KPI values
const BODY: [number, number, number] = [51, 65, 85]; // dark slate, table body text
const MUTED: [number, number, number] = [100, 116, 139]; // gray, captions/labels/footer
const ACCENT: [number, number, number] = [245, 158, 11]; // AutoVere amber — accents only
const BORDER: [number, number, number] = [226, 232, 240]; // hairlines, card borders
const TABLE_HEAD_BG: [number, number, number] = [248, 250, 252];

export type AreaPdfTable = { title: string; columns: string[]; rows: (string | number)[][] };
export type ChartSeriesPoint = { label: string; value: number };
export type AreaPdfChart = { title: string; type: "area" | "bar"; series: ChartSeriesPoint[] };
export type AreaPdfBlock = { kpis?: { label: string; value: string }[]; chart?: AreaPdfChart; tables?: AreaPdfTable[] };

export type AreaDataPdfInput = {
  areaLabel: string;
  block: AreaPdfBlock;
  periodLabel: string;
  generatedAtLabel: string;
};

const LOGO_EXPORT_SIZE = 160; // px — the source asset is 1024×1024; the PDF only ever shows it at ~12mm.

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch(logoUrl);
    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = LOGO_EXPORT_SIZE;
    canvas.height = LOGO_EXPORT_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, LOGO_EXPORT_SIZE, LOGO_EXPORT_SIZE);
    return canvas.toDataURL("image/png");
  } catch {
    return null; // a logo-fetch hiccup must never block the export
  }
}

// Started as soon as this module is imported (not when the button is
// clicked), so callers can warm it on mount via a bare
// `import("@/components/admin/pdf/generateAreaDataPdf")`. jsPDF/autotable are
// ~450KB combined; loading them only after the click risked the browser's
// click-to-download window expiring before doc.save() ran, which fails
// silently (no thrown error) in some browsers.
const libsPromise = Promise.all([import("jspdf"), import("jspdf-autotable")]);
const logoPromise = loadLogoDataUrl();

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/** A filled, closed polygon area chart with light gridlines — drawn as
 * native vector paths (no rasterized canvas), so it stays crisp at any zoom
 * or print resolution. */
function drawAreaChart(
  doc: import("jspdf").jsPDF,
  { x, y, width, height, series }: { x: number; y: number; width: number; height: number; series: ChartSeriesPoint[] },
) {
  if (series.length === 0) return;
  const values = series.map((s) => s.value);
  const maxVal = Math.max(...values, 1);
  const plotLeft = x + 13;
  const plotRight = x + width - 2;
  const plotTop = y + 3;
  const plotBottom = y + height - 8;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;
  const gridLines = 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  for (let i = 0; i <= gridLines; i++) {
    const v = (maxVal / gridLines) * i;
    const gy = plotBottom - (plotHeight * i) / gridLines;
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.15);
    doc.line(plotLeft, gy, plotRight, gy);
    doc.setTextColor(...MUTED);
    doc.text(String(Math.round(v)), plotLeft - 2, gy + 1, { align: "right" });
  }

  const stepX = series.length > 1 ? plotWidth / (series.length - 1) : 0;
  const pts = series.map((s, i) => ({
    px: plotLeft + stepX * i,
    py: plotBottom - (maxVal > 0 ? (s.value / maxVal) * plotHeight : 0),
  }));

  doc.saveGraphicsState();
  doc.setGState(doc.GState({ opacity: 0.16 }));
  doc.setFillColor(...ACCENT);
  doc.moveTo(pts[0]!.px, plotBottom);
  for (const p of pts) doc.lineTo(p.px, p.py);
  doc.lineTo(pts[pts.length - 1]!.px, plotBottom);
  doc.close();
  doc.fill();
  doc.restoreGraphicsState();

  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.55);
  for (let i = 0; i < pts.length - 1; i++) {
    doc.line(pts[i]!.px, pts[i]!.py, pts[i + 1]!.px, pts[i + 1]!.py);
  }
  if (series.length <= 12) {
    doc.setFillColor(...ACCENT);
    for (const p of pts) doc.circle(p.px, p.py, 0.7, "F");
  }

  doc.setTextColor(...MUTED);
  doc.setFontSize(6.5);
  const labelIdxs =
    series.length <= 6 ? series.map((_, i) => i) : [0, Math.floor((series.length - 1) / 2), series.length - 1];
  for (const i of labelIdxs) {
    doc.text(series[i]!.label, pts[i]!.px, plotBottom + 5, { align: "center" });
  }
}

/** A simple vertical bar chart, same visual language as the area chart. */
function drawBarChart(
  doc: import("jspdf").jsPDF,
  { x, y, width, height, series }: { x: number; y: number; width: number; height: number; series: ChartSeriesPoint[] },
) {
  if (series.length === 0) return;
  const shown = series.slice(0, 8); // keep it legible — a dense bar chart isn't a clean one
  const maxVal = Math.max(...shown.map((s) => s.value), 1);
  const plotLeft = x + 13;
  const plotRight = x + width - 2;
  const plotTop = y + 3;
  const plotBottom = y + height - 8;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;
  const gridLines = 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  for (let i = 0; i <= gridLines; i++) {
    const v = (maxVal / gridLines) * i;
    const gy = plotBottom - (plotHeight * i) / gridLines;
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.15);
    doc.line(plotLeft, gy, plotRight, gy);
    doc.setTextColor(...MUTED);
    doc.text(String(Math.round(v)), plotLeft - 2, gy + 1, { align: "right" });
  }

  const n = shown.length;
  const slot = plotWidth / n;
  const barWidth = Math.min(12, slot * 0.55);
  doc.setFont("helvetica", "bold");
  shown.forEach((s, i) => {
    const barH = maxVal > 0 ? (s.value / maxVal) * plotHeight : 0;
    const bx = plotLeft + slot * i + (slot - barWidth) / 2;
    const by = plotBottom - barH;
    doc.setFillColor(...ACCENT);
    doc.roundedRect(bx, by, barWidth, Math.max(barH, 0.01), 0.5, 0.5, "F");
    doc.setTextColor(...INK);
    doc.setFontSize(6.5);
    doc.text(String(Math.round(s.value)), bx + barWidth / 2, by - 1.2, { align: "center" });
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");
    doc.text(truncate(s.label, 12), plotLeft + slot * i + slot / 2, plotBottom + 5, { align: "center" });
    doc.setFont("helvetica", "bold");
  });
}

/** Elegant KPI cards (label + big value, thin amber accent tick) in place of
 * a plain data table — reads like an executive summary, not a spreadsheet. */
function drawKpiCards(
  doc: import("jspdf").jsPDF,
  x: number,
  y: number,
  width: number,
  kpis: { label: string; value: string }[],
): number {
  const perRow = Math.min(kpis.length, 5);
  const gap = 4;
  const cardW = (width - gap * (perRow - 1)) / perRow;
  const cardH = 22;

  kpis.forEach((k, i) => {
    const row = Math.floor(i / perRow);
    const col = i % perRow;
    const cx = x + col * (cardW + gap);
    const cy = y + row * (cardH + gap);

    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.2);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(cx, cy, cardW, cardH, 1.6, 1.6, "FD");
    doc.setFillColor(...ACCENT);
    doc.roundedRect(cx, cy, 1.3, cardH, 0.65, 0.65, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(k.label.toUpperCase(), cx + 5, cy + 7.5, { maxWidth: cardW - 8 });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14.5);
    doc.setTextColor(...INK);
    doc.text(k.value, cx + 5, cy + 16.5, { maxWidth: cardW - 8 });
  });

  const rows = Math.ceil(kpis.length / perRow);
  return y + rows * (cardH + gap) - gap;
}

/** Premium, print-first PDF export of one existing Admin tab — white page,
 * near-black text, AutoVere amber used only as an accent. Not a screenshot
 * of the dark dashboard: the numbers/tables/chart are the same data shown
 * on screen, redrawn for paper. */
export async function generateAreaDataPdf({ areaLabel, block, periodLabel, generatedAtLabel }: AreaDataPdfInput) {
  const [[{ jsPDF }, { autoTable }], logoDataUrl] = await Promise.all([libsPromise, logoPromise]);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 22) {
      doc.addPage();
      y = margin;
    }
  };

  // Header: logo + wordmark
  const logoSize = 12;
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, "PNG", margin, y, logoSize, logoSize);
    } catch {
      /* a corrupt/unreadable logo asset must never block the export */
    }
  }
  const textX = margin + (logoDataUrl ? logoSize + 4 : 0);
  const wordmarkY = y + logoSize / 2 + 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...INK);
  doc.text("Auto", textX, wordmarkY);
  doc.setTextColor(...ACCENT);
  doc.text("Vere", textX + doc.getTextWidth("Auto"), wordmarkY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("Konfidensiell rapport", pageWidth - margin, wordmarkY, { align: "right" });

  y += logoSize + 6;
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...INK);
  doc.text(areaLabel, margin, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(`${periodLabel}  ·  Generert ${generatedAtLabel}`, margin, y);
  y += 11;

  if (block.kpis && block.kpis.length > 0) {
    const perRow = Math.min(block.kpis.length, 5);
    const rows = Math.ceil(block.kpis.length / perRow);
    ensureSpace(rows * 26);
    y = drawKpiCards(doc, margin, y, pageWidth - margin * 2, block.kpis);
    y += 10;
  }

  if (block.chart && block.chart.series.length > 0) {
    const chartHeight = 52;
    ensureSpace(chartHeight + 14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(...INK);
    doc.text(block.chart.title, margin, y);
    y += 5;
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, y, pageWidth - margin * 2, chartHeight, 2, 2, "D");
    const chartArgs = { x: margin, y, width: pageWidth - margin * 2, height: chartHeight, series: block.chart.series };
    if (block.chart.type === "area") drawAreaChart(doc, chartArgs);
    else drawBarChart(doc, chartArgs);
    y += chartHeight + 10;
  }

  for (const table of block.tables ?? []) {
    ensureSpace(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(...INK);
    doc.text(table.title, margin, y);
    y += 5;
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [table.columns],
      body: table.rows.length > 0 ? table.rows : [table.columns.map(() => "—")],
      theme: "grid",
      headStyles: {
        fillColor: TABLE_HEAD_BG,
        textColor: INK,
        fontStyle: "bold",
        lineColor: BORDER,
        lineWidth: 0.15,
        fontSize: 9,
      },
      bodyStyles: { textColor: BODY, lineColor: BORDER, lineWidth: 0.1 },
      alternateRowStyles: { fillColor: [252, 252, 253] },
      styles: { fontSize: 9, cellPadding: 3 },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text("AutoVere · Konfidensielt", margin, pageHeight - 9);
    doc.text(`Side ${i} av ${pageCount}`, pageWidth - margin, pageHeight - 9, { align: "right" });
  }

  const safeArea = areaLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  doc.save(`autovere-${safeArea}-${new Date().toISOString().slice(0, 10)}.pdf`);
}
