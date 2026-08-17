'use client';

import React, { useState } from 'react';
import { ClientDirectoryUser } from '@/types/master';
import { Users, Search, Building2, Mail, Phone, ShieldCheck, KeyRound } from 'lucide-react';

interface MasterUserManagerProps {
  clients: ClientDirectoryUser[];
}

export default function MasterUserManager({ clients }: MasterUserManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-xl bg-white shadow-xs border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por empresa, nome ou e-mail..."
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
              <th className="py-2.5 px-4">CONTATO & E-MAIL</th>
              <th className="py-2.5 px-3 text-center">PLANO ATUAL</th>
              <th className="py-2.5 px-3 text-center">STATUS</th>
              <th className="py-2.5 px-4">CHAVE SERIAL VINCULADA</th>
              <th className="py-2.5 px-3 text-center">CADASTRO</th>
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
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <span>{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-800">
                      {client.planType}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold uppercase">
                      {client.licenseStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                    {client.licenseKey || 'Não atribuída'}
                  </td>
                  <td className="py-3 px-3 text-center text-[11px] text-slate-500">
                    {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
