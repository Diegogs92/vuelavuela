'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import PlaneLoader from '@/components/PlaneLoader';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background">
        <PlaneLoader size="large" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="text-center max-w-4xl">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center fade-in">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              <svg className="w-20 h-20 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Main title */}
          <h1 className="text-8xl font-black mb-6 text-foreground fade-in">
            Vuela Vuela
          </h1>

          {/* Subtitle */}
          <p className="text-3xl font-light text-muted-foreground mb-4 fade-in">
            Tu agencia de viajes personalizada
          </p>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed fade-in">
            Cuéntanos tus preferencias de viaje y nuestro equipo te preparará una propuesta
            personalizada que superará tus expectativas. Experiencias únicas, momentos inolvidables.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in">
            <Link
              href="/auth/signin"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-4 rounded-lg transition-all shadow-md hover:shadow-lg group"
            >
              <span className="flex items-center gap-2">
                Comenzar mi viaje
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 fade-in">
            <div className="bg-card border border-border rounded-xl p-6 shadow-md text-left">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Respuesta Rápida</h3>
              <p className="text-muted-foreground">Recibe tu propuesta personalizada en menos de 24 horas</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-md text-left">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">100% Personalizado</h3>
              <p className="text-muted-foreground">Cada viaje es diseñado específicamente para ti</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-md text-left">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Viaje Seguro</h3>
              <p className="text-muted-foreground">Soporte completo antes, durante y después de tu viaje</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
