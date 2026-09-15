import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, X, Send, Loader2, Shield, Sparkles,
  ChevronDown, Zap, AlertTriangle, CheckCircle2, Bot
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const NVIDIA_API_KEY = import.meta.env.VITE_NVIDIA_API_KEY || "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";
const MODEL = "meta/llama-3.2-11b-vision-instruct";

const SYSTEM_PROMPT = `You are ShieldScan AI — an elite forensic document intelligence assistant built into a defense-grade border security and document verification system used by Indian government border agencies, traffic police, maritime customs, and national examination centers.

Your role is to:
- Explain document forensic analysis results in simple, clear language for security officers
- Answer questions about how tamper detection, biometric verification, and watchlist lookup works
- Help officers understand scan verdicts and risk scores
- Provide guidance on suspicious document patterns
- Discuss how ELA (Error Level Analysis), CMFD (Copy-Move Forgery Detection), ArcFace biometrics, ICAO 9303 MRZ checksums, and Verhoeff D5 Aadhaar validation work
- Answer questions about specific document types: Indian Passports, Aadhaar, DL, RC, Seafarer CDC, PAN cards
- Keep answers concise and actionable for frontline officers

You are running on NVIDIA NIM via NVIDIA AI Foundation Models (Llama 3.2).
Always be confident, professional, and brief. No markdown headers — use plain short paragraphs.`;

const QUICK_PROMPTS = [
  { text: "What is ELA tampering detection?", icon: AlertTriangle },
  { text: "How does biometric face matching work?", icon: Shield },
  { text: "Explain ICAO MRZ checksum validation", icon: CheckCircle2 },
  { text: "What is Copy-Move Forgery Detection?", icon: Sparkles },
  { text: "How to spot a fake Aadhaar card?", icon: Zap },
  { text: "What does a HIGH RISK verdict mean?", icon: AlertTriangle },
];

export default function ForensicChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "ShieldScan AI online. I'm your forensic intelligence assistant powered by NVIDIA AI — ask me anything about document verification, tamper detection results, biometric analysis, or how ShieldScan catches forgeries.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { themeMeta } = useTheme();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (messageText) => {
    const text = (messageText || input).trim();
    if (!text || isLoading) return;

    setInput("");
    setError(null);

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Use Vite proxy '/nvidia-api' to bypass browser CORS restrictions
      const endpoint = "/nvidia-api/chat/completions";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${NVIDIA_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...newMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.5,
          max_tokens: 400,
          stream: false,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.detail || `API error ${res.status}`);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (!reply) throw new Error("Empty response from NVIDIA API");

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err.message || "Connection error. Check API key and network.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Error: ${err.message || "Could not reach NVIDIA API. Check your API key."}`,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open ShieldScan AI forensic assistant"
        style={{
          position: "fixed",
          bottom: "26px",
          right: "26px",
          zIndex: 1050,
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${themeMeta.accentColor} 0%, ${themeMeta.accentColor}bb 100%)`,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 6px 24px ${themeMeta.accentColor}55, 0 2px 8px rgba(0,0,0,0.15)`,
          transition: "all 0.2s ease",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={24} color="#ffffff" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}
              style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Bot size={26} color="#ffffff" />
              {/* Pulse indicator */}
              <span style={{
                position: "absolute", top: -2, right: -2,
                width: 10, height: 10, borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 0 2px rgba(16,185,129,0.4)",
                animation: "pulse 2s infinite",
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "fixed",
              bottom: "96px",
              right: "24px",
              width: "min(400px, calc(100vw - 32px))",
              height: "min(580px, calc(100vh - 120px))",
              zIndex: 1040,
              display: "flex",
              flexDirection: "column",
              background: "var(--bg-surface)",
              borderRadius: "18px",
              border: `1.5px solid ${themeMeta.accentColor}50`,
              boxShadow: `0 24px 60px -8px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.04)`,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "14px 18px",
                background: `linear-gradient(135deg, ${themeMeta.accentColor}20, ${themeMeta.accentColor}08)`,
                borderBottom: `1px solid ${themeMeta.accentColor}25`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    background: `linear-gradient(135deg, ${themeMeta.accentColor}, ${themeMeta.accentColor}cc)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 12px ${themeMeta.accentColor}40`,
                  }}
                >
                  <Bot size={20} color="#ffffff" />
                </div>
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-pure)" }}>
                    ShieldScan AI
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#10b981" }}>
                      NVIDIA Llama 3.2 · Online
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    padding: "2px 7px",
                    borderRadius: "4px",
                    background: themeMeta.softBg,
                    color: themeMeta.accentColor,
                    border: `1px solid ${themeMeta.borderColor}`,
                    letterSpacing: "0.03em",
                  }}
                >
                  FORENSIC AI
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 2 }}
                >
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    gap: 8,
                    alignItems: "flex-end",
                  }}
                >
                  {msg.role === "assistant" && (
                    <div
                      style={{
                        width: 28, height: 28, borderRadius: "8px",
                        background: msg.isError ? "#fef2f2" : `${themeMeta.accentColor}18`,
                        border: `1px solid ${msg.isError ? "#fecaca" : themeMeta.borderColor}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Bot size={15} color={msg.isError ? "#dc2626" : themeMeta.accentColor} />
                    </div>
                  )}

                  <div
                    style={{
                      maxWidth: "82%",
                      padding: "10px 13px",
                      borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      background:
                        msg.role === "user"
                          ? themeMeta.accentColor
                          : msg.isError
                          ? "#fef2f2"
                          : "var(--bg-glass-hover)",
                      color: msg.role === "user" ? "#ffffff" : msg.isError ? "#dc2626" : "var(--text-primary)",
                      fontSize: "0.84rem",
                      lineHeight: 1.5,
                      fontWeight: msg.role === "user" ? 600 : 400,
                      border: msg.role === "user" ? "none" : `1px solid ${msg.isError ? "#fecaca" : "var(--border-light)"}`,
                      boxShadow: msg.role === "user" ? `0 4px 12px ${themeMeta.accentColor}35` : "none",
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: "flex", alignItems: "flex-end", gap: 8 }}
                >
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: "8px",
                      background: `${themeMeta.accentColor}18`,
                      border: `1px solid ${themeMeta.borderColor}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Bot size={15} color={themeMeta.accentColor} />
                  </div>
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "14px 14px 14px 4px",
                      background: "var(--bg-glass-hover)",
                      border: "1px solid var(--border-light)",
                      display: "flex", alignItems: "center", gap: 6,
                    }}
                  >
                    <Loader2 size={14} color={themeMeta.accentColor} style={{ animation: "spin 1s linear infinite" }} />
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                      Analyzing...
                    </span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length <= 1 && !isLoading && (
              <div
                style={{
                  padding: "0 14px 10px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  flexShrink: 0,
                }}
              >
                {QUICK_PROMPTS.map((qp, idx) => {
                  const Icon = qp.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendMessage(qp.text)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "20px",
                        background: "var(--bg-glass-hover)",
                        border: "1px solid var(--border-subtle)",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        transition: "all 0.15s ease",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = themeMeta.accentColor;
                        e.currentTarget.style.color = themeMeta.accentColor;
                        e.currentTarget.style.background = themeMeta.softBg;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-subtle)";
                        e.currentTarget.style.color = "var(--text-secondary)";
                        e.currentTarget.style.background = "var(--bg-glass-hover)";
                      }}
                    >
                      <Icon size={11} />
                      {qp.text}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Input Area */}
            <div
              style={{
                padding: "12px 14px",
                borderTop: "1px solid var(--border-subtle)",
                display: "flex",
                gap: 10,
                alignItems: "flex-end",
                flexShrink: 0,
                background: "var(--bg-surface)",
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about scan results, tamper detection, biometrics…"
                rows={1}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: "10px 13px",
                  borderRadius: "10px",
                  border: `1px solid ${input ? themeMeta.accentColor + "80" : "var(--border-subtle)"}`,
                  background: "var(--bg-glass-hover)",
                  color: "var(--text-primary)",
                  fontSize: "0.84rem",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  resize: "none",
                  outline: "none",
                  lineHeight: 1.5,
                  maxHeight: "80px",
                  overflowY: "auto",
                  transition: "border-color 0.15s ease",
                  minHeight: "42px",
                }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 80) + "px";
                }}
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "10px",
                  background: input.trim() && !isLoading ? themeMeta.accentColor : "var(--border-subtle)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                  boxShadow: input.trim() && !isLoading ? `0 4px 12px ${themeMeta.accentColor}40` : "none",
                }}
              >
                {isLoading ? (
                  <Loader2 size={17} color="#ffffff" style={{ animation: "spin 1s linear infinite" }} />
                ) : (
                  <Send size={17} color={input.trim() ? "#ffffff" : "var(--text-muted)"} />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
          50% { box-shadow: 0 0 0 5px rgba(16,185,129,0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
