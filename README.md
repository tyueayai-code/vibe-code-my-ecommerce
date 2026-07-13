# Project: Emotional E-commerce (Birthday Cake & Cross-Border Surprise Platform)

## 1. Project Overview
A hyper-local and cross-border e-commerce platform bridging emotional distance by enabling users to send birthday cakes and creative surprises to loved ones anywhere.-

## 2. Target Users & Roles
- **Senders:** Users living far away or locally who want to send a customized birthday surprise.
- **Local Bakeries / Premium Shops:** Established local cake shops increasing local sales.
- **Home Bakers:** Hobbyist bakers without a storefront (free tier for the first 10 orders).

## 3. Core Features (Functional Requirements)
1. **Flexible Budget & Fun Gifts:**
   - Filter/Search items by price range (from low-budget novelty items to premium cakes).
2. **Hyper-Local & Global Search:**
   - Location-based store discovery ("Cake near me").
   - Cross-region ordering (e.g., sender in City A orders for recipient in City B).
3. **Home-Baker Onboarding:**
   - Simple registration for home bakers with a 0% commission quota for the first 10 orders.
4. **Emotional Media & Customization:**
   - **Video-to-QR:** Upload video messages to generate a QR code attached to the gift box.
   - **Digital Greeting/Drawing:** In-app canvas for drawing or writing custom cards.
   - **Packaging Options:** Select wrapping paper and packaging types.
5. **Reliable Long-Distance Delivery:**
   - Delivery tracking and secure handling for local/long-distance delivery.

## 4. Monetization Model
- **Commission/Platform Fee:** Percentage cut from partner bakery sales.
- **Visibility Boost:** Paid promotion/ads package for bakeries to rank higher in "near me" searches.

## 5. Technical Scope & Suggested Tech Stack (MVP)
- **Frontend:** React / Next.js / Tailwind CSS (Responsive mobile-first design)
- **Backend:** Node.js (Express) or Serverless (Firebase / Supabase)
- **Database:** PostgreSQL or MongoDB (Storing users, shops, products, orders)
- **Key Integrations:** - Geolocation API (for "near me" and delivery distance calculation)
  - QR Code generator library
  - Canvas API (for digital drawing/cards)
  - Payment Gateway (Stripe/PromptPay or local payment integration)

## 6. Suggested Development Phases (For AI Prompting)
- **Phase 1:** Core UI/UX (Landing page, Search/Filter by location & budget)
- **Phase 2:** Vendor Management (Home baker registration & product catalog)
- **Phase 3:** Emotional Features (QR video upload & digital card canvas)
- **Phase 4:** Checkout & Order Tracking