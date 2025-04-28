import { backendClient } from "@/sanity/lib/backendClient";
import stripe from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

interface SessionMetadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing Stripe secret or signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata as unknown as SessionMetadata;

    if (!metadata?.orderNumber || !metadata.customerEmail || !metadata.clerkUserId) {
      console.warn("⚠️ Missing metadata, skipping order creation");
      return NextResponse.json({ received: true });
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });

    const sanityProducts = lineItems.data.map((item) => ({
      _key: crypto.randomUUID(),
      quantity: item.quantity || 1,
      product: {
        _type: "reference",
        _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
      },
    }));

    const order = {
      _type: "order",
      orderNumber: metadata.orderNumber,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
      customerName: metadata.customerName,
      email: metadata.customerEmail,
      clerkUserId: metadata.clerkUserId,
      status: "paid",
      currency: session.currency,
      amountDiscount: session.total_details?.amount_discount
        ? session.total_details.amount_discount / 100
        : 0,
      totalPrice: session.amount_total ? session.amount_total / 100 : 0,
      orderDate: new Date().toISOString(),
      products: sanityProducts,
    };

    try {
      const created = await backendClient.create(order);
      console.log("Order saved to Sanity:", created);
    } catch (error) {
      console.error(" Error saving order to Sanity:", error);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
