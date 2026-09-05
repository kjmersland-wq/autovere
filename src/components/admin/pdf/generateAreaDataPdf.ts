import { createPdfDoc, pdfLibsPromise } from "@/components/admin/pdf/pdfDoc";

/** Premium light print palette — deliberately independent of the dark
 * Admin dashboard theme. Every color below is chosen for a white page. */
export const INK: [number, number, number] = [15, 23, 42]; // near-black, titles & KPI values
export const BODY: [number, number, number] = [51, 65, 85]; // dark slate, table body text
export const MUTED: [number, number, number] = [100, 116, 139]; // gray, captions/labels/footer
export const ACCENT: [number, number, number] = [245, 158, 11]; // AutoVere amber — accents only
export const BORDER: [number, number, number] = [226, 232, 240]; // hairlines, card borders
export const TABLE_HEAD_BG: [number, number, number] = [248, 250, 252];

export const numberFormat = new Intl.NumberFormat("nb-NO");

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

export type Doc = import("jspdf").jsPDF;

/** Shrinks font-size (never below `minSize`) until `text` fits on one line
 * within `maxWidth` — used for KPI values so long content (e.g. "Ikke
 * tilgjengelig") is never truncated and never forced into a mid-word wrap. */
export function fitSingleLine(doc: Doc, text: string, maxWidth: number, startSize: number, minSize: number): number {
  let size = startSize;
  doc.setFontSize(size);
  while (size > minSize && doc.getTextWidth(text) > maxWidth) {
    size -= 0.5;
    doc.setFontSize(size);
  }
  return size;
}

/** Word-wraps `text` to at most `maxLines`, shrinking font-size first if the
 * text genuinely needs more room than that — real word boundaries only, no
 * mid-word breaks under normal (non-pathological) label lengths. */
export function fitWrappedLines(
  doc: Doc,
  text: string,
  maxWidth: number,
  startSize: number,
  minSize: number,
  maxLines: number,
): { lines: string[]; size: number } {
  let size = startSize;
  doc.setFontSize(size);
  let lines: string[] = doc.splitTextToSize(text, maxWidth);
  while (lines.length > maxLines && size > minSize) {
    size -= 0.4;
    doc.setFontSize(size);
    lines = doc.splitTextToSize(text, maxWidth);
  }
  return { lines: lines.slice(0, maxLines), size };
}

/** Truncates to fit `maxWidth` at the doc's current font, only as a last
 * resort for chart category labels (never used for KPI values or table
 * data — those must always show in full). */
export function truncateToWidth(doc: Doc, text: string, maxWidth: number): string {
  if (doc.getTextWidth(text) <= maxWidth) return text;
  let end = text.length;
  while (end > 1 && doc.getTextWidth(`${text.slice(0, end)}…`) > maxWidth) end -= 1;
  return `${text.slice(0, end)}…`;
}

/** A small amber tick + bold section title — the same accent language as the
 * KPI cards, used consistently above every section so the report reads as
 * one designed document rather than stacked, unrelated blocks. */
export function sectionTitle(doc: Doc, font: string, x: number, y: number, text: string): void {
  doc.setFillColor(...ACCENT);
  doc.rect(x, y - 3.2, 1.4, 4.4, "F");
  doc.setFont(font, "bold");
  doc.setFontSize(12);
  doc.setTextColor(...INK);
  doc.text(text, x + 4, y);
}

/** The widest formatted axis label at the current font — used to size the
 * chart's left gutter dynamically so large numbers (thousands+) never
 * collide with the plot area. */
function axisGutterWidth(doc: Doc, maxVal: number, gridLines: number): number {
  let widest = 0;
  for (let i = 0; i <= gridLines; i++) {
    const label = numberFormat.format(Math.round((maxVal / gridLines) * i));
    widest = Math.max(widest, doc.getTextWidth(label));
  }
  return widest + 4;
}

/** A filled, closed polygon area chart with light gridlines — drawn as
 * native vector paths (no rasterized canvas), so it stays crisp at any zoom
 * or print resolution. */
export function drawAreaChart(
  doc: Doc,
  font: string,
  { x, y, width, height, series }: { x: number; y: number; width: number; height: number; series: ChartSeriesPoint[] },
) {
  if (series.length === 0) return;
  const values = series.map((s) => s.value);
  const maxVal = Math.max(...values, 1);
  const gridLines = 4;

  doc.setFont(font, "normal");
  doc.setFontSize(7);
  const gutter = axisGutterWidth(doc, maxVal, gridLines);
  const plotLeft = x + gutter;
  const plotRight = x + width - 3;
  const plotTop = y + 4;
  const plotBottom = y + height - 10;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

  for (let i = 0; i <= gridLines; i++) {
    const v = (maxVal / gridLines) * i;
    const gy = plotBottom - (plotHeight * i) / gridLines;
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.15);
    doc.line(plotLeft, gy, plotRight, gy);
    doc.setTextColor(...MUTED);
    doc.text(numberFormat.format(Math.round(v)), plotLeft - 3, gy + 1, { align: "right" });
  }

  const stepX = series.length > 1 ? plotWidth / (series.length - 1) : 0;
  const pts = series.map((s, i) => ({
    px: plotLeft + stepX * i,
    py: plotBottom - (maxVal > 0 ? (s.value / maxVal) * plotHeight : 0),
  }));

  doc.saveGraphicsState();
  doc.setGState(doc.GState({ opacity: 0.14 }));
  doc.setFillColor(...ACCENT);
  doc.moveTo(pts[0]!.px, plotBottom);
  for (const p of pts) doc.lineTo(p.px, p.py);
  doc.lineTo(pts[pts.length - 1]!.px, plotBottom);
  doc.close();
  doc.fill();
  doc.restoreGraphicsState();

  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.6);
  for (let i = 0; i < pts.length - 1; i++) {
    doc.line(pts[i]!.px, pts[i]!.py, pts[i + 1]!.px, pts[i + 1]!.py);
  }
  if (series.length <= 12) {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...ACCENT);
    doc.setLineWidth(0.5);
    for (const p of pts) doc.circle(p.px, p.py, 0.9, "FD");
  }

  doc.setFont(font, "normal");
  doc.setTextColor(...MUTED);
  doc.setFontSize(7);
  const labelIdxs =
    series.length <= 6 ? series.map((_, i) => i) : [0, Math.floor((series.length - 1) / 2), series.length - 1];
  for (const i of labelIdxs) {
    doc.text(series[i]!.label, pts[i]!.px, plotBottom + 6, { align: "center" });
  }
}

/** A simple vertical bar chart, same visual language as the area chart. */
export function drawBarChart(
  doc: Doc,
  font: string,
  { x, y, width, height, series }: { x: number; y: number; width: number; height: number; series: ChartSeriesPoint[] },
) {
  if (series.length === 0) return;
  const shown = series.slice(0, 8); // keep it legible — a dense bar chart isn't a clean one
  const maxVal = Math.max(...shown.map((s) => s.value), 1);
  const gridLines = 4;

  doc.setFont(font, "normal");
  doc.setFontSize(7);
  const gutter = axisGutterWidth(doc, maxVal, gridLines);
  const plotLeft = x + gutter;
  const plotRight = x + width - 3;
  const plotTop = y + 4;
  const plotBottom = y + height - 10;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

  for (let i = 0; i <= gridLines; i++) {
    const v = (maxVal / gridLines) * i;
    const gy = plotBottom - (plotHeight * i) / gridLines;
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.15);
    doc.line(plotLeft, gy, plotRight, gy);
    doc.setTextColor(...MUTED);
    doc.text(numberFormat.format(Math.round(v)), plotLeft - 3, gy + 1, { align: "right" });
  }

  const n = shown.length;
  const slot = plotWidth / n;
  const barWidth = Math.min(14, slot * 0.5);
  shown.forEach((s, i) => {
    const barH = maxVal > 0 ? (s.value / maxVal) * plotHeight : 0;
    const bx = plotLeft + slot * i + (slot - barWidth) / 2;
    const by = plotBottom - barH;
    doc.setFillColor(...ACCENT);
    doc.roundedRect(bx, by, barWidth, Math.max(barH, 0.01), 0.6, 0.6, "F");

    doc.setFont(font, "bold");
    doc.setFontSize(7);
    doc.setTextColor(...INK);
    doc.text(numberFormat.format(Math.round(s.value)), bx + barWidth / 2, by - 1.5, { align: "center" });

    doc.setFont(font, "normal");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(truncateToWidth(doc, s.label, slot - 1), plotLeft + slot * i + slot / 2, plotBottom + 6, {
      align: "center",
    });
  });
}

/** Elegant KPI cards (label + big value, thin amber accent tick) in place of
 * a plain data table — reads like an executive summary, not a spreadsheet.
 * Values always render on one line at a size that guarantees they fit —
 * never wrapped mid-word, never truncated. */
export function drawKpiCards(
  doc: Doc,
  font: string,
  x: number,
  y: number,
  width: number,
  kpis: { label: string; value: string }[],
): number {
  const gap = 5;
  // Balanced row layout for the KPI counts this app actually produces (2–5) —
  // a flat 5-per-row squeezed cards too narrow for longer values/labels
  // ("Ikke tilgjengelig") and forced jsPDF into mid-word breaks.
  const perRow = kpis.length <= 4 ? Math.max(kpis.length, 1) : kpis.length === 5 ? 3 : 4;
  const cardW = (width - gap * (perRow - 1)) / perRow;
  const cardH = 26;
  const pad = 6;
  const textMaxWidth = cardW - pad - 3;

  kpis.forEach((k, i) => {
    const row = Math.floor(i / perRow);
    const col = i % perRow;
    const cx = x + col * (cardW + gap);
    const cy = y + row * (cardH + gap);

    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.2);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(cx, cy, cardW, cardH, 1.8, 1.8, "FD");
    doc.setFillColor(...ACCENT);
    doc.roundedRect(cx, cy, 1.4, cardH, 0.7, 0.7, "F");

    doc.setFont(font, "normal");
    doc.setTextColor(...MUTED);
    const { lines: labelLines } = fitWrappedLines(doc, k.label.toUpperCase(), textMaxWidth, 7.2, 6, 2);
    doc.text(labelLines, cx + pad, cy + 8);

    doc.setFont(font, "bold");
    doc.setTextColor(...INK);
    fitSingleLine(doc, k.value, textMaxWidth, 15.5, 8.5);
    doc.text(k.value, cx + pad, cy + cardH - 6.5);
  });

  const rows = Math.ceil(kpis.length / perRow);
  return y + rows * cardH + (rows - 1) * gap;
}

/** Draws one section title + data table, autoTable-styled to match the
 * report's palette (light header, hairline borders, right-aligned numeric
 * last column). Returns the new y cursor. */
export function drawDataTable(
  doc: Doc,
  autoTable: typeof import("jspdf-autotable").autoTable,
  font: string,
  margin: number,
  y: number,
  table: AreaPdfTable,
): number {
  sectionTitle(doc, font, margin, y, table.title);
  y += 7;
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [table.columns],
    body: table.rows.length > 0 ? table.rows : [table.columns.map(() => "—")],
    theme: "grid",
    styles: { font, fontSize: 9.5 },
    headStyles: {
      font,
      fontStyle: "bold",
      fillColor: TABLE_HEAD_BG,
      textColor: INK,
      lineColor: BORDER,
      lineWidth: 0.15,
      fontSize: 9,
      cellPadding: 3.4,
    },
    bodyStyles: { font, textColor: BODY, lineColor: BORDER, lineWidth: 0.1, cellPadding: 3.4 },
    alternateRowStyles: { fillColor: [252, 252, 253] },
    tableLineColor: BORDER,
    tableLineWidth: 0.15,
    columnStyles: { [table.columns.length - 1]: { halign: "right" } },
  });
  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 13;
}

/** Draws the AutoVere logo + wordmark header, the separator rule, and the
 * report title block. Returns the new y cursor, ready for the first
 * section. */
export function drawReportHeader(
  doc: Doc,
  font: string,
  {
    pageWidth,
    margin,
    logoDataUrl,
    areaLabel,
    periodLabel,
    generatedAtLabel,
  }: {
    pageWidth: number;
    margin: number;
    logoDataUrl: string | null;
    areaLabel: string;
    periodLabel: string;
    generatedAtLabel: string;
  },
): number {
  let y = margin;
  const logoSize = 13;
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, "PNG", margin, y, logoSize, logoSize);
    } catch {
      /* a corrupt/unreadable logo asset must never block the export */
    }
  }
  const textX = margin + (logoDataUrl ? logoSize + 5 : 0);
  const wordmarkY = y + logoSize / 2 + 2.2;
  doc.setFont(font, "bold");
  doc.setFontSize(16);
  doc.setTextColor(...INK);
  doc.text("Auto", textX, wordmarkY);
  doc.setTextColor(...ACCENT);
  doc.text("Vere", textX + doc.getTextWidth("Auto"), wordmarkY);

  doc.setFont(font, "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("KONFIDENSIELL RAPPORT", pageWidth - margin, wordmarkY, { align: "right" });

  y += logoSize + 7;
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 13;

  doc.setFont(font, "bold");
  doc.setFontSize(25);
  doc.setTextColor(...INK);
  doc.setCharSpace(0.15);
  doc.text(areaLabel, margin, y);
  doc.setCharSpace(0);
  y += 8.5;

  doc.setFont(font, "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  doc.text(periodLabel.toUpperCase(), margin, y);
  doc.text(`GENERERT ${generatedAtLabel}`.toUpperCase(), pageWidth - margin, y, { align: "right" });
  y += 13;
  return y;
}

/** Draws the hairline + "AutoVere · Konfidensielt" + page-number footer on
 * every page currently in the document. Call once, after all content. */
export function drawReportFooter(doc: Doc, font: string, margin: number, pageWidth: number, pageHeight: number): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    doc.setFont(font, "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text("AutoVere · Konfidensielt", margin, pageHeight - 10);
    doc.text(`Side ${i} av ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: "right" });
  }
}

/** Premium, print-first PDF export of one existing Admin tab — white page,
 * near-black text, AutoVere amber used only as an accent. Not a screenshot
 * of the dark dashboard: the numbers/tables/chart are the same data shown
 * on screen, redrawn for paper. */
export async function generateAreaDataPdf({ areaLabel, block, periodLabel, generatedAtLabel }: AreaDataPdfInput) {
  const [[{ jsPDF }, { autoTable }]] = await Promise.all([pdfLibsPromise]);
  const { doc, font, logoDataUrl } = await createPdfDoc(jsPDF);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  const ensureSpace = (y: number, needed: number) => {
    if (y + needed > pageHeight - 24) {
      doc.addPage();
      return margin;
    }
    return y;
  };

  let y = drawReportHeader(doc, font, { pageWidth, margin, logoDataUrl, areaLabel, periodLabel, generatedAtLabel });

  if (block.kpis && block.kpis.length > 0) {
    const perRow = block.kpis.length <= 4 ? block.kpis.length : block.kpis.length === 5 ? 3 : 4;
    const rows = Math.ceil(block.kpis.length / perRow);
    y = ensureSpace(y, rows * 30 + 10);
    sectionTitle(doc, font, margin, y, "Nøkkeltall");
    y += 8;
    y = drawKpiCards(doc, font, margin, y, pageWidth - margin * 2, block.kpis);
    y += 13;
  }

  if (block.chart && block.chart.series.length > 0) {
    const chartHeight = 80;
    y = ensureSpace(y, chartHeight + 18);
    sectionTitle(doc, font, margin, y, block.chart.title);
    y += 7;
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, y, pageWidth - margin * 2, chartHeight, 2, 2, "D");
    const chartArgs = { x: margin, y, width: pageWidth - margin * 2, height: chartHeight, series: block.chart.series };
    if (block.chart.type === "area") drawAreaChart(doc, font, chartArgs);
    else drawBarChart(doc, font, chartArgs);
    y += chartHeight + 13;
  }

  for (const table of block.tables ?? []) {
    y = ensureSpace(y, 24);
    y = drawDataTable(doc, autoTable, font, margin, y, table);
  }

  drawReportFooter(doc, font, margin, pageWidth, pageHeight);

  const safeArea = areaLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  doc.save(`autovere-${safeArea}-${new Date().toISOString().slice(0, 10)}.pdf`);
}
