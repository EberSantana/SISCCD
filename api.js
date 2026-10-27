/**
 * ============================================================================
 * API.JS - Sistema de Conselho de Classe Seguro (SISCCD)
 * IFS Campus Tobias Barreto
 * ============================================================================
 * CONFORMIDADE JURÍDICA INTEGRADA (6 PILARES LEGAIS):
 * 1. ECA Digital (Lei nº 15.211/2025): Proibição de autodeclaração de idade
 *    (idade aferida via registro documental SUAP), vinculação obrigatória de
 *    menores de 16 anos (14-15 anos) aos pais/responsáveis legais, vedação de
 *    perfilamento comercial e protocolo de proteção contra violência/automutilação.
 * 2. LGPD (Lei nº 13.709/2018 - Art. 14): Tratamento no melhor interesse do
 *    adolescente com controle de Consentimento Específico do Responsável Legal
 *    para exibição de foto (bloqueio automático de foto caso não haja consentimento).
 * 3. ECA (Lei nº 8.069/1990 - Arts. 17, 18 e 53) & CF/88 (Art. 227): Proteção
 *    integral, prioridade absoluta e inviolabilidade da imagem e dignidade.
 * 4. Marco Civil da Internet (Lei nº 12.965/2014): Guarda segura de registros
 *    de acesso, privacidade e não fornecimento de dados a terceiros.
 * 5. Lei do Bullying e Cyberbullying (Lei nº 13.185/2015 e Lei nº 14.811/2024):
 *    Validador ético anti-estigmatização nos pareceres e protocolo de acolhimento
 *    contra intimidação sistemática e cyberbullying.
 */

const STORAGE_KEYS = {
  API_URL: 'IFS_CONSELHO_API_URL',
  STUDENTS: 'IFS_CONSELHO_STUDENTS_CACHE',
  EVALUATIONS: 'IFS_CONSELHO_EVALUATIONS_CACHE',
  REFERRALS: 'IFS_CONSELHO_REFERRALS_CACHE',
  AUDIT_LOGS: 'IFS_CONSELHO_AUDIT_LOGS',
  LGPD_CONSENTS: 'IFS_CONSELHO_LGPD_CONSENTS',
  PINS: 'IFS_CONSELHO_TEACHER_PINS',
  SESSION: 'IFS_CONSELHO_ACTIVE_SESSION',
  CONFIG: 'IFS_CONSELHO_CONFIG',
  DB_VERSION: 'IFS_CONSELHO_DB_VER'
};

const CURRENT_CONSELHO_VERSION = 'v2_lei15211_eca_digital_2026';
const DEFAULT_PIN = '1234';

// Turmas do Ensino Médio Integrado (14 a 17 anos - Proteção prioritária ECA/LGPD) e Subsequente
const TURMAS_IFS = [
  { id: '1º DS', nome: '1º Ano - Desenvolvimento de Sistemas', curso: 'DS', modalidade: 'Integrado (14-17 anos)', ecaProtegido: true },
  { id: '2º DS', nome: '2º Ano - Desenvolvimento de Sistemas', curso: 'DS', modalidade: 'Integrado (14-17 anos)', ecaProtegido: true },
  { id: '3º DS', nome: '3º Ano - Desenvolvimento de Sistemas', curso: 'DS', modalidade: 'Integrado (14-17 anos)', ecaProtegido: true },
  { id: '1º ADM', nome: '1º Ano - Administração', curso: 'ADM', modalidade: 'Integrado (14-17 anos)', ecaProtegido: true },
  { id: '2º ADM', nome: '2º Ano - Administração', curso: 'ADM', modalidade: 'Integrado (14-17 anos)', ecaProtegido: true },
  { id: '3º ADM', nome: '3º Ano - Administração', curso: 'ADM', modalidade: 'Integrado (14-17 anos)', ecaProtegido: true },
  { id: '1º Info (Subsequente)', nome: '1º Semestre - Informática (Subsequente)', curso: 'INFO', modalidade: 'Subsequente', ecaProtegido: false },
  { id: '3º Info (Subsequente)', nome: '3º Semestre - Informática (Subsequente)', curso: 'INFO', modalidade: 'Subsequente', ecaProtegido: false }
];

// Docentes e Equipe Pedagógica do IFS Campus Tobias Barreto
const DOCENTES_IFS = {
  "Coordenação Pedagógica / ETP": {
    email: "coordenacao.tobiasbarreto@ifs.edu.br",
    perfil: "coordenacao",
    disciplinasPorTurma: { "*": ["Acompanhamento Pedagógico", "Coordenação de Curso"] }
  },
  "NAPNE / Assistência Estudantil": {
    email: "napne.tobiasbarreto@ifs.edu.br",
    perfil: "coordenacao",
    disciplinasPorTurma: { "*": ["Atendimento Educacional Especializado", "Psicologia / Serviço Social"] }
  },
  "Adriano": {
    email: "adriano@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: { "1º ADM": ["Artes"], "*": ["Artes"] }
  },
  "Alex": {
    email: "alex@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: { "1º ADM": ["História"], "2º ADM": ["História"], "*": ["História"] }
  },
  "Alyrio": {
    email: "alyrio@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: { "1º ADM": ["Matemática"], "3º ADM": ["Matemática"], "*": ["Matemática"] }
  },
  "Ângelo": {
    email: "angelo@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: { "1º DS": ["Programação 1"], "3º Info (Subsequente)": ["Tópicos Especiais 1"], "*": ["Programação"] }
  },
  "Christiano": {
    email: "christiano@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: { "3º DS": ["Tópicos Especiais"], "3º Info (Subsequente)": ["CS2", "Eng. Software"], "*": ["Computação"] }
  },
  "Eber": {
    email: "eber.santana@ifs.edu.br",
    perfil: "coordenacao",
    disciplinasPorTurma: {
      "1º DS": ["CS1"],
      "2º DS": ["Banco de Dados e Eng. Software (BD e ES)"],
      "1º Info (Subsequente)": ["Informática Básica"],
      "*": ["BD e ES / CS1"]
    }
  },
  "Elliot": {
    email: "elliot@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: {
      "1º DS": ["Introdução à Informática"],
      "3º DS": ["Projeto Integrador 2"],
      "3º Info (Subsequente)": ["Programação 3"],
      "*": ["Projeto Integrador / Informática"]
    }
  },
  "Emerson": {
    email: "emerson@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: {
      "2º ADM": ["Informática Básica"],
      "2º DS": ["Projeto Integrador 1", "CS2"],
      "3º DS": ["Redes de Computadores e SI"],
      "1º Info (Subsequente)": ["Org. Comp. e SO"],
      "*": ["Redes / Sistemas"]
    }
  },
  "Eric": {
    email: "eric@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: {
      "2º DS": ["Programação 2"],
      "1º Info (Subsequente)": ["Programação 1"],
      "*": ["Programação"]
    }
  },
  "Felippe": {
    email: "felippe@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: {
      "1º ADM": ["Noções de Economia"],
      "2º ADM": ["Matemática Financeira"],
      "*": ["Economia / Finanças"]
    }
  },
  "Fernanda": {
    email: "fernanda@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: {
      "1º DS": ["Inglês"],
      "2º DS": ["Português"],
      "3º DS": ["Inglês Instrumental"],
      "1º Info (Subsequente)": ["Inglês Instrumental"],
      "*": ["Português / Inglês"]
    }
  },
  "Grayce": {
    email: "grayce@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: {
      "2º ADM": ["Gestão de Projetos"],
      "3º ADM": ["Gestão Ambiental"],
      "*": ["Gestão"]
    }
  },
  "Luiz Felipe": {
    email: "luiz.felipe@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: {
      "1º DS": ["Projeto Integrador 2"],
      "2º DS": ["Português"],
      "*": ["Linguagens / Projeto"]
    }
  },
  "Pedro Ernesto": {
    email: "pedro.ernesto@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: {
      "1º DS": ["Química"],
      "2º ADM": ["Química"],
      "*": ["Química"]
    }
  },
  "Pedro Goes": {
    email: "pedro.goes@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: {
      "1º ADM": ["Administração Geral"],
      "2º ADM": ["Gestão de Pessoas"],
      "*": ["Administração"]
    }
  },
  "Rafael": {
    email: "rafael@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: {
      "1º DS": ["Introdução à Informática"],
      "2º DS": ["CS2"],
      "3º Info (Subsequente)": ["Eng. Software"],
      "*": ["Eng. Software / CS2"]
    }
  },
  "Raisa": {
    email: "raisa@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: {
      "1º ADM": ["Biologia"],
      "2º ADM": ["Biologia"],
      "*": ["Biologia"]
    }
  },
  "Sanderson": {
    email: "sanderson@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: {
      "1º ADM": ["Educação Física"],
      "2º DS": ["Educação Física"],
      "*": ["Educação Física"]
    }
  },
  "Sérgio": {
    email: "sergio@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: {
      "1º ADM": ["Administração Mercadológica"],
      "2º ADM": ["Técnicas de Vendas e Atendimento"],
      "*": ["Administração"]
    }
  },
  "Vagner": {
    email: "vagner@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: {
      "1º ADM": ["Física"],
      "2º ADM": ["Física"],
      "*": ["Física"]
    }
  },
  "Vinicius": {
    email: "vinicius@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: {
      "1º DS": ["Filosofia"],
      "1º ADM": ["Ética e Relações Humanas"],
      "*": ["Filosofia / Ética"]
    }
  },
  "Vitor": {
    email: "vitor@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: {
      "1º ADM": ["Geografia"],
      "2º ADM": ["Geografia"],
      "*": ["Geografia"]
    }
  },
  "Weder": {
    email: "weder@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: {
      "1º ADM": ["Metodologia da Pesquisa"],
      "2º ADM": ["Sociologia"],
      "*": ["Sociologia / Metodologia"]
    }
  },
  "Welkson": {
    email: "welkson@ifs.edu.br",
    perfil: "docente",
    disciplinasPorTurma: {
      "3º ADM": ["Gestão da Operação", "Gestão Financeira"],
      "*": ["Gestão"]
    }
  }
};

// Gera avatar SVG ilustrativo para dados de demonstração ou quando o consentimento de imagem não está ativo
function gerarAvatarDemoSVG(iniciais, corFundo, legenda = "AVATAR PROTEGIDO (ECA/LGPD)") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${corFundo}"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <rect width="200" height="200" rx="28" fill="url(#g)"/>
    <circle cx="100" cy="78" r="34" fill="rgba(255,255,255,0.22)"/>
    <path d="M42 178 C42 132 158 132 158 178" fill="rgba(255,255,255,0.22)"/>
    <text x="100" y="90" text-anchor="middle" fill="#ffffff" font-family="Inter, sans-serif" font-weight="800" font-size="26">${iniciais}</text>
    <rect x="14" y="156" width="172" height="24" rx="12" fill="rgba(0,0,0,0.52)"/>
    <text x="100" y="172" text-anchor="middle" fill="#e2e8f0" font-family="Inter, sans-serif" font-weight="600" font-size="9">${legenda}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Validador Ético de Linguagem Pedagógica (Lei 13.185/2015, Lei 14.811/2024 e ECA Art. 17/18)
// Impede o registro acidental de termos pejorativos, humilhantes ou estigmatizantes sobre adolescentes.
const TERMOS_ESTIGMATIZANTES_VEDADOS = [
  { termo: "burro", sugestao: "apresenta defasagem de aprendizagem que requer mediação pedagógica" },
  { termo: "preguiçoso", sugestao: "baixa adesão à realização das atividades propostas" },
  { termo: "preguicoso", sugestao: "baixa adesão à realização das atividades propostas" },
  { termo: "inútil", sugestao: "necessita de reorientação metodológica" },
  { termo: "incapaz", sugestao: "demanda adaptação curricular / apoio individualizado" },
  { termo: "sem futuro", sugestao: "necessita de plano de acompanhamento vocacional e pedagógico" },
  { termo: "caso perdido", sugestao: "demanda intervenção conjunta da equipe multiprofissional e família" },
  { termo: "retardado", sugestao: "linguagem inadequada (utilize descrição técnica e respeitosa conforme Art. 17 do ECA)" },
  { termo: "marginal", sugestao: "linguagem inadequada (descreva objetivamente o fato escolar observado)" }
];

function validarLinguagemEticaParecer(texto) {
  if (!texto) return { valido: true };
  const textoLower = texto.toLowerCase();
  for (const item of TERMOS_ESTIGMATIZANTES_VEDADOS) {
    const regex = new RegExp(`\\b${item.termo}\\b`, 'i');
    if (regex.test(textoLower)) {
      return {
        valido: false,
        termoEncontrado: item.termo,
        sugestao: item.sugestao,
        mensagem: `⚠️ Proteção ECA (Art. 17 e 18) & Lei 14.811/2024: O termo "${item.termo}" pode caracterizar rotulagem estigmatizante. Sugestão técnica: "${item.sugestao}".`
      };
    }
  }
  return { valido: true };
}

// Dados Fictícios Demonstração com todos os metadados da Lei 15.211/2025 (ECA Digital) e Art. 14 LGPD
const ALUNOS_DEMO_INICIAIS = [
  {
    id: "ALU-DEMO-01",
    matricula: "20261DS001",
    nome: "Lucas Gabriel M. [DEMO]",
    turma: "1º DS",
    idade: 15, // < 16 anos: Exige vinculação obrigatória ao responsável (Lei 15.211/2025)
    verificacaoEtariaSUAP: "Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)",
    responsavelLegal: "Maria Helena M. (Mãe - Vínculo SUAP Confirmado)",
    contatoResponsavel: "(79) 99900-0001",
    consentimentoImagemPais: true,
    alertaProtecaoEcaDigital: "nenhum", // 'nenhum' | 'bullying_cyberbullying' | 'vulnerabilidade_emocional'
    fotoUrl: gerarAvatarDemoSVG("LG", "#15803d"),
    statusConselho: "avaliar",
    napne: false,
    observacaoCoord: "Estudante demonstrativo (15 anos - menor de 16 anos com responsável legal vinculado conforme Lei 15.211/2025).",
    isDemo: true,
    criadoEm: "27-10-2026"
  },
  {
    id: "ALU-DEMO-02",
    matricula: "20261DS002",
    nome: "Mariana Costa S. [DEMO]",
    turma: "1º DS",
    idade: 14,
    verificacaoEtariaSUAP: "Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)",
    responsavelLegal: "Carlos Eduardo S. (Pai - Vínculo SUAP Confirmado)",
    contatoResponsavel: "(79) 99900-0002",
    consentimentoImagemPais: true,
    alertaProtecaoEcaDigital: "nenhum",
    fotoUrl: gerarAvatarDemoSVG("MC", "#0369a1"),
    statusConselho: "destaque",
    napne: false,
    observacaoCoord: "Excelente engajamento nas disciplinas técnicas.",
    isDemo: true,
    criadoEm: "27-10-2026"
  },
  {
    id: "ALU-DEMO-03",
    matricula: "20262DS001",
    nome: "Pedro Henrique A. [DEMO]",
    turma: "2º DS",
    idade: 16,
    verificacaoEtariaSUAP: "Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)",
    responsavelLegal: "Fernanda A. (Mãe - Vínculo SUAP Confirmado)",
    contatoResponsavel: "(79) 99900-0003",
    consentimentoImagemPais: true,
    alertaProtecaoEcaDigital: "nenhum",
    fotoUrl: gerarAvatarDemoSVG("PH", "#b45309"),
    statusConselho: "avaliar",
    napne: true,
    observacaoCoord: "Acompanhamento conjunto com equipe multiprofissional.",
    isDemo: true,
    criadoEm: "27-10-2026"
  },
  {
    id: "ALU-DEMO-04",
    matricula: "20261ADM001",
    nome: "Ana Beatriz R. [DEMO]",
    turma: "1º ADM",
    idade: 15,
    verificacaoEtariaSUAP: "Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)",
    responsavelLegal: "Roberto R. (Pai - Vínculo SUAP Confirmado)",
    contatoResponsavel: "(79) 99900-0004",
    consentimentoImagemPais: false, // Exemplo prático: sem consentimento de imagem, o sistema bloqueia foto real!
    alertaProtecaoEcaDigital: "bullying_cyberbullying",
    fotoUrl: gerarAvatarDemoSVG("AB", "#7e22ce", "SEM CONSENTIMENTO FOTO (ART. 14)"),
    statusConselho: "atencao",
    napne: false,
    observacaoCoord: "Oscilação de frequência nas primeiras aulas da manhã. Protocolo preventivo de convivência escolar ativo.",
    isDemo: true,
    criadoEm: "27-10-2026"
  },
  {
    id: "ALU-DEMO-05",
    matricula: "20263DS001",
    nome: "Rafael Oliveira T. [DEMO]",
    turma: "3º DS",
    idade: 17,
    verificacaoEtariaSUAP: "Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)",
    responsavelLegal: "Luciana T. (Mãe - Vínculo SUAP Confirmado)",
    contatoResponsavel: "(79) 99900-0005",
    consentimentoImagemPais: true,
    alertaProtecaoEcaDigital: "nenhum",
    fotoUrl: gerarAvatarDemoSVG("RO", "#be123c"),
    statusConselho: "avaliar",
    napne: false,
    observacaoCoord: "Prioridade de análise para conclusão de etapa e Projeto Integrador.",
    isDemo: true,
    criadoEm: "27-10-2026"
  },
  {
    id: "ALU-DEMO-06",
    matricula: "20262ADM001",
    nome: "Camila Vitória F. [DEMO]",
    turma: "2º ADM",
    idade: 16,
    verificacaoEtariaSUAP: "Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)",
    responsavelLegal: "Patrícia F. (Mãe - Vínculo SUAP Confirmado)",
    contatoResponsavel: "(79) 99900-0006",
    consentimentoImagemPais: true,
    alertaProtecaoEcaDigital: "nenhum",
    fotoUrl: gerarAvatarDemoSVG("CV", "#0f766e"),
    statusConselho: "regular",
    napne: false,
    observacaoCoord: "",
    isDemo: true,
    criadoEm: "27-10-2026"
  }
];

const PARECERES_DEMO_INICIAIS = [
  {
    id: "PAR-DEMO-01",
    alunoId: "ALU-DEMO-01",
    turma: "1º DS",
    professor: "Eber",
    disciplina: "CS1",
    rendimento: "atencao",
    frequencia: "regular",
    postura: "disperso",
    notaAtual: "5,5",
    faltas: "4",
    tags: ["Dificuldade de Base", "Não Entrega Atividades"],
    avaliarEmPlenaria: true,
    observacao: "Compreende os conceitos em laboratório quando acompanhado individualmente, mas deixou de entregar duas listas práticas.",
    dataHora: "27-10-2026 09:15"
  },
  {
    id: "PAR-DEMO-02",
    alunoId: "ALU-DEMO-01",
    turma: "1º DS",
    professor: "Ângelo",
    disciplina: "Programação 1",
    rendimento: "critico",
    frequencia: "pontual",
    postura: "celular",
    notaAtual: "4,2",
    faltas: "8",
    tags: ["Dificuldade de Base", "Recuperação Paralela Recomendada"],
    avaliarEmPlenaria: true,
    observacao: "Apresenta dificuldade em lógica de repetição. Recomendado encaminhamento para monitoria no contraturno.",
    dataHora: "27-10-2026 10:05"
  },
  {
    id: "PAR-DEMO-03",
    alunoId: "ALU-DEMO-03",
    turma: "2º DS",
    professor: "Eber",
    disciplina: "Banco de Dados e Eng. Software (BD e ES)",
    rendimento: "atencao",
    frequencia: "infrequente",
    postura: "participativo",
    notaAtual: "5,8",
    faltas: "12",
    tags: ["Faltas Recorrentes", "Evoluiu no Bimestre"],
    avaliarEmPlenaria: true,
    observacao: "Quando presente, participa bem da modelagem de dados. Precisamos alinhar com a família o motivo das ausências nas sextas-feiras.",
    dataHora: "27-10-2026 10:40"
  },
  {
    id: "PAR-DEMO-04",
    alunoId: "ALU-DEMO-02",
    turma: "1º DS",
    professor: "Fernanda",
    disciplina: "Inglês",
    rendimento: "adequado",
    frequencia: "regular",
    postura: "participativo",
    notaAtual: "9,5",
    faltas: "0",
    tags: ["Destaque / Monitoria", "Participação Positiva"],
    avaliarEmPlenaria: false,
    observacao: "Excelente desempenho acadêmico e colabora com os colegas em sala.",
    dataHora: "27-10-2026 11:00"
  }
];

const ENCAMINHAMENTOS_DEMO_INICIAIS = [
  {
    id: "ENC-DEMO-01",
    alunoId: "ALU-DEMO-01",
    turma: "1º DS",
    acoes: [
      "📞 Convocar Responsáveis Legais (Pais/Mães - ECA & Lei 15.211/2025)",
      "📚 Plano de Estudos / Monitoria no Contraturno",
      "🧭 Atendimento pela Coordenação de Curso (DS/ADM)"
    ],
    protocoloProtecaoIntegral: "Acompanhamento Pedagógico Ordinário (Com Ciência Familiar - Menor de 16 anos)",
    responsavel: "Coordenação DS / ETP",
    prazo: "10-11-2026",
    deliberacaoAta: "Deliberado pelo Conselho a convocação da responsável legal (Maria Helena M.) para ciência do plano de recuperação paralela em CS1 e Programação 1, nos termos do Art. 14 da LGPD e Lei nº 15.211/2025.",
    statusEncaminhamento: "Em Andamento",
    registradoPor: "Eber",
    dataHora: "27-10-2026 11:30"
  }
];

// ============================================================================
// GERENCIAMENTO DE BANCO LOCAL + SINCRONIZAÇÃO SEGURA APPS SCRIPT
// ============================================================================

function inicializarBancoConselho() {
  const ver = localStorage.getItem(STORAGE_KEYS.DB_VERSION);
  if (ver !== CURRENT_CONSELHO_VERSION) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(ALUNOS_DEMO_INICIAIS));
    if (!localStorage.getItem(STORAGE_KEYS.EVALUATIONS)) {
      localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(PARECERES_DEMO_INICIAIS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REFERRALS)) {
      localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(ENCAMINHAMENTOS_DEMO_INICIAIS));
    }
    localStorage.setItem(STORAGE_KEYS.DB_VERSION, CURRENT_CONSELHO_VERSION);
  }

  if (!localStorage.getItem(STORAGE_KEYS.PINS)) {
    const pinsIniciais = {};
    Object.keys(DOCENTES_IFS).forEach(nome => {
      pinsIniciais[nome] = DEFAULT_PIN;
    });
    localStorage.setItem(STORAGE_KEYS.PINS, JSON.stringify(pinsIniciais));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify({
      bimestreAtual: "2026.2 • 1º Conselho Bimestral",
      emailCoordDS: "coordenacao.ds.tb@ifs.edu.br",
      emailCoordADM: "coordenacao.adm.tb@ifs.edu.br",
      emailCoordGeral: "coordenacao.tobiasbarreto@ifs.edu.br",
      notificarEncaminhamento: true
    }));
  }
}

function obterApiUrl() {
  return (localStorage.getItem(STORAGE_KEYS.API_URL) || '').trim();
}

function salvarApiUrl(url) {
  localStorage.setItem(STORAGE_KEYS.API_URL, (url || '').trim());
}

function obterConfigConselho() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG)) || {};
  } catch (e) {
    return {};
  }
}

function salvarConfigConselho(cfg) {
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(cfg));
}

function obterAlunosLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS)) || [];
  } catch (e) {
    return [];
  }
}

function salvarAlunosLocal(lista) {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(lista));
}

function obterPareceresLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.EVALUATIONS)) || [];
  } catch (e) {
    return [];
  }
}

function salvarPareceresLocal(lista) {
  localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(lista));
}

function obterEncaminhamentosLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REFERRALS)) || [];
  } catch (e) {
    return [];
  }
}

function salvarEncaminhamentosLocal(lista) {
  localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(lista));
}

// ============================================================================
// AUDITORIA LGPD, MARCO CIVIL (ART. 7º), ECA DIGITAL (LEI 15.211/2025)
// ============================================================================

function registrarLogAuditoriaLGPD(usuario, acao, detalhes) {
  try {
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || '[]');
    const novoLog = {
      id: 'LOG-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      dataHora: new Date().toLocaleString('pt-BR'),
      usuario: usuario || 'Não autenticado',
      acao: acao,
      detalhes: detalhes,
      baseLegal: 'CF Art. 227 • ECA Digital (Lei 15.211/2025) • LGPD Art. 14 • Lei 14.811/2024'
    };
    logs.unshift(novoLog);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 300)));

    const apiUrl = obterApiUrl();
    if (apiUrl) {
      enviarRequisicaoSeguraBackend('LOG_AUDITORIA_LGPD', { log: novoLog }).catch(() => {});
    }
    return novoLog;
  } catch (e) {
    console.warn('Falha ao gravar log de auditoria:', e);
  }
}

function obterLogsAuditoriaLGPD() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || '[]');
  } catch (e) {
    return [];
  }
}

function registrarAceiteTermoLGPD(professor, versaoTermo) {
  const aceites = JSON.parse(localStorage.getItem(STORAGE_KEYS.LGPD_CONSENTS) || '{}');
  aceites[professor] = {
    professor,
    versaoTermo: versaoTermo || 'v2.0-2026-LEI15211-LGPD-ECA',
    dataHora: new Date().toLocaleString('pt-BR'),
    userAgent: navigator.userAgent.slice(0, 120)
  };
  localStorage.setItem(STORAGE_KEYS.LGPD_CONSENTS, JSON.stringify(aceites));
  registrarLogAuditoriaLGPD(professor, 'ACEITE_TERMO_SIGILO', `Assinou digitalmente o Termo de Sigilo Funcional (CF Art. 227, Lei 15.211/2025, LGPD Art. 14, Marco Civil e Lei 14.811/2024)`);
}

// ============================================================================
// COMPRESSÃO INTELIGENTE DE FOTO DO ALUNO (CLIENT-SIDE CANVAS WEBP/JPEG)
// ============================================================================
function comprimirFotoAluno(file, tamanhoMax = 220, qualidade = 0.78) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('Nenhum arquivo selecionado.'));
    const reader = new FileReader();
    reader.onload = function (ev) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = tamanhoMax;
        canvas.height = tamanhoMax;
        const ctx = canvas.getContext('2d');

        const menorLado = Math.min(img.width, img.height);
        const sx = (img.width - menorLado) / 2;
        const sy = (img.height - menorLado) / 2;

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, tamanhoMax, tamanhoMax);
        ctx.drawImage(img, sx, sy, menorLado, menorLado, 0, 0, tamanhoMax, tamanhoMax);

        let dataUrl = canvas.toDataURL('image/webp', qualidade);
        if (!dataUrl || dataUrl.length > 45000) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.72);
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Não foi possível processar a imagem.'));
      img.src = ev.target.result;
    };
    reader.onerror = () => reject(new Error('Erro na leitura do arquivo.'));
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// COMUNICAÇÃO SEGURA COM GOOGLE APPS SCRIPT (POST AUTENTICADO)
// ============================================================================

async function enviarRequisicaoSeguraBackend(action, payload = {}) {
  const apiUrl = obterApiUrl();
  if (!apiUrl) {
    return { ok: false, offline: true, message: 'URL do Google Apps Script não configurada (Modo Local/Demo ativo).' };
  }

  let sessao = null;
  try {
    sessao = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.SESSION) || 'null');
  } catch (e) {}

  const bodyObj = {
    action,
    authTeacher: sessao ? sessao.professor : (payload.professor || ''),
    authPin: sessao ? sessao.pin : (payload.pin || ''),
    timestamp: new Date().toISOString(),
    ...payload
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(bodyObj)
  });

  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}`);
  }

  const data = await response.json();
  return data;
}

async function sincronizarComNuvemPrivada() {
  const apiUrl = obterApiUrl();
  if (!apiUrl) {
    return { ok: true, mode: 'demo', message: 'Modo Demonstração / Local ativo.' };
  }

  try {
    const res = await enviarRequisicaoSeguraBackend('SYNC_GET_ALL');
    if (res && res.ok) {
      if (Array.isArray(res.alunos)) salvarAlunosLocal(res.alunos);
      if (Array.isArray(res.pareceres)) salvarPareceresLocal(res.pareceres);
      if (Array.isArray(res.encaminhamentos)) salvarEncaminhamentosLocal(res.encaminhamentos);
      if (res.pins && typeof res.pins === 'object') {
        localStorage.setItem(STORAGE_KEYS.PINS, JSON.stringify(res.pins));
      }
      return { ok: true, mode: 'cloud', data: res };
    }
    return { ok: false, mode: 'error', message: (res && res.error) || 'Resposta inválida do servidor.' };
  } catch (err) {
    console.warn('Modo offline/cache utilizado:', err);
    return { ok: false, mode: 'offline', message: err.message };
  }
}
