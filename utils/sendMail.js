import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendWelcomeEmail = async (to, name, code) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,        // ✅ correct
        pass: process.env.SMTP_PASSWORD      // ✅ corrected
      },
    });
console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL);
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD);

    const mailOptions = {
      from: `"Azeem khan Gym Management" <${process.env.SMTP_EMAIL}>`,
      to: to,
      subject: "🎉 Welcome to Our Gym!",
      html: `
        <h2>Hello ${name},</h2>
        <p>Welcome to Azeem khan Gym Management!</p>
        <p>Your registration is successful. 🎉</p>
        <p><strong>Your Member Code:</strong> ${code}</p>
        <br />
        <p>We're excited to have you on board 💪</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent to:", to);
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
  }
};
