import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import nodemailer from 'nodemailer';
import { getSiteSettings } from '@/config/settings';

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
                        <h2 style="color: #333; font-size: 20px; margin-top: 0;">Paper Received Successfully</h2>
                        
                        <p style="color: #555; line-height: 1.6; font-size: 16px;">
                            Hello ${authorName},<br><br>
                            Thank you for submitting your research abstract to the <strong>${settings.fullName}</strong>. This email confirms that we have successfully received your submission.
                        </p>
                        
                        <div style="background-color: #f0fdf4; border-left: 4px solid #1FCB8F; padding: 15px; margin: 25px 0;">
                            <p style="margin: 0; font-size: 12px; color: #166534; text-transform: uppercase; font-weight: bold;">Submission Details</p>
                            <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: 700; color: #14532d;">${title || 'Untitled Research'}</p>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: #166534;">${track || 'General Track'}</p>
                        </div>

                        <p style="font-size: 14px; line-height: 1.6; color: #666; margin-top: 20px;">
                            Your paper is currently in our preliminary queue. Our team will verify the documents and move it to the **Peer Review Phase** shortly. You will be notified once the review process begins.
                        </p>
                    </div>

                    <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0;">
                            Submission ID: #${settings.name.toUpperCase()}-${settings.year.slice(-2)}-${submission.id.toString().padStart(4, '0')}
                        </p>
                        <p style="margin: 5px 0 0; font-weight: bold; color: #1FCB8F;">
                            ${settings.fullName} Committee
                        </p>
                    </div>
                </div>
            `;

            await transporter.sendMail({
                from: `"${settings.shortName} Committee" <${process.env.SMTP_USER || 'info@iaisr.com'}>`,
                to: email,
                subject: `Submission Received: ${settings.shortName} ${settings.location} (#${settings.name.toUpperCase()}-${submission.id})`,
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

export async function PUT(request: Request) {
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
