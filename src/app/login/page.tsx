'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import {
  Bus,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [trialDays, setTrialDays] = useState(14);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedPricing = localStorage.getItem('dr_vale_master_pricing_v1');
      if (savedPricing) {
        const parsed = JSON.parse(savedPricing);
        if (parsed.trialDurationDays && Number(parsed.trialDurationDays) > 0) {
          setTrialDays(Number(parsed.trialDurationDays));
        }
      }
    } catch {
      // fallback
    }
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await loginWithEmail(email, password);
      if (res.success) {
        if (res.isMaster) {
          router.push('/admin/master');
        } else if (!res.isProfileComplete) {
          router.push('/onboarding');
        } else {
          router.push('/');
        }
      } else {
        setError(res.message || 'E-mail ou senha incorretos. Verifique seus dados.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        if (res.isMaster) {
          router.push('/admin/master');
        } else if (!res.isProfileComplete) {
          router.push('/onboarding');
        } else {
          router.push('/');
        }
      } else {
        setError(res.message || 'Falha ao autenticar com o Google.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro no login com Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
            <Bus className="h-6 w-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">DR VALE</h1>
          <p className="text-xs text-slate-500">
            Sistema Oficial de Gestão e Cálculo de Vale Transporte • Art. 455 CLT
          </p>
        </div>

        {/* Login Box */}
        <div className="rounded-2xl bg-white p-7 sm:p-8 shadow-xl border border-slate-200 space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Acesse sua Conta</h2>
            <p className="text-xs text-slate-500">
              Entre para gerenciar seus cálculos ou acessar a administração
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Fast Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            className="flex items-center justify-center gap-3 w-full rounded-xl border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 px-4 py-3 text-xs font-semibold text-slate-700 shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
          >
            <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Conectando ao Google...' : 'Entrar com Google (Gmail)'}</span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="w-full border-t border-slate-200"></div>
            <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-medium">
              ou com e-mail e senha
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">E-mail</label>
              <div className="relative flex items-center">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@empresa.com.br"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Senha</label>
                <Link
                  href="/recuperar-senha"
                  className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-11 pr-11 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-700 transition"
                  title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? 'Entrando...' : 'Entrar no Sistema'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* CTA for New Trial Accounts */}
          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/cadastro"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 px-4 py-2.5 text-xs font-bold text-emerald-800 transition shadow-2xs"
            >
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Novo por aqui? Crie sua conta e teste por {trialDays} dias</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400">
          DR VALE © 2026 • Todos os direitos reservados
        </div>
      </div>
    </div>
  );
}
