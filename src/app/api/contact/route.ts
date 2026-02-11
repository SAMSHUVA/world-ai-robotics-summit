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
                <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #0D0B1E 0%, #1FCB8F 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">${settings.shortName} ${settings.location}</h1>
                        <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">${settings.fullName}</p>
                    </div>
                    
                    <div style="padding: 30px; background-color: #fff;">
                        <h2 style="color: #333; font-size: 20px; margin-top: 0;">We Received Your Message</h2>
                        
                        <p style="color: #555; line-height: 1.6; font-size: 16px;">
                            Hello ${name},<br><br>
                            Thank you for reaching out to the <strong>${settings.shortName}</strong> team. We have received your message regarding <strong>"${subject}"</strong> and will get back to you as soon as possible.
                        </p>
                        
                        <div style="background-color: #f0fdf4; border-left: 4px solid #1FCB8F; padding: 15px; margin: 25px 0;">
                            <p style="margin: 0; font-size: 12px; color: #166534; text-transform: uppercase; font-weight: bold;">Your Message</p>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: #14532d; font-style: italic;">"${message}"</p>
                        </div>

                        <p style="font-size: 14px; line-height: 1.6; color: #666; margin-top: 20px;">
                            Our typical response time is within 24 hours. For urgent matters, please contact our support hotline.
                        </p>
                    </div>

                    <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0;">
                            Ref Ticket: #CNT-${contactMessage.id}
                        </p>
                        <p style="margin: 5px 0 0; font-weight: bold; color: #1FCB8F;">
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

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.contactMessage.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error: any) {
        console.error('Delete message error:', error);
        return NextResponse.json({ error: 'Failed to delete message: ' + error.message }, { status: 500 });
    }
}
