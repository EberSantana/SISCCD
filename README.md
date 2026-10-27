# 🎓 Sistema de Conselho de Classe Digital • IFS Campus Tobias Barreto
### 🛡️ Com Blindagem Jurídica e Técnica para Menores de 18 Anos (14 a 17 anos — LGPD, ECA e ECA Digital)

Sistema Web Mobile-First e PWA desenvolvido para o **Conselho de Classe do Ensino Médio Integrado (`1º DS`, `2º DS`, `3º DS`, `1º ADM`, `2º ADM`, `3º ADM`) e Subsequente** do Instituto Federal de Sergipe (Campus Tobias Barreto), pronto para publicação no **GitHub Pages** com arquitetura **Zero-PII (Zero Dados Reais no Repositório Público)**.

---

## ✨ Principais Funcionalidades

1. **🚨 Identificação Imediata de "Quem São os Alunos a Serem Avaliados":**
   - Painel e filtro de **Prioridade de Plenária** que destaca automaticamente os estudantes sinalizados pelos professores com rendimento crítico, infrequência ou pedido expresso de análise em reunião.
   - Ordenação automática por **Score de Prioridade Pedagógica** (alunos com alertas em mais disciplinas aparecem no topo da fila do conselho).
2. **📸 Cards de Alunos com Foto e Compressão Automática:**
   - Upload de foto via câmera do celular ou computador com **recorte quadrado 1:1 e compressão automática no navegador (`220x220px WebP/JPEG`)**, permitindo salvar diretamente na Planilha/Drive Privado sem pesar.
   - Importação rápida de turmas inteiras via copiar-e-colar do SUAP/CSV.
3. **✍️ Ficha Interativa ao Clicar no Aluno:**
   - **Aba 1 (Registrar Meu Parecer):** Reconhece automaticamente o professor logado e sugere sua disciplina naquela turma; permite marcar indicadores rápidos (Rendimento, Frequência, Participação/Postura), tags de diagnóstico, nota, faltas e observação ética padronizada.
   - **Aba 2 (Visão Consolidada da Turma):** Exibe em tempo real todos os pareceres de todos os professores sobre aquele aluno.
   - **Aba 3 (Encaminhamentos e Ata):** Permite registrar convocação dos responsáveis legais (pais/mães), encaminhamento ao NAPNE, Psicologia/Assistência Estudantil, Monitoria e texto oficial da Ata.
4. **🖥️ Modo Plenária (Passador de Alunos ◀ ▶):**
   - Durante a reunião do conselho, permite navegar de um aluno prioritário para o próximo com 1 clique, sem precisar fechar a janela.

---

## ⚖️ Respaldo Legal Implementado (LGPD + ECA + ECA Digital)

Para proteger juridicamente os docentes e a coordenação no tratamento de dados de adolescentes de **14 a 17 anos**:

* **Zero Dados Pessoais no GitHub Pages (`.gitignore` blindado):** Nenhum nome real ou foto de estudante real é versionado no GitHub. Os dados reais ficam restritos à Planilha Google Privada via `POST` autenticado.
* **Gatekeeper com Termo de Sigilo Obrigatório:** O acesso só é liberado após seleção do docente, validação de **PIN individual** e assinatura digital do **Termo de Confidencialidade e Sigilo Funcional (Art. 14 e 23 da LGPD / Art. 17 e 18 do ECA / Res. CONANDA nº 245/2024)**.
* **Marca d'Água Dinâmica Anti-Print:** Toda a tela exibe uma marca d'água diagonal com o nome do professor logado, data e aviso de proibição de reprodução, desencorajando capturas de tela ou fotos em grupos externos.
* **Modo Projetor / Privacidade (`👁️ Desfocar Fotos`):** Com 1 clique no topo, desfoca as fotos dos alunos e abrevia os sobrenomes para quando a tela estiver sendo projetada em sala.
* **Bloqueio de Clique Direito e Auto-Lock:** Impede salvar imagem com botão direito e bloqueia a sessão automaticamente após 15 minutos de inatividade.
* **Trilha de Auditoria Completa (`Auditoria_LGPD`):** Registra quem acessou, quem assinou o termo e quais fichas foram avaliadas ou editadas.

---

## 🚀 Como Publicar no GitHub Pages

1. Crie um novo repositório no seu GitHub (ex: `conselho-classe-ifs`).
2. Envie todos os arquivos desta pasta (`conselho-de-classe/`) para a branch `main`.
3. Em **Settings > Pages**, selecione a branch `main` e a pasta `/ (root)` e clique em **Save**.
4. Siga o guia [`backend/INSTRUCOES_LGPD_E_PLANILHA.md`](./backend/INSTRUCOES_LGPD_E_PLANILHA.md) para conectar sua Planilha Google Privada!
