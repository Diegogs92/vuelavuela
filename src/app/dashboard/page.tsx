'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import PlaneLoader from '@/components/PlaneLoader';

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [requests, setRequests] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
      <main className="flex min-h-screen flex-col items-center justify-center bg-background">
        <PlaneLoader size="large" />
      </main>
    );
  }

  if (!session) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-secondary/20 text-secondary-foreground border-2 border-secondary',
      quoted: 'bg-primary/20 text-primary border-2 border-primary',
      accepted: 'bg-accent/20 text-accent-foreground border-2 border-accent',
      rejected: 'bg-destructive/20 text-destructive-foreground border-2 border-destructive',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: 'PROGRAMADO',
      quoted: 'EN PUERTA',
      accepted: 'EMBARCANDO',
      rejected: 'CANCELADO',
    };
    return texts[status as keyof typeof texts] || status.toUpperCase();
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Airport Control Tower Header */}
      <nav className="bg-card border-b-4 border-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo & Terminal Info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                <svg className="w-9 h-9 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-foreground tracking-tight">VUELA VUELA</div>
                <div className="font-mono text-xs text-muted-foreground">
                  TERMINAL {session.user?.name?.charAt(0).toUpperCase()} | {currentTime.toLocaleTimeString('es-ES')}
                </div>
              </div>
            </div>

            {/* Control Panel */}
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <div className="hidden md:flex items-center gap-2 bg-muted rounded-xl px-4 py-2 border-2 border-border">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">{session.user?.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">PASAJERO VIP</div>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-background border-2 border-border hover:border-destructive hover:text-destructive rounded-xl px-4 py-2 text-sm font-bold transition-all"
              >
                SALIR
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Success Alert - Airport Style */}
        {showSuccess && (
          <div className="mb-6 bg-accent border-4 border-accent rounded-xl p-6 shadow-xl animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-foreground rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="font-mono text-sm text-accent-foreground/80 mb-1">CONFIRMACIÓN DE VUELO</div>
                <div className="text-2xl font-black text-accent-foreground">SOLICITUD REGISTRADA</div>
                <div className="text-sm text-accent-foreground/90 mt-1">Tu solicitud ha sido procesada. Recibirás una propuesta pronto.</div>
              </div>
            </div>
          </div>
        )}

        {/* Flight Information Display - Main Board */}
        <div className="bg-card border-4 border-border rounded-2xl overflow-hidden shadow-2xl mb-8">
          {/* Board Header */}
          <div className="bg-primary text-primary-foreground p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <div>
                <div className="font-mono text-sm opacity-90">PANEL DE CONTROL</div>
                <div className="text-2xl font-black">INFORMACIÓN DE VUELOS</div>
              </div>
            </div>
            <Link
              href="/dashboard/nueva-solicitud"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-black px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
              NUEVO VUELO
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <div className="p-6 sm:p-8">
            <div className="font-mono text-xs text-muted-foreground mb-4 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary animate-pulse"></div>
              BIENVENIDO, {session.user?.name?.toUpperCase()}
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Desde aquí puedes gestionar todas tus solicitudes de viaje y revisar las ofertas que hemos preparado para ti.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-primary/10 border-2 border-primary rounded-xl p-6">
                <div className="font-mono text-xs text-primary mb-2">TOTAL SOLICITUDES</div>
                <div className="text-4xl font-black text-primary">{requests.length}</div>
              </div>
              <div className="bg-secondary/10 border-2 border-secondary rounded-xl p-6">
                <div className="font-mono text-xs text-secondary-foreground mb-2">OFERTAS RECIBIDAS</div>
                <div className="text-4xl font-black text-secondary-foreground">{quotes.length}</div>
              </div>
              <div className="bg-accent/10 border-2 border-accent rounded-xl p-6">
                <div className="font-mono text-xs text-accent-foreground mb-2">ESTADO</div>
                <div className="text-2xl font-black text-accent-foreground flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent animate-pulse"></div>
                  ACTIVO
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Departure Board - Quotes */}
        {quotes.length > 0 && (
          <div className="mb-8">
            <div className="bg-card border-2 border-border rounded-xl overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-primary to-accent p-4">
                <div className="font-mono text-xs text-white/80 mb-1">SALIDAS / DEPARTURES</div>
                <div className="text-2xl font-black text-white">OFERTAS DISPONIBLES</div>
              </div>
              <div className="p-6 space-y-4">
                {quotes.map((quote, index) => (
                  <div
                    key={quote.id}
                    className="bg-background border-2 border-border hover:border-primary rounded-xl p-6 transition-all group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-mono text-xs text-muted-foreground">VUELO VV-{String(index + 1).padStart(3, '0')}</div>
                          <span className={`px-3 py-1 rounded-lg font-mono text-xs font-bold ${getStatusBadge(quote.status)}`}>
                            {getStatusText(quote.status)}
                          </span>
                        </div>
                        <h4 className="text-2xl font-black text-foreground mb-2">{quote.title}</h4>
                        <p className="text-muted-foreground mb-3">{quote.description}</p>
                        <div className="flex items-baseline gap-2">
                          <div className="text-4xl font-black text-primary">{quote.price}</div>
                          <div className="text-muted-foreground font-mono">{quote.currency}</div>
                        </div>
                      </div>
                      <Link
                        href={`/dashboard/ofertas/${quote.id}`}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg whitespace-nowrap group-hover:scale-105"
                      >
                        VER OFERTA →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Flight Schedule - Requests */}
        <div className="bg-card border-2 border-border rounded-xl overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-secondary to-primary p-4">
            <div className="font-mono text-xs text-white/80 mb-1">ITINERARIO / SCHEDULE</div>
            <div className="text-2xl font-black text-white">MIS SOLICITUDES DE VIAJE</div>
          </div>

          {requests.length === 0 ? (
            <div className="p-16 text-center">
              <div className="inline-block mb-6 p-6 bg-muted rounded-2xl">
                <svg className="w-20 h-20 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-2xl font-black text-foreground mb-2">NO HAY VUELOS PROGRAMADOS</div>
              <p className="text-muted-foreground mb-8">Aún no has realizado ninguna solicitud de viaje.</p>
              <Link
                href="/dashboard/nueva-solicitud"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 rounded-xl transition-all shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
                PROGRAMAR PRIMER VUELO
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b-2 border-border">
                  <tr>
                    <th className="px-6 py-4 text-left font-mono text-xs text-muted-foreground">VUELO</th>
                    <th className="px-6 py-4 text-left font-mono text-xs text-muted-foreground">DESTINO</th>
                    <th className="px-6 py-4 text-left font-mono text-xs text-muted-foreground">FECHA</th>
                    <th className="px-6 py-4 text-left font-mono text-xs text-muted-foreground">DÍAS</th>
                    <th className="px-6 py-4 text-left font-mono text-xs text-muted-foreground">ESTADO</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => (
                    <tr key={request.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono font-bold text-foreground">VV-{String(index + 1).padStart(3, '0')}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-foreground">{request.preferences.destinations.join(', ')}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-muted-foreground font-mono">
                          {new Date(request.createdAt).toLocaleDateString('es-ES')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-foreground">{request.preferences.daysAvailable}d</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg font-mono text-xs font-bold ${getStatusBadge(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
      <main className="flex min-h-screen flex-col items-center justify-center bg-background">
        <PlaneLoader size="large" />
      </main>
    }>
      <DashboardContent />
    </Suspense>
  );
}
