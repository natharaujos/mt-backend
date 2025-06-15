import axios from "axios";
import enableCors from "../shared/enableCors";
import { VercelRequest, VercelResponse } from "@vercel/node";

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

interface Item {
  title: string;
  quantity: number;
  currency_id: string;
  unit_price: number;
}

interface Payer {
  name: string;
  email?: string;
}

interface BackUrls {
  success: string;
  failure: string;
  pending?: string;
}

interface PreferenceRequestBody {
  external_reference: string;
  items: Item[];
  payer: Payer;
  back_urls: BackUrls;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const preflightHandled = enableCors(res, req);
  if (preflightHandled) {
    // OPTIONS request ended here, just return early
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  const body: PreferenceRequestBody = req.body;

  try {
    const response = await axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      {
        external_reference: body.external_reference,
        items: body.items,
        payer: body.payer,
        payment_methods: {
          excluded_payment_types: [
            { id: "credit_card" },
            { id: "debit_card" },
            { id: "ticket" },
          ],
          default_payment_method_id: "pix",
        },
        back_urls: body.back_urls,
        auto_return: "approved",
        binary_mode: true,
      },
      {
        headers: {
          Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao criar preferência PIX" });
  }
}
