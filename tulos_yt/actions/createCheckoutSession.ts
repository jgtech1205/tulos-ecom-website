"use server";

import stripe from "@/lib/stripe";
import { urlFor } from "@/sanity/lib/image";
import { CartItem } from "@/store";
import Stripe from "stripe";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
}

export async function createCheckoutSession(items: CartItem[], metadata: Metadata) {
  try {
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    const customerId = customers.data.length > 0 ? customers.data[0].id : undefined;

    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      payment_method_types: ["card"],
      metadata: {
        ...metadata,
      },
      payment_intent_data: {
        metadata: {
          ...metadata,
        },
      },
      line_items: items.map((item) => {
        if (!item.product.name) {
          throw new Error(`Product name is required for product ID: ${item.product._id}`);
        }

        return {
          quantity: item.quantity,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(item.product.price! * 100),
            product_data: {
              name: item.product.name, // Now guaranteed to be a string
              metadata: { id: item.product._id },
              ...(item.product.images?.length && {
                images: [urlFor(item.product.images[0]).url()],
              }),
            },
          },
        };
      }),
    };

    if (customerId) {
      sessionPayload.customer = customerId;
    } else {
      sessionPayload.customer_email = metadata.customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionPayload);
    return session.url;
  } catch (error) {
    console.error("Stripe Checkout error:", error);
    throw error;
  }
}