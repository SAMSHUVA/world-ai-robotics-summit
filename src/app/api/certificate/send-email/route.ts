import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getSiteSettings } from '@/config/settings';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { recipientEmail, recipientName, certificateLink, category } = body;

        if (!recipientEmail || !recipientName || !certificateLink) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

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

        // Dynamic content based on category
        const getEmailBody = (cat: string, name: string) => {
            const c = cat.toLowerCase();
            if (c.includes('keynote')) {
                return `We express our sincere gratitude for your invaluable contribution as a <strong>Keynote Speaker</strong>. Your insights greatly enriched our summit and inspired our attendees.`;
            } else if (c.includes('presenter') || c.includes('paper')) {
                return `Thank you for sharing your research and expertise as a <strong>Presenter</strong>. Your presentation was a vital part of our success.`;
            } else if (c.includes('committee') || c.includes('ocm') || c.includes('organizing')) {
                return `We deeply appreciate your dedication and hard work as a member of the <strong>Organizing Committee</strong>. This summit would not have been possible without your efforts.`;
            } else if (c.includes('advisory') || c.includes('board')) {
                return `Thank you for your strategic guidance and support as a member of our <strong>Advisory Board</strong>. Your leadership is greatly valued.`;
            } else {
                return `Thank you for participating in the AgTech Transformation Summit. We hope you found the sessions valuable and insightful.`;
            }
        };

        const emailBody = getEmailBody(category || '', recipientName);

        const emailHtml = `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                <div style="background: linear-gradient(135deg, #0D0B1E 0%, #4F8EF7 100%); padding: 40px 20px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 28px; letter-spacing: 1px;">Certificate Issued</h1>
                    <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">${settings.fullName}</p>
                </div>
                
                <div style="padding: 40px 30px;">
                    <h2 style="color: #1a1a1a; font-size: 22px; margin-top: 0;">Congratulations, ${recipientName}!</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                        ${emailBody}
                    </p>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Your official certificate for <strong>${category || 'Participation'}</strong> is now available for download.
                    </p>
                    
                    <div style="margin: 35px 0; text-align: center;">
                        <a href="${certificateLink}" style="background-color: #4F8EF7; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(79, 142, 247, 0.2);">
                            View My Certificate
                        </a>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #4F8EF7;">
                        <strong>Quick Tip:</strong> This link also allows anyone to verify the authenticity of your certificate using our secure blockchain-backed verification portal.
                    </p>
                </div>
                
                <div style="background-color: #f3f4f6; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 14px; color: #374151; font-weight: bold;">${settings.shortName} Organizing Committee</p>
                    <p style="margin: 5px 0 0; font-size: 12px; color: #9ca3af;">Sent on behalf of ${settings.iaisrFullName}</p>
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af;">
                        This is an automated message. Please do not reply to this email.
                    </div>
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: `"${settings.shortName} Certificates" <${process.env.SMTP_USER || 'info@iaisr.com'}>`,
            to: recipientEmail,
            subject: `Official Certificate: ${recipientName} - ${category || settings.shortName}`,
            html: emailHtml
        });

        return NextResponse.json({ message: 'Certificate email sent successfully' });
    } catch (error: any) {
        console.error('Certificate Email Dispatch Failed:', error);
        return NextResponse.json({
            error: 'Failed to send certificate email',
            details: error.message
        }, { status: 500 });
    }
}
