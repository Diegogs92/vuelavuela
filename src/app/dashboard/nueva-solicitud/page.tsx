'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TravelPreferences } from '@/types';

export default function NuevaSolicitud() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [preferences, setPreferences] = useState<TravelPreferences>({
    travelPeriod: {
      startDate: '',
      endDate: '',
      flexible: false,
    },
    daysAvailable: 7,
    passengers: {
      adults: 1,
      children: 0,
      babies: 0,
    },
    destinations: [],
    accommodationType: [],
    activities: [],
    otherPreferences: '',
  });

  const [destinationInput, setDestinationInput] = useState('');
  const [activityInput, setActivityInput] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  const handleAddDestination = () => {
    if (destinationInput.trim()) {
      setPreferences({
        ...preferences,
        destinations: [...preferences.destinations, destinationInput.trim()],
      });
      setDestinationInput('');
    }
  };

  const handleRemoveDestination = (index: number) => {
    setPreferences({
      ...preferences,
      destinations: preferences.destinations.filter((_, i) => i !== index),
    });
  };

  const handleAddActivity = () => {
    if (activityInput.trim()) {
      setPreferences({
        ...preferences,
        activities: [...preferences.activities, activityInput.trim()],
      });
      setActivityInput('');
    }
  };

  const handleRemoveActivity = (index: number) => {
    setPreferences({
      ...preferences,
      activities: preferences.activities.filter((_, i) => i !== index),
    });
  };

  const handleAccommodationToggle = (type: string) => {
    if (preferences.accommodationType.includes(type)) {
      setPreferences({
        ...preferences,
        accommodationType: preferences.accommodationType.filter((t) => t !== type),
      });
    } else {
      setPreferences({
        ...preferences,
        accommodationType: [...preferences.accommodationType, type],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/travel-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences,
          userEmail: session.user?.email,
          userName: session.user?.name,
        }),
      });

      if (response.ok) {
        router.push('/dashboard?success=true');
      } else {
        alert('Error al enviar la solicitud. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar la solicitud. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const accommodationTypes = [
    'Hotel',
    'Resort',
    'Apartamento',
    'Casa vacacional',
    'Hostel',
    'Bed & Breakfast',
  ];

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

      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Nueva solicitud de viaje
          </h2>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`flex items-center ${s < 4 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step >= s
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 4 && (
                    <div
                      className={`h-1 flex-1 mx-2 ${
                        step > s ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs text-center text-gray-600 dark:text-gray-400">
              <div>Fechas</div>
              <div>Pasajeros</div>
              <div>Destinos</div>
              <div>Preferencias</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  ¿Cuándo quieres viajar?
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha de inicio
                    </label>
                    <input
                      type="date"
                      value={preferences.travelPeriod.startDate}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          travelPeriod: {
                            ...preferences.travelPeriod,
                            startDate: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha de fin
                    </label>
                    <input
                      type="date"
                      value={preferences.travelPeriod.endDate}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          travelPeriod: {
                            ...preferences.travelPeriod,
                            endDate: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="flexible"
                    checked={preferences.travelPeriod.flexible}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        travelPeriod: {
                          ...preferences.travelPeriod,
                          flexible: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label
                    htmlFor="flexible"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Fechas flexibles
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Días disponibles
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={preferences.daysAvailable}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        daysAvailable: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  ¿Cuántas personas van a viajar?
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Adultos
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={preferences.passengers.adults}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        passengers: {
                          ...preferences.passengers,
                          adults: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Niños (2-12 años)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={preferences.passengers.children}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        passengers: {
                          ...preferences.passengers,
                          children: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bebés (0-2 años)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={preferences.passengers.babies}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        passengers: {
                          ...preferences.passengers,
                          babies: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  ¿A dónde te gustaría ir?
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Destinos deseados
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={destinationInput}
                      onChange={(e) => setDestinationInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddDestination();
                        }
                      }}
                      placeholder="Ej: París, Francia"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddDestination}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Agregar
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {preferences.destinations.map((dest, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {dest}
                        <button
                          type="button"
                          onClick={() => handleRemoveDestination(index)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  {preferences.destinations.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Agrega al menos un destino
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Preferencias de alojamiento y actividades
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de alojamiento
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {accommodationTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleAccommodationToggle(type)}
                        className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                          preferences.accommodationType.includes(type)
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Actividades de interés
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={activityInput}
                      onChange={(e) => setActivityInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddActivity();
                        }
                      }}
                      placeholder="Ej: Buceo, Museos, Senderismo"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddActivity}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Agregar
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {preferences.activities.map((activity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm"
                      >
                        {activity}
                        <button
                          type="button"
                          onClick={() => handleRemoveActivity(index)}
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Otras preferencias
                  </label>
                  <textarea
                    value={preferences.otherPreferences}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        otherPreferences: e.target.value,
                      })
                    }
                    rows={4}
                    placeholder="Cuéntanos cualquier otra preferencia, necesidad especial o información que debamos tener en cuenta..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:border-gray-400 dark:hover:border-gray-500"
                >
                  Anterior
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 3 && preferences.destinations.length === 0)
                  }
                  className="ml-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-lg"
                >
                  {loading ? 'Enviando...' : 'Enviar solicitud'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
