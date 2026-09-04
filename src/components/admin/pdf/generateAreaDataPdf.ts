const BRAND_AMBER: [number, number, number] = [245, 158, 11];
const INK: [number, number, number] = [17, 24, 39];
const MUTED: [number, number, number] = [107, 114, 128];

export type AreaPdfTable = { title: string; columns: string[]; rows: (string | number)[][] };
export type AreaPdfBlock = { kpis?: { label: string; value: string }[]; tables?: AreaPdfTable[] };

export type AreaDataPdfInput = {
  areaLabel: string;
  block: AreaPdfBlock;
  periodLabel: string;
  generatedAtLabel: string;
};

/** Plain data-dump PDF of one existing Admin tab — no rule evaluation, no
 * recommendations, just the numbers/tables already shown on screen. */
export async function generateAreaDataPdf({ areaLabel, block, periodLabel, generatedAtLabel }: AreaDataPdfInput) {
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
  doc.text(areaLabel, margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(`Periode: ${periodLabel}`, margin, y);
  y += 5;
  doc.text(`Generert: ${generatedAtLabel}`, margin, y);
  y += 10;

  if (block.kpis && block.kpis.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Nøkkeltall", "Verdi"]],
      body: block.kpis.map((k) => [k.label, k.value]),
      theme: "grid",
      headStyles: { fillColor: BRAND_AMBER, textColor: [255, 255, 255] },
      styles: { fontSize: 10 },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
  }

  for (const table of block.tables ?? []) {
    ensureSpace(16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...INK);
    doc.text(table.title, margin, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [table.columns],
      body: table.rows.length > 0 ? table.rows : [table.columns.map(() => "—")],
      theme: "striped",
      headStyles: { fillColor: INK },
      styles: { fontSize: 9 },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...MUTED);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("AutoVere · Konfidensielt", margin, pageHeight - 9);
    doc.text(`Side ${i} av ${pageCount}`, pageWidth - margin, pageHeight - 9, { align: "right" });
  }

  const safeArea = areaLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  doc.save(`autovere-${safeArea}-${new Date().toISOString().slice(0, 10)}.pdf`);
}
