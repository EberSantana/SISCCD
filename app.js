/**
 * ============================================================================
 * APP.JS - Lógica da Interface, Ficha do Aluno, Pareceres e Blindagem das 6 Leis
 * (ECA Digital Lei 15.211/2025, LGPD Art. 14, ECA, CF Art. 227, Marco Civil e Lei 14.811/2024)
 * IFS Campus Tobias Barreto
 * ============================================================================
 */

let estadoApp = {
  professorLogado: null,
  turmaSelecionada: 'TODAS',
  abaAtiva: 'turmas',
  alunoModalAtualId: null,
  listaNavegacaoModalIds: [],
  tagsSelecionadasParecer: [],
  acoesSelecionadasEncaminhamento: [],
  fotoTempCadastroBase64: '',
  modoPrivacidadeBlur: false
};

const TAGS_DIAGNOSTICO_PADRAO = [
  "Dificuldade de Base",
  "Não Entrega Atividades",
  "Baixa Concentração / Dispersão",
  "Faltas Recorrentes",
  "Uso Indevido de Celular / Telas",
  "Recuperação Paralela Recomendada",
  "Alerta de Convivência / Bullying (Lei 14.811/24)",
  "Demanda Apoio Psicopedagógico",
  "Evoluiu no Bimestre",
  "Participação Positiva",
  "Destaque / Monitoria"
];

const ACOES_ENCAMINHAMENTO_PADRAO = [
  "📞 Convocar Responsáveis Legais (Pais/Mães - ECA & Lei 15.211/2025)",
  "📚 Plano de Estudos / Monitoria no Contraturno",
  "🧭 Atendimento pela Coordenação de Curso (DS/ADM)",
  "🧠 Encaminhar à Psicologia / Assistência Estudantil (Sigilo Protegido)",
  "🤝 Mediação Preventiva Anti-Bullying / Cyberbullying (Lei 14.811/2024)",
  "♿ Encaminhar / Alinhar com o NAPNE",
  "📝 Compromisso Pedagógico de Entrega de Atividades",
  "🏆 Registrar Elogio Formal em Ata (Destaque)"
];

// ============================================================================
// INICIALIZAÇÃO DO SISTEMA
// ============================================================================

let deferredPwaPrompt = null;

document.addEventListener('DOMContentLoaded', () => {
  inicializarBancoConselho();
  popularSelectDocentesLogin();
  popularSelectsTurmas();
  configurarMonitorInatividade();
  inicializarSuportePWA();

  try {
    const sessaoSalva = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.SESSION) || 'null');
    if (sessaoSalva && sessaoSalva.professor) {
      ativarSessaoDocente(sessaoSalva.professor, false);
    }
  } catch (e) {}
});

function inicializarSuportePWA() {
  // Registra Service Worker para funcionamento como App Instalável (Android/iOS)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  // Oculta botão de instalar se já estiver rodando instalado em tela cheia (Standalone)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const btnPwa = document.getElementById('btnInstalarPWA');
  if (isStandalone && btnPwa) {
    btnPwa.style.display = 'none';
  }

  // Captura evento nativo de instalação no Android (Chrome/Edge/Samsung)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPwaPrompt = e;
    if (btnPwa) {
      btnPwa.style.display = 'inline-flex';
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredPwaPrompt = null;
    if (btnPwa) btnPwa.style.display = 'none';
    mostrarToast('🎉 Aplicativo SISCCD instalado com sucesso no seu dispositivo!');
  });
}

async function instalarPwaNoCelular() {
  if (deferredPwaPrompt) {
    deferredPwaPrompt.prompt();
    const { outcome } = await deferredPwaPrompt.userChoice;
    if (outcome === 'accepted') {
      deferredPwaPrompt = null;
    }
    return;
  }
  // No iPhone (iOS Safari) ou navegadores que exigem menu manual, abre o guia visual passo a passo
  const modal = document.getElementById('modalInstalarPWA');
  if (modal) modal.classList.add('open');
}

function fecharModalInstalarPWA() {
  const modal = document.getElementById('modalInstalarPWA');
  if (modal) modal.classList.remove('open');
}

function popularSelectDocentesLogin() {
  const select = document.getElementById('loginDocenteSelect');
  if (!select) return;
  select.innerHTML = '<option value="">-- Selecione seu nome --</option>';
  Object.keys(DOCENTES_IFS).sort((a, b) => a.localeCompare(b, 'pt-BR')).forEach(nome => {
    const info = DOCENTES_IFS[nome];
    const opt = document.createElement('option');
    opt.value = nome;
    opt.textContent = info.perfil === 'coordenacao' ? `🛡️ ${nome}` : `👨‍🏫 Prof(a). ${nome}`;
    select.appendChild(opt);
  });
}

function popularSelectsTurmas() {
  const cadSelect = document.getElementById('cadTurmaSelect');
  const impSelect = document.getElementById('importTurmaSelect');
  [cadSelect, impSelect].forEach(sel => {
    if (!sel) return;
    sel.innerHTML = '';
    TURMAS_IFS.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `${t.id} — ${t.modalidade}`;
      sel.appendChild(opt);
    });
  });
}

// ============================================================================
// AUTENTICAÇÃO + TERMO DE SIGILO + MARCA D'ÁGUA DINÂMICA
// ============================================================================

function realizarLoginConselho(event) {
  event.preventDefault();
  const professor = document.getElementById('loginDocenteSelect').value;
  const pinDigitado = (document.getElementById('loginPinInput').value || '').trim();
  const aceitouTermo = document.getElementById('checkAceiteTermoLGPD').checked;

  if (!professor) {
    mostrarToast('Selecione seu perfil docente para continuar.', true);
    return;
  }
  if (!aceitouTermo) {
    mostrarToast('É obrigatório aceitar o Termo de Sigilo Funcional (Lei 15.211/2025 & LGPD).', true);
    return;
  }

  const pinsSalvos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PINS) || '{}');
  const pinCorreto = pinsSalvos[professor] || DEFAULT_PIN;

  if (pinDigitado !== pinCorreto) {
    registrarLogAuditoriaLGPD(professor, 'TENTATIVA_LOGIN_FALHA', 'PIN incorreto informado na tela de bloqueio.');
    mostrarToast('PIN incorreto! Verifique seu código de acesso.', true);
    return;
  }

  registrarAceiteTermoLGPD(professor, 'v2.0-2026-LEI15211-LGPD-ECA');
  sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({
    professor,
    pin: pinDigitado,
    loginAt: new Date().toISOString()
  }));

  ativarSessaoDocente(professor, true);
}

async function ativarSessaoDocente(professor, exibirBoasVindas = true) {
  estadoApp.professorLogado = professor;
  document.getElementById('authGatekeeper').style.display = 'none';
  document.getElementById('loggedTeacherBanner').textContent = `👤 Autenticado: ${professor}`;

  const cfg = obterConfigConselho();
  if (cfg.bimestreAtual) {
    document.getElementById('headerBimestreLabel').textContent = `${cfg.bimestreAtual} • Proteção Lei 15.211/2025 (ECA Digital) & LGPD`;
  }

  gerarMarcaDaguaRastreavel(professor);
  atualizarBadgeConexao();
  renderizarPillsTurmas();
  renderizarTudo();

  if (exibirBoasVindas) {
    mostrarToast(`Bem-vindo(a), ${professor}! Proteção ECA Digital (Lei 15.211/25) & LGPD ativa.`);
  }

  if (obterApiUrl()) {
    const syncRes = await sincronizarComNuvemPrivada();
    atualizarBadgeConexao(syncRes.mode);
    renderizarTudo();
  }
}

function encerrarSessaoSegura() {
  if (estadoApp.professorLogado) {
    registrarLogAuditoriaLGPD(estadoApp.professorLogado, 'LOGOUT_SESSAO', 'Sessão bloqueada/encerrada com segurança.');
  }
  sessionStorage.removeItem(STORAGE_KEYS.SESSION);
  estadoApp.professorLogado = null;
  document.getElementById('loginPinInput').value = '';
  document.getElementById('authGatekeeper').style.display = 'flex';
}

function configurarMonitorInatividade() {
  let timerInatividade;
  const resetarTimer = () => {
    clearTimeout(timerInatividade);
    timerInatividade = setTimeout(() => {
      if (estadoApp.professorLogado) {
        encerrarSessaoSegura();
        mostrarToast('Sessão bloqueada automaticamente por inatividade (Marco Civil Art. 7º & LGPD).', true);
      }
    }, 15 * 60 * 1000);
  };
  ['mousemove', 'keydown', 'click', 'touchstart'].forEach(ev => {
    window.addEventListener(ev, resetarTimer, { passive: true });
  });
  resetarTimer();
}

function gerarMarcaDaguaRastreavel(professor) {
  const container = document.getElementById('watermarkOverlay');
  if (!container) return;
  container.innerHTML = '';
  const dataCurta = new Date().toLocaleDateString('pt-BR');
  const texto = `SIGILO LEI 15.211/25 & LGPD • ${professor.toUpperCase()} • IFS TOBIAS BARRETO • ${dataCurta}`;
  for (let i = 0; i < 28; i++) {
    const span = document.createElement('div');
    span.className = 'watermark-item';
    span.textContent = texto;
    container.appendChild(span);
  }
}

function alternarModoPrivacidade() {
  estadoApp.modoPrivacidadeBlur = !estadoApp.modoPrivacidadeBlur;
  document.body.classList.toggle('privacy-blur-mode', estadoApp.modoPrivacidadeBlur);
  const btn = document.getElementById('btnPrivacyBlur');
  if (btn) {
    btn.textContent = estadoApp.modoPrivacidadeBlur
      ? '🙈 Modo Projetor (Desfocar Fotos): ON'
      : '👁️ Modo Projetor (Desfocar Fotos): OFF';
  }
  renderizarTudo();
}

function formatarNomeExibicao(nomeCompleto) {
  if (!estadoApp.modoPrivacidadeBlur) return nomeCompleto;
  const partes = (nomeCompleto || '').trim().split(/\s+/);
  if (partes.length <= 1) return nomeCompleto;
  return partes[0] + ' ' + partes.slice(1).map(p => p.startsWith('[') ? p : (p[0] + '.')).join(' ');
}

/**
 * TRAVA TÉCNICA LGPD ART. 14 & ECA DIGITAL (LEI 15.211/2025):
 * Se o estudante menor de idade não possuir consentimento parental de imagem ativo
 * (consentimentoImagemPais === false), bloqueia qualquer foto real e retorna Avatar Institucional!
 */
function obterFotoSeguraAluno(aluno) {
  const iniciais = obterIniciaisNome(aluno.nome);
  if (aluno.consentimentoImagemPais === false) {
    return gerarAvatarDemoSVG(iniciais, '#64748b', 'SEM CONSENTIMENTO FOTO (ART. 14)');
  }
  return aluno.fotoUrl || gerarAvatarDemoSVG(iniciais, '#15803d');
}

function atualizarBadgeConexao(modoForcado) {
  const badge = document.getElementById('connectionStatusBadge');
  if (!badge) return;
  const url = obterApiUrl();
  if (url && modoForcado !== 'offline') {
    badge.className = 'badge-pill badge-cloud';
    badge.textContent = '☁️ Conectado à Planilha/Drive Privado (Zero Dados no GitHub)';
  } else {
    badge.className = 'badge-pill badge-demo';
    badge.textContent = '⚡ Modo Local / Demonstração (Configure a Planilha Privada em ⚙️)';
  }
}

// ============================================================================
// CÁLCULO DE PRIORIDADE E INDICADORES DO ALUNO ("QUEM DEVE SER AVALIADO")
// ============================================================================

function analisarSituacaoAluno(aluno, todosPareceres, todosEncaminhamentos) {
  const pareceresAluno = todosPareceres.filter(p => p.alunoId === aluno.id);
  const encaminhamentoAluno = todosEncaminhamentos.find(e => e.alunoId === aluno.id) || null;

  const qtdSinalizadosPlenaria = pareceresAluno.filter(p => p.avaliarEmPlenaria).length;
  const qtdRendimentoCritico = pareceresAluno.filter(p => p.rendimento === 'critico').length;
  const qtdRendimentoAtencao = pareceresAluno.filter(p => p.rendimento === 'atencao').length;
  const qtdInfrequente = pareceresAluno.filter(p => p.frequencia === 'infrequente').length;
  const qtdConflitoConvivencia = pareceresAluno.filter(p => p.postura === 'conflito').length;

  const precisaSerAvaliado =
    aluno.statusConselho === 'avaliar' ||
    qtdSinalizadosPlenaria > 0 ||
    qtdRendimentoCritico > 0 ||
    qtdInfrequente > 0 ||
    qtdConflitoConvivencia > 0 ||
    (aluno.alertaProtecaoEcaDigital && aluno.alertaProtecaoEcaDigital !== 'nenhum');

  const scorePrioridade =
    (aluno.statusConselho === 'avaliar' ? 10 : 0) +
    (qtdSinalizadosPlenaria * 8) +
    (qtdRendimentoCritico * 6) +
    (qtdInfrequente * 5) +
    (qtdConflitoConvivencia * 7) +
    (qtdRendimentoAtencao * 2);

  const meuParecer = pareceresAluno.find(p => p.professor === estadoApp.professorLogado) || null;

  let statusVisual = aluno.statusConselho || 'regular';
  if (statusVisual !== 'concluido') {
    if (precisaSerAvaliado) statusVisual = 'avaliar';
    else if (qtdRendimentoAtencao > 0 || aluno.statusConselho === 'atencao') statusVisual = 'atencao';
  }

  return {
    pareceresAluno,
    encaminhamentoAluno,
    qtdPareceres: pareceresAluno.length,
    qtdSinalizadosPlenaria,
    qtdRendimentoCritico,
    qtdRendimentoAtencao,
    qtdInfrequente,
    qtdConflitoConvivencia,
    precisaSerAvaliado,
    scorePrioridade,
    meuParecer,
    statusVisual
  };
}

// ============================================================================
// RENDERIZAÇÃO DE TURMAS, FILTROS E CARDS DE ALUNOS COM FOTO
// ============================================================================

function normalizarTurmaId(str) {
  return String(str || '').trim().replace(/°/g, 'º').replace(/\s+/g, ' ').toUpperCase();
}

function renderizarPillsTurmas() {
  const container = document.getElementById('turmaPillsContainer');
  if (!container) return;
  const alunos = obterAlunosLocal();

  let html = `<button type="button" class="turma-pill ${estadoApp.turmaSelecionada === 'TODAS' ? 'active' : ''}" onclick="selecionarTurmaFiltro('TODAS')">
    Todas (${alunos.length})
  </button>`;

  TURMAS_IFS.forEach(t => {
    const count = alunos.filter(a => normalizarTurmaId(a.turma) === normalizarTurmaId(t.id)).length;
    const isAtiva = normalizarTurmaId(estadoApp.turmaSelecionada) === normalizarTurmaId(t.id);
    html += `<button type="button" class="turma-pill ${isAtiva ? 'active' : ''}" onclick="selecionarTurmaFiltro('${t.id}')">
      ${t.id} (${count})
    </button>`;
  });

  container.innerHTML = html;
}

function selecionarTurmaFiltro(turmaId) {
  estadoApp.turmaSelecionada = turmaId;
  // Ao clicar em uma turma, garante que a visão de todos os alunos daquela turma seja exibida sem filtros restritivos ocultos
  const selectSit = document.getElementById('selectFiltroSituacao');
  if (selectSit && selectSit.value !== 'todos') {
    selectSit.value = 'todos';
  }
  const inputBusca = document.getElementById('inputBuscaAluno');
  if (inputBusca && inputBusca.value) {
    inputBusca.value = '';
  }
  renderizarPillsTurmas();
  renderizarTudo();
}

function aplicarFiltroSituacao(situacao) {
  mudarAbaPrincipal('turmas');
  const select = document.getElementById('selectFiltroSituacao');
  if (select) {
    select.value = situacao;
  }
  renderizarTudo();
}

function mudarAbaPrincipal(aba) {
  estadoApp.abaAtiva = aba;
  document.querySelectorAll('.nav-tab, .mobile-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === aba);
  });

  document.getElementById('viewTurmas').style.display = aba === 'turmas' ? 'block' : 'none';
  document.getElementById('viewPrioridades').style.display = aba === 'prioridades' ? 'block' : 'none';
  document.getElementById('viewAta').style.display = aba === 'ata' ? 'block' : 'none';
  document.getElementById('viewRespaldo').style.display = aba === 'respaldo' ? 'block' : 'none';

  renderizarTudo();
}

function obterAlunosFiltrados() {
  const alunos = obterAlunosLocal();
  const pareceres = obterPareceresLocal();
  const encaminhamentos = obterEncaminhamentosLocal();
  const busca = (document.getElementById('inputBuscaAluno')?.value || '').trim().toLowerCase();
  const filtroSituacao = document.getElementById('selectFiltroSituacao')?.value || 'todos';

  return alunos
    .map(aluno => ({
      aluno,
      analise: analisarSituacaoAluno(aluno, pareceres, encaminhamentos)
    }))
    .filter(({ aluno, analise }) => {
      if (estadoApp.turmaSelecionada !== 'TODAS' && normalizarTurmaId(aluno.turma) !== normalizarTurmaId(estadoApp.turmaSelecionada)) {
        return false;
      }
      if (busca) {
        const textoAlvo = `${aluno.nome} ${aluno.matricula} ${aluno.turma} ${aluno.responsavelLegal || ''} ${aluno.observacaoCoord || ''}`.toLowerCase();
        if (!textoAlvo.includes(busca)) return false;
      }
      if (filtroSituacao === 'avaliar') return analise.precisaSerAvaliado && analise.statusVisual !== 'concluido';
      if (filtroSituacao === 'atencao') return analise.statusVisual === 'atencao' || analise.qtdRendimentoAtencao > 0;
      if (filtroSituacao === 'menores_16') return Number(aluno.idade || 15) < 16;
      if (filtroSituacao === 'pendentes_meu') return !analise.meuParecer;
      if (filtroSituacao === 'avaliados_meu') return Boolean(analise.meuParecer);
      if (filtroSituacao === 'destaque') return aluno.statusConselho === 'destaque';
      if (filtroSituacao === 'napne') return Boolean(aluno.napne);
      return true;
    })
    .sort((a, b) => {
      if (b.analise.scorePrioridade !== a.analise.scorePrioridade) {
        return b.analise.scorePrioridade - a.analise.scorePrioridade;
      }
      return a.aluno.nome.localeCompare(b.aluno.nome, 'pt-BR');
    });
}

function renderizarTudo() {
  renderizarPillsTurmas();
  const listaFiltrada = obterAlunosFiltrados();
  estadoApp.listaNavegacaoModalIds = listaFiltrada.map(item => item.aluno.id);

  const todosAlunos = obterAlunosLocal().filter(a => estadoApp.turmaSelecionada === 'TODAS' || normalizarTurmaId(a.turma) === normalizarTurmaId(estadoApp.turmaSelecionada));
  const todosPareceres = obterPareceresLocal();
  const todosEnc = obterEncaminhamentosLocal();

  let countPrioridade = 0;
  let countPendentesMeu = 0;
  todosAlunos.forEach(a => {
    const an = analisarSituacaoAluno(a, todosPareceres, todosEnc);
    if (an.precisaSerAvaliado && an.statusVisual !== 'concluido') countPrioridade++;
    if (!an.meuParecer) countPendentesMeu++;
  });

  document.getElementById('kpiTotalAlunos').textContent = todosAlunos.length;
  document.getElementById('kpiPrioridadeAvaliar').textContent = countPrioridade;
  document.getElementById('kpiPendentesMeu').textContent = countPendentesMeu;

  // Atualiza botões de Deletar / Recarregar Demos no cabeçalho principal
  const qtdDemos = obterAlunosLocal().filter(a => a.isDemo).length;
  const btnLimpar = document.getElementById('btnHeaderLimparDemos');
  const btnRestaurar = document.getElementById('btnHeaderRestaurarDemos');
  if (btnLimpar) {
    btnLimpar.style.display = qtdDemos > 0 ? 'inline-flex' : 'none';
    btnLimpar.textContent = `🗑️ Deletar Alunos Demo (${qtdDemos})`;
  }
  if (btnRestaurar) {
    btnRestaurar.style.display = qtdDemos === 0 ? 'inline-flex' : 'none';
  }

  renderizarGridAlunos(listaFiltrada);
  renderizarVisaoPrioridades();
  renderizarVisaoAta();
  renderizarTabelaAuditoriaLGPD();
}

function obterRotuloStatus(statusVisual) {
  switch (statusVisual) {
    case 'avaliar':
      return { classe: 'status-avaliar', icone: '🚨', texto: 'Avaliar na Plenária (Prioridade)' };
    case 'atencao':
      return { classe: 'status-atencao', icone: '⚠️', texto: 'Em Atenção Pedagógica' };
    case 'destaque':
      return { classe: 'status-destaque', icone: '🏆', texto: 'Destaque Positivo' };
    case 'concluido':
      return { classe: 'status-concluido', icone: '✔️', texto: 'Avaliado & Encaminhado' };
    default:
      return { classe: 'status-regular', icone: '✅', texto: 'Situação Regular' };
  }
}

function renderizarGridAlunos(listaFiltrada) {
  const container = document.getElementById('studentsGridContainer');
  if (!container) return;

  if (listaFiltrada.length === 0) {
    container.innerHTML = `
      <div class="card-panel" style="grid-column: 1 / -1; text-align:center; padding: 2.5rem;">
        <div style="font-size: 2.4rem; margin-bottom: 0.5rem;">🔍</div>
        <h3 style="font-size: 1.1rem; font-weight: 800;">Nenhum estudante encontrado para este filtro</h3>
        <p style="font-size: 0.86rem; color: #475569; margin-top: 0.3rem;">
          Altere o filtro de turma/situação ou clique em <strong>"➕ Cadastrar Aluno + Vínculo Parental"</strong> no topo.
        </p>
      </div>`;
    return;
  }

  container.innerHTML = listaFiltrada.map(({ aluno, analise }) => {
    const rotulo = obterRotuloStatus(analise.statusVisual);
    const fotoSrc = obterFotoSeguraAluno(aluno);
    const idadeNum = Number(aluno.idade || 15);
    const isMenor16 = idadeNum < 16;
    const isMenor18 = idadeNum < 18;

    return `
      <article class="student-card priority-${analise.statusVisual}" onclick="abrirModalFichaAluno('${aluno.id}')">
        <div class="student-card-header">
          <div class="student-photo-wrap">
            <img class="student-photo-protected" src="${fotoSrc}" alt="Foto de ${escaparHtml(aluno.nome)}" loading="lazy" />
          </div>
          <div class="student-meta">
            <div class="student-turma-row">
              <span class="chip-turma">${escaparHtml(aluno.turma)}</span>
              <span class="chip-idade-eca" style="${isMenor16 ? 'background:#fef3c7;color:#92400e;border-color:#fde68a;' : ''}">
                ${idadeNum} anos ${isMenor16 ? '• 🔒 <16a (Lei 15.211/25)' : (isMenor18 ? '• 🛡️ ECA' : '')}
              </span>
              ${aluno.napne ? '<span class="chip-idade-eca" style="background:#ede9fe;color:#5b21b6;border-color:#ddd6fe;">♿ NAPNE</span>' : ''}
            </div>
            <h3 class="student-name" title="${escaparHtml(aluno.nome)}">${escaparHtml(formatarNomeExibicao(aluno.nome))}</h3>
            <div class="student-matricula">Matrícula SUAP: ${escaparHtml(aluno.matricula)}</div>
          </div>
        </div>

        <div class="student-card-body">
          <div class="status-banner-mini ${rotulo.classe}">
            <span>${rotulo.icone} ${rotulo.texto}</span>
            <span>${analise.qtdPareceres} parecer(es)</span>
          </div>

          <div class="pareceres-mini-summary">
            ${analise.meuParecer
              ? `<span class="tag-mini tag-my-done">✅ Meu parecer (${escaparHtml(analise.meuParecer.disciplina)})</span>`
              : `<span class="tag-mini">⏳ Sem meu parecer</span>`
            }
            ${aluno.consentimentoImagemPais === false
              ? `<span class="tag-mini" style="background:#f1f5f9;color:#475569;">🔒 Foto Anonimizada (Art. 14)</span>`
              : ''
            }
            ${analise.qtdRendimentoCritico > 0
              ? `<span class="tag-mini tag-alert">📉 ${analise.qtdRendimentoCritico} disc. crítica(s)</span>`
              : ''
            }
            ${analise.qtdInfrequente > 0
              ? `<span class="tag-mini tag-alert">📅 Alerta de Faltas (${analise.qtdInfrequente})</span>`
              : ''
            }
            ${analise.encaminhamentoAluno
              ? `<span class="tag-mini" style="background:#e0f2fe;color:#0369a1;border-color:#bae6fd;">🧭 Encaminhado</span>`
              : ''
            }
          </div>

          <div style="font-size:0.73rem; color:#334155; background:#f8fafc; padding:0.3rem 0.55rem; border-radius:6px; border:1px solid #e2e8f0;">
            👨‍👩‍👧 <strong>Resp. Legal:</strong> ${escaparHtml(aluno.responsavelLegal || 'Vinculado no SUAP')}
          </div>
        </div>

        <div class="student-card-footer">
          <span>👆 Clique para abrir ficha e avaliar</span>
          <span>➔</span>
        </div>
      </article>
    `;
  }).join('');
}

// ============================================================================
// MODAL 1: FICHA DO ALUNO, CADASTRO DE PARECER DOCENTE E ENCAMINHAMENTOS
// ============================================================================

function abrirModalFichaAluno(alunoId, subAbaInicial = 'parecer') {
  const alunos = obterAlunosLocal();
  const aluno = alunos.find(a => a.id === alunoId);
  if (!aluno) return;

  estadoApp.alunoModalAtualId = alunoId;
  registrarLogAuditoriaLGPD(estadoApp.professorLogado, 'CONSULTA_FICHA_ALUNO', `Acessou a ficha individual de ${aluno.nome} (${aluno.turma})`);

  const pareceres = obterPareceresLocal();
  const encaminhamentos = obterEncaminhamentosLocal();
  const analise = analisarSituacaoAluno(aluno, pareceres, encaminhamentos);
  const idadeNum = Number(aluno.idade || 15);

  document.getElementById('fichaFotoImg').src = obterFotoSeguraAluno(aluno);
  document.getElementById('fichaTurmaChip').textContent = aluno.turma;
  document.getElementById('fichaIdadeChip').textContent = `${idadeNum} anos • Idade aferida via SUAP (Lei 15.211/25)`;
  document.getElementById('fichaMenor16Chip').style.display = idadeNum < 16 ? 'inline-flex' : 'none';
  document.getElementById('fichaNapneChip').style.display = aluno.napne ? 'inline-flex' : 'none';
  document.getElementById('fichaNomeAluno').textContent = formatarNomeExibicao(aluno.nome);
  document.getElementById('fichaMatriculaAluno').textContent = `Matrícula SUAP: ${aluno.matricula} • ${aluno.verificacaoEtariaSUAP || 'Aferição Documental SUAP'}`;

  const respTexto = aluno.responsavelLegal
    ? `${aluno.responsavelLegal} ${aluno.contatoResponsavel ? '• Tel: ' + aluno.contatoResponsavel : ''}`
    : 'Vinculado na Matrícula Institucional SUAP';
  document.getElementById('fichaResponsavelTexto').textContent = respTexto;

  document.getElementById('fichaObsCoord').textContent = aluno.observacaoCoord ? `📌 Coordenação: ${aluno.observacaoCoord}` : '';
  document.getElementById('fichaStatusGeralSelect').value = analise.statusVisual;
  document.getElementById('countPareceresAluno').textContent = analise.qtdPareceres;

  // Botão de Consentimento de Foto (Art. 14 e 18 da LGPD)
  const btnFotoConsent = document.getElementById('btnToggleConsentimentoFoto');
  if (btnFotoConsent) {
    const ativo = aluno.consentimentoImagemPais !== false;
    btnFotoConsent.textContent = ativo
      ? '🖼️ Consentimento Foto (Art. 14): ATIVO'
      : '🔒 Foto Bloqueada (Sem Consent. Art. 14)';
    btnFotoConsent.style.borderColor = ativo ? '#86efac' : '#fca5a5';
    btnFotoConsent.style.color = ativo ? '#166534' : '#991b1b';
  }

  const prof = estadoApp.professorLogado || 'Docente';
  document.getElementById('parecerProfInput').value = prof;

  const infoDocente = DOCENTES_IFS[prof];
  const datalist = document.getElementById('listaDisciplinasDocente');
  datalist.innerHTML = '';
  let disciplinaSugerida = '';
  if (infoDocente && infoDocente.disciplinasPorTurma) {
    const listaDisc = infoDocente.disciplinasPorTurma[aluno.turma] || infoDocente.disciplinasPorTurma['*'] || [];
    listaDisc.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d;
      datalist.appendChild(opt);
    });
    if (listaDisc.length > 0) disciplinaSugerida = listaDisc[0];
  }

  if (analise.meuParecer) {
    document.getElementById('parecerDiscInput').value = analise.meuParecer.disciplina || disciplinaSugerida;
    document.getElementById('parecerNotaInput').value = analise.meuParecer.notaAtual || '';
    document.getElementById('parecerFaltasInput').value = analise.meuParecer.faltas || '';
    document.getElementById('parecerRendimentoSelect').value = analise.meuParecer.rendimento || 'adequado';
    document.getElementById('parecerFrequenciaSelect').value = analise.meuParecer.frequencia || 'regular';
    document.getElementById('parecerPosturaSelect').value = analise.meuParecer.postura || 'participativo';
    document.getElementById('parecerObsTextarea').value = analise.meuParecer.observacao || '';
    document.getElementById('checkSinalizarPlenaria').checked = Boolean(analise.meuParecer.avaliarEmPlenaria);
    estadoApp.tagsSelecionadasParecer = Array.isArray(analise.meuParecer.tags) ? [...analise.meuParecer.tags] : [];
  } else {
    document.getElementById('parecerDiscInput').value = disciplinaSugerida;
    document.getElementById('parecerNotaInput').value = '';
    document.getElementById('parecerFaltasInput').value = '';
    document.getElementById('parecerRendimentoSelect').value = 'adequado';
    document.getElementById('parecerFrequenciaSelect').value = 'regular';
    document.getElementById('parecerPosturaSelect').value = 'participativo';
    document.getElementById('parecerObsTextarea').value = '';
    document.getElementById('checkSinalizarPlenaria').checked = false;
    estadoApp.tagsSelecionadasParecer = [];
  }

  renderizarChipsTagsParecer();
  renderizarListaPareceresConsolidados(analise.pareceresAluno);
  preencherFormularioEncaminhamento(analise.encaminhamentoAluno, idadeNum < 16);

  alternarSubAbaFicha(subAbaInicial);
  document.getElementById('modalFichaAluno').classList.add('open');
}

function alternarConsentimentoFotoAlunoAtual() {
  const alunoId = estadoApp.alunoModalAtualId;
  if (!alunoId) return;
  const alunos = obterAlunosLocal();
  const aluno = alunos.find(a => a.id === alunoId);
  if (!aluno) return;

  aluno.consentimentoImagemPais = aluno.consentimentoImagemPais === false ? true : false;
  salvarAlunosLocal(alunos);

  registrarLogAuditoriaLGPD(
    estadoApp.professorLogado,
    aluno.consentimentoImagemPais ? 'CONSENTIMENTO_FOTO_ATIVADO' : 'REVOGACAO_CONSENTIMENTO_FOTO_ART18',
    `Alterou status de consentimento parental de imagem (Art. 14/18 LGPD) de ${aluno.nome} para: ${aluno.consentimentoImagemPais ? 'Autorizado' : 'Revogado/Anonimizado'}`
  );

  abrirModalFichaAluno(alunoId);
  renderizarTudo();
  mostrarToast(
    aluno.consentimentoImagemPais
      ? 'Consentimento parental de foto (Art. 14 LGPD) ativado!'
      : 'Consentimento de foto revogado (Art. 18 LGPD): Foto substituída por Avatar Anonimizado!'
  );

  if (obterApiUrl()) {
    enviarRequisicaoSeguraBackend('UPSERT_ALUNO', { aluno }).catch(() => {});
  }
}

function fecharModalFichaAluno() {
  document.getElementById('modalFichaAluno').classList.remove('open');
  estadoApp.alunoModalAtualId = null;
}

function navegarAlunoModal(direcao) {
  const ids = estadoApp.listaNavegacaoModalIds;
  if (!ids || ids.length === 0) return;
  const idxAtual = ids.indexOf(estadoApp.alunoModalAtualId);
  const novoIdx = (idxAtual + direcao + ids.length) % ids.length;
  abrirModalFichaAluno(ids[novoIdx]);
}

function iniciarModoReuniaoPlenaria() {
  aplicarFiltroSituacao('avaliar');
  const filtrados = obterAlunosFiltrados();
  if (filtrados.length === 0) {
    mostrarToast('Nenhum aluno sinalizado com prioridade no momento! Exibindo todos.', false);
    aplicarFiltroSituacao('todos');
    const todos = obterAlunosFiltrados();
    if (todos.length > 0) abrirModalFichaAluno(todos[0].aluno.id, 'consolidado');
    return;
  }
  abrirModalFichaAluno(filtrados[0].aluno.id, 'consolidado');
  mostrarToast(`Modo Plenária: Avaliando 1 de ${filtrados.length} estudantes prioritários.`);
}

function alternarSubAbaFicha(qual) {
  document.getElementById('subtabBtnParecer').classList.toggle('active', qual === 'parecer');
  document.getElementById('subtabBtnConsolidado').classList.toggle('active', qual === 'consolidado');
  document.getElementById('subtabBtnEncaminhamento').classList.toggle('active', qual === 'encaminhamento');

  document.getElementById('subviewParecer').style.display = qual === 'parecer' ? 'block' : 'none';
  document.getElementById('subviewConsolidado').style.display = qual === 'consolidado' ? 'block' : 'none';
  document.getElementById('subviewEncaminhamento').style.display = qual === 'encaminhamento' ? 'block' : 'none';
}

function renderizarChipsTagsParecer() {
  const container = document.getElementById('parecerTagsContainer');
  if (!container) return;
  container.innerHTML = TAGS_DIAGNOSTICO_PADRAO.map(tag => {
    const sel = estadoApp.tagsSelecionadasParecer.includes(tag);
    return `<span class="chip-toggle ${sel ? 'selected' : ''}" onclick="alternarTagParecer('${tag}')">${tag}</span>`;
  }).join('');
}

function alternarTagParecer(tag) {
  const idx = estadoApp.tagsSelecionadasParecer.indexOf(tag);
  if (idx >= 0) {
    estadoApp.tagsSelecionadasParecer.splice(idx, 1);
  } else {
    estadoApp.tagsSelecionadasParecer.push(tag);
  }
  renderizarChipsTagsParecer();
}

function inserirFrasePedagogica(frase) {
  const area = document.getElementById('parecerObsTextarea');
  if (!area) return;
  area.value = area.value ? `${area.value.trim()} ${frase}` : frase;
  area.focus();
}

async function salvarParecerDocenteAtual(event) {
  event.preventDefault();
  const alunoId = estadoApp.alunoModalAtualId;
  if (!alunoId) return;

  const alunos = obterAlunosLocal();
  const aluno = alunos.find(a => a.id === alunoId);
  if (!aluno) return;

  const observacao = document.getElementById('parecerObsTextarea').value.trim();

  // Validador Ético Anti-Rotulagem (ECA Art. 17/18 e Lei do Bullying/Cyberbullying 13.185/2015 & 14.811/2024)
  const validacaoEtica = validarLinguagemEticaParecer(observacao);
  if (!validacaoEtica.valido) {
    mostrarToast(validacaoEtica.mensagem, true);
    return;
  }

  const professor = estadoApp.professorLogado || 'Docente';
  const disciplina = document.getElementById('parecerDiscInput').value.trim();
  const notaAtual = document.getElementById('parecerNotaInput').value.trim();
  const faltas = document.getElementById('parecerFaltasInput').value.trim();
  const rendimento = document.getElementById('parecerRendimentoSelect').value;
  const frequencia = document.getElementById('parecerFrequenciaSelect').value;
  const postura = document.getElementById('parecerPosturaSelect').value;
  const avaliarEmPlenaria =
    document.getElementById('checkSinalizarPlenaria').checked ||
    rendimento === 'critico' ||
    frequencia === 'infrequente' ||
    postura === 'conflito';

  const todosPareceres = obterPareceresLocal();
  const idxExistente = todosPareceres.findIndex(p => p.alunoId === alunoId && p.professor === professor);

  const registroParecer = {
    id: idxExistente >= 0 ? todosPareceres[idxExistente].id : ('PAR-' + Date.now()),
    alunoId,
    turma: aluno.turma,
    professor,
    disciplina,
    rendimento,
    frequencia,
    postura,
    notaAtual,
    faltas,
    tags: [...estadoApp.tagsSelecionadasParecer],
    avaliarEmPlenaria,
    observacao,
    dataHora: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
  };

  if (idxExistente >= 0) {
    todosPareceres[idxExistente] = registroParecer;
  } else {
    todosPareceres.unshift(registroParecer);
  }
  salvarPareceresLocal(todosPareceres);

  if (avaliarEmPlenaria && aluno.statusConselho !== 'concluido') {
    aluno.statusConselho = 'avaliar';
    salvarAlunosLocal(alunos);
  }

  registrarLogAuditoriaLGPD(professor, 'REGISTRO_PARECER_DOCENTE', `Registrou parecer ético validado em ${disciplina} para ${aluno.nome} (${aluno.turma})`);
  mostrarToast(`Parecer de ${disciplina} validado e salvo com sucesso!`);

  abrirModalFichaAluno(alunoId, 'consolidado');
  renderizarTudo();

  if (obterApiUrl()) {
    enviarRequisicaoSeguraBackend('UPSERT_PARECER', { parecer: registroParecer, aluno }).catch(() => {});
  }
}

function renderizarListaPareceresConsolidados(pareceresAluno) {
  const container = document.getElementById('listaPareceresConsolidadosContainer');
  if (!container) return;

  if (!pareceresAluno || pareceresAluno.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 2rem; background:#f8fafc; border-radius:12px; border:1px dashed #cbd5e1;">
        <p style="font-weight:700; color:#334155;">Nenhum parecer registrado ainda para este estudante.</p>
        <p style="font-size:0.82rem; color:#64748b; margin-top:0.25rem;">Utilize a aba "1. Registrar Meu Parecer Docente" para adicionar a primeira avaliação.</p>
      </div>`;
    return;
  }

  container.innerHTML = pareceresAluno.map(p => {
    const badgeRend = p.rendimento === 'critico'
      ? '🚨 Rendimento Crítico'
      : (p.rendimento === 'atencao' ? '⚠️ Em Atenção' : '✅ Rendimento Adequado');
    const badgeFreq = p.frequencia === 'infrequente'
      ? '🚨 Infrequente'
      : (p.frequencia === 'pontual' ? '⚠️ Faltas Pontuais' : '✅ Assíduo');

    return `
      <div class="parecer-item ${p.avaliarEmPlenaria ? 'avaliar-highlight' : ''}">
        <div class="parecer-top">
          <div>
            <strong style="font-size:0.95rem; color:#0f172a;">👨‍🏫 Prof(a). ${escaparHtml(p.professor)}</strong>
            <span class="chip-turma" style="margin-left:0.4rem;">${escaparHtml(p.disciplina)}</span>
            ${p.avaliarEmPlenaria ? '<span class="tag-mini tag-alert" style="margin-left:0.35rem;">🚨 Prioridade Plenária (CF Art. 227)</span>' : ''}
          </div>
          <small style="color:#64748b; font-size:0.75rem;">🕒 ${escaparHtml(p.dataHora || '')}</small>
        </div>

        <div class="pareceres-mini-summary" style="margin-bottom:0.5rem;">
          <span class="tag-mini">${badgeRend}</span>
          <span class="tag-mini">${badgeFreq}</span>
          ${p.notaAtual ? `<span class="tag-mini">📊 Nota/Conceito: <strong>${escaparHtml(p.notaAtual)}</strong></span>` : ''}
          ${p.faltas ? `<span class="tag-mini">📅 Faltas: <strong>${escaparHtml(p.faltas)}</strong></span>` : ''}
          ${(p.tags || []).map(t => `<span class="tag-mini" style="background:#f0fdf4;color:#166534;border-color:#bbf7d0;">🏷️ ${escaparHtml(t)}</span>`).join('')}
        </div>

        <p style="font-size:0.86rem; color:#1e293b; background:#f8fafc; padding:0.65rem 0.8rem; border-radius:8px;">
          ${p.observacao ? escaparHtml(p.observacao) : '<em>Sem observações descritivas adicionais.</em>'}
        </p>
      </div>
    `;
  }).join('');
}

function preencherFormularioEncaminhamento(encaminhamento, isMenor16) {
  estadoApp.acoesSelecionadasEncaminhamento = encaminhamento && Array.isArray(encaminhamento.acoes)
    ? [...encaminhamento.acoes]
    : (isMenor16 ? ["📞 Convocar Responsáveis Legais (Pais/Mães - ECA & Lei 15.211/2025)"] : []);

  const selectProt = document.getElementById('encProtocoloProtecaoSelect');
  if (selectProt) {
    selectProt.value = encaminhamento?.protocoloProtecaoIntegral ||
      (isMenor16 ? "Vinculação Obrigatória aos Pais (<16 anos - Lei 15.211/2025)" : "Acompanhamento Pedagógico Ordinário");
  }

  document.getElementById('encResponsavelInput').value = encaminhamento ? (encaminhamento.responsavel || '') : 'Coordenação de Curso + Equipe Técnico-Pedagógica';
  document.getElementById('encPrazoInput').value = encaminhamento ? (encaminhamento.prazo || '') : '';
  document.getElementById('encStatusSelect').value = encaminhamento ? (encaminhamento.statusEncaminhamento || 'Em Andamento') : 'Pendente de Convocação';
  document.getElementById('encDeliberacaoTextarea').value = encaminhamento ? (encaminhamento.deliberacaoAta || '') : '';

  renderizarChipsAcoesEncaminhamento();
}

function renderizarChipsAcoesEncaminhamento() {
  const container = document.getElementById('encaminhamentoAcoesContainer');
  if (!container) return;
  container.innerHTML = ACOES_ENCAMINHAMENTO_PADRAO.map(acao => {
    const sel = estadoApp.acoesSelecionadasEncaminhamento.includes(acao);
    return `<span class="chip-toggle ${sel ? 'selected' : ''}" onclick="alternarAcaoEncaminhamento('${acao}')">${acao}</span>`;
  }).join('');
}

function alternarAcaoEncaminhamento(acao) {
  const idx = estadoApp.acoesSelecionadasEncaminhamento.indexOf(acao);
  if (idx >= 0) {
    estadoApp.acoesSelecionadasEncaminhamento.splice(idx, 1);
  } else {
    estadoApp.acoesSelecionadasEncaminhamento.push(acao);
  }
  renderizarChipsAcoesEncaminhamento();
}

async function salvarEncaminhamentoAtual(event) {
  event.preventDefault();
  const alunoId = estadoApp.alunoModalAtualId;
  if (!alunoId) return;

  const alunos = obterAlunosLocal();
  const aluno = alunos.find(a => a.id === alunoId);
  if (!aluno) return;

  const listaEnc = obterEncaminhamentosLocal();
  const idx = listaEnc.findIndex(e => e.alunoId === alunoId);

  const novoEnc = {
    id: idx >= 0 ? listaEnc[idx].id : ('ENC-' + Date.now()),
    alunoId,
    turma: aluno.turma,
    acoes: [...estadoApp.acoesSelecionadasEncaminhamento],
    protocoloProtecaoIntegral: document.getElementById('encProtocoloProtecaoSelect')?.value || 'Acompanhamento Pedagógico Ordinário',
    responsavel: document.getElementById('encResponsavelInput').value.trim(),
    prazo: document.getElementById('encPrazoInput').value.trim(),
    statusEncaminhamento: document.getElementById('encStatusSelect').value,
    deliberacaoAta: document.getElementById('encDeliberacaoTextarea').value.trim(),
    registradoPor: estadoApp.professorLogado || 'Coordenação',
    dataHora: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
  };

  if (idx >= 0) {
    listaEnc[idx] = novoEnc;
  } else {
    listaEnc.unshift(novoEnc);
  }
  salvarEncaminhamentosLocal(listaEnc);

  aluno.statusConselho = 'concluido';
  salvarAlunosLocal(alunos);
  document.getElementById('fichaStatusGeralSelect').value = 'concluido';

  registrarLogAuditoriaLGPD(estadoApp.professorLogado, 'HOMOLOGACAO_ENCAMINHAMENTO', `Homologou encaminhamento (${novoEnc.protocoloProtecaoIntegral}) na Ata para ${aluno.nome} (${aluno.turma})`);
  mostrarToast('Encaminhamento homologado e registrado na Ata Oficial!');
  renderizarTudo();

  if (obterApiUrl()) {
    enviarRequisicaoSeguraBackend('UPSERT_ENCAMINHAMENTO', { encaminhamento: novoEnc, aluno }).catch(() => {});
  }
}

function atualizarStatusGeralAlunoAtual(novoStatus) {
  const alunoId = estadoApp.alunoModalAtualId;
  if (!alunoId) return;
  const alunos = obterAlunosLocal();
  const aluno = alunos.find(a => a.id === alunoId);
  if (!aluno) return;

  aluno.statusConselho = novoStatus;
  salvarAlunosLocal(alunos);
  registrarLogAuditoriaLGPD(estadoApp.professorLogado, 'ALTERACAO_STATUS_CONSELHO', `Alterou situação de ${aluno.nome} para ${novoStatus}`);
  mostrarToast('Situação do estudante atualizada!');
  renderizarTudo();

  if (obterApiUrl()) {
    enviarRequisicaoSeguraBackend('UPSERT_ALUNO', { aluno }).catch(() => {});
  }
}

// ============================================================================
// CADASTRO INDIVIDUAL DE ALUNO + VINCULAÇÃO PARENTAL (LEI 15.211/2025)
// ============================================================================

function verificarRegraMenor16Cadastro() {
  const idade = parseInt(document.getElementById('cadIdadeInput')?.value || '15', 10);
  const alertaEl = document.getElementById('alertaMenor16Texto');
  const inputResp = document.getElementById('cadResponsavelInput');
  const box = document.getElementById('boxVinculoParentalCadastro');

  if (!alertaEl || !inputResp || !box) return;

  if (idade < 16) {
    alertaEl.innerHTML = '🔒 <strong>ECA Digital (Lei nº 15.211/2025):</strong> Estudante menor de 16 anos (' + idade + ' anos) — <strong>Vinculação ao Pai/Mãe ou Responsável Legal OBRIGATÓRIA!</strong>';
    box.style.background = '#fffbeb';
    box.style.borderColor = '#fde68a';
    inputResp.required = true;
  } else if (idade < 18) {
    alertaEl.innerHTML = '🛡️ <strong>ECA (Lei 8.069/90) & LGPD (Art. 14):</strong> Adolescente (' + idade + ' anos) — Recomendado registro do Responsável Legal vinculado no SUAP.';
    box.style.background = '#f0fdf4';
    box.style.borderColor = '#bbf7d0';
    inputResp.required = true;
  } else {
    alertaEl.innerHTML = 'ℹ️ Estudante maior de 18 anos (Subsequente) — Vínculo parental opcional.';
    box.style.background = '#f8fafc';
    box.style.borderColor = '#cbd5e1';
    inputResp.required = false;
  }
}

function abrirModalNovoAluno() {
  document.getElementById('tituloModalCadastroAluno').textContent = '➕ Cadastrar Estudante (Conformidade Lei 15.211/2025 & LGPD)';
  document.getElementById('cadAlunoIdHidden').value = '';
  document.getElementById('cadNomeInput').value = '';
  document.getElementById('cadMatriculaInput').value = '';
  document.getElementById('cadTurmaSelect').value = estadoApp.turmaSelecionada !== 'TODAS' ? estadoApp.turmaSelecionada : '1º DS';
  document.getElementById('cadIdadeInput').value = 15;
  document.getElementById('cadStatusSelect').value = 'avaliar';
  document.getElementById('cadResponsavelInput').value = '';
  document.getElementById('cadContatoRespInput').value = '';
  document.getElementById('cadObsCoordInput').value = '';
  document.getElementById('cadConsentimentoFotoCheck').checked = true;
  document.getElementById('cadNapneCheck').checked = false;
  document.getElementById('inputArquivoFotoAluno').value = '';
  document.getElementById('btnExcluirAlunoCadastro').style.display = 'none';

  estadoApp.fotoTempCadastroBase64 = gerarAvatarDemoSVG('IFS', '#15803d');
  document.getElementById('previewFotoCadastro').src = estadoApp.fotoTempCadastroBase64;
  verificarRegraMenor16Cadastro();
  document.getElementById('modalCadastroAluno').classList.add('open');
}

function editarCadastroAlunoAtual() {
  const alunoId = estadoApp.alunoModalAtualId;
  if (!alunoId) return;
  const aluno = obterAlunosLocal().find(a => a.id === alunoId);
  if (!aluno) return;

  fecharModalFichaAluno();
  document.getElementById('tituloModalCadastroAluno').textContent = '✏️ Editar Dados e Vínculo Parental (Lei 15.211/2025)';
  document.getElementById('cadAlunoIdHidden').value = aluno.id;
  document.getElementById('cadNomeInput').value = aluno.nome;
  document.getElementById('cadMatriculaInput').value = aluno.matricula;
  document.getElementById('cadTurmaSelect').value = aluno.turma;
  document.getElementById('cadIdadeInput').value = aluno.idade || 15;
  document.getElementById('cadStatusSelect').value = aluno.statusConselho || 'regular';
  document.getElementById('cadResponsavelInput').value = aluno.responsavelLegal || '';
  document.getElementById('cadContatoRespInput').value = aluno.contatoResponsavel || '';
  document.getElementById('cadObsCoordInput').value = aluno.observacaoCoord || '';
  document.getElementById('cadConsentimentoFotoCheck').checked = aluno.consentimentoImagemPais !== false;
  document.getElementById('cadNapneCheck').checked = Boolean(aluno.napne);
  document.getElementById('btnExcluirAlunoCadastro').style.display = 'inline-flex';

  estadoApp.fotoTempCadastroBase64 = aluno.fotoUrl || gerarAvatarDemoSVG(obterIniciaisNome(aluno.nome), '#15803d');
  document.getElementById('previewFotoCadastro').src = estadoApp.fotoTempCadastroBase64;
  verificarRegraMenor16Cadastro();
  document.getElementById('modalCadastroAluno').classList.add('open');
}

function fecharModalNovoAluno() {
  document.getElementById('modalCadastroAluno').classList.remove('open');
}

async function processarUploadFotoInput(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  try {
    const comprimida = await comprimirFotoAluno(file, 220, 0.78);
    estadoApp.fotoTempCadastroBase64 = comprimida;
    document.getElementById('previewFotoCadastro').src = comprimida;
    mostrarToast('Foto otimizada localmente (220x220px) com sucesso!');
  } catch (err) {
    mostrarToast('Erro ao processar imagem: ' + err.message, true);
  }
}

async function salvarCadastroAluno(event) {
  event.preventDefault();
  const idExistente = document.getElementById('cadAlunoIdHidden').value;
  const nome = document.getElementById('cadNomeInput').value.trim();
  const matricula = document.getElementById('cadMatriculaInput').value.trim();
  const turma = document.getElementById('cadTurmaSelect').value;
  const idade = parseInt(document.getElementById('cadIdadeInput').value, 10) || 15;
  const statusConselho = document.getElementById('cadStatusSelect').value;
  const responsavelLegal = document.getElementById('cadResponsavelInput').value.trim();
  const contatoResponsavel = document.getElementById('cadContatoRespInput').value.trim();
  const observacaoCoord = document.getElementById('cadObsCoordInput').value.trim();
  const consentimentoImagemPais = document.getElementById('cadConsentimentoFotoCheck').checked;
  const napne = document.getElementById('cadNapneCheck').checked;

  // Exigência estrita do ECA Digital (Lei 15.211/2025) para menores de 16 anos
  if (idade < 16 && !responsavelLegal) {
    mostrarToast('⚠️ Lei nº 15.211/2025 (ECA Digital): Para menores de 16 anos, é obrigatório informar o Pai/Mãe ou Responsável Legal vinculado!', true);
    return;
  }

  const alunos = obterAlunosLocal();
  let fotoFinal = estadoApp.fotoTempCadastroBase64;
  if (!fotoFinal || fotoFinal.includes('>IFS<')) {
    fotoFinal = gerarAvatarDemoSVG(obterIniciaisNome(nome), '#15803d');
  }

  const objAluno = {
    id: idExistente || ('ALU-' + Date.now()),
    matricula,
    nome,
    turma,
    idade,
    verificacaoEtariaSUAP: 'Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)',
    responsavelLegal: responsavelLegal || 'Vinculado na Matrícula SUAP',
    contatoResponsavel,
    consentimentoImagemPais,
    fotoUrl: fotoFinal,
    statusConselho,
    napne,
    observacaoCoord,
    isDemo: false,
    criadoEm: new Date().toLocaleDateString('pt-BR')
  };

  if (idExistente) {
    const idx = alunos.findIndex(a => a.id === idExistente);
    if (idx >= 0) alunos[idx] = objAluno;
  } else {
    alunos.unshift(objAluno);
  }

  salvarAlunosLocal(alunos);
  registrarLogAuditoriaLGPD(
    estadoApp.professorLogado,
    idExistente ? 'EDICAO_ALUNO' : 'CADASTRO_ALUNO',
    `Cadastrou/atualizou ${nome} (${turma}, ${idade} anos, Resp: ${objAluno.responsavelLegal}, Consentimento Foto: ${consentimentoImagemPais ? 'Sim' : 'Não'})`
  );
  fecharModalNovoAluno();
  renderizarTudo();
  mostrarToast(`Estudante ${nome} salvo em conformidade com a Lei 15.211/2025 e LGPD!`);

  if (obterApiUrl()) {
    enviarRequisicaoSeguraBackend('UPSERT_ALUNO', { aluno: objAluno }).catch(() => {});
  }
}

function excluirAlunoAtual() {
  const idExistente = document.getElementById('cadAlunoIdHidden').value;
  if (!idExistente) return;
  const alunos = obterAlunosLocal();
  const alvo = alunos.find(a => a.id === idExistente);
  if (!alvo) return;

  const novaLista = alunos.filter(a => a.id !== idExistente);
  salvarAlunosLocal(novaLista);
  registrarLogAuditoriaLGPD(estadoApp.professorLogado, 'EXCLUSAO_ALUNO', `Removeu o registro de ${alvo.nome} (${alvo.turma})`);
  fecharModalNovoAluno();
  renderizarTudo();
  mostrarToast('Registro de estudante removido.');

  if (obterApiUrl()) {
    enviarRequisicaoSeguraBackend('DELETE_ALUNO', { alunoId: idExistente }).catch(() => {});
  }
}

// Importação em Lote
function abrirModalImportarLote() {
  document.getElementById('importTextoLote').value = '';
  document.getElementById('modalImportarLote').classList.add('open');
}

function fecharModalImportarLote() {
  document.getElementById('modalImportarLote').classList.remove('open');
}

function processarImportacaoLote() {
  const turma = document.getElementById('importTurmaSelect').value;
  const idadePadrao = parseInt(document.getElementById('importIdadePadrao').value, 10) || 15;
  const texto = document.getElementById('importTextoLote').value.trim();

  if (!texto) {
    mostrarToast('Cole ao menos uma linha para importar.', true);
    return;
  }

  const linhas = texto.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const alunos = obterAlunosLocal();
  let importados = 0;

  linhas.forEach((linha, idx) => {
    const partes = linha.split(/[;\t,]/).map(p => p.trim()).filter(Boolean);
    let matricula = '';
    let nome = '';
    let idade = idadePadrao;
    let responsavelLegal = 'Responsável Vinculado no SUAP';

    if (partes.length === 1) {
      nome = partes[0];
      matricula = `${new Date().getFullYear()}${turma.replace(/\W/g, '')}${String(alunos.length + idx + 1).padStart(3, '0')}`;
    } else if (partes.length >= 2) {
      matricula = partes[0];
      nome = partes[1];
      if (partes[2] && !isNaN(parseInt(partes[2], 10))) {
        idade = parseInt(partes[2], 10);
      }
      if (partes[3]) {
        responsavelLegal = partes[3];
      }
    }

    if (nome) {
      alunos.push({
        id: 'ALU-' + Date.now() + '-' + idx,
        matricula,
        nome,
        turma,
        idade,
        verificacaoEtariaSUAP: 'Certidão/RG validado na Matrícula SUAP (Vedada Autodeclaração - Lei 15.211/2025)',
        responsavelLegal,
        contatoResponsavel: '',
        consentimentoImagemPais: true,
        fotoUrl: gerarAvatarDemoSVG(obterIniciaisNome(nome), '#0f766e'),
        statusConselho: 'regular',
        napne: false,
        observacaoCoord: '',
        isDemo: false,
        criadoEm: new Date().toLocaleDateString('pt-BR')
      });
      importados++;
    }
  });

  salvarAlunosLocal(alunos);
  registrarLogAuditoriaLGPD(estadoApp.professorLogado, 'IMPORTACAO_LOTE_TURMA', `Importou ${importados} alunos para a turma ${turma} (Idades aferidas SUAP - Lei 15.211/2025)`);
  fecharModalImportarLote();
  selecionarTurmaFiltro(turma);
  mostrarToast(`${importados} estudantes importados para ${turma}!`);
}

// ============================================================================
// ABA 2 (PRIORIDADES), ABA 3 (ATA OFICIAL) E ABA 4 (AUDITORIA LGPD)
// ============================================================================

function renderizarVisaoPrioridades() {
  const container = document.getElementById('prioridadesListContainer');
  if (!container) return;

  const alunos = obterAlunosLocal();
  const pareceres = obterPareceresLocal();
  const encaminhamentos = obterEncaminhamentosLocal();

  const prioritarios = alunos
    .map(aluno => ({ aluno, analise: analisarSituacaoAluno(aluno, pareceres, encaminhamentos) }))
    .filter(item => item.analise.precisaSerAvaliado)
    .sort((a, b) => b.analise.scorePrioridade - a.analise.scorePrioridade);

  if (prioritarios.length === 0) {
    container.innerHTML = `<p style="padding:1.5rem; text-align:center; color:#475569;">Nenhum estudante sinalizado como prioritário para avaliação em plenária até o momento.</p>`;
    return;
  }

  container.innerHTML = prioritarios.map(({ aluno, analise }, idx) => {
    const disciplinasCriticas = analise.pareceresAluno
      .filter(p => p.avaliarEmPlenaria || p.rendimento === 'critico' || p.frequencia === 'infrequente' || p.postura === 'conflito')
      .map(p => `${p.disciplina} (${p.professor})`)
      .join(' • ');

    return `
      <div class="parecer-item avaliar-highlight" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; cursor:pointer;" onclick="abrirModalFichaAluno('${aluno.id}', 'consolidado')">
        <div style="display:flex; align-items:center; gap:0.9rem;">
          <div style="font-size:1.1rem; font-weight:800; color:#dc2626; min-width:28px;">#${idx + 1}</div>
          <div class="student-photo-wrap" style="width:54px; height:54px;">
            <img class="student-photo-protected" src="${obterFotoSeguraAluno(aluno)}" alt="" />
          </div>
          <div>
            <div style="display:flex; gap:0.4rem; align-items:center; flex-wrap:wrap;">
              <span class="chip-turma">${escaparHtml(aluno.turma)}</span>
              <strong style="font-size:1rem;">${escaparHtml(formatarNomeExibicao(aluno.nome))}</strong>
              <span class="chip-idade-eca">${aluno.idade || 15} anos ${Number(aluno.idade) < 16 ? '• 🔒 <16a (Lei 15.211/25)' : ''}</span>
            </div>
            <div style="font-size:0.78rem; color:#334155; margin-top:0.15rem;">
              👨‍👩‍👧 Resp. Legal: <strong>${escaparHtml(aluno.responsavelLegal || 'Vinculado SUAP')}</strong>
            </div>
            <div style="font-size:0.8rem; color:#991b1b; font-weight:600; margin-top:0.15rem;">
              🚨 Alertas Docentes: ${escaparHtml(disciplinasCriticas || 'Sinalizado pela Coordenação')}
            </div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <span class="tag-mini tag-alert">${analise.qtdPareceres} parecer(es)</span>
          <button type="button" class="btn btn-primary" style="padding:0.45rem 0.85rem; font-size:0.78rem;">Abrir na Plenária ➔</button>
        </div>
      </div>
    `;
  }).join('');
}

function renderizarVisaoAta() {
  const container = document.getElementById('ataRelatorioContainer');
  if (!container) return;

  const alunos = obterAlunosLocal();
  const pareceres = obterPareceresLocal();
  const encaminhamentos = obterEncaminhamentosLocal();
  const cfg = obterConfigConselho();

  const comEncaminhamentoOuAvaliados = alunos
    .map(aluno => ({ aluno, analise: analisarSituacaoAluno(aluno, pareceres, encaminhamentos) }))
    .filter(item => item.analise.encaminhamentoAluno || item.analise.precisaSerAvaliado);

  container.innerHTML = `
    <div style="border:1px solid #cbd5e1; border-radius:12px; padding:1.25rem; background:#ffffff;">
      <div style="border-bottom:2px solid #0f172a; padding-bottom:0.85rem; margin-bottom:1rem; display:flex; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
        <div>
          <h3 style="font-size:1.1rem; font-weight:800;">INSTITUTO FEDERAL DE SERGIPE — CAMPUS TOBIAS BARRETO</h3>
          <p style="font-size:0.84rem; color:#334155;">ATA DE CONSELHO DE CLASSE • ${escaparHtml(cfg.bimestreAtual || '2026.2')}</p>
        </div>
        <div style="font-size:0.75rem; color:#475569; text-align:right;">
          <div>Documento Protegido: CF Art. 227 • ECA Digital (Lei 15.211/2025) • LGPD Art. 14 • Lei 14.811/2024</div>
          <div>Emitido em: ${new Date().toLocaleString('pt-BR')} por ${escaparHtml(estadoApp.professorLogado || '')}</div>
        </div>
      </div>

      ${comEncaminhamentoOuAvaliados.length === 0
        ? '<p style="font-size:0.88rem; color:#64748b;">Nenhum encaminhamento homologado ainda.</p>'
        : comEncaminhamentoOuAvaliados.map(({ aluno, analise }) => {
            const enc = analise.encaminhamentoAluno;
            return `
              <div style="border-bottom:1px solid #e2e8f0; padding:0.85rem 0;">
                <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:0.4rem;">
                  <strong>[${escaparHtml(aluno.turma)}] ${escaparHtml(formatarNomeExibicao(aluno.nome))} (Matrícula: ${escaparHtml(aluno.matricula)} • ${aluno.idade || 15} anos)</strong>
                  <span style="font-size:0.78rem; font-weight:700; color:#15803d;">${enc ? escaparHtml(enc.statusEncaminhamento) : 'Em Avaliação'}</span>
                </div>
                <div style="font-size:0.78rem; color:#475569; margin-top:0.15rem;">
                  👨‍👩‍👧 <strong>Responsável Legal Vinculado (Lei 15.211/2025):</strong> ${escaparHtml(aluno.responsavelLegal || 'Vinculado no SUAP')}
                </div>
                <div style="font-size:0.82rem; color:#334155; margin-top:0.3rem;">
                  <strong>Síntese Docente (${analise.qtdPareceres} pareceres):</strong>
                  ${analise.pareceresAluno.map(p => `${escaparHtml(p.disciplina)} (${escaparHtml(p.professor)}): ${escaparHtml(p.observacao || p.rendimento)}`).join(' | ') || 'Sem pareceres detalhados.'}
                </div>
                ${enc ? `
                  <div style="font-size:0.82rem; color:#0f172a; margin-top:0.3rem; background:#f8fafc; padding:0.5rem 0.75rem; border-radius:8px;">
                    <strong>🛡️ Protocolo Legal:</strong> ${escaparHtml(enc.protocoloProtecaoIntegral || 'Ordinário')}<br/>
                    <strong>🧭 Encaminhamento Deliberado:</strong> ${(enc.acoes || []).join(', ')}<br/>
                    <strong>📋 Registro em Ata:</strong> ${escaparHtml(enc.deliberacaoAta)} (Responsável: ${escaparHtml(enc.responsavel)} • Prazo: ${escaparHtml(enc.prazo || 'Imediato')})
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')
      }
    </div>
  `;
}

function renderizarTabelaAuditoriaLGPD() {
  const container = document.getElementById('auditLogsTableContainer');
  if (!container) return;
  const logs = obterLogsAuditoriaLGPD();

  if (logs.length === 0) {
    container.innerHTML = '<p style="padding:1rem; font-size:0.84rem; color:#64748b;">Nenhum evento registrado.</p>';
    return;
  }

  container.innerHTML = `
    <table style="width:100%; border-collapse:collapse; font-size:0.8rem;">
      <thead>
        <tr style="background:#f1f5f9; text-align:left; border-bottom:1px solid #cbd5e1;">
          <th style="padding:0.6rem 0.8rem;">Data/Hora</th>
          <th style="padding:0.6rem 0.8rem;">Docente / Perfil</th>
          <th style="padding:0.6rem 0.8rem;">Evento Auditado</th>
          <th style="padding:0.6rem 0.8rem;">Detalhes & Marco Legal</th>
        </tr>
      </thead>
      <tbody>
        ${logs.slice(0, 60).map(l => `
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:0.55rem 0.8rem; white-space:nowrap;">${escaparHtml(l.dataHora)}</td>
            <td style="padding:0.55rem 0.8rem; font-weight:700;">${escaparHtml(l.usuario)}</td>
            <td style="padding:0.55rem 0.8rem;"><span class="chip-turma">${escaparHtml(l.acao)}</span></td>
            <td style="padding:0.55rem 0.8rem;">${escaparHtml(l.detalhes)} <small style="color:#15803d;">(${escaparHtml(l.baseLegal)})</small></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// ============================================================================
// CONFIGURAÇÕES DA PLANILHA PRIVADA (GOOGLE APPS SCRIPT) E BACKUP
// ============================================================================

function abrirModalConfigNuvem() {
  const cfg = obterConfigConselho();
  document.getElementById('configApiUrlInput').value = obterApiUrl();
  document.getElementById('configBimestreInput').value = cfg.bimestreAtual || '2026.2 • 1º Conselho Bimestral';
  document.getElementById('configNovoPinInput').value = '';
  document.getElementById('modalConfigNuvem').classList.add('open');
}

function fecharModalConfigNuvem() {
  document.getElementById('modalConfigNuvem').classList.remove('open');
}

async function salvarConfiguracoesNuvem() {
  const url = document.getElementById('configApiUrlInput').value.trim();
  const bimestre = document.getElementById('configBimestreInput').value.trim();
  const novoPin = document.getElementById('configNovoPinInput').value.trim();

  salvarApiUrl(url);
  const cfg = obterConfigConselho();
  cfg.bimestreAtual = bimestre || '2026.2 • 1º Conselho Bimestral';
  salvarConfigConselho(cfg);

  if (novoPin && estadoApp.professorLogado) {
    const pins = JSON.parse(localStorage.getItem(STORAGE_KEYS.PINS) || '{}');
    pins[estadoApp.professorLogado] = novoPin;
    localStorage.setItem(STORAGE_KEYS.PINS, JSON.stringify(pins));
    registrarLogAuditoriaLGPD(estadoApp.professorLogado, 'ALTERACAO_PIN_INDIVIDUAL', 'Atualizou seu PIN de acesso pessoal.');
  }

  atualizarBadgeConexao();
  fecharModalConfigNuvem();
  mostrarToast('Configurações salvas com sucesso!');

  if (url) {
    await forcarSincronizacaoManual();
  }
}

async function forcarSincronizacaoManual() {
  if (!obterApiUrl()) {
    mostrarToast('Informe primeiro a URL do Google Apps Script.', true);
    return;
  }
  mostrarToast('Sincronizando com a Planilha Privada do IFS...');
  const res = await sincronizarComNuvemPrivada();
  if (res.ok) {
    atualizarBadgeConexao('cloud');
    renderizarTudo();
    mostrarToast('Sincronização concluída com sucesso!');
  } else {
    mostrarToast('Não foi possível sincronizar: ' + (res.message || ''), true);
  }
}

function removerAlunosDemo() {
  const todos = obterAlunosLocal();
  const qtdDemos = todos.filter(a => a.isDemo).length;
  if (qtdDemos === 0) {
    mostrarToast('Não há alunos de demonstração para remover.');
    return;
  }

  const alunosReais = todos.filter(a => !a.isDemo);
  const idsRestantes = new Set(alunosReais.map(a => a.id));
  const pareceres = obterPareceresLocal().filter(p => idsRestantes.has(p.alunoId));
  const enc = obterEncaminhamentosLocal().filter(e => idsRestantes.has(e.alunoId));

  salvarAlunosLocal(alunosReais);
  salvarPareceresLocal(pareceres);
  salvarEncaminhamentosLocal(enc);
  localStorage.setItem(STORAGE_KEYS.DEMO_DELETED, 'true');
  registrarLogAuditoriaLGPD(estadoApp.professorLogado, 'LIMPEZA_ALUNOS_DEMO', `Removeu ${qtdDemos} perfis fictícios [DEMO] do sistema.`);
  renderizarTudo();
  fecharModalConfigNuvem();
  mostrarToast(`🗑️ ${qtdDemos} alunos [DEMO] removidos! (Você pode recarregá-los no botão do topo se precisar apresentar novamente).`);
}

function restaurarAlunosDemoApresentacao() {
  const reais = obterAlunosLocal().filter(a => !a.isDemo);
  const pareceresReais = obterPareceresLocal().filter(p => !String(p.id).startsWith('PAR-DEMO-'));
  const encReais = obterEncaminhamentosLocal().filter(e => !String(e.id).startsWith('ENC-DEMO-'));

  localStorage.removeItem(STORAGE_KEYS.DEMO_DELETED);
  salvarAlunosLocal([...reais, ...ALUNOS_DEMO_INICIAIS]);
  salvarPareceresLocal([...pareceresReais, ...PARECERES_DEMO_INICIAIS]);
  salvarEncaminhamentosLocal([...encReais, ...ENCAMINHAMENTOS_DEMO_INICIAIS]);
  registrarLogAuditoriaLGPD(estadoApp.professorLogado, 'RESTAURACAO_ALUNOS_DEMO', 'Recarregou os 22 perfis fictícios [DEMO] para apresentação.');
  renderizarTudo();
  mostrarToast('🎭 22 Alunos [DEMO] de todas as turmas recarregados para apresentação!');
}

function excluirAlunoDiretoDaFicha() {
  const alunoId = estadoApp.alunoModalAtualId;
  if (!alunoId) return;
  const alunos = obterAlunosLocal();
  const alvo = alunos.find(a => a.id === alunoId);
  if (!alvo) return;

  salvarAlunosLocal(alunos.filter(a => a.id !== alunoId));
  salvarPareceresLocal(obterPareceresLocal().filter(p => p.alunoId !== alunoId));
  salvarEncaminhamentosLocal(obterEncaminhamentosLocal().filter(e => e.alunoId !== alunoId));
  registrarLogAuditoriaLGPD(estadoApp.professorLogado, 'EXCLUSAO_ALUNO', `Removeu o estudante ${alvo.nome} (${alvo.turma})`);

  fecharModalFichaAluno();
  renderizarTudo();
  mostrarToast(`🗑️ Estudante ${alvo.nome} removido com sucesso.`);

  if (obterApiUrl()) {
    enviarRequisicaoSeguraBackend('DELETE_ALUNO', { alunoId }).catch(() => {});
  }
}

function exportarBackupJSON() {
  const pacote = {
    exportadoEm: new Date().toISOString(),
    exportadoPor: estadoApp.professorLogado,
    avisoLegal: 'ARQUIVO CONFIDENCIAL PROTEGIDO PELA CF ART. 227, ECA DIGITAL (LEI 15.211/2025), LGPD (LEI 13.709/2018), ECA (LEI 8.069/1990) E LEI 14.811/2024',
    alunos: obterAlunosLocal(),
    pareceres: obterPareceresLocal(),
    encaminhamentos: obterEncaminhamentosLocal(),
    auditoria: obterLogsAuditoriaLGPD()
  };

  const blob = new Blob([JSON.stringify(pacote, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `sisccd_ifs_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  registrarLogAuditoriaLGPD(estadoApp.professorLogado, 'EXPORTACAO_BACKUP_JSON', 'Exportou backup administrativo dos dados do conselho.');
}

// ============================================================================
// UTILITÁRIOS
// ============================================================================

function obterIniciaisNome(nome) {
  const partes = (nome || 'AL').replace(/\[.*?\]/g, '').trim().split(/\s+/);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function escaparHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function mostrarToast(mensagem, isErro = false) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast-msg';
  if (isErro) el.style.borderLeftColor = '#ef4444';
  el.textContent = mensagem;
  container.appendChild(el);
  setTimeout(() => {
    el.remove();
  }, 4500);
}
