import type { AreaAnalysis, Finding } from "@/components/admin/analysis/analysisReport";
import type { ReportSummary } from "@/components/admin/analysis/analysisPresentation";
import type { AdminCurrency } from "@/components/admin/adminFormat";
import { createPdfDoc, pdfLibsPromise } from "@/components/admin/pdf/pdfDoc";

const BRAND_AMBER: [number, number, number] = [245, 158, 11];
const INK: [number, number, number] = [17, 24, 39];
const MUTED: [number, number, number] = [107, 114, 128];
const EMERALD: [number, number, number] = [5, 150, 105];
const RED: [number, number, number] = [185, 28, 28];

export type AnalysisPdfSummary = ReportSummary & {
  unusualChanges: Finding[];
  followUps: Finding[];
  overallConclusion: string;
};

export type AnalysisPdfInput = {
  scopeLabel: string;
  currency: AdminCurrency;
  generatedAtLabel: string;
  areas: AreaAnalysis[];
  /** Present only for the "Samlet analyse" export — adds the executive
   * summary blocks (main conclusion, positive findings, follow-ups). */
  summary: AnalysisPdfSummary | null;
};

export async function generateAnalysisPdf({ scopeLabel, currency, generatedAtLabel, areas, summary }: AnalysisPdfInput) {
  const [[{ jsPDF }, { autoTable }]] = await Promise.all([pdfLibsPromise]);
  const { doc, font } = await createPdfDoc(jsPDF);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 20) {
      doc.addPage();
      y = margin;
    }
  };

  // Cover / header
  doc.setTextColor(...BRAND_AMBER);
  doc.setFont(font, "bold");
  doc.setFontSize(11);
  doc.text("AUTOVERE", margin, y);
  y += 9;

  doc.setTextColor(...INK);
  doc.setFontSize(21);
  doc.text(summary ? "Samlet analyse — eierrapport" : `Analyse — ${scopeLabel}`, margin, y);
  y += 8;

  doc.setFont(font, "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("Regelbasert analyse — faste beregninger og terskelverdier, ingen AI.", margin, y);
  y += 5;
  doc.text(`Periode: Trafikk/nettsteder siste 7/30/90 dager · Abonnement siste 12 måneder · øvrig som øyeblikksbilde`, margin, y);
  y += 5;
  doc.text(`Valuta: ${currency}  ·  Generert: ${generatedAtLabel}`, margin, y);
  y += 10;

  const writeSectionTitle = (title: string, accent: [number, number, number]) => {
    ensureSpace(12);
    doc.setFillColor(...accent);
    doc.rect(margin, y - 4, 3, 6, "F");
    doc.setFont(font, "bold");
    doc.setFontSize(12);
    doc.setTextColor(...INK);
    doc.text(title, margin + 6, y);
    y += 7;
  };

  const writeFindingsTable = (findings: Finding[]) => {
    ensureSpace(16);
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Konklusjon", "Målt", "Anbefaling"]],
      body:
        findings.length > 0
          ? findings.map((f) => [f.headline, f.metric ?? "—", f.recommendation ?? "—"])
          : [["Ingen funn.", "", ""]],
      theme: "striped",
      headStyles: { font, fillColor: INK },
      styles: { font, fontSize: 8.5, cellWidth: "wrap" },
      columnStyles: { 0: { cellWidth: 65 }, 1: { cellWidth: 45 } },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
  };

  const writeNotes = (notes: string[]) => {
    if (notes.length === 0) return;
    doc.setFont(font, "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    for (const note of notes) {
      const lines = doc.splitTextToSize(`• ${note}`, pageWidth - margin * 2) as string[];
      ensureSpace(lines.length * 4.2 + 2);
      doc.text(lines, margin, y);
      y += lines.length * 4.2 + 1.5;
    }
    y += 4;
  };

  if (summary) {
    // Hovedkonklusjon
    writeSectionTitle("Hovedkonklusjon", BRAND_AMBER);
    doc.setFont(font, "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...INK);
    const conclusionLines = doc.splitTextToSize(summary.overallConclusion, pageWidth - margin * 2) as string[];
    ensureSpace(conclusionLines.length * 5 + 4);
    doc.text(conclusionLines, margin, y);
    y += conclusionLines.length * 5 + 4;

    doc.setFont(font, "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(`Samlet status: ${summary.statusLabel}  ·  Datagrunnlag: ${summary.dataQualityLabel}`, margin, y);
    y += 10;

    const positiveFindings = areas.flatMap((a) => a.findings).filter((f) => f.severity === "positive");
    writeSectionTitle("Det som går bra", EMERALD);
    writeFindingsTable(positiveFindings);

    writeSectionTitle("Bør følges opp", RED);
    writeFindingsTable(summary.followUps);
  }

  for (const area of areas) {
    writeSectionTitle(area.title, BRAND_AMBER);
    writeFindingsTable(area.findings);
    writeNotes(area.insufficientNotes);
  }

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
  doc.save(`autovere-analyse-${safeScope}-${new Date().toISOString().slice(0, 10)}.pdf`);
}
