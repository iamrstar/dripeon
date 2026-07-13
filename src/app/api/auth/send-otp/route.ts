import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Otp from "@/models/Otp";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove any existing OTPs for this email to prevent spam
    await Otp.deleteMany({ email });

    // Save new OTP to database (expires in 5 mins)
    await Otp.create({
      email,
      otp,
    });

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // Send the actual email
    await transporter.sendMail({
      from: `"Dripeon Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Dripeon Login Code",
      text: `Welcome to Dripeon! Your secure login code is: ${otp}. It will expire in 5 minutes. If you did not request this, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Dripeon Authentication</h2>
          <p style="font-size: 16px; color: #555; line-height: 1.5;">
            Hello, <br><br>
            Here is your secure login code. It will expire in 5 minutes.
          </p>
          <div style="margin: 30px 0; padding: 20px; background-color: #f4f4f4; border-radius: 5px; text-align: center;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #888; border-top: 1px solid #eaeaea; padding-top: 20px;">
            If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.
          </p>
        </div>
      `,
    });

    console.log(`🚀 EMAIL SENT TO: ${email} (OTP: ${otp})`);

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP generation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
