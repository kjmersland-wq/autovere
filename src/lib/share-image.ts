export type ShareCard = {
  title: string;
  total: string;
  detail: string;
  perPerson?: string | null;
};

/** Draws a 1200×630 card with this trip's own price, in the browser — no server needed. */
export async function renderShareCard(card: ShareCard): Promise<Blob | null> {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const x = canvas.getContext("2d");
  if (!x) return null;
  const font = (w: number, px: number) => `${w} ${px}px system-ui, "Segoe UI", Arial, sans-serif`;
  const g = x.createLinearGradient(0, 0, 1200, 630);
  g.addColorStop(0, "#0b1220");
  g.addColorStop(1, "#16223b");
  x.fillStyle = g;
  x.fillRect(0, 0, 1200, 630);
  x.fillStyle = "#fcd34d";
  x.fillRect(64, 64, 64, 6);
  x.font = font(600, 28);
  x.fillText("AUTOVERE", 64, 120);
  let px = 80;
  x.font = font(700, px);
  while (x.measureText(card.title).width > 1070 && px > 36) {
    px -= 4;
    x.font = font(700, px);
  }
  x.fillStyle = "#f8fafc";
  x.fillText(card.title, 64, 240);
  x.fillStyle = "#fcd34d";
  x.font = font(700, 150);
  x.fillText(card.total, 64, 430);
  x.fillStyle = "#94a3b8";
  x.font = font(500, 34);
  x.fillText(card.perPerson ? `${card.detail} · ${card.perPerson}` : card.detail, 64, 500);
  x.fillStyle = "#64748b";
  x.font = font(500, 26);
  x.fillText("Tolls, ferries and fuel or charging · autovere.com", 64, 580);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
}
