import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { fullName, email, whatsappNumber, country } = body;

        if (!fullName || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const inquiry = await (prisma as any).conferenceInquiry.create({
            data: {
                fullName,
                email,
                whatsappNumber: whatsappNumber || '',
                country: country || 'Not Specified'
            }
        });

        // Send Confirmation Email
        try {
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
                        <h1 style="color: #5B4DFF; font-size: 28px; margin: 0;">WARS '26 SINGAPORE</h1>
                        <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 5px;">World AI & Robotics Summit</p>
                    </div>
                    
                    <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 20px;">Welcome to the Future of Innovation</h2>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8);">
                        Hello ${fullName},<br><br>
                        We are delighted to confirm receipt of your inquiry for the <strong>World AI & Robotics Summit 2026</strong>. Thank you for your interest in joining the global leaders of our industry.
                        <br><br>
                        Our specialized support team is currently reviewing your details and will connect with you shortly to assist with your specific requirements.
                    </p>
                    
                    <div style="background: rgba(255, 255, 255, 0.03); padding: 20px; border-radius: 16px; margin: 30px 0; border: 1px solid rgba(255, 255, 255, 0.05);">
                        <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.4); text-transform: uppercase;">Inquiry Details</p>
                        <p style="margin: 10px 0 0 0; font-size: 16px; color: #ffffff;">Contact: <span style="color: #5B4DFF;">${whatsappNumber || 'N/A'}</span></p>
                        <p style="margin: 5px 0 0 0; font-size: 16px; color: #ffffff;">Region: ${country || 'Global'}</p>
                    </div>

                    <p style="font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.6);">
                        While you wait, we invite you to view our <a href="https://wars2026.iaisr.info/sessions" style="color: #5B4DFF; text-decoration: none; font-weight: bold;">latest summit schedule</a> or explore our confirmed speakers.
                    </p>

                    <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                        <p style="font-size: 13px; color: rgba(255,255,255,0.4);">
                            Ref Case: #INQ-${inquiry.id}
                        </p>
                        <p style="font-size: 14px; font-weight: 700; margin-top: 20px; color: #5B4DFF;">
                            WARS '26 Support Team
                        </p>
                    </div>
                </div>
            `;

            await transporter.sendMail({
                from: `"WARS '26 Support" <${process.env.SMTP_USER || 'info@iaisr.com'}>`,
                to: email,
                subject: `Inquiry Received: WARS '26 Singapore`,
                html: emailHtml
            });
        } catch (emailError) {
            console.error('Inquiry Auto-Reply Failed:', emailError);
        }

        return NextResponse.json({ message: 'Success', inquiry }, { status: 201 });
    } catch (error: any) {
        console.error('Inquiry Submission Error Detail:', error);
        return NextResponse.json({
            error: 'Failed to submit inquiry',
            details: error.message
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const inquiries = await (prisma as any).conferenceInquiry.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(Array.isArray(inquiries) ? inquiries : []);
    } catch (error) {
        console.error('Fetch Inquiries Error:', error);
        return NextResponse.json([]);
    }
}
