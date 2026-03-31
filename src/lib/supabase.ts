import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side client with service role key (for API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Types for the registrations table
export interface Registration {
  id: string;
  created_at: string;
  status: "pending" | "paid" | "cancelled" | "refunded";
  
  // Parent/Guardian
  parent_first_name: string;
  parent_last_name: string;
  parent_email: string;
  parent_phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  
  // Camper
  camper_first_name: string;
  camper_last_name: string;
  camper_birthdate: string;
  camper_age: number;
  camper_grade: string;
  tshirt_size: string;
  
  // Emergency Contact
  emergency_name: string;
  emergency_phone: string;
  emergency_relation: string;
  
  // Medical
  allergies: string | null;
  medications: string | null;
  medical_conditions: string | null;
  doctor_name: string | null;
  doctor_phone: string | null;
  insurance_provider: string | null;
  insurance_policy_number: string | null;
  
  // Agreements
  photo_release: boolean;
  liability_waiver: boolean;
  code_of_conduct: boolean;
  
  // Meta
  how_heard: string | null;
  additional_notes: string | null;
  session_id: string;
  
  // Payment
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  amount_paid: number | null;
  paid_at: string | null;
}
