import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER || 'info@iaisr.com',
        pass: process.env.SMTP_PASS || 'Info@2520#i'
    }
});

export async function GET() {
    try {
        const applications = await (prisma as any).speakerApplication.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(applications);
    } catch (error) {
        console.error('Fetch speaker applications error:', error);
        return NextResponse.json({ error: 'Failed to fetch speaker applications' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            fullName,
            email,
            whatsappNumber,
            linkedin,
            website,
            role,
            company,
            bio,
            title,
            type,
            description,
            duration
        } = body;

        // Validate all required fields from all steps
        if (!fullName || !email) {
            return NextResponse.json({ error: 'Step 1: Full name and email are required' }, { status: 400 });
        }

        if (!role || !company || !bio) {
            return NextResponse.json({ error: 'Step 2: Role, company, and bio are required' }, { status: 400 });
        }

        if (!title || !description) {
            return NextResponse.json({ error: 'Step 3: Session title and description are required' }, { status: 400 });
        }

        // Map frontend fields to Prisma fields
        const application = await (prisma as any).speakerApplication.create({
            data: {
                fullName,
                email,
                whatsappNumber,
                bio,
                linkedinUrl: linkedin,
                websiteUrl: website,
                currentPosition: role,
                organization: company,
                yearsExperience: 5,
                sessionTitle: title,
                sessionType: type,
                sessionDescription: description,
                durationPreference: parseInt(duration) || 30,
                status: "PENDING"
            }
        });

        // Send Auto-Reply Email
        try {
            const emailHtml = `
                <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #050510; color: #ffffff; border-radius: 24px; border: 1px solid rgba(91, 77, 255, 0.2);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #5B4DFF; font-size: 28px; margin: 0;">WARS '26 SINGAPORE</h1>
                        <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 5px;">Speaker Application Portal</p>
                    </div>
                    
                    <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 20px;">Speaker Application Received</h2>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8);">
                        Hello ${fullName},<br><br>
                        Thank you for applying to be a speaker at the <strong>World AI & Robotics Summit 2026</strong> in Singapore. We have received your talk proposal titled: <strong>"${title}"</strong>.
                        <br><br>
                        Our scientific committee is currently reviewing applications to ensure a high-impact program. You can expect to hear from us within 7-10 business days regarding the status of your proposal.
                    </p>
                    
                    <div style="background: rgba(255, 255, 255, 0.03); padding: 20px; border-radius: 16px; margin: 30px 0; border: 1px solid rgba(255, 255, 255, 0.05);">
                        <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.4); text-transform: uppercase;">Submission Snapshot</p>
                        <p style="margin: 10px 0 0 0; font-size: 15px; color: #ffffff;">Session: <span style="color: #5B4DFF;">${title}</span></p>
                        <p style="margin: 5px 0 0 0; font-size: 15px; color: #ffffff;">Format: ${type} (${duration} mins)</p>
                    </div>

                    <p style="font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.6);">
                        If you need to make any changes to your submission, please reply to this email directly.
                    </p>

                    <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                        <p style="font-size: 13px; color: rgba(255,255,255,0.4);">
                            Ref Code: #SPK-APP-${application.id}
                        </p>
                        <p style="font-size: 14px; font-weight: 700; margin-top: 20px; color: #5B4DFF;">
                            WARS '26 Scientific Committee
                        </p>
                    </div>
                </div>
            `;

            await transporter.sendMail({
                from: `"WARS '26 Committee" <${process.env.SMTP_USER || 'info@iaisr.com'}>`,
                to: email,
                subject: `Application Received: ${title} - WARS '26 Singapore`,
                html: emailHtml
            });
        } catch (emailErr) {
            console.error('Speaker Auto-Reply Email Failed:', emailErr);
        }

        return NextResponse.json(application);
    } catch (error: any) {
        console.error('Speaker Application POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const body = await request.json();
        const {
            status,
            fullName,
            email,
            whatsappNumber,
            bio,
            linkedin,
            website,
            role,
            company,
            title,
            type,
            description,
            duration
        } = body;

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const updateData: any = {};
        if (status) updateData.status = status;
        if (fullName) updateData.fullName = fullName;
        if (email) updateData.email = email;
        if (whatsappNumber !== undefined) updateData.whatsappNumber = whatsappNumber;
        if (bio !== undefined) updateData.bio = bio;
        if (linkedin !== undefined) updateData.linkedinUrl = linkedin;
        if (website !== undefined) updateData.websiteUrl = website;
        if (role) updateData.currentPosition = role;
        if (company) updateData.organization = company;
        if (title) updateData.sessionTitle = title;
        if (type) updateData.sessionType = type;
        if (description) updateData.sessionDescription = description;
        if (duration) updateData.durationPreference = parseInt(duration);

        const updated = await (prisma as any).speakerApplication.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        // If status is ACCEPTED, send welcome onboarding email
        if (status === 'ACCEPTED') {
            try {
                const welcomeHtml = `
                    <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #050510; color: #ffffff; border-radius: 24px; border: 1px solid rgba(91, 77, 255, 0.2);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <img src="https://wars2026.iaisr.info/Iaisr%20Logo.webp" alt="WARS '26" style="height: 60px; margin-bottom: 20px;">
                            <h1 style="color: #5B4DFF; font-size: 28px; margin: 0;">Congratulations!</h1>
                            <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 5px;">WARS '26 Singapore</p>
                        </div>
                        
                        <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 20px; text-align: center;">Welcome Onboard as a Speaker</h2>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8);">
                            Hello ${updated.fullName},<br><br>
                            We are thrilled to inform you that your session proposal, <strong>"${updated.sessionTitle}"</strong>, has been <strong>ACCEPTED</strong> for the World AI & Robotics Summit 2026!
                            <br><br>
                            Your expertise and insights will be a cornerstone of our technical program. We look forward to having you join us in Singapore this coming year.
                        </p>
                        
                        <div style="background: rgba(91, 77, 255, 0.1); padding: 25px; border-radius: 16px; margin: 30px 0; border: 1px solid rgba(91, 77, 255, 0.3); text-align: center;">
                            <h3 style="margin: 0; color: #ffffff; font-size: 18px;">What's Next?</h3>
                            <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin-top: 10px;">
                                Our speaker management team will contact you shortly with:
                            </p>
                            <ul style="text-align: left; color: rgba(255,255,255,0.8); font-size: 14px; margin-top: 15px;">
                                <li>Travel & Accommodation details</li>
                                <li>Technical requirements for your session</li>
                                <li>Speaker portal login credentials</li>
                                <li>Promotional kit for your social channels</li>
                            </ul>
                        </div>

                        <div style="text-align: center; margin: 40px 0;">
                            <a href="https://wars2026.iaisr.info/speakers" style="background: #5B4DFF; color: #ffffff; padding: 16px 32px; border-radius: 30px; text-decoration: none; font-weight: 700; display: inline-block;">View Event Details</a>
                        </div>

                        <p style="font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.6); text-align: center;">
                            We are excited to build the future together.
                        </p>

                        <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                            <p style="font-size: 14px; font-weight: 700; color: #5B4DFF;">
                                WARS '26 Scientific Committee
                            </p>
                            <p style="font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 5px;">
                                Singapore | Oct 2026
                            </p>
                        </div>
                    </div>
                `;

                await transporter.sendMail({
                    from: `"WARS '26 Committee" <${process.env.SMTP_USER || 'info@iaisr.com'}>`,
                    to: updated.email,
                    subject: `Welcome Onboard: Your WARS '26 Speaker Application is Accepted!`,
                    html: welcomeHtml
                });
            } catch (emailErr) {
                console.error('Speaker Acceptance Email Failed:', emailErr);
            }
        }

        return NextResponse.json(updated);
    } catch (error: any) {
        console.error('Speaker Application PATCH error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await (prisma as any).speakerApplication.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Speaker Application DELETE error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
