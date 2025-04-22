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

export async function createCheckoutSession(
  items: CartItem[],
  metadata: Metadata
) {
  try {
    console.log("Creating checkout session...");
    console.log("Metadata received:", metadata);
    console.log(
      "Items in cart:",
      items.map(item => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        productId: item.product._id,
      }))
    );

    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    const customerId = customers.data.length > 0 ? customers.data[0].id : "";
    if (customerId) {
      console.log("Existing Stripe customer found:", customerId);
    }

    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      metadata: {
        orderNumber: metadata.orderNumber.toString(),
        customerName: metadata.customerName.toString(),
        customerEmail: metadata.customerEmail.toString(),
        clerkUserId: metadata.clerkUserId.toString(),
      },
      
      mode: "payment",
      allow_promotion_codes: true,
      payment_method_types: ["card"],
      invoice_creation: { enabled: true },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      line_items: items.map((item) => ({
        price_data: {
          currency: "USD",
          unit_amount: Math.round(item.product.price! * 100),
          product_data: {
            name: item.product.name || "Unnamed Product",
            metadata: { id: item.product._id },
            ...(item.product.images?.length && {
              images: [urlFor(item.product.images[0]).url()],
            }),
          },
        },
        quantity: item.quantity,
      })),
    };

    if (customerId) {
      sessionPayload.customer = customerId;
    } else {
      sessionPayload.customer_email = metadata.customerEmail;
    }

    console.log("Sending session payload to Stripe...");
    const session = await stripe.checkout.sessions.create(sessionPayload);
    console.log("Stripe session created:", session.id);

    return session.url;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}
