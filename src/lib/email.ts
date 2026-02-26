import nodemailer from "nodemailer";

// ──────────── HTML SANITIZER ────────────

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ──────────── EMAIL CONFIG ────────────
// Set these environment variables in .env.local:
//   SMTP_HOST=smtp.gmail.com
//   SMTP_PORT=587
//   SMTP_USER=your-email@gmail.com
//   SMTP_PASS=your-app-password
//   ADMIN_EMAIL=admin@assunnahskill.org

const smtpConfig = {
  host: process.env.SMTP_HOST || "",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@assunnahskill.org";
const FROM_EMAIL = process.env.SMTP_USER || "noreply@assunnahskill.org";

function isEmailConfigured(): boolean {
  return !!(smtpConfig.host && smtpConfig.auth.user && smtpConfig.auth.pass);
}

function getTransporter() {
  return nodemailer.createTransport(smtpConfig);
}

// ──────────── SEND CONTACT NOTIFICATION ────────────

export async function sendContactNotification(data: {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
}) {
  if (!isEmailConfigured()) {
    console.log("[Email] SMTP not configured — skipping email notification");
    return { sent: false, reason: "SMTP not configured" };
  }

  // Sanitize all user-provided fields
  const name = esc(data.name);
  const phone = esc(data.phone);
  const email = data.email ? esc(data.email) : "";
  const subject = data.subject ? esc(data.subject) : "";
  const message = esc(data.message);

  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"আস-সুন্নাহ স্কিল" <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `📩 নতুন যোগাযোগ: ${subject || "সাধারণ জিজ্ঞাসা"} — ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1B8A50, #0D5C35); padding: 24px 28px; color: white;">
            <h2 style="margin: 0; font-size: 18px;">📩 নতুন যোগাযোগ বার্তা</h2>
            <p style="margin: 8px 0 0; opacity: 0.85; font-size: 13px;">আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট</p>
          </div>
          <div style="padding: 24px 28px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; font-weight: 600; color: #6b7280; font-size: 13px; width: 100px;">নাম</td>
                <td style="padding: 10px 0; color: #1f2937; font-size: 14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 600; color: #6b7280; font-size: 13px;">ফোন</td>
                <td style="padding: 10px 0; color: #1f2937; font-size: 14px;">${phone}</td>
              </tr>
              ${email ? `<tr>
                <td style="padding: 10px 0; font-weight: 600; color: #6b7280; font-size: 13px;">ইমেইল</td>
                <td style="padding: 10px 0; color: #1f2937; font-size: 14px;">${email}</td>
              </tr>` : ""}
              ${subject ? `<tr>
                <td style="padding: 10px 0; font-weight: 600; color: #6b7280; font-size: 13px;">বিষয়</td>
                <td style="padding: 10px 0; color: #1f2937; font-size: 14px;">${subject}</td>
              </tr>` : ""}
            </table>
            <div style="margin-top: 16px; padding: 16px; background: #f9fafb; border-radius: 8px; border-left: 3px solid #1B8A50;">
              <p style="margin: 0 0 6px; font-weight: 600; color: #6b7280; font-size: 12px;">বার্তা</p>
              <p style="margin: 0; color: #1f2937; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <div style="padding: 16px 28px; background: #f3f4f6; text-align: center; font-size: 12px; color: #9ca3af;">
            এই ইমেইলটি assunnahskill.org ওয়েবসাইটের যোগাযোগ ফর্ম থেকে স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে।
          </div>
        </div>
      `,
    });

    return { sent: true };
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return { sent: false, reason: "Send failed" };
  }
}

// ──────────── SEND APPLICATION NOTIFICATION ────────────

export async function sendApplicationNotification(data: {
  applicantName: string;
  applicantPhone: string;
  courseTitle: string;
}) {
  if (!isEmailConfigured()) return { sent: false };

  // Sanitize all user-provided fields
  const applicantName = esc(data.applicantName);
  const applicantPhone = esc(data.applicantPhone);
  const courseTitle = esc(data.courseTitle);

  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"আস-সুন্নাহ স্কিল" <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `📋 নতুন ভর্তি আবেদন: ${applicantName} — ${courseTitle}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1B8A50, #0D5C35); padding: 24px 28px; color: white;">
            <h2 style="margin: 0; font-size: 18px;">📋 নতুন ভর্তি আবেদন</h2>
          </div>
          <div style="padding: 24px 28px;">
            <p style="font-size: 14px; color: #1f2937;"><strong>${applicantName}</strong> "${courseTitle}" কোর্সে ভর্তির জন্য আবেদন করেছেন।</p>
            <p style="font-size: 14px; color: #6b7280;">ফোন: ${applicantPhone}</p>
            <a href="#" style="display: inline-block; margin-top: 16px; padding: 10px 24px; background: #1B8A50; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">অ্যাডমিন প্যানেলে দেখুন</a>
          </div>
        </div>
      `,
    });

    return { sent: true };
  } catch {
    return { sent: false };
  }
}
