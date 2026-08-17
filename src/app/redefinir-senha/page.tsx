'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Bus, Lock, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem. Digite a mesma senha nos dois campos.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await updatePassword(password);
      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(res.message || 'Erro ao redefinir a senha.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado.');
    } finally {
      setIsLoading(false);
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
          <p className="text-xs text-slate-500">Definição de Nova Senha de Acesso</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-7 shadow-xl border border-slate-200 space-y-5">
          {isSuccess ? (
            <div className="space-y-4 text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Senha Alterada com Sucesso!</h2>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
                  Sua nova senha foi gravada com segurança. Você será redirecionado para a tela de login...
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  <span>Ir para o Login Agora</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-base font-bold text-slate-900">Criar Nova Senha</h2>
                <p className="text-xs text-slate-500">Digite sua nova senha de acesso abaixo</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nova Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      minLength={6}
                      className="w-full rounded-xl border border-slate-300 pl-9.5 pr-9 py-2.5 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Confirmar Nova Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Digite a senha novamente"
                      minLength={6}
                      className="w-full rounded-xl border border-slate-300 pl-9.5 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition shadow-sm disabled:opacity-50"
                >
                  <span>{isLoading ? 'Atualizando Senha...' : 'Salvar Nova Senha'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </>
          )}
        </div>

        <div className="text-center text-[11px] text-slate-400">
          DR VALE © 2026 • Gestão de Vale Transporte
        </div>
      </div>
    </div>
  );
}
