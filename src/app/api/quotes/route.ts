import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { adminDb } from '@/lib/firebase-admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { requestId, userId, title, description, itinerary, price, currency, validUntil } = body;

    const quote = {
      requestId,
      userId,
      title,
      description,
      itinerary,
      price,
      currency,
      validUntil,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection('quotes').add(quote);

    await adminDb.collection('travelRequests').doc(requestId).update({
      status: 'quoted',
      updatedAt: new Date().toISOString(),
    });

    const requestDoc = await adminDb.collection('travelRequests').doc(requestId).get();
    const requestData = requestDoc.data();

    await sendQuoteEmail(docRef.id, quote, requestData);

    return NextResponse.json(
      { message: 'Oferta creada exitosamente', id: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear oferta:', error);
    return NextResponse.json(
      { error: 'Error al crear la oferta' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const snapshot = await adminDb
      .collection('quotes')
      .where('userId', '==', session.user.id)
      .orderBy('createdAt', 'desc')
      .get();

    const quotes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Error al obtener ofertas:', error);
    return NextResponse.json(
      { error: 'Error al obtener ofertas' },
      { status: 500 }
    );
  }
}

async function sendQuoteEmail(quoteId: string, quote: any, requestData: any) {
  const emailContent = `
    <h1>¡Nueva Oferta de Viaje!</h1>
    <p>Hola ${requestData.userName},</p>
    <p>Hemos preparado una oferta especial para tu viaje:</p>

    <h2>${quote.title}</h2>
    <p>${quote.description}</p>

    <h3>Itinerario:</h3>
    <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${quote.itinerary}</pre>

    <h3>Precio:</h3>
    <p style="font-size: 24px; font-weight: bold; color: #2563eb;">
      ${quote.price} ${quote.currency}
    </p>

    <p><strong>Válido hasta:</strong> ${new Date(quote.validUntil).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}</p>

    <p>
      <a href="${process.env.NEXTAUTH_URL}/dashboard/ofertas/${quoteId}"
         style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
        Ver oferta completa
      </a>
    </p>

    <p>¿Te interesa? Ingresa a tu cuenta para aceptar o rechazar esta oferta.</p>

    <hr>
    <p style="font-size: 12px; color: #666;">
      Vuela Vuela - Tu agencia de viajes personalizada
    </p>
  `;

  try {
    await resend.emails.send({
      from: 'Vuela Vuela <onboarding@resend.dev>',
      to: requestData.userEmail,
      subject: `Nueva oferta de viaje: ${quote.title}`,
      html: emailContent,
    });
  } catch (error) {
    console.error('Error al enviar email:', error);
  }
}
