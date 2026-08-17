'use client';

import React, { useState } from 'react';
import { generateLicenseKey } from '@/lib/license-service';
import { KeyRound, Copy, Check, Sparkles, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function KeyGeneratorCard() {
  const [type, setType] = useState<'T30' | 'M01' | 'A01' | 'LIF'>('LIF');
  const [clientIdentifier, setClientIdentifier] = useState('SIDIAL');
  const [expirationDate, setExpirationDate] = useState('2027-12-31');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const key = generateLicenseKey(type, clientIdentifier, expirationDate);
    setGeneratedKey(key);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">Gerador Comercial de Licenças (Painel do Administrador)</h3>
            <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
              EXCLUSIVO
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Gere seriais assinados para fornecer aos seus clientes após a compra ou teste
          </p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Tipo de Licença */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Tipo de Plano</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-600 focus:outline-none bg-white"
            >
              <option value="T30">Demo Estendido (30 Dias)</option>
              <option value="M01">Assinatura Mensal</option>
              <option value="A01">Assinatura Anual</option>
              <option value="LIF">Licença Vitalícia (Sem Expiração)</option>
            </select>
          </div>

          {/* Identificador / CNPJ */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Nome/CNPJ do Cliente</label>
            <input
              type="text"
              value={clientIdentifier}
              onChange={(e) => setClientIdentifier(e.target.value)}
              placeholder="Ex: SIDIAL ou 12345678"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-600 focus:outline-none uppercase"
              required
            />
          </div>

          {/* Validade */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Data de Expiração</label>
            <input
              type="date"
              value={expirationDate}
              disabled={type === 'LIF'}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-600 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Gerar Chave de Licença
        </button>
      </form>

      {generatedKey && (
        <div className="mt-5 rounded-lg bg-slate-900 p-4 text-white space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Chave Gerada com Assinatura Criptográfica:</span>
            <span className="font-mono text-emerald-400 text-[11px]">Pronta para envio ao cliente</span>
          </div>

          <div className="flex items-center justify-between gap-3 rounded bg-slate-800 p-3 border border-slate-700">
            <code className="font-mono text-xs font-bold text-emerald-400 tracking-wider break-all">
              {generatedKey}
            </code>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded bg-slate-700 hover:bg-slate-600 px-3 py-1.5 text-xs font-medium text-white transition shrink-0"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
