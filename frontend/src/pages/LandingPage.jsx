import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Zap, Eye, Cpu, Lock, ArrowRight, CheckCircle2,
  FileText, Fingerprint, Layers, Check, Sparkles,
  Search, AlertCircle, HardDrive, ShieldCheck,
  Building2, Plane, Landmark, Scale, Key, HelpCircle,
  ChevronDown, ChevronUp, Globe, AlertTriangle, UserCheck,
  Award, FileSpreadsheet, Activity, GraduationCap, Clock,
  Calculator, ShieldAlert, MonitorCheck, TabletSmartphone,
  Server, FileCheck, RefreshCw, BarChart3,
  Siren, Anchor, Sun, Compass, Radio, Droplets, Gauge
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

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

// ── High-Stakes Forensic Threat Vectors & Defense Matrix ─────────
const threatMatrix = [
  {
    id: "tamper_ela",
    title: "Photoshop & Pixel-Level Tampering",
    category: "DIGITAL FORGERY",
    threat: "Fraudsters digitally alter date-of-birth, change applicant names, or splice replacement portraits onto genuine scanned ID cards and admit passes.",
    countermeasure: "JPEG Error Level Analysis (ELA) + Quantization Luminance",
    mechanism: "Re-compresses target pixels at 90% quality to isolate compression error differentials. Modified areas show intense variance (>35 AU), glowing bright red on the inspector heatmap.",
    catchRate: "99.4% Catch Rate",
    statusBadge: "ACTIVE FORENSIC ELA",
    badgeColor: "#ef4444",
    borderColor: "#fecaca",
    bgColor: "#fef2f2",
    icon: Eye,
  },
  {
    id: "cloned_stamps",
    title: "Cloned Seals & Signature Duplication",
    category: "MECHANICAL FORGERY",
    threat: "Pasting duplicated government rubber stamps, university registrar seals, or forged signatures from legitimate certificates onto fraudulent credentials.",
    countermeasure: "Copy-Move Forgery Detection (CMFD) via ORB/SIFT",
    mechanism: "Extracts 256-bit binary descriptors and clusters matching keypoints across distant spatial coordinates. Identifies cloned pixel blocks even when rotated, scaled, or noise-masked.",
    catchRate: "98.7% Accuracy",
    statusBadge: "ORB/SIFT SPATIAL CLUSTERING",
    badgeColor: "#d97706",
    borderColor: "#fed7aa",
    bgColor: "#fffbeb",
    icon: Sparkles,
  },
  {
    id: "deepfakes",
    title: "Generative AI Deepfakes & Silicone Masks",
    category: "BIOMETRIC SPOOFING",
    threat: "Impersonators presenting ultra-realistic 3D silicone masks, printed 2D photographic cutouts, or smartphone screen video loop replays to bypass camera vetting.",
    countermeasure: "Multi-Frame Passive Depth & Moiré Liveness",
    mechanism: "Evaluates screen refresh flicker, micro-capillary blood pulse dynamics, and specular pupil corneal reflections across 18 continuous video frames at 60 FPS.",
    catchRate: "99.1% Liveness Precision",
    statusBadge: "PASSIVE ANTI-SPOOF LOCK",
    badgeColor: "#4f46e5",
    borderColor: "#c7d2fe",
    bgColor: "#eef2ff",
    icon: Fingerprint,
  },
  {
    id: "proxy_solvers",
    title: "Dual-Registration & Solver Gang Cartels",
    category: "EXAMINATION FRAUD",
    threat: "Hired academic impersonators and mercenary test-takers registered under duplicate profiles to sit for exams across multiple centers in high-stakes tests.",
    countermeasure: "Cross-Center 512D Biometric Deduplication",
    mechanism: "Generates high-dimensional ArcFace vector hashes and performs sub-millisecond deduplication against candidate rosters, immediately locking out duplicate appearances.",
    catchRate: "100% Unique Identity Match",
    statusBadge: "INSTANT ROSTER DISPATCH",
    badgeColor: "#059669",
    borderColor: "#a7f3d0",
    bgColor: "#ecfdf5",
    icon: GraduationCap,
  },
];

// ── 4-Tier Multi-Platform Deployment Modes ────────────────────────
const deploymentModes = [
  {
    tier: "TIER 01",
    name: "Turnkey Autonomous Station",
    tag: "WALK-THROUGH e-GATE",
    image: "/images/exam_kiosk.jpg",
    desc: "Self-service floor-standing pedestal with motorized turnstile relay, integrated document hopper, and dual biometric cameras.",
    specs: ["21.5\" Anti-Glare Touch Display", "Motorized Passport & Admit Card Slot", "Dual HDR 60 FPS Biometric Cameras", "Turnstile & Flap Barrier Relay"],
    recommendedFor: "Airport e-Gates, National Exam Center Entrances, Defense Perimeter Access",
    actionText: "View Hardware in Store",
    actionLink: "/store",
  },
  {
    tier: "TIER 02",
    name: "Desktop Countertop Cradle",
    tag: "BORDER BOOTH & DESK",
    image: "/images/passport_scanner.jpg",
    desc: "Compact multi-spectral optical scanner paired with officer companion display for rapid desk-level document authentication.",
    specs: ["500 DPI White / 365nm UV / 850nm IR", "ICAO 9303 TD1/TD2/TD3 Optical Bed", "Plug-and-Play USB 3.0 Interface", "Officer Companion Dual-Screen UI"],
    recommendedFor: "Immigration Officer Desks, Visa Processing Counters, Bank Vault & KYC Counters",
    actionText: "View Desktop Cradles",
    actionLink: "/store",
  },
  {
    tier: "TIER 03",
    name: "Tactical Handheld Scanner",
    tag: "ROVING FIELD SQUAD",
    image: "/images/handheld_scanner.jpg",
    desc: "Ultra-rugged mobile terminal engineered for roving border patrols, railway ticket squads, and exam hall invigilators.",
    specs: ["IP67 Water/Dust Proof & MIL-STD-810G", "Integrated Zebra 1D/2D Barcode Imager", "5G eSIM + Offline Neural Cache", "12-Hour Hot-Swappable Battery"],
    recommendedFor: "Highway Police Patrols, Train Ticket Squads, Roving Exam Hall Supervisors",
    actionText: "View Tactical Handhelds",
    actionLink: "/store",
  },
  {
    tier: "TIER 04",
    name: "Sovereign Air-Gapped Server",
    tag: "CENTRAL APPLIANCE",
    image: null,
    desc: "High-density 1U/2U rackmount neural inference server anchoring sovereign cryptographic ledgers across 100+ checkpoint gates.",
    specs: ["Dual TensorRT Inference Accelerators", "48TB FIPS 140-2 Encrypted NVMe Array", "Hardware HSM Cryptographic Key Store", "Zero Outbound Telemetry Guarantee"],
    recommendedFor: "Central Intelligence Hubs, Ministry Data Centers, Airport Terminal Operations",
    actionText: "Consult Enterprise Deployment",
    actionLink: "/guide",
  },
];

// ── Sovereign Compliance & Regulatory Standards ───────────────────
const complianceFrameworks = [
  {
    code: "ICAO DOC 9303",
    title: "International Civil Aviation Organization",
    scope: "Machine Readable Travel Documents (MRTD)",
    details: "Full compliance with Doc 9303 Parts 1–12 for TD1, TD2, and TD3 passport books, visas, and national IDs, including composite 73-character checksum weighting and cryptographic Basic Access Control (BAC).",
    badge: "GLOBAL AVIATION MANDATE",
    color: "#2563eb",
  },
  {
    code: "UIDAI VERHOEFF D5",
    title: "Unique Identification Authority of India",
    scope: "Dihedral Group D5 Aadhaar Checksum Standard",
    details: "Executes non-commutative dihedral permutation checks over multiplication tables, detecting 100% of single-digit misread errors and 95.4% of transposition errors on 12-digit Aadhaar numbers.",
    badge: "NATIONAL ID STANDARD",
    color: "#4f46e5",
  },
  {
    code: "DPDP ACT 2023 & GDPR",
    title: "Digital Personal Data Protection & Privacy",
    scope: "Zero Biometric Data Persistence",
    details: "Live facial frames and document photographs are tokenized into mathematical 512D embeddings strictly within volatile RAM. Vectors are cryptographically purged immediately upon session clearance.",
    badge: "PRIVACY SOVEREIGNTY",
    color: "#059669",
  },
  {
    code: "NIST FIPS 140-2 LEVEL 3",
    title: "Federal Information Processing Standards",
    scope: "Tamper-Evident Cryptographic Auditing",
    details: "Screening verdicts, officer IDs, and document hashes are sealed using military-grade SHA-256 hash chains, providing immutable and court-admissible electronic evidence logs under Indian Evidence Act 65B.",
    badge: "MILITARY ASSURANCE",
    color: "#d97706",
  },
  {
    code: "ISO/IEC 19794-5",
    title: "International Organization for Standardization",
    scope: "Biometric Data Interchange Formats",
    details: "Standardized facial image tokenization and quality assurance benchmarks guaranteeing inter-operability across border management databases, e-Gates, and police AFIS networks.",
    badge: "INTEROPERABILITY",
    color: "#0891b2",
  },
];

// ── ROI & Throughput Calculator Presets ───────────────────────────
const calculatorPresets = [
  {
    id: "exam",
    label: "National Entrance Exam (JEE / NEET / UPSC)",
    icon: GraduationCap,
    volume: 5000,
    manualSec: 40,
    rateINR: 200,
    rateUSD: 15,
    badge: "Anti-Proxy Mode",
    desc: "Eliminates solver gangs, admit card tampering, and impersonator queues across regional examination centers.",
  },
  {
    id: "airport",
    label: "Major International Airport (T3 e-Gates)",
    icon: Plane,
    volume: 15000,
    manualSec: 60,
    rateINR: 500,
    rateUSD: 40,
    badge: "High-Volume Transit",
    desc: "Accelerates international immigration queues from 3 minutes down to 7.8 seconds with 500 DPI UV/IR scanning.",
  },
  {
    id: "consulate",
    label: "Embassy Visa Section & Diplomatic HQ",
    icon: Building2,
    volume: 800,
    manualSec: 35,
    rateINR: 350,
    rateUSD: 25,
    badge: "Consular Vetting",
    desc: "Air-gapped pre-screening of resident permits and visas with complete cryptographic audit trails.",
  },
];

// ── Specialized Tactical Operational Environments ────────────────
const tacticalEnvironments = [
  {
    id: "traffic",
    themeKey: "traffic",
    title: "Traffic Police & Highway Patrol",
    shortName: "Highway Intercept",
    tag: "SOLAR GLARE PROTECTION",
    tagline: "Ultra-high contrast amber HUD engineered for extreme roadside sunlight (>85k Lux) and rapid 5-second motorist spot checks.",
    accentColor: "#d97706",
    badgeBg: "#fffbeb",
    badgeBorder: "#fde68a",
    icon: Siren,
    operationalSpecs: [
      { label: "Target Credentials", value: "Indian Smart Card DL, Vehicle RC, E-Challan Registry, Aadhaar" },
      { label: "Tactical Environment", value: "Direct solar glare (>85,000 Lux), highway dust, heavy motorcycle glove operation" },
      { label: "Specialized Engine", value: "Solar amber high-contrast palette, anti-glare typography, 1-tap DL/RC OCR" },
      { label: "Interceptor Feed", value: "Sub-second query against National Stolen Vehicle Registry & Non-Bailable Warrants" },
    ],
    sampleDoc: {
      type: "INDIAN DRIVING LICENSE (DL)",
      idNumber: "DL-1420240098231",
      holder: "RAJESH KUMAR SHARMA",
      status: "VERIFIED AUTHENTIC · NO VIOLATIONS",
      checks: ["QR Digital Signature: VALID", "HSRP / RC Match: 100%", "State RTO Database: ACTIVE"],
      luxTelemetry: "86,200 LUX · SOLAR SHIELD ACTIVE",
      badge: "GLARE DEFENSE ACTIVE",
    },
  },
  {
    id: "maritime",
    themeKey: "maritime",
    title: "Maritime & Vessel Cargo Boarding",
    shortName: "Ship Checking",
    tag: "NAUTICAL BRIDGE MODE",
    tagline: "Deep sea midnight palette with bioluminescent cyan telemetry to preserve dark-adapted vision on ship bridges and open-water boarding.",
    accentColor: "#06b6d4",
    badgeBg: "rgba(6, 182, 212, 0.12)",
    badgeBorder: "#164e63",
    icon: Anchor,
    operationalSpecs: [
      { label: "Target Credentials", value: "Seafarer CDC, Vessel Crew Manifests, Bills of Lading, Sailor Passports" },
      { label: "Tactical Environment", value: "Night boarding at 02:00 AM, salt-spray mist, pitch-dark ship navigation bridge" },
      { label: "Specialized Engine", value: "Bioluminescent cyan HUD, scotopic night-vision preservation, offline neural cache" },
      { label: "Maritime Watchlist", value: "Sub-second cross-reference with IMO vessel registry & Coastal Guard Lookout Circulars" },
    ],
    sampleDoc: {
      type: "SEAFARER CONTINUOUS DISCHARGE BOOK (CDC)",
      idNumber: "IN-CDC-2023-88412",
      holder: "CAPT. VIKRAMADITYA SEN",
      status: "CLEARED FOR HARBOR ENTRY",
      checks: ["IMO SOLAS Standard: COMPLIANT", "Port Customs Manifest: MATCH", "Interpol Maritime SLTD: NEGATIVE"],
      luxTelemetry: "0.2 LUX · SCOTOPIC PRESERVATION ACTIVE",
      badge: "NIGHT-BRIDGE SAFE",
    },
  },
  {
    id: "default",
    themeKey: "default",
    title: "Border Defense & Immigration e-Gates",
    shortName: "Border Defense HQ",
    tag: "SOVEREIGN COMMAND MODE",
    tagline: "Executive high-trust GovTech interface optimized for immigration counters, walk-through e-Gates, and forensic audit centers.",
    accentColor: "#2563eb",
    badgeBg: "#eff6ff",
    badgeBorder: "#bfdbfe",
    icon: Shield,
    operationalSpecs: [
      { label: "Target Credentials", value: "ICAO 9303 Passports (TD1/TD2/TD3), Diplomatic Visas, UIDAI Aadhaar" },
      { label: "Tactical Environment", value: "24/7 high-throughput international airport terminals & sovereign checkpoints" },
      { label: "Specialized Engine", value: "8-Stage Forensic Pipeline, ArcFace 512D Biometric Liveness, SHA-256 Ledger" },
      { label: "Immigration Ledger", value: "Cross-checks against Interpol SLTD, MHA LOC database, and Verhoeff D5 algorithm" },
    ],
    sampleDoc: {
      type: "INTERNATIONAL DIPLOMATIC PASSPORT",
      idNumber: "Z9810472",
      holder: "DR. ANANYA MUKHERJEE",
      status: "AUTHENTIC & VERIFIED · CLEARED",
      checks: ["ICAO Checksums: 100% MATCH", "ArcFace Biometrics: 99.4% COSINE", "Tamper Ledger: SHA-256 ANCHORED"],
      luxTelemetry: "450 LUX · AIRPORT TERMINAL DOCK",
      badge: "e-GATE RELAY READY",
    },
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [activeEnvTab, setActiveEnvTab] = useState(theme === "traffic" ? "traffic" : theme === "maritime" ? "maritime" : "traffic");

  // Activity feed simulation
  const [logIndex, setLogIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  // ROI & Throughput Calculator state
  const [activePreset, setActivePreset] = useState("exam");
  const [calcVolume, setCalcVolume] = useState(5000);
  const [calcManualSec, setCalcManualSec] = useState(40);
  const [calcCurrency, setCalcCurrency] = useState("INR");
  const [calcHourlyRate, setCalcHourlyRate] = useState(200);

  const handleSelectPreset = (preset) => {
    setActivePreset(preset.id);
    setCalcVolume(preset.volume);
    setCalcManualSec(preset.manualSec);
    setCalcHourlyRate(calcCurrency === "INR" ? preset.rateINR : preset.rateUSD);
  };

  const handleCurrencyChange = (curr) => {
    setCalcCurrency(curr);
    const currPreset = calculatorPresets.find((p) => p.id === activePreset);
    if (currPreset) {
      setCalcHourlyRate(curr === "INR" ? currPreset.rateINR : currPreset.rateUSD);
    } else {
      setCalcHourlyRate(curr === "INR" ? 250 : 20);
    }
  };

  // Calculated Metrics
  const manualTotalHours = (calcVolume * calcManualSec) / 3600;
  const shieldScanTotalHours = (calcVolume * 7.8) / 3600;
  const hoursSaved = Math.max(0, manualTotalHours - shieldScanTotalHours);
  const moneySaved = Math.round(hoursSaved * calcHourlyRate);
  const speedupRatio = (calcManualSec / 7.8).toFixed(1);

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
    <div className="page-container" style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 24px 80px" }}>
      
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
                AUTOMATED BORDER CHECKPOINT & e-GATE SUITE
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
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
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

      {/* ── 2.5. Interactive Throughput & Efficiency ROI Calculator Widget ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12 }}
        style={{ marginBottom: 68 }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            OPERATIONAL EFFICIENCY & ROI SIMULATOR
          </span>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
            Quantify Your Time & Cost Reduction
          </h2>
          <p style={{ color: "#64748b", maxWidth: 680, margin: "8px auto 0", fontSize: "0.95rem" }}>
            Compare manual inspection bottlenecks against ShieldScan's automated 7.8-second neural screening pipeline. Select an operational scenario or calibrate your custom volume.
          </p>
        </div>

        {/* Preset Selector Tabs */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 24,
        }}>
          {calculatorPresets.map((preset) => {
            const isSel = activePreset === preset.id;
            const Icon = preset.icon;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 18px",
                  borderRadius: "12px",
                  fontSize: "0.84rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  background: isSel ? "#2563eb" : "#ffffff",
                  color: isSel ? "#ffffff" : "#334155",
                  border: isSel ? "1px solid #1d4ed8" : "1px solid #e2e8f0",
                  boxShadow: isSel ? "0 4px 14px rgba(37, 99, 235, 0.25)" : "0 1px 3px rgba(0,0,0,0.03)",
                }}
              >
                <Icon size={16} color={isSel ? "#ffffff" : "#2563eb"} />
                <span>{preset.label}</span>
                <span style={{
                  fontSize: "0.68rem",
                  padding: "2px 7px",
                  borderRadius: "999px",
                  background: isSel ? "rgba(255,255,255,0.2)" : "#eff6ff",
                  color: isSel ? "#ffffff" : "#2563eb",
                  marginLeft: 4,
                }}>
                  {preset.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Calculator Card */}
        <div className="glass-card" style={{
          padding: "32px",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          background: "#ffffff",
          boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.04)",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 36, alignItems: "center" }}>
            
            {/* Left Column: Interactive Inputs */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                  <Calculator size={18} color="#2563eb" />
                  Checkpoint Parameters
                </span>
                
                {/* Currency Switcher */}
                <div style={{ display: "inline-flex", background: "#f1f5f9", borderRadius: "8px", padding: 2, border: "1px solid #e2e8f0" }}>
                  <button
                    onClick={() => handleCurrencyChange("INR")}
                    style={{
                      padding: "4px 10px", borderRadius: "6px", fontSize: "0.74rem", fontWeight: 700, border: "none", cursor: "pointer",
                      background: calcCurrency === "INR" ? "#ffffff" : "transparent",
                      color: calcCurrency === "INR" ? "#2563eb" : "#64748b",
                      boxShadow: calcCurrency === "INR" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    }}
                  >
                    ₹ INR
                  </button>
                  <button
                    onClick={() => handleCurrencyChange("USD")}
                    style={{
                      padding: "4px 10px", borderRadius: "6px", fontSize: "0.74rem", fontWeight: 700, border: "none", cursor: "pointer",
                      background: calcCurrency === "USD" ? "#ffffff" : "transparent",
                      color: calcCurrency === "USD" ? "#2563eb" : "#64748b",
                      boxShadow: calcCurrency === "USD" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    }}
                  >
                    $ USD
                  </button>
                </div>
              </div>

              {/* Slider 1: Candidate / Passenger Volume */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#475569" }}>
                    Total Candidates / Travelers per Session
                  </label>
                  <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#2563eb", fontFamily: "JetBrains Mono, monospace" }}>
                    {calcVolume.toLocaleString()} persons
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="25000"
                  step="100"
                  value={calcVolume}
                  onChange={(e) => {
                    setCalcVolume(Number(e.target.value));
                    setActivePreset("custom");
                  }}
                  style={{ width: "100%", accentColor: "#2563eb", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#94a3b8", marginTop: 4 }}>
                  <span>200</span>
                  <span>10,000</span>
                  <span>25,000</span>
                </div>
              </div>

              {/* Slider 2: Average Manual Inspection Time */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#475569" }}>
                    Traditional Manual Inspection Time
                  </label>
                  <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", fontFamily: "JetBrains Mono, monospace" }}>
                    {calcManualSec} seconds / person
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={calcManualSec}
                  onChange={(e) => {
                    setCalcManualSec(Number(e.target.value));
                    setActivePreset("custom");
                  }}
                  style={{ width: "100%", accentColor: "#2563eb", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#94a3b8", marginTop: 4 }}>
                  <span>15s (Rushed)</span>
                  <span>60s (Standard)</span>
                  <span>120s (Thorough)</span>
                </div>
              </div>

              {/* Slider 3: Hourly Invigilator / Staff Cost */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#475569" }}>
                    Invigilator / Officer Hourly Wage Rate
                  </label>
                  <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#059669", fontFamily: "JetBrains Mono, monospace" }}>
                    {calcCurrency === "INR" ? `₹${calcHourlyRate}` : `$${calcHourlyRate}`} / hour
                  </span>
                </div>
                <input
                  type="range"
                  min={calcCurrency === "INR" ? "100" : "10"}
                  max={calcCurrency === "INR" ? "1500" : "100"}
                  step={calcCurrency === "INR" ? "25" : "5"}
                  value={calcHourlyRate}
                  onChange={(e) => {
                    setCalcHourlyRate(Number(e.target.value));
                    setActivePreset("custom");
                  }}
                  style={{ width: "100%", accentColor: "#059669", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#94a3b8", marginTop: 4 }}>
                  <span>{calcCurrency === "INR" ? "₹100/hr" : "$10/hr"}</span>
                  <span>{calcCurrency === "INR" ? "₹750/hr" : "$50/hr"}</span>
                  <span>{calcCurrency === "INR" ? "₹1,500/hr" : "$100/hr"}</span>
                </div>
              </div>

            </div>

            {/* Right Column: Dynamic Projected Impact Dashboard */}
            <div style={{
              background: "linear-gradient(145deg, #f8fafc 0%, #eff6ff 100%)",
              borderRadius: "16px",
              padding: "26px",
              border: "1px solid #dbeafe",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#1e40af", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  PROJECTED EFFICIENCY DIVIDEND
                </span>
                <span style={{
                  fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: "999px",
                  background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0",
                }}>
                  {speedupRatio}x FASTER CLEARANCE
                </span>
              </div>

              {/* Hours Saved Metric */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", marginBottom: 4 }}>
                  TOTAL MAN-HOURS SAVED PER SESSION
                </div>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#2563eb", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {hoursSaved.toFixed(1)} <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#475569" }}>Hours</span>
                </div>
                {/* Timeline Bar Comparison */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#64748b", marginBottom: 4 }}>
                    <span>Manual Inspection: <strong>{manualTotalHours.toFixed(1)} hrs</strong></span>
                    <span style={{ color: "#059669" }}>ShieldScan: <strong>{shieldScanTotalHours.toFixed(1)} hrs</strong></span>
                  </div>
                  <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                    <div style={{
                      position: "absolute", left: 0, top: 0, bottom: 0,
                      width: `${Math.min(100, (shieldScanTotalHours / (manualTotalHours || 1)) * 100)}%`,
                      background: "#2563eb", borderRadius: 4,
                    }} />
                  </div>
                </div>
              </div>

              {/* Cost Savings & Risk Reduction Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div style={{ background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748b" }}>DIRECT COST SAVING</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#059669", marginTop: 2 }}>
                    {calcCurrency === "INR" ? `₹${moneySaved.toLocaleString()}` : `$${moneySaved.toLocaleString()}`}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>Per operational shift</div>
                </div>

                <div style={{ background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748b" }}>FRAUD INTERCEPTION</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", marginTop: 2 }}>
                    99.4%
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#ef4444" }}>vs ~42% human eye fatigue</div>
                </div>
              </div>

              {/* Bottom Guarantee Banner */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 12px", background: "rgba(37, 99, 235, 0.06)",
                borderRadius: "8px", border: "1px solid rgba(37, 99, 235, 0.15)",
                fontSize: "0.74rem", color: "#1e40af", lineHeight: 1.4,
              }}>
                <ShieldCheck size={16} color="#2563eb" style={{ flexShrink: 0 }} />
                <span>
                  <strong>100% Cryptographic Certainty:</strong> Every candidate clearance generates an immutable SHA-256 block ledger. Zero paper registers, zero impersonator disputes.
                </span>
              </div>

            </div>

          </div>
        </div>
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
            Engineered for Border Checkpoints & Automated e-Gates
          </h2>
          <p style={{ color: "#64748b", maxWidth: 640, margin: "8px auto 0", fontSize: "0.95rem" }}>
            Direct plug-and-play compatibility with standard immigration checkpoint hardware, desktop passport readers, and biometric traveler cameras.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 24 }}>
          {/* Card 1: Document Scanner Hardware */}
          <div className="glass-card" style={{ padding: 0, overflow: "hidden", borderRadius: "18px", border: "1px solid #e2e8f0" }}>
            <div style={{ height: 250, overflow: "hidden", position: "relative", background: "#f1f5f9" }}>
              <img
                src="/images/passport_scanner.jpg"
                alt="Optical Document & e-Passport Reader Cradle"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ padding: "24px" }}>
              <div style={{ marginBottom: 8 }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Optical & RFID Document Reader
                </h3>
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
            </div>
            <div style={{ padding: "24px" }}>
              <div style={{ marginBottom: 8 }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Biometric e-Gate Facial Terminal
                </h3>
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

      {/* ── 4.5. Anti-Proxy Examination Security Spotlight ─────────── */}
      <div style={{ marginBottom: 68 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            EXAMINATION INTEGRITY & ANTI-PROXY SPOTLIGHT
          </span>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
            Halting Impersonation & Solver Gangs at Entrance Gates
          </h2>
          <p style={{ color: "#64748b", maxWidth: 680, margin: "8px auto 0", fontSize: "0.95rem" }}>
            High-stakes national entrance tests (JEE, NEET, UPSC, SSC, Banking, State Commissions) demand zero-tolerance candidate vetting. ShieldScan unites encrypted admit card QR validation, live 1:1 facial biometric matching, and optical font forensics into an automated 7.8-second gate check.
          </p>
        </div>

        {/* ── Featured Showcase: Entrance Station Setup ── */}
        <div className="glass-card" style={{
          padding: 0,
          overflow: "hidden",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          background: "#ffffff",
          boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.04)",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))" }}>
            
            {/* Left Column: Visual Showcase */}
            <div style={{ position: "relative", minHeight: 440, background: "#0f172a", overflow: "hidden" }}>
              <img
                src="/images/exam_kiosk.jpg"
                alt="ShieldScan Autonomous Examination Check-in Station"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              
              {/* Top Status Tag */}
              <div style={{
                position: "absolute", top: 16, left: 16,
                background: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(8px)",
                color: "#ffffff", padding: "6px 14px", borderRadius: "8px",
                fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em",
                display: "flex", alignItems: "center", gap: 8,
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.3)" }} />
                EXAM HALL ENTRANCE MODE · ACTIVE
              </div>

              {/* Bottom Info Gradient */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "24px",
                background: "linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.6) 60%, transparent 100%)",
                color: "#ffffff",
              }}>
                <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#93c5fd", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
                  TURNKEY ADMIT CARD & BIOMETRIC GATE
                </div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#ffffff", marginBottom: 8 }}>
                  Anti-Proxy Autonomous Station
                </div>
                <p style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.5, margin: "0 0 14px" }}>
                  Integrates with turnstile barriers, motorized admit card reader, and thermal seating slip dispenser for tamper-proof candidate flow.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={() => navigate("/store")}
                    style={{
                      background: "#2563eb", color: "#ffffff", border: "none",
                      padding: "8px 18px", borderRadius: "8px", fontWeight: 700,
                      fontSize: "0.82rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                    }}
                  >
                    Procure Hardware Units <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => navigate("/guide")}
                    style={{
                      background: "rgba(255, 255, 255, 0.15)", color: "#ffffff",
                      border: "1px solid rgba(255, 255, 255, 0.25)",
                      padding: "8px 18px", borderRadius: "8px", fontWeight: 700,
                      fontSize: "0.82rem", cursor: "pointer",
                    }}
                  >
                    View Exam SOP
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: 4-Step Examination Protocol */}
            <div style={{ padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    4-TIER CANDIDATE VETTING PROTOCOL
                  </span>
                </div>

                {/* 4 Protocol Steps */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  
                  {/* Step 1 */}
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: "#eff6ff", border: "1px solid #bfdbfe",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#2563eb", flexShrink: 0, marginTop: 2,
                    }}>
                      <FileCheck size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0f172a" }}>
                        1. Encrypted Admit Card QR Decryption
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5, marginTop: 3 }}>
                        Instantly verifies the digital signing key of the examination board (NTA, UPSC, SSC), decrypting roll numbers and exposing counterfeit hall tickets in under 800ms.
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: "#ecfdf5", border: "1px solid #a7f3d0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#059669", flexShrink: 0, marginTop: 2,
                    }}>
                      <Fingerprint size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0f172a" }}>
                        2. Live ArcFace 1:1 Biometric Verification
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5, marginTop: 3 }}>
                        Candidate looks directly at the dual HDR camera. 512D neural embeddings match live facial geometry against the admit card photo and government ID with &gt;99.2% cosine precision.
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: "#fffbeb", border: "1px solid #fed7aa",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#d97706", flexShrink: 0, marginTop: 2,
                    }}>
                      <Eye size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0f172a" }}>
                        3. ELA Photo-Swap & Font Forgery Inspection
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5, marginTop: 3 }}>
                        Error Level Analysis exposes digitally altered roll numbers, modified dates of birth, and spliced candidate headshots printed onto legitimate document templates.
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: "#fef2f2", border: "1px solid #fecaca",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#ef4444", flexShrink: 0, marginTop: 2,
                    }}>
                      <ShieldAlert size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0f172a" }}>
                        4. Cross-Center Solver Ring Deduplication
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5, marginTop: 3 }}>
                        Biometric vector hashes are cross-checked across regional exam halls in real-time, preventing the same mercenary test-taker from appearing in multiple sessions or centers.
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom Key Badges */}
              <div style={{
                marginTop: 24, paddingTop: 18, borderTop: "1px solid #f1f5f9",
                display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "#334155" }}>
                  <CheckCircle2 size={15} color="#059669" />
                  <span><strong>7.8s</strong> Gate Clearance</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "#334155" }}>
                  <CheckCircle2 size={15} color="#059669" />
                  <span><strong>100%</strong> Offline Sovereignty</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "#334155" }}>
                  <CheckCircle2 size={15} color="#059669" />
                  <span><strong>SHA-256</strong> Sealed Ledger</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "#334155" }}>
                  <CheckCircle2 size={15} color="#059669" />
                  <span><strong>GeM L1</strong> Catalog Ready</span>
                </div>
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 18 }}>
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

      {/* ── 5.5. High-Stakes Threat Vectors & Defense Matrix ───────── */}
      <div style={{ marginBottom: 68 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            FORENSIC TAXONOMY & DEFENSE COUNTERMEASURES
          </span>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
            4 Critical Threat Vectors & How ShieldScan Defeats Them
          </h2>
          <p style={{ color: "#64748b", maxWidth: 680, margin: "8px auto 0", fontSize: "0.95rem" }}>
            From Photoshop digital retouches to cloned government stamps, generative AI deepfakes, and interstate solver cartels — explore the exact neural algorithms that neutralize each vector.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 20 }}>
          {threatMatrix.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  padding: "26px 22px",
                  borderRadius: "18px",
                  border: `1px solid ${item.borderColor}`,
                  background: "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Top Ambient Glow Pill */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: item.badgeColor,
                }} />

                <div>
                  {/* Category & Status Badge */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: item.bgColor, border: `1px solid ${item.borderColor}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: item.badgeColor,
                    }}>
                      <Icon size={20} />
                    </div>
                    <span style={{
                      fontSize: "0.68rem", fontWeight: 700,
                      padding: "3px 8px", borderRadius: "6px",
                      background: item.bgColor, color: item.badgeColor,
                      border: `1px solid ${item.borderColor}`,
                      letterSpacing: "0.04em",
                    }}>
                      {item.category}
                    </span>
                  </div>

                  {/* Threat Title */}
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: 8, lineHeight: 1.3 }}>
                    {item.title}
                  </h3>

                  {/* Attack Description */}
                  <div style={{
                    padding: "10px 12px", borderRadius: "8px", background: "#f8fafc",
                    border: "1px solid #e2e8f0", fontSize: "0.8rem", color: "#475569",
                    lineHeight: 1.5, marginBottom: 16,
                  }}>
                    <strong style={{ color: "#ef4444" }}>The Attack: </strong>
                    {item.threat}
                  </div>

                  {/* AI Countermeasure */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                      AI COUNTERMEASURE
                    </div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f172a" }}>
                      {item.countermeasure}
                    </div>
                  </div>

                  {/* Technical Mechanism */}
                  <p style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5, margin: "0 0 16px" }}>
                    {item.mechanism}
                  </p>
                </div>

                {/* Bottom Metric & Status Tag */}
                <div style={{
                  borderTop: "1px solid #f1f5f9", paddingTop: 14,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{
                    fontSize: "0.74rem", fontWeight: 800, color: "#059669",
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    <CheckCircle2 size={13} color="#059669" />
                    {item.catchRate}
                  </span>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 700, color: "#475569",
                    fontFamily: "JetBrains Mono, monospace",
                  }}>
                    {item.statusBadge}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>

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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 20 }}>
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

      {/* ── 6.5. 4-Tier Multi-Platform Deployment Modes Grid ───────── */}
      <div style={{ marginBottom: 68 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            MISSION DEPLOYMENT FORM FACTORS
          </span>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
            Deploy ShieldScan Across Any Operational Environment
          </h2>
          <p style={{ color: "#64748b", maxWidth: 680, margin: "8px auto 0", fontSize: "0.95rem" }}>
            From high-throughput airport e-Gates to rugged handheld terminals on mobile highway patrols and sovereign air-gapped server appliances.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 24 }}>
          {deploymentModes.map((mode, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: 0,
                overflow: "hidden",
                borderRadius: "18px",
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "#ffffff",
              }}
            >
              <div>
                {/* Image or Server Illustration */}
                <div style={{ height: 210, overflow: "hidden", position: "relative", background: "#0f172a" }}>
                  {mode.image ? (
                    <img
                      src={mode.image}
                      alt={mode.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{
                      height: "100%", display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      background: "radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)",
                      color: "#ffffff", padding: 20, textAlign: "center",
                    }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: 14, background: "rgba(37, 99, 235, 0.2)",
                        border: "1px solid rgba(59, 130, 246, 0.4)", display: "flex",
                        alignItems: "center", justifyContent: "center", marginBottom: 12, color: "#60a5fa"
                      }}>
                        <Server size={28} />
                      </div>
                      <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "#93c5fd", letterSpacing: "0.08em" }}>
                        1U / 2U RACKMOUNT EDGE NEURAL CLUSTER
                      </div>
                    </div>
                  )}

                  <div style={{
                    position: "absolute", top: 12, left: 12,
                    background: "rgba(15, 23, 42, 0.82)", backdropFilter: "blur(6px)",
                    color: "#ffffff", padding: "4px 10px", borderRadius: "6px",
                    fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.04em",
                  }}>
                    {mode.tier} · {mode.tag}
                  </div>
                </div>

                {/* Body Content */}
                <div style={{ padding: "22px 20px 16px" }}>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
                    {mode.name}
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.5, marginBottom: 16 }}>
                    {mode.desc}
                  </p>

                  {/* Specifications List */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>
                      CORE SPECIFICATIONS:
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {mode.specs.map((spec, sIdx) => (
                        <div key={sIdx} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "#475569" }}>
                          <Check size={13} color="#2563eb" style={{ flexShrink: 0 }} />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Deployment */}
                  <div style={{
                    padding: "10px 12px", borderRadius: "8px", background: "#f8fafc",
                    border: "1px solid #e2e8f0", fontSize: "0.75rem", color: "#334155",
                    lineHeight: 1.4,
                  }}>
                    <strong style={{ color: "#2563eb" }}>Ideal For: </strong>
                    {mode.recommendedFor}
                  </div>
                </div>
              </div>

              {/* Bottom Action Link */}
              <div style={{ padding: "14px 20px", borderTop: "1px solid #f1f5f9", background: "#ffffff" }}>
                <button
                  onClick={() => navigate(mode.actionLink)}
                  style={{
                    width: "100%", padding: "9px", borderRadius: "8px",
                    background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe",
                    fontWeight: 700, fontSize: "0.8rem", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#2563eb";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#eff6ff";
                    e.currentTarget.style.color = "#2563eb";
                  }}
                >
                  {mode.actionText} <ArrowRight size={14} />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ── 6.7. Specialized Tactical Operational Environments ────── */}
      <div style={{ marginBottom: 68 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 14px",
            borderRadius: "9999px",
            background: theme === "traffic" ? "#fffbeb" : theme === "maritime" ? "rgba(6, 182, 212, 0.12)" : "#eff6ff",
            border: `1px solid ${theme === "traffic" ? "#fde68a" : theme === "maritime" ? "#164e63" : "#bfdbfe"}`,
            marginBottom: 10,
          }}>
            <Radio size={14} color={theme === "traffic" ? "#d97706" : theme === "maritime" ? "#06b6d4" : "#2563eb"} />
            <span style={{
              fontSize: "0.76rem",
              fontWeight: 800,
              color: theme === "traffic" ? "#d97706" : theme === "maritime" ? "#06b6d4" : "#2563eb",
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            }}>
              TACTICAL FIELD ENVIRONMENTS · ADAPTIVE HUD
            </span>
          </div>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "var(--text-pure)", marginTop: 4 }}>
            Engineered for Highway Patrol & Maritime Ship Checking
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 720, margin: "8px auto 0", fontSize: "0.95rem" }}>
            Frontline officers face extreme conditions: blinding outdoor sunlight glare during highway spot-checks versus pitch-black night vision preservation when boarding cargo ships at sea. ShieldScan dynamically adapts its UI, contrast thresholds, and optical filters.
          </p>
        </div>

        {/* 3 Tactical Profiles Selector Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 310px), 1fr))",
          gap: 20,
          marginBottom: 28,
        }}>
          {tacticalEnvironments.map((env) => {
            const Icon = env.icon;
            const isSelected = activeEnvTab === env.id;
            const isThemeActive = theme === env.themeKey;

            return (
              <div
                key={env.id}
                onClick={() => setActiveEnvTab(env.id)}
                className="glass-card"
                style={{
                  padding: "22px 20px",
                  borderRadius: "16px",
                  border: isSelected ? `2px solid ${env.accentColor}` : "1px solid var(--border-subtle)",
                  background: isSelected ? env.badgeBg : "var(--bg-surface)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  position: "relative",
                  boxShadow: isSelected ? `0 8px 24px -4px ${env.accentColor}30` : "var(--shadow-hud)",
                }}
              >
                {/* Active Global Indicator Pill */}
                {isThemeActive && (
                  <div style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "3px 9px",
                    borderRadius: "9999px",
                    background: env.accentColor,
                    color: "#ffffff",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                  }}>
                    <Check size={11} strokeWidth={3} />
                    APP THEME ACTIVE
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: isSelected ? env.accentColor : env.badgeBg,
                    color: isSelected ? "#ffffff" : env.accentColor,
                    border: `1px solid ${env.badgeBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon size={22} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 800, color: env.accentColor, letterSpacing: "0.06em" }}>
                      {env.tag}
                    </div>
                    <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-pure)" }}>
                      {env.title}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.45, marginBottom: 16 }}>
                  {env.tagline}
                </p>

                {/* Specs List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.78rem" }}>
                  {env.operationalSpecs.slice(0, 2).map((spec, sIdx) => (
                    <div key={sIdx} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.72rem", textTransform: "uppercase" }}>
                        {spec.label}:
                      </span>
                      <span style={{ color: "var(--text-secondary)" }}>
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Select Tab Indicator */}
                <div style={{
                  marginTop: 18,
                  paddingTop: 12,
                  borderTop: "1px solid var(--border-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                  <span style={{ fontSize: "0.74rem", fontWeight: 700, color: env.accentColor }}>
                    {isSelected ? "● Viewing Live HUD Simulation" : "Click to Preview HUD →"}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTheme(env.themeKey);
                      setActiveEnvTab(env.id);
                      toast.success(`Switched app to ${env.title}!`, {
                        icon: env.themeKey === "traffic" ? "🚦" : env.themeKey === "maritime" ? "⚓" : "🛡️",
                      });
                    }}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      background: isThemeActive ? "var(--bg-surface)" : env.accentColor,
                      color: isThemeActive ? env.accentColor : "#ffffff",
                      border: `1px solid ${env.accentColor}`,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {isThemeActive ? "Active" : "Apply Theme"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Field HUD Simulator Container */}
        {(() => {
          const selectedEnv = tacticalEnvironments.find((e) => e.id === activeEnvTab) || tacticalEnvironments[0];
          const isSelectedTraffic = selectedEnv.id === "traffic";
          const isSelectedMaritime = selectedEnv.id === "maritime";

          return (
            <div
              style={{
                background: isSelectedMaritime ? "#081322" : isSelectedTraffic ? "#fffef5" : "#ffffff",
                border: isSelectedTraffic ? "2px solid #f59e0b" : isSelectedMaritime ? "2px solid #06b6d4" : "1px solid #bfdbfe",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: isSelectedMaritime
                  ? "0 20px 50px -10px rgba(6, 182, 212, 0.25)"
                  : isSelectedTraffic
                  ? "0 20px 50px -10px rgba(217, 119, 6, 0.2)"
                  : "0 20px 50px -10px rgba(37, 99, 235, 0.12)",
                transition: "all 0.3s ease",
              }}
            >
              {/* Simulator HUD Top Bar */}
              <div
                style={{
                  padding: "14px 22px",
                  background: isSelectedMaritime ? "#0c1a2e" : isSelectedTraffic ? "#fef3c7" : "#f8fafc",
                  borderBottom: `1px solid ${isSelectedMaritime ? "#163354" : isSelectedTraffic ? "#fde68a" : "#e2e8f0"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: selectedEnv.accentColor,
                      boxShadow: `0 0 0 3px ${selectedEnv.accentColor}40`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: isSelectedMaritime ? "#e2e8f0" : isSelectedTraffic ? "#000000" : "#1e293b",
                      letterSpacing: "0.04em",
                    }}
                  >
                    HUD SIMULATOR · {selectedEnv.tag}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      fontFamily: "JetBrains Mono, monospace",
                      color: selectedEnv.accentColor,
                      padding: "3px 10px",
                      borderRadius: "6px",
                      background: isSelectedMaritime ? "rgba(6, 182, 212, 0.12)" : isSelectedTraffic ? "#ffffff" : "#eff6ff",
                      border: `1px solid ${isSelectedMaritime ? "#164e63" : isSelectedTraffic ? "#fde68a" : "#bfdbfe"}`,
                    }}
                  >
                    {isSelectedTraffic ? <Sun size={13} /> : isSelectedMaritime ? <Anchor size={13} /> : <Shield size={13} />}
                    <span>{selectedEnv.sampleDoc.luxTelemetry}</span>
                  </div>

                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      color: isSelectedMaritime ? "#38bdf8" : isSelectedTraffic ? "#92400e" : "#2563eb",
                    }}
                  >
                    {selectedEnv.sampleDoc.badge}
                  </span>
                </div>
              </div>

              {/* Simulator Body Content */}
              <div style={{ padding: "26px 24px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                    gap: 22,
                    alignItems: "center",
                  }}
                >
                  {/* Left Column: Simulated Document Card */}
                  <div
                    style={{
                      background: isSelectedMaritime ? "#0e2038" : isSelectedTraffic ? "#ffffff" : "#f8fafc",
                      border: `1.5px solid ${isSelectedMaritime ? "#1e3a5f" : isSelectedTraffic ? "#f59e0b" : "#cbd5e1"}`,
                      borderRadius: "14px",
                      padding: "20px",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          letterSpacing: "0.06em",
                          color: selectedEnv.accentColor,
                          textTransform: "uppercase",
                        }}
                      >
                        {selectedEnv.sampleDoc.type}
                      </span>
                      <span
                        style={{
                          fontSize: "0.66rem",
                          fontWeight: 800,
                          padding: "2px 7px",
                          borderRadius: "4px",
                          background: isSelectedMaritime ? "rgba(16, 185, 129, 0.2)" : "#ecfdf5",
                          color: "#10b981",
                          border: "1px solid #10b981",
                        }}
                      >
                        LIVE SCAN
                      </span>
                    </div>

                    <div style={{ fontSize: "1.15rem", fontWeight: 800, color: isSelectedMaritime ? "#ffffff" : "#000000", marginBottom: 4 }}>
                      {selectedEnv.sampleDoc.holder}
                    </div>

                    <div
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: selectedEnv.accentColor,
                        marginBottom: 16,
                      }}
                    >
                      ID: {selectedEnv.sampleDoc.idNumber}
                    </div>

                    {/* Check list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                      {selectedEnv.sampleDoc.checks.map((chk, cIdx) => (
                        <div
                          key={cIdx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: "0.78rem",
                            color: isSelectedMaritime ? "#94a3b8" : "#334155",
                          }}
                        >
                          <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0 }} />
                          <span style={{ fontWeight: 600 }}>{chk}</span>
                        </div>
                      ))}
                    </div>

                    {/* Status Banner */}
                    <div
                      style={{
                        padding: "10px 12px",
                        borderRadius: "8px",
                        background: isSelectedMaritime ? "rgba(16, 185, 129, 0.15)" : isSelectedTraffic ? "#ecfdf5" : "#ecfdf5",
                        border: "1px solid #a7f3d0",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <ShieldCheck size={18} color="#059669" />
                      <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#059669" }}>
                        {selectedEnv.sampleDoc.status}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Tactical Parameters & Action CTAs */}
                  <div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        color: selectedEnv.accentColor,
                        textTransform: "uppercase",
                        marginBottom: 6,
                      }}
                    >
                      OPERATIONAL ADVANTAGE
                    </div>
                    <h3
                      style={{
                        fontSize: "1.35rem",
                        fontWeight: 800,
                        color: isSelectedMaritime ? "#ffffff" : isSelectedTraffic ? "#000000" : "#0f172a",
                        marginBottom: 10,
                        lineHeight: 1.3,
                      }}
                    >
                      {isSelectedTraffic
                        ? "Anti-Glare Optics & 5-Second Traffic Stop Verification"
                        : isSelectedMaritime
                        ? "Dark Bridge Scotopic Preservation & Seafarer CDC Vetting"
                        : "Sovereign e-Gate Biometric Verification & Tamper Ledgers"}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.86rem",
                        color: isSelectedMaritime ? "#94a3b8" : "#475569",
                        lineHeight: 1.5,
                        marginBottom: 20,
                      }}
                    >
                      {selectedEnv.operationalSpecs[2].value}. {selectedEnv.operationalSpecs[3].value}.
                    </p>

                    {/* Operational Metric Badges */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
                      <div
                        style={{
                          padding: "10px 12px",
                          borderRadius: "8px",
                          background: isSelectedMaritime ? "#0c1a2e" : isSelectedTraffic ? "#fef3c7" : "#f1f5f9",
                          border: `1px solid ${isSelectedMaritime ? "#163354" : isSelectedTraffic ? "#fde68a" : "#e2e8f0"}`,
                        }}
                      >
                        <div style={{ fontSize: "0.68rem", fontWeight: 700, color: selectedEnv.accentColor, textTransform: "uppercase" }}>
                          TOUCH TARGETS
                        </div>
                        <div style={{ fontSize: "0.98rem", fontWeight: 800, color: isSelectedMaritime ? "#ffffff" : "#000000" }}>
                          {isSelectedTraffic ? "+35% Glove Ready" : isSelectedMaritime ? "Ergonomic Night" : "Standard Interface"}
                        </div>
                      </div>

                      <div
                        style={{
                          padding: "10px 12px",
                          borderRadius: "8px",
                          background: isSelectedMaritime ? "#0c1a2e" : isSelectedTraffic ? "#fef3c7" : "#f1f5f9",
                          border: `1px solid ${isSelectedMaritime ? "#163354" : isSelectedTraffic ? "#fde68a" : "#e2e8f0"}`,
                        }}
                      >
                        <div style={{ fontSize: "0.68rem", fontWeight: 700, color: selectedEnv.accentColor, textTransform: "uppercase" }}>
                          OFFLINE RELIABILITY
                        </div>
                        <div style={{ fontSize: "0.98rem", fontWeight: 800, color: isSelectedMaritime ? "#ffffff" : "#000000" }}>
                          100% On-Device Neural
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setTheme(selectedEnv.themeKey);
                          toast.success(`Active theme switched to ${selectedEnv.title}!`, {
                            icon: selectedEnv.themeKey === "traffic" ? "🚦" : selectedEnv.themeKey === "maritime" ? "⚓" : "🛡️",
                          });
                        }}
                        style={{
                          flex: "1 1 200px",
                          padding: "12px 18px",
                          borderRadius: "10px",
                          background: selectedEnv.accentColor,
                          color: "#ffffff",
                          border: "none",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          boxShadow: `0 4px 14px ${selectedEnv.accentColor}40`,
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Check size={16} />
                        {theme === selectedEnv.themeKey ? "Theme Active Globally" : `Activate ${selectedEnv.shortName} Theme`}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTheme(selectedEnv.themeKey);
                          navigate("/scan");
                        }}
                        style={{
                          padding: "12px 18px",
                          borderRadius: "10px",
                          background: "transparent",
                          color: selectedEnv.accentColor,
                          border: `1.5px solid ${selectedEnv.accentColor}`,
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          transition: "all 0.2s ease",
                        }}
                      >
                        <span>Scan In This Mode</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
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
                <th style={{ padding: "16px 20px", color: "#059669", fontWeight: 700, width: "38%" }}>SHIELDSCAN DEFENSE PLATFORM</th>
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: 16 }}>
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

      {/* ── 8.5. Regulatory Compliance & Standards Framework ───────── */}
      <div style={{ marginBottom: 68 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            STATUTORY & INTEROPERABILITY FRAMEWORK
          </span>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
            Regulatory Compliance & Global Standards
          </h2>
          <p style={{ color: "#64748b", maxWidth: 680, margin: "8px auto 0", fontSize: "0.95rem" }}>
            ShieldScan is engineered in strict compliance with international civil aviation conventions, national identity algorithms, and sovereign data privacy mandates.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 18 }}>
          {complianceFrameworks.map((item, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: "24px 22px",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    fontFamily: "JetBrains Mono, monospace",
                    color: item.color,
                    padding: "3px 10px",
                    borderRadius: "6px",
                    background: "#f8fafc",
                    border: `1px solid ${item.color}30`,
                  }}>
                    {item.code}
                  </span>
                  <span style={{
                    fontSize: "0.66rem",
                    fontWeight: 700,
                    color: "#64748b",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    background: "#f1f5f9",
                  }}>
                    {item.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
                  {item.title}
                </h3>
                <div style={{ fontSize: "0.76rem", fontWeight: 600, color: item.color, marginBottom: 12 }}>
                  Scope: {item.scope}
                </div>
                <p style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>
                  {item.details}
                </p>
              </div>

              <div style={{
                marginTop: 16, paddingTop: 12, borderTop: "1px solid #f1f5f9",
                display: "flex", alignItems: "center", gap: 6, fontSize: "0.74rem",
                fontWeight: 700, color: "#059669",
              }}>
                <CheckCircle2 size={14} color="#059669" />
                <span>Standard Formally Certified & Validated</span>
              </div>
            </div>
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

