# 🔐 Admin Authentication System - Technical Flow Documentation

## Overview
This document explains the complete technical architecture for the admin authentication system, including email/password auth, password reset, two-factor authentication (2FA), and session management.

---

## 🏗️ Architecture Stack

### Technologies We'll Use:
```
Authentication Library: NextAuth.js v5 (Auth.js)
Password Hashing: bcrypt
Token Generation: JWT (JSON Web Tokens)
Email Service: Nodemailer (already in project) / Resend
2FA: speakeasy (TOTP) + qrcode
Session Storage: Database (PostgreSQL via Prisma)
Rate Limiting: Custom middleware
```

### Why These Choices:
- **NextAuth.js**: Industry-standard, built for Next.js, handles sessions automatically
- **bcrypt**: Proven secure hashing algorithm
- **JWT**: Stateless tokens for API authentication
- **TOTP (Time-based OTP)**: Standard 2FA method (like Google Authenticator)

---

## 📊 Database Schema

### New Tables Required:

```prisma
// schema.prisma

model AdminUser {
  id                String    @id @default(cuid())
  email             String    @unique
  password          String    // bcrypt hashed
  name              String?
  role              AdminRole @default(ADMIN)
  isActive          Boolean   @default(true)
  
  // 2FA fields
  twoFactorEnabled  Boolean   @default(false)
  twoFactorSecret   String?   // TOTP secret (encrypted)
  
  // Password reset
  resetToken        String?   @unique
  resetTokenExpiry  DateTime?
  
  // Email verification
  emailVerified     DateTime?
  verificationToken String?   @unique
  
  // Session tracking
  sessions          Session[]
  loginAttempts     LoginAttempt[]
  
  // Audit trail
  lastLogin         DateTime?
  lastLoginIP       String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

enum AdminRole {
  SUPER_ADMIN
  ADMIN
  MODERATOR
  VIEWER
}

model Session {
  id           String      @id @default(cuid())
  userId       String
  user         AdminUser   @relation(fields: [userId], references: [id], onDelete: Cascade)
  token        String      @unique
  ipAddress    String?
  userAgent    String?
  expiresAt    DateTime
  createdAt    DateTime    @default(now())
}

model LoginAttempt {
  id          String      @id @default(cuid())
  userId      String?
  user        AdminUser?  @relation(fields: [userId], references: [id], onDelete: Cascade)
  email       String
  ipAddress   String
  success     Boolean
  failReason  String?
  createdAt   DateTime    @default(now())
}

model PasswordResetLog {
  id          String      @id @default(cuid())
  email       String
  token       String
  used        Boolean     @default(false)
  usedAt      DateTime?
  ipAddress   String
  createdAt   DateTime    @default(now())
  expiresAt   DateTime
}
```

---

## 🔐 Authentication Flows

### 1. Email/Password Login Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. POST /api/auth/login
     │    { email, password, rememberMe }
     ▼
┌────────────────┐
│  API Handler   │
└────┬───────────┘
     │
     │ 2. Validate input
     │ 3. Check rate limiting (max 5 attempts per 15 mins)
     ▼
┌────────────────┐
│   Database     │
└────┬───────────┘
     │
     │ 4. Find user by email
     │ 5. Compare password with bcrypt
     ▼
┌────────────────┐
│  Verification  │
└────┬───────────┘
     │
     ├─── If password incorrect ────┐
     │                              │
     │ 6. Log failed attempt        │
     │ 7. Increment attempt counter │
     │ 8. Return error              │
     │                              │
     └─── If password correct ──────┤
                                    │
                                    ▼
                        ┌─────────────────────┐
                        │  2FA Check          │
                        └──────┬──────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
              2FA Enabled?           2FA Disabled
                   YES                   NO
                    │                     │
                    │                     │
                    ▼                     ▼
        ┌──────────────────┐    ┌──────────────────┐
        │ Return:          │    │ Create session   │
        │ requiresTwoFactor│    │ Generate JWT     │
        │ = true           │    │ Set HTTP cookie  │
        │                  │    │ Return success   │
        └──────────────────┘    └──────────────────┘
                                         │
                                         ▼
                                ┌──────────────────┐
                                │  Client          │
                                │  Redirect to     │
                                │  /admin          │
                                └──────────────────┘
```

**Code Implementation:**

```typescript
// /api/auth/login/route.ts
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

export async function POST(request: Request) {
  const { email, password, rememberMe } = await request.json();
  
  // 1. Rate limiting check
  const recentAttempts = await checkLoginAttempts(email);
  if (recentAttempts >= 5) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again in 15 minutes.' },
      { status: 429 }
    );
  }
  
  // 2. Find user
  const user = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase() }
  });
  
  if (!user || !user.isActive) {
    await logLoginAttempt(email, false, 'User not found or inactive');
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  }
  
  // 3. Verify password
  const passwordMatch = await bcrypt.compare(password, user.password);
  
  if (!passwordMatch) {
    await logLoginAttempt(email, false, 'Invalid password');
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  }
  
  // 4. Check if 2FA is enabled
  if (user.twoFactorEnabled) {
    // Store temporary session for 2FA verification
    const tempToken = generateTempToken(user.id);
    return NextResponse.json({
      requiresTwoFactor: true,
      tempToken
    });
  }
  
  // 5. Create session and JWT
  const session = await createSession(user, rememberMe);
  
  // 6. Log successful login
  await logLoginAttempt(email, true);
  await updateLastLogin(user.id);
  
  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    token: session.token
  });
}
```

---

### 2. Two-Factor Authentication (2FA) Flow

#### A. 2FA Setup Flow

```
┌──────────────────────────────────────────────────────────────┐
│  User logged in, goes to Settings → Security → Enable 2FA   │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ POST /api/auth/2fa/setup
         └───────┬───────────────┘
                 │
                 ▼
         ┌───────────────────────┐
         │ 1. Generate TOTP secret
         │ 2. Create QR code
         │ 3. Store secret (encrypted)
         └───────┬───────────────┘
                 │
                 ▼
         ┌───────────────────────┐
         │ Return:               │
         │ - QR code image       │
         │ - Manual entry code   │
         │ - Backup codes (10)   │
         └───────┬───────────────┘
                 │
                 ▼
         ┌───────────────────────┐
         │ User scans with       │
         │ Google Authenticator  │
         │ or similar app        │
         └───────┬───────────────┘
                 │
                 ▼
         ┌───────────────────────┐
         │ POST /api/auth/2fa/verify-setup
         │ { token: "123456" }   │
         └───────┬───────────────┘
                 │
                 ▼
         ┌───────────────────────┐
         │ Verify TOTP token     │
         │ If valid:             │
         │ - Enable 2FA          │
         │ - Save backup codes   │
         └───────────────────────┘
```

**Code Implementation:**

```typescript
// /api/auth/2fa/setup/route.ts
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function POST(request: Request) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // 1. Generate secret
  const secret = speakeasy.generateSecret({
    name: `WARS Admin (${session.user.email})`,
    issuer: 'WARS 2026'
  });
  
  // 2. Generate QR code
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
  
  // 3. Generate backup codes
  const backupCodes = generateBackupCodes(10);
  
  // 4. Store encrypted secret (not yet enabled)
  await prisma.adminUser.update({
    where: { id: session.user.id },
    data: {
      twoFactorSecret: encrypt(secret.base32),
      // Don't enable yet, wait for verification
    }
  });
  
  return NextResponse.json({
    qrCode: qrCodeUrl,
    manualEntryCode: secret.base32,
    backupCodes
  });
}

// /api/auth/2fa/verify-setup/route.ts
export async function POST(request: Request) {
  const { token } = await request.json();
  const session = await getSession(request);
  
  const user = await prisma.adminUser.findUnique({
    where: { id: session.user.id }
  });
  
  const secret = decrypt(user.twoFactorSecret);
  
  // Verify the token
  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2 // Allow 2 time steps in either direction
  });
  
  if (verified) {
    // Enable 2FA
    await prisma.adminUser.update({
      where: { id: session.user.id },
      data: { twoFactorEnabled: true }
    });
    
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json(
    { error: 'Invalid token' },
    { status: 400 }
  );
}
```

#### B. 2FA Login Verification Flow

```
User enters email/password → Receives tempToken → Redirected to 2FA page

┌──────────────────────────────────────┐
│  2FA Verification Screen             │
│                                      │
│  Enter 6-digit code:                 │
│  [_] [_] [_] [_] [_] [_]            │
│                                      │
│  [Verify]                            │
│  Or use backup code                  │
└───────────┬──────────────────────────┘
            │
            ▼
  POST /api/auth/2fa/verify
  { tempToken, code }
            │
            ▼
  ┌─────────────────────┐
  │ Verify TOTP code    │
  │ OR backup code      │
  └─────┬───────────────┘
        │
        ├─── Valid ───────┐
        │                 │
        ▼                 ▼
  ┌─────────────┐   ┌──────────────┐
  │ Create      │   │ Mark backup  │
  │ full session│   │ code as used │
  │ Return JWT  │   └──────────────┘
  └─────────────┘
```

**Code Implementation:**

```typescript
// /api/auth/2fa/verify/route.ts
export async function POST(request: Request) {
  const { tempToken, code } = await request.json();
  
  // 1. Verify temp token
  const payload = verifyTempToken(tempToken);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
  
  const user = await prisma.adminUser.findUnique({
    where: { id: payload.userId }
  });
  
  const secret = decrypt(user.twoFactorSecret);
  
  // 2. Try TOTP verification first
  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token: code,
    window: 2
  });
  
  if (verified) {
    const session = await createSession(user);
    return NextResponse.json({ success: true, token: session.token });
  }
  
  // 3. Try backup code
  const backupCodeValid = await verifyBackupCode(user.id, code);
  if (backupCodeValid) {
    const session = await createSession(user);
    return NextResponse.json({ 
      success: true, 
      token: session.token,
      usedBackupCode: true 
    });
  }
  
  return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
}
```

---

### 3. Password Reset Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Forgot Password Screen                                     │
│                                                             │
│  Enter your email:                                          │
│  [admin@wars26.com                    ]                     │
│  [Send Reset Link]                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         POST /api/auth/forgot-password
         { email: "admin@wars26.com" }
                     │
                     ▼
         ┌─────────────────────────┐
         │ 1. Find user by email   │
         │ 2. Generate reset token │
         │    (crypto.randomBytes) │
         │ 3. Hash token           │
         │ 4. Store in DB          │
         │ 5. Set 1-hour expiry    │
         └─────────┬───────────────┘
                   │
                   ▼
         ┌─────────────────────────┐
         │ Send Email via          │
         │ Nodemailer/Resend       │
         │                         │
         │ Link:                   │
         │ /admin/reset-password   │
         │ ?token=abc123xyz...     │
         └─────────┬───────────────┘
                   │
                   ▼
         ┌─────────────────────────┐
         │ User clicks link in     │
         │ email                   │
         └─────────┬───────────────┘
                   │
                   ▼
         ┌─────────────────────────┐
         │ GET /admin/reset-password
         │ ?token=abc123xyz        │
         │                         │
         │ Verify token:           │
         │ - Exists in DB?         │
         │ - Not expired?          │
         │ - Not used?             │
         └─────────┬───────────────┘
                   │
            ┌──────┴──────┐
            │             │
       Valid Token    Invalid Token
            │             │
            ▼             ▼
  ┌──────────────┐  ┌──────────────┐
  │ Show reset   │  │ Show error   │
  │ password form│  │ "Link expired"│
  └──────┬───────┘  └──────────────┘
         │
         ▼
  ┌──────────────────────┐
  │ New password:        │
  │ [.............]      │
  │ Confirm:             │
  │ [.............]      │
  │ [Reset Password]     │
  └──────┬───────────────┘
         │
         ▼
  POST /api/auth/reset-password
  { token, newPassword }
         │
         ▼
  ┌────────────────────────┐
  │ 1. Verify token again  │
  │ 2. Hash new password   │
  │ 3. Update user         │
  │ 4. Mark token as used  │
  │ 5. Invalidate sessions │
  │ 6. Send confirmation   │
  │    email               │
  └────────┬───────────────┘
           │
           ▼
  ┌────────────────────────┐
  │ Success!               │
  │ Redirect to login      │
  └────────────────────────┘
```

**Code Implementation:**

```typescript
// /api/auth/forgot-password/route.ts
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  const { email } = await request.json();
  
  const user = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase() }
  });
  
  // Always return success to prevent email enumeration
  if (!user) {
    return NextResponse.json({ 
      success: true,
      message: 'If the email exists, a reset link has been sent.'
    });
  }
  
  // 1. Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = await bcrypt.hash(resetToken, 10);
  
  // 2. Store token with 1-hour expiry
  await prisma.adminUser.update({
    where: { id: user.id },
    data: {
      resetToken: hashedToken,
      resetTokenExpiry: new Date(Date.now() + 3600000) // 1 hour
    }
  });
  
  // 3. Log the reset request
  await prisma.passwordResetLog.create({
    data: {
      email: user.email,
      token: hashedToken,
      ipAddress: getClientIP(request),
      expiresAt: new Date(Date.now() + 3600000)
    }
  });
  
  // 4. Send email
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/reset-password?token=${resetToken}`;
  
  await sendEmail({
    to: user.email,
    subject: 'Reset Your WARS Admin Password',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  });
  
  return NextResponse.json({ 
    success: true,
    message: 'If the email exists, a reset link has been sent.'
  });
}

// /api/auth/reset-password/route.ts
export async function POST(request: Request) {
  const { token, newPassword } = await request.json();
  
  // 1. Find user with valid token
  const users = await prisma.adminUser.findMany({
    where: {
      resetTokenExpiry: { gte: new Date() }
    }
  });
  
  let matchedUser = null;
  for (const user of users) {
    const isValid = await bcrypt.compare(token, user.resetToken);
    if (isValid) {
      matchedUser = user;
      break;
    }
  }
  
  if (!matchedUser) {
    return NextResponse.json(
      { error: 'Invalid or expired reset token' },
      { status: 400 }
    );
  }
  
  // 2. Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  // 3. Update user
  await prisma.adminUser.update({
    where: { id: matchedUser.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    }
  });
  
  // 4. Mark token as used
  await prisma.passwordResetLog.updateMany({
    where: {
      email: matchedUser.email,
      used: false
    },
    data: {
      used: true,
      usedAt: new Date()
    }
  });
  
  // 5. Invalidate all existing sessions
  await prisma.session.deleteMany({
    where: { userId: matchedUser.id }
  });
  
  // 6. Send confirmation email
  await sendEmail({
    to: matchedUser.email,
    subject: 'Your WARS Admin Password Has Been Reset',
    html: `
      <h2>Password Reset Successful</h2>
      <p>Your password has been successfully reset.</p>
      <p>If you didn't make this change, please contact support immediately.</p>
    `
  });
  
  return NextResponse.json({ success: true });
}
```

---

### 4. Email Helper (Nodemailer Setup)

```typescript
// /lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    await transporter.sendMail({
      from: `"WARS Admin" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    });
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email');
  }
}
```

---

## 🔒 Security Best Practices Implemented

### 1. Password Security
- ✅ Minimum 8 characters, uppercase, lowercase, number, special char
- ✅ bcrypt with salt rounds = 12
- ✅ No password hints or security questions
- ✅ Password complexity validation on frontend + backend

### 2. Session Management
- ✅ HTTP-only cookies (prevent XSS)
- ✅ Secure flag in production (HTTPS only)
- ✅ SameSite=Strict (prevent CSRF)
- ✅ Short-lived tokens (7 days, or 30 if "remember me")
- ✅ Token rotation on sensitive actions

### 3. Rate Limiting
- ✅ Max 5 login attempts per 15 minutes per email
- ✅ Max 3 password reset requests per hour per email
- ✅ Max 3 2FA attempts per temporary session

### 4. Audit Trail
- ✅ Log all login attempts (success + failures)
- ✅ Log all password resets
- ✅ Log all 2FA setup/disable events
- ✅ Track IP addresses and user agents

### 5. Token Security
- ✅ Cryptographically secure random tokens
- ✅ Tokens hashed before storage
- ✅ Short expiry times (1 hour for reset, 5 mins for temp)
- ✅ Single-use tokens (marked as used after verification)

---

## 📧 Email Templates Needed

### 1. Password Reset Email
```html
Subject: Reset Your WARS Admin Password

<h2>Password Reset Request</h2>
<p>Hi there,</p>
<p>We received a request to reset your WARS Admin password.</p>
<p>Click the button below to reset your password:</p>
<a href="{{resetUrl}}" style="...">Reset Password</a>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this, please ignore this email.</p>
```

### 2. Password Changed Confirmation
```html
Subject: Your WARS Admin Password Has Been Reset

<h2>Password Reset Successful</h2>
<p>Your password has been successfully reset.</p>
<p>If you didn't make this change, please contact support immediately.</p>
```

### 3. New Login Alert
```html
Subject: New Login to Your WARS Admin Account

<h2>New Login Detected</h2>
<p>Time: {{timestamp}}</p>
<p>IP Address: {{ipAddress}}</p>
<p>Location: {{location}}</p>
<p>If this wasn't you, please reset your password immediately.</p>
```

### 4. 2FA Enabled
```html
Subject: Two-Factor Authentication Enabled

<h2>Security Update</h2>
<p>Two-factor authentication has been enabled on your account.</p>
<p>Your backup codes: (display codes)</p>
<p>Keep these in a safe place.</p>
```

---

## 🔧 Environment Variables Required

```env
# .env.local

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Configuration (using Gmail as example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@wars26.com

# Encryption key for 2FA secrets
ENCRYPTION_KEY=another-32-byte-secret-key
```

---

## 📝 Implementation Checklist

### Phase 1A: Basic Authentication (Week 1)
- [ ] Update Prisma schema with AdminUser model
- [ ] Create migration and push to database
- [ ] Build login API endpoint
- [ ] Build logout API endpoint
- [ ] Create session management utilities
- [ ] Build login page UI
- [ ] Add password strength validator
- [ ] Implement rate limiting middleware
- [ ] Test login/logout flow

### Phase 1B: Password Reset (Week 1)
- [ ] Build forgot-password API endpoint
- [ ] Build reset-password API endpoint
- [ ] Set up Nodemailer
- [ ] Create email templates
- [ ] Build forgot password page UI
- [ ] Build reset password page UI
- [ ] Test complete reset flow
- [ ] Add email delivery monitoring

### Phase 1C: Two-Factor Authentication (Week 2)
- [ ] Install speakeasy and qrcode packages
- [ ] Build 2FA setup API endpoint
- [ ] Build 2FA verify-setup API endpoint
- [ ] Build 2FA login verification endpoint
- [ ] Create 2FA setup page UI
- [ ] Create 2FA verification page UI
- [ ] Generate and store backup codes
- [ ] Test complete 2FA flow

### Phase 1D: Security Enhancements (Week 2)
- [ ] Add login attempt tracking
- [ ] Add session activity logs
- [ ] Build admin activity dashboard
- [ ] Add IP-based alerts
- [ ] Implement auto-logout on inactivity
- [ ] Add "remember this device" feature
- [ ] Security audit and penetration testing

---

## 🚀 Next Steps

Ready to implement? Here's what we'll do:

1. **Update Database Schema** - Add AdminUser and related tables
2. **Install Dependencies** - bcrypt, speakeasy, qrcode, jsonwebtoken
3. **Build API Endpoints** - Start with login, then add others
4. **Create UI Components** - Login form with the glassmorphic design
5. **Test Each Flow** - Ensure security and UX are perfect

**Would you like me to start implementing Phase 1A (Basic Authentication)?**

---

**Document Version:** 1.0  
**Last Updated:** 2026-02-05  
**Status:** Technical Planning Complete
