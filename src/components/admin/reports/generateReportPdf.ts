import type { ReportKpis, ReportPathRow, ReportPlanRow } from "@/components/admin/reports/ReportDocument";
import { convertFromEur } from "@/components/admin/adminCurrency";
import { formatCurrency } from "@/lib/currency";
import type { AdminCurrency } from "@/components/admin/adminFormat";
import type { ExchangeRates } from "@/lib/admin-data.functions";
import { createPdfDoc, pdfLibsPromise } from "@/components/admin/pdf/pdfDoc";

const BRAND_AMBER: [number, number, number] = [245, 158, 11]; // matches the site's existing chart/brand accent (#f59e0b)
const INK: [number, number, number] = [17, 24, 39];
const MUTED: [number, number, number] = [107, 114, 128];

export type ReportPdfInput = {
  container: HTMLElement;
  scopeLabel: string;
  periodLabel: string;
  generatedAtLabel: string;
  headlineViews: number;
  kpis: ReportKpis;
  byPlan: ReportPlanRow[];
  topPaths: ReportPathRow[];
  currency: AdminCurrency;
  rates: ExchangeRates | null;
};

async function captureChart(container: HTMLElement, selector: string, html2canvas: typeof import("html2canvas").default) {
  const node = container.querySelector<HTMLElement>(selector);
  if (!node) return null;
  const canvas = await html2canvas(node, { backgroundColor: "#ffffff", scale: 2 });
  return { dataUrl: canvas.toDataURL("image/png"), width: canvas.width, height: canvas.height };
}

export async function generateReportPdf({
  container,
  scopeLabel,
  periodLabel,
  generatedAtLabel,
  headlineViews,
  kpis,
  byPlan,
  topPaths,
  currency,
  rates,
}: ReportPdfInput) {
  const money = (valueEur: number) => formatCurrency(convertFromEur(valueEur, currency, rates), currency);
  const [[{ jsPDF }, { autoTable }], html2canvasModule] = await Promise.all([pdfLibsPromise, import("html2canvas")]);
  const html2canvas = html2canvasModule.default;

  const { doc, font } = await createPdfDoc(jsPDF);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 20) {
      doc.addPage();
      y = margin;
    }
  };

  // Cover header
  doc.setTextColor(...BRAND_AMBER);
  doc.setFont(font, "bold");
  doc.setFontSize(11);
  doc.text("AUTOVERE", margin, y);
  y += 9;

  doc.setTextColor(...INK);
  doc.setFontSize(22);
  doc.text(`Eierrapport — ${scopeLabel}`, margin, y);
  y += 9;

  doc.setFont(font, "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(`Periode: ${periodLabel}`, margin, y);
  y += 5;
  doc.text(`Generert: ${generatedAtLabel}`, margin, y);
  y += 10;

  // KPI summary table
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Nøkkeltall", "Verdi"]],
    body: [
      [`Besøk i perioden (${scopeLabel})`, new Intl.NumberFormat("nb-NO").format(headlineViews)],
      [
        "Registrerte brukere (globalt)",
        kpis.totalUsers === null ? "Ikke tilgjengelig" : new Intl.NumberFormat("nb-NO").format(kpis.totalUsers),
      ],
      ["Aktive abonnenter (globalt)", new Intl.NumberFormat("nb-NO").format(kpis.activeSubs)],
      [`Månedlig inntekt (globalt, ${currency})`, money(kpis.mrr)],
      ["Churn (globalt)", `${kpis.churnRate} %`],
    ],
    theme: "grid",
    headStyles: { font, fillColor: BRAND_AMBER, textColor: [255, 255, 255] },
    styles: { font, fontSize: 10 },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // Charts (captured from the on-screen preview)
  for (const selector of ['[data-report-chart="traffic"]', '[data-report-chart="revenue"]']) {
    const chart = await captureChart(container, selector, html2canvas);
    if (!chart) continue;
    const imgHeight = (chart.height / chart.width) * contentWidth;
    ensureSpace(imgHeight + 6);
    doc.addImage(chart.dataUrl, "PNG", margin, y, contentWidth, imgHeight);
    y += imgHeight + 10;
  }

  // Subscriptions by plan (global)
  ensureSpace(20);
  doc.setFontSize(12);
  doc.setTextColor(...INK);
  doc.text(`Abonnement per plan (globalt, ${currency})`, margin, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Plan", "Antall", "MRR"]],
    body:
      byPlan.length > 0
        ? byPlan.map((p) => [p.label, new Intl.NumberFormat("nb-NO").format(p.count), money(p.mrr)])
        : [["Ingen aktive abonnement ennå.", "", ""]],
    theme: "striped",
    headStyles: { font, fillColor: INK },
    styles: { font, fontSize: 9 },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // Top paths (scoped)
  ensureSpace(20);
  doc.setFontSize(12);
  doc.text(`Mest besøkte sider — ${scopeLabel}`, margin, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Side", "Besøk"]],
    body:
      topPaths.length > 0
        ? topPaths.map((p) => [p.path, new Intl.NumberFormat("nb-NO").format(p.views)])
        : [["Ingen registrerte besøk ennå.", ""]],
    theme: "striped",
    headStyles: { font, fillColor: INK },
    styles: { font, fontSize: 9 },
  });

  // Header/footer on every page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...MUTED);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
    doc.setFont(font, "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("AutoVere · Konfidensielt eierrapport", margin, pageHeight - 9);
    doc.text(`Side ${i} av ${pageCount}`, pageWidth - margin, pageHeight - 9, { align: "right" });
  }

  const safeScope = scopeLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const filename = `autovere-eierrapport-${safeScope}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
