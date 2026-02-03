import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { to, subject, message } = body;

        if (!to || !subject || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.hostinger.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER || 'info@iaisr.com',
                pass: process.env.SMTP_PASS || 'Info@2520#i'
            }
        });

        await transporter.sendMail({
            from: `"IAISR Support" <${process.env.SMTP_USER || 'info@iaisr.com'}>`,
            to,
            subject,
            text: message,
            html: `<div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</div>`
        });

        return NextResponse.json({ message: 'Email sent successfully' });
    } catch (error: any) {
        console.error('Email Send Error:', error);
        return NextResponse.json({
            error: 'Failed to send email',
            details: error.message
        }, { status: 500 });
    }
}
