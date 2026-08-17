'use client';

import React, { useState } from 'react';
import { MasterLicense, LicensePlanType } from '@/types/master';
import { formatCurrencyBRL } from '@/lib/vt-engine';
import {
  KeyRound,
  Plus,
  Search,
  Copy,
  Check,
  Calendar,
  ExternalLink,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  PhoneCall,
  MoreVertical,
  X,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface MasterLicenseManagerProps {
  licenses: MasterLicense[];
  onAddLicense: (data: any) => void;
  onExtendLicense: (id: string, days: number) => void;
  onToggleStatus: (id: string) => void;
  onDeleteLicense: (id: string) => void;
}

export default function MasterLicenseManager({
  licenses,
  onAddLicense,
  onExtendLicense,
  onToggleStatus,
  onDeleteLicense,
}: MasterLicenseManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientTradeName, setClientTradeName] = useState('');
  const [clientCnpj, setClientCnpj] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [planType, setPlanType] = useState<LicensePlanType>('annual');
  const [price, setPrice] = useState<number>(380);
  const [customDays, setCustomDays] = useState<number>(365);
  const [notes, setNotes] = useState('');

  const filteredLicenses = licenses.filter((lic) => {
    const matchesSearch =
      lic.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lic.clientTradeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lic.clientCnpj || '').includes(searchTerm) ||
      lic.licenseKey.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlan = filterPlan === 'ALL' || lic.planType === filterPlan;
    const matchesStatus = filterStatus === 'ALL' || lic.status === filterStatus;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handlePlanTypeChange = (type: LicensePlanType) => {
    setPlanType(type);
    if (type === 'monthly') {
      setPrice(49);
      setCustomDays(30);
    } else if (type === 'annual') {
      setPrice(380);
      setCustomDays(365);
    } else if (type === 'lifetime') {
      setPrice(790);
      setCustomDays(36500);
    } else if (type === 'trial') {
      setPrice(0);
      setCustomDays(14);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    onAddLicense({
      clientName,
      clientTradeName,
      clientCnpj,
      clientEmail,
      clientPhone,
      planType,
      price,
      durationDays: customDays,
      notes,
    });

    setClientName('');
    setClientTradeName('');
    setClientCnpj('');
    setClientEmail('');
    setClientPhone('');
    setNotes('');
    setIsModalOpen(false);
  };

  const getWhatsAppMessageUrl = (lic: MasterLicense) => {
    const cleanPhone = (lic.clientPhone || '').replace(/\D/g, '');
    const expDateStr = new Date(lic.expirationDate).toLocaleDateString('pt-BR');
    const msg = encodeURIComponent(
      `Olá ${lic.clientTradeName || lic.clientName}!\n\n` +
      `Sua licença do *DR VALE (Gestão de Vale Transporte)* foi emitida com sucesso!\n\n` +
      `🔑 *Chave Serial de Ativação:*\n\`${lic.licenseKey}\`\n\n` +
      `📦 *Plano:* ${lic.planType.toUpperCase()}\n` +
      `📅 *Validade:* ${lic.planType === 'lifetime' ? 'Vitalícia (Sem Expiração)' : expDateStr}\n\n` +
      `Para ativar, basta acessar a aplicação no menu "Minha Licença" e colar sua chave serial.`
    );
    return `https://wa.me/${cleanPhone ? `55${cleanPhone}` : ''}?text=${msg}`;
  };

  return (
    <div className="rounded-xl bg-white shadow-xs border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cliente, CNPJ ou chave..."
              className="h-9 rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 focus:outline-none w-72 transition-all"
            />
          </div>

          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="h-9 rounded-xl border border-slate-300 px-3 text-xs text-slate-700 focus:border-indigo-600 focus:outline-none bg-white cursor-pointer"
          >
            <option value="ALL">Todos os Planos</option>
            <option value="monthly">Mensal</option>
            <option value="annual">Anual</option>
            <option value="lifetime">Vitalício</option>
            <option value="trial">Trial / Teste</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 rounded-xl border border-slate-300 px-3 text-xs text-slate-700 focus:border-indigo-600 focus:outline-none bg-white cursor-pointer"
          >
            <option value="ALL">Todos os Status</option>
            <option value="active">Ativas</option>
            <option value="expired">Expiradas</option>
            <option value="suspended">Suspensas</option>
          </select>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-semibold text-white transition shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Criar / Emitir Nova Licença</span>
        </button>
      </div>

      {/* Licenses Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white font-semibold">
              <th className="py-2.5 px-4">EMPRESA / CLIENTE</th>
              <th className="py-2.5 px-3 text-center">PLANO</th>
              <th className="py-2.5 px-3 text-right">VALOR COBRADO</th>
              <th className="py-2.5 px-3 text-center">EXPIRAÇÃO</th>
              <th className="py-2.5 px-3 text-center">STATUS</th>
              <th className="py-2.5 px-4">CHAVE SERIAL (ATRIBUIÇÃO)</th>
              <th className="py-2.5 px-4 text-center">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredLicenses.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  Nenhuma licença encontrada com os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredLicenses.map((lic) => {
                const expDate = new Date(lic.expirationDate);
                const isExp = lic.planType !== 'lifetime' && expDate.getTime() < Date.now();
                const daysRemaining = Math.ceil((expDate.getTime() - Date.now()) / 86400000);

                return (
                  <tr key={lic.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 uppercase">{lic.clientTradeName || lic.clientName}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        {lic.clientCnpj && <span>CNPJ: {lic.clientCnpj}</span>}
                        {lic.clientPhone && <span>• Tel: {lic.clientPhone}</span>}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          lic.planType === 'lifetime'
                            ? 'bg-purple-100 text-purple-800'
                            : lic.planType === 'annual'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lic.planType === 'monthly'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {lic.planType}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      {lic.price > 0 ? formatCurrencyBRL(lic.price) : 'Gratuito (Trial)'}
                    </td>

                    <td className="py-3 px-3 text-center">
                      {lic.planType === 'lifetime' ? (
                        <span className="font-semibold text-purple-700">Vitalício</span>
                      ) : (
                        <div>
                          <p className={`font-semibold ${isExp ? 'text-rose-600' : 'text-slate-900'}`}>
                            {expDate.toLocaleDateString('pt-BR')}
                          </p>
                          <p className={`text-[10px] ${isExp ? 'text-rose-500' : 'text-slate-500'}`}>
                            {isExp ? 'Expirou' : `${daysRemaining} dias restantes`}
                          </p>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          lic.status === 'active' && !isExp
                            ? 'bg-emerald-100 text-emerald-800'
                            : lic.status === 'suspended'
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {lic.status === 'active' && !isExp ? 'Ativa' : lic.status === 'suspended' ? 'Suspensa' : 'Expirada'}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-800 truncate max-w-[180px]">
                          {lic.licenseKey}
                        </span>
                        <button
                          onClick={() => handleCopyKey(lic.licenseKey, lic.id)}
                          className="rounded p-1 text-slate-500 hover:bg-slate-200 transition shrink-0 cursor-pointer"
                          title="Copiar serial"
                        >
                          {copiedId === lic.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <a
                          href={getWhatsAppMessageUrl(lic)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                          title="Enviar Serial via WhatsApp para o Cliente"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </a>

                        <button
                          onClick={() => onExtendLicense(lic.id, 30)}
                          className="rounded-lg px-2 py-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition border border-indigo-200 cursor-pointer"
                          title="Prorrogar +30 dias"
                        >
                          +30d
                        </button>

                        <button
                          onClick={() => onToggleStatus(lic.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                          title={lic.status === 'active' ? 'Suspender Licença' : 'Reativar Licença'}
                        >
                          <ShieldAlert className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Excluir licença de ${lic.clientName}?`)) {
                              onDeleteLicense(lic.id);
                            }
                          }}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal to Create License */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Emitir Nova Licença Comercial</h3>
                <p className="text-xs text-slate-500">Gere uma chave assinada com prazo e valor para seu cliente</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Razão Social / Nome do Cliente *</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: PADARIA CENTRAL LTDA"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold uppercase focus:border-indigo-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Fantasia (Opcional)</label>
                  <input
                    type="text"
                    value={clientTradeName}
                    onChange={(e) => setClientTradeName(e.target.value)}
                    placeholder="Ex: PADARIA CENTRAL"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold uppercase focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CNPJ (Opcional)</label>
                  <input
                    type="text"
                    value={clientCnpj}
                    onChange={(e) => setClientCnpj(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-mono focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(53) 99999-9999"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail do Cliente</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="contato@padariacentral.com"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Plan & Pricing */}
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Plano</label>
                    <select
                      value={planType}
                      onChange={(e) => handlePlanTypeChange(e.target.value as LicensePlanType)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold focus:border-indigo-600 focus:outline-none bg-white cursor-pointer"
                    >
                      <option value="trial">Trial / Demonstração (14 dias)</option>
                      <option value="monthly">Mensal (30 dias)</option>
                      <option value="annual">Anual (365 dias)</option>
                      <option value="lifetime">Vitalício (Ilimitado)</option>
                      <option value="custom">Prazo Customizado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Valor Cobrado (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-emerald-700 focus:border-indigo-600 focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duração da Licença em Dias
                  </label>
                  <input
                    type="number"
                    value={customDays}
                    disabled={planType === 'lifetime'}
                    onChange={(e) => setCustomDays(parseInt(e.target.value, 10) || 30)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium focus:border-indigo-600 focus:outline-none disabled:bg-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Observações Internas (Opcional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Pagamento recebido via PIX em 16/08"
                  rows={2}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Gerar Licença e Serial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
