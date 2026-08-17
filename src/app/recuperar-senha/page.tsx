'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Bus, Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RecuperarSenhaPage() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await sendPasswordReset(email);
      if (res.success) {
        setIsSuccess(true);
      } else {
        setError(res.message || 'Erro ao solicitar redefinição de senha.');
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
          <p className="text-xs text-slate-500">Recuperação de Acesso à Plataforma</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-7 sm:p-8 shadow-xl border border-slate-200 space-y-5">
          {isSuccess ? (
            <div className="space-y-4 text-center py-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">E-mail de Recuperação Enviado!</h2>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
                  Se houver uma conta cadastrada para <strong>{email}</strong>, enviamos um link para redefinição
                  de senha. Verifique sua caixa de entrada e pasta de spam.
                </p>
              </div>

              <div className="pt-3">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition shadow-sm"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Voltar para a Tela de Login</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-base font-bold text-slate-900">Esqueceu sua Senha?</h2>
                <p className="text-xs text-slate-500">
                  Informe seu e-mail cadastrado e enviaremos instruções para criar uma nova senha.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">E-mail Cadastrado</label>
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <span>{isLoading ? 'Enviando Link...' : 'Enviar Link de Recuperação'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-100">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Voltar para o Login</span>
                </Link>
              </div>
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
