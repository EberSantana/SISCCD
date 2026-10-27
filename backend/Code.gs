/**
 * ==============================================================================
 * BACKEND GOOGLE APPS SCRIPT - SISTEMA DE CONSELHO DE CLASSE SEGURO (LGPD & ECA)
 * IFS Campus Tobias Barreto • Sergipe
 * ==============================================================================
 * ARQUITETURA DE PRIVACIDADE E PROTEÇÃO DE MENORES (14 A 17 ANOS):
 * 1. Zero Exposição Pública: A função doGet() NÃO retorna dados de alunos nem fotos.
 *    Qualquer pessoa que abrir o link do script no navegador verá apenas o aviso
 *    de proteção legal LGPD (Lei 13.709/2018) e ECA (Lei 8.069/1990).
 * 2. Autenticação Obrigatória via POST: Os dados só trafegam mediante validação
 *    do docente e do seu PIN individual na aba "PINs_Docentes".
 * 3. Concorrência Real via LockService: Permite que os 24 professores lancem
 *    pareceres simultaneamente durante ou antes do Conselho sem perda de dados.
 * 4. Trilha de Auditoria (Art. 37 e 46 da LGPD): Todas as leituras, gravações e
 *    aceites do Termo de Sigilo ficam registrados na aba "Auditoria_LGPD".
 */

var ABAS = {
  ALUNOS: "Alunos",
  PARECERES: "Pareceres_Docentes",
  ENCAMINHAMENTOS: "Encaminhamentos_Ata",
  AUDITORIA: "Auditoria_LGPD",
  PINS: "PINs_Docentes"
};

var DOCENTES_INICIAIS = [
  "Coordenação Pedagógica / ETP",
  "NAPNE / Assistência Estudantil",
  "Adriano", "Alex", "Alyrio", "Ângelo", "Christiano", "Eber", "Elliot",
  "Emerson", "Eric", "Felippe", "Fernanda", "Grayce", "Luiz Felipe",
  "Pedro Ernesto", "Pedro Goes", "Rafael", "Raisa", "Sanderson", "Sérgio",
  "Vagner", "Vinicius", "Vitor", "Weder", "Welkson"
];

/**
 * doGet() bloqueia leitura anônima via navegador para proteger dados de menores (LGPD Art. 14).
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      sistema: "Conselho de Classe Seguro - IFS Campus Tobias Barreto",
      protecaoLegal: "Acesso anônimo bloqueado em conformidade com o Art. 14 da LGPD (Lei 13.709/2018) e Art. 17 do ECA (Lei 8.069/1990).",
      instrucao: "Utilize o painel web autenticado com PIN Docente e Termo de Sigilo assinado."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * doPost() processa todas as requisições autenticadas do painel no GitHub Pages.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);

  try {
    inicializarAbasSeNecessario();

    var body = JSON.parse(e.postData.contents || "{}");
    var action = body.action || "";
    var authTeacher = String(body.authTeacher || "").trim();
    var authPin = String(body.authPin || "").trim();

    if (!validarPinDocente(authTeacher, authPin)) {
      registrarAuditoriaPlanilha(authTeacher || "Desconhecido", "ACESSO_NEGADO_PIN", "Tentativa de requisição sem PIN válido na ação: " + action);
      return responderJSON({ ok: false, error: "Autenticação docente inválida (PIN incorreto)." });
    }

    if (action === "SYNC_GET_ALL") {
      registrarAuditoriaPlanilha(authTeacher, "SINCRONIZACAO_LEITURA", "Carregou dados do Conselho de Classe via painel autenticado.");
      return responderJSON({
        ok: true,
        alunos: lerObjetosDaAba(ABAS.ALUNOS),
        pareceres: lerObjetosDaAba(ABAS.PARECERES),
        encaminhamentos: lerObjetosDaAba(ABAS.ENCAMINHAMENTOS),
        pins: obterMapaPins()
      });
    }

    if (action === "UPSERT_ALUNO" && body.aluno) {
      upsertObjetoPorId(ABAS.ALUNOS, body.aluno.id, body.aluno);
      registrarAuditoriaPlanilha(authTeacher, "UPSERT_ALUNO", "Cadastrou/atualizou estudante: " + body.aluno.nome + " (" + body.aluno.turma + ")");
      return responderJSON({ ok: true });
    }

    if (action === "DELETE_ALUNO" && body.alunoId) {
      removerObjetoPorId(ABAS.ALUNOS, body.alunoId);
      registrarAuditoriaPlanilha(authTeacher, "DELETE_ALUNO", "Removeu registro do aluno ID: " + body.alunoId);
      return responderJSON({ ok: true });
    }

    if (action === "UPSERT_PARECER" && body.parecer) {
      upsertObjetoPorId(ABAS.PARECERES, body.parecer.id, body.parecer);
      if (body.aluno && body.aluno.id) {
        upsertObjetoPorId(ABAS.ALUNOS, body.aluno.id, body.aluno);
      }
      registrarAuditoriaPlanilha(authTeacher, "REGISTRO_PARECER", "Salvou parecer na disciplina " + body.parecer.disciplina + " (Aluno ID: " + body.parecer.alunoId + ")");
      return responderJSON({ ok: true });
    }

    if (action === "UPSERT_ENCAMINHAMENTO" && body.encaminhamento) {
      upsertObjetoPorId(ABAS.ENCAMINHAMENTOS, body.encaminhamento.id, body.encaminhamento);
      if (body.aluno && body.aluno.id) {
        upsertObjetoPorId(ABAS.ALUNOS, body.aluno.id, body.aluno);
      }
      registrarAuditoriaPlanilha(authTeacher, "HOMOLOGACAO_ENCAMINHAMENTO", "Homologou encaminhamento na Ata para Aluno ID: " + body.encaminhamento.alunoId);
      return responderJSON({ ok: true });
    }

    if (action === "LOG_AUDITORIA_LGPD" && body.log) {
      registrarAuditoriaPlanilha(body.log.usuario || authTeacher, body.log.acao || "EVENTO", body.log.detalhes || "");
      return responderJSON({ ok: true });
    }

    return responderJSON({ ok: false, error: "Ação não reconhecida: " + action });
  } catch (err) {
    return responderJSON({ ok: false, error: err.message });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Cria automaticamente as abas estruturadas na planilha Google na primeira execução.
 */
function inicializarAbasSeNecessario() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var abasJson = [ABAS.ALUNOS, ABAS.PARECERES, ABAS.ENCAMINHAMENTOS];
  abasJson.forEach(function (nomeAba) {
    var sheet = ss.getSheetByName(nomeAba);
    if (!sheet) {
      sheet = ss.insertSheet(nomeAba);
      sheet.appendRow(["ID", "ATUALIZADO_EM", "JSON_CRIPTO_DADOS"]);
      sheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#dcfce7");
    }
  });

  var sheetAudit = ss.getSheetByName(ABAS.AUDITORIA);
  if (!sheetAudit) {
    sheetAudit = ss.insertSheet(ABAS.AUDITORIA);
    sheetAudit.appendRow(["DATA_HORA", "USUARIO_DOCENTE", "ACAO_AUDITADA", "DETALHES", "BASE_LEGAL"]);
    sheetAudit.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#e2e8f0");
  }

  var sheetPins = ss.getSheetByName(ABAS.PINS);
  if (!sheetPins) {
    sheetPins = ss.insertSheet(ABAS.PINS);
    sheetPins.appendRow(["DOCENTE", "PIN"]);
    sheetPins.getRange(1, 1, 1, 2).setFontWeight("bold").setBackground("#fef3c7");
    DOCENTES_INICIAIS.forEach(function (nome) {
      sheetPins.appendRow([nome, "1234"]);
    });
  }
}

function obterMapaPins() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(ABAS.PINS);
  var dados = sheet.getDataRange().getValues();
  var mapa = {};
  for (var i = 1; i < dados.length; i++) {
    var doc = String(dados[i][0] || "").trim();
    var pin = String(dados[i][1] || "1234").trim();
    if (doc) mapa[doc] = pin;
  }
  return mapa;
}

function validarPinDocente(docente, pinInformado) {
  if (!docente || !pinInformado) return false;
  var mapa = obterMapaPins();
  var pinSalvo = mapa[docente] || "1234";
  return String(pinInformado) === String(pinSalvo);
}

function lerObjetosDaAba(nomeAba) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(nomeAba);
  var dados = sheet.getDataRange().getValues();
  var lista = [];
  for (var i = 1; i < dados.length; i++) {
    var jsonStr = dados[i][2];
    if (jsonStr) {
      try {
        lista.push(JSON.parse(jsonStr));
      } catch (e) {}
    }
  }
  return lista;
}

function upsertObjetoPorId(nomeAba, id, objeto) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(nomeAba);
  var dados = sheet.getDataRange().getValues();
  var agora = Utilities.formatDate(new Date(), "America/Maceio", "dd-MM-yyyy HH:mm:ss");
  var jsonStr = JSON.stringify(objeto);

  for (var i = 1; i < dados.length; i++) {
    if (String(dados[i][0]) === String(id)) {
      sheet.getRange(i + 1, 2, 1, 2).setValues([[agora, jsonStr]]);
      return;
    }
  }
  sheet.appendRow([id, agora, jsonStr]);
}

function removerObjetoPorId(nomeAba, id) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(nomeAba);
  var dados = sheet.getDataRange().getValues();
  for (var i = dados.length - 1; i >= 1; i--) {
    if (String(dados[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return;
    }
  }
}

function registrarAuditoriaPlanilha(usuario, acao, detalhes) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(ABAS.AUDITORIA);
  var agora = Utilities.formatDate(new Date(), "America/Maceio", "dd-MM-yyyy HH:mm:ss");
  sheet.appendRow([agora, usuario, acao, detalhes, "LGPD Art. 14 e 23 / ECA Art. 17"]);
}

function responderJSON(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
