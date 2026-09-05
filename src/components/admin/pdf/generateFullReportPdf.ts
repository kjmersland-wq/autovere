import {
  ACCENT,
  BORDER,
  INK,
  drawAreaChart,
  drawBarChart,
  drawDataTable,
  drawKpiCards,
  drawReportFooter,
  drawReportHeader,
  sectionTitle,
  type AreaPdfTable,
  type ChartSeriesPoint,
} from "@/components/admin/pdf/generateAreaDataPdf";
import { createPdfDoc, pdfLibsPromise } from "@/components/admin/pdf/pdfDoc";

export type FullReportSection = {
  title: string;
  kpis?: { label: string; value: string }[];
  chart?: { title: string; type: "area" | "bar"; series: ChartSeriesPoint[] };
  tables?: AreaPdfTable[];
};

export type FullReportInput = {
  periodLabel: string;
  generatedAtLabel: string;
  executiveKpis: { label: string; value: string }[];
  executiveConclusion: string;
  sections: FullReportSection[];
};

/** One consolidated, premium PDF spanning every Admin section (Oversikt,
 * Trafikk, Markeder, Abonnement, Økonomi, Analyse, Rapporter) — an executive
 * summary page followed by one detailed page per section, all drawn with
 * the exact same design system (header, KPI cards, vector charts, tables,
 * footer) as the individual per-tab exports, via the shared primitives in
 * generateAreaDataPdf.ts. No new data, no new calculations — this only
 * assembles what each section's own export already shows into one document. */
export async function generateFullReportPdf({
  periodLabel,
  generatedAtLabel,
  executiveKpis,
  executiveConclusion,
  sections,
}: FullReportInput) {
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

  // ---- Page 1: Executive Summary ----
  let y = drawReportHeader(doc, font, {
    pageWidth,
    margin,
    logoDataUrl,
    areaLabel: "Komplett rapport",
    periodLabel,
    generatedAtLabel,
  });

  sectionTitle(doc, font, margin, y, "Executive Summary");
  y += 8;
  if (executiveKpis.length > 0) {
    y = drawKpiCards(doc, font, margin, y, pageWidth - margin * 2, executiveKpis);
    y += 12;
  }

  if (executiveConclusion) {
    y = ensureSpace(y, 20);
    doc.setFont(font, "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...INK);
    const lines = doc.splitTextToSize(executiveConclusion, pageWidth - margin * 2) as string[];
    y = ensureSpace(y, lines.length * 5.2 + 6);
    doc.text(lines, margin, y);
    y += lines.length * 5.2 + 6;
  }

  // A one-line index of what follows, so the executive summary page also
  // orients the reader to the rest of the document.
  if (sections.length > 0) {
    y = ensureSpace(y, 14);
    doc.setFont(font, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...INK);
    doc.text(`Detaljerte seksjoner: ${sections.map((s) => s.title).join(" · ")}`, margin, y);
  }

  // ---- Detailed sections, one per page ----
  for (const section of sections) {
    doc.addPage();
    y = margin;

    doc.setFillColor(...ACCENT);
    doc.rect(margin, y, 16, 1.6, "F");
    y += 8;
    doc.setFont(font, "bold");
    doc.setFontSize(19);
    doc.setTextColor(...INK);
    doc.setCharSpace(0.1);
    doc.text(section.title, margin, y);
    doc.setCharSpace(0);
    y += 14;

    if (section.kpis && section.kpis.length > 0) {
      const perRow = section.kpis.length <= 4 ? section.kpis.length : section.kpis.length === 5 ? 3 : 4;
      const rows = Math.ceil(section.kpis.length / perRow);
      y = ensureSpace(y, rows * 30 + 10);
      sectionTitle(doc, font, margin, y, "Nøkkeltall");
      y += 8;
      y = drawKpiCards(doc, font, margin, y, pageWidth - margin * 2, section.kpis);
      y += 13;
    }

    if (section.chart && section.chart.series.length > 0) {
      const chartHeight = 78;
      y = ensureSpace(y, chartHeight + 18);
      sectionTitle(doc, font, margin, y, section.chart.title);
      y += 7;
      doc.setDrawColor(...BORDER);
      doc.setLineWidth(0.2);
      doc.roundedRect(margin, y, pageWidth - margin * 2, chartHeight, 2, 2, "D");
      const chartArgs = {
        x: margin,
        y,
        width: pageWidth - margin * 2,
        height: chartHeight,
        series: section.chart.series,
      };
      if (section.chart.type === "area") drawAreaChart(doc, font, chartArgs);
      else drawBarChart(doc, font, chartArgs);
      y += chartHeight + 13;
    }

    for (const table of section.tables ?? []) {
      y = ensureSpace(y, 24);
      y = drawDataTable(doc, autoTable, font, margin, y, table);
    }
  }

  drawReportFooter(doc, font, margin, pageWidth, pageHeight);
  doc.save(`autovere-komplett-rapport-${new Date().toISOString().slice(0, 10)}.pdf`);
}
