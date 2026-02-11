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
                <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #0D0B1E 0%, #1FCB8F 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">${settings.name} '${settings.year.slice(-2)}</h1>
                        <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">${settings.fullName}</p>
                    </div>
                    
                    <div style="padding: 30px; background-color: #fff;">
                        <h2 style="color: #333; font-size: 20px; margin-top: 0;">Welcome to Our Community!</h2>
                        
                        <p style="color: #555; line-height: 1.6; font-size: 16px;">
                            Hello,<br><br>
                            Thank you for subscribing to the <strong>${settings.name} '${settings.year.slice(-2)}</strong> newsletter. You have successfully joined a global community of innovators, researchers, and tech leaders.
                        </p>

                        <div style="background-color: #f0fdf4; border-left: 4px solid #1FCB8F; padding: 15px; margin: 25px 0;">
                            <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #166534;">What to Expect</h3>
                            <p style="margin: 0; font-size: 14px; color: #14532d; line-height: 1.5;">
                                We are committed to sending only <strong>valuable and correct content</strong>. You will receive exclusive updates on keynote speakers, schedule changes, and groundbreaking research papers.
                            </p>
                        </div>

                        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
                            <p style="margin: 0; font-size: 14px; color: #64748b; font-style: italic; text-align: center;">
                                "We respect your inbox. We do not spam."
                            </p>
                        </div>

                        <p style="font-size: 14px; line-height: 1.6; color: #666; margin-top: 30px;">
                            <strong>Privacy & GDPR:</strong> Your data is secure with us. We adhere to strict GDPR guidelines. You can review our full <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://wars2026.iaisr.info'}/privacy-policy" style="color: #1FCB8F; text-decoration: none;">Privacy Policy</a> at any time.
                        </p>
                    </div>

                    <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0;">
                            &copy; ${settings.year} ${settings.fullName}. All rights reserved.
                        </p>
                        <p style="margin: 5px 0 0;">
                            ${settings.location}
                        </p>
                        <div style="margin-top: 10px;">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #1FCB8F; text-decoration: none;">Visit Website</a>
                        </div>
                    </div>
                </div>
            `;

            await transporter.sendMail({
                from: `"${settings.name} '${settings.year.slice(-2)} Newsletter" <${process.env.SMTP_USER || settings.social.email}>`,
                to: email,
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
