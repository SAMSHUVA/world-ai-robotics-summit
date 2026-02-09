# Developer Guide

### ConferenceOS Technical Documentation

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Development Setup](#development-setup)
4. [Code Standards](#code-standards)
5. [Component Library](#component-library)
6. [State Management](#state-management)
7. [Database Design](#database-design)
8. [API Development](#api-development)
9. [Testing](#testing)
10. [Deployment](#deployment)

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │   Tablet     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              App Router (React 18)                    │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │   Pages    │  │   API      │  │ Middleware │     │  │
│  │  │   (SSR)    │  │   Routes   │  │   (Auth)   │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ Supabase │  │PostgreSQL│  │ Razorpay │
        │Auth/Store│  │ Database │  │ Payment  │
        └──────────┘  └──────────┘  └──────────┘
```

### Technology Stack

#### **Frontend**
- **Next.js 14.1.0**: React framework with App Router
- **TypeScript 5**: Type-safe development
- **React 18**: UI library with concurrent features
- **Framer Motion**: Animation library
- **CSS Modules**: Scoped styling

#### **Backend**
- **Next.js API Routes**: Serverless functions
- **Prisma 5.10.0**: Type-safe ORM
- **PostgreSQL**: Relational database
- **Nodemailer**: Email service

#### **External Services**
- **Supabase**: Authentication & file storage
- **Razorpay**: Payment processing
- **Vercel**: Hosting & CDN

---

## Project Structure

### Directory Layout

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                # Public pages group
│   │   ├── layout.tsx           # Public layout with header/footer
│   │   ├── page.tsx             # Homepage
│   │   ├── about/
│   │   │   ├── page.tsx         # About page
│   │   │   ├── AboutClient.tsx  # Client component
│   │   │   └── about.css        # Page styles
│   │   ├── register/
│   │   │   ├── page.tsx         # Registration page (SSR)
│   │   │   └── RegisterClient.tsx
│   │   ├── speakers/
│   │   ├── sessions/
│   │   ├── call-for-papers/
│   │   ├── contact/
│   │   ├── privacy/
│   │   └── terms/
│   ├── admin/                   # Admin dashboard
│   │   ├── layout.tsx           # Admin layout
│   │   ├── page.tsx             # Dashboard (client component)
│   │   ├── admin.css            # Admin styles
│   │   ├── login/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── api/                     # API routes
│   │   ├── speakers/
│   │   │   ├── route.ts         # CRUD operations
│   │   │   └── [id]/
│   │   │       └── route.ts     # Single speaker operations
│   │   ├── register/
│   │   │   └── route.ts         # Registration endpoint
│   │   ├── settings/
│   │   │   └── route.ts         # Site settings
│   │   ├── paper/
│   │   │   ├── submit/
│   │   │   ├── review/
│   │   │   └── status/
│   │   ├── razorpay/
│   │   │   ├── order/
│   │   │   ├── verify/
│   │   │   └── feedback/
│   │   └── ...
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── sitemap.ts               # Dynamic sitemap
│   └── robots.ts                # Robots.txt
├── components/                  # Reusable components
│   ├── Header.tsx               # Site header
│   ├── ContactForm.tsx          # Contact form
│   ├── NewsletterForm.tsx       # Newsletter subscription
│   ├── ImportantDates.tsx       # Dates display
│   ├── Reveal.tsx               # Animation wrapper
│   ├── BackgroundGradient.tsx   # Animated background
│   └── ...
├── config/                      # Configuration
│   ├── conference.ts            # Static config
│   └── settings.ts              # Dynamic settings loader
├── lib/                         # Utilities
│   ├── prisma.ts                # Prisma client singleton
│   ├── supabase/
│   │   ├── client.ts            # Browser client
│   │   └── server.ts            # Server client
│   └── StyledJsxRegistry.tsx    # Styled-jsx setup
└── middleware.ts                # Auth middleware

prisma/
├── schema.prisma                # Database schema
└── migrations/                  # Migration history

public/
├── logo.png                     # Site logo
├── uploads/                     # User uploads
└── ...
```

### File Naming Conventions

- **Pages**: `page.tsx` (Next.js convention)
- **Layouts**: `layout.tsx`
- **Client Components**: `ComponentName.tsx` or `ComponentNameClient.tsx`
- **Server Components**: Default (no suffix)
- **API Routes**: `route.ts`
- **Styles**: `component.css` or `globals.css`
- **Config**: `config-name.ts`
- **Utils**: `util-name.ts`

---

## Development Setup

### Prerequisites

```bash
# Required
Node.js 18.17.0 or higher
npm 9.0.0 or higher
PostgreSQL 14 or higher

# Recommended
VS Code with extensions:
  - ESLint
  - Prettier
  - Prisma
  - TypeScript
```

### Environment Setup

1. **Clone repository**
```bash
git clone <repository-url>
cd conference-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env.local
```

4. **Configure environment variables**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/conference_db"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Razorpay
RAZORPAY_KEY_ID="rzp_test_xxxxx"
RAZORPAY_KEY_SECRET="xxxxx"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxx"

# Email (Gmail example)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_SECURE="false"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="Conference <noreply@conference.com>"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

5. **Setup database**
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio
npx prisma studio
```

6. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

### Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npx prisma studio        # Open database GUI
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema changes
npx prisma migrate dev   # Create migration
npx prisma migrate deploy # Deploy migrations

# Utilities
npm run db:push          # Alias for prisma db push
npm run db:studio        # Alias for prisma studio
```

---

## Code Standards

### TypeScript Guidelines

#### **Type Safety**

```typescript
// ✅ Good: Explicit types
interface Speaker {
    id: number;
    name: string;
    role: string;
    affiliation?: string;
}

async function getSpeakers(): Promise<Speaker[]> {
    return await prisma.speaker.findMany();
}

// ❌ Bad: Any types
async function getSpeakers(): Promise<any> {
    return await prisma.speaker.findMany();
}
```

#### **Component Props**

```typescript
// ✅ Good: Interface for props
interface HeaderProps {
    settings?: {
        name: string;
        year: string;
        location: string;
    };
}

export default function Header({ settings }: HeaderProps) {
    // ...
}

// ❌ Bad: No types
export default function Header({ settings }) {
    // ...
}
```

### React Best Practices

#### **Server vs Client Components**

```typescript
// Server Component (default)
// src/app/(public)/speakers/page.tsx
export default async function SpeakersPage() {
    const speakers = await prisma.speaker.findMany();
    return <SpeakersPageContent speakers={speakers} />;
}

// Client Component (use 'use client')
// src/components/ContactForm.tsx
'use client';
import { useState } from 'react';

export default function ContactForm() {
    const [email, setEmail] = useState('');
    // ...
}
```

#### **Data Fetching**

```typescript
// ✅ Good: Server-side data fetching
export default async function Page() {
    const data = await prisma.model.findMany();
    return <Component data={data} />;
}

// ✅ Good: Client-side with error handling
'use client';
export default function Component() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/data')
            .then(res => res.json())
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loading />;
    if (error) return <Error error={error} />;
    return <Display data={data} />;
}
```

### API Route Patterns

#### **Standard CRUD Structure**

```typescript
// src/app/api/speakers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - List all
export async function GET() {
    try {
        const speakers = await prisma.speaker.findMany({
            orderBy: { displayOrder: 'asc' }
        });
        return NextResponse.json(speakers);
    } catch (error) {
        console.error('GET /api/speakers error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch speakers' },
            { status: 500 }
        );
    }
}

// POST - Create new
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Validation
        if (!body.name || !body.role) {
            return NextResponse.json(
                { error: 'Name and role are required' },
                { status: 400 }
            );
        }

        const speaker = await prisma.speaker.create({
            data: body
        });

        return NextResponse.json(speaker, { status: 201 });
    } catch (error) {
        console.error('POST /api/speakers error:', error);
        return NextResponse.json(
            { error: 'Failed to create speaker' },
            { status: 500 }
        );
    }
}

// PUT - Update
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...data } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'ID is required' },
                { status: 400 }
            );
        }

        const speaker = await prisma.speaker.update({
            where: { id: parseInt(id) },
            data
        });

        return NextResponse.json(speaker);
    } catch (error) {
        console.error('PUT /api/speakers error:', error);
        return NextResponse.json(
            { error: 'Failed to update speaker' },
            { status: 500 }
        );
    }
}

// DELETE - Remove
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID is required' },
                { status: 400 }
            );
        }

        await prisma.speaker.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/speakers error:', error);
        return NextResponse.json(
            { error: 'Failed to delete speaker' },
            { status: 500 }
        );
    }
}
```

### CSS Conventions

```css
/* Component-specific styles */
.component-name {
    /* Layout */
    display: flex;
    flex-direction: column;
    
    /* Spacing */
    padding: 1rem;
    margin: 0 auto;
    
    /* Visual */
    background: var(--bg-primary);
    border-radius: 12px;
    
    /* Typography */
    font-size: 1rem;
    color: var(--text-primary);
}

/* Use CSS variables for theming */
:root {
    --primary: #5B4DFF;
    --bg-primary: #0A0A19;
    --text-primary: #FFFFFF;
}

/* Responsive design */
@media (max-width: 768px) {
    .component-name {
        padding: 0.5rem;
    }
}
```

---

## Component Library

### Core Components

#### **Header Component**

```typescript
// src/components/Header.tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';

interface HeaderProps {
    settings?: {
        name: string;
        year: string;
        location: string;
    };
}

export default function Header({ settings }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="site-header">
            <div className="container">
                <Link href="/" className="logo">
                    {settings?.name} {settings?.year}
                </Link>
                <nav className="main-nav">
                    <Link href="/about">About</Link>
                    <Link href="/speakers">Speakers</Link>
                    <Link href="/register">Register</Link>
                </nav>
            </div>
        </header>
    );
}
```

#### **Form Components**

```typescript
// src/components/ContactForm.tsx
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
    name: string;
    email: string;
    message: string;
}

export default function ContactForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [status, setStatus] = useState('');

    const onSubmit = async (data: FormData) => {
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                setStatus('Message sent successfully!');
            } else {
                setStatus('Failed to send message');
            }
        } catch (error) {
            setStatus('An error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                {...register('name', { required: 'Name is required' })}
                placeholder="Your Name"
            />
            {errors.name && <span>{errors.name.message}</span>}

            <input
                {...register('email', {
                    required: 'Email is required',
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                    }
                })}
                placeholder="Your Email"
            />
            {errors.email && <span>{errors.email.message}</span>}

            <textarea
                {...register('message', { required: 'Message is required' })}
                placeholder="Your Message"
            />
            {errors.message && <span>{errors.message.message}</span>}

            <button type="submit">Send Message</button>
            {status && <p>{status}</p>}
        </form>
    );
}
```

#### **Animation Wrapper**

```typescript
// src/components/Reveal.tsx
'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface RevealProps {
    children: ReactNode;
    animation?: 'reveal' | 'reveal-left' | 'reveal-fade';
    delay?: number;
    threshold?: number;
}

export default function Reveal({
    children,
    animation = 'reveal',
    delay = 0,
    threshold = 0.1
}: RevealProps) {
    const variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: threshold }}
            transition={{ duration: 0.6, delay: delay / 1000 }}
            variants={variants}
        >
            {children}
        </motion.div>
    );
}
```

---

## State Management

### Server State (Database)

```typescript
// Fetch on server
export default async function Page() {
    const data = await prisma.model.findMany();
    return <Component data={data} />;
}
```

### Client State (React Hooks)

```typescript
'use client';
import { useState, useEffect } from 'react';

export default function Component() {
    const [data, setData] = useState([]);
    
    useEffect(() => {
        fetch('/api/data')
            .then(res => res.json())
            .then(setData);
    }, []);

    return <div>{/* render data */}</div>;
}
```

### Form State (React Hook Form)

```typescript
'use client';
import { useForm } from 'react-hook-form';

export default function Form() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const onSubmit = (data) => {
        // Handle submission
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('field', { required: true })} />
            {errors.field && <span>Required</span>}
        </form>
    );
}
```

---

## Database Design

### Schema Overview

```prisma
// prisma/schema.prisma

// Site Configuration
model GlobalSetting {
  id        Int      @id @default(autoincrement())
  key       String   @unique
  value     String
  updatedAt DateTime @updatedAt
}

// Content Models
model Speaker {
  id           Int     @id @default(autoincrement())
  name         String
  role         String?
  affiliation  String?
  bio          String?
  photoUrl     String?
  type         String  @default("KEYNOTE")
  displayOrder Int     @default(0)
}

model CommitteeMember {
  id           Int     @id @default(autoincrement())
  name         String
  role         String
  photoUrl     String?
  displayOrder Int     @default(0)
}

// Registration
model Attendee {
  id                Int       @id @default(autoincrement())
  firstName         String
  lastName          String
  email             String
  ticketType        String
  attendanceMode    String    @default("IN_PERSON")
  hasPaid           Boolean   @default(false)
  paymentStatus     String    @default("PENDING")
  razorpayOrderId   String?   @unique
  razorpayPaymentId String?   @unique
  createdAt         DateTime? @default(now())
}

// Academic Content
model PaperSubmission {
  id             Int           @id @default(autoincrement())
  authorName     String
  email          String
  title          String?
  track          String?
  fileUrl        String
  status         String        @default("PENDING")
  createdAt      DateTime?     @default(now())
  reviews        PaperReview[]
}

model PaperReview {
  id           Int             @id @default(autoincrement())
  paperId      Int
  reviewerName String
  score        Int
  comments     String?
  createdAt    DateTime        @default(now())
  paper        PaperSubmission @relation(fields: [paperId], references: [id], onDelete: Cascade)
}
```

### Relationships

```
GlobalSetting (1:1 key-value pairs)

Speaker (1:N with sessions)
CommitteeMember (standalone)
ImportantDate (standalone)
Testimonial (standalone)

Attendee (1:1 with payment)
  └─ Coupon (N:1)

PaperSubmission (1:N with reviews)
  └─ PaperReview (N:1)

Award (1:N with nominations)
  └─ AwardNomination (N:1)
```

### Migrations

```bash
# Create new migration
npx prisma migrate dev --name add_new_field

# Deploy to production
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset
```

---

## API Development

### Creating New Endpoints

1. **Create route file**
```bash
src/app/api/your-endpoint/route.ts
```

2. **Implement handlers**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    // Implementation
}

export async function POST(request: NextRequest) {
    // Implementation
}
```

3. **Add error handling**
```typescript
try {
    // Logic
} catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
        { error: 'Error message' },
        { status: 500 }
    );
}
```

4. **Test endpoint**
```bash
curl http://localhost:3000/api/your-endpoint
```

### File Upload Example

```typescript
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
            .from('conference-files')
            .upload(filename, buffer, {
                contentType: file.type
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('conference-files')
            .getPublicUrl(filename);

        return NextResponse.json({ url: publicUrl });
    } catch (error) {
        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        );
    }
}
```

---

## Testing

### Manual Testing

```bash
# Test API endpoints
curl -X GET http://localhost:3000/api/speakers
curl -X POST http://localhost:3000/api/speakers \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","role":"Speaker"}'
```

### Database Testing

```bash
# Open Prisma Studio
npx prisma studio

# Test queries in console
node
> const { PrismaClient } = require('@prisma/client')
> const prisma = new PrismaClient()
> await prisma.speaker.findMany()
```

---

## Deployment

### Vercel Deployment

1. **Connect repository**
```bash
vercel link
```

2. **Configure environment variables** in Vercel dashboard

3. **Deploy**
```bash
vercel --prod
```

4. **Run migrations**
```bash
npx prisma migrate deploy
```

### Environment Variables Checklist

- [ ] DATABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] RAZORPAY_KEY_ID
- [ ] RAZORPAY_KEY_SECRET
- [ ] NEXT_PUBLIC_RAZORPAY_KEY_ID
- [ ] EMAIL_HOST
- [ ] EMAIL_USER
- [ ] EMAIL_PASS
- [ ] NEXT_PUBLIC_APP_URL

---

## Best Practices

### Performance

- Use Server Components by default
- Implement proper caching strategies
- Optimize images with Next.js Image
- Minimize client-side JavaScript
- Use database indexes

### Security

- Validate all user inputs
- Use environment variables for secrets
- Implement rate limiting
- Sanitize database queries (Prisma handles this)
- Use HTTPS in production

### Code Quality

- Write TypeScript for type safety
- Follow consistent naming conventions
- Add error handling to all async operations
- Document complex logic
- Keep components small and focused

---

## Troubleshooting

### Common Issues

**Prisma Client not generated**
```bash
npx prisma generate
```

**Database connection failed**
```bash
# Check DATABASE_URL in .env.local
# Ensure PostgreSQL is running
```

**Build errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Type errors**
```bash
# Regenerate Prisma types
npx prisma generate
```

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Documentation](https://react.dev)

---

**Last Updated**: February 2026  
**Version**: 1.0.0
