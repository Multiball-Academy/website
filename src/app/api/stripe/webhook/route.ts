import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  
  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const registrationId = session.metadata?.registrationId;
    
    if (registrationId) {
      // Update registration status
      const { error } = await supabaseAdmin
        .from("registrations")
        .update({
          status: "paid",
          stripe_payment_intent_id: session.payment_intent as string,
          amount_paid: session.amount_total,
          paid_at: new Date().toISOString(),
        })
        .eq("id", registrationId);
      
      if (error) {
        console.error("Failed to update registration:", error);
      } else {
        console.log(`✅ Registration ${registrationId} marked as paid`);
        
        // TODO: Send confirmation email via Resend
        // const registration = await supabaseAdmin
        //   .from("registrations")
        //   .select("*")
        //   .eq("id", registrationId)
        //   .single();
        // 
        // await sendConfirmationEmail(registration.data);
      }
    }
  }
  
  return NextResponse.json({ received: true });
}
