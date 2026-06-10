const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 730;
const STATE_POOL_MULTIPLIER = 6;
const PASS_CONFIDENCE_GOAL = 90;
const DEFAULT_STATE_CODE = "GA";
const DEFAULT_PAID_STATE_CONTENT_KEY = "education:state-question-blueprints:v1";
const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};
const encoder = new TextEncoder();
const STATE_PROFILES = [
  profile("AL", "Alabama", 120, 80, 40),
  profile("AK", "Alaska", 120, 80, 40),
  profile("AZ", "Arizona", 190, 80, 110),
  profile("AR", "Arkansas", 120, 80, 40),
  profile("CA", "California", 150, 100, 50),
  profile("CO", "Colorado", 154, 80, 74),
  profile("CT", "Connecticut", 120, 80, 40),
  profile("DE", "Delaware", 120, 80, 40),
  profile("DC", "District of Columbia", 110, 80, 30),
  profile("FL", "Florida", 100, 70, 30),
  profile("GA", "Georgia", 152, 100, 52),
  profile("HI", "Hawaii", 130, 80, 50),
  profile("ID", "Idaho", 120, 80, 40),
  profile("IL", "Illinois", 140, 100, 40),
  profile("IN", "Indiana", 120, 80, 40),
  profile("IA", "Iowa", 120, 80, 40),
  profile("KS", "Kansas", 110, 80, 30),
  profile("KY", "Kentucky", 120, 80, 40),
  profile("LA", "Louisiana", 135, 80, 55),
  profile("ME", "Maine", 120, 80, 40),
  profile("MD", "Maryland", 110, 80, 30),
  profile("MA", "Massachusetts", 120, 80, 40),
  profile("MI", "Michigan", 115, 80, 35),
  profile("MN", "Minnesota", 120, 80, 40),
  profile("MS", "Mississippi", 120, 80, 40),
  profile("MO", "Missouri", 140, 100, 40),
  profile("MT", "Montana", 113, 80, 33),
  profile("NE", "Nebraska", 120, 80, 40),
  profile("NV", "Nevada", 120, 80, 40),
  profile("NH", "New Hampshire", 120, 80, 40),
  profile("NJ", "New Jersey", 110, 80, 30),
  profile("NM", "New Mexico", 130, 80, 50),
  profile("NY", "New York", 75, 55, 20),
  profile("NC", "North Carolina", 120, 80, 40),
  profile("ND", "North Dakota", 120, 80, 40),
  profile("OH", "Ohio", 120, 80, 40),
  profile("OK", "Oklahoma", 120, 80, 40),
  profile("OR", "Oregon", 130, 80, 50),
  profile("PA", "Pennsylvania", 120, 80, 40),
  profile("RI", "Rhode Island", 120, 80, 40),
  profile("SC", "South Carolina", 120, 80, 40),
  profile("SD", "South Dakota", 120, 80, 40),
  profile("TN", "Tennessee", 120, 80, 40),
  profile("TX", "Texas", 110, 80, 30),
  profile("UT", "Utah", 130, 80, 50),
  profile("VT", "Vermont", 120, 80, 40),
  profile("VA", "Virginia", 120, 80, 40),
  profile("WA", "Washington", 110, 80, 30),
  profile("WV", "West Virginia", 120, 80, 40),
  profile("WI", "Wisconsin", 120, 80, 40),
  profile("WY", "Wyoming", 120, 80, 40)
];

export default {
  async fetch(request, env, ctx) {
    try {
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(request, env) });

      const url = new URL(request.url);
      if (request.method === "GET" && url.pathname === "/health") {
        return json(request, env, { ok: true, service: "brique-education-access", environment: env.ENVIRONMENT || "production" });
      }

      if (request.method === "POST" && url.pathname === "/claim") return claimAccess(request, env, ctx);
      if (request.method === "POST" && url.pathname === "/restore") return restoreAccess(request, env);
      if (request.method === "POST" && url.pathname === "/verify") return verifyAccess(request, env);
      if (request.method === "POST" && url.pathname === "/session/start") return startPaidSession(request, env);
      if (request.method === "POST" && url.pathname === "/progress/get") return getProgress(request, env);
      if (request.method === "POST" && url.pathname === "/progress/save") return saveProgress(request, env);

      return json(request, env, { ok: false, error: "not_found" }, 404);
    } catch (error) {
      console.error(JSON.stringify({ level: "error", message: "education_access_failure", error: String(error && error.message ? error.message : error) }));
      return json(request, env, { ok: false, error: "server_error" }, 500);
    }
  }
};

async function claimAccess(request, env, ctx) {
  const body = await readJson(request);
  const sessionId = cleanString(body.session_id || body.sessionId);
  if (!/^cs_(live|test)_[A-Za-z0-9_]+$/.test(sessionId)) return json(request, env, { ok: false, error: "invalid_session" }, 400);

  let session;
  let lineItems;
  try {
    session = await stripeGet(env, `/v1/checkout/sessions/${encodeURIComponent(sessionId)}`);
    lineItems = await stripeGet(env, `/v1/checkout/sessions/${encodeURIComponent(sessionId)}/line_items?limit=5`);
  } catch (_error) {
    return json(request, env, { ok: false, error: "session_not_found" }, 400);
  }
  const validation = validatePaidSession(session, lineItems, env);
  if (!validation.ok) return json(request, env, { ok: false, error: validation.error }, 402);

  const email = normalizeEmail(session.customer_details && session.customer_details.email ? session.customer_details.email : session.customer_email);
  if (!email) return json(request, env, { ok: false, error: "missing_email" }, 400);

  const emailHash = await sha256Hex(email);
  const nowIso = new Date().toISOString();
  const entitlementKey = `entitlement:${emailHash}`;
  const existing = await getJson(env.ENTITLEMENTS, entitlementKey);
  const sessionKey = `session:${sessionId}`;
  let entitlement = existing;
  let accessCode = null;

  if (!entitlement) {
    accessCode = generateAccessCode();
    const codeHash = await sha256Hex(normalizeAccessCode(accessCode));
    entitlement = {
      email,
      emailHash,
      codeHash,
      plan: env.PLAN_ID || "all_state_exam_prep_full",
      active: true,
      createdAt: nowIso,
      updatedAt: nowIso,
      sessionIds: [sessionId],
      stripe: stripeSummary(session, lineItems)
    };
    ctx.waitUntil(env.ENTITLEMENTS.put(`code:${codeHash}`, JSON.stringify({ emailHash, createdAt: nowIso }), { expirationTtl: TOKEN_TTL_SECONDS }));
  } else {
    entitlement.active = entitlement.active !== false;
    entitlement.updatedAt = nowIso;
    entitlement.sessionIds = Array.isArray(entitlement.sessionIds) ? entitlement.sessionIds : [];
    if (!entitlement.sessionIds.includes(sessionId)) entitlement.sessionIds.push(sessionId);
    entitlement.stripe = entitlement.stripe || stripeSummary(session, lineItems);
  }

  await env.ENTITLEMENTS.put(entitlementKey, JSON.stringify(entitlement));
  await env.ENTITLEMENTS.put(sessionKey, JSON.stringify({ emailHash, sessionId, claimedAt: nowIso, paymentStatus: session.payment_status }));

  const token = await createAccessToken(env, entitlement, sessionId);
  return json(request, env, {
    ok: true,
    unlocked: true,
    email,
    token,
    access_code: accessCode,
    access_code_already_issued: !accessCode,
    transaction_id: sessionId,
    value: Number(session.amount_total || 0) / 100,
    currency: session.currency || env.EXPECTED_CURRENCY || "usd",
    expires_at: new Date(Date.now() + TOKEN_TTL_SECONDS * 1000).toISOString()
  });
}

async function restoreAccess(request, env) {
  const body = await readJson(request);
  const email = normalizeEmail(body.email);
  const accessCode = normalizeAccessCode(body.access_code || body.accessCode || body.code);
  if (!email || !accessCode) return json(request, env, { ok: false, error: "invalid_restore" }, 400);

  const emailHash = await sha256Hex(email);
  const entitlement = await getJson(env.ENTITLEMENTS, `entitlement:${emailHash}`);
  if (!entitlement || entitlement.active === false) return json(request, env, { ok: false, error: "restore_failed" }, 403);

  const codeHash = await sha256Hex(accessCode);
  if (!constantTimeEqual(codeHash, entitlement.codeHash || "")) return json(request, env, { ok: false, error: "restore_failed" }, 403);

  const token = await createAccessToken(env, entitlement, "restore");
  return json(request, env, {
    ok: true,
    unlocked: true,
    email: entitlement.email || email,
    token,
    expires_at: new Date(Date.now() + TOKEN_TTL_SECONDS * 1000).toISOString()
  });
}

async function verifyAccess(request, env) {
  const body = await readJson(request);
  const token = cleanString(body.token);
  if (!token) return json(request, env, { ok: false, unlocked: false, error: "missing_token" }, 401);

  const payload = await verifyAccessToken(env, token);
  if (!payload) return json(request, env, { ok: false, unlocked: false, error: "invalid_token" }, 401);

  const entitlement = await getJson(env.ENTITLEMENTS, `entitlement:${payload.sub}`);
  if (!entitlement || entitlement.active === false) return json(request, env, { ok: false, unlocked: false, error: "inactive_entitlement" }, 403);

  return json(request, env, {
    ok: true,
    unlocked: true,
    email: entitlement.email || payload.email || "",
    plan: entitlement.plan || payload.plan,
    expires_at: new Date(payload.exp * 1000).toISOString()
  });
}

async function startPaidSession(request, env) {
  const body = await readJson(request);
  const auth = await authenticateToken(env, body.token);
  if (!auth.ok) return json(request, env, { ok: false, error: auth.error }, auth.status);

  const mode = cleanString(body.mode).toLowerCase();
  if (!["mixed", "state", "mock"].includes(mode)) return json(request, env, { ok: false, error: "invalid_mode" }, 400);

  const profile = stateProfileFor(body.state_code || body.stateCode);
  const content = await paidStateContent(env);
  if (!content.ok) return json(request, env, { ok: false, error: content.error }, 503);

  const stateCount = stateQuestionCountForMode(mode, profile);
  const nationalCount = nationalQuestionCountForMode(mode, profile);
  const stateQuestions = stateQuestionsForProfile(profile, content.blueprints, stateCount);
  if (!stateQuestions.length) return json(request, env, { ok: false, error: "empty_question_pool" }, 503);

  return json(request, env, {
    ok: true,
    session: {
      type: mode,
      stateCode: profile.code,
      sectionId: `state-${profile.code.toLowerCase()}`,
      name: sessionNameForMode(mode, profile),
      timed: mode === "mock",
      passConfidenceGoal: PASS_CONFIDENCE_GOAL,
      nationalQuestionCount: nationalCount,
      stateQuestionCount: stateQuestions.length,
      totalQuestions: nationalCount + stateQuestions.length,
      questions: stateQuestions
    }
  });
}

async function getProgress(request, env) {
  const body = await readJson(request);
  const auth = await authenticateToken(env, body.token);
  if (!auth.ok) return json(request, env, { ok: false, error: auth.error }, auth.status);

  const progress = (await getJson(env.ENTITLEMENTS, `progress:${auth.payload.sub}`)) || {};
  return json(request, env, { ok: true, progress });
}

async function saveProgress(request, env) {
  const body = await readJson(request);
  const auth = await authenticateToken(env, body.token);
  if (!auth.ok) return json(request, env, { ok: false, error: auth.error }, auth.status);

  const progress = body.progress && typeof body.progress === "object" && !Array.isArray(body.progress) ? body.progress : {};
  const serialized = JSON.stringify(progress);
  if (serialized.length > 200000) return json(request, env, { ok: false, error: "progress_too_large" }, 413);

  await env.ENTITLEMENTS.put(`progress:${auth.payload.sub}`, serialized);
  return json(request, env, { ok: true, saved: true, saved_at: new Date().toISOString() });
}

async function authenticateToken(env, tokenValue) {
  const token = cleanString(tokenValue);
  const payload = await verifyAccessToken(env, token);
  if (!payload) return { ok: false, status: 401, error: "invalid_token" };
  const entitlement = await getJson(env.ENTITLEMENTS, `entitlement:${payload.sub}`);
  if (!entitlement || entitlement.active === false) return { ok: false, status: 403, error: "inactive_entitlement" };
  return { ok: true, payload, entitlement };
}

async function paidStateContent(env) {
  const key = cleanString(env.PAID_STATE_CONTENT_KEY) || DEFAULT_PAID_STATE_CONTENT_KEY;
  const content = await getJson(env.ENTITLEMENTS, key);
  if (!content || !Array.isArray(content.blueprints) || !content.blueprints.length) {
    return { ok: false, error: "paid_content_unavailable" };
  }
  return { ok: true, blueprints: content.blueprints };
}

function profile(code, name, examQuestions, nationalQuestions, stateQuestions) {
  return { code, name, examQuestions, nationalQuestions, stateQuestions };
}

function stateProfileFor(code) {
  const normalized = cleanString(code).toUpperCase();
  return STATE_PROFILES.find((item) => item.code === normalized) || STATE_PROFILES.find((item) => item.code === DEFAULT_STATE_CODE);
}

function statePoolTarget(profile) {
  return profile.examQuestions * STATE_POOL_MULTIPLIER;
}

function stateQuestionCountForMode(mode, profile) {
  if (mode === "mock") return profile.stateQuestions;
  if (mode === "mixed") return Math.min(25, statePoolTarget(profile));
  return Math.min(50, statePoolTarget(profile));
}

function nationalQuestionCountForMode(mode, profile) {
  if (mode === "mock") return profile.nationalQuestions;
  if (mode === "mixed") return 25;
  return 0;
}

function sessionNameForMode(mode, profile) {
  if (mode === "mock") return `${profile.name} 90% Readiness Exam`;
  if (mode === "mixed") return `${profile.name} Mixed Practice`;
  return `${profile.name} State Law Drill`;
}

function stateQuestionsForProfile(profile, blueprints, count) {
  const target = statePoolTarget(profile);
  const pool = Array.from({ length: target }, (_, index) => {
    const blueprint = blueprints[index % blueprints.length];
    const cycle = Math.floor(index / blueprints.length) + 1;
    return {
      sectionName: `${profile.name} State Law`,
      sourceSectionId: `state-${profile.code.toLowerCase()}`,
      stateCode: profile.code,
      topic: cleanString(blueprint.topic),
      prompt: `${profile.name} state law drill ${index + 1} - ${cleanString(blueprint.topic)}: ${fillTemplate(blueprint.prompt, profile, cycle, index)}`,
      correct: fillTemplate(blueprint.correct, profile, cycle, index),
      wrong: Array.isArray(blueprint.wrong) ? blueprint.wrong.map(cleanString).filter(Boolean) : [],
      explanation: fillTemplate(blueprint.explanation, profile, cycle, index),
      memory: cleanString(blueprint.memory)
    };
  });
  return shuffled(pool).slice(0, count);
}

function fillTemplate(value, profile, cycle, index) {
  return cleanString(value)
    .split("{state}")
    .join(profile.name)
    .split("{cycle}")
    .join(String(cycle))
    .split("{number}")
    .join(String(index + 1));
}

function shuffled(items) {
  const copy = items.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = cryptoRandomInt(index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function cryptoRandomInt(max) {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return bytes[0] % max;
}

function validatePaidSession(session, lineItems, env) {
  if (!session || session.object !== "checkout.session") return { ok: false, error: "session_not_found" };
  if (session.status !== "complete") return { ok: false, error: "checkout_incomplete" };
  if (session.payment_status !== "paid") return { ok: false, error: "payment_not_paid" };

  const currency = (env.EXPECTED_CURRENCY || "usd").toLowerCase();
  if ((session.currency || "").toLowerCase() !== currency) return { ok: false, error: "currency_mismatch" };

  const expectedAmount = Number(env.EXPECTED_AMOUNT_CENTS || "1900");
  if (Number(session.amount_total || 0) < expectedAmount) return { ok: false, error: "amount_mismatch" };

  const expectedPaymentLink = env.PAYMENT_LINK_ID || "";
  const expectedPrice = env.PRICE_ID || "";
  const linkMatches = expectedPaymentLink && session.payment_link === expectedPaymentLink;
  const priceMatches = Boolean(
    expectedPrice &&
      lineItems &&
      Array.isArray(lineItems.data) &&
      lineItems.data.some((item) => item.price && item.price.id === expectedPrice)
  );

  if ((expectedPaymentLink || expectedPrice) && !linkMatches && !priceMatches) return { ok: false, error: "product_mismatch" };
  return { ok: true };
}

async function stripeGet(env, path) {
  if (!env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not configured");
  const response = await fetch(`https://api.stripe.com${path}`, {
    headers: {
      authorization: `Bearer ${env.STRIPE_SECRET_KEY}`
    }
  });
  const payload = await response.json();
  if (!response.ok) {
    console.warn(JSON.stringify({ level: "warn", message: "stripe_request_failed", status: response.status, error: payload && payload.error && payload.error.message }));
    throw new Error("Stripe request failed");
  }
  return payload;
}

async function createAccessToken(env, entitlement, sessionId) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: "brique-education-access",
    aud: "briquerealty-education",
    sub: entitlement.emailHash,
    email: entitlement.email,
    plan: entitlement.plan || env.PLAN_ID || "all_state_exam_prep_full",
    session_id: sessionId,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS
  };
  const payloadPart = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const signature = await hmacSign(env.ACCESS_TOKEN_SECRET, payloadPart);
  return `${payloadPart}.${base64UrlEncode(signature)}`;
}

async function verifyAccessToken(env, token) {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const payloadPart = parts[0];
  const signature = base64UrlDecode(parts[1]);
  const valid = await hmacVerify(env.ACCESS_TOKEN_SECRET, payloadPart, signature);
  if (!valid) return null;

  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadPart)));
  const now = Math.floor(Date.now() / 1000);
  if (payload.iss !== "brique-education-access" || payload.aud !== "briquerealty-education" || !payload.sub || payload.exp <= now) return null;
  return payload;
}

async function hmacKey(secret) {
  if (!secret) throw new Error("ACCESS_TOKEN_SECRET is not configured");
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function hmacSign(secret, value) {
  const key = await hmacKey(secret);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

async function hmacVerify(secret, value, signature) {
  const key = await hmacKey(secret);
  return crypto.subtle.verify("HMAC", key, signature, encoder.encode(value));
}

async function sha256Hex(value) {
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function generateAccessCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  const chars = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
  return `BRQ-${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8, 12)}`;
}

function normalizeAccessCode(value) {
  return cleanString(value).toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function normalizeEmail(value) {
  const email = cleanString(value).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function cleanString(value) {
  return String(value || "").trim();
}

function stripeSummary(session, lineItems) {
  return {
    checkoutSessionId: session.id,
    paymentIntentId: session.payment_intent || "",
    paymentLinkId: session.payment_link || "",
    amountTotal: session.amount_total || 0,
    currency: session.currency || "",
    paymentStatus: session.payment_status || "",
    priceIds: lineItems && Array.isArray(lineItems.data) ? lineItems.data.map((item) => (item.price ? item.price.id : "")).filter(Boolean) : []
  };
}

async function readJson(request) {
  const text = await request.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (_error) {
    return {};
  }
}

async function getJson(kv, key) {
  const value = await kv.get(key);
  return value ? JSON.parse(value) : null;
}

function constantTimeEqual(a, b) {
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) diff |= left[index] ^ right[index];
  return diff === 0;
}

function base64UrlEncode(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function corsHeaders(request, env) {
  const origin = request.headers.get("origin") || "";
  const allowed = cleanString(env.ALLOWED_ORIGINS)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const headers = new Headers({
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,authorization",
    "access-control-max-age": "86400",
    vary: "Origin"
  });
  if (allowed.includes(origin)) headers.set("access-control-allow-origin", origin);
  return headers;
}

function json(request, env, payload, status = 200) {
  const headers = new Headers(JSON_HEADERS);
  corsHeaders(request, env).forEach((value, key) => headers.set(key, value));
  return new Response(JSON.stringify(payload), { status, headers });
}
