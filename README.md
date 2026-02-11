# AgTech Transformation Summit 2026 - India's Premier Agricultural Innovation Platform

### Where Farmers Meet Technology, Research Meets Markets 2026

---

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

**The official platform for the AgTech Transformation Summit 2026. A premium, high-performance web experience for the global agricultural innovation community.**

[Features](#features) • [Quick Start](#quick-start) • [Tech Stack](#technology-stack) • [Documentation](#documentation)

</div>

---

## 🌐 Overview

The AgTech Transformation Summit 2026 platform is a world-class, enterprise-grade conference management system. Built with **Next.js 14**, **TypeScript**, and **PostgreSQL**, it delivers a buttery-smooth 95+ Lighthouse performance score while providing a rich, animated, and futuristic visual experience.

### 🎯 Key Highlights

- 🚀 **Extreme Performance** - Optimized with React Refs and Next.js Image for 96+ Mobile scores.
- 🎨 **Futuristic Design** - Premium Glassmorphism, Neural-drift animations, and Vision Aura effects.
- 📱 **Mobile-First Navigation** - Advanced 5-item mobile dock for app-like navigation.
- 📄 **Academic Workflow** - Full paper submission, review, and publication management.
- 📊 **Admin Intelligence** - Real-time metrics dashboard with live traffic and revenue tracking.
- 💳 **Secure Payments** - Integrated Razorpay gateway with automated invoicing.

---

## ✨ Features

### For Attendees & Researchers
- **Interactive Schedule**: Browse sessions, workshops, and keynote details.
- **Paper Submission**: Managed portal for abstract and full paper uploads.
- **Award Nominations**: Simple and quick nomination process for recognizing peers.
- **Resource Center**: High-speed access to templates, brochures, and guidelines.
- **Smart Registration**: Seamless checkout process with dynamic pricing and coupons.

### For Conference Organizers
- **Command Center**: Manage speakers, committee members, and important dates.
- **Award Nominations**: Comprehensive system for managing award categories and nominee submissions.
- **Dynamic Content**: Update site settings, social links, and venue details in real-time.
- **Automated Communication**: Integrated mailers for registrations, submissions, and nominations.
- **SEO & AEO Ready**: Full JSON-LD schema implementation for AI and search engines.

---

## 🛠 Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, Framer Motion, Tailwind CSS
- **Backend**: Node.js, Prisma ORM
- **Database**: PostgreSQL (v14+)
- **Services**: Supabase (Auth & Storage), Razorpay (Payments), Nodemailer (Email)
- **Deployment**: Vercel Edge Network

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL Database
- Supabase Account
- Razorpay Credentials

### Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/SAMSHUVA/agtech-summit-2026.git
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file based on `.env.example`:
   ```env
   DATABASE_URL="postgresql://..."
   NEXT_PUBLIC_SUPABASE_URL="https://..."
   NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
   RAZORPAY_KEY_ID="..."
   RAZORPAY_KEY_SECRET="..."
   ```

3. **Database Initialization**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development**
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

- `src/app`: Next.js App Router (Public & Admin routes)
- `src/components`: UI components (Dock, Reveal, Terminal, etc.)
- `src/config`: Static and dynamic conference configurations
- `src/lib`: Core utilities (Prisma client, Supabase integration)
- `prisma/`: Database schema and migration history
- `public/`: Optimized assets (WebP logos, background videos)
- `scripts/`: Database maintenance and diagnostic utilities
- `docs/`: Technical guides and API references

---

## 📚 Documentation

For deeper technical details, refer to:
- **[Developer Guide](./docs/DEVELOPER_GUIDE.md)**: Architecture and workflow.
- **[API Reference](./docs/API_DOCUMENTATION.md)**: Endpoint documentation.

---

<div align="center">

**AgTech '26** - Where Farmers Meet Technology, Research Meets Markets

Built with ❤️ by IAISR Engineering

</div>
