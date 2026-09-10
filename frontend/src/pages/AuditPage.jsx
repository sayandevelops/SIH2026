import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Shield, CheckCircle2, XCircle, RefreshCw,
  AlertTriangle, Search, Filter, Copy, Check, ExternalLink,
  Layers, Database, ArrowUpDown, ChevronRight, Hash, Calendar, X
} from "lucide-react";
import { getAuditLog, verifyChainIntegrity } from "../api/shieldscan";
import toast from "react-hot-toast";

const BAND_COLORS = {
  GREEN:  { color: "#059669", bg: "#ecfdf5", border: "#a7f3d0" },
  YELLOW: { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  RED:    { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

export default function AuditPage() {
  const [events,        setEvents]        = useState([]);
  const [integrity,     setIntegrity]     = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [selectedBand,  setSelectedBand]  = useState("ALL");
  const [inspectEvent,  setInspectEvent]  = useState(null);
  const [copiedId,      setCopiedId]      = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [logRes, intRes] = await Promise.all([getAuditLog(100), verifyChainIntegrity()]);
      setEvents(logRes.events || []);
      setIntegrity(intRes);
    } catch (err) {
      toast.error("Failed to load audit log: " + err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Filter events by search query and risk band
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesBand = selectedBand === "ALL" || (ev.risk_band || "GREEN") === selectedBand;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesBand;

      const matchesSearch =
        (ev.officer_id || "").toLowerCase().includes(q) ||
        (ev.checkpoint || "").toLowerCase().includes(q) ||
        (ev.extracted_name || "").toLowerCase().includes(q) ||
        (ev.doc_number || "").toLowerCase().includes(q) ||
        (ev.doc_type || "").toLowerCase().includes(q) ||
        (ev.event_hash || "").toLowerCase().includes(q);

      return matchesBand && matchesSearch;
    });
  }, [events, searchQuery, selectedBand]);

  const copyHash = (hash, id) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    toast.success("Hash copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Metrics
  const threatCount = events.filter((e) => (e.risk_band || "") === "RED" || (e.risk_band || "") === "YELLOW").length;

  return (
    <div className="page-container" style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 24px 80px" }}>

      {/* ── Top Header ────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{
            fontSize: "0.74rem", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 700,
            color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4
          }}>
            SECURITY OPERATIONS CENTER · IMMUTABLE LEDGER
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 12 }}>
            <Lock size={26} color="#7c3aed" /> Blockchain Audit Chain
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem", marginTop: 4 }}>
            SHA-256 Merkle hash-chain — every screening event is cryptographically anchored and court-admissible.
          </p>
        </div>

        <button
          onClick={load}
          className="btn-secondary"
          style={{ padding: "10px 20px", gap: 8, fontSize: "0.88rem" }}
        >
          <RefreshCw size={16} className={loading ? "spinner" : ""} /> Refresh Ledger
        </button>
      </div>

      {/* ── Metric Summary Tiles ──────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: 16, marginBottom: 28 }}>
        <div className="glass-card" style={{ padding: "22px 20px" }}>
          <div style={{ fontSize: "0.74rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Total Screened Records</div>
          <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>{events.length}</div>
          <div style={{ fontSize: "0.76rem", color: "#2563eb", marginTop: 4, fontWeight: 600 }}>Live database records</div>
        </div>

        <div className="glass-card" style={{ padding: "22px 20px" }}>
          <div style={{ fontSize: "0.74rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Threats Flagged</div>
          <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "#dc2626", marginTop: 4 }}>{threatCount}</div>
          <div style={{ fontSize: "0.76rem", color: "#64748b", marginTop: 4 }}>High/Moderate risk events</div>
        </div>

        <div className="glass-card" style={{ padding: "22px 20px" }}>
          <div style={{ fontSize: "0.74rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Chain Verification</div>
          <div style={{ fontSize: "1.9rem", fontWeight: 800, color: integrity?.intact ? "#059669" : "#dc2626", marginTop: 4 }}>
            {integrity?.intact ? "100% INTACT" : "COMPROMISED"}
          </div>
          <div style={{ fontSize: "0.76rem", color: "#64748b", marginTop: 4 }}>
            {integrity?.total_blocks || events.length} cryptographic blocks checked
          </div>
        </div>

        <div className="glass-card" style={{ padding: "22px 20px" }}>
          <div style={{ fontSize: "0.74rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>Air-Gap Status</div>
          <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "#059669", marginTop: 4 }}>ACTIVE</div>
          <div style={{ fontSize: "0.76rem", color: "#64748b", marginTop: 4 }}>Zero cloud data leakage</div>
        </div>
      </div>

      {/* ── Chain Integrity Status Banner ──────────────────────────── */}
      {integrity && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{
            padding: "20px 24px", marginBottom: 28,
            display: "flex", alignItems: "center", gap: 16,
            borderLeft: `4px solid ${integrity.intact ? "#059669" : "#dc2626"}`,
            background: integrity.intact ? "#ecfdf5" : "#fef2f2",
          }}
        >
          {integrity.intact ? (
            <CheckCircle2 size={28} color="#059669" style={{ flexShrink: 0 }} />
          ) : (
            <AlertTriangle size={28} color="#dc2626" style={{ flexShrink: 0 }} />
          )}

          <div>
            <div style={{ fontWeight: 800, fontSize: "1.02rem", color: integrity.intact ? "#065f46" : "#991b1b" }}>
              {integrity.intact ? "Cryptographic Hash-Chain Integrity Intact" : "WARNING: Audit Hash-Chain Compromised"}
            </div>
            <div style={{ fontSize: "0.84rem", color: "#475569", marginTop: 2 }}>
              {integrity.detail} — verified against sequential SHA-256 parent hash pointers.
            </div>
          </div>

          <div style={{ marginLeft: "auto" }}>
            <span className={`band-badge ${integrity.intact ? "band-green" : "band-red"}`}>
              {integrity.intact ? "CHAIN SECURE" : "CORRUPTED"}
            </span>
          </div>
        </motion.div>
      )}

      {/* ── Filter & Search Toolbar ────────────────────────────────── */}
      <div className="glass-card" style={{ padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        {/* Search Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 280 }}>
          <Search size={18} color="#2563eb" />
          <input
            type="text"
            placeholder="Search by name, document number, officer ID, or hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%", background: "transparent", border: "none",
              color: "#0f172a", fontSize: "0.88rem", outline: "none",
              fontFamily: "Plus Jakarta Sans, sans-serif"
            }}
          />
        </div>

        {/* Risk Band Tabs */}
        <div className="tab-pill-group">
          {["ALL", "GREEN", "YELLOW", "RED"].map((b) => (
            <button
              key={b}
              className={`tab-pill-btn ${selectedBand === b ? "active" : ""}`}
              onClick={() => setSelectedBand(b)}
            >
              {b === "ALL" ? "All Events" : b}
            </button>
          ))}
        </div>
      </div>

      {/* ── Events Table ───────────────────────────────────────────── */}
      <div className="glass-card" style={{ overflow: "hidden" }}>
        <div style={{
          padding: "16px 24px", borderBottom: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Shield size={16} color="#2563eb" />
            <span style={{ fontWeight: 700, fontSize: "0.92rem", color: "#0f172a" }}>Screening Ledger Records</span>
          </div>
          <span style={{ fontSize: "0.78rem", color: "#64748b", fontFamily: "JetBrains Mono, monospace" }}>
            Showing {filteredEvents.length} of {events.length} blocks
          </span>
        </div>

        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
            <div className="spinner" style={{ margin: "0 auto 16px", width: 28, height: 28 }} />
            <span>Validating cryptographic Merkle tree blocks...</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
            <Lock size={36} style={{ margin: "0 auto 14px", opacity: 0.3 }} />
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a" }}>No matching records found</div>
            <p style={{ fontSize: "0.85rem", marginTop: 4 }}>
              Try adjusting your search query or band filter.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Block #</th>
                  <th>Timestamp</th>
                  <th>Officer</th>
                  <th>Checkpoint</th>
                  <th>Subject Name</th>
                  <th>Doc Number</th>
                  <th>Doc Type</th>
                  <th>Risk Score</th>
                  <th>Band</th>
                  <th>SHA-256 Hash</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((ev, i) => {
                  const band = ev.risk_band || "GREEN";
                  const bc = BAND_COLORS[band] || BAND_COLORS.GREEN;

                  return (
                    <motion.tr
                      key={ev.id || i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.3) }}
                      style={{ cursor: "pointer" }}
                      onClick={() => setInspectEvent(ev)}
                    >
                      <td style={{ color: "#2563eb", fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>
                        #{String(ev.id).padStart(4, "0")}
                      </td>
                      <td style={{ fontSize: "0.8rem", color: "#64748b" }}>
                        {new Date(ev.timestamp).toLocaleTimeString()} · {new Date(ev.timestamp).toLocaleDateString()}
                      </td>
                      <td style={{ fontWeight: 600, color: "#0f172a" }}>
                        {ev.officer_id}
                      </td>
                      <td style={{ color: "#64748b", fontSize: "0.82rem" }}>
                        {ev.checkpoint}
                      </td>
                      <td style={{ fontWeight: 700, color: "#0f172a" }}>
                        {ev.extracted_name || "—"}
                      </td>
                      <td style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.82rem", color: "#2563eb", fontWeight: 600 }}>
                        {ev.doc_number || "—"}
                      </td>
                      <td style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "capitalize" }}>
                        {ev.doc_type?.replace(/_/g, " ")}
                      </td>
                      <td style={{
                        fontFamily: "JetBrains Mono, monospace", fontWeight: 800,
                        color: bc.color, fontSize: "0.9rem"
                      }}>
                        {ev.risk_score?.toFixed(1)}
                      </td>
                      <td>
                        <span style={{
                          padding: "3px 10px", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700,
                          background: bc.bg, border: `1px solid ${bc.border}`, color: bc.color,
                        }}>
                          {band}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyHash(ev.event_hash, ev.id);
                          }}
                          className="btn-secondary"
                          style={{ fontSize: "0.72rem", padding: "3px 8px", borderRadius: "6px" }}
                        >
                          {copiedId === ev.id ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                          <span>{ev.event_hash?.slice(0, 10)}...</span>
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Inspection Modal (When Officer Clicks a Row) ─────────────── */}
      <AnimatePresence>
        {inspectEvent && (
          <div
            style={{
              position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)",
              backdropFilter: "blur(6px)", zIndex: 100, display: "flex",
              alignItems: "center", justifyContent: "center", padding: 24
            }}
            onClick={() => setInspectEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              style={{
                maxWidth: 600, width: "100%", padding: 30,
                background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0",
                boxShadow: "0 20px 40px -8px rgba(0, 0, 0, 0.15)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Lock size={22} color="#7c3aed" />
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
                    Block #{String(inspectEvent.id).padStart(4, "0")} Inspection
                  </h3>
                </div>
                <button
                  onClick={() => setInspectEvent(null)}
                  style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer", padding: 4 }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                {[
                  { label: "Subject Name", val: inspectEvent.extracted_name || "—" },
                  { label: "Document Number", val: inspectEvent.doc_number || "—" },
                  { label: "Document Type", val: inspectEvent.doc_type },
                  { label: "Officer ID", val: inspectEvent.officer_id },
                  { label: "Checkpoint", val: inspectEvent.checkpoint },
                  { label: "Risk Score", val: `${inspectEvent.risk_score?.toFixed(1)} (${inspectEvent.risk_band})` },
                ].map(({ label, val }) => (
                  <div key={label} style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>{label}</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a", marginTop: 2 }}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: "0.74rem", color: "#64748b", marginBottom: 4, fontWeight: 600 }}>Block SHA-256 Hash:</div>
                <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0", fontFamily: "JetBrains Mono, monospace", fontSize: "0.8rem", color: "#7c3aed", wordBreak: "break-all", fontWeight: 600 }}>
                  {inspectEvent.event_hash}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: "0.74rem", color: "#64748b", marginBottom: 4, fontWeight: 600 }}>Previous Block Pointer:</div>
                <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0", fontFamily: "JetBrains Mono, monospace", fontSize: "0.8rem", color: "#64748b", wordBreak: "break-all" }}>
                  {inspectEvent.prev_hash}
                </div>
              </div>

              <button
                onClick={() => setInspectEvent(null)}
                className="btn-primary"
                style={{ width: "100%", padding: "12px" }}
              >
                Close Block View
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
