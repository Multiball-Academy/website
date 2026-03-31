import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { stripe, getCurrentPrice } from "@/lib/stripe";

// Detect if we're using test Stripe keys
const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") ?? true;

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
  
  // Camper
  camperFirstName: string;
  camperLastName: string;
  camperBirthdate: string;
  camperAge: string;
  camperGrade: string;
  tshirtSize: string;
  
  // Emergency Contact
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  
  // Medical
  allergies: string;
  medications: string;
  medicalConditions: string;
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

export async function POST(request: NextRequest) {
  try {
    const data: RegistrationData = await request.json();
    
    // Validate required fields
    const required = [
      "parentFirstName",
      "parentLastName", 
      "parentEmail",
      "parentPhone",
      "address",
      "city",
      "state",
      "zip",
      "camperFirstName",
      "camperLastName",
      "camperBirthdate",
      "camperAge",
      "tshirtSize",
      "emergencyName",
      "emergencyPhone",
      "emergencyRelation",
    ];
    
    const missing = required.filter((field) => !data[field as keyof RegistrationData]);
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
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
    const { cents: priceCents, isEarlyBird } = getCurrentPrice();
    
    // Insert into Supabase
    const { error: dbError } = await supabaseAdmin
      .from("registrations")
      .insert({
        id: registrationId,
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
        camper_first_name: data.camperFirstName,
        camper_last_name: data.camperLastName,
        camper_birthdate: data.camperBirthdate,
        camper_age: parseInt(data.camperAge) || 0,
        camper_grade: data.camperGrade,
        tshirt_size: data.tshirtSize,
        
        // Emergency Contact
        emergency_name: data.emergencyName,
        emergency_phone: data.emergencyPhone,
        emergency_relation: data.emergencyRelation,
        
        // Medical
        allergies: data.allergies || null,
        medications: data.medications || null,
        medical_conditions: data.medicalConditions || null,
        doctor_name: data.doctorName || null,
        doctor_phone: data.doctorPhone || null,
        insurance_provider: data.insuranceProvider || null,
        insurance_policy_number: data.insurancePolicyNumber || null,
        
        // Agreements
        photo_release: data.photoRelease,
        liability_waiver: data.liabilityWaiver,
        code_of_conduct: data.codeOfConduct,
        
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
    
    // Create Stripe Checkout Session
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Multiball Academy Summer Camp 2026",
              description: `June 29 – July 3, 2026 • ${data.camperFirstName} ${data.camperLastName}${isEarlyBird ? " (Early Bird Pricing)" : ""}`,
            },
            unit_amount: priceCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/register/success?session_id={CHECKOUT_SESSION_ID}&registration_id=${registrationId}`,
      cancel_url: `${baseUrl}/register?cancelled=true`,
      customer_email: data.parentEmail,
      metadata: {
        registrationId,
        camperName: `${data.camperFirstName} ${data.camperLastName}`,
        parentName: `${data.parentFirstName} ${data.parentLastName}`,
      },
    });
    
    // Update registration with Stripe session ID
    await supabaseAdmin
      .from("registrations")
      .update({ stripe_checkout_session_id: checkoutSession.id })
      .eq("id", registrationId);
    
    console.log("=== NEW REGISTRATION ===");
    console.log("ID:", registrationId);
    console.log("Camper:", data.camperFirstName, data.camperLastName);
    console.log("Price:", priceCents / 100, isEarlyBird ? "(Early Bird)" : "(Regular)");
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
