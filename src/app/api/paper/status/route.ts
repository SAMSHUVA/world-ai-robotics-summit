import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, status, comments } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const paper = await (prisma as any).paperSubmission.findUnique({
            where: { id: parseInt(id) },
            include: { reviews: { orderBy: { createdAt: 'desc' }, take: 1 } }
        });

        if (!paper) {
            return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
        }

        const updatedPaper = await (prisma as any).paperSubmission.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        // Use provided comments or fall back to the latest review comment
        const finalComments = comments || (paper.reviews && paper.reviews[0]?.comments) || '';

        // Configure Mailer
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.hostinger.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER || 'info@iaisr.com',
                pass: process.env.SMTP_PASS || 'Info@2520#i'
            }
        });

        let emailSubject = '';
        let emailHeadline = '';
        let emailMessage = '';
        let showComments = false;

        if (status === 'UNDER_REVIEW') {
            emailSubject = `Peer Review Phase Started: WARS '26 Singapore (#WARS-${paper.id})`;
            emailHeadline = 'In Peer Review Phase';
            emailMessage = `Your paper title: <strong>${paper.title}</strong> has been assigned to our technical committee for peer review. We will notify you once the committee provides their evaluation and decision.`;
        } else if (status === 'ACCEPTED') {
            emailSubject = `Congratulations! Paper Accepted: WARS '26 Singapore (#WARS-${paper.id})`;
            emailHeadline = 'Paper Successfully Accepted';
            emailMessage = `We are pleased to inform you that your paper <strong>${paper.title}</strong> has been accepted for presentation at WARS '26 Singapore. Our reviewers were impressed with your work.`;
            showComments = true;
        } else if (status === 'NEEDS_REVISION') {
            emailSubject = `Revisions Required: WARS '26 Singapore (#WARS-${paper.id})`;
            emailHeadline = 'Revision Requested';
            emailMessage = `The technical committee has reviewed your paper <strong>${paper.title}</strong> and determined that some adjustments are needed before a final decision can be made. Please address the comments below and resubmit via the portal.`;
            showComments = true;
        } else if (status === 'REJECTED') {
            emailSubject = `Update on your Submission: WARS '26 Singapore (#WARS-${paper.id})`;
            emailHeadline = 'Submission Status Update';
            emailMessage = `Thank you for your interest in WARS '26. After careful evaluation of your submission <strong>${paper.title}</strong>, we regret to inform you that we are unable to include it in the conference program this year.`;
            showComments = true;
        }

        if (emailSubject) {
            const emailHtml = `
                <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #050510; color: #ffffff; border-radius: 24px; border: 1px solid rgba(91, 77, 255, 0.2);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #5B4DFF; font-size: 28px; margin: 0;">WARS '26 SINGAPORE</h1>
                        <p style="color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 5px;">World AI & Robotics Summit</p>
                    </div>
                    
                    <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 20px;">${emailHeadline}</h2>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8);">
                        Hello ${paper.authorName},<br><br>
                        ${emailMessage}
                    </p>
                    
                    ${showComments && finalComments ? `
                        <div style="background: rgba(91, 77, 255, 0.1); padding: 25px; border-radius: 16px; margin: 30px 0; border: 1px solid rgba(91, 77, 255, 0.2);">
                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #5B4DFF; font-weight: 800; text-transform: uppercase;">Reviewer Comments & Feedback</p>
                            <p style="margin: 0; font-size: 15px; color: rgba(255,255,255,0.9); line-height: 1.6; font-style: italic;">
                                "${finalComments}"
                            </p>
                        </div>
                    ` : ''}

                    <p style="font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.4);">
                        Please keep this Submission ID for your records: <strong>#WARS-26-${paper.id.toString().padStart(4, '0')}</strong>
                    </p>

                    <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                        <p style="font-size: 14px; color: rgba(255,255,255,0.4);">
                            Questions? Reach us at info@iaisr.com
                        </p>
                        <p style="font-size: 14px; font-weight: 700; margin-top: 20px; color: #5B4DFF;">
                            WARS '26 Organizing Committee
                        </p>
                    </div>
                </div>
            `;

            await transporter.sendMail({
                from: `"WARS '26 Committee" <${process.env.SMTP_USER || 'info@iaisr.com'}>`,
                to: paper.email,
                subject: emailSubject,
                html: emailHtml
            });
        }

        return NextResponse.json({ success: true, paper });
    } catch (error: any) {
        console.error('Update paper status error:', error);
        return NextResponse.json({ error: 'Failed to update status: ' + error.message }, { status: 500 });
    }
}
