import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'DR VALE | Gestão e Cálculo de Vale Transporte',
  description: 'Sistema corporativo para cálculo de Vale Transporte com conformidade CLT, relatórios oficiais e recibos de entrega.',
  keywords: ['vale transporte', 'cálculo vt', 'clt art 455', 'gestão de departamento pessoal', 'relatório de vales'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-50 antialiased selection:bg-emerald-500 selection:text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
