'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function SignIn() {
  return (
    <main className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        {/* Back button */}
        <Link
          href="/"
          className="absolute top-8 left-8 bg-card border border-border px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors group"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
          </span>
        </Link>

        <div className="max-w-md w-full fade-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-block bg-card border border-border rounded-2xl p-6 shadow-lg mb-6">
              <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-5xl font-black mb-3 text-foreground">
              Vuela Vuela
            </h1>
            <p className="text-muted-foreground text-lg">
              Inicia sesión para comenzar tu aventura
            </p>
          </div>

          {/* Sign in card */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Bienvenido</h2>
              <p className="text-muted-foreground">
                Conecta con tu cuenta de Google para acceder a tu panel personalizado
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="w-full bg-background border border-border hover:bg-muted rounded-lg hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-center gap-3 py-4 px-6">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-foreground font-semibold text-lg">Continuar con Google</span>
              </div>
            </button>

            {/* Features list */}
            <div className="pt-4 space-y-3 border-t border-border">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Acceso instantáneo a tu panel personalizado</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Gestiona todas tus solicitudes de viaje</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Recibe ofertas personalizadas en tiempo real</span>
              </div>
            </div>
          </div>

          {/* Footer text */}
          <p className="text-sm text-muted-foreground text-center mt-6">
            Al continuar, aceptas nuestros términos de servicio y política de privacidad
          </p>
        </div>
      </div>
    </main>
  );
}
