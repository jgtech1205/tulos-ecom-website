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
    // Validate input first
    if (!items?.length) throw new Error("Cart is empty");
    if (!metadata.customerEmail) throw new Error("Customer email is required");

    // Check for existing customer
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    const customerId = customers.data[0]?.id;

    // Create session payload with validated line items
    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      payment_method_types: ["card"],
      metadata: { ...metadata },
      payment_intent_data: { metadata: { ...metadata } },
      line_items: items.map((item) => {
        // Explicit validation - throws error if requirements aren't met
        if (!item.product?.name) throw new Error(`Product ${item.product?._id} missing name`);
        if (typeof item.product?.price !== "number") throw new Error(`Product ${item.product?._id} has invalid price`);
        if (item.quantity <= 0) throw new Error(`Invalid quantity for product ${item.product?._id}`);

        return {
          quantity: item.quantity,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(item.product.price * 100), // cents
            product_data: {
              name: item.product.name, // Now guaranteed to exist
              metadata: { id: item.product._id },
              ...(item.product.images?.length && {
                images: [urlFor(item.product.images[0]).url()],
              }),
            },
          },
        };
      }),
    };

    // Add customer reference
    if (customerId) {
      sessionPayload.customer = customerId;
    } else {
      sessionPayload.customer_email = metadata.customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionPayload);
    return session.url;
  } catch (error) {
    console.error("Stripe Checkout error:", error);
    throw error instanceof Error ? error : new Error("Checkout failed");
  }
}