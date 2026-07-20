import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const cookieName = "samir_admin_session";
const sessionMaxAgeSeconds = 60 * 60 * 6;

function getSecret() {
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!password) {
    throw new Error("ADMIN_PASSWORD is not configured.");
  }

  if (process.env.NODE_ENV === "production") {
    if (!sessionSecret || sessionSecret.length < 32) {
      throw new Error(
        "ADMIN_SESSION_SECRET must be configured with at least 32 characters.",
      );
    }

    return sessionSecret;
  }

  return sessionSecret ?? password;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function verifyAdminPassword(password: string) {
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!configuredPassword) {
    return false;
  }

  return safeEqual(password, configuredPassword);
}

export function isAdminAuthConfigured() {
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  return Boolean(
    password &&
      password.length >= 16 &&
      (process.env.NODE_ENV !== "production" ||
        (sessionSecret && sessionSecret.length >= 32)),
  );
}

export function createAdminSessionResponse() {
  const expiresAt = Date.now() + sessionMaxAgeSeconds * 1000;
  const payload = Buffer.from(
    JSON.stringify({ version: 1, expiresAt }),
  ).toString("base64url");
  const token = `${payload}.${sign(payload)}`;
  const response = NextResponse.json({ ok: true });

  response.cookies.set(cookieName, token, {
    httpOnly: true,
    maxAge: sessionMaxAgeSeconds,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}

export function clearAdminSessionResponse() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, "", {
    httpOnly: true,
    maxAge: 0,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}

export function isAdminRequest(request: NextRequest) {
  try {
    const token = request.cookies.get(cookieName)?.value;

    if (!token) {
      return false;
    }

    const [payload, signature] = token.split(".");

    if (!payload || !signature || !safeEqual(signature, sign(payload))) {
      return false;
    }

    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { version?: number; expiresAt?: number };

    return (
      session.version === 1 &&
      typeof session.expiresAt === "number" &&
      session.expiresAt > Date.now()
    );
  } catch {
    return false;
  }
}
