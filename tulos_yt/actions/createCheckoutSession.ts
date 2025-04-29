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
    // Validate input parameters
    if (!items || items.length === 0) {
      throw new Error("Cannot create checkout session with empty cart");
    }
    if (!metadata.customerEmail) {
      throw new Error("Customer email is required");
    }

    // Check for existing customer
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    const customerId = customers.data[0]?.id;

    // Prepare line items with strict validation
    const lineItems = items.map((item) => {
      if (!item.product) {
        throw new Error("Product data is missing");
      }
      if (typeof item.quantity !== "number" || item.quantity <= 0) {
        throw new Error(`Invalid quantity for product ${item.product._id}`);
      }
      if (typeof item.product.price !== "number" || item.product.price <= 0) {
        throw new Error(`Invalid price for product ${item.product._id}`);
      }

      return {
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(item.product.price * 100), // Convert to cents
          product_data: {
            name: item.product.name || "Unnamed Product",
            metadata: { id: item.product._id },
            ...(item.product.images?.length && {
              images: [urlFor(item.product.images[0]).url()],
            }),
          },
        },
      };
    });

    // Create session payload
    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      payment_method_types: ["card"],
      metadata: { ...metadata },
      payment_intent_data: { metadata: { ...metadata } },
      line_items: lineItems,
      ...(customerId ? { customer: customerId } : { customer_email: metadata.customerEmail }),
    };

    const session = await stripe.checkout.sessions.create(sessionPayload);
    return session.url;
  } catch (error) {
    console.error("Stripe Checkout error:", error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "An unexpected error occurred during checkout"
    );
  }
}