import axios from "axios";

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

export default async function handler(req, res) {
  enableCors(req);
  if (req.method !== "GET") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  const paymentId = req.query.paymentId;

  if (!paymentId || typeof paymentId !== "string") {
    res
      .status(400)
      .json({ error: "paymentId é obrigatório e deve ser string" });
    return;
  }

  try {
    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao consultar pagamento" });
  }
}
