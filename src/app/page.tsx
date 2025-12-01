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
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center max-w-3xl">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Vuela Vuela
        </h1>
        <p className="text-2xl text-gray-600 dark:text-gray-400 mb-8">
          Tu agencia de viajes personalizada
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-500 mb-8">
          Cuéntanos tus preferencias de viaje y nuestro equipo te preparará una propuesta personalizada
        </p>
        <Link
          href="/auth/signin"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg transition-colors shadow-lg hover:shadow-xl"
        >
          Comenzar a planificar mi viaje
        </Link>
      </div>
    </main>
  );
}
