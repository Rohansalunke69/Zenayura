# ZenAyura System Analysis Report

This document provides a comprehensive audit of the ZenAyura platform architecture, assessing five key systems. The analysis was guided by professional standards derived from enterprise production-code auditing and architecture review principles.

## 1. Authentication System

**Current State:**
- The authentication system is functional and powered by `NextAuth.js`.
- It supports Google OAuth and manual Email/Password signups using `bcryptjs` for secure password hashing.
- Session handling relies on JWT strategy, correctly embedding `id` and `role` within tokens.
- **Verdict**: The core authentication system is stable, secure, and correctly uses `prisma` for user data persistence and provider linking.

## 2. User Health Profile System

**Current State:**
- **Database**: The `HealthProfile` model is correctly established with a one-to-one mapping to the `User` model, enforcing cascade deletion.
- **Functionality**: Users can successfully set up their profile, upload a profile picture (handling files up to 5MB, constrained to JPG/PNG/WEBP), and edit details post-setup.
- **UI/UX**: The application provides a visual dashboard to interact with health and lifestyle vitals and employs a Next.js `ProfileGuard` component to enforce the setup workflow conditionally.
- **Verdict**: The Health Profile system is fully functional, complete, and resilient. Git tracking for uploaded profiles was correctly disabled to prevent bloat.

## 3. Doctor Workflows

**Current State:**
- **Database**: The `Doctor` model exists and tracks specialized fields (`specialty`, `experience`, `consultationFee`, `timeSlots`, `certifications`).
- **Dashboard**: A `doctor-portal` route exists showing appointment requests.
- **Visibility**: Users can view the directory of doctors on `/dashboard/doctors`.
- **Issues Found**:
  - The Doctor platform relies heavily on **Mock Data**. Both `src/app/(dashboard)/doctor-portal/page.tsx` and `src/app/api/doctor/profile/route.ts` hardcode `MOCK_DOCTOR_USER_ID = "doctor_12345"`.
  - There is currently no UI flow for a user to actually register/upgrade their account to a "Doctor" role dynamically. 

## 4. Appointment / Consultation Flow

**Current State:**
- **Database**: Appears solid with a defined `Appointment` model linking `User` and `Doctor` through relations, tracking connection dates and `status` strings (PENDING, CONFIRMED, etc.).
- **API routes**:
  - Exists at `/api/appointments/route.ts` with `GET`, `POST`, and `PATCH` methods.
- **Issues Found**:
  - The `POST` and `GET` functions for creating and fetching user appointments are completely hardcoded to use `const MOCK_USER_ID = "user_12345"`. Appointments booked by real users will fail or collide on this mock ID.
  - While doctors have logic to accept/cancel appointments (likely via `AppointmentActions`), the underlying connections are disconnected from actual authentication sessions.

## 5. Routing and Navigation

**Current State:**
- **Middleware**: The `src/middleware.ts` successfully guards private routes (`/dashboard/:path*`, `/doctor-portal/:path*`) enforcing sign-in validation.
- **Redirection**: It automatically handles redirecting users with a `role !== "doctor"` away from `/doctor-portal`.
- **Onboarding**: Handled smoothly using the `ProfileGuard` to force un-profiled users to `/profile-setup`.

---

## 🚨 MISSING / BROKEN FEATURES 🚨

Based on the audit, the following critical features require immediate implementation or repair to make the platform fully operational end-to-end:

### 1. Doctor Account Creation & Onboarding
- **Missing Feature**: There is no signup, registration, or application flow for an individual to become a Doctor.
- **Missing Feature**: The `/api/doctor/profile/route.ts` exists but uses mock variables. It must be refactored to use the dynamic `session.user.id` from NextAuth.

### 2. Appointment Booking Pipeline is Broken
- **Broken Feature**: `src/app/api/appointments/route.ts` uses a hardcoded `MOCK_USER_ID = "user_12345"`. It completely ignores the securely logged-in user. This must be refactored to pull the `userId` directly from `getServerSession`.
- **Broken Feature**: The doctor portal (`src/app/(dashboard)/doctor-portal/page.tsx`) uses a hardcoded `MOCK_DOCTOR_USER_ID = "doctor_12345"` to fetch incoming appointments. This must also depend on the securely authenticated session token.

### 3. Role-Based Auth Adjustments
- **Incomplete**: When a user registers as a doctor (once the flow is built), their token must properly capture and reflect the `role: "doctor"` property so `middleware.ts` allows them to access the `/doctor-portal`.
- **Incomplete**: If a doctor attempts to access the portal *without* creating their doctor profile, they refer to `/doctor-portal/profile` which currently requires manual access to test.

### Next Steps Recommendation
The immediate priority should be resolving the hardcoded Mock IDs across the API routes. Once dynamic session data is connected, a dedicated "Apply as Doctor" or "Doctor Registration" workflow should be constructed.
