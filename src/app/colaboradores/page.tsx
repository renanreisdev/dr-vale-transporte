'use client';

import React, { useState } from 'react';
import { useVTStore } from '@/lib/store';
import { Users, UserPlus, Search, Trash2, Edit2, Check, ShieldCheck, Ticket } from 'lucide-react';
import { formatCurrencyBRL } from '@/lib/vt-engine';

export default function ColaboradoresPage() {
  const { rows, period, addRow, removeRow, updateRow } = useVTStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [newName, setNewName] = useState('');
  const [newWeekdayVouchers, setNewWeekdayVouchers] = useState(2);
  const [newSaturdayVouchers, setNewSaturdayVouchers] = useState(0);
  const [newSaturdaysCount, setNewSaturdaysCount] = useState(period.saturdaysInPeriod || 0);

  const activeRows = rows.filter((r) => r.name.trim().length > 0);
  const filtered = activeRows.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addRow({
      name: newName.trim().toUpperCase(),
      vouchersPerWeekday: newWeekdayVouchers,
      vouchersPerSaturday: newSaturdayVouchers,
      saturdaysWorked: newSaturdaysCount,
      previousDaysBalance: 0,
      previousAmountBalance: 0,
    });

    setNewName('');
    setNewWeekdayVouchers(2);
    setNewSaturdayVouchers(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Users className="h-4 w-4" />
            </div>
            <h1 className="text-base font-bold text-slate-900">Quadro de Colaboradores</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gerencie o cadastro de colaboradores beneficiários do Vale Transporte
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
          Total Ativos: <strong className="text-slate-900 font-bold">{activeRows.length}</strong>
        </div>
      </div>

      {/* Add Employee Form */}
      <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <UserPlus className="h-3.5 w-3.5 text-emerald-600" />
          <span>Cadastrar Novo Colaborador</span>
        </h2>

        <form onSubmit={handleCreateEmployee} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Nome Completo</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex: CARLOS ALBERTO SILVA"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs uppercase font-medium focus:border-emerald-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Vales/dia (Seg a Sex)</label>
            <input
              type="number"
              min={0}
              max={10}
              value={newWeekdayVouchers}
              onChange={(e) => setNewWeekdayVouchers(parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-center font-medium focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Vales/Sábado</label>
            <input
              type="number"
              min={0}
              max={10}
              value={newSaturdayVouchers}
              onChange={(e) => setNewSaturdayVouchers(parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-center font-medium focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-xs"
            >
              <UserPlus className="h-4 w-4" />
              <span>Salvar Cadastro</span>
            </button>
          </div>
        </form>
      </div>

      {/* Employees Table */}
      <div className="rounded-xl bg-white shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome..."
              className="h-8.5 rounded-lg border border-slate-300 pl-8.5 pr-3 text-xs focus:border-emerald-600 focus:outline-none w-64"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">{filtered.length} colaboradores cadastrados</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold">
                <th className="py-2.5 px-4 w-12 text-center text-slate-400">#</th>
                <th className="py-2.5 px-4">NOME DO COLABORADOR</th>
                <th className="py-2.5 px-4 text-center">VALES SEG-SEX</th>
                <th className="py-2.5 px-4 text-center">VALES SÁBADO</th>
                <th className="py-2.5 px-4 text-center">QTD TOTAL NO PERÍODO</th>
                <th className="py-2.5 px-4 text-right">VALOR CREDITADO NO MÊS</th>
                <th className="py-2.5 px-4 w-20 text-center">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Nenhum colaborador encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((row, index) => (
                  <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                    <td className="py-3 px-4 text-center font-mono text-slate-400 font-medium">
                      {(index + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 uppercase">{row.name}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-800">
                        {row.vouchersPerWeekday} un/dia
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-800">
                        {row.vouchersPerSaturday > 0 ? `${row.vouchersPerSaturday} un/sáb` : 'Não trabalha'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{row.totalVouchers} un.</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">
                      {formatCurrencyBRL(row.netAmountToCredit)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => removeRow(row.id)}
                        className="rounded p-1 text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition"
                        title="Excluir Colaborador"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
