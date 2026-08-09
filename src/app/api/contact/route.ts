import { NextResponse } from "next/server";
import { Resend } from "resend";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized. Please login to send a message.' }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    const file = formData.get('file') as File | null;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const attachments = [];

    if (file && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
      }
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      attachments.push({
        filename: file.name,
        content: buffer,
        contentType: file.type
      });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY in environment variables.");
      return NextResponse.json({ error: 'Email service is currently unavailable. Please try again later or use our contact numbers.' }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const data = await resend.emails.send({
      from: 'Dripeon Contact <onboarding@resend.dev>',
      to: 'info.dripeon@gmail.com',
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      attachments: attachments,
    });

    if (data.error) {
      throw new Error(data.error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact API error:', error);
    // Provide a user-friendly error message instead of raw technical errors
    let errorMessage = error.message || 'Failed to send message. Please try again later.';
    if (error.code === 'EAUTH' || error.message?.includes('credentials')) {
       errorMessage = 'Email service configuration error. Please contact us via phone.';
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
