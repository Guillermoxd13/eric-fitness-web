import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const PREMIUM_STATUSES = new Set(["active", "trialing", "past_due"]);

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return NextResponse.json({ error: "Webhook no configurado." }, { status: 400 });
  }

  const raw = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, secret);
  } catch (e) {
    const message = e instanceof Error ? e.message : "signature mismatch";
    return NextResponse.json({ error: `Invalid signature: ${message}` }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  async function applySubscriptionToProfile(sub: Stripe.Subscription, fallbackUserId?: string) {
    const userId = (sub.metadata?.user_id as string | undefined) ?? fallbackUserId;
    if (!userId) {
      console.warn("[stripe webhook] no user_id in subscription metadata", sub.id);
      return;
    }
    // Premium is simply derived from Stripe status; cancel_at_period_end keeps status='active'
    // until the period actually ends, so the user retains access through paid time.
    const isPremium = PREMIUM_STATUSES.has(sub.status);
    const periodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null;

    const update = {
      stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
      stripe_subscription_id: sub.id,
      subscription_status: sub.status,
      current_period_end: periodEnd,
      is_premium: isPremium,
    };
    await (supabase.from("profiles") as unknown as {
      update: (v: typeof update) => {
        eq: (c: string, v: string) => Promise<{ error: unknown }>;
      };
    }).update(update).eq("id", userId);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = (session.client_reference_id ?? session.metadata?.user_id) as string | undefined;
        if (session.subscription && userId) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          await applySubscriptionToProfile(sub, userId);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await applySubscriptionToProfile(sub);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);
          await applySubscriptionToProfile(sub);
        }
        break;
      }
      default:
        // no-op for unhandled events
        break;
    }
  } catch (e) {
    console.error("[stripe webhook] handler error", e);
    return NextResponse.json({ error: "handler_error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
