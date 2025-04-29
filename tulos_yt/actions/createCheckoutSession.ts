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
    // Validate inputs
    if (!items || items.length === 0) throw new Error("Cart cannot be empty");
    if (!metadata.customerEmail) throw new Error("Customer email is required");

    // Validate and transform line items
    const lineItems = items.map(item => {
      // Destructure for easier access
      const { product, quantity } = item;
      
      // Validate product exists
      if (!product) throw new Error("Product data is missing");
      
      // Validate required fields
      if (!product.name) throw new Error(`Product ${product._id} is missing name`);
      if (typeof product.price !== "number" || product.price <= 0) {
        throw new Error(`Product ${product._id} has invalid price`);
      }
      if (typeof quantity !== "number" || quantity <= 0) {
        throw new Error(`Invalid quantity for product ${product._id}`);
      }

      // Build the Stripe line item
      return {
        quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(product.price * 100), // Convert to cents
          product_data: {
            name: product.name, // Now guaranteed to be string
            metadata: { id: product._id },
            ...(product.images?.length ? { 
              images: [urlFor(product.images[0]).url()] 
            } : {})
          }
        }
      };
    });

    // Check for existing customer
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      payment_method_types: ["card"],
      metadata: { ...metadata },
      payment_intent_data: { metadata: { ...metadata } },
      line_items: lineItems,
      customer: customers.data[0]?.id,
      customer_email: customers.data[0]?.id ? undefined : metadata.customerEmail
    };

    const session = await stripe.checkout.sessions.create(sessionPayload);
    return session.url;
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    throw error instanceof Error ? error : new Error("Checkout failed");
  }
}