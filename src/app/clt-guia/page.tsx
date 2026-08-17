'use client';

import React, { useState } from 'react';
import { CLT_LEGAL_TOPICS, MODELOS_DOCUMENTOS } from '@/lib/clt-data';
import {
  BookOpen,
  Scale,
  AlertTriangle,
  FileCheck,
  Search,
  Copy,
  Check,
  ShieldAlert,
  Download,
  FileText,
} from 'lucide-react';

export default function CLTGuiaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredTopics = CLT_LEGAL_TOPICS.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.fullText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  const handleDownloadTxt = (content: string, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-slate-900 p-6 text-white shadow-xs border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
              Conformidade Trabalhista
            </span>
            <span className="text-xs text-slate-400 font-mono">CLT • Jurisprudência TST</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1">
            Central Jurídica CLT & Faltas Graves (Art. 482)
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Guia completo de regulamentação do Vale-Transporte, fiscalização de uso indevido, intervalos intrajornada
            e enquadramento de demissão por justa causa com segurança jurídica.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-xs border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por artigo, jurisprudência, improbidade..."
            className="h-8.5 rounded-lg border border-slate-300 pl-8.5 pr-3 text-xs focus:border-emerald-600 focus:outline-none w-72"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'ALL', label: 'Todos os Tópicos' },
            { id: 'LEGISLACAO', label: 'Legislação Base' },
            { id: 'JUSTA_CAUSA', label: 'Art. 482 (Justa Causa)' },
            { id: 'CLT', label: 'Uso Indevido & Fraudes' },
            { id: 'INTERVALO', label: 'Art. 71 (Intervalos)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legal Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="rounded-xl bg-white p-5 shadow-xs border border-slate-200 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-200">
                  {topic.articleRef}
                </span>
                <span className="text-[10px] uppercase font-mono text-slate-400">{topic.category}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{topic.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{topic.summary}</p>

              {/* Full Text excerpt */}
              <div className="mt-3 rounded-lg bg-slate-50 p-3 text-[11px] text-slate-700 font-mono whitespace-pre-line border border-slate-200">
                {topic.fullText}
              </div>

              {/* Implications & Recommendations */}
              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-900 text-[11px] flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-amber-600" />
                    Impactos e Riscos Trabalhistas:
                  </span>
                  <ul className="mt-1 space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                    {topic.implications.map((imp, idx) => (
                      <li key={idx}>{imp}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-semibold text-slate-900 text-[11px] flex items-center gap-1">
                    <FileCheck className="h-3 w-3 text-emerald-600" />
                    Recomendações Práticas para a Empresa / RH:
                  </span>
                  <ul className="mt-1 space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                    {topic.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => handleCopyText(topic.fullText, topic.id)}
                className="flex items-center gap-1 rounded bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition"
              >
                {copiedKey === topic.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === topic.id ? 'Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Downloadable HR Models */}
      <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Modelos Oficiais de Documentos para RH</h2>
            <p className="text-xs text-slate-500">Termos prontos para colher assinatura e blindar a empresa de passivos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Termo de Opção */}
          <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Termo de Opção / Declaração de VT</h3>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopyText(MODELOS_DOCUMENTOS.termoOpcao, 'opcao')}
                  className="rounded p-1 text-slate-600 hover:bg-slate-200 transition"
                  title="Copiar texto"
                >
                  {copiedKey === 'opcao' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleDownloadTxt(MODELOS_DOCUMENTOS.termoOpcao, 'Termo_Opcao_Vale_Transporte.txt')}
                  className="rounded p-1 text-slate-600 hover:bg-slate-200 transition"
                  title="Baixar arquivo TXT"
                >
                  <Download className="h-4 w-4 text-slate-600" />
                </button>
              </div>
            </div>
            <pre className="h-48 overflow-y-auto rounded border border-slate-200 bg-white p-3 font-mono text-[10px] text-slate-700 whitespace-pre-wrap">
              {MODELOS_DOCUMENTOS.termoOpcao}
            </pre>
          </div>

          {/* Termo de Compromisso */}
          <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Termo de Compromisso e Responsabilidade de Uso</h3>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopyText(MODELOS_DOCUMENTOS.termoCompromisso, 'compromisso')}
                  className="rounded p-1 text-slate-600 hover:bg-slate-200 transition"
                  title="Copiar texto"
                >
                  {copiedKey === 'compromisso' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleDownloadTxt(MODELOS_DOCUMENTOS.termoCompromisso, 'Termo_Compromisso_Uso_VT.txt')}
                  className="rounded p-1 text-slate-600 hover:bg-slate-200 transition"
                  title="Baixar arquivo TXT"
                >
                  <Download className="h-4 w-4 text-slate-600" />
                </button>
              </div>
            </div>
            <pre className="h-48 overflow-y-auto rounded border border-slate-200 bg-white p-3 font-mono text-[10px] text-slate-700 whitespace-pre-wrap">
              {MODELOS_DOCUMENTOS.termoCompromisso}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
