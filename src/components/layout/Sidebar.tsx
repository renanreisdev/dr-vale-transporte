'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Calculator,
  FileText,
  Users,
  BookOpen,
  KeyRound,
  Settings,
  Bus,
  ShieldCheck,
  PhoneCall,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

interface SidebarProps {
  companyName?: string;
  isLicensed?: boolean;
}

export default function Sidebar({ companyName = 'SIDIAL FERRAGENS', isLicensed = false }: SidebarProps) {
  const pathname = usePathname();
  const { isMaster } = useAuth();

  const navItems = [
    {
      label: 'Cálculo de Vales',
      href: '/',
      icon: Calculator,
      description: 'Planilha de cálculo interativa',
    },
    {
      label: 'Relatório & Recibos',
      href: '/relatorios',
      icon: FileText,
      description: 'Relatório oficial e comprovantes',
    },
    {
      label: 'Colaboradores',
      href: '/colaboradores',
      icon: Users,
      description: 'Quadro de funcionários e dados',
    },
    {
      label: 'Guia CLT & Justa Causa',
      href: '/clt-guia',
      icon: BookOpen,
      description: 'Legislação e modelos formais',
    },
    {
      label: 'Minha Licença',
      href: '/minha-licenca',
      icon: KeyRound,
      description: 'Status e ativação de serial',
    },
    {
      label: 'Configurações',
      href: '/configuracoes',
      icon: Settings,
      description: 'Empresa, CNPJ e Supabase',
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-200 flex flex-col justify-between border-r border-slate-800 min-h-screen no-print">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold shadow-md">
              <Bus className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-white text-base">DR VALE</span>
                <span className="rounded bg-emerald-500/20 px-1 py-0.5 text-[10px] font-semibold text-emerald-400">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Gestão de Vale Transporte</p>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-slate-800/80 p-2.5 border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-semibold text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Empresa:</span>
            </div>
            <p className="text-xs font-semibold text-white truncate mt-0.5">{companyName}</p>
            <p className="text-[10px] text-slate-400">Conforme Art. 455 da CLT</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <div className="truncate">
                  <div>{item.label}</div>
                  <div className={`text-[10px] font-normal truncate ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}

          {/* MASTER USER EXCLUSIVE NAVIGATION ITEM */}
          {isMaster && (
            <div className="pt-3 mt-3 border-t border-slate-800">
              <span className="px-3 text-[10px] font-bold tracking-wider uppercase text-indigo-400">
                Acesso Proprietário
              </span>
              <Link
                href="/admin/licencas"
                className={`mt-1 flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                  pathname === '/admin/licencas'
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-indigo-200 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <ShieldAlert className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span className="font-semibold">Painel Master (Admin)</span>
                </div>
                <span className="rounded bg-indigo-500/30 text-indigo-300 text-[9px] font-bold px-1.5 py-0.5 border border-indigo-400/40">
                  MASTER
                </span>
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Footer Support Card */}
      <div className="p-4 border-t border-slate-800 text-xs">
        <div className="rounded-lg bg-slate-800/60 p-3 border border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
            <span>Suporte & Vendas</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Dúvidas ou licenças: <br />
            <strong className="text-slate-200">(53) 99122-6768</strong> - Reis
          </p>
          <a
            href="https://wa.me/5553991226768?text=Ol%C3%A1%2C%20tenho%20interesse%20no%20sistema%20DR%20VALE%20Transporte"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full rounded bg-slate-700 hover:bg-slate-600 px-2 py-1.5 text-[11px] font-medium text-white transition"
          >
            <span>WhatsApp</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </aside>
  );
}
