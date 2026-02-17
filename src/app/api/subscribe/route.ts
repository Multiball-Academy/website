import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!;
const MAILCHIMP_DC = MAILCHIMP_API_KEY?.split("-")[1] || "us5";

const resend = new Resend(process.env.RESEND_API_KEY);

const WELCOME_EMAIL_HTML = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #1e1e2e;">Welcome to Multiball Academy! 🪩</h1>
  
  <p>Hey!</p>
  
  <p>Thanks for joining the Multiball Academy waitlist.</p>
  
  <p>We're building the first competitive pinball program for kids in Memphis. Think Code Ninjas meets shop class, powered by AI coaching.</p>
  
  <p><strong>What we're creating:</strong></p>
  <ul>
    <li>Summer camps to start (2026), then year-round memberships</li>
    <li>Skill progression from beginner to tournament-ready</li>
    <li><strong>Flipper Lab</strong>: hands-on repair and restoration (shop class for the modern kid)</li>
    <li><strong>Coach Flip</strong>: AI assistant that tracks progress and helps coaches deliver personalized feedback</li>
    <li>Real competition: leagues, tournaments, rankings</li>
  </ul>
  
  <p>Pinball teaches focus, resilience, and staying cool under pressure. No screens. Real social play. And kids actually learn how things work.</p>
  
  <p>You'll be the first to hear when registration opens. Reply anytime with questions.</p>
  
  <p>— Scott<br/>
  Founder, Multiball Academy<br/>
  <a href="https://multiballacademy.com" style="color: #7c3aed;">multiballacademy.com</a></p>
</div>
`;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Add to Mailchimp
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
          tags: ["website-signup"],
        }),
      }
    );

    const mailchimpData = await mailchimpResponse.json();

    // Check if already subscribed
    const alreadySubscribed = mailchimpData.title === "Member Exists";

    if (!mailchimpResponse.ok && !alreadySubscribed) {
      console.error("Mailchimp error:", mailchimpData);
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 500 }
      );
    }

    // Send welcome email (only for new subscribers)
    if (!alreadySubscribed) {
      try {
        await resend.emails.send({
          from: "Multiball Academy <hello@multiballacademy.com>",
          to: email,
          subject: "Welcome to Multiball Academy! 🪩",
          html: WELCOME_EMAIL_HTML,
        });
      } catch (emailError) {
        console.error("Resend error:", emailError);
        // Don't fail the whole request if email fails
      }
    }

    return NextResponse.json(
      { message: alreadySubscribed ? "You're already on the list!" : "Successfully subscribed!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
