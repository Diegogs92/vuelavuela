import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { adminDb } from '@/lib/firebase-admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const quoteDoc = await adminDb.collection('quotes').doc(id).get();

    if (!quoteDoc.exists) {
      return NextResponse.json(
        { error: 'Oferta no encontrada' },
        { status: 404 }
      );
    }

    const quote = quoteDoc.data();

    if (quote?.userId !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    if (quote?.status !== 'pending') {
      return NextResponse.json(
        { error: 'Esta oferta ya fue respondida' },
        { status: 400 }
      );
    }

    await adminDb.collection('quotes').doc(id).update({
      status: 'rejected',
      updatedAt: new Date().toISOString(),
    });

    await adminDb.collection('travelRequests').doc(quote.requestId).update({
      status: 'rejected',
      updatedAt: new Date().toISOString(),
    });

    await sendRejectionEmailToAgent(id, quote, session.user);

    return NextResponse.json({ message: 'Oferta rechazada' });
  } catch (error) {
    console.error('Error al rechazar oferta:', error);
    return NextResponse.json(
      { error: 'Error al rechazar oferta' },
      { status: 500 }
    );
  }
}

async function sendRejectionEmailToAgent(quoteId: string, quote: any, user: any) {
  const emailContent = `
    <h1>Oferta Rechazada</h1>
    <p>El cliente ${user.name} (${user.email}) ha rechazado la siguiente oferta:</p>

    <h2>${quote.title}</h2>
    <p><strong>Precio:</strong> ${quote.price} ${quote.currency}</p>

    <p><strong>ID de oferta:</strong> ${quoteId}</p>
    <p><strong>ID de solicitud:</strong> ${quote.requestId}</p>

    <hr>
    <p>Puedes contactar al cliente para entender sus necesidades o crear una nueva propuesta.</p>
  `;

  try {
    await resend.emails.send({
      from: 'Vuela Vuela <onboarding@resend.dev>',
      to: process.env.AGENT_EMAIL || 'tu_email@ejemplo.com',
      subject: `Oferta rechazada por ${user.name}`,
      html: emailContent,
    });
  } catch (error) {
    console.error('Error al enviar email:', error);
  }
}
