import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!;
const MAILCHIMP_DC = MAILCHIMP_API_KEY?.split("-")[1] || "us5";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, background, why } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Add to Mailchimp with coach-interest tag
    const mailchimpResponse = await fetch(
      `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `apikey ${MAILCHIMP_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
          tags: ["coach-interest"],
          merge_fields: {
            FNAME: name.split(" ")[0] || "",
            LNAME: name.split(" ").slice(1).join(" ") || "",
          },
        }),
      }
    );

    const mailchimpData = await mailchimpResponse.json();
    const alreadySubscribed = mailchimpData.title === "Member Exists";

    // If already exists, just add the tag
    if (alreadySubscribed) {
      const subscriberHash = require("crypto")
        .createHash("md5")
        .update(email.toLowerCase())
        .digest("hex");

      await fetch(
        `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members/${subscriberHash}/tags`,
        {
          method: "POST",
          headers: {
            Authorization: `apikey ${MAILCHIMP_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tags: [{ name: "coach-interest", status: "active" }],
          }),
        }
      );
    }

    // Send notification email to Scott
    try {
      await resend.emails.send({
        from: "Multiball Academy <hello@multiballacademy.com>",
        to: "hello@multiballacademy.com",
        subject: `🏆 New Coach Interest: ${name}`,
        html: `
          <h2>New Coach Interest Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Background:</strong></p>
          <p>${background || "(not provided)"}</p>
          <p><strong>Why interested:</strong></p>
          <p>${why || "(not provided)"}</p>
        `,
      });
    } catch (emailError) {
      console.error("Notification email error:", emailError);
    }

    // Send confirmation to the coach
    try {
      await resend.emails.send({
        from: "Multiball Academy <hello@multiballacademy.com>",
        to: email,
        subject: "Thanks for your interest in coaching!",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1e1e2e;">Thanks, ${name.split(" ")[0]}!</h1>
            
            <p>I got your interest form for coaching at Multiball Academy.</p>
            
            <p>I'm building something new here, and I'm looking for people who care about kids more than they care about pinball scores. Sounds like that might be you.</p>
            
            <p>I'll be in touch soon to chat. In the meantime, reply to this email if you have any questions.</p>
            
            <p>— Scott<br/>
            Founder, Multiball Academy<br/>
            <a href="https://multiballacademy.com" style="color: #7c3aed;">multiballacademy.com</a></p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Confirmation email error:", emailError);
    }

    return NextResponse.json(
      { message: "Thanks! We'll be in touch soon." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Coach interest error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
