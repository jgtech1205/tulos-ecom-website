import { Metadata } from "@/actions/createCheckoutSession";
import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  console.log("📬 Incoming webhook hit");

  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  console.log("🔥 Stripe webhook hit");
  console.log("🧾 stripe-signature:", sig);
  console.log("✅ STRIPE_WEBHOOK_SECRET present:", !!process.env.STRIPE_WEBHOOK_SECRET);

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) {
    console.error("❌ Missing required Stripe secret or signature");
    return NextResponse.json(
      { error: "Missing Stripe signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return NextResponse.json(
      { error: `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 400 }
    );
  }

  console.log(`✅ Stripe event received: ${event.type} [${event.id}]`);
  console.log("📦 Full event object:", JSON.stringify(event, null, 2));

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("🧪 Metadata from session:", session.metadata);
    const invoice = session.invoice
      ? await stripe.invoices.retrieve(session.invoice as string)
      : null;

    console.log("📄 Session object:", JSON.stringify(session, null, 2));
    console.log("🧪 Metadata from session:", session.metadata);

    try {
      await createOrderInsanity(session, invoice);
    } catch (err) {
      console.error("❌ Error creating order in Sanity:", err);
      return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

async function createOrderInsanity(
  session: Stripe.Checkout.Session,
  invoice: Stripe.Invoice | null
) {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    total_details,
  } = session;

  if (!metadata || typeof metadata !== "object") {
    console.warn("⚠️ Metadata missing or malformed:", metadata);
    return;
  }

  const orderNumber = metadata.orderNumber || "";
  const customerName = metadata.customerName || "";
  const customerEmail = metadata.customerEmail || "";
  const clerkUserId = metadata.clerkUserId || "";

  if (!orderNumber || !customerName || !customerEmail || !clerkUserId) {
    console.warn("⚠️ Skipping order creation: test mode or incomplete metadata", {
      orderNumber,
      customerName,
      customerEmail,
      clerkUserId,
    });
    return;
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(id, {
    expand: ["data.price.product"],
  });

  const sanityProducts = lineItems.data.map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: "reference",
      _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
    },
    quantity: item.quantity || 0,
  }));

  const order = {
    _type: "order",
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    customerName,
    stripeCustomerId: customerEmail,
    clerkUserId,
    email: customerEmail,
    currency,
    amountDiscount: total_details?.amount_discount
      ? total_details.amount_discount / 100
      : 0,
    products: sanityProducts,
    totalPrice: amount_total ? amount_total / 100 : 0,
    status: "paid",
    orderDate: new Date().toISOString(),
    invoice: invoice
      ? {
          id: invoice.id,
          number: invoice.number,
          hosted_invoice_url: invoice.hosted_invoice_url,
        }
      : null,
  };

  console.log("📦 Final order payload to Sanity:", order);
  console.log("🔐 SANITY_API_TOKEN present:", !!process.env.SANITY_API_TOKEN);

  try {
    const createdOrder = await backendClient.create(order);
    console.log("✅ Order successfully created in Sanity:", createdOrder);
    return createdOrder;
  } catch (err) {
    console.error("❌ Failed to create order in Sanity:", err);
    throw err;
  }
}
