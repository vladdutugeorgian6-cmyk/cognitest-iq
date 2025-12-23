import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia' as any,
});

export async function POST(req: Request) {
  try {
    // 1. Primim priceId ȘI score de la frontend
    const body = await req.json();
    const { priceId, score } = body;
    
    if (!priceId) {
      return NextResponse.json({ error: "Price ID is missing" }, { status: 400 });
    }

    // 2. Creăm sesiunea Stripe cu parametrul MAGIC în URL
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      // AICI ESTE SECRETUL: Adăugăm &score=${score} la link-ul de succes
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/results?session_id={CHECKOUT_SESSION_ID}&score=${score}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?score=${score}`,
    });

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error("STRIPE ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}