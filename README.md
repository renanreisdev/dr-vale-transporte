# DR VALE - Gestão & Cálculo de Vale Transporte

Sistema SaaS corporativo completo para cálculo, rateio, apuração e emissão de relatórios e recibos de **Vale Transporte**, desenvolvido em conformidade com o **Artigo 455 e 482 da CLT**, **Lei nº 7.418/1985** e **Decreto nº 95.247/1987**.

Construído com base na planilha original `Calculo Vale Transporte 15.xlsm`, preservando 100% das fórmulas, rateios de sábados, deduções de saldos anteriores e lógica empresarial, agora com arquitetura moderna, responsiva, exportação para PDF e Excel e sistema comercial de licença/trial.

---

## Principais Funcionalidades

### 1. Motor de Cálculo Reativo em Tempo Real
- **Dias Úteis Base**: `(Data Final - Data Inicial + 1) - Domingos e Feriados`.
- **Cálculo Automático por Calendário**: Assistente que identifica sábados, domingos e feriados nacionais brasileiros automaticamente para o mês e ano selecionados.
- **Rateio de Sábados**: Cômputo individual de dias de sábado e quantidade de vales por sábado.
- **Compensação e Dedução de Saldo Anterior**: Ajuste inteligente de dias de folga/férias a compensar e saldo remanescente em cartão (R$).
- **Totalizadores Automáticos**: Apuração instantânea do valor individual a creditar por colaborador e valor total da empresa.

### 2. Relatórios Oficiais e Comprovantes de Entrega
- **Relatório Consolidado A4**: Relatório oficial pronto para contabilidade e auditoria, idêntico à aba `RELATÓRIO VALES` do Excel.
- **Exportação para PDF**: Geração de PDFs profissionais com cabeçalho da empresa, CNPJ e bloco de assinaturas.
- **Recibos Individuais de Entrega**: Comprovante destacável com texto jurídico de responsabilidade e campo de assinatura do colaborador.
- **Exportação e Importação Excel (.xlsx)**: Compatibilidade bidirecional com planilhas Excel.

### 3. Central Jurídica CLT & Faltas Graves (Art. 482)
- **Guia Completo da CLT**: Lei 7.418/85, Decreto 95.247/87 e Artigo 482 (Justa Causa - alíneas A a L).
- **Regulamentação de Intervalos**: Art. 71 da CLT (Intervalo intrajornada e tratamento de intervalos para lanche).
- **Modelos de Documentos Prontos para Uso**:
  - Termo de Opção e Declaração de Vale Transporte
  - Termo de Compromisso e Responsabilidade de Uso do VT

### 4. Sistema Comercial de Demonstração (Demo Validator)
- **Período de Demonstração (Trial 14 Dias)**: Novos clientes e avaliadores podem testar todas as funções do sistema durante o período de teste.
- **Validador Criptográfico de Licenças**: Suporte a chaves seriais (Mensal, Anual e Vitalícia) com checksum criptográfico.
- **Gerador de Licenças para o Administrador**: Painel exclusivo em `/licenca` para você gerar seriais e vender aos seus clientes em segundos.
- **Integração Comercial via WhatsApp**: Botões de contratação e suporte com 1 clique.

### 5. Persistência Híbrida (Local-First + Supabase)
- **Local-First**: Todos os dados funcionam 100% offline e são salvos localmente sem necessidade inicial de configuração de banco.
- **Supabase Cloud Sync**: Suporte a sincronização em nuvem e multi-tenant com schema SQL pronto em `supabase/schema.sql`.

---

## Tecnologias Utilizadas

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Planilhas**: [SheetJS (xlsx)](https://sheetjs.com/)
- **Geração de PDF**: [jsPDF](https://github.com/parallax/jsPDF) & [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- **Banco de Dados em Nuvem**: [Supabase](https://supabase.com/)

---

## Como Executar Localmente

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

3. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## Como Fazer o Deploy na Vercel

1. Crie um repositório no seu GitHub e envie o código:
   ```bash
   git add .
   git commit -m "feat: DR VALE SaaS de Gestão de Vale Transporte"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
   git push -u origin main
   ```

2. Acesse [vercel.com](https://vercel.com) e clique em **"Add New Project"**.
3. Importe o repositório do seu GitHub.
4. Clique em **"Deploy"** (a Vercel detectará o Next.js automaticamente).
5. O sistema estará online em menos de 1 minuto!

---

## Como Configurar o Supabase (Opcional)

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. No painel do Supabase, vá em **SQL Editor** e execute o script contido em `supabase/schema.sql`.
3. Copie a **Project URL** e a **anon public key** em **Project Settings > API**.
4. Configure as variáveis no seu `.env.local` ou nas variáveis de ambiente da Vercel:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://sua-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
   ```

---

## Licenciamento e Suporte

Desenvolvido para **SIDIAL FERRAGENS** e comercialização para empresas e departamentos pessoais.  
Suporte e Vendas: **(53) 99122-6768** (Reis).
