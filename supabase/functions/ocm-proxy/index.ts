import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const apiKey = Deno.env.get('OPENCHARGEMAP_API_KEY')
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'OPENCHARGEMAP_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const url = new URL(req.url)
    const params = new URLSearchParams(url.search)
    params.set('output', 'json')
    params.set('compact', 'true')
    params.set('verbose', 'false')
    if (!params.has('maxresults')) params.set('maxresults', '1500')
    params.set('key', apiKey)

    const ocmUrl = `https://api.openchargemap.io/v3/poi?${params.toString()}`
    const r = await fetch(ocmUrl, { headers: { 'X-API-Key': apiKey } })
    const body = await r.text()
    return new Response(body, {
      status: r.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
