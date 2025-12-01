import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')

  if (!signature) {
    return new Response('Error: missing stripe signature', { status: 400 })
  }

  const body = await req.text()
  let event

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET') as string,
      undefined,
      cryptoProvider
    )
  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object
    const userId = paymentIntent.metadata.user_id

    if (userId) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const { error } = await supabase
        .from('profiles')
        .update({ is_pro: true })
        .eq('id', userId)

      if (error) {
        console.error('Error updating profile:', error)
        return new Response('Error updating profile', { status: 500 })
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})
