// Importa as interfaces NextApiRequest e NextApiResponse de "next" e a biblioteca Stripe de "../../lib/stripe"
import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../lib/stripe";

// Define a função handler que recebe uma solicitação NextApiRequest e uma resposta NextApiResponse
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Obtém o ID do preço do produto a partir do corpo da solicitação
  const { priceId } = req.body;

  // Verifica se o método da solicitação é POST
  if (req.method !== "POST") {
    // Retorna uma resposta JSON com um erro 405 (Método não permitido)
    return res.status(405).json({ error: "Method not allowed." });
  }
  
  // Verifica se o ID do preço do produto está presente
  if (!priceId) {
    // Retorna uma resposta JSON com um erro 400 (Solicitação incorreta)
    return res.status(400).json({ error: 'Price not found.' });
  }
  
  // Cria as URLs de sucesso e cancelamento da sessão de checkout
  const successUrl = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${process.env.NEXT_URL}/`;

  // Cria uma sessão de checkout no Stripe com as informações do produto e das URLs de sucesso e cancelamento
  const checkoutSession = await stripe.checkout.sessions.create({
    success_url: successUrl,
    cancel_url: cancelUrl,
    mode: 'payment',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      }
    ]
  })

  // Retorna uma resposta JSON com a URL de checkout da sessão de checkout recém-criada
  return res.status(201).json({
    checkoutUrl: checkoutSession.url
  })
}
