import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendWelcomeEmail = async (to, name, code, qrImageData64) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      secure: true,
    });

    const mailOptions = {
      from: `"Azeem Khan Gym Management" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: "🎉 Welcome to Azeem Khan Gym Management!",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2 style="color: #2c3e50;">Welcome to Azeem Khan Gym Management!</h2>
          <p>Your registration is successful. 🎉</p>
          <p><strong>Your Member Code:</strong> ${code}</p>
          <br />
          <p>Scan this QR code to check in:</p>
          <img src="cid:qrcode1234" alt="QR Code" width="200" style="border: 1px solid #ccc; padding: 10px;" />
          <br /><br />
          <p>We're excited to have you on board 💪</p>
        </div>
      `,
      attachments: [
        {
          filename: "qrcode.png",
          content: qrImageData64.split("base64,")[1], // only the base64 data part
          encoding: "base64",
          cid: "qrcode1234", // must match the img src="cid:qrcode1234"
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent to:", to);
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
  }
};
