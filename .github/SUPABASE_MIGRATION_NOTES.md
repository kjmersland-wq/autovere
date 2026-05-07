# Supabase Project Migration Notes

## Migration Summary

Successfully migrated from old Supabase project to new instance:
- **Old Project ID**: `rclkavwkjwkfjuiwsmuh`
- **New Project ID**: `tyvbeklusafsdqczdabq`
- **New URL**: `https://tyvbeklusafsdqczdabq.supabase.co`

## Changes Made

### 1. Configuration Files Updated
- ✅ `supabase/config.toml` - Updated project_id
- ✅ `.env` - Updated VITE_SUPABASE_URL and VITE_SUPABASE_PROJECT_ID

### 2. Environment Variables

#### Local Development (.env)
The `.env` file has been updated with the new project ID and URL. However, **the VITE_SUPABASE_PUBLISHABLE_KEY still contains the old project's anon key** and needs to be replaced with the new project's anon key.

To get the new anon key:
1. Go to https://supabase.com/dashboard/project/tyvbeklusafsdqczdabq/settings/api
2. Copy the "anon public" key
3. Replace the value in `.env` for `VITE_SUPABASE_PUBLISHABLE_KEY`

#### Vercel Deployment
The problem statement mentions these environment variables are configured in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Note**: This is a Vite app, not a Next.js app. The environment variables should use the `VITE_` prefix:
- `VITE_SUPABASE_URL` → Set to `https://tyvbeklusafsdqczdabq.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` → Set to the new project's anon key
- For Supabase Functions: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

## Auth & Session Handling Audit

### Implementation Details
✅ **Auth Configuration** (src/integrations/supabase/client.ts):
- Uses localStorage for session persistence
- Auto-refresh tokens enabled (`autoRefreshToken: true`)
- Persistent sessions enabled (`persistSession: true`)
- All configuration uses environment variables (no hardcoded values)

### Auth Usage Patterns
✅ **Auth flows verified in**:
- `src/pages/Auth.tsx` - Sign in/sign up with email & password
- `src/pages/Pricing.tsx` - User check before payment flow
- `src/hooks/useSubscription.ts` - Real-time subscription sync via auth user ID

### Compatibility
✅ **All auth flows are compatible** with the new Supabase instance:
- No hardcoded project references
- Uses standard Supabase Auth API
- Session management is client-agnostic

## Middleware Audit

❌ **No middleware found** - This is a Vite React app, not a Next.js app.
- No server-side middleware
- All routing handled by react-router-dom
- Auth checks happen client-side in components

## Payment Integration Audit (Paddle, not Stripe)

### Implementation Details
✅ **Payment Provider**: Paddle (not Stripe as mentioned in problem statement)

✅ **Subscription Flow**:
1. User signs in via Supabase Auth
2. Paddle checkout opened with user's email and ID
3. Webhook receives payment events
4. Subscription record created/updated in Supabase `subscriptions` table
5. User ID links subscription to Supabase user

### Supabase Functions
✅ **Payment-related functions** (all use environment variables):
- `payments-webhook` - Handles Paddle webhooks, writes to Supabase
- `customer-portal` - Fetches user subscription from Supabase, opens Paddle portal
- `get-paddle-price` - Resolves price IDs for different environments

### Database Schema
⚠️ **Required**: The `subscriptions` table must exist in the new Supabase project.

### Compatibility
✅ **Payment integration is fully compatible**:
- All Supabase references use environment variables
- No hardcoded project IDs or URLs
- Webhook flow unchanged
- Customer portal flow unchanged

## Required Actions

### 1. Update Environment Variables
- [ ] Get new anon key from new Supabase project
- [ ] Update `.env` with new `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] Update Vercel environment variables:
  - `VITE_SUPABASE_URL` = `https://tyvbeklusafsdqczdabq.supabase.co`
  - `VITE_SUPABASE_PUBLISHABLE_KEY` = [new anon key]
  - `SUPABASE_URL` = `https://tyvbeklusafsdqczdabq.supabase.co` (for functions)
  - `SUPABASE_ANON_KEY` = [new anon key] (for functions)
  - `SUPABASE_SERVICE_ROLE_KEY` = [new service role key]

### 2. Database Migration
- [ ] Run all migrations in `supabase/migrations/` against the new project
- [ ] Verify `subscriptions` table exists with correct schema
- [ ] Verify RLS policies are configured
- [ ] Test auth flows (sign up, sign in, session persistence)

### 3. Supabase Functions Configuration
- [ ] Deploy all functions from `supabase/functions/` to new project
- [ ] Configure function environment variables

### 4. Paddle Configuration
- [ ] Update Paddle webhook URL to point to new Supabase functions URL:
  - Sandbox: `https://tyvbeklusafsdqczdabq.supabase.co/functions/v1/payments-webhook?env=sandbox`
  - Live: `https://tyvbeklusafsdqczdabq.supabase.co/functions/v1/payments-webhook?env=live`

### 5. Testing Checklist
- [ ] Test user sign up
- [ ] Test user sign in
- [ ] Test session persistence (refresh page)
- [ ] Test subscription creation (sandbox mode)
- [ ] Test subscription webhook processing
- [ ] Test customer portal access

## Additional Notes

### No Changes Needed
- ✅ UI, styling, branding, and copy remain unchanged
- ✅ No hardcoded URLs or project IDs found in codebase
- ✅ All integrations use environment variables
- ✅ Auth flows are fully compatible
- ✅ Payment flows are fully compatible
