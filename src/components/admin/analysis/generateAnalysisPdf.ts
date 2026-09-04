import type { AreaAnalysis, Finding } from "@/components/admin/analysis/analysisReport";

const BRAND_AMBER: [number, number, number] = [245, 158, 11];
const INK: [number, number, number] = [17, 24, 39];
const MUTED: [number, number, number] = [107, 114, 128];

export type AnalysisPdfInput = {
  scopeLabel: string;
  areas: AreaAnalysis[];
  unusualChanges: Finding[];
  followUps: Finding[];
  overallConclusion: string | null;
  generatedAtLabel: string;
};

export async function generateAnalysisPdf({
  scopeLabel,
  areas,
  unusualChanges,
  followUps,
  overallConclusion,
  generatedAtLabel,
}: AnalysisPdfInput) {
  const [{ jsPDF }, { autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
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

  doc.setTextColor(...BRAND_AMBER);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("AUTOVERE", margin, y);
  y += 9;

  doc.setTextColor(...INK);
  doc.setFontSize(20);
  doc.text(`Analyse — ${scopeLabel}`, margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("100 % regelbasert analyse — faste beregninger og terskelverdier, ingen AI.", margin, y);
  y += 5;
  doc.text(`Generert: ${generatedAtLabel}`, margin, y);
  y += 10;

  const writeFindingsTable = (title: string, findings: Finding[]) => {
    ensureSpace(16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...INK);
    doc.text(title, margin, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Funn", "Anbefaling"]],
      body:
        findings.length > 0
          ? findings.map((f) => [f.headline, f.recommendation ?? "—"])
          : [["Ingen funn.", ""]],
      theme: "striped",
      headStyles: { fillColor: BRAND_AMBER, textColor: [255, 255, 255] },
      styles: { fontSize: 9, cellWidth: "wrap" },
      columnStyles: { 0: { cellWidth: 100 } },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
  };

  const writeNotes = (notes: string[]) => {
    if (notes.length === 0) return;
    ensureSpace(6 * notes.length + 6);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    for (const note of notes) {
      const lines = doc.splitTextToSize(`• ${note}`, pageWidth - margin * 2) as string[];
      ensureSpace(lines.length * 4.5);
      doc.text(lines, margin, y);
      y += lines.length * 4.5 + 2;
    }
    y += 4;
  };

  if (overallConclusion) {
    ensureSpace(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...INK);
    doc.text("Samlet konklusjon", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(overallConclusion, pageWidth - margin * 2) as string[];
    doc.text(lines, margin, y);
    y += lines.length * 5 + 8;
  }

  if (unusualChanges.length > 0) writeFindingsTable("Uvanlige endringer", unusualChanges);
  if (followUps.length > 0) writeFindingsTable("Bør følges opp", followUps);

  for (const area of areas) {
    writeFindingsTable(area.title, area.findings);
    writeNotes(area.insufficientNotes);
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...MUTED);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("AutoVere · Konfidensielt eierrapport", margin, pageHeight - 9);
    doc.text(`Side ${i} av ${pageCount}`, pageWidth - margin, pageHeight - 9, { align: "right" });
  }

  const safeScope = scopeLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  doc.save(`autovere-analyse-${safeScope}-${new Date().toISOString().slice(0, 10)}.pdf`);
}
