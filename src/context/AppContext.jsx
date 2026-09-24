import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeCollection, saveDocument, addDocument, updateDocumentFields, seedCollectionIfEmpty } from '../firebase/services';
import {
  INITIAL_MANDI_PRICES,
  INITIAL_LISTINGS,
  INITIAL_BIDS,
  INITIAL_DELIVERIES,
  INITIAL_LAB_REGISTRATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REGISTERED_USERS,
  INITIAL_FPO_APPROVALS,
  INITIAL_BULK_BUYER_APPROVALS,
  INITIAL_FLAGGED_REGISTRATIONS,
  INITIAL_SUSPENDED_TRANSPORTERS,
  INITIAL_REQUIREMENTS,
  INITIAL_OFFERS,
  INITIAL_ORDERS,
  INITIAL_LOANS,
  INITIAL_PRICE_SNAPSHOTS
} from '../firebase/seedData';

import { translations } from '../utils/i18n';
import { evaluateQualityGrade, checkWeightMismatch, calculateSurplusRescue } from '../utils/qualityEngine';
import { evaluateRegistrationRules } from '../utils/verificationEngine';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('AgriVa_persona');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_REGISTERED_USERS[0];
  });
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'

  // Real-time Firestore collections state
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [bids, setBids] = useState(INITIAL_BIDS);
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [labRegistrations, setLabRegistrations] = useState(INITIAL_LAB_REGISTRATIONS);
  const [mandiPrices, setMandiPrices] = useState(INITIAL_MANDI_PRICES);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [mandiLots, setMandiLots] = useState([]);
  const [labCertificates, setLabCertificates] = useState([]);
  const [disputes, setDisputes] = useState([]);

  // Actor Registrations & Governance State
  const [registeredUsers, setRegisteredUsers] = useState(INITIAL_REGISTERED_USERS);
  const [fpoApprovals, setFpoApprovals] = useState(INITIAL_FPO_APPROVALS);
  const [bulkBuyerApprovals, setBulkBuyerApprovals] = useState(INITIAL_BULK_BUYER_APPROVALS);
  const [flaggedRegistrations, setFlaggedRegistrations] = useState(INITIAL_FLAGGED_REGISTRATIONS);
  const [suspendedTransporters, setSuspendedTransporters] = useState(INITIAL_SUSPENDED_TRANSPORTERS);

  // Requirement / Offer / Order state (bidding module)
  const [requirements, setRequirements] = useState(INITIAL_REQUIREMENTS);
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  // Lending State
  const [loans, setLoans] = useState(INITIAL_LOANS);

  // Live Mandi Ticker State
  const [priceSnapshots, setPriceSnapshots] = useState(INITIAL_PRICE_SNAPSHOTS);

  // Toast alert state
  const [activeToast, setActiveToast] = useState(null);

  // Seed data once when the app mounts
  useEffect(() => {
    const seedAll = async () => {
      await seedCollectionIfEmpty('listings', INITIAL_LISTINGS);
      await seedCollectionIfEmpty('bids', INITIAL_BIDS);
      await seedCollectionIfEmpty('deliveries', INITIAL_DELIVERIES);
      await seedCollectionIfEmpty('labRegistrations', INITIAL_LAB_REGISTRATIONS);
      await seedCollectionIfEmpty('mandiPriceData', INITIAL_MANDI_PRICES);
      await seedCollectionIfEmpty('notifications', INITIAL_NOTIFICATIONS);
      await seedCollectionIfEmpty('registeredUsers', INITIAL_REGISTERED_USERS);
      await seedCollectionIfEmpty('fpoApprovals', INITIAL_FPO_APPROVALS);
      await seedCollectionIfEmpty('bulkBuyerApprovals', INITIAL_BULK_BUYER_APPROVALS);
      await seedCollectionIfEmpty('flaggedRegistrations', INITIAL_FLAGGED_REGISTRATIONS);
      await seedCollectionIfEmpty('suspendedTransporters', INITIAL_SUSPENDED_TRANSPORTERS);
      await seedCollectionIfEmpty('requirements', INITIAL_REQUIREMENTS);
      await seedCollectionIfEmpty('offers', INITIAL_OFFERS);
    };
    seedAll();
  }, []);

  // Subscribe to real-time Firestore updates across devices
  useEffect(() => {
    const unsubListings = subscribeCollection('listings', setListings);
    const unsubBids = subscribeCollection('bids', setBids);
    const unsubDeliveries = subscribeCollection('deliveries', setDeliveries);
    const unsubLabs = subscribeCollection('labRegistrations', setLabRegistrations);
    const unsubPrices = subscribeCollection('mandiPriceData', setMandiPrices);
    const unsubNotifs = subscribeCollection('notifications', setNotifications);
    const unsubLots = subscribeCollection('mandiLots', setMandiLots);
    const unsubCerts = subscribeCollection('labCertificates', setLabCertificates);
    const unsubUsers = subscribeCollection('registeredUsers', setRegisteredUsers);
    const unsubFpos = subscribeCollection('fpoApprovals', setFpoApprovals);
    const unsubBuyers = subscribeCollection('bulkBuyerApprovals', setBulkBuyerApprovals);
    const unsubFlagged = subscribeCollection('flaggedRegistrations', setFlaggedRegistrations);
    const unsubSusp = subscribeCollection('suspendedTransporters', setSuspendedTransporters);
    const unsubReqs = subscribeCollection('requirements', setRequirements);
    const unsubOffers = subscribeCollection('offers', setOffers);
    const unsubOrders = subscribeCollection('orders', setOrders);
    const unsubDisputes = subscribeCollection('disputes', setDisputes);

    return () => {
      unsubListings();
      unsubBids();
      unsubDeliveries();
      unsubLabs();
      unsubPrices();
      unsubNotifs();
      unsubLots();
      unsubCerts();
      unsubUsers();
      unsubFpos();
      unsubBuyers();
      unsubFlagged();
      unsubSusp();
      unsubReqs();
      unsubOffers();
      unsubOrders();
      unsubDisputes();
    };
  }, []);

  const triggerToast = (message, title = "Notification", type = "info") => {
    setActiveToast({ id: Date.now(), title, message, type });
    setTimeout(() => setActiveToast(null), 4000);
  };

  // Switch role persona helper for live multi-user demoing
  const switchRole = (newRole) => {
    const roleProfiles = {
      farmer: INITIAL_REGISTERED_USERS[0], // Ramesh Kumar (Verified Farmer)
      farmer_new: INITIAL_REGISTERED_USERS[1], // Dinesh Sharma (New Seller badge)
      fpo: INITIAL_REGISTERED_USERS[2], // Sonipat Kisan Agro FPO
      consumer: INITIAL_REGISTERED_USERS[3], // Pooja Verma (Retail Buyer)
      buyer: INITIAL_REGISTERED_USERS[4], // AgroCorp Bulk Traders
      bulk_buyer: INITIAL_REGISTERED_USERS[4],
      transporter: INITIAL_REGISTERED_USERS[5], // Kisan Logistics Individual Driver
      transporter_aggregator: INITIAL_REGISTERED_USERS[6], // GatiSetu Fleet Aggregator
      admin: INITIAL_REGISTERED_USERS[7], // System Administrator
      lender: INITIAL_REGISTERED_USERS[8], // NABARD Agri-Finance Desk
      mandi: { uid: "usr-mandi-1", name: "Azadpur Mandi Operator", role: "mandi", mandiName: "Azadpur APMC", phone: "+91 98333 44455" },
      lab: { uid: "usr-lab-1", name: "AgriCert Quality Labs", role: "lab", labName: "AgriCert Quality Labs", phone: "+91 98444 55566" },
      warehouse: { uid: "usr-warehouse-1", name: "Manoj Warehouse & Storage", role: "warehouse", village: "Ujjain District", sellerBadge: "WDRA Verified", phone: "+91 91234 56789" },
      middleman: { uid: "usr-middleman-1", name: "Vikram Trading & Transport", role: "middleman", phone: "+91 98555 66677", vehicleReg: "DL-01-XY-9999", capacityKg: 3500 }
    };

    if (roleProfiles[newRole]) {
      setCurrentUser(roleProfiles[newRole]);
      localStorage.setItem('AgriVa_persona', JSON.stringify(roleProfiles[newRole]));
      triggerToast(`Switched active persona to ${roleProfiles[newRole].name}`, "Role Switched", "success");
    }
  };

  // ----------------------------------------------------
  // ACTOR REGISTRATION & GOVERNANCE PIPELINE
  // ----------------------------------------------------

  const registerUser = async (profileData) => {
    const evaluation = evaluateRegistrationRules(profileData, registeredUsers);

    if (!evaluation.allowed) {
      triggerToast(evaluation.error, "Registration Rejected", "error");
      return { success: false, error: evaluation.error, status: evaluation.status };
    }

    const { status, profileData: finalProfile } = evaluation;
    const uid = `usr-${finalProfile.role}-${Date.now().toString().slice(-4)}`;
    const record = { uid, ...finalProfile, createdAt: new Date().toISOString() };

    if (status === 'Pending') {
      if (finalProfile.role === 'fpo' || finalProfile.isFpo) {
        const fpoReq = {
          id: `fpo-req-${Date.now().toString().slice(-4)}`,
          fpoName: finalProfile.name,
          registrationNumber: finalProfile.registrationNumber,
          contactPerson: finalProfile.contactPerson || finalProfile.name,
          phone: finalProfile.phone,
          memberCount: finalProfile.memberCount || 50,
          address: finalProfile.address,
          cropsHandled: finalProfile.cropsHandled || ["Wheat"],
          mandiJurisdiction: finalProfile.mandiJurisdiction || "Local APMC",
          submittedAt: new Date().toISOString(),
          status: 'pending',
          complianceNote: "CIN/Cooperative format validated. In Admin Queue pending MCA verification."
        };
        await saveDocument('fpoApprovals', fpoReq.id, fpoReq);
        triggerToast("FPO Registration Submitted! Awaiting Admin Approval.", "Verification Pending", "info");
      } else if (finalProfile.role === 'buyer' && finalProfile.buyerType === 'bulk') {
        const bulkReq = {
          id: `bulk-req-${Date.now().toString().slice(-4)}`,
          businessName: finalProfile.name,
          gstin: finalProfile.gstin,
          contactPerson: finalProfile.contactPerson || finalProfile.name,
          phone: finalProfile.phone,
          businessAddress: finalProfile.address,
          paymentTerms: finalProfile.paymentTerms || "Upfront Only (MVP Scope)",
          submittedAt: new Date().toISOString(),
          status: 'pending',
          complianceNote: "GSTIN format confirmed. Bulk buyer escrow/tax-compliance review required."
        };
        await saveDocument('bulkBuyerApprovals', bulkReq.id, bulkReq);
        triggerToast("Bulk Buyer Application Submitted for Admin Verification.", "Verification Pending", "info");
      }
    } else if (status === 'Flagged') {
      const flagReq = {
        id: `flag-${Date.now().toString().slice(-4)}`,
        actorType: finalProfile.role,
        name: finalProfile.name,
        phone: finalProfile.phone,
        aadhaarMasked: finalProfile.aadhaarMasked || 'N/A',
        dlNumber: finalProfile.dlNumber || 'N/A',
        flagReason: finalProfile.flagReason || "Duplicate identifier detected on different phone number.",
        ruleTriggered: "Manual Admin Review Mandatory",
        submittedAt: new Date().toISOString(),
        status: 'flagged_review'
      };
      await saveDocument('flaggedRegistrations', flagReq.id, flagReq);
      triggerToast("Account flagged for manual identity verification.", "Verification Under Review", "warning");
    } else {
      // Instant Active (e.g. Consumer, Verified Farmer, Fleet Aggregator)
      await saveDocument('registeredUsers', uid, record);
      setCurrentUser(record);
      triggerToast(`Welcome to AgriVa, ${record.name}!`, "Account Active", "success");
    }

    return { success: true, status, profile: record };
  };

  const approveFpo = async (fpoReqId) => {
    const req = fpoApprovals.find(f => f.id === fpoReqId);
    if (!req) return;

    await updateDocumentFields('fpoApprovals', fpoReqId, { status: 'approved' });

    const newUser = {
      uid: `usr-fpo-${Date.now().toString().slice(-4)}`,
      name: req.fpoName,
      registrationNumber: req.registrationNumber,
      role: 'fpo',
      isFpo: true,
      memberCount: req.memberCount,
      phone: req.phone,
      contactPerson: req.contactPerson,
      address: req.address,
      cropsHandled: req.cropsHandled,
      mandiJurisdiction: req.mandiJurisdiction,
      trustScore: 90,
      verificationStatus: 'approved'
    };
    await saveDocument('registeredUsers', newUser.uid, newUser);
    triggerToast(`FPO "${req.fpoName}" Approved & Activated!`, "Admin Verified", "success");
  };

  const rejectFpo = async (fpoReqId, reason = "MCA Database verification failed") => {
    await updateDocumentFields('fpoApprovals', fpoReqId, { status: 'rejected', rejectionReason: reason });
    triggerToast(`FPO Registration Rejected: ${reason}`, "Admin Rejected", "warning");
  };

  const updatePriceSnapshot = (crop, newPrice, mandiId, mandiName) => {
    setPriceSnapshots(prev => {
      const existing = prev.find(p => p.crop === crop && p.mandiId === mandiId);
      if (existing) {
        return prev.map(p => 
          p.id === existing.id 
            ? { ...p, previousPrice: p.pricePerUnit, pricePerUnit: newPrice, updatedAt: new Date().toISOString() } 
            : p
        );
      } else {
        return [{
          id: `snap-${Date.now()}`,
          mandiId,
          mandiName,
          crop,
          pricePerUnit: newPrice,
          previousPrice: newPrice,
          updatedBy: mandiId,
          updatedAt: new Date().toISOString()
        }, ...prev];
      }
    });
    triggerToast(`${crop} price updated to ₹${newPrice}`, "Live Ticker Updated", "success");
  };

  const approveBulkBuyer = async (bulkReqId) => {
    const req = bulkBuyerApprovals.find(b => b.id === bulkReqId);
    if (!req) return;

    await updateDocumentFields('bulkBuyerApprovals', bulkReqId, { status: 'approved' });

    const newUser = {
      uid: `usr-buyer-${Date.now().toString().slice(-4)}`,
      name: req.businessName,
      gstin: req.gstin,
      role: 'buyer',
      buyerType: 'bulk',
      phone: req.phone,
      contactPerson: req.contactPerson,
      businessAddress: req.businessAddress,
      paymentTerms: req.paymentTerms,
      trustScore: 90,
      verificationStatus: 'approved'
    };
    await saveDocument('registeredUsers', newUser.uid, newUser);
    triggerToast(`Bulk Buyer "${req.businessName}" Approved & Active!`, "Admin Verified", "success");
  };

  const rejectBulkBuyer = async (bulkReqId, reason = "GSTIN or tax compliance check failed") => {
    await updateDocumentFields('bulkBuyerApprovals', bulkReqId, { status: 'rejected', rejectionReason: reason });
    triggerToast(`Bulk Buyer Rejected: ${reason}`, "Admin Rejected", "warning");
  };

  const resolveFlaggedRegistration = async (flagId, decision, notes = "") => {
    await updateDocumentFields('flaggedRegistrations', flagId, {
      status: decision === 'approve' ? 'cleared' : 'blocked',
      adminNotes: notes,
      resolvedAt: new Date().toISOString()
    });
    triggerToast(`Flagged registration marked as: ${decision.toUpperCase()}`, "Admin Decision", "info");
  };

  const suspendTransporter = async (transporterId, reason = "Accumulated delivery complaints / temperature failure") => {
    const suspRecord = {
      id: `susp-${Date.now().toString().slice(-4)}`,
      transporterId,
      reason,
      status: 'Suspended',
      suspendedAt: new Date().toISOString()
    };
    await saveDocument('suspendedTransporters', suspRecord.id, suspRecord);
    await updateDocumentFields('registeredUsers', transporterId, { isSuspended: true, status: 'Suspended' });
    triggerToast(`Transporter #${transporterId} auto-suspended pending review to prevent crop wastage.`, "Driver Suspended", "warning");
  };

  const reinstateTransporter = async (transporterId) => {
    await updateDocumentFields('registeredUsers', transporterId, { isSuspended: false, status: 'Active' });
    triggerToast(`Transporter #${transporterId} reinstated after fleet inspection.`, "Driver Reinstated", "success");
  };

  // ----------------------------------------------------
  // TRANSACTION & DASHBOARD ACTIONS
  // ----------------------------------------------------

  const createListing = async (listingData) => {
    const id = `lst-${Date.now().toString().slice(-4)}`;
    const newListing = {
      id,
      farmerId: currentUser.uid,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      status: "Listed",
      createdAt: new Date().toISOString(),
      ...listingData
    };
    
    await saveDocument('listings', id, newListing);
    triggerToast(`Crop listing for ${listingData.crop} created successfully!`, "Listing Published", "success");
  };

  const placeBid = async (listingId, price) => {
    const id = `bid-${Date.now().toString().slice(-4)}`;
    const targetListing = listings.find(l => l.id === listingId);
    
    // SURPLUS RESCUE AUTO-ACCEPT LOGIC
    let isSurplus = false;
    if (targetListing) {
      const surplusCheck = calculateSurplusRescue(targetListing.crop, targetListing.harvestDate);
      isSurplus = surplusCheck.isSurplusRescue;
    }

    const newBid = {
      id,
      listingId,
      buyerId: currentUser.uid,
      buyerName: currentUser.name,
      price: Number(price),
      status: isSurplus ? "Accepted" : "Pending",
      createdAt: new Date().toISOString()
    };
    
    await saveDocument('bids', id, newBid);
    
    if (isSurplus) {
      await updateDocumentFields('listings', listingId, { 
        status: "Transport Assigned", 
        acceptedBidId: id 
      });
      triggerToast(`Surplus Rescue matched! Bid auto-accepted. Proceed to delivery.`, "Auto-Accepted", "success");
      
      const delId = `del-${Date.now().toString().slice(-4)}`;
      const newDel = {
        id: delId,
        listingId,
        buyerId: currentUser.uid,
        farmerId: targetListing.farmerId,
        farmerName: targetListing.farmerName,
        crop: targetListing.crop,
        quantity: targetListing.quantity,
        price: Number(price),
        status: 'Transport Assigned',
        deliveryMode: 'direct',
        createdAt: new Date().toISOString()
      };
      await saveDocument('deliveries', delId, newDel);
    } else {
      await updateDocumentFields('listings', listingId, { status: "Bid Received" });
      if (targetListing) {
        triggerToast(`SMS sent to ${targetListing.farmerPhone}: New bid of ₹${price}/kg received from ${currentUser.name}`, "SMS Triggered", "info");
      }
    }
  };

  const acceptBid = async (listingId, bidId, deliveryMode = "direct") => {
    const targetBid = bids.find(b => b.id === bidId);
    const targetListing = listings.find(l => l.id === listingId);

    if (!targetBid || !targetListing) return;

    await updateDocumentFields('bids', bidId, { status: "Accepted" });
    await updateDocumentFields('listings', listingId, { status: "Accepted", acceptedBidId: bidId });

    const delId = `del-${Date.now().toString().slice(-4)}`;
    const newDelivery = {
      id: delId,
      listingId,
      farmerName: targetListing.farmerName,
      crop: targetListing.crop,
      quantity: targetListing.quantity,
      bidPrice: targetBid.price,
      transporterId: "usr-transporter-1",
      transporterName: "Kisan Logistics (HR-10-AB-1234)",
      pickupLocation: targetListing.location,
      deliveryLocation: { name: "Azadpur Mandi, Delhi", lat: 28.7041, lng: 77.1025 },
      status: "Transport Assigned",
      deliveryMode,
      pickupOrder: [
        { id: "stop-1", name: `${targetListing.location.name} - ${targetListing.farmerName}`, lat: targetListing.location.lat || 28.9931, lng: targetListing.location.lng || 77.0151, quantity: targetListing.quantity }
      ],
      createdAt: new Date().toISOString()
    };

    await saveDocument('deliveries', delId, newDelivery);
    await updateDocumentFields('listings', listingId, { status: "Transport Assigned" });
    triggerToast(`Bid accepted! Delivery assigned in ${deliveryMode.toUpperCase()} mode.`, "Sale Confirmed", "success");
  };



  const updateDeliveryStatus = async (deliveryId, newStatus, extraData = {}) => {
    await updateDocumentFields('deliveries', deliveryId, { status: newStatus, ...extraData });

    const del = deliveries.find(d => d.id === deliveryId);
    if (del && del.listingId) {
      await updateDocumentFields('listings', del.listingId, { status: newStatus });
    }

    triggerToast(`Delivery #${deliveryId} status updated to: ${newStatus}`, "Status Updated", "info");
  };

  const completeTransporterDelivery = async (deliveryId) => {
    // TRIGGER 1: Logistics Partner Payout
    // Fires when driver scans delivery completion. INDEPENDENT of buyer dispute.
    await updateDeliveryStatus(deliveryId, "Delivered", { 
      logisticsPayoutStatus: "Released",
      deliveredAt: new Date().toISOString()
    });
    triggerToast(`Delivery scan complete. Driver payment released.`, "Logistics Payout", "success");
  };

  const confirmBuyerDelivery = async (deliveryId) => {
    // TRIGGER 2: Farmer/FPO Payout
    // Fires on buyer confirmation or 48h timeout.
    await updateDeliveryStatus(deliveryId, "Completed", { 
      farmerPayoutStatus: "Released",
      confirmedAt: new Date().toISOString()
    });
    triggerToast(`Receipt confirmed. Farmer payment released from escrow.`, "Farmer Payout", "success");
  };

  const checkUnderpricing = (crop, price) => {
    if (!crop || !price) return false;
    const ref = mandiPrices.find(p => p.crop.toLowerCase() === crop.toLowerCase());
    if (ref && ref.modalPrice) {
      return Number(price) < (ref.modalPrice * 0.7);
    }
    return false;
  };

  const logCallRequest = async (targetUserId, contextId, contextType) => {
    const callId = `CALL-${Date.now().toString().slice(-5)}`;
    const newCall = {
      id: callId,
      callerId: currentUser.uid,
      targetUserId,
      contextId, // requirementId, offerId, etc.
      contextType, // 'requirement', 'offer', etc.
      timestamp: new Date().toISOString()
    };
    await saveDocument('callRequests', callId, newCall);
    triggerToast(`Call initiated. Our system is logging this negotiation securely.`, "Call Connected", "success");
    return newCall;
  };

  const raiseDispute = async (orderId, deliveryId, category, evidenceUrl = '') => {
    const disputeId = `DISP-${Date.now().toString().slice(-5)}`;
    const newDispute = {
      id: disputeId,
      orderId,
      deliveryId,
      category,
      raisedBy: currentUser.uid,
      evidenceUrl,
      liability: 'unresolved',
      resolution: null,
      resolvedAt: null,
      createdAt: new Date().toISOString()
    };
    
    await saveDocument('disputes', disputeId, newDispute);
    if (deliveryId) {
      await updateDeliveryStatus(deliveryId, "Disputed");
    }
    triggerToast(`Dispute raised. Admin has been notified.`, "Dispute Raised", "warning");
    return newDispute;
  };

  const resolveDispute = async (disputeId, liability, resolution) => {
    await updateDocumentFields('disputes', disputeId, {
      liability,
      resolution,
      resolvedAt: new Date().toISOString()
    });

    const disp = disputes.find(d => d.id === disputeId);
    if (disp && disp.deliveryId) {
      await updateDeliveryStatus(disp.deliveryId, resolution === 'full_void' ? 'Voided' : 'Completed', {
        farmerPayoutStatus: resolution === 'full_void' ? 'Voided' : 'Partial/Completed'
      });
    }
    triggerToast(`Dispute #${disputeId} resolved.`, "Dispute Resolved", "success");
  };

  const submitQualityLabTest = async (deliveryOrLotId, crop, moisture, foreignMatter, grainGrade) => {
    const evaluation = evaluateQualityGrade(crop, Number(moisture), Number(foreignMatter), grainGrade);
    const certId = `CERT-LAB-${Date.now().toString().slice(-4)}`;

    const newCert = {
      id: certId,
      refId: deliveryOrLotId,
      crop,
      moisturePct: Number(moisture),
      foreignMatterPct: Number(foreignMatter),
      grainGrade,
      isVerified: evaluation.isVerified,
      status: evaluation.resultStatus,
      notes: evaluation.notes,
      labName: currentUser.name || "AgriCert Quality Labs",
      issuedAt: new Date().toISOString()
    };

    await saveDocument('labCertificates', certId, newCert);

    const del = deliveries.find(d => d.id === deliveryOrLotId);
    if (del) {
      await updateDeliveryStatus(deliveryOrLotId, evaluation.isVerified ? "Lab Verified" : "In Transit", {
        qualityFlag: !evaluation.isVerified,
        labCertificateId: certId
      });
    }

    triggerToast(`Quality certificate generated: ${evaluation.resultStatus}`, "Quality Certified", evaluation.isVerified ? "success" : "warning");
    return newCert;
  };

  const approveLabRegistration = async (regId) => {
    await updateDocumentFields('labRegistrations', regId, { verificationStatus: "approved" });
    triggerToast(`Quality Checker registration approved!`, "Lab Verified", "success");
  };

  const rejectLabRegistration = async (regId, reason) => {
    await updateDocumentFields('labRegistrations', regId, { verificationStatus: "rejected", rejectionReason: reason });
    triggerToast(`Registration rejected. Reason sent to lab.`, "Lab Rejected", "warning");
  };

  const createMandiGateEntry = async (entryData) => {
    const lotId = `LOT-MND-${Date.now().toString().slice(-5)}`;
    const weightCheck = checkWeightMismatch(Number(entryData.declaredWeight), Number(entryData.actualWeight));

    let finalQuantity = Number(entryData.declaredWeight);
    let auctionStatus = "Open";
    let blockPayment = false;
    let adminReview = false;

    if (weightCheck.tier === 1) {
      // Tier 1: silently update the order quantity to the actual weight, no flag, proceed normally
      finalQuantity = Number(entryData.actualWeight);
    } else if (weightCheck.tier === 2) {
      // Tier 2: update quantity to actual weight BUT flag the order for admin review
      finalQuantity = Number(entryData.actualWeight);
      adminReview = true;
    } else if (weightCheck.tier === 3) {
      // Tier 3: do NOT auto-update quantity — hold the order entirely, escalate to Admin's queue, block payment
      auctionStatus = "Admin Hold";
      adminReview = true;
      blockPayment = true;
    }

    const newLot = {
      id: lotId,
      lotId,
      mandiName: currentUser.mandiName || "Azadpur APMC",
      vehicleNumber: entryData.vehicleNumber,
      farmerName: entryData.farmerName,
      crop: entryData.crop,
      declaredWeight: Number(entryData.declaredWeight),
      actualWeight: Number(entryData.actualWeight),
      finalQuantity,
      hasWeightMismatch: weightCheck.hasMismatch,
      mismatchMessage: weightCheck.message,
      weightTier: weightCheck.tier,
      adminReview,
      blockPayment,
      auctionStatus,
      winningBid: 0,
      winningBuyer: "",
      gatePassIssued: false,
      createdAt: new Date().toISOString()
    };

    await saveDocument('mandiLots', lotId, newLot);
    triggerToast(`Gate Entry recorded! Lot ID generated: ${lotId}`, "Gate Entry Complete", "success");
    return newLot;
  };

  // ----------------------------------------------------
  // REQUIREMENT / OFFER / ORDER ACTIONS (Bidding Module)
  // ----------------------------------------------------

  /**
   * Buyer posts a new crop requirement visible to nearby farmers.
   */
  const postRequirement = async (requirementData) => {
    const id = `req-${Date.now().toString().slice(-5)}`;
    const newReq = {
      id,
      buyerId: currentUser.uid,
      buyerName: currentUser.name,
      buyerType: currentUser.buyerType === 'bulk' ? 'Verified Bulk Buyer' : (currentUser.isFpo ? 'Active Buyer FPO' : 'Buyer'),
      buyerTrustScore: currentUser.trustScore ? currentUser.trustScore / 20 : 4.5,
      status: 'Open',
      fulfilledQty: 0,
      createdAt: new Date().toISOString(),
      ...requirementData
    };
    await saveDocument('requirements', id, newReq);
    triggerToast(
      `आपकी मांग दर्ज हुई! ${requirementData.crop} के लिए ${requirementData.targetQty} ${requirementData.unit} की मांग 12 किसानों को भेजी गई।`,
      'मांग पोस्ट हो गई / Requirement Posted',
      'success'
    );
    return newReq;
  };

  /**
   * Farmer submits an offer against an open buyer requirement.
   */
  const makeOffer = async (requirementId, offerData) => {
    const id = `offer-${Date.now().toString().slice(-5)}`;
    const requirement = requirements.find(r => r.id === requirementId);
    if (!requirement) return;

    const mandiRef = mandiPrices.find(p => p.crop.toLowerCase() === requirement.crop.toLowerCase());
    const mandiAvg = mandiRef ? mandiRef.modalPrice * 100 : 0; // convert ₹/kg → per quintal rough ref

    const newOffer = {
      id,
      requirementId,
      sellerId: currentUser.uid,
      sellerName: currentUser.name,
      sellerType: currentUser.sellerBadge === 'Verified Farmer' ? 'Verified'
        : currentUser.isFpo ? 'FPO'
        : 'Self-declared',
      sellerTrustScore: currentUser.trustScore ? currentUser.trustScore / 20 : 4.0,
      stockVerified: !!offerData.linkedListingId,
      totalPayout: (offerData.offeredQty || 0) * (offerData.pricePerUnit || 0),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      ...offerData
    };

    await saveDocument('offers', id, newOffer);
    triggerToast(
      `बोली जमा! ${requirement.crop} के लिए ₹${offerData.pricePerUnit}/क्विंटल पर ${offerData.offeredQty} क्विंटल की बोली भेजी गई।`,
      'बोली जमा हुई / Offer Submitted',
      'success'
    );
    return newOffer;
  };

  /**
   * Buyer accepts one or more offers.
   * Cascade: creates an order per offer, updates requirement fulfilledQty,
   * closes requirement if fully fulfilled, and auto-rejects remaining offers
   * ONLY when requirement is fully closed.
   */
  const acceptOffer = async (requirementId, offerIds) => {
    const normalizedIds = Array.isArray(offerIds) ? offerIds : [offerIds];
    const requirement = requirements.find(r => r.id === requirementId);
    if (!requirement) return;

    let addedQty = 0;

    for (const offerId of normalizedIds) {
      const offer = offers.find(o => o.id === offerId);
      if (!offer || offer.status !== 'Pending') continue;

      // 1. Mark offer as Accepted
      await updateDocumentFields('offers', offerId, { status: 'Accepted' });

      addedQty += offer.offeredQty || 0;

      // 2. Create an Order document
      const orderId = `ord-${Date.now().toString().slice(-5)}-${offerId.slice(-3)}`;
      const newOrder = {
        id: orderId,
        requirementId,
        offerId,
        buyerId: requirement.buyerId,
        buyerName: requirement.buyerName,
        sellerId: offer.sellerId,
        sellerName: offer.sellerName,
        crop: requirement.crop,
        qty: offer.offeredQty,
        pricePerUnit: offer.pricePerUnit,
        totalValue: offer.totalPayout,
        linkedListingId: offer.linkedListingId || null,
        status: 'Transport Assigned',
        createdAt: new Date().toISOString()
      };
      await saveDocument('orders', orderId, newOrder);

      // 3. Auto-assign logistics / create Delivery document
      const delId = `del-${Date.now().toString().slice(-4)}-${offerId.slice(-2)}`;
      const newDelivery = {
        id: delId,
        orderId,
        requirementId,
        farmerName: offer.sellerName,
        crop: requirement.crop,
        quantity: offer.offeredQty,
        bidPrice: offer.pricePerUnit,
        transporterId: "usr-transporter-1",
        transporterName: "Kisan Logistics (HR-10-AB-1234)",
        pickupLocation: { name: offer.sellerLocation || "Farmer's Field", lat: 28.9931, lng: 77.0151 },
        deliveryLocation: { name: requirement.deliveryLocation, lat: 28.7041, lng: 77.1025 },
        status: "Transport Assigned",
        deliveryMode: "verified",
        pickupOrder: [
          { id: "stop-1", name: `${offer.sellerLocation || "Field"} - ${offer.sellerName}`, lat: 28.9931, lng: 77.0151, quantity: offer.offeredQty }
        ],
        createdAt: new Date().toISOString()
      };
      await saveDocument('deliveries', delId, newDelivery);
    }

    // 4. Update requirement's fulfilledQty
    const newFulfilledQty = (requirement.fulfilledQty || 0) + addedQty;
    const isFullyClosed = newFulfilledQty >= requirement.targetQty;
    await updateDocumentFields('requirements', requirementId, {
      fulfilledQty: newFulfilledQty,
      status: isFullyClosed ? 'Closed' : 'Partial'
    });

    // 4. If fully closed, auto-reject remaining pending offers
    if (isFullyClosed) {
      const pendingOthers = offers.filter(
        o => o.requirementId === requirementId
          && o.status === 'Pending'
          && !normalizedIds.includes(o.id)
      );
      await Promise.all(
        pendingOthers.map(o =>
          updateDocumentFields('offers', o.id, { status: 'Rejected' })
        )
      );
      triggerToast(
        `मांग पूरी हो गई! ${normalizedIds.length} बोलियां स्वीकार की गईं। बाकी बोलियां स्वतः अस्वीकार हो गईं।`,
        'मांग बंद / Requirement Closed',
        'success'
      );
    } else {
      triggerToast(
        `${normalizedIds.length} बोली(यां) स्वीकार की गईं। ${requirement.targetQty - newFulfilledQty} ${requirement.unit} की मांग अभी बाकी है।`,
        'बोली स्वीकृत / Offer(s) Accepted',
        'success'
      );
    }
  };

  /**
   * Farmer withdraws their own pending offer.
   */
  const withdrawOffer = async (offerId) => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer || offer.status !== 'Pending') {
      triggerToast('यह बोली अब वापस नहीं ली जा सकती।', 'वापसी विफल', 'error');
      return;
    }
    await updateDocumentFields('offers', offerId, { status: 'Withdrawn' });
    triggerToast('आपकी बोली वापस ली गई।', 'बोली वापस ली / Offer Withdrawn', 'info');
  };

  const t = (key) => (translations[language] && translations[language][key]) || translations['en'][key] || key;

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      language,
      setLanguage,
      switchRole,
      listings,
      bids,
      deliveries,
      loans,
      setLoans,
      labRegistrations,
      mandiPrices,
      priceSnapshots,
      updatePriceSnapshot,
      notifications,
      mandiLots,
      labCertificates,
      registeredUsers,
      fpoApprovals,
      bulkBuyerApprovals,
      flaggedRegistrations,
      suspendedTransporters,
      registerUser,
      approveFpo,
      rejectFpo,
      approveBulkBuyer,
      rejectBulkBuyer,
      resolveFlaggedRegistration,
      suspendTransporter,
      reinstateTransporter,
      activeToast,
      triggerToast,
      createListing,
      placeBid,
      acceptBid,
      updateDeliveryStatus,
      completeTransporterDelivery,
      confirmBuyerDelivery,
      disputes,
      raiseDispute,
      resolveDispute,
      checkUnderpricing,
      logCallRequest,
      submitQualityLabTest,
      approveLabRegistration,
      rejectLabRegistration,
      createMandiGateEntry,
      // Requirement / Offer / Order module
      requirements,
      offers,
      orders,
      postRequirement,
      makeOffer,
      acceptOffer,
      withdrawOffer,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    return {
      currentUser: INITIAL_REGISTERED_USERS[0],
      setCurrentUser: () => {},
      language: 'en',
      setLanguage: () => {},
      switchRole: () => {},
      triggerToast: () => {},
      listings: [],
      bids: [],
      deliveries: [],
      labRegistrations: [],
      mandiPrices: [],
      notifications: [],
      mandiLots: [],
      labCertificates: [],
      registeredUsers: [],
      fpoApprovals: [],
      bulkBuyerApprovals: [],
      flaggedRegistrations: [],
      suspendedTransporters: [],
      registerUser: async () => ({ success: true }),
      approveFpo: async () => {},
      rejectFpo: async () => {},
      approveBulkBuyer: async () => {},
      rejectBulkBuyer: async () => {},
      resolveFlaggedRegistration: async () => {},
      suspendTransporter: async () => {},
      reinstateTransporter: async () => {},
      // Requirement / Offer / Order module
      requirements: INITIAL_REQUIREMENTS,
      offers: INITIAL_OFFERS,
      orders: [],
      postRequirement: async () => {},
      makeOffer: async () => {},
      acceptOffer: async () => {},
      withdrawOffer: async () => {},
      t: (k) => k
    };
  }
  return ctx;
};
