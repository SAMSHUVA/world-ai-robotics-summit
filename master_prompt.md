# MASTER PROMPT: High-Performance AI Conference Platform with Admin Dashboard, Certificates, and Automation

**Role:** You are an expert Full Stack Web Developer and AI Systems Architect specializing in Next.js 14, Supabase, and dynamic content platforms.

**Objective:**
Build a premium, high-performance Conference Management System (CMS) for an International AI & Robotics Summit ([CONFERENCE_NAME]). The platform must be SEO/AEO optimized, visually stunning (rich aesthetics, dark mode), and functionally robust, handling everything from user registration to automated certificate generation.

---

## 1. Technology Stack & Architecture

- **Frontend:** Next.js 14 (App Router), React, TypeScript.
- **Styling:** Tailwind CSS, **Framer Motion** (complex animations, AnimatePresence), Lucide React (icons).
- **Backend/Database:** Supabase (Auth, Postgres DB), Prisma ORM (for type-safe database access).
- **Email/Automation:** Nodemailer (SMTP), Server Actions for triggering workflows.
- **PDF/Graphics:** `jspdf`, `html2canvas` for client-side certificate generation.
- **Payment:** **Razorpay** integration for ticket sales.
- **Deployment:** Vercel with edge compatibility where possible.

---

## 2. Core Features & Requirements

### A. Public Facing Website (SEO & AEO Optimized)
- **Design:** "Wow" factor with dynamic backgrounds (e.g., particle effects, 3D elements), glassmorphism, and responsive gradients.
- **SEO/AEO:**
  - Automated `sitemap.xml` and `robots.txt`.
  - JSON-LD Schema Markup for Event, Organization, and Speakers (crucial for Answer Engine Optimization).
  - Dynamic Metadata generation for every page (`generateMetadata`).
- **Pages:** Home (Hero, About, Stats), Speakers (Grid with modals), Schedule, Call for Papers, Contact.

### B. Authentication & RBAC (Role-Based Access Control)
- **Provider:** Supabase Auth.
- **Roles:**
  - `SUPER_ADMIN`: Full access to system settings and database.
  - `ADMIN`: Manage users, content, and events.
  - `MODERATOR/REVIEWER`: Review paper submissions.
  - `USER/ATTENDEE`: Register, buy tickets, view certificates.
- **Flows:** Admin Login (custom styled), Registration, Forgot Password.

### C. Dynamic Admin Dashboard & Analytics
- **Analytics:** Real-time charts (`recharts`) showing ticket sales, paper submissions, and revenue.
- **User Management:** Table view with filtering, sorting, and bulk actions (export to Excel).
- **Content Management (CMS):**
  - **Speakers:** CRUD operations for adding speakers with photos and bios.
  - **Resources:** Upload manager for conference materials.
  - **Awards/Testimonials:** Manage dynamic content displayed on the frontend.
- **Paper Review System:** Interface for assigning reviewers to papers and scoring submissions.

### D. Certificate System (The "Core" Feature)
- **Dashboard:** Users find their relevant certificates (Attendance, Speaker, Award) based on their role.
- **Verification Portal:** Public `verify/[id]` route where QR codes link to valid, immutable certificate records.
- **Editor/Generator:**
  - **Canvas Editor:** Drag-and-drop interface (`fabric.js` or custom canvas logic) to design certificate templates.
  - **Dynamic Fields:** Placeholders like `{{Name}}`, `{{Role}}`, `{{Date}}` that auto-fill during generation.
  - **Export:** High-quality PDF export using `html2canvas` + `jspdf` to capture the DOM exactly as rendered.

### E. Email Automation
- **Triggers:**
  - **Registration:** Welcome email + Ticket QR Code.
  - **Paper Submission:** Confirmation receipt to author.
  - **Award Nomination:** Notification to nominee.
- **Infrastructure:** Use `nodemailer` with highly styled HTML templates that match the website's branding.

---

## 3. DETAILED FORM SPECIFICATIONS (Important)

The website uses **4 Major Forms** with specific logic. The AI must replicate these exact flows:

### 1. Attendee Registration Form (Multi-Step)
- **Flow:** 
  1.  **Ticket Selection:** Visual cards for types (Early Bird, Regular, Student, E-Oral, E-Poster, Listener).
  2.  **Attendee Details:** First Name, Last Name, Email, Organization, Role (Professor/Student/Industry), Country, Dietary Requirements.
  3.  **Payment:** **Razorpay** Integration. Features Coupon Code validation.
  4.  **Success:** Confirmation screen with Order ID.
- **Features:** "Exit Intent" Modal to retain users leaving the page, Dynamic Pricing based on backend data.

### 2. Call for Papers Submission Form
- **Fields:** Author Name, Email, WhatsApp Number, Country, Paper Title, Organization, **Research Track** (Generative AI, Robotics, Computer Vision, etc.), Co-Authors.
- **Upload:** File input for Abstract (PDF/DOCX, Max 10MB).
- **Features:** Countdown timer to deadline, visual upload progress.

### 3. Speaker Application Form (3-Step Wizard)
- **Step 1: Personal Info:** Name, Email, WhatsApp, LinkedIn, Website.
- **Step 2: Professional Background:** Current Role, Company, Bio (150 words).
- **Step 3: Talk Proposal:** Session Title, Session Type (Keynote/Panel/Workshop), Duration (15/30/45/60 mins), Abstract.
- **UI:** Progress bar indicator, animated transitions between steps (`Framer Motion`).

### 4. Admin Login Form
- **Fields:** Email Address, Password.
- **Features:** 
  - Real-time validation.
  - "Forgot Password" link functionality.
  - Redirect to dashboard (`/admin`) upon success.
  - Custom UI matching the site's dark theme (not default Supabase UI).

### 5. Contact & Inquiry Forms
- **Contact Form:** Name, Email, Subject, Message.
- **Hero Inquiry Form:** Quick lead gen on landing page (Name, Email, WhatsApp, Country).
- **Newsletter:** Email subscription field.

---

## 4. UI/UX Guidelines

- **Typography:** Modern sans-serif (Inter/Geist) with strict spacing scales.
- **Color Palette:** Deep navy/black backgrounds (#0D0B1E) with neon accent colors (#5B4DFF Purple, #00D9FF Cyan) for the "AI" feel.
- **Interactions:**
  - Hover effects on cards.
  - Smooth transitions between pages.
  - Loading skeletons for data fetching states.

---

## 5. Implementation Steps for the AI

1.  **Setup:** Initialize Next.js app with `create-next-app`, configure Tailwind and ShadCN/UI.
2.  **Database:** precise Prisma schema creation and seeding.
3.  **Auth Integration:** Middleware for creating protection around Admin routes.
4.  **Frontend Dev:** Build the Layout (Navbar/Footer) and Hero sections first to establish design language.
5.  **Feature Dev:** Implement the Certificate Generator logic (Canvas interaction) as a priority module.
6.  **Backend Logic:** Write Server Actions for form submissions (email trigger -> db save).
7.  **Optimization:** Run Lighthouse audit, fix CLS/LCP issues, ensure mobile responsiveness.

---

**Prompt for Code Generation:**
"Generate the code for the [Specific Module, e.g., 'Speaker Application Wizard'] using the stack defined above. Ensure it uses `framer-motion` for step transitions, connects to the `SpeakerApplication` Prisma model, and implements validation for all fields including the 150-word bio limit..."
