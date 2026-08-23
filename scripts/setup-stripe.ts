import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) throw new Error("Set STRIPE_SECRET_KEY before running stripe:setup.");

const stripe = new Stripe(secretKey);
const products = [
  { key: "pro", name: "AUTOVERE Pro", description: "Advanced route planning for European road trips." },
  { key: "business", name: "AUTOVERE Business / Fleet", description: "Route and cost tools for teams and vehicle fleets." },
] as const;

async function findOrCreateProduct(product: (typeof products)[number]) {
  const existing = await stripe.products.search({ query: `metadata[\'autovere_key\']:\'${product.key}\'`, limit: 1 });
  return existing.data[0] ?? stripe.products.create({ name: product.name, description: product.description, metadata: { autovere_key: product.key } });
}

async function findOrCreatePrice(product: Stripe.Product, key: string, unitAmount: number, interval: "month" | "year") {
  const existing = await stripe.prices.search({ query: `metadata[\'autovere_key\']:\'${key}\'`, limit: 1 });
  return existing.data[0] ?? stripe.prices.create({ currency: "eur", unit_amount: unitAmount, recurring: { interval }, product: product.id, metadata: { autovere_key: key } });
}

for (const productDefinition of products) {
  const product = await findOrCreateProduct(productDefinition);
  const monthly = await findOrCreatePrice(product, `${productDefinition.key}-monthly`, productDefinition.key === "pro" ? 900 : 3900, "month");
  const yearly = await findOrCreatePrice(product, `${productDefinition.key}-yearly`, productDefinition.key === "pro" ? 9000 : 39000, "year");
  console.log(`${productDefinition.key}:`);
  console.log(`  ${productDefinition.key.toUpperCase()}_MONTHLY_PRICE_ID=${monthly.id}`);
  console.log(`  ${productDefinition.key.toUpperCase()}_YEARLY_PRICE_ID=${yearly.id}`);
}
