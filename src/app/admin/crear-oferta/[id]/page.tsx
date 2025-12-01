'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CrearOferta() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const requestId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<any>(null);
  const [quote, setQuote] = useState({
    title: '',
    description: '',
    itinerary: '',
    price: '',
    currency: 'USD',
    validUntil: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchRequest();
    }
  }, [status, router, requestId]);

  const fetchRequest = async () => {
    try {
      const response = await fetch(`/api/admin/travel-requests/${requestId}`);
      if (response.ok) {
        const data = await response.json();
        setRequest(data);

        const defaultValidUntil = new Date();
        defaultValidUntil.setDate(defaultValidUntil.getDate() + 7);
        setQuote({
          ...quote,
          validUntil: defaultValidUntil.toISOString().split('T')[0],
        });
      }
    } catch (error) {
      console.error('Error al cargar solicitud:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          userId: request.userId,
          ...quote,
          price: parseFloat(quote.price),
        }),
      });

      if (response.ok) {
        alert('Oferta creada y enviada al cliente exitosamente');
        router.push('/admin');
      } else {
        alert('Error al crear la oferta');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la oferta');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || !request) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vuela Vuela - Crear Oferta
            </h1>
            <button
              onClick={() => router.push('/admin')}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              Volver
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Información de la solicitud
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Cliente
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {request.userName} ({request.userEmail})
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Fechas
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {new Date(request.preferences.travelPeriod.startDate).toLocaleDateString('es-ES')} - {new Date(request.preferences.travelPeriod.endDate).toLocaleDateString('es-ES')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {request.preferences.daysAvailable} días
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Pasajeros
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {request.preferences.passengers.adults} adultos, {request.preferences.passengers.children} niños, {request.preferences.passengers.babies} bebés
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Destinos
                </h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                  {request.preferences.destinations.map((dest: string, idx: number) => (
                    <li key={idx}>{dest}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Alojamiento preferido
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {request.preferences.accommodationType.join(', ')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Actividades
                </h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                  {request.preferences.activities.map((activity: string, idx: number) => (
                    <li key={idx}>{activity}</li>
                  ))}
                </ul>
              </div>

              {request.preferences.otherPreferences && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Otras preferencias
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {request.preferences.otherPreferences}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Crear oferta
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título de la oferta
                </label>
                <input
                  type="text"
                  value={quote.title}
                  onChange={(e) => setQuote({ ...quote, title: e.target.value })}
                  placeholder="Ej: Viaje a París - 7 días"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={quote.description}
                  onChange={(e) => setQuote({ ...quote, description: e.target.value })}
                  rows={4}
                  placeholder="Describe brevemente la propuesta de viaje..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Itinerario detallado
                </label>
                <textarea
                  value={quote.itinerary}
                  onChange={(e) => setQuote({ ...quote, itinerary: e.target.value })}
                  rows={8}
                  placeholder="Día 1: Llegada a París...&#10;Día 2: Tour Eiffel...&#10;..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Precio
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={quote.price}
                    onChange={(e) => setQuote({ ...quote, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Moneda
                  </label>
                  <select
                    value={quote.currency}
                    onChange={(e) => setQuote({ ...quote, currency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="ARS">ARS</option>
                    <option value="MXN">MXN</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Válido hasta
                </label>
                <input
                  type="date"
                  value={quote.validUntil}
                  onChange={(e) => setQuote({ ...quote, validUntil: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-lg"
              >
                {loading ? 'Enviando...' : 'Enviar oferta al cliente'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
