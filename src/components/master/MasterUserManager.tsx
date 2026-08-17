'use client';

import React, { useState } from 'react';
import { ClientDirectoryUser, LicensePlanType, LicenseStatusType } from '@/types/master';
import {
  Users,
  Search,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  KeyRound,
  Edit2,
  X,
  Save,
  CheckCircle2,
  Calendar,
  DollarSign,
  Sparkles,
} from 'lucide-react';

interface MasterUserManagerProps {
  clients: ClientDirectoryUser[];
  onUpdateClientAndPlan?: (clientId: string, updates: any) => void;
}

export default function MasterUserManager({
  clients,
  onUpdateClientAndPlan,
}: MasterUserManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientDirectoryUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit Form State
  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [planType, setPlanType] = useState<LicensePlanType>('annual');
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatusType>('active');
  const [expirationDate, setExpirationDate] = useState('');
  const [price, setPrice] = useState<number>(380);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.cnpj && c.cnpj.includes(searchTerm))
  );

  const handleOpenEdit = (client: ClientDirectoryUser) => {
    setSelectedClient(client);
    setCompanyName(client.companyName);
    setName(client.name);
    setCnpj(client.cnpj || '');
    setEmail(client.email);
    setPhone(client.phone || '');
    setPlanType(client.planType);
    setLicenseStatus(client.licenseStatus);
    setExpirationDate(
      client.expirationDate ? client.expirationDate.slice(0, 10) : new Date().toISOString().slice(0, 10)
    );
    setPrice(
      client.planType === 'monthly'
        ? 49
        : client.planType === 'annual'
        ? 380
        : client.planType === 'lifetime'
        ? 790
        : 0
    );
    setIsEditModalOpen(true);
    setSavedSuccess(false);
  };

  const handleSaveClientEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !onUpdateClientAndPlan) return;

    onUpdateClientAndPlan(selectedClient.id, {
      name,
      companyName,
      cnpj,
      email,
      phone,
      planType,
      licenseStatus,
      expirationDate: new Date(expirationDate + 'T23:59:59.000Z').toISOString(),
      price,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setIsEditModalOpen(false);
      setSavedSuccess(false);
    }, 1200);
  };

  return (
    <div className="rounded-xl bg-white shadow-xs border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por empresa, CNPJ, nome ou e-mail..."
            className="h-8.5 rounded-lg border border-slate-300 pl-8.5 pr-3 text-xs focus:border-indigo-600 focus:outline-none w-72"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">{filtered.length} empresas registradas</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white font-semibold">
              <th className="py-2.5 px-4">EMPRESA / RESPONSÁVEL</th>
              <th className="py-2.5 px-4">CNPJ & CONTATO</th>
              <th className="py-2.5 px-3 text-center">PLANO ATRIBUÍDO</th>
              <th className="py-2.5 px-3 text-center">STATUS</th>
              <th className="py-2.5 px-3 text-center">EXPIRAÇÃO</th>
              <th className="py-2.5 px-3 text-center w-24">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  Nenhum cliente localizado.
                </td>
              </tr>
            ) : (
              filtered.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 uppercase">{client.companyName}</p>
                    <p className="text-[11px] text-slate-500">{client.name}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-0.5">
                      <p className="font-mono text-slate-700 font-medium text-[11px]">
                        {client.cnpj || 'CNPJ não informado'}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <span>{client.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        client.planType === 'lifetime'
                          ? 'bg-purple-100 text-purple-800'
                          : client.planType === 'annual'
                          ? 'bg-emerald-100 text-emerald-800'
                          : client.planType === 'monthly'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {client.planType}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        client.licenseStatus === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {client.licenseStatus === 'active' ? 'Ativo' : 'Suspenso'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-700">
                    {client.planType === 'lifetime'
                      ? 'Vitalício'
                      : client.expirationDate
                      ? new Date(client.expirationDate).toLocaleDateString('pt-BR')
                      : 'Em teste'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleOpenEdit(client)}
                      className="flex items-center justify-center gap-1 mx-auto rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 text-[11px] font-bold text-indigo-700 transition"
                      title="Editar Empresa, CNPJ e Plano"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Editar</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Client and Plan Modal */}
      {isEditModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Editar Cliente & Configurar Plano</h3>
                <p className="text-xs text-slate-500">
                  Alteração de Razão Social, CNPJ e Assinatura com privilégios de Master
                </p>
              </div>
            </div>

            {savedSuccess ? (
              <div className="my-6 rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
                <h4 className="text-sm font-bold text-emerald-900">Dados do Cliente Atualizados com Sucesso!</h4>
              </div>
            ) : (
              <form onSubmit={handleSaveClientEdit} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Razão Social / Nome da Empresa (Editável pelo Master)
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold uppercase focus:border-indigo-600 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        CNPJ da Empresa (Editável pelo Master)
                      </label>
                      <input
                        type="text"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        placeholder="00.000.000/0001-00"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono font-bold focus:border-indigo-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Nome do Responsável</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-600 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">E-mail</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-600 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">WhatsApp / Telefone</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Plan & License Settings */}
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Configuração da Assinatura & Plano
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Plano Atribuído</label>
                      <select
                        value={planType}
                        onChange={(e) => {
                          const pt = e.target.value as LicensePlanType;
                          setPlanType(pt);
                          if (pt === 'monthly') setPrice(49);
                          else if (pt === 'annual') setPrice(380);
                          else if (pt === 'lifetime') setPrice(790);
                          else if (pt === 'trial') setPrice(0);
                        }}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold focus:border-indigo-600 focus:outline-none bg-white"
                      >
                        <option value="trial">Trial / Demonstração</option>
                        <option value="monthly">Plano Mensal</option>
                        <option value="annual">Plano Anual</option>
                        <option value="lifetime">Plano Vitalício</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Status de Acesso</label>
                      <select
                        value={licenseStatus}
                        onChange={(e) => setLicenseStatus(e.target.value as LicenseStatusType)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold focus:border-indigo-600 focus:outline-none bg-white"
                      >
                        <option value="active">Ativo (Acesso Liberado)</option>
                        <option value="suspended">Suspenso / Bloqueado</option>
                        <option value="expired">Expirado</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Data de Expiração</label>
                      <input
                        type="date"
                        value={expirationDate}
                        disabled={planType === 'lifetime'}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono focus:border-indigo-600 focus:outline-none disabled:bg-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">Valor do Plano (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-emerald-800 focus:border-indigo-600 focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-bold text-white shadow-xs"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Salvar Alterações</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
