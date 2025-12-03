'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TravelPreferences } from '@/types';
import PlaneLoader from '@/components/PlaneLoader';

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
      <main className="flex min-h-screen flex-col items-center justify-center bg-background">
        <PlaneLoader size="large" />
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
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'No se pudo procesar la solicitud'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Por favor, intenta de nuevo.');
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

  const stepTitles = [
    'ITINERARIO',
    'PASAJEROS',
    'DESTINOS',
    'PREFERENCIAS'
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Kiosk Header */}
      <nav className="bg-card border-b-4 border-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                <svg className="w-9 h-9 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-foreground">VUELA VUELA</div>
                <div className="font-mono text-xs text-muted-foreground">CHECK-IN AUTOMATIZADO</div>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-background border-2 border-border hover:border-destructive rounded-xl px-4 py-2 text-sm font-bold transition-all"
            >
              CANCELAR
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Kiosk Main Panel */}
        <div className="bg-card border-4 border-border rounded-2xl overflow-hidden shadow-2xl">
          {/* Kiosk Screen Header */}
          <div className="bg-gradient-to-r from-primary via-accent to-primary p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative z-10">
              <div className="font-mono text-sm text-white/80 mb-2">PROCESO DE CHECK-IN</div>
              <div className="text-4xl font-black text-white mb-2">NUEVA SOLICITUD DE VIAJE</div>
              <div className="text-sm text-white/90">PASAJERO: {session.user?.name?.toUpperCase()}</div>
            </div>
          </div>

          {/* Progress Indicator - Kiosk Style */}
          <div className="bg-muted border-b-2 border-border">
            <div className="max-w-3xl mx-auto px-8 py-6">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className={`flex flex-col items-center ${s < 4 ? 'flex-1' : ''}`}>
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center font-black text-xl transition-all border-4 ${
                        step >= s
                          ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-110'
                          : 'bg-background text-muted-foreground border-border'
                      }`}
                    >
                      {step > s ? '✓' : s}
                    </div>
                    <div className={`mt-2 font-mono text-xs font-bold ${step >= s ? 'text-primary' : 'text-muted-foreground'}`}>
                      {stepTitles[s - 1]}
                    </div>
                    {s < 4 && (
                      <div className="hidden md:block absolute w-full h-1 top-8 left-1/2 -ml-1/2" style={{width: 'calc(100% - 4rem)'}}>
                        <div className={`h-1 ${step > s ? 'bg-primary' : 'bg-border'} transition-colors`}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8">
            {/* Step 1: Travel Dates */}
            {step === 1 && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="bg-primary/5 border-2 border-primary rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-2xl font-black text-foreground">FECHA DEL VUELO</h3>
                  </div>
                  <p className="text-muted-foreground">Selecciona las fechas de tu viaje</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-background border-2 border-border rounded-xl p-4">
                    <label className="block font-mono text-xs text-muted-foreground mb-2">SALIDA / DEPARTURE</label>
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
                      className="w-full px-4 py-3 border-2 border-border rounded-lg bg-card text-foreground text-lg font-bold focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                  <div className="bg-background border-2 border-border rounded-xl p-4">
                    <label className="block font-mono text-xs text-muted-foreground mb-2">REGRESO / RETURN</label>
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
                      className="w-full px-4 py-3 border-2 border-border rounded-lg bg-card text-foreground text-lg font-bold focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="bg-secondary/10 border-2 border-secondary rounded-xl p-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
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
                      className="w-6 h-6 text-secondary rounded border-2 border-secondary focus:ring-secondary"
                    />
                    <div>
                      <div className="text-lg font-bold text-foreground">Fechas flexibles</div>
                      <div className="text-sm text-muted-foreground">Puedo ajustar mis fechas para mejores tarifas</div>
                    </div>
                  </label>
                </div>

                <div className="bg-background border-2 border-border rounded-xl p-6">
                  <label className="block font-mono text-xs text-muted-foreground mb-3">DURACIÓN DEL VIAJE</label>
                  <div className="flex items-center gap-4">
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
                      className="w-32 px-4 py-3 border-2 border-border rounded-lg bg-card text-foreground text-3xl font-black text-center focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                    <div className="text-2xl font-bold text-muted-foreground">DÍAS</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Passengers */}
            {step === 2 && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="bg-accent/5 border-2 border-accent rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-2xl font-black text-foreground">PASAJEROS</h3>
                  </div>
                  <p className="text-muted-foreground">¿Cuántas personas viajarán?</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-background border-2 border-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-lg font-bold text-foreground">Adultos</div>
                        <div className="text-sm text-muted-foreground font-mono">+12 AÑOS</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setPreferences({...preferences, passengers: {...preferences.passengers, adults: Math.max(1, preferences.passengers.adults - 1)}})}
                          className="w-12 h-12 rounded-xl bg-muted hover:bg-destructive hover:text-destructive-foreground border-2 border-border font-black text-xl transition-all"
                        >
                          −
                        </button>
                        <div className="w-20 h-12 flex items-center justify-center text-3xl font-black text-primary bg-primary/10 rounded-xl border-2 border-primary">
                          {preferences.passengers.adults}
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreferences({...preferences, passengers: {...preferences.passengers, adults: preferences.passengers.adults + 1}})}
                          className="w-12 h-12 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground border-2 border-border font-black text-xl transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background border-2 border-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-lg font-bold text-foreground">Niños</div>
                        <div className="text-sm text-muted-foreground font-mono">2-12 AÑOS</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setPreferences({...preferences, passengers: {...preferences.passengers, children: Math.max(0, preferences.passengers.children - 1)}})}
                          className="w-12 h-12 rounded-xl bg-muted hover:bg-destructive hover:text-destructive-foreground border-2 border-border font-black text-xl transition-all"
                        >
                          −
                        </button>
                        <div className="w-20 h-12 flex items-center justify-center text-3xl font-black text-secondary bg-secondary/10 rounded-xl border-2 border-secondary">
                          {preferences.passengers.children}
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreferences({...preferences, passengers: {...preferences.passengers, children: preferences.passengers.children + 1}})}
                          className="w-12 h-12 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground border-2 border-border font-black text-xl transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background border-2 border-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-lg font-bold text-foreground">Bebés</div>
                        <div className="text-sm text-muted-foreground font-mono">0-2 AÑOS</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setPreferences({...preferences, passengers: {...preferences.passengers, babies: Math.max(0, preferences.passengers.babies - 1)}})}
                          className="w-12 h-12 rounded-xl bg-muted hover:bg-destructive hover:text-destructive-foreground border-2 border-border font-black text-xl transition-all"
                        >
                          −
                        </button>
                        <div className="w-20 h-12 flex items-center justify-center text-3xl font-black text-accent bg-accent/10 rounded-xl border-2 border-accent">
                          {preferences.passengers.babies}
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreferences({...preferences, passengers: {...preferences.passengers, babies: preferences.passengers.babies + 1}})}
                          className="w-12 h-12 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground border-2 border-border font-black text-xl transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 border-2 border-primary/30 rounded-xl p-4 text-center">
                  <div className="font-mono text-sm text-muted-foreground">TOTAL DE PASAJEROS</div>
                  <div className="text-4xl font-black text-primary mt-1">
                    {preferences.passengers.adults + preferences.passengers.children + preferences.passengers.babies}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Destinations */}
            {step === 3 && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="bg-primary/5 border-2 border-primary rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                    </svg>
                    <h3 className="text-2xl font-black text-foreground">DESTINOS</h3>
                  </div>
                  <p className="text-muted-foreground">¿A dónde quieres volar?</p>
                </div>

                <div className="bg-background border-2 border-border rounded-xl p-6">
                  <label className="block font-mono text-xs text-muted-foreground mb-3">AGREGAR DESTINO</label>
                  <div className="flex gap-3">
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
                      className="flex-1 px-6 py-4 border-2 border-border rounded-xl bg-card text-foreground text-lg focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddDestination}
                      className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-black transition-all shadow-lg text-lg"
                    >
                      + AÑADIR
                    </button>
                  </div>

                  <div className="mt-6 space-y-2">
                    {preferences.destinations.map((dest, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-primary/10 border-2 border-primary rounded-xl p-4 group hover:bg-primary/20 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="text-lg font-bold text-foreground">{dest}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDestination(index)}
                          className="w-10 h-10 rounded-lg bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground border-2 border-destructive flex items-center justify-center font-black text-xl transition-all"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {preferences.destinations.length === 0 && (
                    <div className="mt-4 bg-secondary/10 border-2 border-secondary/30 rounded-xl p-6 text-center">
                      <svg className="w-12 h-12 text-secondary/50 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div className="text-sm font-mono text-muted-foreground">Debes agregar al menos un destino</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Preferences */}
            {step === 4 && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="bg-secondary/5 border-2 border-secondary rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <h3 className="text-2xl font-black text-foreground">PREFERENCIAS</h3>
                  </div>
                  <p className="text-muted-foreground">Personaliza tu experiencia de viaje</p>
                </div>

                <div className="bg-background border-2 border-border rounded-xl p-6">
                  <label className="block font-mono text-xs text-muted-foreground mb-4">TIPO DE ALOJAMIENTO</label>
                  <div className="grid grid-cols-2 gap-3">
                    {accommodationTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleAccommodationToggle(type)}
                        className={`px-6 py-4 rounded-xl font-bold text-center transition-all border-2 ${
                          preferences.accommodationType.includes(type)
                            ? 'border-primary bg-primary text-primary-foreground shadow-lg scale-105'
                            : 'border-border bg-card hover:border-primary/50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-background border-2 border-border rounded-xl p-6">
                  <label className="block font-mono text-xs text-muted-foreground mb-3">ACTIVIDADES DE INTERÉS</label>
                  <div className="flex gap-3 mb-4">
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
                      className="flex-1 px-6 py-3 border-2 border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-4 focus:ring-secondary/20 focus:border-secondary"
                    />
                    <button
                      type="button"
                      onClick={handleAddActivity}
                      className="px-8 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl font-black transition-all shadow-lg"
                    >
                      + AÑADIR
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {preferences.activities.map((activity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary border-2 border-secondary rounded-xl font-bold"
                      >
                        {activity}
                        <button
                          type="button"
                          onClick={() => handleRemoveActivity(index)}
                          className="w-6 h-6 rounded-lg bg-destructive/20 hover:bg-destructive text-destructive hover:text-destructive-foreground flex items-center justify-center font-black transition-all"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-background border-2 border-border rounded-xl p-6">
                  <label className="block font-mono text-xs text-muted-foreground mb-3">INFORMACIÓN ADICIONAL</label>
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
                    className="w-full px-6 py-4 border-2 border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent resize-none"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons - Kiosk Style */}
            <div className="flex justify-between mt-10 pt-8 border-t-2 border-border">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 px-8 py-4 border-2 border-border text-foreground rounded-xl hover:bg-muted transition-all font-bold text-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  ANTERIOR
                </button>
              ) : (
                <div></div>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={step === 3 && preferences.destinations.length === 0}
                  className="ml-auto flex items-center gap-2 px-10 py-4 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground rounded-xl transition-all font-black text-lg shadow-lg disabled:shadow-none"
                >
                  SIGUIENTE
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 disabled:from-muted disabled:to-muted text-white rounded-xl transition-all font-black text-xl shadow-2xl disabled:shadow-none"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      PROCESANDO...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                      </svg>
                      CONFIRMAR VUELO
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
