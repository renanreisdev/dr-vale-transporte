'use client';

import React, { useState } from 'react';
import { PlanPricingConfig } from '@/types/master';
import {
  DollarSign,
  Save,
  CheckCircle2,
  PhoneCall,
  Mail,
  CreditCard,
  Sparkles,
} from 'lucide-react';

interface MasterPricingManagerProps {
  pricingConfig: PlanPricingConfig;
  onUpdatePricing: (updates: Partial<PlanPricingConfig>) => void;
}

export default function MasterPricingManager({
  pricingConfig,
  onUpdatePricing,
}: MasterPricingManagerProps) {
  const [formData, setFormData] = useState({ ...pricingConfig });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePricing(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
          <DollarSign className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Configuração de Planos & Valores (Pricing)</h2>
          <p className="text-xs text-slate-500">
            Ajuste os valores padrões de comercialização das licenças e parâmetros de venda
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Prices Grid */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Valores Oficiais dos Planos (R$)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Mensal */}
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-slate-700">Plano Mensal (30 dias)</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.monthlyPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, monthlyPrice: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm font-bold text-slate-900 focus:border-indigo-600 focus:outline-none bg-white"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-500">Cobrança recorrente a cada 30 dias</p>
            </div>

            {/* Anual */}
            <div className="rounded-xl border-2 border-emerald-500/40 p-4 bg-emerald-50/30 space-y-2">
              <span className="text-xs font-bold text-emerald-950">Plano Anual (365 dias)</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-700">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.annualPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, annualPrice: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full rounded-lg border border-emerald-300 pl-9 pr-3 py-2 text-sm font-black text-emerald-900 focus:border-emerald-600 focus:outline-none bg-white"
                  required
                />
              </div>
              <p className="text-[10px] text-emerald-700 font-medium">Equivalente a 12 meses com desconto</p>
            </div>

            {/* Vitalício */}
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-slate-700">Plano Vitalício (Sem Expiração)</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.lifetimePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, lifetimePrice: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm font-bold text-slate-900 focus:border-indigo-600 focus:outline-none bg-white"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-500">Taxa única para acesso perpétuo</p>
            </div>
          </div>
        </div>

        {/* Trial & Sales Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Dias Padrão de Demonstração (Trial)
            </label>
            <input
              type="number"
              value={formData.trialDurationDays}
              onChange={(e) =>
                setFormData({ ...formData, trialDurationDays: parseInt(e.target.value, 10) || 14 })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium focus:border-indigo-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              WhatsApp Comercial de Vendas (Dono)
            </label>
            <input
              type="text"
              value={formData.supportWhatsapp}
              onChange={(e) => setFormData({ ...formData, supportWhatsapp: e.target.value })}
              placeholder="5553991226768"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono focus:border-indigo-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Chave PIX para Recebimentos
            </label>
            <input
              type="text"
              value={formData.pixKey || ''}
              onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
              placeholder="Ex: 53991226768 ou CNPJ"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono focus:border-indigo-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {savedSuccess ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>Configurações de planos e valores atualizadas com sucesso!</span>
            </div>
          ) : (
            <div></div>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-bold text-white transition shadow-xs"
          >
            <Save className="h-4 w-4" />
            <span>Salvar Tabela de Preços</span>
          </button>
        </div>
      </form>
    </div>
  );
}
