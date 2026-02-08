# 🚀 Staged Features & Deployment Manifest

**Version**: 2.5 (Post-Efficiency Polish)
**Date**: February 7, 2026

This document catalogs the specific deployment segments, risks, and verification steps for the current release candidate.

---

## 📦 Deployment Strategy: Phased Rollout

We will deploy these changes in **3 Logical Segments** to minimize risk and ensure stability.

### 🔹 Segment 1: The Core Architecture Flip (High Risk)
**What**: Pushing the refactored **Server Shell** architecture for `/register` and `/sessions`.
*   **Old**: Client-only pages (Low SEO, bots see "Loading").
*   **New**: `page.tsx` (Server) exports Metadata + `Client.tsx` handles UI.
*   **Why First?**: This changes how the page is built. If this fails, the site breaks immediately.

**⚠️ Potential Errors / Risks**:
1.  **Hydration Mismatch**: "Text content does not match server-rendered HTML".
    *   *Cause*: Browser time vs Server time offsets in dates/countdowns.
    *   *Fix*: Ensure all dynamic time/date logic stays inside `useEffect` or uses strict formatting.
2.  **Missing Exports**: "Default export is not a React Component".
    *   *Cause*: `page.tsx` not exporting the component correctly after refactor. (Already verified locally).

**✅ Verification**:
*   Open `/register`. If it loads without a white screen flash, pass.
*   Check "View Source" (Ctrl+U). Do you see `<title>Register | WARS 2026</title>`? If yes, Server Side Rendering (SSR) is working.

---

### 🔹 Segment 2: The SEO & Navigation Efficiency (Medium Risk)
**What**: Structured Data, SPA Links, and Sitemap updates.
*   **Changes**: `sitemap.ts`, `robots.ts`, JSON-LD in `page.tsx`.
*   **Impact**: Bot visibility and navigation speed.

**⚠️ Potential Errors**:
1.  **Invalid JSON-LD**: Google Search Console may flag "Unparseable structured data".
    *   *Cause*: Missing quotes or trailing commas in the JSON string.
    *   *Fix*: Use [Schema.org Validator](https://validator.schema.org/) immediately after deploy.
2.  **Broken Links**: Next.js `<Link>` components pointing to non-existent routes.
    *   *Verify*: Click *every* link on the homepage. Ensure no 404s.

---

### 🔹 Segment 3: The Experiential Polish (Low Risk)
**What**: Removing `PageLoader`, enforcing Reduced Motion, and Admin Dashboard.
*   **Changes**: `SessionsClient.tsx`, `RegisterClient.tsx`, `admin/page.tsx`.

**⚠️ Potential Errors**:
1.  **"FOUC" (Flash of Unstyled Content)**: Without the PageLoader, users might see unstyled fonts for 0.1s.
    *   *Mitigation*: We are using `next/font` which preloads critical fonts. Risk is low.
2.  **Admin API Failures**: The new Glassmorphic forms might try to `POST` data in a format the backend doesn't expect if schema changed.
    *   *Verify*: Submit a "Test Speaker" in the new Admin Panel to confirm end-to-end data flow.

---

## 📝 Change Log (Since Last Deploy)

### ✨ Features & Polish
- **Removed**: `PageLoader` component (distracting animation).
- **Added**: `prefers-reduced-motion` support for `Reveal`, `WavyBackground`, `BackgroundGradient`.
- **New Admin UI**: Consolidated "Glassmorphic" Dashboard combining Attendees/Speakers/Sessions.

### ⚙️ Technical Debt Paid
- **Server Shell Pattern**: Implemented on all primary routes.
- **Link Optimization**: 100% of internal links migrated to Next.js `Link`.
- **Accessibility**: HTML Validation scan passed (Zero critical errors).

---

## 🚨 Emergency Rollback Trigger
If **Registration Page** or **Payment Flow** fails (White screen or 500 error):
1.  Revert `src/app/(public)/register/page.tsx` to previous commit (Client-Only version).
2.  Revert `sitemap.ts`.
3.  Redeploy immediately (Time to recovery: ~2 mins).
