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
      <main className="flex min-h-screen flex-col items-center justify-center bg-animated">
        <div className="glass-card animate-pulse">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-200 border border-yellow-500/30',
      quoted: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-200 border border-blue-500/30',
      accepted: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-200 border border-green-500/30',
      rejected: 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-200 border border-red-500/30',
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
    <main className="min-h-screen bg-animated relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>

      {/* Navbar */}
      <nav className="glass border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-black gradient-text">
              Vuela Vuela
            </h1>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 glass-card py-2 px-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-white/80">
                  {session.user?.name}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="glass-card py-2 px-4 text-sm text-white/80 hover:text-white transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Success notification */}
        {showSuccess && (
          <div className="mb-6 glass-card border-l-4 border-green-500 fade-in">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold text-white">Solicitud enviada exitosamente</p>
                <p className="text-sm text-white/70">Te enviaremos una propuesta pronto a tu correo electrónico.</p>
              </div>
            </div>
          </div>
        )}

        {/* Welcome card */}
        <div className="glass-card glow mb-8 fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black text-white mb-3">
                Hola, {session.user?.name?.split(' ')[0]} 👋
              </h2>
              <p className="text-white/70 text-lg max-w-xl">
                ¿Listo para tu próxima aventura? Cuéntanos tus preferencias y te prepararemos una propuesta personalizada.
              </p>
            </div>
            <Link
              href="/dashboard/nueva-solicitud"
              className="glass-button glow-accent text-white font-bold whitespace-nowrap group"
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
          <div className="mb-8 fade-in fade-in-delay-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Ofertas recibidas
              </h3>
              <span className="glass-card px-3 py-1 text-sm text-white/80">
                {quotes.length}
              </span>
            </div>
            <div className="grid gap-4">
              {quotes.map((quote, index) => (
                <div
                  key={quote.id}
                  className="glass-card group hover:border-white/30 fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h4 className="text-xl font-bold text-white group-hover:gradient-text-accent transition-all">
                          {quote.title}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(quote.status)}`}>
                          {getStatusText(quote.status)}
                        </span>
                      </div>
                      <p className="text-white/60 mb-4">
                        {quote.description}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black gradient-text-accent">
                          {quote.price}
                        </span>
                        <span className="text-white/60">{quote.currency}</span>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/ofertas/${quote.id}`}
                      className="glass-button glow-accent text-white whitespace-nowrap group/btn"
                    >
                      <span className="flex items-center gap-2">
                        Ver detalles
                        <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="fade-in fade-in-delay-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">
              Mis solicitudes
            </h3>
            <span className="glass-card px-3 py-1 text-sm text-white/80">
              {requests.length}
            </span>
          </div>
          {requests.length === 0 ? (
            <div className="glass-card text-center py-12">
              <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-white/60 text-lg">
                Aún no tienes solicitudes de viaje
              </p>
              <p className="text-white/40 text-sm mt-2">
                ¡Crea tu primera solicitud para comenzar!
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {requests.map((request, index) => (
                <div
                  key={request.id}
                  className="glass-card group hover:border-white/30 fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-white/50 mb-2">
                        {new Date(request.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-white font-semibold mb-1">
                        Destinos: <span className="gradient-text">{request.preferences.destinations.join(', ')}</span>
                      </p>
                      <div className="flex items-center gap-4 text-sm text-white/60">
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
      <main className="flex min-h-screen flex-col items-center justify-center bg-animated">
        <div className="glass-card animate-pulse">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    }>
      <DashboardContent />
    </Suspense>
  );
}
