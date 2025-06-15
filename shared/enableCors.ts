export default function enableCors(res: any) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://maguinha-frontend.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}
