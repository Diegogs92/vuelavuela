'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

export default function VerOferta() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const quoteId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<any>(null);

  const fetchQuote = useCallback(async () => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}`);
      if (response.ok) {
        const data = await response.json();
        setQuote(data);
      }
    } catch (error) {
      console.error('Error al cargar oferta:', error);
    }
  }, [quoteId]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchQuote();
    }
  }, [status, router, quoteId, fetchQuote]);

  const handleAccept = async () => {
    if (!confirm('¿Estás seguro de que deseas aceptar esta oferta?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/quotes/${quoteId}/accept`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('¡Oferta aceptada! Nos pondremos en contacto contigo pronto.');
        router.push('/dashboard');
      } else {
        alert('Error al aceptar la oferta');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al aceptar la oferta');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('¿Estás seguro de que deseas rechazar esta oferta?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/quotes/${quoteId}/reject`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Oferta rechazada. Puedes solicitar una nueva propuesta.');
        router.push('/dashboard');
      } else {
        alert('Error al rechazar la oferta');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al rechazar la oferta');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || !quote) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  const isExpired = new Date(quote.validUntil) < new Date();
  const canRespond = quote.status === 'pending' && !isExpired;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vuela Vuela
            </h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              Volver al dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          {quote.status === 'accepted' && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200">
              <p className="font-bold">Oferta aceptada</p>
              <p className="text-sm">Nos pondremos en contacto contigo pronto para finalizar los detalles.</p>
            </div>
          )}

          {quote.status === 'rejected' && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200">
              <p className="font-bold">Oferta rechazada</p>
              <p className="text-sm">Puedes solicitar una nueva propuesta desde tu dashboard.</p>
            </div>
          )}

          {isExpired && quote.status === 'pending' && (
            <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200">
              <p className="font-bold">Oferta expirada</p>
              <p className="text-sm">Esta oferta ya no está disponible. Contacta con nosotros para una nueva propuesta.</p>
            </div>
          )}

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {quote.title}
          </h1>

          <div className="mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {quote.description}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Itinerario
            </h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300">
                {quote.itinerary}
              </pre>
            </div>
          </div>

          <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Precio total
              </h2>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {quote.price} {quote.currency}
              </p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Válido hasta: {new Date(quote.validUntil).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {canRespond && (
            <div className="flex gap-4">
              <button
                onClick={handleAccept}
                disabled={loading}
                className="flex-1 px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-lg text-lg"
              >
                {loading ? 'Procesando...' : 'Aceptar oferta'}
              </button>
              <button
                onClick={handleReject}
                disabled={loading}
                className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold rounded-lg text-lg"
              >
                {loading ? 'Procesando...' : 'Rechazar oferta'}
              </button>
            </div>
          )}

          {!canRespond && quote.status === 'pending' && (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Esta oferta ya no está disponible para responder.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
