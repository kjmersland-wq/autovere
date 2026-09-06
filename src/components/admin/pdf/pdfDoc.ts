import logoUrl from "@/assets/autovere-logo.png";
import robotoRegularUrl from "@/assets/fonts/Roboto-Regular.ttf";
import robotoBoldUrl from "@/assets/fonts/Roboto-Bold.ttf";
import robotoItalicUrl from "@/assets/fonts/Roboto-Italic.ttf";
import notoSansJPRegularUrl from "@/assets/fonts/NotoSansJP-Regular.ttf";
import notoSansJPBoldUrl from "@/assets/fonts/NotoSansJP-Bold.ttf";

/** Every AutoVere Admin PDF export shares this module: the embedded
 * Unicode-safe fonts (Roboto for Latin-script markets — Norwegian, Danish,
 * Swedish, Finnish, German, Dutch, French, Polish, Spanish, Italian,
 * Portuguese — plus Noto Sans JP for Japanese, since Roboto has no CJK
 * glyphs at all), the emoji-stripping text guard, and the AutoVere logo
 * asset. */

export const PDF_FONT_FAMILY = "Roboto";
export const PDF_CJK_FONT_FAMILY = "NotoSansJP";
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
//
// Noto Sans JP is ~5.3MB raw (regular/bold each) — far too large to embed
// wholesale, but jsPDF's Identity-H custom-font path subsets embedded TTFs
// down to only the glyphs a given document actually draws, so the *output*
// PDF only ever contains the handful of Kanji/Hiragana/Katakana characters
// really used (typically just a language/market name) — the raw font size
// has no bearing on final file size. It's always loaded alongside Roboto
// (rather than only when Japanese content is detected) so there is no
// "did we correctly predict this document needs it" edge case: every PDF
// export can safely mix Japanese with any other market's text.
const fontsPromise = Promise.all([
  fetchBase64(robotoRegularUrl),
  fetchBase64(robotoBoldUrl),
  fetchBase64(robotoItalicUrl),
]);
const cjkFontsPromise = Promise.all([fetchBase64(notoSansJPRegularUrl), fetchBase64(notoSansJPBoldUrl)]);
export const logoPromise = loadLogoDataUrl();
export const pdfLibsPromise = Promise.all([import("jspdf"), import("jspdf-autotable")]);

/** Strips emoji/pictographs (flags, symbols, ZWJ sequences) before text
 * reaches jsPDF. The embedded fonts have no emoji glyphs, and feeding an
 * unmapped astral codepoint through jsPDF's Identity-H TTF path is exactly
 * what produced the "Ø<Ýø…" corruption in country/language names (e.g.
 * adminFormat.ts's COUNTRY_NO literally stores "🇸🇪 Sverige"). Rather than
 * risk any font/engine ever mis-rendering those, the emoji is removed
 * outright — plain text (incl. æøåÆØÅ and every other diacritic AutoVere's
 * markets use, and Japanese Kanji/Hiragana/Katakana) is untouched and
 * renders correctly. */
const EMOJI_RE = /[\p{Extended_Pictographic}\p{Regional_Indicator}\u{FE0F}\u{200D}]/gu;
export function pdfSafeText(text: string): string {
  return text.replace(EMOJI_RE, "").replace(/[ \t]{2,}/g, " ").trim();
}

/** Hiragana, Katakana, CJK Unified Ideographs (Kanji) + extensions, CJK
 * punctuation/symbols, fullwidth forms. Matches any string that needs the
 * CJK font instead of (or as well as) the Latin one. */
const CJK_RE = /[　-〿぀-ヿㇰ-ㇿ㐀-䶿一-鿿豈-﫿＀-￯]/;
function hasCjk(text: string | string[]): boolean {
  return Array.isArray(text) ? text.some((t) => CJK_RE.test(t)) : CJK_RE.test(text);
}

export type PdfDoc = { doc: import("jspdf").jsPDF; font: string; logoDataUrl: string | null };

/** Creates a jsPDF document with the embedded Unicode-safe fonts registered
 * — Roboto as the default (falling back to the standard "helvetica" only if
 * the font asset genuinely failed to load) plus Noto Sans JP registered
 * alongside it — and every text draw / width measurement / line-wrap call
 * (including jspdf-autotable's own cell rendering, which goes through this
 * same instance) automatically passed through pdfSafeText, with Japanese
 * text automatically and transparently rendered in the CJK font instead of
 * the active Latin one. Callers never need to know or choose which font a
 * given string needs. */
export async function createPdfDoc(jsPDFCtor: typeof import("jspdf").jsPDF): Promise<PdfDoc> {
  const [[regular, bold, italic], [cjkRegular, cjkBold], logoDataUrl] = await Promise.all([
    fontsPromise,
    cjkFontsPromise,
    logoPromise,
  ]);
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

  const cjkFont = cjkRegular && cjkBold ? PDF_CJK_FONT_FAMILY : null;
  if (cjkFont) {
    doc.addFileToVFS("NotoSansJP-Regular.ttf", cjkRegular!);
    doc.addFont("NotoSansJP-Regular.ttf", PDF_CJK_FONT_FAMILY, "normal");
    doc.addFileToVFS("NotoSansJP-Bold.ttf", cjkBold!);
    doc.addFont("NotoSansJP-Bold.ttf", PDF_CJK_FONT_FAMILY, "bold");
  }

  // Track the caller's last-requested Latin style/family so the CJK
  // auto-switch below can restore it exactly (bold stays bold, etc.) after
  // temporarily swapping fonts for a Japanese string.
  let currentFamily = font;
  let currentStyle = "normal";
  const originalSetFont = doc.setFont.bind(doc);
  doc.setFont = ((family: string, style?: string) => {
    if (family !== PDF_CJK_FONT_FAMILY) {
      currentFamily = family;
      currentStyle = style ?? "normal";
    }
    return originalSetFont(family, style);
  }) as typeof doc.setFont;

  function withCjkFontIfNeeded<T>(text: string | string[], run: () => T): T {
    if (!cjkFont || !hasCjk(text)) return run();
    originalSetFont(cjkFont, currentStyle === "bold" ? "bold" : "normal");
    const result = run();
    originalSetFont(currentFamily, currentStyle);
    return result;
  }

  const originalText = doc.text.bind(doc);
  doc.text = ((text: string | string[], x: number, y: number, options?: unknown, transform?: unknown) => {
    const safe = Array.isArray(text) ? text.map(pdfSafeText) : pdfSafeText(text);
    return withCjkFontIfNeeded(safe, () => originalText(safe as never, x, y, options as never, transform as never));
  }) as typeof doc.text;

  const originalGetTextWidth = doc.getTextWidth.bind(doc);
  doc.getTextWidth = ((text: string) => withCjkFontIfNeeded(text, () => originalGetTextWidth(text))) as typeof doc.getTextWidth;

  const originalSplitTextToSize = doc.splitTextToSize.bind(doc);
  doc.splitTextToSize = ((text: string, maxlen: number, options?: unknown) =>
    withCjkFontIfNeeded(text, () => originalSplitTextToSize(text, maxlen, options))) as typeof doc.splitTextToSize;

  return { doc, font, logoDataUrl };
}
