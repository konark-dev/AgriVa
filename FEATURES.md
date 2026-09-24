# 🌾 AgriVa: Complete Platform Feature List & Walkthrough

AgriVa is a massive, multi-sided agricultural fintech and supply chain platform. It connects 10 distinct personas through a unified, real-time ecosystem powered by escrow, AI, and verified logistics.

---

## 🎭 1. The Multi-Persona System
The app features a **Live Actor Switcher** at the top of the screen, allowing you to instantly swap between 10 different roles to test the end-to-end lifecycle of a trade:
1. **🌱 New Farmer:** Unverified profile (KYC pending).
2. **🌾 Verified Farmer:** Completed e-KYC, eligible for direct bank escrow.
3. **🏢 FPO (Cooperative):** Aggregates multiple farmers' produce.
4. **🛒 Consumer (Retail):** Buys small batches directly.
5. **🛍️ Bulk Buyer (B2B):** Posts large-scale demands and signs digital contracts.
6. **🚚 Transporter (Driver):** Individual truck drivers tracking live routes.
7. **🚛 Fleet Aggregator:** Manages multiple vehicles and assigns jobs.
8. **🏛️ Mandi APMC:** Controls gate traffic and auction sheds.
9. **🔬 Quality Lab:** Issues digital crop quality certificates.
10. **🏦 Lender (Agri-Credit):** Underwrites loans based on verified platform data.
11. **🛡️ Admin:** Super-admin overview.

---

## 🚀 2. Core Functional Modules

### A. Dynamic Bidding & Reverse Auctions (Marketplace)
*   **Farmer Listings:** Farmers can easily snap a photo, speak their crop details (via voice input), and post a listing.
*   **Bulk Buyer Demand Broadcasting:** Buyers can post massive requirements (e.g., 5,000 kg Grade A Tomato) which instantly broadcasts to nearby FPOs.
*   **Counter-Bidding & Negotiation:** Buyers and sellers can counter-offer prices until they reach an agreement.
*   **Escrow-Backed Trust:** Once a bid is accepted, the buyer's funds are locked in an institutional escrow account, guaranteeing payment to the farmer only upon successful delivery.

### B. AgriQ Logistics & Freshness Routing
*   **Live Tracking:** Interactive Leaflet map showing the moving truck from farm to delivery hub.
*   **Freshness-Aware Route Optimizer:** Compares routes based on time and road quality. It calculates a **"Freshness Decay Index"** (e.g., rejecting a cheap highway route because a 6.5hr delay carries a 74% spoil risk for perishable tomatoes).
*   **Multi-Stop Optimizer:** Nearest-neighbor routing for fleet aggregators picking up from multiple farms.

### C. Institutional Agri-Credit (Lender Console)
A complete 4-step underwriting dashboard for rural banks (e.g., NABARD):
1.  **Credit Console:** Real-time overview of active loan requests and portfolio health.
2.  **Application Review:** Evaluates an FPO's requested limit against their active, confirmed buyer contracts (Receivables Collateral).
3.  **Platform Activity Assessment:** Assesses the borrower based on immutable platform data (On-time deliveries, Quality disputes, Lifetime GMV).
4.  **Automated Trade Escrow Recourse:** Repayment schedules that automatically deduct 15% of in-bound trade proceeds directly from the escrow account, reducing default risk to near-zero.

### D. Mandi Control & Quality Certification
*   **Mandi Gate Switchboard:** APMC operators can control gate traffic, report broken weighbridges, and trigger "High Alert" crowd congestion protocols.
*   **Lab Dashboard:** Quality inspectors digitally assay crops (moisture %, foreign matter) and issue e-NAM compliant certificates that unlock the next stage of the escrow payout.

### E. AI & Voice Accessibility
*   **Voice-First Interface:** Orange mic buttons across the app allow farmers to dictate locations and quantities. The "सुनें" (Listen) button reads text aloud for accessibility.
*   **AI Demand Forecasting:** Predictive charts showing historical vs. future predicted mandi rates, helping farmers decide whether to sell today or hold their crop.

---

## 🚶‍♂️ 3. End-to-End Walkthrough (The "Golden Path")

Here is how a complete transaction flows through AgriVa:

1. **The Demand (Bulk Buyer):** The *Bulk Buyer* logs in and posts a demand for 1,500 kg of Tomatoes.
2. **The Match (FPO):** The *FPO* sees this requirement, aggregates 4 member farmers (Ramcharan, Shyamlal, etc.), and accepts the bid at ₹27/kg.
3. **The Escrow Lock:** The Buyer transfers ₹40,500 into the **AgriVa Escrow**. The funds are locked.
4. **The Transport (Driver):** The *Transporter* accepts the job. They use the **Route Comparison** tool to select the fastest "Green Corridor" to prevent tomato spoilage. They click **Start Journey**.
5. **The Quality Check (Lab):** Upon arrival at the Mandi, the *Quality Lab* inspects the tomatoes, confirms they are "Grade A" (<10% moisture), and uploads the certificate.
6. **The Payout (Verified Farmer):** The Buyer accepts the delivery. The Escrow automatically releases funds. Because the Farmer is **Verified (e-KYC)**, the money hits their *Direct Bank Deposit* card instantly (which they can hide with the new 👁️ privacy toggle).
7. **The Financing (Lender):** Because the FPO successfully completed this high-value order, the *Lender* reviews their "Platform Activity Assessment" and confidently approves a ₹5,00,000 working capital loan for their next harvest.

---

## 💻 4. Technical Highlights
*   **Fully Responsive:** Scales perfectly from cheap 3G mobile devices to ultra-wide PC monitors using dynamic grid layouts.
*   **PWA Ready:** Bottom navigation and touch-friendly targets mimic a native app experience.
*   **Bilingual:** UI components designed with dual Hindi/English labels for rural adoption.

## Governance-Gap Acknowledgment

A legitimately CIN-registered FPO could still be internally run by an ex-trader re-inserting themselves as a middleman � this is a governance risk our platform reduces exposure to via the trust-score and dispute system, but cannot fully eliminate through software alone.
