'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function LicencaRedirectPage() {
  const router = useRouter();
  const { isMaster } = useAuth();

  useEffect(() => {
    if (isMaster) {
      router.replace('/admin/licencas');
    } else {
      router.replace('/minha-licenca');
    }
  }, [isMaster, router]);

  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
    </div>
  );
}
