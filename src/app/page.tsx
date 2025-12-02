'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

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
      <main className="flex min-h-screen flex-col items-center justify-center bg-animated">
        <div className="glass-card animate-pulse">
          <div className="w-16 h-16 border-4 border-[#49A078] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-animated relative overflow-hidden">
      {/* Floating orbs background */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#216869] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-[#49A078] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[#9CC5A1] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
        <div className="text-center max-w-4xl">
          {/* Logo/Icon with glow */}
          <div className="mb-8 flex justify-center fade-in">
            <div className="glass-card p-8 glow float">
              <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>

          {/* Main title */}
          <h1 className="text-8xl font-black mb-6 gradient-text fade-in fade-in-delay-1">
            Vuela Vuela
          </h1>

          {/* Subtitle */}
          <p className="text-3xl font-light text-white/90 mb-4 fade-in fade-in-delay-2">
            Tu agencia de viajes personalizada
          </p>

          {/* Description */}
          <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed fade-in fade-in-delay-3">
            Cuéntanos tus preferencias de viaje y nuestro equipo te preparará una propuesta
            personalizada que superará tus expectativas. Experiencias únicas, momentos inolvidables.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in fade-in-delay-4">
            <Link
              href="/auth/signin"
              className="glass-button glow text-white text-lg px-10 py-4 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Comenzar mi viaje
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 fade-in fade-in-delay-4">
            <div className="glass-card text-left">
              <div className="w-12 h-12 bg-gradient-to-br from-[#216869] to-[#49A078] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Respuesta Rápida</h3>
              <p className="text-white/60">Recibe tu propuesta personalizada en menos de 24 horas</p>
            </div>

            <div className="glass-card text-left">
              <div className="w-12 h-12 bg-gradient-to-br from-[#49A078] to-[#9CC5A1] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">100% Personalizado</h3>
              <p className="text-white/60">Cada viaje es diseñado específicamente para ti</p>
            </div>

            <div className="glass-card text-left">
              <div className="w-12 h-12 bg-gradient-to-br from-[#9CC5A1] to-[#DCE1DE] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Viaje Seguro</h3>
              <p className="text-white/60">Soporte completo antes, durante y después de tu viaje</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
