import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const file = formData.get('file') as File;
        const authorName = formData.get('authorName') as string;
        const country = formData.get('country') as string;
        const email = formData.get('email') as string;
        const organization = formData.get('organization') as string;
        const whatsappNumber = formData.get('whatsappNumber') as string || '';
        const coAuthors = formData.get('coAuthors') as string || '';
        const title = formData.get('paperTitle') as string || '';
        const track = formData.get('track') as string || '';

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        if (!authorName || !email || !country || !organization) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Upload file to Supabase Storage
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const filePath = `papers/${filename}`;

        const { data, error: uploadError } = await supabase.storage
            .from('conference-files')
            .upload(filePath, buffer, {
                contentType: file.type || 'application/pdf',
                upsert: false
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            return NextResponse.json({
                error: 'File upload failed: ' + uploadError.message,
                hint: 'Make sure the "conference-files" storage bucket exists in Supabase'
            }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('conference-files')
            .getPublicUrl(filePath);

        // Save to Database
        const submission = await (prisma as any).paperSubmission.create({
            data: {
                authorName,
                country,
                email,
                organization,
                fileUrl: publicUrl,
                whatsappNumber,
                coAttributes: coAuthors,
                title,
                track,
                status: 'PENDING'
            }
        });

        // Send Arrival Email
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
                    
                    <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 20px;">Paper Received Successfully</h2>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8);">
                        Hello ${authorName},<br><br>
                        Thank you for submitting your research abstract to the World AI & Robotics Summit 2026. This email confirms that we have successfully received your submission.
                    </p>
                    
                    <div style="background: rgba(255, 255, 255, 0.03); padding: 20px; border-radius: 16px; margin: 30px 0; border: 1px solid rgba(255, 255, 255, 0.05);">
                        <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.4); text-transform: uppercase;">Submission Details</p>
                        <p style="margin: 10px 0 0 0; font-size: 16px; font-weight: 700; color: #5B4DFF;">${title || 'Untitled Research'}</p>
                        <p style="margin: 5px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.6);">${track || 'General Track'}</p>
                    </div>

                    <p style="font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.6);">
                        Your paper is currently in our preliminary queue. Our team will verify the documents and move it to the **Peer Review Phase** shortly. You will be notified once the review process begins.
                    </p>

                    <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                        <p style="font-size: 13px; color: rgba(255,255,255,0.4);">
                            Submission ID: #WARS-26-${submission.id.toString().padStart(4, '0')}
                        </p>
                        <p style="font-size: 14px; font-weight: 700; margin-top: 20px; color: #5B4DFF;">
                            World AI & Robotics Summit Committee
                        </p>
                    </div>
                </div>
            `;

            await transporter.sendMail({
                from: `"WARS '26 Committee" <${process.env.SMTP_USER || 'info@iaisr.com'}>`,
                to: email,
                subject: `Submission Received: WARS '26 Singapore (#WARS-${submission.id})`,
                html: emailHtml
            });
        } catch (emailError) {
            console.error('Acknowledgement email failed:', emailError);
        }

        return NextResponse.json({
            success: true,
            submission
        });

    } catch (error: any) {
        console.error('Submission error:', error);
        return NextResponse.json({
            error: 'Submission failed: ' + error.message,
            details: error.stack
        }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const body = await request.json();
        const updated = await (prisma as any).paperSubmission.update({
            where: { id: parseInt(id) },
            data: body
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        console.error('Update paper error:', error);
        return NextResponse.json({ error: 'Update failed: ' + error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await (prisma as any).paperSubmission.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete paper error:', error);
        return NextResponse.json({ error: 'Delete failed: ' + error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const submissions = await (prisma as any).paperSubmission.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json(submissions);
    } catch (error: any) {
        console.error('Get paper submissions error:', error);
        return NextResponse.json({ error: 'Failed to fetch submissions: ' + error.message }, { status: 500 });
    }
}
