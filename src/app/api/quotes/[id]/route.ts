import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const doc = await adminDb.collection('quotes').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Oferta no encontrada' },
        { status: 404 }
      );
    }

    const quoteData = doc.data() as any;
    const quote = { id: doc.id, ...quoteData };

    if (quoteData.userId !== session.user.id) {
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
