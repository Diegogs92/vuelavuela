import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const doc = await adminDb.collection('quotes').doc(params.id).get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Oferta no encontrada' },
        { status: 404 }
      );
    }

    const quote = { id: doc.id, ...doc.data() };

    if (quote.userId !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error al obtener oferta:', error);
    return NextResponse.json(
      { error: 'Error al obtener oferta' },
      { status: 500 }
    );
  }
}
