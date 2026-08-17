'use client';

import React from 'react';
import { useVTStore } from '@/lib/store';
import RelatorioPrintView from '@/components/relatorio/RelatorioPrintView';

export default function RelatoriosPage() {
  const { period, rows, company, license } = useVTStore();

  return (
    <div className="space-y-6">
      <RelatorioPrintView
        period={period}
        rows={rows}
        company={company}
        watermark={license?.features.watermark}
      />
    </div>
  );
}
