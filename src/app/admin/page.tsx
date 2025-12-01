'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface TravelRequest {
  id: string;
  userName: string;
  userEmail: string;
  status: string;
  createdAt: string;
  preferences: any;
}

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<TravelRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<TravelRequest | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchRequests();
    }
  }, [status, router]);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/admin/travel-requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
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
              Vuela Vuela - Admin
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

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Solicitudes de viaje
            </h2>
            <button
              onClick={fetchRequests}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Actualizar
            </button>
          </div>

          {requests.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No hay solicitudes aún
            </p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {request.userName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {request.userEmail}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(request.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                        request.status
                      )}`}
                    >
                      {getStatusText(request.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Fechas
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(
                          request.preferences.travelPeriod.startDate
                        ).toLocaleDateString('es-ES')}{' '}
                        -{' '}
                        {new Date(
                          request.preferences.travelPeriod.endDate
                        ).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Días
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {request.preferences.daysAvailable}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Pasajeros
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {request.preferences.passengers.adults}A /{' '}
                        {request.preferences.passengers.children}N /{' '}
                        {request.preferences.passengers.babies}B
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Destinos
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {request.preferences.destinations.slice(0, 2).join(', ')}
                        {request.preferences.destinations.length > 2 && '...'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                    >
                      Ver detalles
                    </button>
                    {request.status === 'pending' && (
                      <button
                        onClick={() => router.push(`/admin/crear-oferta/${request.id}`)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                      >
                        Crear oferta
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedRequest && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Detalles de la solicitud
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Cliente
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedRequest.userName} ({selectedRequest.userEmail})
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Período de viaje
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {new Date(
                    selectedRequest.preferences.travelPeriod.startDate
                  ).toLocaleDateString('es-ES')}{' '}
                  -{' '}
                  {new Date(
                    selectedRequest.preferences.travelPeriod.endDate
                  ).toLocaleDateString('es-ES')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fechas flexibles:{' '}
                  {selectedRequest.preferences.travelPeriod.flexible ? 'Sí' : 'No'}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Destinos deseados
                </h4>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                  {selectedRequest.preferences.destinations.map(
                    (dest: string, idx: number) => (
                      <li key={idx}>{dest}</li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Tipo de alojamiento
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedRequest.preferences.accommodationType.join(', ') ||
                    'No especificado'}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Actividades de interés
                </h4>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                  {selectedRequest.preferences.activities.map(
                    (activity: string, idx: number) => (
                      <li key={idx}>{activity}</li>
                    )
                  )}
                </ul>
              </div>

              {selectedRequest.preferences.otherPreferences && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Otras preferencias
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedRequest.preferences.otherPreferences}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  router.push(`/admin/crear-oferta/${selectedRequest.id}`);
                }}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Crear oferta
              </button>
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
