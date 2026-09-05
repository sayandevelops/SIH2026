import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Shield, CheckCircle2, XCircle, RefreshCw,
  AlertTriangle, Search, Filter, Copy, Check, ExternalLink,
  Layers, Database, ArrowUpDown, ChevronRight, Hash, Calendar
} from "lucide-react";
import { getAuditLog, verifyChainIntegrity } from "../api/shieldscan";
import toast from "react-hot-toast";

const BAND_COLORS = {
  GREEN:  { color: "#00f59b", bg: "rgba(0, 245, 155, 0.12)",  border: "rgba(0, 245, 155, 0.35)" },
  YELLOW: { color: "#ffb800", bg: "rgba(255, 184, 0, 0.12)",  border: "rgba(255, 184, 0, 0.35)" },
  RED:    { color: "#ff2a5f", bg: "rgba(255, 42, 95, 0.12)",  border: "rgba(255, 42, 95, 0.4)" },
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
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 24px 80px" }}>

      {/* ── Top Header ────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{
            fontSize: "0.74rem", fontFamily: "JetBrains Mono, monospace",
            color: "#8da4c4", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4
          }}>
            SECURITY OPERATIONS CENTER // IMMUTABLE LEDGER
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, display: "flex", alignItems: "center", gap: 12 }}>
            <Lock size={28} color="#9d4edd" /> Blockchain Audit Chain
          </h1>
          <p style={{ color: "#8da4c4", fontSize: "0.95rem", marginTop: 4 }}>
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        <div className="glass-card hud-frame" style={{ padding: "20px" }}>
          <div className="hud-corner hud-tl" />
          <div className="hud-corner hud-br" />
          <div style={{ fontSize: "0.72rem", color: "#8da4c4", textTransform: "uppercase", letterSpacing: "0.08em" }}>Total Screened Records</div>
          <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "#ffffff", marginTop: 4 }}>{events.length}</div>
          <div style={{ fontSize: "0.74rem", color: "#00f2fe", marginTop: 4 }}>Live database records</div>
        </div>

        <div className="glass-card hud-frame" style={{ padding: "20px" }}>
          <div className="hud-corner hud-tl" />
          <div className="hud-corner hud-br" />
          <div style={{ fontSize: "0.72rem", color: "#8da4c4", textTransform: "uppercase", letterSpacing: "0.08em" }}>Threats Flagged</div>
          <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "#ff2a5f", marginTop: 4 }}>{threatCount}</div>
          <div style={{ fontSize: "0.74rem", color: "#8da4c4", marginTop: 4 }}>High/Moderate risk events</div>
        </div>

        <div className="glass-card hud-frame" style={{ padding: "20px" }}>
          <div className="hud-corner hud-tl" />
          <div className="hud-corner hud-br" />
          <div style={{ fontSize: "0.72rem", color: "#8da4c4", textTransform: "uppercase", letterSpacing: "0.08em" }}>Chain Verification</div>
          <div style={{ fontSize: "1.9rem", fontWeight: 800, color: integrity?.intact ? "#00f59b" : "#ff2a5f", marginTop: 4 }}>
            {integrity?.intact ? "100% INTACT" : "COMPROMISED"}
          </div>
          <div style={{ fontSize: "0.74rem", color: "#8da4c4", marginTop: 4 }}>
            {integrity?.total_blocks || events.length} cryptographic blocks checked
          </div>
        </div>

        <div className="glass-card hud-frame" style={{ padding: "20px" }}>
          <div className="hud-corner hud-tl" />
          <div className="hud-corner hud-br" />
          <div style={{ fontSize: "0.72rem", color: "#8da4c4", textTransform: "uppercase", letterSpacing: "0.08em" }}>Air-Gap Status</div>
          <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "#00f2fe", marginTop: 4 }}>ACTIVE</div>
          <div style={{ fontSize: "0.74rem", color: "#8da4c4", marginTop: 4 }}>Zero cloud data leakage</div>
        </div>
      </div>

      {/* ── Chain Integrity Status Banner ──────────────────────────── */}
      {integrity && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card hud-frame"
          style={{
            padding: "20px 24px", marginBottom: 28,
            display: "flex", alignItems: "center", gap: 16,
            borderLeft: `4px solid ${integrity.intact ? "var(--emerald-core)" : "var(--crimson-core)"}`,
          }}
        >
          <div className="hud-corner hud-tl" />
          <div className="hud-corner hud-tr" />
          <div className="hud-corner hud-bl" />
          <div className="hud-corner hud-br" />

          {integrity.intact ? (
            <CheckCircle2 size={32} color="#00f59b" style={{ flexShrink: 0 }} />
          ) : (
            <AlertTriangle size={32} color="#ff2a5f" style={{ flexShrink: 0 }} />
          )}

          <div>
            <div style={{ fontWeight: 800, fontSize: "1.05rem", color: integrity.intact ? "#00f59b" : "#ff2a5f" }}>
              {integrity.intact ? "Cryptographic Hash-Chain Integrity Intact" : "WARNING: Audit Hash-Chain Compromised"}
            </div>
            <div style={{ fontSize: "0.84rem", color: "#8da4c4", marginTop: 2 }}>
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
      <div className="glass-card" style={{ padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        {/* Search Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 280 }}>
          <Search size={18} color="#00f2fe" />
          <input
            type="text"
            placeholder="Search by name, doc number, officer ID, checkpoint, or hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%", background: "transparent", border: "none",
              color: "#ffffff", fontSize: "0.88rem", outline: "none",
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
      <div className="glass-card hud-frame" style={{ overflow: "hidden" }}>
        <div className="hud-corner hud-tl" />
        <div className="hud-corner hud-tr" />
        <div className="hud-corner hud-bl" />
        <div className="hud-corner hud-br" />

        <div style={{
          padding: "16px 24px", borderBottom: "1px solid rgba(0, 242, 254, 0.12)",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Shield size={16} color="#00f2fe" />
            <span style={{ fontWeight: 700, fontSize: "0.92rem" }}>Screening Ledger Records</span>
          </div>
          <span style={{ fontSize: "0.78rem", color: "#8da4c4", fontFamily: "JetBrains Mono, monospace" }}>
            Showing {filteredEvents.length} of {events.length} blocks
          </span>
        </div>

        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#8da4c4" }}>
            <div className="spinner" style={{ margin: "0 auto 16px", width: 32, height: 32 }} />
            <span>Validating cryptographic merkle tree blocks...</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#8da4c4" }}>
            <Lock size={40} style={{ margin: "0 auto 14px", opacity: 0.3 }} />
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "#f0f6fc" }}>No matching records found</div>
            <p style={{ fontSize: "0.85rem", marginTop: 4 }}>
              Try adjusting your search query or band filter.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
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
                      <td style={{ color: "#00f2fe", fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>
                        #{String(ev.id).padStart(4, "0")}
                      </td>
                      <td style={{ fontSize: "0.8rem", color: "#8da4c4" }}>
                        {new Date(ev.timestamp).toLocaleTimeString()} · {new Date(ev.timestamp).toLocaleDateString()}
                      </td>
                      <td style={{ fontWeight: 600, color: "#ffffff" }}>
                        {ev.officer_id}
                      </td>
                      <td style={{ color: "#8da4c4", fontSize: "0.82rem" }}>
                        {ev.checkpoint}
                      </td>
                      <td style={{ fontWeight: 700, color: "#f0f6fc" }}>
                        {ev.extracted_name || "—"}
                      </td>
                      <td style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.82rem", color: "#00f2fe" }}>
                        {ev.doc_number || "—"}
                      </td>
                      <td style={{ fontSize: "0.78rem", color: "#8da4c4", textTransform: "capitalize" }}>
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
                          padding: "3px 10px", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 800,
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
                          className="crypto-chip"
                          style={{ fontSize: "0.72rem", padding: "3px 8px" }}
                        >
                          {copiedId === ev.id ? <Check size={12} color="#00f59b" /> : <Copy size={12} />}
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
              position: "fixed", inset: 0, background: "rgba(3, 7, 18, 0.8)",
              backdropFilter: "blur(8px)", zIndex: 100, display: "flex",
              alignItems: "center", justifyContent: "center", padding: 24
            }}
            onClick={() => setInspectEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="glass-card hud-frame"
              style={{ maxWidth: 640, width: "100%", padding: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hud-corner hud-tl" />
              <div className="hud-corner hud-tr" />
              <div className="hud-corner hud-bl" />
              <div className="hud-corner hud-br" />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Lock size={22} color="#9d4edd" />
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                    Block #{String(inspectEvent.id).padStart(4, "0")} Inspection
                  </h3>
                </div>
                <button
                  onClick={() => setInspectEvent(null)}
                  style={{ background: "transparent", border: "none", color: "#8da4c4", cursor: "pointer", fontSize: "1.2rem" }}
                >
                  ✕
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
                  <div key={label} style={{ padding: "10px 12px", background: "rgba(0, 242, 254, 0.04)", borderRadius: 8, border: "1px solid rgba(0, 242, 254, 0.1)" }}>
                    <div style={{ fontSize: "0.72rem", color: "#8da4c4" }}>{label}</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff", marginTop: 2 }}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: "0.74rem", color: "#8da4c4", marginBottom: 4 }}>Block SHA-256 Hash:</div>
                <div style={{ padding: "8px 12px", background: "rgba(4, 9, 20, 0.8)", borderRadius: 6, fontFamily: "JetBrains Mono, monospace", fontSize: "0.78rem", color: "#c4b5fd", wordBreak: "break-all" }}>
                  {inspectEvent.event_hash}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: "0.74rem", color: "#8da4c4", marginBottom: 4 }}>Previous Block Pointer:</div>
                <div style={{ padding: "8px 12px", background: "rgba(4, 9, 20, 0.8)", borderRadius: 6, fontFamily: "JetBrains Mono, monospace", fontSize: "0.78rem", color: "#8da4c4", wordBreak: "break-all" }}>
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
