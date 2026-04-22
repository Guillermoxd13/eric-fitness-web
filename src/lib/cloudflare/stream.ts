// Cloudflare Stream signed URL helper.
// Docs: https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/
//
// Two modes supported:
//   1) Signing Key JWK + Key ID  — produce a short-lived JWT locally.
//   2) Fallback REST call        — POST /stream/:uid/token.
//
// Prefer (1): zero network hop on every request.

import crypto from "node:crypto";

export type SignedTokenOptions = {
  videoUid: string;
  ttlSeconds?: number;
  userId?: string;
};

function base64url(input: Buffer | string): string {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return b.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function jwkToPem(jwk: { kty: string; d?: string; n?: string; e?: string }): crypto.KeyObject {
  return crypto.createPrivateKey({ key: jwk as crypto.JsonWebKey, format: "jwk" });
}

/**
 * Sign a Cloudflare Stream playback token using a signing key (RS256).
 * Requires CLOUDFLARE_STREAM_SIGNING_KEY_ID and CLOUDFLARE_STREAM_SIGNING_KEY_JWK envs.
 */
export function signStreamToken({ videoUid, ttlSeconds = 3600, userId }: SignedTokenOptions): string {
  const keyId = process.env.CLOUDFLARE_STREAM_SIGNING_KEY_ID;
  const rawJwk = process.env.CLOUDFLARE_STREAM_SIGNING_KEY_JWK;
  if (!keyId || !rawJwk) {
    throw new Error("CLOUDFLARE_STREAM_SIGNING_KEY_ID and CLOUDFLARE_STREAM_SIGNING_KEY_JWK must be set");
  }

  const jwk = JSON.parse(rawJwk);
  const key = jwkToPem(jwk);

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", kid: keyId, typ: "JWT" };
  const payload: Record<string, unknown> = {
    sub: videoUid,
    kid: keyId,
    exp: now + ttlSeconds,
    nbf: now - 30,
    iat: now,
  };
  if (userId) payload.u = userId;

  const headerEnc = base64url(JSON.stringify(header));
  const payloadEnc = base64url(JSON.stringify(payload));
  const signingInput = `${headerEnc}.${payloadEnc}`;

  const signature = crypto.sign("RSA-SHA256", Buffer.from(signingInput), key);
  const sigEnc = base64url(signature);

  return `${signingInput}.${sigEnc}`;
}

/**
 * Fallback: request a signed token via Cloudflare's REST API.
 * Used when a local signing key isn't configured.
 */
export async function fetchStreamToken({ videoUid, ttlSeconds = 3600, userId }: SignedTokenOptions): Promise<string> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_STREAM_API_TOKEN;
  if (!accountId || !apiToken) {
    throw new Error("CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_STREAM_API_TOKEN must be set");
  }

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${videoUid}/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        exp: Math.floor(Date.now() / 1000) + ttlSeconds,
        downloadable: false,
        ...(userId ? { accessRules: [{ type: "any", action: "allow" }] } : {}),
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudflare Stream token API failed: ${res.status} ${text}`);
  }
  const body = (await res.json()) as { result?: { token?: string } };
  if (!body.result?.token) throw new Error("Cloudflare Stream token API returned no token");
  return body.result.token;
}

/**
 * Try local signing first; fall back to REST if the signing key isn't configured.
 */
export async function getStreamSignedToken(opts: SignedTokenOptions): Promise<string> {
  if (process.env.CLOUDFLARE_STREAM_SIGNING_KEY_ID && process.env.CLOUDFLARE_STREAM_SIGNING_KEY_JWK) {
    return signStreamToken(opts);
  }
  return fetchStreamToken(opts);
}
