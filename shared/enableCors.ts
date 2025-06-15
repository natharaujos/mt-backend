import { VercelRequest, VercelResponse } from "@vercel/node";

export default function enableCors(
  res: VercelResponse,
  req: VercelRequest
): boolean {
  const allowedOrigins = [
    "https://maguinha-frontend.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ];

  const origin = req.headers.origin || "";

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true; // Preflight handled
  }

  return false; // Continue with main handler
}
