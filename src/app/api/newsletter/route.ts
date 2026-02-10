import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { getSiteSettings } from '@/config/settings';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const subscriber = await prisma.subscriber.create({
            data: { email }
        });

        // Fetch dynamic settings
        const settings = await getSiteSettings();

        // Send Welcome Email
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.hostinger.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.SMTP_USER || settings.social.email,
                    pass: process.env.SMTP_PASS || 'Info@2520#i'
                }
            });

            const emailHtml = `
                <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #050510; color: #ffffff; border-radius: 24px; border: 1px solid rgba(91, 77, 255, 0.2);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #5B4DFF; font-size: 28px; margin: 0;">${settings.name} '${settings.year.slice(-2)} ${settings.location.toUpperCase()}</h1>
                        <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 5px;">${settings.fullName}</p>
                    </div>
                    
                    <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 20px;">Welcome to Our Community!</h2>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8);">
                        Hello,<br><br>
                        Thank you for subscribing to the ${settings.name} '${settings.year.slice(-2)} newsletter. You have successfully joined a global community of innovators, researchers, and tech leaders.
                    </p>

                    <div style="background: rgba(255, 255, 255, 0.03); padding: 20px; border-radius: 16px; margin: 30px 0; border: 1px solid rgba(255, 255, 255, 0.05);">
                        <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #00FF88;">What to Expect</h3>
                        <p style="margin: 0; font-size: 15px; color: rgba(255,255,255,0.7); line-height: 1.5;">
                            We are committed to sending only <strong>valuable and correct content</strong>. You will receive exclusive updates on keynote speakers, schedule changes, and groundbreaking research papers.
                        </p>
                    </div>

                    <div style="padding: 20px; border-left: 3px solid #5B4DFF; background: rgba(91, 77, 255, 0.05); margin-bottom: 30px;">
                        <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.8); font-style: italic;">
                            "We respect your inbox. We do not spam."
                        </p>
                    </div>

                    <p style="font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.5);">
                        <strong>Privacy & GDPR:</strong> Your data is secure with us. We adhere to strict GDPR guidelines to protect your personal information. You can review our full <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://wars2026.iaisr.info'}/privacy-policy" style="color: #5B4DFF;">Privacy Policy</a> at any time.
                    </p>
                    
                    <p style="font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.5);">
                        If you wish to stop receiving these updates, you can unsubscribe by replying to this email with "Unsubscribe" or by contacting us directly.
                    </p>

                    <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                        <p style="font-size: 13px; color: rgba(255,255,255,0.4);">
                            ${settings.fullName} Committee<br>
                            ${settings.location}
                        </p>
                    </div>
                </div>
            `;

            await transporter.sendMail({
                from: `"${settings.name} '${settings.year.slice(-2)} Newsletter" <${process.env.SMTP_USER || settings.social.email}>`,
                to: email,
                subject: `Welcome to ${settings.name} '${settings.year.slice(-2)} Community`,
                html: emailHtml
            });
        } catch (emailError) {
            console.error('Newsletter Welcome Email Failed:', emailError);
        }

        return NextResponse.json({ message: 'Success', subscriber }, { status: 201 });
    } catch (error: any) {
        console.error('Newsletter Subscription Error:', error);
        // Handle unique constraint if email already exists
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 });
        }
        return NextResponse.json({
            error: 'Failed to subscribe',
            details: error.message
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const subscribers = await prisma.subscriber.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(subscribers);
    } catch (error) {
        console.error('Fetch Subscribers Error:', error);
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

        await prisma.subscriber.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error: any) {
        console.error('Delete subscriber error:', error);
        return NextResponse.json({ error: 'Failed to delete subscriber: ' + error.message }, { status: 500 });
    }
}
