// Tell Bing, Yandex, Seznam and Naver (via IndexNow) that the site changed.
// Run after a deploy: `npm run indexnow` (all sitemap URLs) or
// `npm run indexnow -- /no/routes/oslo-bergen /pricing` (just those paths).
const HOST = "www.autovere.com";
const KEY = "cd20486a91062497d7aaa10cf9837766"; // served from public/<KEY>.txt

const paths = process.argv.slice(2);
let urls = paths.map((p) => `https://${HOST}${p.startsWith("/") ? p : `/${p}`}`);
if (!urls.length) {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  urls = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]))];
}

// IndexNow accepts up to 10,000 URLs per request.
for (let i = 0; i < urls.length; i += 10_000) {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls.slice(i, i + 10_000) }),
  });
  console.log(`IndexNow: ${res.status} ${res.statusText} (${Math.min(urls.length - i, 10_000)} URLs)`);
}
