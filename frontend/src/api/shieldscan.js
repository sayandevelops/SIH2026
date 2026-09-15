/**
 * ShieldScan API Client
 * Axios wrapper for all backend endpoints
 */

import axios from "axios";

const isBrowser = typeof window !== "undefined";
const isLocal = isBrowser && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

// In production on Vercel, use same-origin relative path ("") to route through Vercel's server-side proxy in vercel.json.
// This completely eliminates cross-origin CORS errors!
// In local development, target the local FastAPI backend.
const rawBaseURL = isLocal ? (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000") : "";
const cleanBaseURL = rawBaseURL.endsWith("/") ? rawBaseURL.slice(0, -1) : rawBaseURL;

const API = axios.create({
  baseURL: cleanBaseURL,
  timeout: 120000, // 2 min timeout for AI processing
});

// ─── Render Cold-Start & 503 Auto-Retry Interceptor ─────────────────────────
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Initialize retry counter
    if (status === 503 && originalRequest && originalRequest._retryCount === undefined) {
      originalRequest._retryCount = 0;
    }

    // Auto-retry up to 3 times with 4-second delay for Render free tier cold-starts
    if (status === 503 && originalRequest && originalRequest._retryCount < 3) {
      originalRequest._retryCount += 1;
      const attempt = originalRequest._retryCount;
      
      try {
        const { default: toast } = await import("react-hot-toast");
        toast.loading(`Backend service is waking up (Render cold-start)... Retrying attempt ${attempt}/3`, {
          id: "render-cold-start",
          duration: 4000,
        });
      } catch (e) {
        console.log("Waking up server... Retrying attempt", attempt);
      }

      await new Promise((resolve) => setTimeout(resolve, 4000));
      return API(originalRequest);
    }

    return Promise.reject(error);
  }
);

// ─── Master Screening (all modules) ──────────────────────────────────────────
export async function screenDocument({ file, documentType, liveImageB64, officerId, checkpoint }) {
  const form = new FormData();
  form.append("document_file", file);
  form.append("document_type", documentType || "PASSPORT");
  form.append("officer_id",    officerId    || "OFFICER-01");
  form.append("checkpoint",    checkpoint   || "CHECKPOINT-ALPHA");
  if (liveImageB64) form.append("live_image_b64", liveImageB64);

  const { data } = await API.post("/api/screen", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// ─── Individual Modules ───────────────────────────────────────────────────────
export async function extractOCR(file, documentType = "PASSPORT") {
  const form = new FormData();
  form.append("file", file);
  form.append("document_type", documentType);
  const { data } = await API.post("/api/ocr/extract", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function validateDocument(fields) {
  const { data } = await API.post("/api/validation/validate", fields);
  return data;
}

export async function analyzeTampering(file) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await API.post("/api/tampering/analyze", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function verifyFace({ docImageUrl, liveImageB64 }) {
  const { data } = await API.post("/api/face/verify", {
    doc_image_url:  docImageUrl,
    live_image_b64: liveImageB64,
  });
  return data;
}

// ─── Audit Ledger ─────────────────────────────────────────────────────────────
export async function getAuditLog(limit = 50, offset = 0) {
  const { data } = await API.get(`/api/audit/log?limit=${limit}&offset=${offset}`);
  return data;
}

export async function verifyChainIntegrity() {
  const { data } = await API.get("/api/audit/verify");
  return data;
}

// ─── Developer API Platform ──────────────────────────────────────────────────
export async function listApiKeys() {
  const { data } = await API.get("/api/v1/keys/list");
  return data;
}

export async function generateApiKey({ appName, developerEmail }) {
  const form = new FormData();
  form.append("app_name", appName || "My Custom App");
  form.append("developer_email", developerEmail || "dev@example.com");
  const { data } = await API.post("/api/v1/keys/generate", form);
  return data;
}

export async function verifyDocumentViaApi({ file, apiKey, documentType = "AUTO", strictMode = false }) {
  const form = new FormData();
  form.append("file", file);
  form.append("document_type", documentType);
  form.append("strict_mode", String(strictMode));

  const { data } = await API.post("/api/v1/verify", form, {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-API-Key": apiKey,
    },
  });
  return data;
}

export default API;
