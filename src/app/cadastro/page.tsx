'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import {
  Bus,
  Lock,
  Mail,
  Building2,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function CadastroPage() {
  const router = useRouter();
  const { registerWithEmail, loginWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await registerWithEmail(email, password, name, companyName);
      if (res.success) {
        router.push('/');
      } else {
        setError(res.message || 'Erro ao realizar cadastro.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro no cadastro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
            <Bus className="h-6 w-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">DR VALE</h1>
          <p className="text-xs text-slate-500">Cadastro de Nova Empresa / RH</p>
        </div>

        <div className="rounded-2xl bg-white p-7 shadow-xl border border-slate-200 space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Criar Nova Conta</h2>
            <p className="text-xs text-slate-500">Inicie com 14 dias grátis de demonstração</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Seu Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Carlos Silva"
                  className="w-full rounded-xl border border-slate-300 pl-9.5 pr-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nome da Empresa</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ex: Minha Empresa LTDA"
                  className="w-full rounded-xl border border-slate-300 pl-9.5 pr-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none uppercase"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">E-mail Profissional</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rh@suaempresa.com.br"
                  className="w-full rounded-xl border border-slate-300 pl-9.5 pr-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Criar Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  className="w-full rounded-xl border border-slate-300 pl-9.5 pr-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white transition shadow-sm disabled:opacity-50 mt-2"
            >
              <span>{isLoading ? 'Cadastrando...' : 'Criar Conta e Iniciar Teste'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Já possui cadastro?{' '}
            <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
              Fazer Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
