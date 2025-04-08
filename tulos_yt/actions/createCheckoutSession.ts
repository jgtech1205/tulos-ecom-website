"use server";

import Stripe from "stripe";
import stripe from "@/lib/stripe";
import { CartItem } from "@/store";


export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
}

interface CartItems {
  products: CartItem["product"];
  quantity: number;
}

export async function createCheckoutSession(
  items: CartItem[],
  metadata: Metadata
) {
  const customers = await stripe.customers.list({
    email: metadata?.customerEmail,
    limit: 1,
  });
  const customerId = customers.data.length > 0 ? customers.data[0].id : undefined;

const sessionPayload: Stripe.Checkout.SessionCreateParams = {
  metadata: {
    orderNumber: metadata?.orderNumber,
    customerName: metadata?.customerName,
    customerEmail: metadata?.customerEmail,
    clerkUserId: metadata?.clerkUserId,
  }
}

}
