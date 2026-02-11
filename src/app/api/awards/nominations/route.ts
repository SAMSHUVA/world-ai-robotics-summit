import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { getSiteSettings } from '@/config/settings';

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
        const nominations = await (prisma as any).awardNomination.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(nominations);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch nominations' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { category, nomineeName, affiliation, justification, nominatorName, nominatorEmail, nominatorPhone } = body;

        const nomination = await (prisma as any).awardNomination.create({
            data: {
                category,
                nomineeName,
                affiliation,
                justification,
                nominatorName: nominatorName || "",
                nominatorEmail: nominatorEmail || "",
                nominatorPhone: nominatorPhone || ""
            }
        });

        // Send Auto-Reply Email
        if (nominatorEmail) {
            try {
                const settings = await getSiteSettings();
                const emailHtml = `
                    <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; margin: 0 auto;">
                      <!-- Header -->
                      <div style="background: linear-gradient(135deg, #0D0B1E 0%, #1FCB8F 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">${settings.fullName}</h1>
                        <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">Nomination Confirmation</p>
                      </div>

                      <!-- Body -->
                      <div style="padding: 30px; color: #333; line-height: 1.6;">
                        <p>Dear <strong>${nominatorName || 'Colleague'}</strong>,</p>
                        
                        <p>Thank you for submitting a nomination for the <strong>Excellence Awards</strong> at the upcoming ${settings.fullName}.</p>
                        
                        <div style="background: #f5fcf9; border-left: 4px solid #1FCB8F; padding: 15px; margin: 20px 0;">
                          <p style="margin: 0; font-size: 14px; color: #555;"><strong>Nominee:</strong> ${nomineeName}</p>
                          <p style="margin: 5px 0 0; font-size: 14px; color: #555;"><strong>Category:</strong> ${category}</p>
                          <p style="margin: 5px 0 0; font-size: 14px; color: #555;"><strong>Affiliation:</strong> ${affiliation}</p>
                        </div>

                        <p>Our awards committee will review all submissions carefully. Shortlisted candidates and nominators will be notified by <strong>July 30, ${settings.year || new Date().getFullYear()}</strong>.</p>
                        
                        <p>Together, let's celebrate excellence in agricultural innovation.</p>

                        <p style="margin-top: 30px;">Best regards,<br><strong>${settings.shortName} Awards Committee</strong></p>
                      </div>

                      <!-- Footer -->
                      <div style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee;">
                        <p>&copy; ${new Date().getFullYear()} ${settings.fullName}. All rights reserved.</p>
                        <a href="${settings.urls.canonical}" style="color: #1FCB8F; text-decoration: none;">Visit Website</a>
                      </div>
                    </div>
                `;

                await transporter.sendMail({
                    from: `"${settings.shortName} Awards" <${process.env.SMTP_USER || 'info@iaisr.com'}>`,
                    to: nominatorEmail,
                    subject: `Nomination Received - ${settings.fullName}`,
                    html: emailHtml
                });
            } catch (emailErr) {
                console.error('Nomination Auto-Reply Email Failed:', emailErr);
            }
        }

        return NextResponse.json(nomination);
    } catch (error: any) {
        console.error('Nomination POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await (prisma as any).awardNomination.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
