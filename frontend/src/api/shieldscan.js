/**
 * ShieldScan API Client
 * Axios wrapper for all backend endpoints
 */

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : "",
  timeout: 120000, // 2 min timeout for AI processing
});

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
