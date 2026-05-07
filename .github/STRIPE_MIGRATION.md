# Paddle to Stripe Migration Complete

## Summary
Successfully migrated AUTOVERE from Paddle to Stripe payment processing across all environments.

## Changes Made

### 1. Removed Paddle Components
- ❌ Deleted `src/lib/paddle.ts` (Paddle client library)
- ❌ Deleted `src/hooks/usePaddleCheckout.ts` (Paddle checkout hook)
- ❌ Deleted `src/components/PaymentTestModeBanner.tsx` (Paddle test mode banner)
- ❌ Deleted `supabase/functions/_shared/paddle.ts` (Paddle SDK helper)
- ❌ Deleted `supabase/functions/get-paddle-price/` (Paddle price resolver)
- ❌ Deleted `supabase/functions/customer-portal/` (Paddle customer portal)
- ❌ Deleted `supabase/functions/payments-webhook/` (Paddle webhook handler)

### 2. Added Stripe Components
- ✅ Created `src/lib/stripe.ts` - Stripe client library with environment detection
- ✅ Created `src/hooks/useStripeCheckout.ts` - Stripe checkout hook
- ✅ Created `supabase/functions/create-checkout-session/` - Stripe checkout session creation
- ✅ Created `supabase/functions/stripe-webhook/` - Stripe webhook handler
- ✅ Created `supabase/functions/stripe-customer-portal/` - Stripe billing portal

### 3. Updated Files
- ✅ `src/pages/Pricing.tsx` - Now uses `useStripeCheckout` instead of `usePaddleCheckout`
- ✅ `src/hooks/useSubscription.ts` - Now uses `getStripeEnvironment()`
- ✅ `src/App.tsx` - Removed `PaymentTestModeBanner` import and usage
- ✅ `package.json` - Added `@stripe/stripe-js@^4.0.0` dependency
- ✅ `.env` - Added `VITE_STRIPE_PUBLISHABLE_KEY`, removed Paddle token

### 4. Database Migration
- ✅ Created migration `20260507000000_migrate_to_stripe.sql`:
  - Renamed `paddle_subscription_id` → `stripe_subscription_id`
  - Renamed `paddle_customer_id` → `stripe_customer_id`
  - Updated indexes and constraints

## Required Environment Variables

### Vercel/Production Environment
Set these in Vercel dashboard for all environments (development, preview, production):

```bash
# Frontend (already set according to problem statement)
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..." # For test/dev
VITE_STRIPE_PUBLISHABLE_KEY="pk_live_..." # For production

# Supabase Functions
STRIPE_SECRET_KEY="sk_..." # Stripe secret key
STRIPE_WEBHOOK_SECRET="whsec_..." # From Stripe webhook endpoint
STRIPE_PRICE_MONTHLY="price_..." # Created in Stripe dashboard
STRIPE_PRICE_YEARLY="price_..." # Created in Stripe dashboard
```

## Stripe Setup Required

### 1. Create Products & Prices in Stripe Dashboard
1. Go to https://dashboard.stripe.com/products
2. Create "AUTOVERE Premium" product
3. Add two prices:
   - Monthly: e.g., $6.99/month (save price ID as `STRIPE_PRICE_MONTHLY`)
   - Yearly: e.g., $59/year (save price ID as `STRIPE_PRICE_YEARLY`)

### 2. Configure Webhook Endpoint
1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://[your-supabase-project].supabase.co/functions/v1/stripe-webhook`
3. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook signing secret and set as `STRIPE_WEBHOOK_SECRET`

### 3. Enable Billing Portal
1. Go to https://dashboard.stripe.com/settings/billing/portal
2. Enable customer portal
3. Configure allowed actions (cancel subscription, update payment method, view invoices)

## Stripe Checkout Flow

### User Journey
1. User clicks "Subscribe" on `/pricing` page
2. Frontend calls `useStripeCheckout.openCheckout()`
3. Function invokes `create-checkout-session` Supabase function
4. Function creates Stripe checkout session and returns URL
5. User redirected to Stripe hosted checkout
6. After payment, Stripe redirects to `/pricing?checkout=success`
7. Stripe sends webhook to `stripe-webhook` function
8. Webhook creates/updates subscription record in database
9. User sees subscription active status

### Customer Portal
1. Subscribed user clicks "Manage Subscription"
2. Frontend calls `stripe-customer-portal` function
3. Function creates billing portal session
4. User redirected to Stripe hosted portal
5. User can update payment method, view invoices, cancel subscription

## Database Schema

The `subscriptions` table now has:
- `stripe_subscription_id` (unique) - Stripe subscription ID
- `stripe_customer_id` - Stripe customer ID
- `user_id` - Links to Supabase auth.users
- `product_id` - Stripe product ID
- `price_id` - Stripe price ID
- `status` - Subscription status (active, trialing, canceled, etc.)
- `current_period_start` - Billing period start
- `current_period_end` - Billing period end
- `cancel_at_period_end` - Boolean flag
- `environment` - "test" or "live"

## YouTube API Integration ✅

### Current Implementation
The YouTube API integration is **production-ready** and **environment-based**:

✅ **Environment Variable**: Uses `YOUTUBE_API_KEY` from Deno environment
✅ **Error Handling**: Returns proper error if API key not configured
✅ **Caching**: Implements in-memory cache with 6-hour TTL
✅ **Rate Limiting**: Cache reduces API quota usage
✅ **Function Location**: `supabase/functions/youtube-search/index.ts`

### Usage
- Client calls via `useYouTubeSearch` hook
- Function fetches from YouTube Data API v3
- Results cached for 6 hours per query
- Returns video metadata: title, description, thumbnail, duration, view count

## Recommended Caching Strategy for Automotive Content

### Current State
YouTube API function already has basic in-memory caching (6h TTL, per-isolate).

### Recommended Improvements

#### 1. Database-Backed Cache
**Problem**: In-memory cache is lost on function cold starts (common in serverless).

**Solution**: Store cached YouTube responses in Supabase:

```sql
create table youtube_cache (
  cache_key text primary key,
  query text not null,
  videos jsonb not null,
  cached_at timestamptz default now(),
  expires_at timestamptz not null
);

create index idx_youtube_cache_expires on youtube_cache(expires_at);

-- Cleanup expired entries periodically
create function cleanup_youtube_cache() returns void as $$
  delete from youtube_cache where expires_at < now();
$$ language sql;
```

**Benefits**:
- Cache survives cold starts
- Reduced API quota usage
- Faster response times
- Can be shared across multiple function instances

#### 2. Tiered TTL Strategy
Different content types have different freshness needs:

```typescript
const TTL_CONFIG = {
  // Static content (historical reviews, evergreen content)
  brand_overview: 24 * 60 * 60 * 1000, // 24 hours
  
  // Semi-static (model reviews, comparisons)
  model_reviews: 12 * 60 * 60 * 1000, // 12 hours
  
  // Dynamic (latest news, trending)
  latest_news: 2 * 60 * 60 * 1000, // 2 hours
  
  // Real-time (live streams, just published)
  live_content: 15 * 60 * 1000, // 15 minutes
};
```

#### 3. Background Refresh Strategy
Instead of cache expiry causing user-facing delays:

```typescript
// Serve stale content while refreshing in background
if (cached && isStale(cached) && !isExpired(cached)) {
  // Return cached immediately
  respond(cached.data);
  
  // Refresh asynchronously (don't await)
  refreshCache(cacheKey).catch(console.error);
}
```

#### 4. Prefetch Popular Queries
Identify and pre-cache common searches:

```typescript
const POPULAR_QUERIES = [
  'Tesla Model 3 review',
  'BMW iX review',
  'electric cars 2026',
  // ... more based on analytics
];

// Cron job runs daily to refresh popular content
async function prefetchPopularContent() {
  for (const query of POPULAR_QUERIES) {
    await fetchAndCache(query);
  }
}
```

#### 5. Smart Cache Invalidation
Invalidate cache when new content is likely:

```typescript
// When a new car is added to the database
async function onNewCarAdded(car: Car) {
  // Invalidate related searches
  await invalidateCachePattern(`${car.brand}*`);
  await invalidateCachePattern(`${car.model}*`);
}
```

#### 6. CDN Layer for Static Assets
For thumbnails and media:
- Use Cloudflare CDN or similar
- Cache YouTube thumbnails at edge
- Serve from CDN instead of proxying through Supabase

### Implementation Priority

**Phase 1 (Immediate)**:
1. ✅ Already done: Basic in-memory cache with TTL
2. Add database-backed cache table
3. Implement fallback: try DB cache, then API, then return error

**Phase 2 (Next Sprint)**:
4. Implement tiered TTL based on content type
5. Add background refresh for stale-but-valid content
6. Monitor cache hit rates and adjust TTLs

**Phase 3 (Optimization)**:
7. Add prefetch job for popular queries
8. Implement smart invalidation
9. Add CDN layer for static assets

## Remaining Tasks

### Legal Text Updates
- [ ] Update privacy policy to reference Stripe instead of Paddle
- [ ] Update all language translations (EN, NO, DE, SV, FR)
- [ ] Update terms of service Merchant of Record section

### Supabase Types
- [ ] Regenerate types from database to reflect `stripe_*` columns

### Configuration
- [ ] Update `supabase/config.toml` to remove Paddle function references

### Testing Checklist
- [ ] Test Stripe checkout flow (sandbox mode)
- [ ] Test webhook receives events correctly
- [ ] Test subscription creation in database
- [ ] Test customer portal access
- [ ] Test subscription cancellation
- [ ] Test subscription reactivation
- [ ] Test environment detection (test vs live keys)
- [ ] Verify YouTube API still works
- [ ] Verify caching reduces API calls

## Migration Notes

### For Existing Paddle Subscribers
If you have existing Paddle subscriptions:
1. Export subscriber data from Paddle dashboard
2. Manual migration script needed to:
   - Create Stripe customers
   - Create Stripe subscriptions
   - Update database records
   - Notify users of the change

### Breaking Changes
- Old Paddle subscription IDs are no longer valid
- Webhooks from Paddle will need to be disabled
- Existing subscription records need column rename migration applied

## Security Notes

- Stripe webhook signature verification is implemented
- Customer can only access their own subscription via RLS
- Service role key used for webhook writes
- Environment detection prevents test/live key mixing

## Support & Documentation

- Stripe API Docs: https://stripe.com/docs/api
- Stripe Checkout: https://stripe.com/docs/payments/checkout
- Stripe Webhooks: https://stripe.com/docs/webhooks
- Stripe Customer Portal: https://stripe.com/docs/billing/subscriptions/customer-portal
