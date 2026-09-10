import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, ShoppingBag, CheckCircle2, Zap, ArrowRight,
  Filter, Sparkles, Building2, GraduationCap, Plane,
  Truck, HardDrive, Phone, Mail, Award, Clock,
  FileCheck, ChevronRight, X, Calculator, HelpCircle
} from "lucide-react";
import toast from "react-hot-toast";

const products = [
  {
    id: "exam-guard",
    name: "ShieldScan ExamGuard Kiosk v3",
    subtitle: "Turnkey Anti-Impersonation Examination Entrance Station",
    category: "exam",
    badge: "BESTSELLER · EXAM BOARDS",
    badgeColor: "#059669",
    image: "/images/exam_kiosk.jpg",
    priceNumber: 84999,
    priceDisplay: "₹84,999",
    rentalDisplay: "or ₹4,500 / exam day lease",
    targetSectors: "NTA, UPSC, JEE/NEET Centers, State PSCs, Universities",
    gemId: "GEM-SEC-2026-EXM",
    specs: [
      "Sub-2.5s Candidate Face-Match vs Hall Ticket photo",
      "High-speed QR / Barcode reader for instant Admit Card parse",
      "Anti-Proxy neural liveness check (blocks 2D photos & phone screens)",
      "12-hour hot-swappable battery backup for rural test centers",
      "Wheeled flight case included for rapid deployment between venues",
    ],
    highlight: "Eliminates solver gangs and impersonation in competitive exams."
  },
  {
    id: "cr5400-cradle",
    name: "ShieldScan CR-5400 Multi-Spectral Reader",
    subtitle: "Enterprise Optical & RFID Biometric Document Cradle",
    category: "corporate",
    badge: "GOVTECH BENCHMARK",
    badgeColor: "#2563eb",
    image: "/images/passport_scanner.jpg",
    priceNumber: 129000,
    priceDisplay: "₹1,29,000",
    rentalDisplay: "or ₹7,200 / month lease",
    targetSectors: "Corporate HQs, Banks, Embassy Desks, Visitor Check-ins",
    gemId: "GEM-SEC-2026-CR54",
    specs: [
      "Multi-spectral illumination: White, UV 365nm & IR 850nm B900",
      "Contactless RFID antenna (ISO 14443 Type A/B smart chips)",
      "500 DPI anti-scratch optical glass bed with ambient glare suppression",
      "Direct USB 3.2 Gen 2 plug-and-play to any Windows / Linux workstation",
      "ICAO 9303 TD1/TD2/TD3 automated MRZ checksum calculation",
    ],
    highlight: "Standard equipment for high-assurance corporate KYC & visitor security."
  },
  {
    id: "aero-gate",
    name: "ShieldGate Aero-100 Turnstile Pod",
    subtitle: "Automated Biometric Transit & e-Gate Swing Barrier",
    category: "transit",
    badge: "HIGH-CAPACITY TRANSIT",
    badgeColor: "#7c3aed",
    image: "/images/hero_banner.jpg",
    priceNumber: 485000,
    priceDisplay: "₹4,85,000",
    rentalDisplay: "Turnkey Installation Included",
    targetSectors: "Airports, Metro Rail, Convention Centers, Stadiums",
    gemId: "GEM-SEC-2026-GATE",
    specs: [
      "Motorized tempered glass swing barrier gates with safety sensors",
      "60 FPS ArcFace 1:1 biometric facial comparison unit",
      "Integrated passport / barcode boarding pass scanner cradle",
      "Fire alarm emergency auto-open override failsafe mechanism",
      "Throughput of up to 45 cleared passengers per minute",
    ],
    highlight: "Eliminates queuing bottlenecks with self-service biometric boarding."
  },
  {
    id: "tactical-go",
    name: "ShieldScan Tactical Go Rugged Patrol",
    subtitle: "MIL-SPEC Handheld Biometric Scanner for Field Patrols",
    category: "field",
    badge: "MIL-STD-810G CERTIFIED",
    badgeColor: "#d97706",
    image: "/images/handheld_scanner.jpg",
    priceNumber: 46500,
    priceDisplay: "₹46,500",
    rentalDisplay: "or ₹3,000 / week field lease",
    targetSectors: "Flying Squads, Police Patrols, Highway RTO, Port Docks",
    gemId: "GEM-SEC-2026-TACT",
    specs: [
      "IP67 drop-proof rubberized casing (tested to withstand 1.8m concrete drops)",
      "Integrated FBI PIV certified optical fingerprint sensor",
      "Sunlight-readable 6.0-inch Gorilla Glass multi-touch screen",
      "100% offline air-gap database caching (stores 500,000 records)",
      "Dual hot-swappable 5000 mAh batteries for 24-hour shift endurance",
    ],
    highlight: "Essential tool for mobile flying squads during exams and border sweeps."
  },
  {
    id: "edge-server",
    name: "ShieldScan Sovereign Edge Rack Server",
    subtitle: "1U On-Premise Air-Gap Neural Inference Appliance",
    category: "corporate",
    badge: "DEFENSE APPLIANCE",
    badgeColor: "#0284c7",
    image: "/images/biometric_face.jpg",
    priceNumber: 245000,
    priceDisplay: "₹2,45,000",
    rentalDisplay: "Includes 50 Kiosk Licenses",
    targetSectors: "Exam Board HQs, Enterprise Server Rooms, Armed Forces",
    gemId: "GEM-SEC-2026-RACK",
    specs: [
      "Pre-loaded with quantized offline EasyOCR, ArcFace, & ELA engines",
      "Local SHA-256 blockchain audit node with court-admissible certificates",
      "Ephemeral RAM-only zero-knowledge biometric matching pipeline",
      "Redundant dual hot-plug power supplies and 10 GbE SFP+ ports",
      "Air-gap sovereign operation with zero external internet dependency",
    ],
    highlight: "Central brain for multi-kiosk campus or multi-venue exam monitoring."
  },
];

const categoryTabs = [
  { id: "all", label: "All Solutions (5)", icon: Shield },
  { id: "exam", label: "🎓 Exam & Education (Anti-Proxy)", icon: GraduationCap },
  { id: "corporate", label: "🏢 Corporate & KYC Access", icon: Building2 },
  { id: "transit", label: "✈️ Airport & Transit e-Gates", icon: Plane },
  { id: "field", label: "🚔 Tactical & Field Patrols", icon: Truck },
];

export default function StorePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [units, setUnits] = useState(1);
  const [procureType, setProcureType] = useState("purchase");
  const [formData, setFormData] = useState({
    name: "",
    org: "",
    orgType: "Exam Board / University",
    email: "",
    phone: "",
    timeline: "Immediate (within 15 days)",
  });
  const [orderSuccess, setOrderSuccess] = useState(false);

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter(p => p.category === activeCategory);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setUnits(1);
    setProcureType("purchase");
    setOrderSuccess(false);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setOrderSuccess(false);
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.org) {
      toast.error("Please fill in all contact and organization fields.");
      return;
    }
    setOrderSuccess(true);
    toast.success(`Requisition request submitted for ${units}x ${selectedProduct.name}!`);
  };

  const calculateEstimate = () => {
    if (!selectedProduct) return 0;
    if (procureType === "lease") {
      return (units * 4500).toLocaleString("en-IN");
    }
    const total = units * selectedProduct.priceNumber;
    const discount = units >= 5 ? 0.10 : units >= 3 ? 0.05 : 0;
    return Math.round(total * (1 - discount)).toLocaleString("en-IN");
  };

  return (
    <div className="page-container" style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 24px 80px" }}>
      
      {/* ── 1. Store Header & GovTech Trust Banner ──────────────── */}
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "6px 18px", borderRadius: "999px",
          background: "#eff6ff", border: "1px solid #bfdbfe",
          fontSize: "0.78rem", fontWeight: 700, color: "#2563eb",
          letterSpacing: "0.04em", textTransform: "uppercase",
          marginBottom: 16,
        }}>
          <ShoppingBag size={15} color="#2563eb" />
          HARDWARE & TURNKEY SYSTEMS PROCUREMENT PORTAL
        </div>

        <h1 style={{
          fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
          fontWeight: 800, lineHeight: 1.18,
          letterSpacing: "-0.03em",
          color: "#0f172a",
          marginBottom: 16,
        }}>
          Turnkey Identity Verification<br />Hardware & Kiosks
        </h1>

        <p style={{
          fontSize: "1.1rem", color: "#475569",
          maxWidth: 680, margin: "0 auto 24px",
          lineHeight: 1.6,
        }}>
          Deploy defense-grade anti-proxy examination kiosks, multi-spectral document cradles, and automated transit turnstiles across universities, test centers, corporate buildings, and checkpoints.
        </p>

        {/* Trust Badges Strip */}
        <div style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12,
          fontSize: "0.78rem", fontWeight: 600, color: "#334155"
        }}>
          <span style={{ padding: "6px 14px", borderRadius: 8, background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#059669", display: "flex", alignItems: "center", gap: 6 }}>
            <Award size={14} color="#059669" /> GeM Portal Registered
          </span>
          <span style={{ padding: "6px 14px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 6 }}>
            <CheckCircle2 size={14} color="#2563eb" /> Make in India Sovereign Tech
          </span>
          <span style={{ padding: "6px 14px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 6 }}>
            <Clock size={14} color="#2563eb" /> 3-Year On-Site AMC & SLA
          </span>
          <span style={{ padding: "6px 14px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 6 }}>
            <HardDrive size={14} color="#7c3aed" /> 100% Offline Air-Gap Certified
          </span>
        </div>
      </div>

      {/* ── 2. Category Filter Tabs ─────────────────────────────── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        justifyContent: "center",
        marginBottom: 40,
      }}>
        {categoryTabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: "12px",
                fontSize: "0.86rem",
                fontWeight: isActive ? 700 : 600,
                cursor: "pointer",
                border: isActive ? "1.5px solid #2563eb" : "1px solid #e2e8f0",
                background: isActive ? "#eff6ff" : "#ffffff",
                color: isActive ? "#2563eb" : "#475569",
                boxShadow: isActive ? "0 4px 12px rgba(37, 99, 235, 0.12)" : "0 1px 3px rgba(0,0,0,0.03)",
                transition: "all 0.18s ease",
              }}
            >
              <tab.icon size={15} color={isActive ? "#2563eb" : "#64748b"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 3. Product Catalog Grid ──────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
        gap: 28,
        marginBottom: 68,
      }}>
        {filteredProducts.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              boxShadow: "0 6px 24px -4px rgba(0, 0, 0, 0.05)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            <div>
              {/* Product Photo Viewport */}
              <div style={{
                height: 240,
                overflow: "hidden",
                position: "relative",
                background: "#f1f5f9",
              }}>
                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
                {/* Badge Tag */}
                <div style={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  background: "rgba(15, 23, 42, 0.82)",
                  backdropFilter: "blur(6px)",
                  color: "#ffffff",
                  padding: "4px 12px",
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.badgeColor }} />
                  {p.badge}
                </div>

                {/* GeM Catalog ID */}
                <div style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  background: "#ffffff",
                  color: "#2563eb",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  fontFamily: "JetBrains Mono, monospace",
                  border: "1px solid #bfdbfe",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                }}>
                  {p.gemId}
                </div>
              </div>

              {/* Product Info */}
              <div style={{ padding: "26px 24px 20px" }}>
                <div style={{
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  color: "#2563eb",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}>
                  TARGET: {p.targetSectors}
                </div>

                <h3 style={{
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: 6,
                  lineHeight: 1.3,
                }}>
                  {p.name}
                </h3>

                <p style={{
                  fontSize: "0.86rem",
                  color: "#64748b",
                  marginBottom: 18,
                  lineHeight: 1.5,
                }}>
                  {p.subtitle}
                </p>

                {/* Highlight Quote Pill */}
                <div style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  fontSize: "0.82rem",
                  color: "#334155",
                  fontWeight: 600,
                  marginBottom: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <Sparkles size={15} color="#2563eb" style={{ flexShrink: 0 }} />
                  <span>{p.highlight}</span>
                </div>

                {/* Technical Specifications */}
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 20 }}>
                  {p.specs.map((spec, sIdx) => (
                    <div key={sIdx} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: "0.82rem", color: "#475569" }}>
                      <CheckCircle2 size={15} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Action Footer */}
            <div style={{
              padding: "18px 24px 24px",
              borderTop: "1px solid #f1f5f9",
              background: "#fafbfd",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 14,
            }}>
              <div>
                <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                  {p.priceDisplay}
                </div>
                <div style={{ fontSize: "0.74rem", color: "#64748b", fontWeight: 600 }}>
                  {p.rentalDisplay}
                </div>
              </div>

              <button
                onClick={() => handleOpenModal(p)}
                style={{
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  color: "#ffffff",
                  border: "none",
                  padding: "11px 22px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 3px 10px rgba(37, 99, 235, 0.3)",
                }}
              >
                <span>Request Quote / Order</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── 4. Government & Institutional Procurement Guarantee ─── */}
      <div style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)",
        borderRadius: "20px",
        border: "1px solid #bfdbfe",
        padding: "36px 30px",
        marginBottom: 60,
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            PROCUREMENT & COMPLIANCE ASSURANCE
          </span>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
            Direct GeM Contracting & SLA Guarantees
          </h2>
          <p style={{ color: "#64748b", maxWidth: 640, margin: "6px auto 0", fontSize: "0.92rem" }}>
            ShieldScan provides end-to-end turnkey deployment, operator training, and high-availability hardware backup.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
          gap: 18,
        }}>
          {[
            {
              title: "GeM Portal Direct Purchase",
              desc: "Approved under Government e-Marketplace (GeM) categories for security kiosks and biometric readers.",
              icon: FileCheck,
            },
            {
              title: "24/7 Replacement SLA",
              desc: "Hot-standby replacement units delivered within 4 hours in metro areas during critical examination windows.",
              icon: Clock,
            },
            {
              title: "On-Site Operator Training",
              desc: "Comprehensive onboarding for exam invigilators, police personnel, and corporate gate security guards.",
              icon: GraduationCap,
            },
            {
              title: "Custom Hardware Branded Pods",
              desc: "Kiosks and e-Gate acrylic panels customized with official state, examination board, or university crests.",
              icon: Award,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "#ffffff",
                padding: "20px",
                borderRadius: "14px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "#eff6ff", border: "1px solid #bfdbfe",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#2563eb", marginBottom: 12,
              }}>
                <item.icon size={20} />
              </div>
              <h4 style={{ fontSize: "0.98rem", fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                {item.title}
              </h4>
              <p style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Interactive Modal: Request Quote & Order ────────── */}
      <AnimatePresence>
        {selectedProduct && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                maxWidth: "680px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                border: "1px solid #e2e8f0",
                position: "relative",
              }}
            >
              {/* Modal Header */}
              <div style={{
                padding: "20px 24px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f8fafc",
                position: "sticky",
                top: 0,
                zIndex: 10,
              }}>
                <div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    PROCUREMENT REQUISITION & QUOTE
                  </span>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: "2px 0 0" }}>
                    {selectedProduct.name}
                  </h3>
                </div>
                <button
                  onClick={handleCloseModal}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: 6, borderRadius: 8, color: "#64748b",
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: "24px" }}>
                {orderSuccess ? (
                  /* Success Feedback */
                  <div style={{ textAlign: "center", padding: "30px 10px" }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: "50%",
                      background: "#ecfdf5", border: "2px solid #a7f3d0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 16px", color: "#059669"
                    }}>
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
                      Requisition Submitted Successfully!
                    </h3>
                    <p style={{ color: "#64748b", maxWidth: 460, margin: "0 auto 20px", fontSize: "0.92rem", lineHeight: 1.6 }}>
                      Thank you, <strong>{formData.name}</strong>. Requisition ID <strong>SS-REQ-2026-{Math.floor(1000 + Math.random() * 9000)}</strong> has been generated for <strong>{units} units</strong> of {selectedProduct.name}.
                    </p>
                    <div style={{
                      padding: "16px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0",
                      maxWidth: 420, margin: "0 auto 24px", textAlign: "left", fontSize: "0.85rem",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ color: "#64748b" }}>Organization:</span>
                        <span style={{ fontWeight: 700, color: "#0f172a" }}>{formData.org}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ color: "#64748b" }}>Procurement Mode:</span>
                        <span style={{ fontWeight: 700, color: "#0f172a", textTransform: "capitalize" }}>{procureType}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b" }}>Estimated Allocation:</span>
                        <span style={{ fontWeight: 700, color: "#2563eb" }}>₹{calculateEstimate()}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className="btn-primary"
                      style={{ padding: "11px 32px", fontSize: "0.9rem" }}
                    >
                      Done & Return to Catalog
                    </button>
                  </div>
                ) : (
                  /* Form */
                  <form onSubmit={handleOrderSubmit}>
                    {/* Procurement Mode Selector */}
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: 8 }}>
                        PROCUREMENT MODEL
                      </label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <button
                          type="button"
                          onClick={() => setProcureType("purchase")}
                          style={{
                            padding: "10px", borderRadius: "10px",
                            border: procureType === "purchase" ? "1.5px solid #2563eb" : "1px solid #e2e8f0",
                            background: procureType === "purchase" ? "#eff6ff" : "#ffffff",
                            color: procureType === "purchase" ? "#2563eb" : "#475569",
                            fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
                          }}
                        >
                          Outright Purchase (GeM / Direct)
                        </button>
                        <button
                          type="button"
                          onClick={() => setProcureType("lease")}
                          style={{
                            padding: "10px", borderRadius: "10px",
                            border: procureType === "lease" ? "1.5px solid #2563eb" : "1px solid #e2e8f0",
                            background: procureType === "lease" ? "#eff6ff" : "#ffffff",
                            color: procureType === "lease" ? "#2563eb" : "#475569",
                            fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
                          }}
                        >
                          Exam Event Rental / Lease
                        </button>
                      </div>
                    </div>

                    {/* Unit Quantity Selector & Estimate */}
                    <div style={{
                      padding: "16px", borderRadius: "12px", background: "#f8fafc",
                      border: "1px solid #e2e8f0", marginBottom: 20,
                      display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14
                    }}>
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b" }}>QUANTITY NEEDED</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                          <button
                            type="button"
                            onClick={() => setUnits(Math.max(1, units - 1))}
                            style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #cbd5e1", background: "#ffffff", fontWeight: 800, cursor: "pointer" }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", width: 28, textAlign: "center" }}>
                            {units}
                          </span>
                          <button
                            type="button"
                            onClick={() => setUnits(units + 1)}
                            style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #cbd5e1", background: "#ffffff", fontWeight: 800, cursor: "pointer" }}
                          >
                            +
                          </button>
                          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>units</span>
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "#64748b" }}>ESTIMATED ALLOCATION</div>
                        <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#2563eb" }}>
                          ₹{calculateEstimate()}
                        </div>
                        {units >= 3 && procureType === "purchase" && (
                          <span style={{ fontSize: "0.7rem", color: "#059669", fontWeight: 700 }}>
                            {units >= 5 ? "10% Volume Discount Applied" : "5% Institutional Discount"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Form Inputs Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                          OFFICER / CONTACT NAME *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. A. K. Sharma"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.88rem" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                          ORGANIZATION / EXAM BOARD *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. State Examination Council"
                          value={formData.org}
                          onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.88rem" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                          OFFICIAL EMAIL *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="procurement@board.gov.in"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.88rem" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                          PHONE / WHATSAPP NUMBER *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.88rem" }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                        DEPLOYMENT TIMELINE
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.88rem", background: "#ffffff" }}
                      >
                        <option value="Urgent (Exam within 7 days)">Urgent (Exam within 7 days)</option>
                        <option value="Immediate (within 15 days)">Immediate (within 15 days)</option>
                        <option value="Upcoming Academic Session (30-60 days)">Upcoming Academic Session (30-60 days)</option>
                        <option value="FY Budget Planning">FY Budget Planning</option>
                      </select>
                    </div>

                    {/* Submit Buttons */}
                    <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="btn-secondary"
                        style={{ padding: "11px 20px" }}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="btn-primary"
                        style={{ padding: "11px 28px", gap: 8 }}
                      >
                        <span>Submit Formal Requisition</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
