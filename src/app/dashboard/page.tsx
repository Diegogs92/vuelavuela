'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [requests, setRequests] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchData();
      if (searchParams.get('success') === 'true') {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      }
    }
  }, [status, router, searchParams]);

  const fetchData = async () => {
    try {
      const [requestsRes, quotesRes] = await Promise.all([
        fetch('/api/travel-requests'),
        fetch('/api/quotes'),
      ]);

      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        setRequests(requestsData);
      }

      if (quotesRes.ok) {
        const quotesData = await quotesRes.json();
        setQuotes(quotesData);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      quoted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: 'Pendiente',
      quoted: 'Cotizada',
      accepted: 'Aceptada',
      rejected: 'Rechazada',
    };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vuela Vuela
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {session.user?.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 rounded">
            <p className="font-bold">Solicitud enviada exitosamente</p>
            <p className="text-sm">Te enviaremos una propuesta pronto a tu correo electrónico.</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bienvenido, {session.user?.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            ¿Listo para planificar tu próximo viaje? Cuéntanos tus preferencias y te prepararemos una propuesta personalizada.
          </p>
          <Link
            href="/dashboard/nueva-solicitud"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Nueva solicitud de viaje
          </Link>
        </div>

        {quotes.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ofertas recibidas
            </h3>
            <div className="space-y-4">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {quote.title}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        quote.status
                      )}`}
                    >
                      {getStatusText(quote.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {quote.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {quote.price} {quote.currency}
                    </p>
                    <Link
                      href={`/dashboard/ofertas/${quote.id}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                    >
                      Ver oferta
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Mis solicitudes
          </h3>
          {requests.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              Aún no tienes solicitudes de viaje. ¡Crea tu primera solicitud!
            </p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(request.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-gray-900 dark:text-white mt-1">
                        Destinos: {request.preferences.destinations.join(', ')}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {request.preferences.daysAvailable} días
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        request.status
                      )}`}
                    >
                      {getStatusText(request.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    }>
      <DashboardContent />
    </Suspense>
  );
}
