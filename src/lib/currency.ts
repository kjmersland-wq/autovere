import { BILLING_CURRENCY } from '@/lib/pricing';

export const formatCurrency = (amount: number, locale: string, currency = BILLING_CURRENCY): string =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);

export const formatEurFromCents = (amountCents: number, locale: string): string =>
  formatCurrency(amountCents / 100, locale, BILLING_CURRENCY);
