import { VercelRequest, VercelResponse } from "@vercel/node";

export default function enableCors(res: VercelResponse, req: VercelRequest) {
  const allowedOrigins = [
    "https://maguinha-frontend.vercel.app",
    "http://localhost:5173",
  ];

  const origin = req.headers.origin || "";

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    // ❗ Handle preflight immediately
    res.status(200).end();
    return;
  }
}
