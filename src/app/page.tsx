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
      {/* Airport-style header banner */}
      <div className="bg-card border-b-4 border-primary shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-foreground tracking-tight">VUELA VUELA</div>
                <div className="text-xs text-muted-foreground font-medium">Tu Agencia de Viajes</div>
              </div>
            </div>
            <Link
              href="/auth/signin"
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-md text-sm"
            >
              INICIAR SESIÓN
            </Link>
          </div>
        </div>
      </div>

      {/* Hero section with terminal board style */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-block bg-card border-2 border-primary rounded-xl p-8 shadow-2xl mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-3 h-3 rounded-full bg-secondary animate-pulse"></div>
              <h1 className="text-7xl font-black text-foreground">
                DESTINO: <span className="text-primary">TUS SUEÑOS</span>
              </h1>
              <div className="w-3 h-3 rounded-full bg-secondary animate-pulse"></div>
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground font-mono text-sm">
              <span>TERMINAL</span>
              <span className="px-2 py-1 bg-secondary/10 rounded">GLOBAL</span>
              <span>|</span>
              <span className="px-2 py-1 bg-primary/10 rounded">EN SERVICIO</span>
            </div>
          </div>

          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            Planificamos tu viaje perfecto. Cuéntanos tus preferencias y prepararemos una propuesta personalizada.
          </p>
        </div>

        {/* Airport departure board style CTA */}
        <div className="bg-card rounded-xl border-2 border-border shadow-xl overflow-hidden max-w-4xl mx-auto mb-16">
          <div className="bg-primary text-primary-foreground py-3 px-6 flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="font-mono font-bold tracking-wider">PRÓXIMA SALIDA</div>
          </div>
          <div className="p-8 text-center">
            <div className="text-5xl font-black text-foreground mb-4">¿LISTO PARA DESPEGAR?</div>
            <p className="text-muted-foreground mb-8 text-lg">
              Tu próxima aventura comienza aquí. Solo necesitas unos minutos para contarnos tus preferencias.
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground text-xl font-bold px-12 py-5 rounded-lg transition-all shadow-lg hover:shadow-xl group"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
              COMENZAR VIAJE
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Services - Airport gate style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border-2 border-border rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-primary transition-all">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <div className="text-2xl font-black text-primary">24H</div>
              </div>
              <div>
                <div className="font-mono text-xs text-muted-foreground mb-1">GATE A1</div>
                <h3 className="text-xl font-bold text-foreground mb-2">Respuesta Rápida</h3>
                <p className="text-muted-foreground text-sm">Tu propuesta personalizada en menos de 24 horas</p>
              </div>
            </div>
          </div>

          <div className="bg-card border-2 border-border rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-secondary transition-all">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <div className="font-mono text-xs text-muted-foreground mb-1">GATE B2</div>
                <h3 className="text-xl font-bold text-foreground mb-2">100% Personalizado</h3>
                <p className="text-muted-foreground text-sm">Cada viaje diseñado específicamente para ti</p>
              </div>
            </div>
          </div>

          <div className="bg-card border-2 border-border rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-accent transition-all">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="font-mono text-xs text-muted-foreground mb-1">GATE C3</div>
                <h3 className="text-xl font-bold text-foreground mb-2">Viaje Seguro</h3>
                <p className="text-muted-foreground text-sm">Soporte completo antes, durante y después</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Airport-style footer */}
      <div className="bg-card border-t-2 border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="font-mono text-sm text-muted-foreground">
              <span className="font-bold">VUELA VUELA</span> © 2024 | Tu próxima aventura comienza aquí
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
              <span className="font-mono text-sm text-muted-foreground">SISTEMA OPERATIVO</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
