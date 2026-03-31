"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type FormStep = "info" | "camper" | "medical" | "agreements" | "payment";

// Pricing constants (mirrored from server)
const REGULAR_PRICE = 395;
const EARLY_BIRD_PRICE = 295;
const EARLY_BIRD_DEADLINE = new Date("2026-04-30T23:59:59");
const SIBLING_DISCOUNT = 0.10; // 10% off for additional campers

function usePricing(camperCount: number) {
  const [isEarlyBird, setIsEarlyBird] = useState(true);
  
  useEffect(() => {
    setIsEarlyBird(new Date() <= EARLY_BIRD_DEADLINE);
  }, []);
  
  const basePrice = isEarlyBird ? EARLY_BIRD_PRICE : REGULAR_PRICE;
  const siblingPrice = Math.round(basePrice * (1 - SIBLING_DISCOUNT));
  
  // First camper full price, rest get sibling discount
  const total = camperCount === 1 
    ? basePrice 
    : basePrice + (siblingPrice * (camperCount - 1));
  
  const siblingDiscount = camperCount > 1 
    ? (basePrice - siblingPrice) * (camperCount - 1)
    : 0;
  
  return {
    isEarlyBird,
    basePrice,
    siblingPrice,
    total,
    regularPrice: REGULAR_PRICE,
    earlyBirdSavings: REGULAR_PRICE - EARLY_BIRD_PRICE,
    siblingDiscount,
    camperCount,
  };
}

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

const emptyCamper: CamperData = {
  firstName: "",
  lastName: "",
  birthdate: "",
  age: "",
  grade: "",
  tshirtSize: "",
  allergies: "",
  medications: "",
  medicalConditions: "",
};

interface FormData {
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

const initialFormData: FormData = {
  parentFirstName: "",
  parentLastName: "",
  parentEmail: "",
  parentPhone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  campers: [{ ...emptyCamper }],
  emergencyName: "",
  emergencyPhone: "",
  emergencyRelation: "",
  doctorName: "",
  doctorPhone: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  photoRelease: false,
  liabilityWaiver: false,
  codeOfConduct: false,
  howHeard: "",
  additionalNotes: "",
};

const steps: { id: FormStep; label: string }[] = [
  { id: "info", label: "Parent Info" },
  { id: "camper", label: "Camper Info" },
  { id: "medical", label: "Medical" },
  { id: "agreements", label: "Agreements" },
  { id: "payment", label: "Payment" },
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<FormStep>("info");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pricing = usePricing(formData.campers.length);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    }
  };

  const updateCamper = (index: number, field: keyof CamperData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      campers: prev.campers.map((c, i) => 
        i === index ? { ...c, [field]: value } : c
      ),
    }));
    const errorKey = `camper_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  const addCamper = () => {
    if (formData.campers.length < 4) {
      setFormData((prev) => ({
        ...prev,
        campers: [...prev.campers, { ...emptyCamper }],
      }));
    }
  };

  const removeCamper = (index: number) => {
    if (formData.campers.length > 1) {
      setFormData((prev) => ({
        ...prev,
        campers: prev.campers.filter((_, i) => i !== index),
      }));
    }
  };

  const markTouched = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^[\d\s\-\(\)\+]{10,}$/.test(phone.replace(/\D/g, '') ? phone : '');
  };

  const validateStep = (step: FormStep): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === "info") {
      if (!formData.parentFirstName.trim()) newErrors.parentFirstName = "First name is required";
      if (!formData.parentLastName.trim()) newErrors.parentLastName = "Last name is required";
      if (!formData.parentEmail.trim()) {
        newErrors.parentEmail = "Email is required";
      } else if (!validateEmail(formData.parentEmail)) {
        newErrors.parentEmail = "Please enter a valid email";
      }
      if (!formData.parentPhone.trim()) {
        newErrors.parentPhone = "Phone is required";
      } else if (!validatePhone(formData.parentPhone)) {
        newErrors.parentPhone = "Please enter a valid phone number";
      }
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.zip.trim()) newErrors.zip = "ZIP code is required";
    }
    
    if (step === "camper") {
      // Validate each camper
      formData.campers.forEach((camper, i) => {
        if (!camper.firstName.trim()) newErrors[`camper_${i}_firstName`] = "First name is required";
        if (!camper.lastName.trim()) newErrors[`camper_${i}_lastName`] = "Last name is required";
        if (!camper.birthdate) newErrors[`camper_${i}_birthdate`] = "Birthdate is required";
        if (!camper.age.trim()) newErrors[`camper_${i}_age`] = "Age is required";
        if (!camper.tshirtSize) newErrors[`camper_${i}_tshirtSize`] = "T-shirt size is required";
      });
      if (!formData.emergencyName.trim()) newErrors.emergencyName = "Emergency contact name is required";
      if (!formData.emergencyPhone.trim()) {
        newErrors.emergencyPhone = "Emergency phone is required";
      } else if (!validatePhone(formData.emergencyPhone)) {
        newErrors.emergencyPhone = "Please enter a valid phone number";
      }
      if (!formData.emergencyRelation.trim()) newErrors.emergencyRelation = "Relationship is required";
    }
    
    if (step === "agreements") {
      if (!formData.liabilityWaiver) newErrors.liabilityWaiver = "Liability waiver must be accepted";
      if (!formData.codeOfConduct) newErrors.codeOfConduct = "Code of conduct must be accepted";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const goNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
      setErrors({});
    }
  };

  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Registration failed. Please try again.");
      }
      
      // Redirect to Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setIsComplete(true);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 border border-white/20 rounded-2xl p-8 max-w-lg text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Registration Complete!</h1>
          <p className="text-slate-300 mb-6">
            We&apos;ve received your registration for {formData.campers.map(c => c.firstName).join(" and ")}. 
            Check your email ({formData.parentEmail}) for confirmation and next steps.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Nav */}
      <nav className="relative z-10 p-6">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors">
          ← Back to home
        </Link>
      </nav>

      {/* Header */}
      <header className="relative z-10 text-center px-4 pt-4 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Register for Summer Camp 2026
        </h1>
        <p className="text-slate-400">June 29 – July 3 • Ages 10–15 • ${pricing.basePrice}/camper</p>
        {pricing.isEarlyBird && (
          <p className="text-emerald-400 text-sm mt-1">
            🎉 Early bird pricing! Save ${pricing.earlyBirdSavings} — ends April 30
          </p>
        )}
      </header>

      {/* Progress */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors
                ${i <= currentStepIndex 
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white" 
                  : "bg-white/10 text-slate-500"}`}
              >
                {i + 1}
              </div>
              <span className={`hidden md:block ml-2 text-sm ${i <= currentStepIndex ? "text-white" : "text-slate-500"}`}>
                {step.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`w-8 md:w-16 h-0.5 mx-2 ${i < currentStepIndex ? "bg-purple-500" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 pb-20">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          
          {/* Step 1: Parent Info */}
          {currentStep === "info" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Parent/Guardian Information</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="First Name *" value={formData.parentFirstName} onChange={(v) => updateField("parentFirstName", v)} error={errors.parentFirstName} />
                <Input label="Last Name *" value={formData.parentLastName} onChange={(v) => updateField("parentLastName", v)} error={errors.parentLastName} />
              </div>
              
              <Input label="Email *" type="email" value={formData.parentEmail} onChange={(v) => updateField("parentEmail", v)} error={errors.parentEmail} />
              <Input label="Phone *" type="tel" value={formData.parentPhone} onChange={(v) => updateField("parentPhone", v)} error={errors.parentPhone} />
              
              <Input label="Street Address *" value={formData.address} onChange={(v) => updateField("address", v)} error={errors.address} />
              
              <div className="grid md:grid-cols-3 gap-4">
                <Input label="City *" value={formData.city} onChange={(v) => updateField("city", v)} error={errors.city} />
                <Input label="State *" value={formData.state} onChange={(v) => updateField("state", v)} error={errors.state} />
                <Input label="ZIP *" value={formData.zip} onChange={(v) => updateField("zip", v)} error={errors.zip} />
              </div>
            </div>
          )}

          {/* Step 2: Camper Info */}
          {currentStep === "camper" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Camper Information</h2>
                {formData.campers.length > 1 && (
                  <span className="text-emerald-400 text-sm">
                    🎉 10% sibling discount applied!
                  </span>
                )}
              </div>
              
              {formData.campers.map((camper, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">
                      {index === 0 ? "Camper" : `Sibling ${index}`}
                      {index > 0 && <span className="text-emerald-400 text-sm ml-2">(10% off)</span>}
                    </h3>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeCamper(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="First Name *" value={camper.firstName} onChange={(v) => updateCamper(index, "firstName", v)} error={errors[`camper_${index}_firstName`]} />
                    <Input label="Last Name *" value={camper.lastName} onChange={(v) => updateCamper(index, "lastName", v)} error={errors[`camper_${index}_lastName`]} />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <Input label="Birthdate *" type="date" value={camper.birthdate} onChange={(v) => updateCamper(index, "birthdate", v)} error={errors[`camper_${index}_birthdate`]} />
                    <Input label="Age *" value={camper.age} onChange={(v) => updateCamper(index, "age", v)} error={errors[`camper_${index}_age`]} />
                    <Input label="Grade (Fall 2026)" value={camper.grade} onChange={(v) => updateCamper(index, "grade", v)} />
                  </div>
                  
                  <Select 
                    label="T-Shirt Size *" 
                    value={camper.tshirtSize} 
                    onChange={(v) => updateCamper(index, "tshirtSize", v)}
                    error={errors[`camper_${index}_tshirtSize`]}
                    options={[
                      { value: "", label: "Select size..." },
                      { value: "YS", label: "Youth Small" },
                      { value: "YM", label: "Youth Medium" },
                      { value: "YL", label: "Youth Large" },
                      { value: "AS", label: "Adult Small" },
                      { value: "AM", label: "Adult Medium" },
                      { value: "AL", label: "Adult Large" },
                    ]}
                  />
                </div>
              ))}

              {formData.campers.length < 4 && (
                <button
                  type="button"
                  onClick={addCamper}
                  className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-slate-400 hover:text-white hover:border-white/40 transition-colors"
                >
                  + Add Sibling (10% off)
                </button>
              )}

              <div className="border-t border-white/10 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Emergency Contact (other than parent)</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Input label="Name *" value={formData.emergencyName} onChange={(v) => updateField("emergencyName", v)} error={errors.emergencyName} />
                  <Input label="Phone *" type="tel" value={formData.emergencyPhone} onChange={(v) => updateField("emergencyPhone", v)} error={errors.emergencyPhone} />
                  <Input label="Relationship *" value={formData.emergencyRelation} onChange={(v) => updateField("emergencyRelation", v)} error={errors.emergencyRelation} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Medical */}
          {currentStep === "medical" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Medical Information</h2>
              
              {formData.campers.map((camper, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    {camper.firstName || `Camper ${index + 1}`}
                  </h3>
                  
                  <Textarea 
                    label="Allergies" 
                    placeholder="List any food, medication, or environmental allergies..."
                    value={camper.allergies} 
                    onChange={(v) => updateCamper(index, "allergies", v)} 
                  />
                  
                  <Textarea 
                    label="Current Medications" 
                    placeholder="List any medications they take regularly..."
                    value={camper.medications} 
                    onChange={(v) => updateCamper(index, "medications", v)} 
                  />
                  
                  <Textarea 
                    label="Medical Conditions / Special Needs" 
                    placeholder="Any conditions we should be aware of (ADHD, asthma, etc.)..."
                    value={camper.medicalConditions} 
                    onChange={(v) => updateCamper(index, "medicalConditions", v)} 
                  />
                </div>
              ))}

              <div className="border-t border-white/10 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Family Doctor & Insurance</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Doctor Name" value={formData.doctorName} onChange={(v) => updateField("doctorName", v)} />
                  <Input label="Doctor Phone" type="tel" value={formData.doctorPhone} onChange={(v) => updateField("doctorPhone", v)} />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <Input label="Insurance Provider" value={formData.insuranceProvider} onChange={(v) => updateField("insuranceProvider", v)} />
                  <Input label="Policy Number" value={formData.insurancePolicyNumber} onChange={(v) => updateField("insurancePolicyNumber", v)} />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Agreements */}
          {currentStep === "agreements" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Agreements</h2>
              
              <Checkbox 
                checked={formData.photoRelease}
                onChange={(v) => updateField("photoRelease", v)}
                label="Photo/Video Release"
                description="I grant Multiball Academy permission to photograph and video my child for promotional materials, social media, and documentation purposes."
              />
              
              <Checkbox 
                checked={formData.liabilityWaiver}
                onChange={(v) => updateField("liabilityWaiver", v)}
                label="Liability Waiver *"
                description="I understand that pinball and maker activities involve some risk of injury. I release Multiball Academy, its staff, and volunteers from liability for any injuries that may occur during camp activities."
                error={errors.liabilityWaiver}
              />
              
              <Checkbox 
                checked={formData.codeOfConduct}
                onChange={(v) => updateField("codeOfConduct", v)}
                label="Code of Conduct *"
                description="I have reviewed the Code of Conduct with my child. I understand that disruptive or unsafe behavior may result in dismissal from camp without refund."
                error={errors.codeOfConduct}
              />

              <div className="border-t border-white/10 pt-6 mt-6">
                <Select 
                  label="How did you hear about us?"
                  value={formData.howHeard} 
                  onChange={(v) => updateField("howHeard", v)}
                  options={[
                    { value: "", label: "Select..." },
                    { value: "friend", label: "Friend or family" },
                    { value: "social", label: "Social media" },
                    { value: "search", label: "Google search" },
                    { value: "pinball", label: "Pinball community" },
                    { value: "school", label: "School flyer" },
                    { value: "other", label: "Other" },
                  ]}
                />
                
                <Textarea 
                  label="Anything else we should know?" 
                  placeholder="Special requests, questions, or things you'd like us to know about your camper..."
                  value={formData.additionalNotes} 
                  onChange={(v) => updateField("additionalNotes", v)} 
                />
              </div>
            </div>
          )}

          {/* Step 5: Payment */}
          {currentStep === "payment" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Payment</h2>
              
              <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-xl p-6">
                <div className="text-sm text-slate-400 mb-4">June 29 – July 3, 9am–3pm</div>
                
                {/* Line items for each camper */}
                {formData.campers.map((camper, index) => (
                  <div key={index} className="flex justify-between items-center mb-2">
                    <span className="text-slate-300">
                      {camper.firstName || `Camper ${index + 1}`}
                      {index > 0 && <span className="text-emerald-400 text-sm ml-2">(sibling)</span>}
                    </span>
                    <span className="text-white font-semibold">
                      ${index === 0 ? pricing.basePrice : pricing.siblingPrice}
                    </span>
                  </div>
                ))}
                
                {/* Discounts */}
                {pricing.isEarlyBird && (
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-emerald-400">🎉 Early Bird Discount</span>
                    <span className="text-emerald-400">-${pricing.earlyBirdSavings * pricing.camperCount}</span>
                  </div>
                )}
                {pricing.siblingDiscount > 0 && (
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-emerald-400">👯 Sibling Discount (10% off)</span>
                    <span className="text-emerald-400">-${pricing.siblingDiscount}</span>
                  </div>
                )}
                
                <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-center">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">${pricing.total}</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <p className="text-slate-300 mb-4">
                  You&apos;ll be redirected to Stripe to complete your secure payment.
                </p>
                <p className="text-slate-500 text-sm">
                  🔒 Secure checkout powered by Stripe
                </p>
              </div>

              {submitError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300">
                  {submitError}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            {currentStepIndex > 0 ? (
              <button
                onClick={goBack}
                className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/5 transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}
            
            {currentStep === "payment" ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.liabilityWaiver || !formData.codeOfConduct}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Complete Registration"}
              </button>
            ) : (
              <button
                onClick={goNext}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all"
              >
                Continue →
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Form Components
function Input({ 
  label, 
  type = "text", 
  value, 
  onChange,
  onBlur,
  placeholder,
  error,
}: { 
  label: string; 
  type?: string; 
  value: string; 
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-slate-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-slate-500 focus:outline-none transition-colors ${
          error ? "border-red-500 focus:border-red-400" : "border-white/10 focus:border-purple-500"
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}

function Textarea({ 
  label, 
  value, 
  onChange,
  placeholder,
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-slate-400 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
      />
    </div>
  );
}

function Select({ 
  label, 
  value, 
  onChange,
  options,
  error,
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-slate-400 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white focus:outline-none transition-colors ${
          error ? "border-red-500 focus:border-red-400" : "border-white/10 focus:border-purple-500"
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-800">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}

function Checkbox({ 
  label, 
  description,
  checked, 
  onChange,
  error,
}: { 
  label: string; 
  description: string;
  checked: boolean; 
  onChange: (v: boolean) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="flex items-start gap-4 cursor-pointer group">
        <div className="pt-1">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors
            ${checked 
              ? "bg-gradient-to-r from-cyan-500 to-purple-500 border-transparent" 
              : error 
                ? "border-red-500 group-hover:border-red-400"
                : "border-white/30 group-hover:border-white/50"}`}
          >
            {checked && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        <div>
          <div className="text-white font-medium">{label}</div>
          <div className="text-slate-400 text-sm">{description}</div>
        </div>
      </label>
      {error && <p className="mt-1 text-sm text-red-400 ml-10">{error}</p>}
    </div>
  );
}
