
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/admin'

    if (token_hash && type) {
        const supabase = createClient()

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })
        if (!error) {
            // Redirect user to specified redirect URL or root of app
            // For password reset, we want to go to the reset form *after* verification,
            // but verifying OTP logs them in.
            // So if type is 'recovery', we should redirect to reset-password page.
            if (type === 'recovery') {
                // The user is now logged in. Redirect to reset password page to let them enter a new one.
                return NextResponse.redirect(new URL('/admin/reset-password', request.url))
            }
            return NextResponse.redirect(new URL(next, request.url))
        }
    }

    // return the user to an error page with some instructions
    return NextResponse.redirect(new URL('/admin/login?error=Invalid%20Link', request.url))
}
