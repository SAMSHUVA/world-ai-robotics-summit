# ConferenceOS

### Enterprise Conference Management Platform

---

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![License](https://img.shields.io/badge/license-Commercial-green.svg)

**A complete, production-ready conference management system built with modern web technologies.**

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Support](#support)

</div>

---

## Overview

ConferenceOS is an enterprise-grade, full-stack conference management platform designed for academic institutions, event organizers, and professional associations. Built with Next.js 14, TypeScript, and PostgreSQL, it provides everything needed to run successful hybrid conferences from registration to post-event analytics.

### Key Highlights

- 🎯 **Complete Conference Lifecycle** - Pre-event, live, and post-event management
- 🌐 **Hybrid Event Support** - Simultaneous in-person and virtual attendance
- 📄 **Academic Paper Management** - Submission, review, and publication workflow
- 💳 **Payment Integration** - Razorpay payment gateway with order tracking
- 📊 **Real-time Analytics** - Comprehensive admin dashboard with live metrics
- 🎨 **White-Label Ready** - Fully customizable branding via database
- 🔒 **Enterprise Security** - Supabase authentication and role-based access
- 📱 **Responsive Design** - Optimized for all devices and screen sizes

---

## Features

### For Organizers

#### **Registration & Ticketing**
- Multiple ticket types with dynamic pricing
- Coupon and discount management
- Payment processing with Razorpay
- Automated confirmation emails
- Attendee data export

#### **Speaker Management**
- Speaker profiles with photos and bios
- Session scheduling
- Speaker application portal
- Drag-and-drop reordering
- Social media integration

#### **Paper Submission System**
- Abstract and full paper submission
- File upload with Supabase storage
- Track assignment
- Multi-reviewer workflow
- Status tracking and notifications

#### **Admin Dashboard**
- Real-time registration metrics
- Revenue tracking and analytics
- Attendee demographics
- Paper submission statistics
- Live traffic monitoring

### For Attendees

#### **User Experience**
- Simple registration process
- Multiple payment options
- Instant confirmation
- Schedule browsing
- Speaker information
- Resource downloads

#### **Hybrid Attendance**
- In-person ticket options
- Virtual attendance packages
- Flexible pricing tiers
- Unified registration system

### For Administrators

#### **Content Management**
- Dynamic site settings
- Speaker CRUD operations
- Committee member management
- Important dates configuration
- Testimonial management
- Resource library
- Sponsor management

#### **Communication**
- Newsletter subscription system
- Contact form management
- Inquiry tracking
- Email notifications
- Admin reply system

#### **Analytics & Reporting**
- Registration trends
- Revenue projections
- Attendee analytics
- Paper submission metrics
- Exit feedback analysis

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14.1.0 with App Router
- **Language**: TypeScript 5
- **Styling**: Custom CSS + Tailwind utilities
- **Animations**: Framer Motion 12.31.0
- **Charts**: Recharts 3.7.0
- **Icons**: Lucide React 0.563.0
- **Forms**: React Hook Form 7.50.0
- **Drag & Drop**: DnD Kit

### Backend
- **Runtime**: Node.js 20+
- **API**: Next.js API Routes (RESTful)
- **ORM**: Prisma 5.10.0
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Email**: Nodemailer 7.0.13
- **Payments**: Razorpay 2.9.6

### Deployment
- **Platform**: Vercel
- **CDN**: Vercel Edge Network
- **SSL**: Automatic HTTPS
- **Database**: Vercel Postgres / Supabase

---

## Quick Start

### Prerequisites

```bash
Node.js 18+ 
PostgreSQL 14+
npm or yarn
Supabase account (for auth & storage)
Razorpay account (for payments)
```

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd conference-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
RAZORPAY_KEY_ID="..."
RAZORPAY_KEY_SECRET="..."
EMAIL_HOST="smtp.gmail.com"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

4. **Setup database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

### Production Deployment

1. **Deploy to Vercel**
```bash
vercel deploy --prod
```

2. **Configure environment variables** in Vercel dashboard

3. **Run database migrations**
```bash
npx prisma migrate deploy
```

---

## Documentation

### 📚 Complete Documentation Set

1. **[Developer Guide](./DEVELOPER_GUIDE.md)** - Architecture, code structure, and development workflow
2. **[API Documentation](./API_DOCUMENTATION.md)** - Complete API reference with examples
3. **[Setup Guide](./SETUP_GUIDE.md)** - Detailed installation and configuration
4. **[Admin Guide](./ADMIN_GUIDE.md)** - Admin dashboard usage and features
5. **[Customization Guide](./CUSTOMIZATION_GUIDE.md)** - White-labeling and branding
6. **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Production deployment strategies
7. **[Security Guide](./SECURITY_GUIDE.md)** - Security best practices
8. **[Troubleshooting](./TROUBLESHOOTING.md)** - Common issues and solutions

---

## Project Structure

```
conference-website/
├── docs/                      # Documentation files
├── prisma/                    # Database schema and migrations
│   ├── schema.prisma         # Prisma schema definition
│   └── migrations/           # Database migrations
├── public/                    # Static assets
│   ├── logo.png
│   └── uploads/              # User uploaded files
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (public)/        # Public pages
│   │   │   ├── page.tsx     # Homepage
│   │   │   ├── about/
│   │   │   ├── register/
│   │   │   ├── speakers/
│   │   │   └── ...
│   │   ├── admin/           # Admin dashboard
│   │   │   └── page.tsx
│   │   ├── api/             # API routes
│   │   │   ├── speakers/
│   │   │   ├── register/
│   │   │   ├── settings/
│   │   │   └── ...
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── ContactForm.tsx
│   │   └── ...
│   ├── config/              # Configuration files
│   │   ├── conference.ts    # Conference config
│   │   └── settings.ts      # Dynamic settings
│   ├── lib/                 # Utility libraries
│   │   ├── prisma.ts        # Prisma client
│   │   └── supabase/        # Supabase clients
│   └── middleware.ts        # Next.js middleware
├── .env.local               # Environment variables
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── vercel.json              # Vercel deployment config
```

---

## Database Schema

### Core Models

- **GlobalSetting** - Dynamic site configuration
- **Speaker** - Speaker profiles and information
- **CommitteeMember** - Conference committee
- **ImportantDate** - Key dates and deadlines
- **Testimonial** - Attendee testimonials
- **TicketPrice** - Dynamic pricing tiers

### Registration & Payments

- **Attendee** - Registration records
- **Coupon** - Discount codes
- **ExitFeedback** - Abandonment tracking

### Academic Content

- **PaperSubmission** - Paper submissions
- **PaperReview** - Peer reviews
- **SpeakerApplication** - Speaker proposals

### Communication

- **ContactMessage** - Contact form submissions
- **ConferenceInquiry** - General inquiries
- **Subscriber** - Newsletter subscribers
- **ResourceLead** - Resource download leads

### Content Management

- **Resource** - Downloadable resources
- **Sponsor** - Sponsor information
- **Award** - Award categories
- **AwardNomination** - Award nominations

### Administration

- **AdminUser** - Admin accounts with roles

---

## API Endpoints

### Public Endpoints

```
POST   /api/register          # Register attendee
POST   /api/paper/submit      # Submit paper
POST   /api/contact           # Contact form
POST   /api/newsletter        # Newsletter subscription
POST   /api/inquiries         # General inquiry
GET    /api/speakers          # List speakers
GET    /api/dates             # Important dates
```

### Protected Endpoints (Admin)

```
GET    /api/settings          # Get site settings
PATCH  /api/settings          # Update settings
POST   /api/speakers          # Create speaker
PUT    /api/speakers          # Update speaker
DELETE /api/speakers?id=1     # Delete speaker
POST   /api/committee         # Create committee member
GET    /api/prices            # Get ticket prices
PATCH  /api/prices?id=1       # Update price
```

### Payment Endpoints

```
POST   /api/razorpay/order    # Create payment order
POST   /api/razorpay/verify   # Verify payment
POST   /api/razorpay/feedback # Payment feedback
```

See [API Documentation](./API_DOCUMENTATION.md) for complete reference.

---

## Configuration

### Site Settings (Database-Driven)

All major site settings are stored in the `GlobalSetting` table and can be updated via the admin dashboard:

- Conference name and year
- Location and venue
- Theme and tagline
- Contact information
- Social media links

### Static Configuration

Edit `src/config/conference.ts` for fallback values:

```typescript
export const CONFERENCE_CONFIG = {
    name: "WARS",
    year: "2026",
    fullName: "World AI & Robotics Summit 2026",
    location: "Singapore",
    venue: "Marina Bay Sands",
    // ...
};
```

---

## Customization

### Branding

1. **Logo**: Replace `/public/logo.png`
2. **Colors**: Edit CSS variables in `src/app/globals.css`
3. **Site Settings**: Update via admin dashboard at `/admin`

### White-Label Setup

1. Update `GlobalSetting` table with your branding
2. Replace logo and favicon
3. Customize color scheme
4. Update email templates
5. Configure custom domain

See [Customization Guide](./CUSTOMIZATION_GUIDE.md) for details.

---

## Security

### Authentication

- Supabase Auth for admin access
- Row-level security policies
- Session management
- Password reset flow

### Data Protection

- Environment variables for secrets
- HTTPS enforcement
- CSRF protection
- SQL injection prevention (Prisma ORM)
- XSS protection (React)

### Payment Security

- Razorpay signature verification
- Secure webhook handling
- PCI compliance through Razorpay

See [Security Guide](./SECURITY_GUIDE.md) for best practices.

---

## Performance

### Optimization Features

- Server-side rendering (SSR)
- Static generation where possible
- Image optimization (Next.js Image)
- Code splitting
- Edge caching (Vercel)
- Database connection pooling

### Monitoring

- Real-time analytics dashboard
- Error tracking
- Performance metrics
- User behavior analytics

---

## Support & Maintenance

### Getting Help

- **Documentation**: Check the docs folder
- **Issues**: Report bugs via issue tracker
- **Email Support**: support@example.com
- **Response Time**: Within 24-48 hours

### Updates & Maintenance

- Regular security updates
- Feature enhancements
- Bug fixes
- Database migrations
- Dependency updates

---

## License

This is commercial software. See LICENSE file for details.

### License Types

1. **Single Site License** - One conference/domain
2. **Extended License** - Unlimited conferences
3. **White-Label License** - Resale rights
4. **Enterprise License** - Custom terms

Contact sales for licensing options.

---

## Credits

### Built With

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Supabase](https://supabase.com/) - Auth & Storage
- [Razorpay](https://razorpay.com/) - Payment gateway
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Recharts](https://recharts.org/) - Charts

### Developed By

**Your Company Name**  
Website: https://yourcompany.com  
Email: contact@yourcompany.com

---

## Changelog

### Version 1.0.0 (Current)

- ✅ Complete conference management system
- ✅ Hybrid event support
- ✅ Paper submission & review
- ✅ Payment integration
- ✅ Admin dashboard
- ✅ Dynamic site settings
- ✅ Email notifications
- ✅ Analytics & reporting

### Roadmap

- 🔄 Mobile apps (iOS/Android)
- 🔄 Multi-language support
- 🔄 AI-powered recommendations
- 🔄 Live streaming integration
- 🔄 Certificate generation
- 🔄 Networking features

---

<div align="center">

**ConferenceOS** - Built with ❤️ for the conference community

[Documentation](./DEVELOPER_GUIDE.md) • [API Reference](./API_DOCUMENTATION.md) • [Support](mailto:support@example.com)

</div>
