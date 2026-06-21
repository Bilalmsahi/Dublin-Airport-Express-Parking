<div align="center">

<img src="frontend/public/images/icon-large.png" alt="Dublin Airport Express Parking" width="110" />

# Dublin Airport Express Parking

### A full-featured Meet & Greet airport parking platform — booking engine, customer self-service portal, and a real-time finance dashboard, built end-to-end in React.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe&logoColor=white&style=flat-square)](https://stripe.com/)
[![Bootstrap](https://img.shields.io/badge/UI-React--Bootstrap-7952B3?logo=bootstrap&logoColor=white&style=flat-square)](https://react-bootstrap.github.io/)
[![License](https://img.shields.io/badge/status-production-success?style=flat-square)]()

</div>

---

## Overview

**Dublin Airport Express Parking** is the production website and customer platform for a real Meet & Greet airport parking business. It's not a template or a landing-page mockup — it's a complete commercial system covering everything from the first marketing touchpoint to the post-trip refund, including:

- A conversion-optimized public marketing site (SEO, structured data, social previews)
- A guided, multi-step booking flow with live pricing, add-ons, and coupons
- Secure card payments via **Stripe**, including partial/extra charges for reschedules
- A self-service **Customer Dashboard** for managing, rescheduling, and cancelling bookings
- A no-login **"Manage My Booking"** flow for guest customers
- An internal **Finance Dashboard** with real-time revenue, expense, and trend analytics
- JWT authentication with automatic token refresh, loyalty/credit points, and policy-driven business rules

This repository represents the **customer-facing frontend** of the platform, built as a fast, modern Single Page Application that talks to a REST API backend.

---

## ✨ Key Features

### 🌐 Marketing Website
- Animated hero banner (Swiper carousel with fade transitions)
- "How it Works" explainer, dynamic FAQ section pulled from the API
- Rich SEO: per-page meta tags, Open Graph/Twitter cards, canonical URLs, and `Organization` / `LocalBusiness` / `FAQPage` JSON-LD structured data for Google rich results
- Google Tag Manager integration, live chat (Tidio), and a floating WhatsApp click-to-chat widget
- GDPR-style cookie consent banner

### 📅 Smart Booking Engine
- Multi-step guided checkout: **Account → Vehicle & Flight Details → Add-Ons → Payment → Confirmation**
- Live, date-driven price calculation (per-day rate + base price) with a persistent price summary panel
- Optional add-ons (valet/car wash tiers) with dynamic surcharge rules (e.g. Jeep/MPV pricing)
- Coupon code and **loyalty credit points** redemption at checkout
- 72-hour cancellation policy warnings shown contextually during booking
- Booking state persisted client-side so users can safely resume an in-progress booking

### 💳 Payments
- **Stripe Elements** integration for secure, PCI-compliant card capture
- Payment intent creation, status polling, and server-side amount verification (prevents client-side tampering)
- Supports top-up/extra charges automatically when a reschedule increases trip length

### 👤 Customer Dashboard
- View all bookings with live status (Pending, Confirmed, Started, Rescheduled, Cancelled, Completed)
- **Reschedule** bookings with automatic extra-day pricing and payment collection
- **Cancel** bookings with rule-driven refund eligibility (72-hour no-refund window) — choose a cash refund or convert to loyalty credit points
- Locking rules prevent edits too close to departure/return time
- Guest customers can manage a booking via a secure emailed link — no account required

### 📊 Finance Dashboard (Internal)
- Real-time KPIs: balance, expenses, earnings, profit/loss
- Per-service and per-add-on breakdowns (completed vs. cancelled orders & revenue)
- Interactive charts (bar, pie, line, area) via **Recharts** — bookings by status, monthly earnings trend, 30-day booking volume
- Fixed and recurring expense management (create, edit, delete) with month/year/all-time filtering
- Multi-website filtering, built to support more than one parking brand from a single back office
- Secured via a separate JWT scope passed from the admin system

### 🔐 Auth & Account System
- JWT login/signup with automatic silent token refresh on expiry
- Session-aware UI (header, dashboard, booking flow all adapt to logged-in state)
- Centralized `customFetch` wrapper handling auth headers, token refresh, and retry logic transparently

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 6 |
| Routing | React Router v7 (with lazy-loaded routes) |
| Payments | Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`) |
| UI | React-Bootstrap, Bootstrap 5, custom CSS, FontAwesome / React Icons |
| Charts | Recharts |
| Carousel | Swiper |
| Notifications | React-Toastify, custom popup/modal components |
| Dates | Luxon (timezone-aware Dublin time calculations) |
| SEO | React Helmet Async + JSON-LD structured data |
| Live Chat | Tidio + `react-floating-whatsapp` |
| Tooling | ESLint, Sass |

---

## 📂 Project Structure

```
frontend/
├── public/
│   └── images/                # Favicons, OG images
├── src/
│   ├── auth/                  # AuthContext + JWT-aware fetch wrapper
│   ├── components/
│   │   ├── BookingForm/        # 5-step booking wizard + price summary
│   │   ├── CustomerDashboard/  # Reschedule, cancel & payment modals
│   │   ├── FinanceDashboard/   # Internal analytics API helpers
│   │   ├── HomePage/           # Hero booking widget, FAQ accordion
│   │   ├── Services/           # Service cards, modal, loading shimmer
│   │   └── Utility/             # Header, Footer, Cookie banner, popups
│   ├── context/                # Global booking state (persisted to localStorage)
│   ├── pages/                  # Route-level pages (Home, Services, Login, Dashboards, etc.)
│   ├── services/                # Stripe payment service layer
│   ├── utils/                   # Shared business rules (cancellation/reschedule policy)
│   └── App.jsx                  # Route definitions
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A running instance of the backend API

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env` file inside `frontend/`:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Run the Dev Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## 🧭 Business Rules Worth Highlighting

This isn't just a CRUD app — real booking policy logic is baked into the frontend (and mirrored/enforced server-side):

- **Reschedules**: extending a trip charges a per-day rate; shortening one is free and never refunded
- **Cancellations**: a flat fee applies, with a 72-hour no-refund cutoff on standard Meet & Greet bookings, and an option to convert the refund into loyalty credit instead of cash
- **Time-based locking**: departure/return times become locked for edits inside a 24-hour window, or once a booking has already "Started"

See [`bookingRules.js`](frontend/src/utils/bookingRules.js) for the full implementation.

---

## 📌 About This Project

Built and maintained as a real-world, revenue-generating product for a working airport parking business — covering the full customer lifecycle from marketing and booking through payment, self-service account management, and internal financial reporting.

