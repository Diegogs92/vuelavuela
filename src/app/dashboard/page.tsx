'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import ThemeSwitcher from '@/components/ThemeSwitcher';

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
      <main className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-muted text-muted-foreground border border-border',
      quoted: 'bg-primary/10 text-primary border border-primary/20',
      accepted: 'bg-secondary/10 text-secondary border border-secondary/20',
      rejected: 'bg-destructive/10 text-destructive border border-destructive/20',
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
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-black text-foreground">
              Vuela Vuela
            </h1>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <div className="hidden sm:flex items-center gap-2 bg-muted rounded-lg py-2 px-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-foreground">
                  {session.user?.name}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-card border border-border rounded-lg py-2 px-4 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Success notification */}
        {showSuccess && (
          <div className="mb-6 bg-card border border-primary rounded-lg p-4 shadow-md fade-in">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold text-foreground">Solicitud enviada exitosamente</p>
                <p className="text-sm text-muted-foreground">Te enviaremos una propuesta pronto a tu correo electrónico.</p>
              </div>
            </div>
          </div>
        )}

        {/* Welcome card */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-lg mb-8 fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black text-foreground mb-3">
                Hola, {session.user?.name?.split(' ')[0]}!
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl">
                ¿Listo para tu próxima aventura? Cuéntanos tus preferencias y te prepararemos una propuesta personalizada.
              </p>
            </div>
            <Link
              href="/dashboard/nueva-solicitud"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all whitespace-nowrap group"
            >
              <span className="flex items-center gap-2">
                Nueva solicitud
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Quotes section */}
        {quotes.length > 0 && (
          <div className="mb-8 fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Ofertas recibidas
              </h3>
              <span className="bg-muted rounded-lg px-3 py-1 text-sm text-muted-foreground">
                {quotes.length}
              </span>
            </div>
            <div className="grid gap-4">
              {quotes.map((quote, index) => (
                <div
                  key={quote.id}
                  className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg hover:border-primary/50 transition-all fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h4 className="text-xl font-bold text-foreground">
                          {quote.title}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(quote.status)}`}>
                          {getStatusText(quote.status)}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {quote.description}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-primary">
                          {quote.price}
                        </span>
                        <span className="text-muted-foreground">{quote.currency}</span>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/ofertas/${quote.id}`}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all whitespace-nowrap group"
                    >
                      <span className="flex items-center gap-2">
                        Ver detalles
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requests section */}
        <div className="fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Mis solicitudes
            </h3>
            <span className="bg-muted rounded-lg px-3 py-1 text-sm text-muted-foreground">
              {requests.length}
            </span>
          </div>
          {requests.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center shadow-md">
              <svg className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-muted-foreground text-lg">
                Aún no tienes solicitudes de viaje
              </p>
              <p className="text-muted-foreground/70 text-sm mt-2">
                ¡Crea tu primera solicitud para comenzar!
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {requests.map((request, index) => (
                <div
                  key={request.id}
                  className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg hover:border-secondary/50 transition-all fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(request.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-foreground font-semibold mb-1">
                        Destinos: <span className="text-primary">{request.preferences.destinations.join(', ')}</span>
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {request.preferences.daysAvailable} días
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
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
      <main className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    }>
      <DashboardContent />
    </Suspense>
  );
}
