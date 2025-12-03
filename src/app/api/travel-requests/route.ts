import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
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
    const { preferences, userEmail, userName } = body;

    const travelRequest = {
      userId: session.user.id,
      userEmail,
      userName,
      preferences,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Intentando guardar solicitud en Firestore...', { userId: session.user.id });
    const docRef = await adminDb.collection('travelRequests').add(travelRequest);
    console.log('Solicitud guardada exitosamente:', docRef.id);

    // Intentar enviar email, pero no fallar si hay error
    try {
      await sendEmailToAgent(docRef.id, travelRequest);
    } catch (emailError) {
      console.error('Error al enviar email (continuando):', emailError);
    }

    return NextResponse.json(
      { message: 'Solicitud creada exitosamente', id: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    return NextResponse.json(
      { error: 'Error al crear la solicitud' },
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
      .collection('travelRequests')
      .where('userId', '==', session.user.id)
      .orderBy('createdAt', 'desc')
      .get();

    const requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    return NextResponse.json(
      { error: 'Error al obtener solicitudes' },
      { status: 500 }
    );
  }
}

async function sendEmailToAgent(requestId: string, travelRequest: any) {
  const { preferences, userName, userEmail } = travelRequest;

  const emailContent = `
    <h1>Nueva Solicitud de Viaje</h1>
    <h2>Cliente: ${userName}</h2>
    <p><strong>Email:</strong> ${userEmail}</p>

    <h3>Detalles del Viaje:</h3>
    <ul>
      <li><strong>Fechas:</strong> ${preferences.travelPeriod.startDate} - ${preferences.travelPeriod.endDate}</li>
      <li><strong>Fechas flexibles:</strong> ${preferences.travelPeriod.flexible ? 'Sí' : 'No'}</li>
      <li><strong>Días disponibles:</strong> ${preferences.daysAvailable}</li>
    </ul>

    <h3>Pasajeros:</h3>
    <ul>
      <li>Adultos: ${preferences.passengers.adults}</li>
      <li>Niños: ${preferences.passengers.children}</li>
      <li>Bebés: ${preferences.passengers.babies}</li>
    </ul>

    <h3>Destinos:</h3>
    <ul>
      ${preferences.destinations.map((dest: string) => `<li>${dest}</li>`).join('')}
    </ul>

    <h3>Tipo de alojamiento:</h3>
    <ul>
      ${preferences.accommodationType.map((type: string) => `<li>${type}</li>`).join('')}
    </ul>

    <h3>Actividades de interés:</h3>
    <ul>
      ${preferences.activities.map((activity: string) => `<li>${activity}</li>`).join('')}
    </ul>

    <h3>Otras preferencias:</h3>
    <p>${preferences.otherPreferences || 'Ninguna'}</p>

    <hr>
    <p><strong>ID de solicitud:</strong> ${requestId}</p>
  `;

  try {
    await resend.emails.send({
      from: 'Vuela Vuela <onboarding@resend.dev>',
      to: process.env.AGENT_EMAIL || 'tu_email@ejemplo.com',
      subject: `Nueva solicitud de viaje de ${userName}`,
      html: emailContent,
    });
  } catch (error) {
    console.error('Error al enviar email:', error);
  }
}
