import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { getSiteSettings } from '@/config/settings';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const contactMessage = await prisma.contactMessage.create({
            data: {
                name,
                email,
                subject,
                message
            }
        });

        // Send Auto-Reply Email
        try {
            const settings = await getSiteSettings();
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.hostinger.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.SMTP_USER || 'info@iaisr.com',
                    pass: process.env.SMTP_PASS || 'Info@2520#i'
                }
            });

            const emailHtml = `
                <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #050510; color: #ffffff; border-radius: 24px; border: 1px solid rgba(91, 77, 255, 0.2);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #5B4DFF; font-size: 28px; margin: 0;">${settings.shortName.toUpperCase()} ${settings.location.toUpperCase()}</h1>
                        <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 5px;">${settings.fullName}</p>
                    </div>
                    
                    <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 20px;">We Received Your Message</h2>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8);">
                        Hello ${name},<br><br>
                        Thank you for reaching out to the ${settings.shortName} team. We have received your message regarding <strong>"${subject}"</strong> and will get back to you as soon as possible.
                    </p>
                    
                    <div style="background: rgba(255, 255, 255, 0.03); padding: 20px; border-radius: 16px; margin: 30px 0; border: 1px solid rgba(255, 255, 255, 0.05);">
                        <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.4); text-transform: uppercase;">Your Message</p>
                        <p style="margin: 10px 0 0 0; font-size: 15px; color: rgba(255,255,255,0.7); font-style: italic;">"${message}"</p>
                    </div>

                    <p style="font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.6);">
                        Our typical response time is within 24 hours. For urgent matters, please contact our support hotline.
                    </p>

                    <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                        <p style="font-size: 13px; color: rgba(255,255,255,0.4);">
                            Ref Ticket: #CNT-${contactMessage.id}
                        </p>
                        <p style="font-size: 14px; font-weight: 700; margin-top: 20px; color: #5B4DFF;">
                            ${settings.shortName} Support Team
                        </p>
                    </div>
                </div>
            `;

            await transporter.sendMail({
                from: `"${settings.shortName} Support" <${process.env.SMTP_USER || 'info@iaisr.com'}>`,
                to: email,
                subject: `We received your message: ${subject}`,
                html: emailHtml
            });
        } catch (emailError) {
            console.error('Contact Auto-Reply Failed:', emailError);
        }

        return NextResponse.json({ message: 'Success', contactMessage }, { status: 201 });
    } catch (error: any) {
        console.error('Contact Submission Error:', error);
        return NextResponse.json({
            error: 'Failed to submit contact request',
            details: error.message
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(messages);
    } catch (error) {
        console.error('Fetch Messages Error:', error);
        return NextResponse.json([]);
    }
}
