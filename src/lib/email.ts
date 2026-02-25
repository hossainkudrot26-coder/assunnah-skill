/**
 * Email utility for Assunnah Skill
 * Uses Resend API (free tier: 100 emails/day) or falls back to console log
 *
 * Set these environment variables:
 * - EMAIL_API_KEY: Resend API key (re_xxx...)
 * - EMAIL_FROM: Sender email (e.g., noreply@assunnahskill.org)
 * - ADMIN_EMAIL: Admin notification email
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const apiKey = process.env.EMAIL_API_KEY;
  const from = process.env.EMAIL_FROM || "noreply@assunnahskill.org";

  // If no API key, log and return
  if (!apiKey) {
    console.log(`[Email Skipped] No EMAIL_API_KEY. To: ${options.to}, Subject: ${options.subject}`);
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        reply_to: options.replyTo,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error(`[Email Error] ${res.status}: ${error}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Email Error]", error);
    return false;
  }
}

// ──────────── TEMPLATES ────────────

export function contactNotificationEmail(data: {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
}) {
  return {
    subject: `📩 নতুন যোগাযোগ বার্তা: ${data.subject || data.name}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #0D3B2E, #1B8A50); padding: 24px 28px;">
          <h1 style="color: white; font-size: 18px; margin: 0;">📩 নতুন যোগাযোগ বার্তা</h1>
          <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 6px 0 0;">আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট</p>
        </div>
        <div style="padding: 28px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-size: 13px; color: #6b7280; width: 100px;">নাম:</td>
              <td style="padding: 8px 0; font-size: 14px; font-weight: 600;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 13px; color: #6b7280;">ফোন:</td>
              <td style="padding: 8px 0; font-size: 14px;"><a href="tel:${data.phone}" style="color: #1B8A50;">${data.phone}</a></td>
            </tr>
            ${data.email ? `<tr><td style="padding: 8px 0; font-size: 13px; color: #6b7280;">ইমেইল:</td><td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${data.email}" style="color: #1B8A50;">${data.email}</a></td></tr>` : ""}
            ${data.subject ? `<tr><td style="padding: 8px 0; font-size: 13px; color: #6b7280;">বিষয়:</td><td style="padding: 8px 0; font-size: 14px; font-weight: 600;">${data.subject}</td></tr>` : ""}
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #f9fafb; border-radius: 8px; border-left: 3px solid #1B8A50;">
            <p style="font-size: 13px; color: #6b7280; margin: 0 0 6px;">বার্তা:</p>
            <p style="font-size: 14px; line-height: 1.6; margin: 0; color: #1f2937;">${data.message.replace(/\n/g, "<br>")}</p>
          </div>
        </div>
        <div style="padding: 16px 28px; background: #f3f4f6; text-align: center; font-size: 12px; color: #9ca3af;">
          আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট | উত্তর বাড্ডা, ঢাকা
        </div>
      </div>
    `,
  };
}

export function applicationNotificationEmail(data: {
  name: string;
  phone: string;
  courseTitle: string;
}) {
  return {
    subject: `📝 নতুন ভর্তি আবেদন: ${data.name} — ${data.courseTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #0D3B2E, #1B8A50); padding: 24px 28px;">
          <h1 style="color: white; font-size: 18px; margin: 0;">📝 নতুন ভর্তি আবেদন</h1>
        </div>
        <div style="padding: 28px;">
          <p style="font-size: 14px; margin: 0 0 8px;"><strong>${data.name}</strong> "${data.courseTitle}" কোর্সে আবেদন করেছেন।</p>
          <p style="font-size: 13px; color: #6b7280; margin: 0;">ফোন: ${data.phone}</p>
          <div style="margin-top: 20px;">
            <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin/applications"
               style="display: inline-block; padding: 10px 20px; background: #1B8A50; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
              আবেদন দেখুন →
            </a>
          </div>
        </div>
      </div>
    `,
  };
}

export function applicationStatusEmail(data: {
  name: string;
  courseTitle: string;
  status: string;
  email: string;
}) {
  const statusBn: Record<string, string> = {
    ACCEPTED: "গৃহীত হয়েছে ✅",
    REJECTED: "বাতিল করা হয়েছে",
    UNDER_REVIEW: "পর্যালোচনায় আছে",
  };

  const statusMsg = statusBn[data.status] || data.status;
  const isAccepted = data.status === "ACCEPTED";

  return {
    subject: `আবেদন ${statusMsg} — ${data.courseTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #0D3B2E, #1B8A50); padding: 24px 28px;">
          <h1 style="color: white; font-size: 18px; margin: 0;">আবেদনের আপডেট</h1>
          <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 6px 0 0;">আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট</p>
        </div>
        <div style="padding: 28px;">
          <p style="font-size: 15px; margin: 0 0 12px;">প্রিয় <strong>${data.name}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
            আপনার "<strong>${data.courseTitle}</strong>" কোর্সে ভর্তি আবেদন <strong>${statusMsg}</strong>।
          </p>
          ${isAccepted ? `
            <div style="padding: 16px; background: #F0FDF4; border-radius: 8px; border-left: 3px solid #1B8A50; margin-bottom: 16px;">
              <p style="font-size: 14px; color: #1B8A50; font-weight: 600; margin: 0;">🎉 অভিনন্দন!</p>
              <p style="font-size: 13px; color: #166534; margin: 6px 0 0;">ভর্তি প্রক্রিয়ার পরবর্তী ধাপ সম্পর্কে শীঘ্রই আমরা আপনাকে জানাবো।</p>
            </div>
          ` : ""}
          <p style="font-size: 13px; color: #6b7280; margin: 0;">প্রশ্ন থাকলে যোগাযোগ করুন: +8809610-001089</p>
        </div>
        <div style="padding: 16px 28px; background: #f3f4f6; text-align: center; font-size: 12px; color: #9ca3af;">
          আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট | উত্তর বাড্ডা, ঢাকা
        </div>
      </div>
    `,
  };
}
