import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Zap, Eye, Cpu, Lock, ArrowRight, CheckCircle2,
  FileText, Fingerprint, Layers, Check, Sparkles,
  Search, AlertCircle, HardDrive, ShieldCheck,
  Building2, Plane, Landmark, Scale, Key, HelpCircle,
  ChevronDown, ChevronUp, Globe, AlertTriangle, UserCheck,
  Award, FileSpreadsheet, Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── 8-Stage Forensic Pipeline Modules ─────────────────────────────
const features = [
  {
    icon: Cpu,
    title: "Multi-Engine OCR & Classifier",
    tag: "MODULE 01",
    desc: "Extracts biographic text from passports, Aadhaar cards, PAN cards & DLs using EasyOCR + ICAO 9303 MRZ parser.",
  },
  {
    icon: ShieldCheck,
    title: "ICAO & Verhoeff Checksums",
    tag: "MODULE 02",
    desc: "Validates 73-character ICAO composite checksums and UIDAI Verhoeff D5 algorithm to mathematically expose fabricated document numbers.",
  },
  {
    icon: Eye,
    title: "Error Level Analysis (ELA)",
    tag: "MODULE 03",
    desc: "Generates JPEG compression artifact heatmaps to spot digital retouching, spliced headshots, and altered date fields at 90% quality.",
  },
  {
    icon: Sparkles,
    title: "Copy-Move Forgery (CMFD)",
    tag: "MODULE 04",
    desc: "Deploys ORB and SIFT keypoint descriptor clustering to detect cloned stamps, duplicated signatures, and pasted seal textures.",
  },
  {
    icon: Activity,
    title: "Multi-Spectral Optical & UV/IR",
    tag: "MODULE 05",
    desc: "Simulates and tests high-resolution 500 DPI captures under 365nm UV phosphor illumination and 850nm IR B900 anti-counterfeit ink.",
  },
  {
    icon: Fingerprint,
    title: "ArcFace 512D Biometrics & Liveness",
    tag: "MODULE 06",
    desc: "Sub-second vector cosine comparison between ID photo and live camera capture with passive depth and 2D/3D spoof defense.",
  },
  {
    icon: Search,
    title: "Real-Time Watchlist & LOC Lookup",
    tag: "MODULE 07",
    desc: "Sub-millisecond cross-referencing against Interpol Red Notices, MHA databases, and local border Lookout Circulars (LOC).",
  },
  {
    icon: Lock,
    title: "Tamper-Evident SHA-256 Ledger",
    tag: "MODULE 08",
    desc: "Cryptographic hash-chain anchors every screening decision into an immutable, court-admissible audit trail with zero cloud exposure.",
  },
];

// ── Security Document Guilloche Lathe Background Pattern ─────────
const SecurityGuillocheBg = ({ color = "#2563eb" }) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 160 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: "absolute",
      right: -15,
      bottom: -15,
      width: 140,
      height: 120,
      opacity: 0.12,
      pointerEvents: "none",
    }}
  >
    <circle cx="80" cy="70" r="52" stroke={color} strokeWidth="1" strokeDasharray="2 3" />
    <circle cx="80" cy="70" r="36" stroke={color} strokeWidth="1" />
    <circle cx="80" cy="70" r="22" stroke={color} strokeWidth="1" strokeDasharray="3 2" />
    <path d="M10 70 Q 45 15, 80 70 T 150 70" stroke={color} strokeWidth="1.2" />
    <path d="M10 70 Q 45 125, 80 70 T 150 70" stroke={color} strokeWidth="1.2" />
    <path d="M80 5 Q 15 45, 80 70 T 80 135" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" />
    <path d="M80 5 Q 145 45, 80 70 T 80 135" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" />
  </svg>
);

// ── Universal Supported Document Standards ────────────────────────
const supportedDocs = [
  {
    code: "PASSPORT",
    name: "International Passport",
    standard: "ICAO 9303 Doc 9303 TD3",
    protocol: "RFID 13.56 MHz",
    feature: "MRZ + UV Hologram",
    color: "#2563eb",
    bgGlow: "rgba(37, 99, 235, 0.06)",
    badgeBg: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="2" width="18" height="20" rx="3" fill="#1e40af" stroke="#60a5fa" strokeWidth="1.5" />
        <circle cx="12" cy="10" r="3.5" stroke="#fcd34d" strokeWidth="1.2" />
        <ellipse cx="12" cy="10" rx="2" ry="3.5" stroke="#fcd34d" strokeWidth="0.8" />
        <line x1="8.5" y1="10" x2="15.5" y2="10" stroke="#fcd34d" strokeWidth="0.8" />
        <rect x="7" y="16" width="10" height="2.5" rx="1" fill="#fcd34d" />
        <circle cx="12" cy="17.25" r="0.75" fill="#1e40af" />
      </svg>
    ),
  },
  {
    code: "AADHAAR",
    name: "UIDAI Aadhaar Card",
    standard: "Verhoeff D5 / Secure QR",
    protocol: "Verhoeff D5 Checksum",
    feature: "2048-bit Digital Sign",
    color: "#4338ca",
    bgGlow: "rgba(67, 56, 202, 0.06)",
    badgeBg: "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3" width="20" height="18" rx="3" fill="#3730a3" stroke="#818cf8" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="5" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="2 2" />
        <path d="M12 9 C 10.5 9 9.5 10 9.5 12 C 9.5 13.5 10.2 14.5 11 15 C 11.5 15.3 12.5 15.3 13 15" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M12 7 C 9.5 7 8 8.8 8 12 C 8 14.2 9 16 10.5 16.8" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    code: "PAN_CARD",
    name: "Income Tax PAN Card",
    standard: "NSDL / UTIITSL Format",
    protocol: "10-Digit Alphanumeric",
    feature: "Hologram + IT Seal",
    color: "#0284c7",
    bgGlow: "rgba(2, 132, 199, 0.06)",
    badgeBg: "linear-gradient(135deg, #0369a1 0%, #0284c7 100%)",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="20" height="16" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
        <rect x="5" y="7" width="5" height="4" rx="1" fill="#f59e0b" stroke="#fef3c7" strokeWidth="0.6" />
        <circle cx="16" cy="9" r="2.5" fill="#e0f2fe" />
        <path d="M13.5 15 C 13.5 13.5 14.5 12.8 16 12.8 C 17.5 12.8 18.5 13.5 18.5 15" fill="#e0f2fe" />
        <line x1="5" y1="14" x2="11" y2="14" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="5" y1="16.5" x2="9" y2="16.5" stroke="#bae6fd" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    code: "DRIVING",
    name: "MoRTH Driving License",
    standard: "State Sarathi V4 Code",
    protocol: "ISO/IEC 7816 Smart Card",
    feature: "Optical Micro-Chip",
    color: "#059669",
    bgGlow: "rgba(5, 150, 105, 0.06)",
    badgeBg: "linear-gradient(135deg, #047857 0%, #059669 100%)",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="20" height="16" rx="3" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4.5" stroke="#fef08a" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="1.5" fill="#fef08a" />
        <line x1="12" y1="7.5" x2="12" y2="10.5" stroke="#fef08a" strokeWidth="1.2" />
        <line x1="8.5" y1="14" x2="10.8" y2="12.8" stroke="#fef08a" strokeWidth="1.2" />
        <line x1="15.5" y1="14" x2="13.2" y2="12.8" stroke="#fef08a" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    code: "VISA",
    name: "Consular Visa Permit",
    standard: "Schengen / Indian eVisa",
    protocol: "ICAO MRZ Format-A",
    feature: "Kinegram Foil Check",
    color: "#d97706",
    bgGlow: "rgba(217, 119, 6, 0.06)",
    badgeBg: "linear-gradient(135deg, #b45309 0%, #d97706 100%)",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="#b45309" stroke="#fbbf24" strokeWidth="1.5" />
        <polygon points="12,6 13.8,9.6 17.7,10.2 14.8,13 15.5,17 12,15.1 8.5,17 9.2,13 6.3,10.2 10.2,9.6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.8" />
        <line x1="6" y1="19" x2="18" y2="19" stroke="#fef3c7" strokeWidth="1" strokeDasharray="1.5 1.5" />
      </svg>
    ),
  },
  {
    code: "NAT_ID",
    name: "National Citizen ID",
    standard: "Universal Gov Card TD1/2",
    protocol: "ISO/IEC 14443 Contactless",
    feature: "Ghost Image & OVI Ink",
    color: "#4f46e5",
    bgGlow: "rgba(79, 70, 229, 0.06)",
    badgeBg: "linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="20" height="16" rx="3" fill="#4338ca" stroke="#a5b4fc" strokeWidth="1.5" />
        <circle cx="8" cy="10" r="2.5" fill="#ffffff" />
        <path d="M5.5 16 C 5.5 14.2 6.5 13.5 8 13.5 C 9.5 13.5 10.5 14.2 10.5 16" fill="#ffffff" />
        <rect x="13" y="8" width="6" height="2" rx="0.5" fill="#fbcfe8" />
        <rect x="13" y="11.5" width="6" height="1.5" rx="0.5" fill="#c7d2fe" />
        <rect x="13" y="14.5" width="4" height="1.5" rx="0.5" fill="#c7d2fe" />
      </svg>
    ),
  },
];

// ── High-Impact Strategic Numbers ────────────────────────────────
const impactStats = [
  { value: "99.4%", label: "Tamper Catch Rate", sub: "Spots pixel-level ELA & clone anomalies", icon: ShieldCheck, color: "#059669" },
  { value: "< 8.4s", label: "Screening Latency", sub: "Complete 8-tier verification cycle", icon: Zap, color: "#2563eb" },
  { value: "100%", label: "Air-Gap Sovereign", sub: "Zero cloud dependencies or data leaks", icon: HardDrive, color: "#7c3aed" },
  { value: "0 bytes", label: "Biometric Footprint", sub: "Ephemeral RAM-only face matching", icon: Lock, color: "#0284c7" },
];

// ── Stakeholder Beneficiaries ─────────────────────────────────────
const stakeholders = [
  {
    title: "Border Security & Immigration",
    badge: "DEFENSE & GOVTECH",
    icon: Shield,
    agencies: "Bureau of Immigration (BoI), CISF, SSB, CBP, Frontex",
    role: "Securing border checkpoints, naval terminals, and immigration control booths with sovereign air-gapped forensic inspection.",
    benefits: ["Detects fraudulent e-passports at land & sea gates", "Offline autonomy ensures 100% uptime in remote outposts", "Cross-checks Lookout Circulars in under 20ms"],
  },
  {
    title: "Airports & Automated e-Gates",
    badge: "AVIATION INFRASTRUCTURE",
    icon: Plane,
    agencies: "Airports Authority of India (AAI), IATA, International Terminals",
    role: "Powering self-service biometric e-Gates to clear low-risk travelers rapidly while flagging high-risk impersonators.",
    benefits: ["Cuts passenger clearance queues from 3 minutes to 8 seconds", "1:1 ArcFace verification eliminates boarding pass swap fraud", "Seamless integration with 3M/Gemalto optical cradles"],
  },
  {
    title: "Police & Intelligence Agencies",
    badge: "LAW ENFORCEMENT",
    icon: Search,
    agencies: "State Police CID, NIA, Central Intelligence, Interpol NCB",
    role: "Instant field verification of identity credentials during transit stops, sensitive raids, and interstate checkpoints.",
    benefits: ["Direct interception of persons on Lookout Circulars (LOC)", "Instant algorithmic validation of forged driving licenses", "Court-admissible SHA-256 cryptographic audit certificates"],
  },
  {
    title: "Banking & Financial Institutions",
    badge: "FINANCIAL INTEGRITY",
    icon: Landmark,
    agencies: "Central Banks, Commercial Banks, NBFCs, High-Value KYC",
    role: "Shielding loan origination, wealth management, and account opening from synthetic identity theft and forged Aadhaar/PAN cards.",
    benefits: ["Zero liability from forged identity documentation", "Full compliance with RBI, FATF, and AML Tier-1 mandates", "Eliminates human KYC review bottlenecks"],
  },
  {
    title: "Consulates & Visa Processing",
    badge: "DIPLOMATIC MISSIONS",
    icon: Globe,
    agencies: "VFS Global, Embassies, Ministry of External Affairs",
    role: "Pre-screening visa permit applicants, residence cards, and travel documents prior to consular approval.",
    benefits: ["Exposes digitally altered bank statements & travel permits", "Prevents human trafficking rings using stolen identities", "Multi-country ICAO 9303 format auto-detection"],
  },
  {
    title: "Critical Defense & Infrastructure",
    badge: "FACILITY SECURITY",
    icon: Building2,
    agencies: "Nuclear Power Plants, Defense HQs, ISRO, Naval Dockyards",
    role: "Ultra-high assurance identity vetting at restricted military perimeters and strategic government facilities.",
    benefits: ["Prevents unauthorized physical perimeter intrusion", "Anti-spoof liveness blocks 3D mask & screen attacks", "Strict air-gap compliance with zero telemetry transmission"],
  },
];

// ── Before vs After Capability Matrix ─────────────────────────────
const comparisonMatrix = [
  {
    vector: "Photoshop & Digital Alterations",
    traditional: "Visual officer check misses 28% of subtle digital retouches and date edits.",
    shieldscan: "99.4% detected via Error Level Analysis (ELA) compression quantization.",
    status: "CRITICAL GAIN"
  },
  {
    vector: "Algorithmic Checksum Validation",
    traditional: "Officers cannot mentally compute 73-char ICAO weights or Verhoeff D5 equations.",
    shieldscan: "100% mathematical verification computed in 14 milliseconds.",
    status: "100% AUTOMATED"
  },
  {
    vector: "Facial Impersonation & Lookalikes",
    traditional: "Human eye cannot reliably distinguish lookalikes or cosmetic alteration under stress.",
    shieldscan: "ArcFace 512D deep embedding cosine similarity (>68% match threshold).",
    status: "BIOMETRIC LOCK"
  },
  {
    vector: "Screen & Photo Spoofing",
    traditional: "Officers distracted by crowd throughput may fall for printed photo or screen hold-ups.",
    shieldscan: "Neural passive liveness analysis detects refresh-rate flicker and moiré patterns.",
    status: "ANTI-SPOOF ACTIVE"
  },
  {
    vector: "Lookout Circular (LOC) Lookup",
    traditional: "Manual passport number entry into disjointed terminal lists creates delays.",
    shieldscan: "Sub-millisecond automated cross-reference against indexed warrant databases.",
    status: "< 20ms QUERY"
  },
  {
    vector: "Audit Trail & Legal Chain of Custody",
    traditional: "Paper registers or editable database rows vulnerable to insider tampering.",
    shieldscan: "Immutable SHA-256 cryptographic hash-chain sealed with timestamp.",
    status: "COURT ADMISSIBLE"
  },
];

// ── Technical FAQ Accordion ───────────────────────────────────────
const faqs = [
  {
    q: "How does ShieldScan run 100% offline without third-party cloud APIs?",
    a: "ShieldScan packages lightweight, quantized neural networks (EasyOCR, ResNet/ArcFace, and OpenCV ELA filters) directly inside the sovereign edge runtime. No outbound internet connection, external API keys, or cloud telemetry are required, guaranteeing full compliance with national defense air-gap directives."
  },
  {
    q: "How is traveler biometric privacy protected under the DPDP Act 2023 & GDPR?",
    a: "ShieldScan implements a Zero-Knowledge Ephemeral Architecture. Live camera frames and cropped passport photos are converted into mathematical 512D embedding vectors strictly in volatile RAM memory. Once the 1:1 cosine match is computed, the embeddings are securely flushed from memory — no facial images are ever written to disk or databases."
  },
  {
    q: "What is Error Level Analysis (ELA) and how does it catch forged documents?",
    a: "When a JPEG document is digitally manipulated in Photoshop or Canva, the altered regions are re-compressed at a different compression ratio compared to the untouched original background. ShieldScan re-compresses the image at 90% quality and computes the absolute difference map, making copy-pasted text, modified dates, and swapped portraits glow brightly on the forensic heatmap."
  },
  {
    q: "Can ShieldScan interface directly with existing airport e-Gates and 3M readers?",
    a: "Yes. ShieldScan features a modular hardware abstraction layer that communicates via standard USB 3.0, TWAIN/WIA protocols, and IP RTSP video streams. It natively supports industry-standard document cradles (such as 3M/Gemalto CR5400, ARH Combo Smart, and Thales AT9000) as well as any high-definition biometric webcam."
  },
  {
    q: "What makes the cryptographic audit ledger tamper-evident?",
    a: "Every inspection event generates a unique SHA-256 block containing the document hash, OCR extract checksum, forensic tamper score, officer decision, and the previous block's hash. Any attempt to modify an audit log retroactively breaks the cryptographic mathematical chain, immediately exposing internal malfeasance."
  }
];

export default function LandingPage() {
  const navigate = useNavigate();

  // Activity feed simulation
  const [logIndex, setLogIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  const activityLogs = [
    { time: "00:01.02", mod: "OCR_ENGINE", text: "EasyOCR: Document type detected -> PASSPORT (ICAO 9303 TD3)", status: "OK" },
    { time: "00:01.48", mod: "ICAO_VERIFY", text: "MRZ Line 1 & Line 2 parsed. Verifying 73-char composite checksum...", status: "VALID" },
    { time: "00:02.15", mod: "TAMPER_ELA", text: "Error Level Analysis computed at 90% JPEG quality. Variance: 14.2 (Low)", status: "CLEARED" },
    { time: "00:02.89", mod: "CMFD_MATCH", text: "ORB keypoint descriptors extracted: 0 cloned blocks detected", status: "AUTHENTIC" },
    { time: "00:03.42", mod: "ARCFACE_V2", text: "Live webcam frame vs ID crop cosine similarity: 93.8% (Threshold: 68.0%)", status: "MATCH" },
    { time: "00:04.10", mod: "WATCHLIST", text: "LOC database cross-reference: 0 active warrants found", status: "NEGATIVE" },
    { time: "00:04.55", mod: "BLOCKCHAIN", text: "SHA-256 block #0841 mined -> e3b0c44298fc1c149afbf4c8996fb924", status: "SEALED" },
    { time: "00:04.80", mod: "DISPATCH", text: "Screening complete -> DECISION: GREEN (PASSENGER CLEARED)", status: "CLEARED" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLogIndex((prev) => (prev < activityLogs.length ? prev + 1 : 1));
    }, 1100);
    return () => clearInterval(timer);
  }, [activityLogs.length]);

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 24px 80px" }}>
      
      {/* ── 1. Executive Hero ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center", marginBottom: 40 }}
      >
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "6px 18px", borderRadius: "999px",
          background: "#eff6ff", border: "1px solid #bfdbfe",
          fontSize: "0.78rem", fontWeight: 700, color: "#2563eb",
          letterSpacing: "0.04em", textTransform: "uppercase",
          marginBottom: 18,
        }}>
          <ShieldCheck size={15} color="#2563eb" />
          SOVEREIGN DEFENSE AI · BORDER & IDENTITY INTELLIGENCE
        </div>

        <h1 style={{
          fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
          fontWeight: 800, lineHeight: 1.15,
          letterSpacing: "-0.03em",
          color: "#0f172a",
          marginBottom: 18,
        }}>
          Enterprise-Grade Border &<br />Document Intelligence
        </h1>

        <p style={{
          fontSize: "1.15rem", color: "#475569",
          maxWidth: 680, margin: "0 auto 30px",
          lineHeight: 1.65,
        }}>
          ShieldScan instantly exposes forged passports, counterfeit national IDs, and identity impersonation in under 10 seconds — engineered for immigration authorities with complete offline air-gap autonomy.
        </p>

        {/* CTA Actions */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            className="btn-primary"
            onClick={() => navigate("/scan")}
            style={{ fontSize: "1rem", padding: "14px 36px", gap: 10 }}
          >
            <Shield size={18} /> Launch Screening Console <ArrowRight size={16} />
          </button>
          
          <button
            className="btn-secondary"
            onClick={() => navigate("/audit")}
            style={{ fontSize: "1rem", padding: "14px 30px" }}
          >
            <Lock size={16} /> Blockchain Ledger
          </button>
        </div>

        {/* ── Executive Hero Showcase Banner ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            marginTop: 40,
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid #e2e8f0",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.03)",
            background: "#ffffff",
            position: "relative",
          }}
        >
          {/* Top Banner Toolbar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            background: "linear-gradient(to right, #ffffff, #f8fafc)",
            borderBottom: "1px solid #e2e8f0",
            flexWrap: "wrap",
            gap: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", background: "#10b981",
                boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.2)",
              }} />
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1e293b", letterSpacing: "0.04em" }}>
                AUTOMATED BORDER CHECKPOINT KIOSK & e-GATE SUITE
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{
                fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: "999px",
                background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe",
              }}>
                OPTICAL 500 DPI UV/IR
              </span>
              <span style={{
                fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: "999px",
                background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0",
              }}>
                ARCFACE 1:1 LIVE
              </span>
            </div>
          </div>

          {/* Banner Image Container */}
          <div style={{ position: "relative", width: "100%", maxHeight: "500px", overflow: "hidden" }}>
            <img
              src="/images/hero_banner.jpg"
              alt="ShieldScan Border Control Security Platform"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
            {/* Ambient Overlay at bottom */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "30px 24px 20px",
              background: "linear-gradient(to top, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.4) 60%, transparent 100%)",
              color: "#ffffff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 16,
            }}>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#93c5fd", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                  MISSION-READY DEPLOYMENT
                </div>
                <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ffffff" }}>
                  Autonomous e-Gate Screening & Multi-Spectral Passport Readers
                </div>
              </div>
              <button
                onClick={() => navigate("/scan")}
                style={{
                  background: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  padding: "10px 22px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
                }}
              >
                Launch Scanner Console <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── 2. Strategic High-Impact Metrics ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 18,
          marginBottom: 60,
        }}
      >
        {impactStats.map((item, idx) => (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: "24px 20px",
              textAlign: "center",
              position: "relative",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px", color: item.color
            }}>
              <item.icon size={22} />
            </div>
            <div style={{ fontSize: "2.1rem", fontWeight: 800, color: "#0f172a", marginBottom: 4, letterSpacing: "-0.03em" }}>
              {item.value}
            </div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
              {item.label}
            </div>
            <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
              {item.sub}
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── 3. Live Security Pipeline Activity Monitor ─────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{ marginBottom: 68 }}
      >
        <div className="terminal-window">
          {/* Header */}
          <div className="terminal-header">
            <div className="terminal-dot" style={{ background: "#ef4444" }} />
            <div className="terminal-dot" style={{ background: "#f59e0b" }} />
            <div className="terminal-dot" style={{ background: "#10b981" }} />
            <span style={{ fontSize: "0.8rem", color: "#475569", marginLeft: 8, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <Cpu size={14} color="#2563eb" />
              SHIELDSCAN KERNEL V4.2 :: AIR-GAP VERIFICATION PIPELINE (SSB-SECTOR-ALPHA)
            </span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
              <span style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 700 }}>ACTIVE ENGINE</span>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="terminal-body">
            {activityLogs.slice(0, logIndex).map((log, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#94a3b8", flexShrink: 0, fontFamily: "JetBrains Mono, monospace" }}>[{log.time}]</span>
                <span style={{ color: "#2563eb", fontWeight: 700, flexShrink: 0, width: 110, fontFamily: "JetBrains Mono, monospace" }}>{log.mod}:</span>
                <span style={{ color: "#1e293b", flex: 1 }}>{log.text}</span>
                <span style={{
                  padding: "2px 8px", borderRadius: 6, fontSize: "0.72rem", fontWeight: 700,
                  background: log.status === "VALID" || log.status === "CLEARED" || log.status === "AUTHENTIC" || log.status === "MATCH" || log.status === "SEALED" || log.status === "OK"
                    ? "#ecfdf5" : "#eff6ff",
                  color: log.status === "VALID" || log.status === "CLEARED" || log.status === "AUTHENTIC" || log.status === "MATCH" || log.status === "SEALED" || log.status === "OK"
                    ? "#059669" : "#2563eb",
                  border: `1px solid ${log.status === "VALID" || log.status === "CLEARED" || log.status === "AUTHENTIC" || log.status === "MATCH" || log.status === "SEALED" || log.status === "OK" ? "#a7f3d0" : "#bfdbfe"}`,
                }}>
                  {log.status}
                </span>
              </div>
            ))}
            {logIndex < activityLogs.length && (
              <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#2563eb", marginTop: 12, fontSize: "0.8rem" }}>
                <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                <span>Running neural verification models...</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── 4. Real-World Checkpoint Hardware Suite ─────────────────── */}
      <div style={{ marginBottom: 68 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            HARDWARE INTEGRATION
          </span>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
            Engineered for Border Kiosks & Automated e-Gates
          </h2>
          <p style={{ color: "#64748b", maxWidth: 640, margin: "8px auto 0", fontSize: "0.95rem" }}>
            Direct plug-and-play compatibility with standard immigration checkpoint hardware, desktop passport readers, and biometric traveler cameras.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 24 }}>
          {/* Card 1: Document Scanner Hardware */}
          <div className="glass-card" style={{ padding: 0, overflow: "hidden", borderRadius: "18px", border: "1px solid #e2e8f0" }}>
            <div style={{ height: 250, overflow: "hidden", position: "relative", background: "#f1f5f9" }}>
              <img
                src="/images/passport_scanner.jpg"
                alt="Optical Document & e-Passport Reader Cradle"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", top: 14, left: 14,
                background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(6px)",
                color: "#ffffff", padding: "5px 12px", borderRadius: "6px",
                fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                CRADLE STATUS: OPTICAL READY
              </div>
            </div>
            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Optical & RFID Document Reader
                </h3>
                <span style={{
                  fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "6px",
                  background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe"
                }}>
                  3M / GEMALTO CLASS
                </span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>
                Multi-spectral illumination bed capturing high-resolution 500 DPI images under White light, UV 365nm for forensic watermarks, and IR 850nm for B900 ink validation.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["ICAO 9303 TD1/TD2/TD3", "ISO 14443 Type A/B RFID", "UV Phosphor Check", "Anti-Glare Bed"].map((tag, tIdx) => (
                  <span key={tIdx} style={{
                    fontSize: "0.72rem", fontWeight: 600, padding: "4px 10px", borderRadius: "6px",
                    background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0"
                  }}>
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Biometric e-Gate Sensor */}
          <div className="glass-card" style={{ padding: 0, overflow: "hidden", borderRadius: "18px", border: "1px solid #e2e8f0" }}>
            <div style={{ height: 250, overflow: "hidden", position: "relative", background: "#f1f5f9" }}>
              <img
                src="/images/biometric_face.jpg"
                alt="Automated e-Gate Biometric Facial Verification"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", top: 14, left: 14,
                background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(6px)",
                color: "#ffffff", padding: "5px 12px", borderRadius: "6px",
                fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                SENSOR STATUS: LIVE 60 FPS
              </div>
            </div>
            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Biometric e-Gate Facial Terminal
                </h3>
                <span style={{
                  fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "6px",
                  background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0"
                }}>
                  ARCFACE 512D
                </span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>
                Real-time 1:1 facial matching against ID document photos with sub-second vector cosine comparison and neural passive liveness detection.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["1:1 Vector Match", "Anti-Spoof Liveness", "Wide-Angle HDR", "Zero Biometric Storage"].map((tag, tIdx) => (
                  <span key={tIdx} style={{
                    fontSize: "0.72rem", fontWeight: 600, padding: "4px 10px", borderRadius: "6px",
                    background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0"
                  }}>
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. 8-Tier Neural & Forensic Architecture ───────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ marginBottom: 68 }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            HIGH-SECURITY FORENSICS
          </span>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
            8-Stage Neural Screening Pipeline
          </h2>
          <p style={{ color: "#64748b", maxWidth: 640, margin: "8px auto 0", fontSize: "0.95rem" }}>
            Zero third-party cloud dependencies. Every model runs locally in sub-second inference cycles on sovereign border checkpoint hardware.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="glass-card"
              style={{ padding: "26px 22px", border: "1px solid #e2e8f0" }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <f.icon size={20} color="#2563eb" />
                </div>
                <span style={{
                  fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em",
                  padding: "4px 10px", borderRadius: 6,
                  background: "#f1f5f9", color: "#475569",
                  border: "1px solid #e2e8f0",
                  fontFamily: "JetBrains Mono, monospace"
                }}>
                  {f.tag}
                </span>
              </div>

              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 8, color: "#0f172a" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: "0.84rem", color: "#64748b", lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── 6. Target Stakeholders ("Who Can Use ShieldScan") ──────── */}
      <div style={{ marginBottom: 68 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            MISSION TARGETS & BENEFICIARIES
          </span>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
            Who Deploys ShieldScan?
          </h2>
          <p style={{ color: "#64748b", maxWidth: 640, margin: "8px auto 0", fontSize: "0.95rem" }}>
            Tailored for national security apparatuses, critical ports of entry, financial institutions, and law enforcement agencies.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 20 }}>
          {stakeholders.map((s, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: "26px",
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: "#eff6ff", border: "1px solid #bfdbfe",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#2563eb"
                  }}>
                    <s.icon size={22} />
                  </div>
                  <span style={{
                    fontSize: "0.7rem", fontWeight: 700,
                    padding: "3px 10px", borderRadius: "999px",
                    background: "#f1f5f9", color: "#2563eb", border: "1px solid #e2e8f0",
                  }}>
                    {s.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
                  {s.title}
                </h3>
                <div style={{ fontSize: "0.76rem", fontWeight: 600, color: "#2563eb", marginBottom: 12 }}>
                  {s.agencies}
                </div>
                <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.6, marginBottom: 18 }}>
                  {s.role}
                </p>
              </div>

              <div style={{
                borderTop: "1px solid #f1f5f9",
                paddingTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}>
                {s.benefits.map((ben, bIdx) => (
                  <div key={bIdx} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "0.8rem", color: "#334155" }}>
                    <CheckCircle2 size={14} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{ben}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. Before vs After: Capability Comparison Matrix ─────────── */}
      <div style={{ marginBottom: 68 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            TACTICAL ADVANTAGE
          </span>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
            Manual Officer Inspection vs. ShieldScan AI
          </h2>
          <p style={{ color: "#64748b", maxWidth: 640, margin: "8px auto 0", fontSize: "0.95rem" }}>
            How automated multi-stage forensic analysis eliminates human fatigue, inspection bottlenecks, and sophisticated document forgery.
          </p>
        </div>

        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          overflowX: "auto",
          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.04)"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "16px 20px", color: "#1e293b", fontWeight: 700, width: "24%" }}>SECURITY VECTOR</th>
                <th style={{ padding: "16px 20px", color: "#ef4444", fontWeight: 700, width: "38%" }}>TRADITIONAL MANUAL INSPECTION</th>
                <th style={{ padding: "16px 20px", color: "#059669", fontWeight: 700, width: "38%" }}>SHIELDSCAN DEFENSE KIOSK</th>
              </tr>
            </thead>
            <tbody>
              {comparisonMatrix.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: idx < comparisonMatrix.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                  <td style={{ padding: "16px 20px", fontWeight: 700, color: "#0f172a" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <AlertTriangle size={15} color="#d97706" />
                      <span>{row.vector}</span>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", color: "#64748b", lineHeight: 1.5 }}>
                    <span style={{ color: "#ef4444", fontWeight: 600 }}>✕ Flaw: </span>
                    {row.traditional}
                  </td>
                  <td style={{ padding: "16px 20px", color: "#1e293b", lineHeight: 1.5 }}>
                    <span style={{ color: "#059669", fontWeight: 600 }}>✓ AI Advantage: </span>
                    {row.shieldscan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 8. Universal Multi-Protocol Supported Documents ────────── */}
      <div style={{ marginBottom: 68 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            UNIVERSAL COMPATIBILITY
          </span>
          <h2 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
            Multi-Protocol Document Engine
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {supportedDocs.map((doc, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, boxShadow: `0 14px 28px -4px ${doc.color}25` }}
              transition={{ duration: 0.2 }}
              style={{
                padding: "24px 20px",
                position: "relative",
                overflow: "hidden",
                background: `radial-gradient(circle at 100% 0%, ${doc.bgGlow}, #ffffff 65%)`,
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 16px -2px rgba(0, 0, 0, 0.04)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                textAlign: "left",
                cursor: "pointer",
              }}
              onClick={() => navigate("/scan")}
            >
              {/* Background SVG Guilloche Lathe Security Watermark */}
              <SecurityGuillocheBg color={doc.color} />

              {/* Card Top Row: Custom SVG Emblem + Protocol Badge */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  background: doc.badgeBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 4px 12px ${doc.color}35`,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}>
                  {doc.icon}
                </div>

                <span style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  fontFamily: "JetBrains Mono, monospace",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  background: "#ffffff",
                  color: doc.color,
                  border: `1px solid ${doc.color}30`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}>
                  {doc.protocol}
                </span>
              </div>

              {/* Title & Standard */}
              <div style={{ position: "relative", zIndex: 1, marginBottom: 14 }}>
                <h3 style={{
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: "#0f172a",
                  marginBottom: 5,
                  letterSpacing: "-0.01em",
                }}>
                  {doc.name}
                </h3>
                <div style={{
                  fontSize: "0.74rem",
                  color: "#64748b",
                  fontFamily: "JetBrains Mono, monospace",
                }}>
                  {doc.standard}
                </div>
              </div>

              {/* Bottom Micro Feature Tag */}
              <div style={{
                position: "relative",
                zIndex: 1,
                borderTop: "1px solid #f1f5f9",
                paddingTop: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <span style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "#059669",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}>
                  <CheckCircle2 size={12} color="#059669" />
                  {doc.feature}
                </span>

                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: doc.color }}>
                  Scan →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── 9. Interactive Technical FAQ Accordion ───────────────────── */}
      <div style={{ marginBottom: 68 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            QUESTIONS & ARCHITECTURE
          </span>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
            Frequently Answered Technical Questions
          </h2>
          <p style={{ color: "#64748b", maxWidth: 640, margin: "8px auto 0", fontSize: "0.95rem" }}>
            Deep-dive technical explanations for evaluators, security directors, and border administration officials.
          </p>
        </div>

        <div style={{ maxWidth: 840, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  boxShadow: isOpen ? "0 4px 14px rgba(0, 0, 0, 0.05)" : "none",
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  style={{
                    width: "100%",
                    padding: "18px 22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: isOpen ? "#f8fafc" : "#ffffff",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: 14,
                  }}
                >
                  <span style={{ fontSize: "0.98rem", fontWeight: 700, color: "#0f172a" }}>
                    {faq.q}
                  </span>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: isOpen ? "#eff6ff" : "#f1f5f9",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, color: isOpen ? "#2563eb" : "#64748b"
                  }}>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      <div style={{
                        padding: "16px 22px 22px",
                        fontSize: "0.88rem",
                        color: "#475569",
                        lineHeight: 1.7,
                        borderTop: "1px solid #e2e8f0"
                      }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 10. Ready to Screen Banner ─────────────────────────────────── */}
      <div style={{
        padding: "48px 36px", textAlign: "center",
        background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(37, 99, 235, 0.2)",
        color: "#ffffff",
      }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 12, color: "#ffffff" }}>
          Begin Checkpoint Verification
        </h2>
        <p style={{ color: "#dbeafe", maxWidth: 540, margin: "0 auto 28px", fontSize: "0.98rem" }}>
          Load an official document image or PDF, take a live biometric verification snapshot, and receive an instant forensic verdict.
        </p>

        <button
          onClick={() => navigate("/scan")}
          style={{
            fontSize: "1rem", padding: "14px 36px",
            background: "#ffffff", color: "#1e40af",
            border: "none", borderRadius: "12px",
            fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            display: "inline-flex", alignItems: "center", gap: 10,
          }}
        >
          Open Screening Console <ArrowRight size={18} />
        </button>
      </div>

      {/* ── 11. Defense-Grade Sovereign Footer ────────────────────────── */}
      <div style={{ textAlign: "center", marginTop: 50, color: "#94a3b8", fontSize: "0.82rem", lineHeight: 1.6 }}>
        <div>ShieldScan · Defense-Grade AI Document Verification Platform</div>
        <div>Air-Gap Sovereign AI Architecture · Real-Time Border Intelligence</div>
        <div style={{ marginTop: 6, fontSize: "0.75rem", color: "#cbd5e1" }}>
          ICAO Doc 9303 Compliant · UIDAI Verhoeff D5 · ArcFace 512D Vector Embeddings · SHA-256 Ledger
        </div>
      </div>

    </div>
  );
}

