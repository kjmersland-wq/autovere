import logoUrl from "@/assets/autovere-logo.png";
import robotoRegularUrl from "@/assets/fonts/Roboto-Regular.ttf";
import robotoBoldUrl from "@/assets/fonts/Roboto-Bold.ttf";
import robotoItalicUrl from "@/assets/fonts/Roboto-Italic.ttf";
import notoSansJPRegularUrl from "@/assets/fonts/NotoSansJP-Regular.ttf";
import notoSansJPBoldUrl from "@/assets/fonts/NotoSansJP-Bold.ttf";
import notoSansSCRegularUrl from "@/assets/fonts/NotoSansSC-Regular.ttf";
import notoSansSCBoldUrl from "@/assets/fonts/NotoSansSC-Bold.ttf";

/** Every AutoVere Admin PDF export shares this module: the embedded
 * Unicode-safe fonts (Roboto for Latin-script markets — Norwegian, Danish,
 * Swedish, Finnish, German, Dutch, French, Polish, Spanish, Italian,
 * Portuguese — plus Noto Sans JP for Japanese and Noto Sans SC for
 * Simplified Chinese, since Roboto has no CJK glyphs at all and Japanese/
 * Chinese need genuinely different fonts, not just different text, for
 * correct glyph shapes — see the Han-unification note on SCRIPT_RE below),
 * the emoji-stripping text guard, and the AutoVere logo asset. */

export const PDF_FONT_FAMILY = "Roboto";
export const PDF_JA_FONT_FAMILY = "NotoSansJP";
export const PDF_ZH_FONT_FAMILY = "NotoSansSC";
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
// Noto Sans JP/SC are ~5-10MB raw each — far too large to embed wholesale,
// but jsPDF's Identity-H custom-font path subsets embedded TTFs down to
// only the glyphs a given document actually draws, so the *output* PDF
// only ever contains the handful of Kanji/Hiragana/Katakana/Hanzi
// characters really used (typically just a language/market name) — the
// raw font size has no bearing on final file size. Both are always loaded
// alongside Roboto (rather than only when needed) so there is no "did we
// correctly predict this document needs it" edge case: every PDF export
// can safely mix Japanese, Chinese, and any other market's text.
const fontsPromise = Promise.all([
  fetchBase64(robotoRegularUrl),
  fetchBase64(robotoBoldUrl),
  fetchBase64(robotoItalicUrl),
]);
const jaFontsPromise = Promise.all([fetchBase64(notoSansJPRegularUrl), fetchBase64(notoSansJPBoldUrl)]);
const zhFontsPromise = Promise.all([fetchBase64(notoSansSCRegularUrl), fetchBase64(notoSansSCBoldUrl)]);
export const logoPromise = loadLogoDataUrl();
export const pdfLibsPromise = Promise.all([import("jspdf"), import("jspdf-autotable")]);

/** Strips emoji/pictographs (flags, symbols, ZWJ sequences) before text
 * reaches jsPDF. The embedded fonts have no emoji glyphs, and feeding an
 * unmapped astral codepoint through jsPDF's Identity-H TTF path is exactly
 * what produced the "Ø<Ýø…" corruption in country/language names (e.g.
 * adminFormat.ts's COUNTRY_NO literally stores "🇸🇪 Sverige"). Rather than
 * risk any font/engine ever mis-rendering those, the emoji is removed
 * outright — plain text (incl. æøåÆØÅ and every other diacritic AutoVere's
 * markets use, and Japanese/Chinese script) is untouched and renders
 * correctly. */
const EMOJI_RE = /[\p{Extended_Pictographic}\p{Regional_Indicator}\u{FE0F}\u{200D}]/gu;
export function pdfSafeText(text: string): string {
  return text.replace(EMOJI_RE, "").replace(/[ \t]{2,}/g, " ").trim();
}

/** Hiragana + Katakana (incl. phonetic extensions) — present in essentially
 * all real Japanese text, and absent from Chinese. An unambiguous "this is
 * Japanese" signal. Deliberately excludes U+30FB (KATAKANA MIDDLE DOT, ・):
 * that codepoint sits in the Katakana block but is used as plain separator
 * punctuation in this app's Chinese content too (e.g. "现已开放・海拔2429米"),
 * so including it here misrouted whole Chinese strings to the Japanese font
 * — which lacks glyphs for Simplified-only characters — dropping or
 * corrupting them. */
const KANA_RE = /[぀-ヺー-ヿㇰ-ㇿ]/;
/** CJK Unified Ideographs + extensions + compatibility + fullwidth forms —
 * the Han script block shared by Japanese Kanji and Chinese Hanzi. Unicode
 * gives many (not all) Han characters a single shared codepoint regardless
 * of language ("Han unification"), so the codepoint alone doesn't say which
 * language a pure-Kanji/pure-Hanzi string is in — only which *font* should
 * draw it, since Noto Sans JP and Noto Sans SC render some shared
 * codepoints with different (language-appropriate) glyph shapes. */
const HAN_RE = /[㐀-䶿一-鿿豈-﫿＀-￯]/;
/** The small, fixed set of pure-Kanji Japanese strings this app actually
 * produces that contain no Hiragana/Katakana at all (so KANA_RE alone
 * can't catch them) — e.g. LOCALE_ROUTES' ja label "日本語" is three Kanji
 * with zero kana, and ScenicGuide/content-ja entries like "…開通" and
 * "装備・法定携行品" use 開/備 (Japanese kyūjitai forms, distinct codepoints
 * from Simplified Chinese's 开/备 — never produced by any zh content).
 * These are developer-controlled constants, not arbitrary text, so an
 * explicit allowlist is both correct and sufficient; anything else that's
 * Han-only defaults to the Chinese font. */
const JA_HAN_ONLY_MARKERS = ["日本語", "日本", "開通", "装備"];

type ScriptFont = typeof PDF_JA_FONT_FAMILY | typeof PDF_ZH_FONT_FAMILY | null;
function scriptFontFor(text: string, hasJa: boolean, hasZh: boolean): ScriptFont {
  if (hasJa && (KANA_RE.test(text) || JA_HAN_ONLY_MARKERS.some((m) => text.includes(m)))) return PDF_JA_FONT_FAMILY;
  if (hasZh && HAN_RE.test(text)) return PDF_ZH_FONT_FAMILY;
  if (hasJa && HAN_RE.test(text)) return PDF_JA_FONT_FAMILY; // Han-only text but no Chinese font loaded — still Japanese-capable
  return null;
}
function textNeedsScriptFont(text: string | string[], hasJa: boolean, hasZh: boolean): ScriptFont {
  if (Array.isArray(text)) {
    for (const t of text) {
      const f = scriptFontFor(t, hasJa, hasZh);
      if (f) return f;
    }
    return null;
  }
  return scriptFontFor(text, hasJa, hasZh);
}

export type PdfDoc = { doc: import("jspdf").jsPDF; font: string; logoDataUrl: string | null };

/** Creates a jsPDF document with the embedded Unicode-safe fonts registered
 * — Roboto as the default (falling back to the standard "helvetica" only if
 * the font asset genuinely failed to load) plus Noto Sans JP and Noto Sans
 * SC registered alongside it — and every text draw / width measurement /
 * line-wrap call (including jspdf-autotable's own cell rendering, which
 * goes through this same instance) automatically passed through
 * pdfSafeText, with Japanese or Chinese text automatically and
 * transparently rendered in the correct script font instead of the active
 * Latin one. Callers never need to know or choose which font a given
 * string needs. */
export async function createPdfDoc(jsPDFCtor: typeof import("jspdf").jsPDF): Promise<PdfDoc> {
  const [[regular, bold, italic], [jaRegular, jaBold], [zhRegular, zhBold], logoDataUrl] = await Promise.all([
    fontsPromise,
    jaFontsPromise,
    zhFontsPromise,
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

  const hasJa = !!(jaRegular && jaBold);
  if (hasJa) {
    doc.addFileToVFS("NotoSansJP-Regular.ttf", jaRegular!);
    doc.addFont("NotoSansJP-Regular.ttf", PDF_JA_FONT_FAMILY, "normal");
    doc.addFileToVFS("NotoSansJP-Bold.ttf", jaBold!);
    doc.addFont("NotoSansJP-Bold.ttf", PDF_JA_FONT_FAMILY, "bold");
  }
  const hasZh = !!(zhRegular && zhBold);
  if (hasZh) {
    doc.addFileToVFS("NotoSansSC-Regular.ttf", zhRegular!);
    doc.addFont("NotoSansSC-Regular.ttf", PDF_ZH_FONT_FAMILY, "normal");
    doc.addFileToVFS("NotoSansSC-Bold.ttf", zhBold!);
    doc.addFont("NotoSansSC-Bold.ttf", PDF_ZH_FONT_FAMILY, "bold");
  }

  // Track the caller's last-requested Latin style/family so the script-font
  // auto-switch below can restore it exactly (bold stays bold, etc.) after
  // temporarily swapping fonts for a Japanese/Chinese string.
  let currentFamily = font;
  let currentStyle = "normal";
  const originalSetFont = doc.setFont.bind(doc);
  doc.setFont = ((family: string, style?: string) => {
    if (family !== PDF_JA_FONT_FAMILY && family !== PDF_ZH_FONT_FAMILY) {
      currentFamily = family;
      currentStyle = style ?? "normal";
    }
    return originalSetFont(family, style);
  }) as typeof doc.setFont;

  function withScriptFontIfNeeded<T>(text: string | string[], run: () => T): T {
    const scriptFont = textNeedsScriptFont(text, hasJa, hasZh);
    if (!scriptFont) return run();
    originalSetFont(scriptFont, currentStyle === "bold" ? "bold" : "normal");
    const result = run();
    originalSetFont(currentFamily, currentStyle);
    return result;
  }

  const originalText = doc.text.bind(doc);
  doc.text = ((text: string | string[], x: number, y: number, options?: unknown, transform?: unknown) => {
    const safe = Array.isArray(text) ? text.map(pdfSafeText) : pdfSafeText(text);
    return withScriptFontIfNeeded(safe, () => originalText(safe as never, x, y, options as never, transform as never));
  }) as typeof doc.text;

  const originalGetTextWidth = doc.getTextWidth.bind(doc);
  doc.getTextWidth = ((text: string) => withScriptFontIfNeeded(text, () => originalGetTextWidth(text))) as typeof doc.getTextWidth;

  const originalSplitTextToSize = doc.splitTextToSize.bind(doc);
  doc.splitTextToSize = ((text: string, maxlen: number, options?: unknown) =>
    withScriptFontIfNeeded(text, () => originalSplitTextToSize(text, maxlen, options))) as typeof doc.splitTextToSize;

  return { doc, font, logoDataUrl };
}
