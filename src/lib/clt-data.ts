import { LegalTopic } from '@/types/vt';

export const CLT_LEGAL_TOPICS: LegalTopic[] = [
  {
    id: 'vt-legislacao-base',
    title: 'Legislação Base do Vale Transporte',
    category: 'LEGISLACAO',
    articleRef: 'Lei nº 7.418/1985 e Decreto nº 95.247/1987',
    summary: 'O Vale-Transporte é benefício obrigatório que o empregador antecipará ao trabalhador para utilização efetiva em despesas de deslocamento residência-trabalho e vice-versa.',
    fullText: `O vale-transporte é regulamentado pela Lei nº 7.418/1985, alterada pela Lei nº 7.619/1987, e regulamentada pelo Decreto nº 95.247/1987.
    
Principais pontos legais:
1. Natureza Jurídica: Não tem natureza salarial, não se incorpora à remuneração para quaisquer efeitos e não constitui base de incidência de contribuição previdenciária ou de FGTS.
2. Custeio: O empregado participa com a parcela de até 6% (seis por cento) de seu salário básico. O excedente é custeado integralmente pelo empregador.
3. Finalidade Estrita: Destina-se exclusivamente ao deslocamento entre a residência e o local de trabalho por meio do sistema de transporte coletivo público.`,
    implications: [
      'Proibido pagamento em dinheiro (salvo falta de estoque ou convenção coletiva expressa).',
      'Desconto máximo de 6% sobre o salário básico (excluindo adicionais/comissões).',
      'Obrigatoriedade de atualização cadastral de endereço pelo colaborador.',
    ],
    recommendations: [
      'Colher anualmente o Termo de Opção ou Renúncia assinado.',
      'Manter o trajeto e linhas de ônibus atualizados no prontuário.',
      'Calcular com exatidão dias úteis e deduções de faltas/férias.',
    ],
  },
  {
    id: 'vt-uso-indevido',
    title: 'Uso Indevido do Vale-Transporte e Fraudes',
    category: 'CLT',
    articleRef: 'Decreto nº 95.247/1987, Art. 7º, § 3º',
    summary: 'A declaração falsa ou o uso indevido do vale-transporte constituem falta grave, sujeitando o empregado à demissão por justa causa.',
    fullText: `O artigo 7º, § 3º, do Decreto nº 95.247/1987 expressamente determina:
"A declaração falsa ou o uso indevido do Vale-Transporte constituem falta grave."

Caracterizam uso indevido:
1. Venda ou Comercialização: Vender créditos do cartão de VT para terceiros ou em estabelecimentos para obter dinheiro em espécie.
2. Uso para Fins Pessoais ou de Terceiros: Emprestar o cartão a familiares ou utilizá-lo para viagens particulares não relacionadas à jornada.
3. Fraude de Endereço Residencial: Declarar endereço falso mais distante para receber valor de passe superior ao real.
4. Deslocamento por Meio Próprio: Utilizar veículo próprio (carro/moto) e continuar vendendo o saldo do vale transporte concedido pela empresa.`,
    implications: [
      'Quebra incontornável do elemento fidúcia (confiança).',
      'Enquadramento imediato no Artigo 482, alínea "a" (Improbidade) da CLT.',
      'Possibilidade de ressarcimento dos valores desviados.',
    ],
    recommendations: [
      'Realizar auditoria periódica de extratos junto à concessionária de transporte.',
      'Exigir comprovante de residência atualizado no nome do empregado.',
      'Emitir advertência formal e, em casos de dolo/reiteração, proceder com a Justa Causa documentalmente embasada.',
    ],
  },
  {
    id: 'art-482-a',
    title: 'Art. 482, "a" - Ato de Improbidade',
    category: 'JUSTA_CAUSA',
    articleRef: 'Artigo 482, alínea "a", da CLT',
    summary: 'Conduta desonesta, fraude, má-fé ou abuso de confiança com o objetivo de obter vantagem própria ou para terceiros, causando prejuízos à empresa.',
    fullText: `Ato de improbidade é qualquer ação ou omissão desonesta do empregado que envolva fraude, má-fé ou abuso de confiança com o intuito de auferir vantagem ilícita.

Exemplos práticos:
- Venda sistemática do saldo de vale-transporte creditado pela empresa.
- Apresentação de atestado médico falso ou adulterado para justificar ausência.
- Furto ou apropriação indébita de valores, equipamentos ou mercadorias.
- Adulteração de comprovantes de despesas ou notas fiscais para reembolso.`,
    implications: [
      'Rescisão imediata sem aviso prévio, 13º proporcional, férias proporcionais e sem saque do FGTS/multa de 40%.',
      'Responsabilidade civil em caso de prejuízos patrimoniais.',
      'Eventual responsabilização penal por estelionato ou apropriação indébita.',
    ],
    recommendations: [
      'Possuir provas robustas: extratos do cartão de transporte, câmeras, recibos ou confissão documentada.',
      'Aplicar a penalidade imediatamente após a ciência inequívoca dos fatos (princípio da imediatidade).',
    ],
  },
  {
    id: 'art-482-b',
    title: 'Art. 482, "b" - Incontinência de Conduta ou Mau Procedimento',
    category: 'JUSTA_CAUSA',
    articleRef: 'Artigo 482, alínea "b", da CLT',
    summary: 'Violação de regras de conduta moral, respeito e decoro no ambiente de trabalho ou comportamento reprovável que prejudica o ambiente funcional.',
    fullText: `A incontinência de conduta está ligada à esfera moral e sexual (assédio, atos obscenos, pornografia). O mau procedimento abrange comportamento genérico incorreto, desrespeitoso ou inadequado que desrespeita as normas sociais e internas da empresa.`,
    implications: [
      'Rescisão por justa causa mediante histórico disciplinar ou falta gravíssima isolada.',
    ],
    recommendations: [
      'Manter manual de conduta e código de ética assinado por todos os colaboradores.',
    ],
  },
  {
    id: 'art-482-c-l',
    title: 'Art. 482 - Demais Alíneas de Falta Grave',
    category: 'JUSTA_CAUSA',
    articleRef: 'Artigo 482, alíneas "c" a "l", da CLT',
    summary: 'Relação exaustiva de motivos legais que justificam a rescisão contratual com justa causa.',
    fullText: `Alíneas do Artigo 482 da CLT:
• c) Negociação habitual por conta própria ou alheia sem permissão do empregador (concorrência desleal).
• d) Condenação criminal do empregado, passada em julgado, caso não tenha havido suspensão da execução da pena.
• e) Desídia no desempenho das respectivas funções (atrasos constantes, faltas injustificadas, preguiça profissional crônica).
• f) Embriaguez habitual ou em serviço.
• g) Violação de segredo da empresa (vazamento de dados, clientes ou tecnologia).
• h) Ato de indisciplina (descumprimento de ordens gerais) ou insubordinação (descumprimento de ordem direta de superior).
• i) Abandono de emprego (ausência injustificada superior a 30 dias consecutivos).
• j) Ato lesivo da honra ou da boa fama praticado no serviço contra qualquer pessoa, ou ofensas físicas.
• k) Ato lesivo da honra ou ofensas físicas praticadas contra o empregador e superiores hierárquicos.
• l) Prática constante de jogos de azar.
• m) Perda da habilitação ou dos requisitos estabelecidos em lei para o exercício da profissão.`,
    implications: [
      'Perda de quase todas as verbas rescisórias indenizatórias.',
    ],
    recommendations: [
      'Sempre aplicar gradação pedagógica da pena (advertência verbal, advertência escrita, suspensão e justa causa), exceto em faltas gravíssimas que quebram imediatamente a fidúcia.',
    ],
  },
  {
    id: 'art-71-intervalos',
    title: 'Art. 71 CLT - Intervalo para Refeição, Descanso & Lanche',
    category: 'INTERVALO',
    articleRef: 'Artigo 71 da Consolidação das Leis do Trabalho',
    summary: 'Regulamentação dos intervalos intrajornada para repouso e alimentação e tratamento do intervalo para lanche.',
    fullText: `Regras Gerais dos Intervalos (Art. 71 CLT):
1. Jornada superior a 6 horas: Obrigatório intervalo mínimo de 1 hora e máximo de 2 horas.
2. Jornada entre 4 e 6 horas: Obrigatório intervalo contínuo de 15 minutos.
3. Intervalo para Lanche: Não é obrigação legal na CLT a concessão de intervalo adicional para lanche além do intervalo regulamentar, salvo se expressamente pactuado em Acordo ou Convenção Coletiva de Trabalho (CCT).
4. Tolerâncias e Descontos: Conforme jurisprudência e CLT, os excessos injustificados de intervalos de lanche, bem como atrasos e saídas antecipadas, poderão ser devidamente descontados da jornada diária e refletir proporcionalmente no cômputo dos vales de transporte quando houver dias não trabalhados.`,
    implications: [
      'A não concessão do intervalo mínimo obriga o pagamento do período suprimido com acréscimo de 50% de natureza indenizatória.',
      'Empresas podem estabelecer políticas internas de 10 a 15 minutos para café, desde que com controle de excessos.',
    ],
    recommendations: [
      'Registrar formalmente os horários contratuais de almoço e pausas.',
      'Alinhar o benefício de VT com os dias de efetivo comparecimento presencial.',
    ],
  },
];

export const MODELOS_DOCUMENTOS = {
  termoOpcao: `TERMO DE OPÇÃO / DECLARAÇÃO DE VALE TRANSPORTE
(Lei nº 7.418/85 e Decreto nº 95.247/87)

EMPRESA: [NOME DA EMPRESA]
CNPJ: [CNPJ DA EMPRESA]

COLABORADOR(A): [NOME DO COLABORADOR]
CPF: [CPF]    CARGO: [CARGO]
ENDEREÇO RESIDENCIAL: [ENDEREÇO COMPLETO]

Opção pelo Benefício:
(  ) OPTANTE pelo recebimento do Vale-Transporte.
     Linha/Trajeto de Ida: [LINHA/EMPRESA] - Tarifa R$: [VALOR]
     Linha/Trajeto de Volta: [LINHA/EMPRESA] - Tarifa R$: [VALOR]
     Total de Vales/Dia: [QUANTIDADE]

(  ) NÃO OPTANTE / RENÚNCIA ao benefício do Vale-Transporte, por utilizar condução própria ou não necessitar do transporte público.

Declaro sob as penas da lei que as informações prestadas são a expressão da verdade, comprometendo-me a comunicar imediatamente qualquer alteração de endereço. Declaro ciência de que a declaração falsa ou uso indevido constitui falta grave passível de demissão por justa causa (Art. 482 CLT).

Autorizo o desconto legal de até 6% (seis por cento) do meu salário básico em folha de pagamento.

[CIDADE - UF], ______ de ___________________ de 2026.


____________________________________________
Assinatura do(a) Colaborador(a)`,

  termoCompromisso: `TERMO DE COMPROMISSO E RESPONSABILIDADE DE USO DO VALE TRANSPORTE

Pelo presente instrumento, eu, [NOME DO COLABORADOR], portador do CPF nº [CPF], funcionário da empresa [NOME DA EMPRESA], comprometo-me a:

1. Utilizar os créditos/passes do Vale-Transporte estrita e exclusivamente para meu deslocamento diário entre minha residência e o local de trabalho.
2. Não comercializar, repassar, trocar por dinheiro ou ceder a terceiros quaisquer créditos fornecidos pela empresa.
3. Comunicar imediatamente ao setor de Recursos Humanos qualquer mudança definitiva ou temporária de endereço residencial.
4. Devolver ou compensar o saldo remanescente em caso de faltas, licenças, afastamentos, férias ou rescisão do contrato de trabalho.

Declaro estar ciente de que o descumprimento destas cláusulas configura falta grave por ato de improbidade (Artigo 482, alínea "a" da CLT), ensejando a rescisão imediata do contrato por justa causa, além do ressarcimento dos prejuízos.

[CIDADE - UF], ______ de ___________________ de 2026.


____________________________________________
Assinatura do(a) Colaborador(a)`,
};
