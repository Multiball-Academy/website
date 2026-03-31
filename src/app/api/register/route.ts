import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { stripe, REGULAR_PRICE_CENTS, EARLY_BIRD_PRICE_CENTS, isEarlyBird } from "@/lib/stripe";

// Detect if we're using test Stripe keys
const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") ?? true;

const SIBLING_DISCOUNT = 0.10; // 10% off for additional campers

interface CamperData {
  firstName: string;
  lastName: string;
  birthdate: string;
  age: string;
  grade: string;
  tshirtSize: string;
  allergies: string;
  medications: string;
  medicalConditions: string;
}

interface RegistrationData {
  // Parent/Guardian
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  
  // Campers (array for siblings)
  campers: CamperData[];
  
  // Emergency Contact
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  
  // Medical (shared)
  doctorName: string;
  doctorPhone: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  
  // Agreements
  photoRelease: boolean;
  liabilityWaiver: boolean;
  codeOfConduct: boolean;
  
  // How did you hear
  howHeard: string;
  additionalNotes: string;
}

function calculatePricing(camperCount: number) {
  const basePrice = isEarlyBird() ? EARLY_BIRD_PRICE_CENTS : REGULAR_PRICE_CENTS;
  const siblingPrice = Math.round(basePrice * (1 - SIBLING_DISCOUNT));
  
  // First camper full price, rest get sibling discount
  const total = camperCount === 1 
    ? basePrice 
    : basePrice + (siblingPrice * (camperCount - 1));
  
  return { basePrice, siblingPrice, total, isEarlyBird: isEarlyBird() };
}

export async function POST(request: NextRequest) {
  try {
    const data: RegistrationData = await request.json();
    
    // Validate required fields
    if (!data.parentFirstName || !data.parentLastName || !data.parentEmail || !data.parentPhone) {
      return NextResponse.json(
        { error: "Missing required parent information" },
        { status: 400 }
      );
    }
    
    if (!data.campers || data.campers.length === 0) {
      return NextResponse.json(
        { error: "At least one camper is required" },
        { status: 400 }
      );
    }
    
    // Validate each camper
    for (let i = 0; i < data.campers.length; i++) {
      const camper = data.campers[i];
      if (!camper.firstName || !camper.lastName || !camper.birthdate || !camper.age || !camper.tshirtSize) {
        return NextResponse.json(
          { error: `Missing required information for camper ${i + 1}` },
          { status: 400 }
        );
      }
    }
    
    // Validate agreements
    if (!data.liabilityWaiver || !data.codeOfConduct) {
      return NextResponse.json(
        { error: "Liability waiver and code of conduct must be accepted" },
        { status: 400 }
      );
    }
    
    // Generate registration ID
    const registrationId = `REG-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Get current pricing
    const pricing = calculatePricing(data.campers.length);
    
    // Insert into Supabase - one row per camper, linked by registration ID
    for (let i = 0; i < data.campers.length; i++) {
      const camper = data.campers[i];
      const camperPrice = i === 0 ? pricing.basePrice : pricing.siblingPrice;
      
      const { error: dbError } = await supabaseAdmin
        .from("registrations")
        .insert({
          id: `${registrationId}-${i + 1}`,
          registration_group_id: registrationId,
          status: "pending",
          session_id: "summer-2026-june",
          is_test: isTestMode, 
          
          // Parent/Guardian
          parent_first_name: data.parentFirstName,
          parent_last_name: data.parentLastName,
          parent_email: data.parentEmail,
          parent_phone: data.parentPhone,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
          
          // Camper
          camper_first_name: camper.firstName,
          camper_last_name: camper.lastName,
          camper_birthdate: camper.birthdate,
          camper_age: parseInt(camper.age) || 0,
          camper_grade: camper.grade,
          tshirt_size: camper.tshirtSize,
          
          // Emergency Contact
          emergency_name: data.emergencyName,
          emergency_phone: data.emergencyPhone,
          emergency_relation: data.emergencyRelation,
          
          // Medical
          allergies: camper.allergies || null,
          medications: camper.medications || null,
          medical_conditions: camper.medicalConditions || null,
          doctor_name: data.doctorName || null,
          doctor_phone: data.doctorPhone || null,
          insurance_provider: data.insuranceProvider || null,
          insurance_policy_number: data.insurancePolicyNumber || null,
          
          // Agreements
          photo_release: data.photoRelease,
          liability_waiver: data.liabilityWaiver,
          code_of_conduct: data.codeOfConduct,
          
          // Pricing
          price_cents: camperPrice,
          is_sibling: i > 0,
          
          // Meta
          how_heard: data.howHeard || null,
          additional_notes: data.additionalNotes || null,
        });
      
      if (dbError) {
        console.error("Supabase error:", dbError);
        return NextResponse.json(
          { error: "Failed to save registration" },
          { status: 500 }
        );
      }
    }
    
    // Create Stripe Checkout Session
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    
    // Build line items for each camper
    const lineItems = data.campers.map((camper, i) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `Summer Camp 2026 - ${camper.firstName} ${camper.lastName}`,
          description: `June 29 – July 3, 2026${i > 0 ? " (Sibling - 10% off)" : ""}${pricing.isEarlyBird ? " (Early Bird)" : ""}`,
        },
        unit_amount: i === 0 ? pricing.basePrice : pricing.siblingPrice,
      },
      quantity: 1,
    }));
    
    const camperNames = data.campers.map(c => `${c.firstName} ${c.lastName}`).join(", ");
    
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/register/success?session_id={CHECKOUT_SESSION_ID}&registration_id=${registrationId}`,
      cancel_url: `${baseUrl}/register?cancelled=true`,
      customer_email: data.parentEmail,
      metadata: {
        registrationId,
        camperCount: data.campers.length.toString(),
        camperNames,
        parentName: `${data.parentFirstName} ${data.parentLastName}`,
      },
    });
    
    // Update all registrations with Stripe session ID
    await supabaseAdmin
      .from("registrations")
      .update({ stripe_checkout_session_id: checkoutSession.id })
      .eq("registration_group_id", registrationId);
    
    console.log("=== NEW REGISTRATION ===");
    console.log("ID:", registrationId);
    console.log("Campers:", camperNames);
    console.log("Count:", data.campers.length);
    console.log("Total:", pricing.total / 100, pricing.isEarlyBird ? "(Early Bird)" : "(Regular)");
    if (data.campers.length > 1) {
      console.log("Sibling discount applied!");
    }
    console.log("Checkout URL:", checkoutSession.url);
    console.log("========================");
    
    return NextResponse.json({
      success: true,
      registrationId,
      checkoutUrl: checkoutSession.url,
    });
    
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to process registration" },
      { status: 500 }
    );
  }
}
