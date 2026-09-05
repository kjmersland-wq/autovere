import logoUrl from "@/assets/autovere-logo.png";
import robotoRegularUrl from "@/assets/fonts/Roboto-Regular.ttf";
import robotoBoldUrl from "@/assets/fonts/Roboto-Bold.ttf";
import robotoItalicUrl from "@/assets/fonts/Roboto-Italic.ttf";

/** Every AutoVere Admin PDF export shares this module: the embedded
 * Unicode-safe font (so Norwegian/Danish/Swedish/Finnish/German/Dutch/
 * French/Polish/Spanish/Italian names all render correctly, not just the
 * WinAnsi-encoded "helvetica" base-14 font jsPDF defaults to), the
 * emoji-stripping text guard, and the AutoVere logo asset. */

export const PDF_FONT_FAMILY = "Roboto";
const LOGO_EXPORT_SIZE = 160; // px — the source asset is 1024×1024; PDFs only ever show it at ~13mm.

async function fetchBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
  } catch {
    return null; // a fetch hiccup must never block a PDF export
  }
}

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
    return null;
  }
}

// Started as soon as this module is imported (not when a button is
// clicked) — see generateAreaDataPdf.ts for why: warming heavy/network
// assets before the click keeps the browser's click-to-download window
// from expiring while jsPDF/autotable/fonts/logo are still loading.
const fontsPromise = Promise.all([
  fetchBase64(robotoRegularUrl),
  fetchBase64(robotoBoldUrl),
  fetchBase64(robotoItalicUrl),
]);
export const logoPromise = loadLogoDataUrl();
export const pdfLibsPromise = Promise.all([import("jspdf"), import("jspdf-autotable")]);

/** Strips emoji/pictographs (flags, symbols, ZWJ sequences) before text
 * reaches jsPDF. The embedded Roboto subset has no emoji glyphs, and
 * feeding an unmapped astral codepoint through jsPDF's Identity-H TTF path
 * is exactly what produced the "Ø<Ýø…" corruption in country/language
 * names (e.g. adminFormat.ts's COUNTRY_NO literally stores "🇸🇪 Sverige").
 * Rather than risk any font/engine ever mis-rendering those, the emoji is
 * removed outright — plain Latin text (incl. æøåÆØÅ and all the other
 * diacritics AutoVere's markets use) is untouched and renders correctly. */
const EMOJI_RE = /[\p{Extended_Pictographic}\p{Regional_Indicator}\u{FE0F}\u{200D}]/gu;
export function pdfSafeText(text: string): string {
  return text.replace(EMOJI_RE, "").replace(/[ \t]{2,}/g, " ").trim();
}

export type PdfDoc = { doc: import("jspdf").jsPDF; font: string; logoDataUrl: string | null };

/** Creates a jsPDF document with the embedded Unicode-safe font registered
 * and made the default (falling back to the standard "helvetica" only if
 * the font asset genuinely failed to load), and with every text draw —
 * including jspdf-autotable's own cell rendering, which goes through this
 * same instance — automatically passed through pdfSafeText. */
export async function createPdfDoc(jsPDFCtor: typeof import("jspdf").jsPDF): Promise<PdfDoc> {
  const [[regular, bold, italic], logoDataUrl] = await Promise.all([fontsPromise, logoPromise]);
  const doc = new jsPDFCtor({ unit: "mm", format: "a4" });

  const font = regular && bold && italic ? PDF_FONT_FAMILY : "helvetica";
  if (font === PDF_FONT_FAMILY) {
    doc.addFileToVFS("Roboto-Regular.ttf", regular!);
    doc.addFont("Roboto-Regular.ttf", PDF_FONT_FAMILY, "normal");
    doc.addFileToVFS("Roboto-Bold.ttf", bold!);
    doc.addFont("Roboto-Bold.ttf", PDF_FONT_FAMILY, "bold");
    doc.addFileToVFS("Roboto-Italic.ttf", italic!);
    doc.addFont("Roboto-Italic.ttf", PDF_FONT_FAMILY, "italic");
  }
  doc.setFont(font, "normal");

  const originalText = doc.text.bind(doc);
  doc.text = ((text: string | string[], x: number, y: number, options?: unknown, transform?: unknown) => {
    const safe = Array.isArray(text) ? text.map(pdfSafeText) : pdfSafeText(text);
    return originalText(safe as never, x, y, options as never, transform as never);
  }) as typeof doc.text;

  return { doc, font, logoDataUrl };
}
