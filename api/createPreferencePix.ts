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

export const config = {
  api: {
    bodyParser: true,
    methods: ["POST", "OPTIONS"],
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const preflightHandled = enableCors(res, req);
  if (preflightHandled) {
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
          excluded_payment_types: [{ id: "ticket" }, { id: "atm" }],
        },
        binary_mode: true,
        back_urls: {
          success: `https://maguinhatuquinho.web.app/payment/${body.external_reference}`,
          failure: `https://maguinhatuquinho.web.app/payment/${body.external_reference}`,
          pending: `https://maguinhatuquinho.web.app/payment/${body.external_reference}`,
        },
        auto_return: "all",
      },
      {
        headers: {
          Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Retorna só os dados do QR Code PIX e init_point para redirecionamento
    const { point_of_interaction, init_point } = response.data;

    res.status(200).json({
      qr_code: point_of_interaction?.transaction_data?.qr_code || null,
      qr_code_base64:
        point_of_interaction?.transaction_data?.qr_code_base64 || null,
      init_point,
    });
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao criar preferência PIX" });
  }
}
