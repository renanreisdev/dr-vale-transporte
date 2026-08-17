'use client';

import React, { useState } from 'react';
import { MasterAdminUser } from '@/types/master';
import {
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Trash2,
  Lock,
  Mail,
  User,
  X,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface MasterAdminTeamProps {
  masterAdmins: MasterAdminUser[];
  onAddMasterAdmin: (name: string, email: string) => void;
  onRemoveMasterAdmin: (id: string) => void;
}

export default function MasterAdminTeam({
  masterAdmins,
  onAddMasterAdmin,
  onRemoveMasterAdmin,
}: MasterAdminTeamProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCreateMaster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onAddMasterAdmin(name, email);
    setSuccessMsg(`Novo Administrador Master "${name}" adicionado com sucesso!`);

    setName('');
    setEmail('');
    setPassword('');
    setIsModalOpen(false);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Equipe de Administradores Master</h2>
              <p className="text-xs text-slate-500">
                Usuários com acesso total à emissão de licenças, faturamento e controle de clientes
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white transition shadow-xs"
          >
            <UserPlus className="h-4 w-4" />
            <span>Cadastrar Novo Master</span>
          </button>
        </div>

        {successMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold">
                <th className="py-2.5 px-4">NOME DO MASTER</th>
                <th className="py-2.5 px-4">E-MAIL AUTORIZADO</th>
                <th className="py-2.5 px-3 text-center">NÍVEL</th>
                <th className="py-2.5 px-3 text-center">DATA DE INCLUSÃO</th>
                <th className="py-2.5 px-3 text-center w-20">AÇÃO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {masterAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-indigo-600" />
                    <span>{admin.name}</span>
                    {admin.isPrimaryMaster && (
                      <span className="rounded bg-indigo-100 text-indigo-800 text-[9px] font-bold px-1.5 py-0.5">
                        PRINCIPAL
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-mono text-[11px]">{admin.email}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="rounded bg-purple-100 text-purple-800 px-2 py-0.5 text-[10px] font-bold uppercase">
                      Super Admin
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center text-slate-500 text-[11px]">
                    {new Date(admin.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {!admin.isPrimaryMaster && (
                      <button
                        onClick={() => {
                          if (confirm(`Remover o acesso Master de ${admin.name}?`)) {
                            onRemoveMasterAdmin(admin.id);
                          }
                        }}
                        className="rounded p-1 text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition"
                        title="Remover Master"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to Register New Master */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Cadastrar Novo Usuário Master</h3>
                <p className="text-xs text-slate-500">Conceda privilégios de dono/administrador para um novo sócio</p>
              </div>
            </div>

            <form onSubmit={handleCreateMaster} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Ana Paula Reis"
                    className="w-full rounded-xl border border-slate-300 pl-9.5 pr-3 py-2 text-xs font-medium focus:border-indigo-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">E-mail do Administrador</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="socio@drvale.com.br"
                    className="w-full rounded-xl border border-slate-300 pl-9.5 pr-3 py-2 text-xs font-medium focus:border-indigo-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Definir Senha de Acesso</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    className="w-full rounded-xl border border-slate-300 pl-9.5 pr-3 py-2 text-xs font-medium focus:border-indigo-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="rounded-lg bg-amber-50 p-3 text-[11px] text-amber-800 border border-amber-200">
                <span className="font-semibold">Atenção:</span> Usuários Master têm permissão total para criar e
                revogar licenças comerciais.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-bold text-white shadow-xs"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Cadastrar Administrador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
