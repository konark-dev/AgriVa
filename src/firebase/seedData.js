/**
 * Initial Seed Data for AgriVa Platform
 * Contains Agmarknet Mandi Price dataset, demo listings, deliveries, lab registrations,
 * and actor verification queues (FPO, Bulk Buyer, Farmers, Logistics).
 */

export const INITIAL_MANDI_PRICES = [
  {
    id: "mandi-azadpur-wheat",
    mandiName: "Azadpur Mandi, Delhi",
    crop: "Wheat",
    location: { lat: 28.7041, lng: 77.1025 },
    minPrice: 22,
    maxPrice: 26,
    modalPrice: 25,
    date: "2026-09-16",
    history: [
      { date: "2026-09-10", modalPrice: 23 },
      { date: "2026-09-11", modalPrice: 23.5 },
      { date: "2026-09-12", modalPrice: 24 },
      { date: "2026-09-13", modalPrice: 24 },
      { date: "2026-09-14", modalPrice: 24.5 },
      { date: "2026-09-15", modalPrice: 25 },
      { date: "2026-09-16", modalPrice: 25 }
    ]
  },
  {
    id: "mandi-azadpur-tomato",
    mandiName: "Azadpur Mandi, Delhi",
    crop: "Tomato",
    location: { lat: 28.7041, lng: 77.1025 },
    minPrice: 30,
    maxPrice: 42,
    modalPrice: 38,
    date: "2026-09-16",
    history: [
      { date: "2026-09-10", modalPrice: 45 },
      { date: "2026-09-11", modalPrice: 44 },
      { date: "2026-09-12", modalPrice: 42 },
      { date: "2026-09-13", modalPrice: 40 },
      { date: "2026-09-14", modalPrice: 39 },
      { date: "2026-09-15", modalPrice: 38 },
      { date: "2026-09-16", modalPrice: 38 }
    ]
  },
  {
    id: "mandi-vashi-rice",
    mandiName: "Vashi APMC, Navi Mumbai",
    crop: "Rice",
    location: { lat: 19.076, lng: 73.0079 },
    minPrice: 35,
    maxPrice: 42,
    modalPrice: 40,
    date: "2026-09-16",
    history: [
      { date: "2026-09-10", modalPrice: 38 },
      { date: "2026-09-11", modalPrice: 38.5 },
      { date: "2026-09-12", modalPrice: 39 },
      { date: "2026-09-13", modalPrice: 39 },
      { date: "2026-09-14", modalPrice: 39.5 },
      { date: "2026-09-15", modalPrice: 40 },
      { date: "2026-09-16", modalPrice: 40 }
    ]
  },
  {
    id: "mandi-kolar-tomato",
    mandiName: "Kolar APMC, Karnataka",
    crop: "Tomato",
    location: { lat: 13.1367, lng: 78.1292 },
    minPrice: 28,
    maxPrice: 36,
    modalPrice: 34,
    date: "2026-09-16",
    history: [
      { date: "2026-09-10", modalPrice: 30 },
      { date: "2026-09-11", modalPrice: 31 },
      { date: "2026-09-12", modalPrice: 32 },
      { date: "2026-09-13", modalPrice: 33 },
      { date: "2026-09-14", modalPrice: 33.5 },
      { date: "2026-09-15", modalPrice: 34 },
      { date: "2026-09-16", modalPrice: 34 }
    ]
  },
  {
    id: "mandi-nasik-onion",
    mandiName: "Lasalgaon Mandi, Nasik",
    crop: "Onion",
    location: { lat: 20.1478, lng: 74.2255 },
    minPrice: 18,
    maxPrice: 25,
    modalPrice: 22,
    date: "2026-09-16",
    history: [
      { date: "2026-09-10", modalPrice: 21 },
      { date: "2026-09-11", modalPrice: 21.5 },
      { date: "2026-09-12", modalPrice: 22 },
      { date: "2026-09-13", modalPrice: 22 },
      { date: "2026-09-14", modalPrice: 22 },
      { date: "2026-09-15", modalPrice: 22 },
      { date: "2026-09-16", modalPrice: 22 }
    ]
  }
];

export const INITIAL_LISTINGS = [
  {
    id: "lst-101",
    farmerId: "usr-farmer-1",
    farmerName: "Ramesh Kumar (FPO Sonipat)",
    farmerPhone: "+91 98765 43210",
    crop: "Wheat",
    quantity: 2500,
    price: 24,
    location: { name: "Sonipat, Haryana", lat: 28.9931, lng: 77.0151 },
    harvestDate: "2026-09-20",
    status: "Listed",
    createdAt: new Date().toISOString()
  },
  {
    id: "lst-102",
    farmerId: "usr-farmer-2",
    farmerName: "Suresh Patel",
    farmerPhone: "+91 98123 45678",
    crop: "Tomato",
    quantity: 1200,
    price: 36,
    location: { name: "Karnal, Haryana", lat: 29.6857, lng: 76.9905 },
    harvestDate: "2026-09-18",
    status: "Bid Received",
    acceptedBidId: null,
    createdAt: new Date().toISOString()
  },
  {
    id: "lst-103",
    farmerId: "usr-farmer-1",
    farmerName: "Ramesh Kumar",
    farmerPhone: "+91 98765 43210",
    crop: "Onion",
    quantity: 3000,
    price: 21,
    location: { name: "Panipat, Haryana", lat: 29.3909, lng: 76.9635 },
    harvestDate: "2026-09-17",
    status: "Transport Assigned",
    deliveryMode: "verified",
    transporterId: "usr-transporter-1",
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_BIDS = [
  {
    id: "bid-201",
    listingId: "lst-102",
    buyerId: "usr-buyer-bulk",
    buyerName: "AgroCorp Bulk Traders",
    price: 37,
    status: "Pending",
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_DELIVERIES = [
  {
    id: "del-301",
    listingId: "lst-103",
    farmerName: "Ramesh Kumar",
    crop: "Onion",
    quantity: 3000,
    transporterId: "usr-transporter-1",
    transporterName: "Kisan Logistics (HR-10-AB-1234)",
    pickupLocation: { name: "Panipat, Haryana", lat: 29.3909, lng: 76.9635 },
    deliveryLocation: { name: "Azadpur Mandi, Delhi", lat: 28.7041, lng: 77.1025 },
    status: "Transport Assigned",
    pickupOrder: [
      { id: "stop-1", name: "Farm 1 - Panipat", lat: 29.3909, lng: 76.9635, quantity: 1500 },
      { id: "stop-2", name: "Farm 2 - Sonipat", lat: 28.9931, lng: 77.0151, quantity: 1500 }
    ],
    qualityCheck: { condition: "Good", photoUrl: "" },
    weightDeclared: 3000,
    weightConfirmed: 3000,
    weightMismatch: false,
    deliveryMode: "verified",
    eta: "Today, 5:30 PM"
  }
];

export const INITIAL_LAB_REGISTRATIONS = [
  {
    id: "lab-reg-1",
    userId: "usr-lab-1",
    labName: "AgriCert Quality Labs",
    location: "Sonipat Industrial Area",
    certificateNumber: "NABL-AGRI-2024-889",
    expiryDate: "2027-12-31",
    documentUrl: "mock_cert_doc.png",
    verificationStatus: "approved",
    rejectionReason: ""
  },
  {
    id: "lab-reg-2",
    userId: "usr-lab-2",
    labName: "Kisan Testing Facility",
    location: "Karnal Bypass",
    certificateNumber: "NABL-AGRI-2025-412",
    expiryDate: "2026-11-30",
    documentUrl: "mock_facility_doc.png",
    verificationStatus: "pending",
    rejectionReason: ""
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    userId: "usr-farmer-1",
    title: "Bid Received! 🌾",
    message: "AgroCorp placed a bid of ₹37/kg on your Tomato listing.",
    timestamp: "10 mins ago",
    read: false
  },
  {
    id: "notif-2",
    userId: "usr-transporter-1",
    title: "New Pickup Assigned 🚚",
    message: "You have been assigned pickup for 3000kg Onion from Panipat.",
    timestamp: "25 mins ago",
    read: false
  }
];

// ==========================================
// ACTOR REGISTRATIONS & VERIFICATION QUEUES
// ==========================================

export const INITIAL_REGISTERED_USERS = [
  // 1. Individual Farmer (DPDP Compliant Masked Aadhaar, GPS, Land proof, New Seller Badge)
  {
    uid: "usr-farmer-1",
    name: "Ramesh Kumar",
    phone: "+91 98765 43210",
    role: "farmer",
    aadhaarMasked: "XXXX-XXXX-7779",
    aadhaarToken: "TK-AAD-999988887779",
    farmLocation: { name: "Sonipat Farm Plot #14", lat: 28.9931, lng: 77.0151 },
    landProofNumber: "KHASRA-HR-2024-112",
    bankAccount: "SBI-XXXX-8921",
    upiId: "ramesh@sbi",
    fpoAffiliation: "Sonipat Kisan Agro FPO",
    trustScore: 88,
    sellerBadge: "Verified Farmer",
    verificationStatus: "active"
  },
  {
    uid: "usr-farmer-2",
    name: "Dinesh Sharma",
    phone: "+91 98123 45678",
    role: "farmer",
    aadhaarMasked: "XXXX-XXXX-3342",
    aadhaarToken: "TK-AAD-112233443342",
    farmLocation: { name: "Rohtak Village 4", lat: 28.8955, lng: 76.6066 },
    landProofNumber: "",
    bankAccount: "PNB-XXXX-4512",
    upiId: "dinesh@pnb",
    fpoAffiliation: "",
    trustScore: 45,
    sellerBadge: "New Seller", // Transparency without exclusion
    verificationStatus: "active"
  },

  // 2. FPO (Companies Act 2013 CIN, Member Count, Jurisdiction, Bank)
  {
    uid: "usr-fpo-1",
    name: "Sonipat Kisan Agro FPO",
    registrationNumber: "U01409HR2021PTC095123",
    role: "fpo",
    isFpo: true,
    memberCount: 350,
    contactPerson: "Rajinder Singh",
    phone: "+91 98234 56789",
    address: "Village Murthal, GT Road, Sonipat, Haryana",
    state: "Haryana",
    district: "Sonipat",
    mandiJurisdiction: "Sonipat APMC & Azadpur Sub-yard",
    cropsHandled: ["Wheat", "Paddy", "Mustard", "Potato"],
    bankAccount: "HDFC-XXXX-9912",
    upiId: "sonipatfpo@hdfcbank",
    trustScore: 92,
    verificationStatus: "approved"
  },

  // 3. Consumer / Retail Buyer (Minimal KYC: phone OTP only, tokenized payment method)
  {
    uid: "usr-consumer-1",
    name: "Pooja Verma",
    phone: "+91 98345 67890",
    role: "buyer",
    buyerType: "retail",
    deliveryAddresses: [
      { id: "addr-1", label: "Home", text: "Flat 402, Green Valley Apts, Rohini Sec 14, Delhi - 110085" }
    ],
    paymentMethod: "UPI Tokenized (Razorpay Escrow)",
    trustScore: 95,
    verificationStatus: "active"
  },

  // 4. Bulk Buyer (15-char GSTIN, Contact, Upfront Payment Terms only)
  {
    uid: "usr-buyer-bulk",
    name: "AgroCorp Bulk Traders Pvt Ltd",
    phone: "+91 98111 22233",
    role: "buyer",
    buyerType: "bulk",
    gstin: "07AAAAA0000A1Z5",
    businessAddress: "Plot 42, Food Park, Kundli Industrial Area, Haryana",
    contactPerson: "Vikram Singhania",
    paymentTerms: "Upfront Only (MVP Scope)",
    bankAccount: "ICICI-XXXX-7788",
    trustScore: 90,
    verificationStatus: "approved"
  },

  // 5. Logistics Partner — Individual Driver (DL, RC, Vehicle Type/Capacity)
  {
    uid: "usr-transporter-1",
    name: "Kisan Logistics (Surinder Singh)",
    phone: "+91 98222 33344",
    role: "transporter",
    transporterType: "individual",
    dlNumber: "HR-1020180045612",
    vehicleReg: "HR-10-AB-1234",
    vehicleType: "Tata 407 (Medium Commercial)",
    capacityKg: 5000,
    serviceArea: "Delhi-NCR, Sonipat, Panipat, Karnal",
    bankAccount: "CANARA-XXXX-3344",
    upiId: "surinder@canara",
    trustScore: 89,
    complaintsCount: 0,
    isSuspended: false,
    verificationStatus: "active"
  },

  // 6. Logistics Partner — Fleet Company / Aggregator (GSTIN, Fleet Size, API Flag)
  {
    uid: "usr-transporter-aggregator",
    name: "GatiSetu Agro Freight Services",
    phone: "+91 98444 11223",
    role: "transporter",
    transporterType: "aggregator",
    gstin: "06AABCG1234F1Z8",
    fleetSize: 24,
    vehicleTypes: "10x Pickups (1.5T), 8x Eicher (5T), 6x Heavy Trucks (16T)",
    contactPerson: "Amitabh Deshmukh",
    apiIntegrationEnabled: true,
    bankAccount: "AXIS-XXXX-5521",
    trustScore: 94,
    complaintsCount: 0,
    isSuspended: false,
    verificationStatus: "active"
  },

  // 7. System Administrator (Strictly platform-operator provisioned; no public signup)
  {
    uid: "usr-admin-1",
    name: "AgriVa Platform Operator",
    phone: "+91 99000 00000",
    role: "admin",
    adminLevel: "SuperAdmin",
    provisionedBy: "Platform Operator Database Direct Seed",
    verificationStatus: "approved"
  },
  // 8. Institutional Lender (Agri-Credit)
  {
    uid: "usr-lender-1",
    name: "NABARD Agri-Finance Desk",
    phone: "+91 99000 11223",
    role: "lender",
    lenderType: "institutional",
    bankName: "NABARD",
    trustScore: 100,
    verificationStatus: "active"
  }
];

// Pending FPO Approvals Queue
export const INITIAL_FPO_APPROVALS = [
  {
    id: "fpo-req-101",
    fpoName: "Malwa Krishi Vikas FPO",
    registrationNumber: "U01111MP2022PTC061245",
    type: "CIN (Companies Act 2013)",
    contactPerson: "Bhopal Singh",
    phone: "+91 98222 77112",
    memberCount: 420,
    address: "Depalpur Road, Indore, Madhya Pradesh",
    cropsHandled: ["Soybean", "Wheat", "Gram", "Garlic"],
    mandiJurisdiction: "Indore APMC & Ujjain Mandi",
    submittedAt: "2026-09-18T10:30:00Z",
    status: "pending",
    complianceNote: "Format validated. Awaiting manual admin review against MCA public database."
  }
];

// Pending Bulk Buyer Approvals Queue
export const INITIAL_BULK_BUYER_APPROVALS = [
  {
    id: "bulk-req-201",
    businessName: "North Agro Processors & Mills Ltd",
    gstin: "07AAACN1234D1Z2",
    contactPerson: "Harpreet Juneja",
    phone: "+91 98777 55441",
    businessAddress: "Lawrence Road Industrial Area, Delhi - 110035",
    paymentTerms: "Upfront Only (MVP Scope)",
    submittedAt: "2026-09-19T14:15:00Z",
    status: "pending",
    complianceNote: "GSTIN format confirmed. Bulk buyer escrow/tax-compliance review required before marketplace activation."
  }
];

// Flagged Registrations (e.g. Duplicate Aadhaar on different phone)
export const INITIAL_FLAGGED_REGISTRATIONS = [
  {
    id: "flag-301",
    actorType: "farmer",
    name: "Ramesh K. (Second Submission)",
    phone: "+91 98999 12345",
    aadhaarMasked: "XXXX-XXXX-7779",
    flagReason: "Duplicate Aadhaar linked to phone +91 98765 43210 already on file.",
    ruleTriggered: "DPDP Act 2023 Identity Flag (Manual Admin Review Mandatory)",
    submittedAt: "2026-09-20T08:00:00Z",
    status: "flagged_review"
  }
];

// Suspended / Review Logistics Partners
export const INITIAL_SUSPENDED_TRANSPORTERS = [
  {
    id: "trans-susp-401",
    name: "Desi Logistics Express",
    phone: "+91 98111 99887",
    vehicleReg: "UP-14-BT-9012",
    dlNumber: "UP-1420160089123",
    complaintsCount: 4,
    reason: "Accumulated delivery delays & temperature failure reports causing perishable spoilage.",
    status: "Suspended",
    suspendedAt: "2026-09-19T18:00:00Z",
    reviewActionRequired: "Conduct fleet inspection and verify driver refrigeration compliance before reinstating."
  }
];

// ==========================================
// REQUIREMENT / OFFER / ORDER SEED DATA
// (Requirement-Offer bidding module)
// ==========================================

export const INITIAL_REQUIREMENTS = [
  {
    id: "req-001",
    buyerId: "usr-fpo-1",
    buyerName: "Malwa Krishi Vikas FPO",
    buyerType: "Active Buyer FPO",
    buyerTrustScore: 4.9,
    crop: "Wheat",
    variety: "Sharbati A",
    unit: "quintal",
    targetQty: 2000,
    minOfferQty: 30,
    indicativePrice: 2450,
    deliveryLocation: "Sanwer Road Warehouse, Indore",
    deliveryLat: 22.7196,
    deliveryLng: 75.8577,
    neededByDate: "2024-11-18",
    urgency: "7days",
    status: "Open",
    fulfilledQty: 1200,
    grade: "Grade A",
    createdAt: new Date().toISOString()
  },
  {
    id: "req-002",
    buyerId: "usr-buyer-bulk",
    buyerName: "AgroPure Solvent Mills",
    buyerType: "Verified Bulk Buyer",
    buyerTrustScore: 4.7,
    crop: "Soybean",
    variety: "Yellow JS 9560",
    unit: "quintal",
    targetQty: 800,
    minOfferQty: 50,
    indicativePrice: 4650,
    deliveryLocation: "Dewas Naka Depot, Indore",
    deliveryLat: 22.7547,
    deliveryLng: 75.9089,
    neededByDate: "2024-11-16",
    urgency: "5days",
    status: "Open",
    fulfilledQty: 200,
    grade: "Grade A",
    createdAt: new Date().toISOString()
  },
  {
    id: "req-003",
    buyerId: "usr-buyer-bulk",
    buyerName: "Shiv Shakti Dal Mill",
    buyerType: "Verified Bulk Buyer",
    buyerTrustScore: 4.8,
    crop: "Chana",
    variety: "Desi Pinkish",
    unit: "quintal",
    targetQty: 500,
    minOfferQty: 25,
    indicativePrice: 5400,
    deliveryLocation: "Ratlam Road Mandi, Indore",
    deliveryLat: 22.7534,
    deliveryLng: 75.8648,
    neededByDate: "2024-11-15",
    urgency: "urgent",
    status: "Open",
    fulfilledQty: 425,
    grade: "Grade A",
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_OFFERS = [
  {
    id: "offer-101",
    requirementId: "req-001",
    sellerId: "usr-farmer-3",
    sellerName: "Rameshwar Singh",
    sellerType: "Verified",
    sellerLocation: "Sonipat",
    sellerDistanceKm: 12,
    sellerTrustScore: 4.9,
    sellerRating: "38/100",
    offeredQty: 600,
    pricePerUnit: 2420,
    linkedListingId: "lst-101",
    linkedListingLabel: "500 क्विंटल Sharbati गेहूं (Godown में सुरक्षित)",
    stockVerified: true,
    totalPayout: 14520000,
    status: "Pending",
    createdAt: new Date().toISOString()
  },
  {
    id: "offer-102",
    requirementId: "req-001",
    sellerId: "usr-fpo-1",
    sellerName: "Malwa Krishi FPO",
    sellerType: "FPO",
    sellerLocation: "Indore",
    sellerDistanceKm: 12,
    sellerTrustScore: 4.9,
    sellerRating: "94/100",
    offeredQty: 800,
    pricePerUnit: 2440,
    linkedListingId: null,
    stockVerified: true,
    totalPayout: 19520000,
    status: "Pending",
    createdAt: new Date().toISOString()
  },
  {
    id: "offer-103",
    requirementId: "req-001",
    sellerId: "usr-farmer-2",
    sellerName: "Suresh Pattidar",
    sellerType: "Self-declared",
    sellerLocation: "Ratlam",
    sellerDistanceKm: 18,
    sellerTrustScore: 4.1,
    sellerRating: "Tier 4.1",
    offeredQty: 500,
    pricePerUnit: 2460,
    linkedListingId: null,
    stockVerified: false,
    totalPayout: 12300000,
    status: "Pending",
    createdAt: new Date().toISOString()
  },
  {
    id: "offer-104",
    requirementId: "req-001",
    sellerId: "usr-farmer-4",
    sellerName: "Mahender Lal",
    sellerType: "Verified",
    sellerLocation: "Doldey",
    sellerDistanceKm: 22,
    sellerTrustScore: 3.8,
    sellerRating: "36/100",
    offeredQty: 300,
    pricePerUnit: 2480,
    linkedListingId: null,
    stockVerified: true,
    totalPayout: 7440000,
    status: "Pending",
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_ORDERS = [];

export const INITIAL_LOANS = [
  {
    id: "loan-101",
    borrowerId: "usr-fpo-1",
    borrowerName: "Jaipur Fresh Growers FPO",
    registrationId: "KST-RJ-3029",
    clusterSize: 840,
    requestedAmount: 500000,
    facilityType: "Short-term Working Capital",
    purpose: "Tomato Harvest, Packing & Cold Transit",
    commodity: "Tomato",
    expectedVolumeKg: 10000,
    activeBuyerOrdersValue: 270000,
    status: "Pending Review",
    createdAt: new Date().toISOString(),
    riskScore: 88,
    repaymentSchedule: [],
    totalRepaid: 0,
    outstandingPrincipal: 500000
  },
  {
    id: "loan-102",
    borrowerId: "usr-fpo-2",
    borrowerName: "Alwar Mustard Producers Co-op",
    registrationId: "RST-RJ-4105",
    clusterSize: 1220,
    requestedAmount: 800000,
    facilityType: "Pre-harvest Input Credit",
    purpose: "Certified Mustard Seeds & Fertilizers",
    commodity: "Mustard",
    expectedVolumeKg: 20000,
    activeBuyerOrdersValue: 0,
    status: "Pending Review",
    createdAt: new Date().toISOString(),
    riskScore: 75,
    repaymentSchedule: [],
    totalRepaid: 0,
    outstandingPrincipal: 800000
  }
];
export const INITIAL_PRICE_SNAPSHOTS = [
  {
    id: "snap-1",
    mandiId: "usr-mandi-1",
    mandiName: "Azadpur APMC",
    crop: "Wheat",
    pricePerUnit: 25.5,
    previousPrice: 24.0,
    updatedBy: "usr-mandi-1",
    updatedAt: new Date().toISOString()
  },
  {
    id: "snap-2",
    mandiId: "usr-mandi-1",
    mandiName: "Azadpur APMC",
    crop: "Soybean",
    pricePerUnit: 46.0,
    previousPrice: 47.5,
    updatedBy: "usr-mandi-1",
    updatedAt: new Date().toISOString()
  },
  {
    id: "snap-3",
    mandiId: "usr-mandi-1",
    mandiName: "Azadpur APMC",
    crop: "Tomato",
    pricePerUnit: 22.0,
    previousPrice: 22.0,
    updatedBy: "usr-mandi-1",
    updatedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString() // >24h old
  }
];
