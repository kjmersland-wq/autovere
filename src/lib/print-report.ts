export type PrintSection = { heading: string; rows: { label: string; value: string }[] };

export type PrintReport = {
  title: string;
  subtitle?: string | undefined;
  generatedAtLabel: string;
  sections: PrintSection[];
  disclaimer: string;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

export function openPrintReport(report: PrintReport): void {
  const win = window.open("", "_blank", "noopener,noreferrer,width=900,height=1100");
  if (!win) return;

  const sectionsHtml = report.sections
    .map(
      (section) => `
        <section class="card">
          <h2>${escapeHtml(section.heading)}</h2>
          <table>
            ${section.rows.map((row) => `<tr><th>${escapeHtml(row.label)}</th><td>${escapeHtml(row.value)}</td></tr>`).join("")}
          </table>
        </section>`,
    )
    .join("");

  win.document.open();
  win.document.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(report.title)}</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Arial, sans-serif; color: #172033; margin: 0; padding: 0; background: #fff; }
  header { display: flex; align-items: baseline; justify-content: space-between; border-bottom: 2px solid #172033; padding-bottom: 12px; margin-bottom: 18px; }
  .brand { font-size: 13px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: #b45309; }
  h1 { font-size: 22px; margin: 4px 0 2px; }
  .subtitle { color: #555; font-size: 13px; margin: 0; }
  .meta { text-align: right; font-size: 11px; color: #666; }
  .card { break-inside: avoid; page-break-inside: avoid; border: 1px solid #d9dde3; border-radius: 8px; padding: 14px 16px; margin-bottom: 14px; }
  .card h2 { font-size: 14px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.05em; color: #172033; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  tr { border-bottom: 1px solid #eef0f3; }
  tr:last-child { border-bottom: none; }
  th, td { text-align: left; padding: 5px 0; font-weight: 400; }
  th { color: #555; width: 45%; }
  td { font-weight: 600; text-align: right; }
  footer { margin-top: 20px; font-size: 10px; color: #888; line-height: 1.5; border-top: 1px solid #eef0f3; padding-top: 10px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
  <header>
    <div>
      <div class="brand">AutoVere</div>
      <h1>${escapeHtml(report.title)}</h1>
      ${report.subtitle ? `<p class="subtitle">${escapeHtml(report.subtitle)}</p>` : ""}
    </div>
    <div class="meta">${escapeHtml(report.generatedAtLabel)}</div>
  </header>
  ${sectionsHtml}
  <footer>${escapeHtml(report.disclaimer)}</footer>
</body>
</html>`);
  win.document.close();
  win.focus();
  win.setTimeout(() => win.print(), 250);
}
