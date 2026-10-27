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
 * 2. LGPD (Lei nº 13.709/2018 - Art. 14 e 18): Tratamento no melhor interesse do
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

const CURRENT_CONSELHO_VERSION = 'v3_apresentacao_diversa_2026';
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

// Gera avatar de bloqueio (quando o consentimento parental Art. 14 LGPD está desativado) ou genérico
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
    <rect x="12" y="156" width="176" height="24" rx="12" fill="rgba(0,0,0,0.58)"/>
    <text x="100" y="172" text-anchor="middle" fill="#e2e8f0" font-family="Inter, sans-serif" font-weight="700" font-size="8.5">${legenda}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Gera retratos ilustrados variados de estudantes (100% sintéticos/ilustrativos para apresentação visual rica!)
function gerarRetratoIlustradoEstudanteSVG(config) {
  const {
    fundo = '#15803d',
    pele = '#e0ac69',
    cabeloCor = '#1e293b',
    estiloCabelo = 'curto', // 'curto' | 'longo' | 'cacheado' | 'coque'
    oculos = false,
    camisa = '#166534',
    iniciais = 'AL'
  } = config;

  let cabeloTraseiro = '';
  let cabeloTopo = '';
  if (estiloCabelo === 'longo') {
    cabeloTraseiro = `<path d="M52 75 C45 115 48 155 62 168 L138 168 C152 155 155 115 148 75 Z" fill="${cabeloCor}"/>`;
    cabeloTopo = `<path d="M54 78 C54 42 146 42 146 78 C132 62 110 58 100 60 C82 58 66 64 54 78 Z" fill="${cabeloCor}"/>`;
  } else if (estiloCabelo === 'cacheado') {
    cabeloTraseiro = `<circle cx="62" cy="76" r="22" fill="${cabeloCor}"/><circle cx="138" cy="76" r="22" fill="${cabeloCor}"/><circle cx="100" cy="52" r="26" fill="${cabeloCor}"/><circle cx="76" cy="56" r="22" fill="${cabeloCor}"/><circle cx="124" cy="56" r="22" fill="${cabeloCor}"/>`;
    cabeloTopo = `<path d="M62 72 Q100 54 138 72" stroke="${cabeloCor}" stroke-width="14" fill="none" stroke-linecap="round"/>`;
  } else if (estiloCabelo === 'coque') {
    cabeloTraseiro = `<circle cx="100" cy="36" r="18" fill="${cabeloCor}"/>`;
    cabeloTopo = `<path d="M58 80 C58 46 142 46 142 80 C128 64 72 64 58 80 Z" fill="${cabeloCor}"/>`;
  } else {
    cabeloTopo = `<path d="M58 78 C56 44 144 44 142 78 C130 62 70 62 58 78 Z" fill="${cabeloCor}"/>`;
  }

  const oculosSvg = oculos
    ? `<g stroke="#0f172a" stroke-width="3" fill="rgba(255,255,255,0.2)">
         <rect x="70" y="82" width="24" height="16" rx="4"/>
         <rect x="106" y="82" width="24" height="16" rx="4"/>
         <line x1="94" y1="89" x2="106" y2="89"/>
       </g>`
    : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${fundo}"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <rect width="200" height="200" rx="28" fill="url(#bg)"/>
    ${cabeloTraseiro}
    <!-- Ombros / Uniforme IFS -->
    <path d="M34 195 C38 144 162 144 166 195 Z" fill="${camisa}"/>
    <path d="M82 148 L100 172 L118 148" fill="#ffffff" opacity="0.88"/>
    <!-- Pescoço e Rosto -->
    <rect x="88" y="120" width="24" height="26" rx="8" fill="${pele}"/>
    <ellipse cx="100" cy="92" rx="38" ry="42" fill="${pele}"/>
    <!-- Olhos e Sorriso -->
    <circle cx="83" cy="90" r="3.8" fill="#0f172a"/>
    <circle cx="117" cy="90" r="3.8" fill="#0f172a"/>
    <path d="M88 110 Q100 119 112 110" stroke="#7c2d12" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${oculosSvg}
    ${cabeloTopo}
    <!-- Badge DEMO Fictício -->
    <rect x="14" y="12" width="54" height="20" rx="10" fill="rgba(15,23,42,0.72)"/>
    <text x="41" y="25" text-anchor="middle" fill="#4ade80" font-family="Inter, sans-serif" font-weight="800" font-size="9.5">DEMO • ${iniciais}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Validador Ético de Linguagem Pedagógica (Lei 13.185/2015, Lei 14.811/2024 e ECA Art. 17/18)
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

// ============================================================================
// 15 ALUNOS DEMO DAS MAIS DIVERSAS SITUAÇÕES PEDAGÓGICAS E LEGAIS (APRESENTAÇÃO)
// ============================================================================
const ALUNOS_DEMO_INICIAIS = [
  // --- 1º DS ---
  {
    id: "ALU-DEMO-01",
    matricula: "20261DS001",
    nome: "Lucas Gabriel M. [DEMO]",
    turma: "1º DS",
    idade: 15,
    verificacaoEtariaSUAP: "Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)",
    responsavelLegal: "Maria Helena M. (Mãe - Vínculo SUAP Confirmado)",
    contatoResponsavel: "(79) 99911-1001",
    consentimentoImagemPais: true,
    alertaProtecaoEcaDigital: "nenhum",
    fotoUrl: gerarRetratoIlustradoEstudanteSVG({ fundo: '#dc2626', pele: '#e0ac69', cabeloCor: '#1e293b', estiloCabelo: 'curto', oculos: true, camisa: '#14532d', iniciais: 'LG' }),
    statusConselho: "avaliar",
    napne: false,
    observacaoCoord: "🚨 Crítico em 2 disciplinas técnicas (CS1 e Programação 1) + Uso excessivo de celular em laboratório.",
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
    contatoResponsavel: "(79) 99911-1002",
    consentimentoImagemPais: true,
    alertaProtecaoEcaDigital: "nenhum",
    fotoUrl: gerarRetratoIlustradoEstudanteSVG({ fundo: '#0284c7', pele: '#f1c27d', cabeloCor: '#451a03', estiloCabelo: 'longo', oculos: false, camisa: '#15803d', iniciais: 'MC' }),
    statusConselho: "destaque",
    napne: false,
    observacaoCoord: "🏆 Destaque Acadêmico Positivo! Médias acima de 9,5 e perfil colaborativo para monitoria.",
    isDemo: true,
    criadoEm: "27-10-2026"
  },
  {
    id: "ALU-DEMO-03",
    matricula: "20261DS003",
    nome: "Cauã Victor N. [DEMO]",
    turma: "1º DS",
    idade: 15,
    verificacaoEtariaSUAP: "Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)",
    responsavelLegal: "Renata N. (Mãe - Vínculo SUAP Confirmado)",
    contatoResponsavel: "(79) 99911-1003",
    consentimentoImagemPais: true,
    alertaProtecaoEcaDigital: "bullying_cyberbullying",
    fotoUrl: gerarRetratoIlustradoEstudanteSVG({ fundo: '#9333ea', pele: '#8d5524', cabeloCor: '#09090b', estiloCabelo: 'cacheado', oculos: false, camisa: '#1e293b', iniciais: 'CV' }),
    statusConselho: "avaliar",
    napne: false,
    observacaoCoord: "🛡️ Alerta Lei 14.811/2024 (Cyberbullying/Isolamento): Relato de exclusão em grupo de mensagens da turma e queda abrupta de participação.",
    isDemo: true,
    criadoEm: "27-10-2026"
  },

  // --- 2º DS ---
  {
    id: "ALU-DEMO-04",
    matricula: "20262DS001",
    nome: "Pedro Henrique A. [DEMO]",
    turma: "2º DS",
    idade: 16,
    verificacaoEtariaSUAP: "Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)",
    responsavelLegal: "Fernanda A. (Mãe - Vínculo SUAP Confirmado)",
    contatoResponsavel: "(79) 99911-1004",
    consentimentoImagemPais: true,
    alertaProtecaoEcaDigital: "nenhum",
    fotoUrl: gerarRetratoIlustradoEstudanteSVG({ fundo: '#d97706', pele: '#c68642', cabeloCor: '#1c1917', estiloCabelo: 'curto', oculos: false, camisa: '#14532d', iniciais: 'PH' }),
    statusConselho: "avaliar",
    napne: true,
    observacaoCoord: "♿ Acompanhamento NAPNE (TDAH) + Infrequência nas sextas-feiras por dificuldade no transporte escolar rural.",
    isDemo: true,
    criadoEm: "27-10-2026"
  },
  {
    id: "ALU-DEMO-05",
    matricula: "20262DS002",
    nome: "Yasmin Oliveira B. [DEMO]",
    turma: "2º DS",
    idade: 16,
    verificacaoEtariaSUAP: "Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)",
    responsavelLegal: "Marcos B. (Pai - Vínculo SUAP Confirmado)",
    contatoResponsavel: "(79) 99911-1005",
    consentimentoImagemPais: true,
    alertaProtecaoEcaDigital: "nenhum",
    fotoUrl: gerarRetratoIlustradoEstudanteSVG({ fundo: '#ca8a04', pele: '#f1c27d', cabeloCor: '#27272a', estiloCabelo: 'coque', oculos: true, camisa: '#15803d', iniciais: 'YO' }),
    statusConselho: "atencao",
    napne: false,
    observacaoCoord: "⚠️ Em Atenção Pedagógica: Assídua e dedicada, porém com dificuldade de base em Programação 2 e CS2.",
    isDemo: true,
    criadoEm: "27-10-2026"
  },

  // --- 3º DS ---
  {
    id: "ALU-DEMO-06",
    matricula: "20263DS001",
    nome: "Rafael Oliveira T. [DEMO]",
    turma: "3º DS",
    idade: 17,
    verificacaoEtariaSUAP: "Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)",
    responsavelLegal: "Luciana T. (Mãe - Vínculo SUAP Confirmado)",
    contatoResponsavel: "(79) 99911-1006",
    consentimentoImagemPais: true,
    alertaProtecaoEcaDigital: "nenhum",
    fotoUrl: gerarRetratoIlustradoEstudanteSVG({ fundo: '#be123c', pele: '#e0ac69', cabeloCor: '#292524', estiloCabelo: 'curto', oculos: false, camisa: '#0f172a', iniciais: 'RO' }),
    statusConselho: "avaliar",
    napne: false,
    observacaoCoord: "🚨 Risco de Retenção no Ano Concluinte: Atraso nas entregas do Projeto Integrador 2 e Redes por conciliar trabalho informal.",
    isDemo: true,
    criadoEm: "27-10-2026"
  },
  {
    id: "ALU-DEMO-07",
    matricula: "20263DS002",
    nome: "Letícia Albuquerque V. [DEMO]",
    turma: "3º DS",
    idade: 17,
    verificacaoEtariaSUAP: "Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)",
    responsavelLegal: "Sônia V. (Mãe - Vínculo SUAP Confirmado)",
    contatoResponsavel: "(79) 99911-1007",
    consentimentoImagemPais: true,
    alertaProtecaoEcaDigital: "nenhum",
    fotoUrl: gerarRetratoIlustradoEstudanteSVG({ fundo: '#15803d', pele: '#ffdbac', cabeloCor: '#78350f', estiloCabelo: 'longo', oculos: true, camisa: '#166534', iniciais: 'LA' }),
    statusConselho: "concluido",
    napne: false,
    observacaoCoord: "✔️ Caso Deliberado e Concluído: Família compareceu ao atendimento e aluna recuperou nota em Tópicos Especiais.",
    isDemo: true,
    criadoEm: "27-10-2026"
  },

  // --- 1º ADM ---
  {
    id: "ALU-DEMO-08",
    matricula: "20261ADM001",
    nome: "Ana Beatriz R. [DEMO]",
    turma: "1º ADM",
    idade: 15,
    verificacaoEtariaSUAP: "Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)",
    responsavelLegal: "Roberto R. (Pai - Vínculo SUAP Confirmado)",
    contatoResponsavel: "(79) 99911-1008",
    consentimentoImagemPais: false, // Demonstração da Trava de Foto do Art. 14/18 LGPD!
    alertaProtecaoEcaDigital: "nenhum",
    fotoUrl: gerarRetratoIlustradoEstudanteSVG({ fundo: '#7e22ce', pele: '#e0ac69', cabeloCor: '#1e293b', estiloCabelo: 'longo', oculos: false, camisa: '#14532d', iniciais: 'AB' }),
    statusConselho: "atencao",
    napne: false,
    observacaoCoord: "🔒 Demonstração LGPD Art. 14/18: Responsável revogou uso de foto (sistema bloqueia foto e exibe avatar anonimizado). Oscilação em Matemática e Física.",
    isDemo: true,
    criadoEm: "27-10-2026"
  },
  {
    id: "ALU-DEMO-09",
    matricula: "20261ADM002",
    nome: "Guilherme Santos D. [DEMO]",
    turma: "1º ADM",
    idade: 14,
    verificacaoEtariaSUAP: "Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)",
    responsavelLegal: "Cláudia D. (Mãe - Vínculo SUAP Confirmado)",
    contatoResponsavel: "(79) 99911-1009",
    consentimentoImagemPais: true,
    alertaProtecaoEcaDigital: "nenhum",
    fotoUrl: gerarRetratoIlustradoEstudanteSVG({ fundo: '#b91c1c', pele: '#c68642', cabeloCor: '#09090b', estiloCabelo: 'curto', oculos: false, camisa: '#15803d', iniciais: 'GS' }),
    statusConselho: "avaliar",
    napne: false,
    observacaoCoord: "🔒 Menor de 16 anos (14 anos - Lei 15.211/2025): Dificuldade de adaptação ao ritmo do Ensino Médio Integrado (3 disciplinas em alerta).",
    isDemo: true,
    criadoEm: "27-10-2026"
  },

  // --- 2º ADM ---
  {
    id: "ALU-DEMO-10",
    matricula: "20262ADM001",
    nome: "Camila Vitória F. [DEMO]",
    turma: "2º ADM",
    idade: 16,
    verificacaoEtariaSUAP: "Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)",
    responsavelLegal: "Patrícia F. (Mãe - Vínculo SUAP Confirmado)",
    contatoResponsavel: "(79) 99911-1010",
    consentimentoImagemPais: true,
    alertaProtecaoEcaDigital: "nenhum",
    fotoUrl: gerarRetratoIlustradoEstudanteSVG({ fundo: '#0f766e', pele: '#8d5524', cabeloCor: '#18181b', estiloCabelo: 'cacheado', oculos: false, camisa: '#14532d', iniciais: 'CF' }),
    statusConselho: "regular",
    napne: false,
    observacaoCoord: "✅ Situação Regular: Frequência exemplar e bom aproveitamento nas disciplinas técnicas de Administração.",
    isDemo: true,
    criadoEm: "27-10-2026"
  },
  {
    id: "ALU-DEMO-11",
    matricula: "20262ADM002",
    nome: "João Vitor L. [DEMO]",
    turma: "2º ADM",
    idade: 16,
    verificacaoEtariaSUAP: "Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)",
    responsavelLegal: "Antônio L. (Pai - Vínculo SUAP Confirmado)",
    contatoResponsavel: "(79) 99911-1011",
    consentimentoImagemPais: true,
    alertaProtecaoEcaDigital: "nenhum",
    fotoUrl: gerarRetratoIlustradoEstudanteSVG({ fundo: '#ea580c', pele: '#f1c27d', cabeloCor: '#451a03', estiloCabelo: 'curto', oculos: true, camisa: '#1e293b', iniciais: 'JV' }),
    statusConselho: "avaliar",
    napne: false,
    observacaoCoord: "⚠️ Postura Pedagógica: Conversas paralelas recorrentes e dispersão em Química, História e Geografia.",
    isDemo: true,
    criadoEm: "27-10-2026"
  },

  // --- 3º ADM ---
  {
    id: "ALU-DEMO-12",
    matricula: "20263ADM001",
    nome: "Beatriz Mendonça P. [DEMO]",
    turma: "3º ADM",
    idade: 17,
    verificacaoEtariaSUAP: "Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)",
    responsavelLegal: "Helena P. (Mãe - Vínculo SUAP Confirmado)",
    contatoResponsavel: "(79) 99911-1012",
    consentimentoImagemPais: true,
    alertaProtecaoEcaDigital: "nenhum",
    fotoUrl: gerarRetratoIlustradoEstudanteSVG({ fundo: '#0369a1', pele: '#e0ac69', cabeloCor: '#1c1917', estiloCabelo: 'coque', oculos: false, camisa: '#15803d', iniciais: 'BM' }),
    statusConselho: "destaque",
    napne: false,
    observacaoCoord: "🏆 Líder de Turma e Destaque em Gestão Ambiental e Financeira.",
    isDemo: true,
    criadoEm: "27-10-2026"
  },
  {
    id: "ALU-DEMO-13",
    matricula: "20263ADM002",
    nome: "Gabriel Rocha K. [DEMO]",
    turma: "3º ADM",
    idade: 17,
    verificacaoEtariaSUAP: "Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)",
    responsavelLegal: "Sandra K. (Mãe - Vínculo SUAP Confirmado)",
    contatoResponsavel: "(79) 99911-1013",
    consentimentoImagemPais: true,
    alertaProtecaoEcaDigital: "vulnerabilidade_emocional",
    fotoUrl: gerarRetratoIlustradoEstudanteSVG({ fundo: '#6d28d9', pele: '#ffdbac', cabeloCor: '#292524', estiloCabelo: 'curto', oculos: true, camisa: '#14532d', iniciais: 'GR' }),
    statusConselho: "avaliar",
    napne: false,
    observacaoCoord: "🧠 Saúde Mental / Ansiedade Pré-ENEM (Lei 15.211/2025): Apresentou sobrecarga emocional nas avaliações bimestrais. Encaminhado à Psicologia.",
    isDemo: true,
    criadoEm: "27-10-2026"
  },

  // --- SUBSEQUENTE (MAIORES DE 18 ANOS) ---
  {
    id: "ALU-DEMO-14",
    matricula: "20261INF001",
    nome: "Carlos Eduardo M. [DEMO]",
    turma: "1º Info (Subsequente)",
    idade: 21,
    verificacaoEtariaSUAP: "Maior de 18 anos (Subsequente Noturno - Matrícula SUAP)",
    responsavelLegal: "Maior de idade (Trabalhador-Estudante)",
    contatoResponsavel: "(79) 99911-1014",
    consentimentoImagemPais: true,
    alertaProtecaoEcaDigital: "nenhum",
    fotoUrl: gerarRetratoIlustradoEstudanteSVG({ fundo: '#334155', pele: '#c68642', cabeloCor: '#09090b', estiloCabelo: 'curto', oculos: false, camisa: '#0f172a', iniciais: 'CE' }),
    statusConselho: "atencao",
    napne: false,
    observacaoCoord: "⚠️ Subsequente Noturno: Atrasos no 1º horário (18:40) devido à saída do trabalho no comércio local.",
    isDemo: true,
    criadoEm: "27-10-2026"
  },
  {
    id: "ALU-DEMO-15",
    matricula: "20263INF001",
    nome: "Juliana Martins G. [DEMO]",
    turma: "3º Info (Subsequente)",
    idade: 23,
    verificacaoEtariaSUAP: "Maior de 18 anos (Subsequente Noturno - Matrícula SUAP)",
    responsavelLegal: "Maior de idade",
    contatoResponsavel: "(79) 99911-1015",
    consentimentoImagemPais: true,
    alertaProtecaoEcaDigital: "nenhum",
    fotoUrl: gerarRetratoIlustradoEstudanteSVG({ fundo: '#0284c7', pele: '#e0ac69', cabeloCor: '#451a03', estiloCabelo: 'longo', oculos: true, camisa: '#15803d', iniciais: 'JM' }),
    statusConselho: "destaque",
    napne: false,
    observacaoCoord: "🏆 Destaque Técnico Subsequente: Desenvolveu sistema completo nas aulas de Engenharia de Software e Programação 3.",
    isDemo: true,
    criadoEm: "27-10-2026"
  }
];

const PARECERES_DEMO_INICIAIS = [
  // Lucas Gabriel (1º DS) - 3 alertas docentes
  {
    id: "PAR-DEMO-01",
    alunoId: "ALU-DEMO-01",
    turma: "1º DS",
    professor: "Eber",
    disciplina: "CS1",
    rendimento: "atencao",
    frequencia: "regular",
    postura: "celular",
    notaAtual: "5,2",
    faltas: "2",
    tags: ["Dificuldade de Base", "Não Entrega Atividades", "Uso Indevido de Celular / Telas"],
    avaliarEmPlenaria: true,
    observacao: "Compreende os conceitos quando acompanhado individualmente no laboratório, porém distrai-se com jogos no celular e deixou de entregar duas atividades práticas.",
    dataHora: "27-10-2026 08:30"
  },
  {
    id: "PAR-DEMO-02",
    alunoId: "ALU-DEMO-01",
    turma: "1º DS",
    professor: "Ângelo",
    disciplina: "Programação 1",
    rendimento: "critico",
    frequencia: "pontual",
    postura: "disperso",
    notaAtual: "4,0",
    faltas: "6",
    tags: ["Dificuldade de Base", "Recuperação Paralela Recomendada"],
    avaliarEmPlenaria: true,
    observacao: "Apresenta dificuldade acentuada em estruturas de repetição e vetores. Recomendado encaminhamento para monitoria no contraturno e ciência da família.",
    dataHora: "27-10-2026 08:45"
  },
  {
    id: "PAR-DEMO-03",
    alunoId: "ALU-DEMO-01",
    turma: "1º DS",
    professor: "Pedro Ernesto",
    disciplina: "Química",
    rendimento: "atencao",
    frequencia: "regular",
    postura: "disperso",
    notaAtual: "5,8",
    faltas: "0",
    tags: ["Baixa Concentração / Dispersão"],
    avaliarEmPlenaria: false,
    observacao: "Demonstra potencial, porém a dispersão em sala tem impactado o rendimento nas avaliações escritas.",
    dataHora: "27-10-2026 09:00"
  },

  // Mariana Costa (1º DS) - Destaque
  {
    id: "PAR-DEMO-04",
    alunoId: "ALU-DEMO-02",
    turma: "1º DS",
    professor: "Fernanda",
    disciplina: "Inglês",
    rendimento: "adequado",
    frequencia: "regular",
    postura: "participativo",
    notaAtual: "9,8",
    faltas: "0",
    tags: ["Destaque / Monitoria", "Participação Positiva"],
    avaliarEmPlenaria: false,
    observacao: "Excelente desempenho acadêmico e auxilia espontaneamente os colegas com dificuldade de leitura técnica.",
    dataHora: "27-10-2026 09:10"
  },
  {
    id: "PAR-DEMO-05",
    alunoId: "ALU-DEMO-02",
    turma: "1º DS",
    professor: "Elliot",
    disciplina: "Introdução à Informática",
    rendimento: "adequado",
    frequencia: "regular",
    postura: "participativo",
    notaAtual: "9,6",
    faltas: "0",
    tags: ["Destaque / Monitoria"],
    avaliarEmPlenaria: false,
    observacao: "Domínio exemplar dos conteúdos práticos. Sugiro registro de Elogio Formal em Ata.",
    dataHora: "27-10-2026 09:15"
  },

  // Cauã Victor (1º DS) - Alerta Lei 14.811/2024 (Cyberbullying / Convivência)
  {
    id: "PAR-DEMO-06",
    alunoId: "ALU-DEMO-03",
    turma: "1º DS",
    professor: "Vinicius",
    disciplina: "Filosofia",
    rendimento: "atencao",
    frequencia: "pontual",
    postura: "conflito",
    notaAtual: "5,5",
    faltas: "6",
    tags: ["Alerta de Convivência / Bullying (Lei 14.811/24)", "Demanda Apoio Psicopedagógico"],
    avaliarEmPlenaria: true,
    observacao: "Estudante costumava ser muito participativo, mas isolou-se nas últimas três semanas após atrito em grupo virtual da turma. Solicito intervenção protetiva da ETP/Psicologia.",
    dataHora: "27-10-2026 09:25"
  },
  {
    id: "PAR-DEMO-07",
    alunoId: "ALU-DEMO-03",
    turma: "1º DS",
    professor: "Rafael",
    disciplina: "Introdução à Informática",
    rendimento: "critico",
    frequencia: "infrequente",
    postura: "disperso",
    notaAtual: "4,5",
    faltas: "10",
    tags: ["Faltas Recorrentes", "Demanda Apoio Psicopedagógico"],
    avaliarEmPlenaria: true,
    observacao: "Evitou apresentar o trabalho em grupo e faltou às duas últimas aulas práticas.",
    dataHora: "27-10-2026 09:40"
  },

  // Pedro Henrique (2º DS) - NAPNE + Faltas Transporte
  {
    id: "PAR-DEMO-08",
    alunoId: "ALU-DEMO-04",
    turma: "2º DS",
    professor: "Eber",
    disciplina: "Banco de Dados e Eng. Software (BD e ES)",
    rendimento: "atencao",
    frequencia: "infrequente",
    postura: "participativo",
    notaAtual: "6,2",
    faltas: "12",
    tags: ["Faltas Recorrentes", "Evoluiu no Bimestre"],
    avaliarEmPlenaria: true,
    observacao: "Com o material adaptado junto ao NAPNE, participa muito bem da modelagem SQL. O ponto crítico são as ausências nas sextas-feiras por falha no ônibus rural.",
    dataHora: "27-10-2026 10:00"
  },
  {
    id: "PAR-DEMO-09",
    alunoId: "ALU-DEMO-04",
    turma: "2º DS",
    professor: "Eric",
    disciplina: "Programação 2",
    rendimento: "atencao",
    frequencia: "infrequente",
    postura: "participativo",
    notaAtual: "5,8",
    faltas: "10",
    tags: ["Faltas Recorrentes", "Recuperação Paralela Recomendada"],
    avaliarEmPlenaria: true,
    observacao: "Bom raciocínio lógico em orientação a objetos, mas precisa repor as atividades perdidas nos dias de falta.",
    dataHora: "27-10-2026 10:12"
  },

  // Yasmin (2º DS) - Atenção
  {
    id: "PAR-DEMO-10",
    alunoId: "ALU-DEMO-05",
    turma: "2º DS",
    professor: "Rafael",
    disciplina: "CS2",
    rendimento: "atencao",
    frequencia: "regular",
    postura: "participativo",
    notaAtual: "5,4",
    faltas: "0",
    tags: ["Dificuldade de Base", "Recuperação Paralela Recomendada"],
    avaliarEmPlenaria: false,
    observacao: "Estudante extremamente educada e pontual; apresenta dúvida na configuração de serviços web, sendo indicada para monitoria.",
    dataHora: "27-10-2026 10:20"
  },

  // Rafael Oliveira (3º DS) - Concluinte Crítico
  {
    id: "PAR-DEMO-11",
    alunoId: "ALU-DEMO-06",
    turma: "3º DS",
    professor: "Elliot",
    disciplina: "Projeto Integrador 2",
    rendimento: "critico",
    frequencia: "pontual",
    postura: "disperso",
    notaAtual: "3,8",
    faltas: "8",
    tags: ["Não Entrega Atividades", "Recuperação Paralela Recomendada"],
    avaliarEmPlenaria: true,
    observacao: "Não entregou o protótipo funcional nem a documentação do TCC/Projeto Integrador. Risco real de retenção no 3º ano se não houver plano intensivo.",
    dataHora: "27-10-2026 10:35"
  },
  {
    id: "PAR-DEMO-12",
    alunoId: "ALU-DEMO-06",
    turma: "3º DS",
    professor: "Emerson",
    disciplina: "Redes de Computadores e SI",
    rendimento: "critico",
    frequencia: "pontual",
    postura: "disperso",
    notaAtual: "4,5",
    faltas: "6",
    tags: ["Não Entrega Atividades"],
    avaliarEmPlenaria: true,
    observacao: "Relata cansaço por trabalhar à noite, deixando de concluir os laboratórios práticos de redes.",
    dataHora: "27-10-2026 10:42"
  },

  // Letícia (3º DS) - Concluído
  {
    id: "PAR-DEMO-13",
    alunoId: "ALU-DEMO-07",
    turma: "3º DS",
    professor: "Christiano",
    disciplina: "Tópicos Especiais",
    rendimento: "adequado",
    frequencia: "regular",
    postura: "participativo",
    notaAtual: "7,5",
    faltas: "2",
    tags: ["Evoluiu no Bimestre", "Participação Positiva"],
    avaliarEmPlenaria: false,
    observacao: "Após reunião com a responsável e entrega do projeto de recuperação, superou a defasagem inicial com êxito.",
    dataHora: "27-10-2026 10:50"
  },

  // Ana Beatriz (1º ADM) - Sem consentimento de foto + Atenção Matemática/Física
  {
    id: "PAR-DEMO-14",
    alunoId: "ALU-DEMO-08",
    turma: "1º ADM",
    professor: "Alyrio",
    disciplina: "Matemática",
    rendimento: "atencao",
    frequencia: "pontual",
    postura: "participativo",
    notaAtual: "5,3",
    faltas: "4",
    tags: ["Dificuldade de Base", "Recuperação Paralela Recomendada"],
    avaliarEmPlenaria: false,
    observacao: "Apresenta dificuldade na transição da matemática fundamental para funções, mas participa das listas de revisão.",
    dataHora: "27-10-2026 11:00"
  },
  {
    id: "PAR-DEMO-15",
    alunoId: "ALU-DEMO-08",
    turma: "1º ADM",
    professor: "Vagner",
    disciplina: "Física",
    rendimento: "atencao",
    frequencia: "regular",
    postura: "participativo",
    notaAtual: "5,6",
    faltas: "2",
    tags: ["Dificuldade de Base"],
    avaliarEmPlenaria: false,
    observacao: "Dificuldade na interpretação algébrica dos problemas de cinemática.",
    dataHora: "27-10-2026 11:05"
  },

  // Guilherme (1º ADM - 14 anos) - Adaptação
  {
    id: "PAR-DEMO-16",
    alunoId: "ALU-DEMO-09",
    turma: "1º ADM",
    professor: "Pedro Goes",
    disciplina: "Administração Geral",
    rendimento: "critico",
    frequencia: "regular",
    postura: "disperso",
    notaAtual: "4,2",
    faltas: "2",
    tags: ["Dificuldade de Base", "Não Entrega Atividades"],
    avaliarEmPlenaria: true,
    observacao: "Ingressante de 14 anos ainda sem rotina de organização para dar conta das disciplinas técnicas e propedêuticas simultaneamente.",
    dataHora: "27-10-2026 11:12"
  },
  {
    id: "PAR-DEMO-17",
    alunoId: "ALU-DEMO-09",
    turma: "1º ADM",
    professor: "Alex",
    disciplina: "História",
    rendimento: "atencao",
    frequencia: "regular",
    postura: "disperso",
    notaAtual: "5,0",
    faltas: "0",
    tags: ["Baixa Concentração / Dispersão"],
    avaliarEmPlenaria: true,
    observacao: "Necessita de orientação da equipe pedagógica junto à mãe para estruturar horário de estudo diário.",
    dataHora: "27-10-2026 11:18"
  },

  // João Vitor (2º ADM) - Postura / Conversas
  {
    id: "PAR-DEMO-18",
    alunoId: "ALU-DEMO-11",
    turma: "2º ADM",
    professor: "Pedro Ernesto",
    disciplina: "Química",
    rendimento: "atencao",
    frequencia: "regular",
    postura: "disperso",
    notaAtual: "5,5",
    faltas: "2",
    tags: ["Baixa Concentração / Dispersão", "Uso Indevido de Celular / Telas"],
    avaliarEmPlenaria: true,
    observacao: "Tem facilidade de aprendizado, porém conversa excessivamente e utiliza fones/celular durante a explicação.",
    dataHora: "27-10-2026 11:25"
  },

  // Gabriel Rocha (3º ADM) - Saúde Mental / Ansiedade
  {
    id: "PAR-DEMO-19",
    alunoId: "ALU-DEMO-13",
    turma: "3º ADM",
    professor: "Alyrio",
    disciplina: "Matemática",
    rendimento: "atencao",
    frequencia: "pontual",
    postura: "participativo",
    notaAtual: "5,9",
    faltas: "4",
    tags: ["Demanda Apoio Psicopedagógico"],
    avaliarEmPlenaria: true,
    observacao: "Estudante dedicado que apresentou bloqueio por ansiedade durante a prova bimestral. Recomendado acolhimento pela Psicologia Escolar.",
    dataHora: "27-10-2026 11:32"
  },

  // Carlos Eduardo (1º Info Subsequente)
  {
    id: "PAR-DEMO-20",
    alunoId: "ALU-DEMO-14",
    turma: "1º Info (Subsequente)",
    professor: "Eber",
    disciplina: "Informática Básica",
    rendimento: "atencao",
    frequencia: "pontual",
    postura: "participativo",
    notaAtual: "6,0",
    faltas: "8",
    tags: ["Faltas Recorrentes", "Participação Positiva"],
    avaliarEmPlenaria: false,
    observacao: "Trabalha no comércio até as 18h30 e chega com 20 minutos de atraso, mas esforça-se bastante nos exercícios de laboratório.",
    dataHora: "27-10-2026 11:40"
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
    protocoloProtecaoIntegral: "Vinculação Obrigatória aos Pais (<16 anos - Lei 15.211/2025)",
    responsavel: "Coordenação DS (Prof. Eber) + ETP",
    prazo: "10-11-2026",
    deliberacaoAta: "Deliberado pelo Conselho a convocação da responsável legal (Maria Helena M.) para ciência do plano de recuperação paralela em CS1 e Programação 1 e pactuação sobre uso pedagógico de telas (Lei nº 15.211/2025).",
    statusEncaminhamento: "Em Andamento",
    registradoPor: "Eber",
    dataHora: "27-10-2026 11:45"
  },
  {
    id: "ENC-DEMO-02",
    alunoId: "ALU-DEMO-03",
    turma: "1º DS",
    acoes: [
      "🧠 Encaminhar à Psicologia / Assistência Estudantil (Sigilo Protegido)",
      "🤝 Mediação Preventiva Anti-Bullying / Cyberbullying (Lei 14.811/2024)",
      "📞 Convocar Responsáveis Legais (Pais/Mães - ECA & Lei 15.211/2025)"
    ],
    protocoloProtecaoIntegral: "Prevenção/Mediação de Bullying ou Cyberbullying (Lei 14.811/2024)",
    responsavel: "Psicologia Escolar + Coordenação Pedagógica",
    prazo: "03-11-2026",
    deliberacaoAta: "Acionado protocolo de escuta protegida e intervenção educativa de convivência digital na turma (Lei nº 14.811/2024 e Lei nº 15.211/2025), com atendimento familiar acolhedor.",
    statusEncaminhamento: "Em Andamento",
    registradoPor: "Coordenação Pedagógica / ETP",
    dataHora: "27-10-2026 11:50"
  },
  {
    id: "ENC-DEMO-03",
    alunoId: "ALU-DEMO-04",
    turma: "2º DS",
    acoes: [
      "♿ Encaminhar / Alinhar com o NAPNE",
      "📝 Compromisso Pedagógico de Entrega de Atividades",
      "📞 Convocar Responsáveis Legais (Pais/Mães - ECA & Lei 15.211/2025)"
    ],
    protocoloProtecaoIntegral: "Acompanhamento Pedagógico Ordinário",
    responsavel: "NAPNE + Assistência Estudantil",
    prazo: "08-11-2026",
    deliberacaoAta: "Definido regime de atividades domiciliares compensatórias para os dias de falha comprovada no transporte rural e continuidade do atendimento pelo NAPNE.",
    statusEncaminhamento: "Família Ciente / Atendido",
    registradoPor: "NAPNE / Assistência Estudantil",
    dataHora: "27-10-2026 11:55"
  },
  {
    id: "ENC-DEMO-04",
    alunoId: "ALU-DEMO-07",
    turma: "3º DS",
    acoes: [
      "📚 Plano de Estudos / Monitoria no Contraturno",
      "📝 Compromisso Pedagógico de Entrega de Atividades"
    ],
    protocoloProtecaoIntegral: "Acompanhamento Pedagógico Ordinário",
    responsavel: "Coordenação DS",
    prazo: "Concluído",
    deliberacaoAta: "Estudante cumpriu integralmente o plano de recuperação paralela com acompanhamento familiar, tendo sua situação regularizada no conselho.",
    statusEncaminhamento: "Família Ciente / Atendido",
    registradoPor: "Eber",
    dataHora: "27-10-2026 12:00"
  },
  {
    id: "ENC-DEMO-05",
    alunoId: "ALU-DEMO-02",
    turma: "1º DS",
    acoes: [
      "🏆 Registrar Elogio Formal em Ata (Destaque)"
    ],
    protocoloProtecaoIntegral: "Acompanhamento Pedagógico Ordinário",
    responsavel: "Coordenação DS",
    prazo: "Imediato",
    deliberacaoAta: "Aprovado por unanimidade pelo colegiado o registro de Elogio Formal em Ata pelo excelente desempenho acadêmico e espírito de cooperação.",
    statusEncaminhamento: "Família Ciente / Atendido",
    registradoPor: "Eber",
    dataHora: "27-10-2026 12:05"
  }
];

// ============================================================================
// GERENCIAMENTO DE BANCO LOCAL + RESTAURAÇÃO / EXCLUSÃO DE DEMOS
// ============================================================================

function inicializarBancoConselho() {
  const ver = localStorage.getItem(STORAGE_KEYS.DB_VERSION);
  if (ver !== CURRENT_CONSELHO_VERSION) {
    // preserva alunos reais cadastrados pelo usuário (isDemo === false), atualizando os demos para a versão rica de 15 alunos
    const atuais = obterAlunosLocal().filter(a => a && a.isDemo === false);
    salvarAlunosLocal([...atuais, ...ALUNOS_DEMO_INICIAIS]);

    const pareceresReais = obterPareceresLocal().filter(p => p && !String(p.id).startsWith('PAR-DEMO-'));
    salvarPareceresLocal([...pareceresReais, ...PARECERES_DEMO_INICIAIS]);

    const encReais = obterEncaminhamentosLocal().filter(e => e && !String(e.id).startsWith('ENC-DEMO-'));
    salvarEncaminhamentosLocal([...encReais, ...ENCAMINHAMENTOS_DEMO_INICIAIS]);

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
