import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Code, Key, Copy, Check, Terminal, Play, Zap, Shield,
  CheckCircle2, XCircle, AlertTriangle, ExternalLink, ArrowRight,
  Layers, Lock, Database, Cpu, FileText
} from "lucide-react";
import toast from "react-hot-toast";
import { listApiKeys, generateApiKey, verifyDocumentViaApi } from "../api/shieldscan";

export default function DeveloperPortal() {
  const [keys, setKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState("sk_test_shieldscan_demo_2024");
  const [copiedKey, setCopiedKey] = useState(null);
  const [appName, setAppName] = useState("");
  const [devEmail, setDevEmail] = useState("");
  const [generating, setGenerating] = useState(false);

  // Playground state
  const [testFile, setTestFile] = useState(null);
  const [testDocType, setTestDocType] = useState("AUTO");
  const [testStrictMode, setTestStrictMode] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testResponse, setTestResponse] = useState(null);

  // Code snippet tab
  const [activeCodeTab, setActiveCodeTab] = useState("javascript");

  const loadKeys = async () => {
    try {
      const data = await listApiKeys();
      setKeys(data.keys || []);
      if (data.keys?.length > 0 && !selectedKey) {
        setSelectedKey(data.keys[0].key);
      }
    } catch (err) {
      console.error("Failed to load keys", err);
    }
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const handleGenerateKey = async (e) => {
    e.preventDefault();
    if (!appName) {
      toast.error("Please enter an Application Name");
      return;
    }
    setGenerating(true);
    try {
      const res = await generateApiKey({ appName, developerEmail: devEmail || "developer@local.in" });
      toast.success("New API Key generated!");
      setAppName("");
      setDevEmail("");
      setSelectedKey(res.api_key);
      await loadKeys();
    } catch (err) {
      toast.error("Failed to generate key: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestRequest = async () => {
    if (!testFile) {
      toast.error("Please select a document image or PDF to test.");
      return;
    }
    setTestLoading(true);
    setTestResponse(null);
    try {
      const res = await verifyDocumentViaApi({
        file: testFile,
        apiKey: selectedKey,
        documentType: testDocType,
        strictMode: testStrictMode,
      });
      setTestResponse(res);
      toast.success(`Verification complete: ${res.status}`);
      loadKeys();
    } catch (err) {
      setTestResponse({
        error: true,
        message: err.response?.data?.detail || err.message,
      });
      toast.error("Verification error occurred");
    } finally {
      setTestLoading(false);
    }
  };

  // Code Snippet Templates
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const codeSnippets = {
    javascript: `// Node.js / React / Next.js / Express Example
// When a user uploads a document in your form:

async function verifyUploadedDocument(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("document_type", "AUTO"); // or "AADHAAR", "PAN_CARD", "PASSPORT"
  formData.append("strict_mode", "false");

  const response = await fetch("${apiBase}/api/v1/verify", {
    method: "POST",
    headers: {
      "X-API-Key": "${selectedKey}"
    },
    body: formData
  });

  const result = await response.json();

  if (!result.is_authentic || result.status === "REJECTED") {
    // ❌ Block form submission & alert user
    alert("Form Error: " + result.rejection_reasons.join(", "));
    return false;
  }

  // ✅ Document verified authentic! Proceed with database submission
  console.log("Verified ID:", result.extracted_data);
  return true;
}

// React Form Example:
function RegistrationForm() {
  const [docFile, setDocFile] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setErrorMsg("");

    const data = new FormData();
    data.append("file", docFile);
    data.append("document_type", "AADHAAR");

    const res = await fetch("${apiBase}/api/v1/verify", {
      method: "POST",
      headers: { "X-API-Key": "${selectedKey}" },
      body: data
    });
    const check = await res.json();

    if (check.status === "REJECTED") {
      setErrorMsg("🚨 Rejected: " + check.rejection_reasons[0]);
      setVerifying(false);
      return; // Stop form from saving fake ID!
    }

    // Submit valid student record to your backend database
    alert("Document Authentic! Admission Form Submitted Successfully.");
    setVerifying(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={(e) => setDocFile(e.target.files[0])} required />
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <button disabled={verifying}>{verifying ? "Checking AI Forensics..." : "Submit Application"}</button>
    </form>
  );
}`,

    python: `# Python / FastAPI / Django Integration Example
import requests

url = "${apiBase}/api/v1/verify"
headers = {
    "X-API-Key": "${selectedKey}"
}

with open("user_aadhaar_card.jpg", "rb") as f:
    files = {"file": f}
    data = {
        "document_type": "AUTO",
        "strict_mode": "false"
    }
    response = requests.post(url, headers=headers, files=files, data=data)

result = response.json()

if not result.get("is_authentic"):
    print("❌ FORGERY DETECTED! Reasons:", result.get("rejection_reasons"))
else:
    print("✅ AUTHENTIC DOCUMENT:", result.get("extracted_data"))`,

    curl: `# cURL Command Line Example
curl -X POST "${apiBase}/api/v1/verify" \\
  -H "X-API-Key: ${selectedKey}" \\
  -F "file=@/path/to/passport.jpg" \\
  -F "document_type=PASSPORT" \\
  -F "strict_mode=false"`,

    php: `<?php
// PHP cURL Form Integration
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "${apiBase}/api/v1/verify");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "X-API-Key: ${selectedKey}"
]);

$cfile = new CURLFile('/path/to/document.pdf', 'application/pdf', 'document.pdf');
$data = [
    'file' => $cfile,
    'document_type' => 'AUTO'
];

curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
if ($result['status'] === 'REJECTED') {
    die("Submission Rejected: " . implode(", ", $result['rejection_reasons']));
}
echo "Document Verified Successfully!";
?>`
  };

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 24px 80px" }}>

      {/* ── Header ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", marginBottom: 46 }}
      >
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 18px", borderRadius: "999px",
          background: "#eff6ff", border: "1px solid #bfdbfe",
          fontSize: "0.78rem", fontWeight: 700, color: "#2563eb",
          letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 18
        }}>
          <Code size={15} /> DEVELOPER API & EMBEDDABLE FRAUD VERIFICATION SDK
        </div>

        <h1 style={{
          fontSize: "clamp(2.3rem, 5vw, 3.6rem)",
          fontWeight: 800, lineHeight: 1.15,
          letterSpacing: "-0.03em",
          color: "#0f172a",
          marginBottom: 16
        }}>
          Document Fraud Detection as an API
        </h1>

        <p style={{
          fontSize: "1.12rem", color: "#475569", maxWidth: 720, margin: "0 auto", lineHeight: 1.65
        }}>
          Directly plug ShieldScan’s multi-spectral forensics into your college admission forms, KYC portals, or job application backends. Stop forged documents at the point of upload with 3 lines of code.
        </p>
      </motion.div>

      {/* ── SECTION 1: Free API Key Generator & Dashboard ──────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: 24, marginBottom: 36 }}>

        {/* Generate Key Form */}
        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Key size={20} color="#2563eb" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>Generate Free Developer API Key</h3>
          </div>
          <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: 20, lineHeight: 1.5 }}>
            100% Free for educational, hackathon, and sovereign deployment. Zero cloud bills or credit cards.
          </p>

          <form onSubmit={handleGenerateKey} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>
                Application / Website Name *
              </label>
              <input
                type="text"
                placeholder="e.g. University Admission Portal"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px", background: "#ffffff",
                  border: "1px solid #cbd5e1", borderRadius: 8,
                  color: "#0f172a", fontSize: "0.88rem", outline: "none"
                }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>
                Developer Email (Optional)
              </label>
              <input
                type="email"
                placeholder="developer@institution.edu.in"
                value={devEmail}
                onChange={(e) => setDevEmail(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px", background: "#ffffff",
                  border: "1px solid #cbd5e1", borderRadius: 8,
                  color: "#0f172a", fontSize: "0.88rem", outline: "none"
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={generating}
              style={{ marginTop: 6, padding: "12px" }}
            >
              <Key size={16} /> {generating ? "Generating Token..." : "Generate Instant API Key"}
            </button>
          </form>
        </div>

        {/* Active Keys & Usage Quota */}
        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Zap size={20} color="#059669" />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>Your Active API Keys</h3>
            </div>
            <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>
              {keys.length} Registered
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 260, overflowY: "auto" }}>
            {keys.map((k) => (
              <div
                key={k.key}
                style={{
                  padding: "14px", borderRadius: 10,
                  background: selectedKey === k.key ? "#eff6ff" : "#f8fafc",
                  border: `1px solid ${selectedKey === k.key ? "#bfdbfe" : "#e2e8f0"}`,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onClick={() => setSelectedKey(k.key)}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0f172a" }}>
                    {k.app_name}
                  </div>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                    background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0"
                  }}>
                    {k.tier}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <span style={{
                    fontFamily: "JetBrains Mono, monospace", fontSize: "0.78rem", color: "#2563eb",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600
                  }}>
                    {k.key}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(k.key, k.key);
                    }}
                    className="btn-secondary"
                    style={{ padding: "4px 8px", borderRadius: 6 }}
                  >
                    {copiedKey === k.key ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                  </button>
                </div>

                <div style={{ marginTop: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#64748b", marginBottom: 4 }}>
                    <span>Daily Quota: {k.requests_used || 0} / {k.daily_limit || 500} requests</span>
                    <span>{Math.round(((k.requests_used || 0) / (k.daily_limit || 500)) * 100)}%</span>
                  </div>
                  <div style={{ height: 4, background: "#e2e8f0", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{
                      width: `${Math.min(100, ((k.requests_used || 0) / (k.daily_limit || 500)) * 100)}%`,
                      height: "100%", background: "#2563eb"
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 2: Interactive Live API Playground ─────────────── */}
      <div className="glass-card" style={{ padding: 30, marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Play size={20} color="#2563eb" />
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a" }}>Live API Playground</h2>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: 4 }}>
              Test your endpoint live right in the browser. See how ShieldScan analyzes documents in sub-second inference.
            </p>
          </div>

          <span style={{
            fontFamily: "JetBrains Mono, monospace", fontSize: "0.78rem", color: "#2563eb", fontWeight: 600,
            padding: "5px 12px", background: "#eff6ff", borderRadius: 6,
            border: "1px solid #bfdbfe"
          }}>
            POST /api/v1/verify
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 24 }}>

          {/* Test Inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>
                Active API Key
              </label>
              <input
                type="text"
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px", background: "#ffffff",
                  border: "1px solid #cbd5e1", borderRadius: 8,
                  fontFamily: "JetBrains Mono, monospace", fontSize: "0.82rem", color: "#2563eb", outline: "none", fontWeight: 600
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>
                  Document Protocol
                </label>
                <select
                  value={testDocType}
                  onChange={(e) => setTestDocType(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 12px", background: "#ffffff",
                    border: "1px solid #cbd5e1", borderRadius: 8,
                    color: "#0f172a", fontSize: "0.82rem", outline: "none"
                  }}
                >
                  <option value="AUTO">AUTO (Auto-Detect)</option>
                  <option value="PASSPORT">Passport (ICAO 9303)</option>
                  <option value="AADHAAR">Aadhaar Card (Verhoeff D5)</option>
                  <option value="PAN_CARD">PAN Card (Income Tax)</option>
                  <option value="DRIVING_LICENSE">Driving License (MoRTH)</option>
                  <option value="VISA">Visa Permit</option>
                  <option value="NATIONAL_ID">National ID</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>
                  Strict Inspection Mode
                </label>
                <button
                  type="button"
                  onClick={() => setTestStrictMode(!testStrictMode)}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    background: testStrictMode ? "#fef2f2" : "#f8fafc",
                    border: `1px solid ${testStrictMode ? "#fecaca" : "#cbd5e1"}`,
                    color: testStrictMode ? "#dc2626" : "#475569", fontWeight: 600, fontSize: "0.82rem",
                    cursor: "pointer", transition: "all 0.2s ease"
                  }}
                >
                  {testStrictMode ? "🔴 STRICT (Threshold 35)" : "🟢 NORMAL (Threshold 50)"}
                </button>
              </div>
            </div>

            {/* Document Upload File Input */}
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>
                Upload Sample Test Document (Image / PDF) *
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setTestFile(e.target.files[0])}
                style={{
                  width: "100%", padding: "10px 14px", background: "#f8fafc",
                  border: "1px dashed #cbd5e1", borderRadius: 8,
                  color: "#475569", fontSize: "0.82rem", outline: "none", cursor: "pointer"
                }}
              />
              {testFile && (
                <div style={{ fontSize: "0.75rem", color: "#2563eb", marginTop: 4, fontWeight: 600 }}>
                  Selected: {testFile.name} ({(testFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>

            <button
              onClick={handleTestRequest}
              disabled={testLoading || !testFile}
              className="btn-primary"
              style={{ padding: "12px" }}
            >
              {testLoading ? (
                <>
                  <span className="spinner" style={{ width: 16, height: 16, borderTopColor: "#ffffff" }} />
                  <span>Executing Verification...</span>
                </>
              ) : (
                <>
                  <Play size={16} /> Send API Request
                </>
              )}
            </button>
          </div>

          {/* Response Inspector */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b" }}>
                JSON RESPONSE PAYLOAD
              </span>
              {testResponse && (
                <span className={`band-badge ${testResponse.status === "APPROVED" ? "band-green" : testResponse.status === "REJECTED" ? "band-red" : "band-yellow"}`} style={{ fontSize: "0.72rem", padding: "2px 10px" }}>
                  STATUS: {testResponse.status || (testResponse.error ? "ERROR" : "COMPLETE")}
                </span>
              )}
            </div>

            <div style={{
              background: "#0f172a", borderRadius: 10,
              border: "1px solid #334155", padding: 16,
              minHeight: 280, maxHeight: 380, overflowY: "auto",
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.78rem"
            }}>
              {testLoading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, color: "#38bdf8" }}>
                  <div className="spinner" style={{ width: 32, height: 32, marginBottom: 12, borderTopColor: "#38bdf8" }} />
                  <span>Processing OCR, Checksums & ELA Forensics...</span>
                </div>
              ) : testResponse ? (
                <pre style={{ margin: 0, color: testResponse.is_authentic ? "#4ade80" : testResponse.error ? "#f87171" : "#f1f5f9", whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(testResponse, null, 2)}
                </pre>
              ) : (
                <div style={{ color: "#64748b", textAlign: "center", paddingTop: 100 }}>
                  <Terminal size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                  <p>Choose an image or PDF and click 'Send API Request' to see live JSON verdict.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: Integration Code Snippets ───────────────────── */}
      <div className="glass-card" style={{ padding: 30 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Code size={20} color="#2563eb" />
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a" }}>Ready-to-Use Code Snippets</h2>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: 4 }}>
              Copy & paste into your web application or form backend.
            </p>
          </div>

          <div className="tab-pill-group">
            {[
              { id: "javascript", label: "JavaScript / Node" },
              { id: "react_form", label: "React Form Example" },
              { id: "python",     label: "Python" },
              { id: "curl",       label: "cURL" },
              { id: "php",        label: "PHP" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`tab-pill-btn ${activeCodeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveCodeTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Code View with Copy Button */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => copyToClipboard(codeSnippets[activeCodeTab], "snippet")}
            className="btn-secondary"
            style={{ position: "absolute", top: 12, right: 12, zIndex: 5, padding: "6px 12px", fontSize: "0.78rem" }}
          >
            {copiedKey === "snippet" ? <Check size={14} color="#059669" /> : <Copy size={14} />}
            {copiedKey === "snippet" ? "COPIED" : "COPY CODE"}
          </button>

          <pre style={{
            background: "#0f172a", border: "1px solid #1e293b",
            borderRadius: 10, padding: "20px 24px", color: "#f8fafc",
            fontFamily: "JetBrains Mono, monospace", fontSize: "0.84rem",
            lineHeight: 1.6, overflowX: "auto"
          }}>
            {codeSnippets[activeCodeTab]}
          </pre>
        </div>
      </div>

    </div>
  );
}
