'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLicencasForward() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/master');
  }, [router]);

  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
    </div>
  );
}
