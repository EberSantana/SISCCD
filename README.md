# 🚀 SISCCD — Sistema de Conselho de Classe Digital
**Sistema de Gestão de Conselho de Classe com Blindagem LGPD & ECA Digital para a Rede Federal de Ensino Médio Técnico**

---

## 🔄 Ciclo de Desenvolvimento de Software (SDLC)

O ciclo de desenvolvimento do **SISCCD** foi desenhado sob uma abordagem de **Privacy by Design** e **Security by Design**, garantindo conformidade estrita com a **LGPD (Lei nº 13.709/2018)** e o **ECA Digital (Proteção Integral de Adolescentes de 14 a 17 anos)**, além de atender às especificidades pedagógicas dos Institutos Federais.

### 1. Concepção & Alinhamento Legal (Discovery)
* **Mapeamento de Processos Pedagógicos:** Levantamento dos fluxos tradicionais de conselho de classe no ensino médio integrado e técnico.
* **Análise de Conformidade Regulatória:** Definição dos parâmetros legais exigidos pela LGPD (tratamento de dados pessoais sensíveis de menores) e pelas diretrizes do ECA Digital.
* **Definição de Stakeholders:** Envolvimento de equipes pedagógicas, coordenações de ensino, núcleos de tecnologia da informação e encarregados de dados (DPO) da instituição federal.

### 2. Modelagem & Requisitos de Privacidade (Privacy by Design)
* **RIPD (Relatório de Impacto à Proteção de Dados):** Elaboração prévia da matriz de risco e mapeamento do ciclo de vida dos dados dos discentes (14 a 17 anos).
* **Minimização de Dados:** Estruturação para que apenas os dados estritamente necessários para a tomada de decisão pedagógica fiquem visíveis aos membros do conselho.
* **Termos de Consentimento e Transparência:** Modelagem de avisos de privacidade claros e adequados à compreensão dos responsáveis e dos próprios adolescentes.

### 3. Arquitetura & Desenvolvimento (Build)
* **Arquitetura Segura:** Separação estrita de ambientes (Desenvolvimento, Homologação e Produção) com criptografia de ponta a ponta (em trânsito e em repouso).
* **Módulos Integrados:**
  * **Módulo de Governança:** Controle granular de acesso baseado em papéis (RBAC) e trilha de auditoria imutável (*Audit Trail*).
  * **Módulo Pedagógico:** Diário de bordo digital, cruzamento de desempenho acadêmico e eixos tecnológicos.
  * **Canal Seguro de Escuta:** Mecanismos de participação protegida para os estudantes.
* **Stack Tecnológica:** Desenvolvimento modular escalável (Backend robusto, Frontend responsivo com foco em acessibilidade e banco de dados isolado institucionalmente).

### 4. Testes de Segurança & Auditoria (Quality Assurance)
* **Testes de Vulnerabilidade (Pentest):** Varreduras automatizadas e manuais em busca de falhas de injeção, vazamento de sessão ou escalação de privilégios.
* **Simulação de Incidentes:** Validação dos protocolos de resposta a incidentes de segurança da informação exigidos pela ANPD.
* **Validação Pedagógica:** Homologação com docentes e coordenadores para garantir fluidez e eficácia na tomada de decisão durante o conselho.

### 5. Implantação & Homologação (Deployment)
* **Infraestrutura Soberana/Institucional:** Hospedagem em servidores próprios da rede federal ou nuvem governamental e em conformidade com as diretrizes do SISP.
* **Treinamento e Capacitação:** Oficinas práticas com os conselheiros de classe sobre o uso seguro da ferramenta e o sigilo legal dos dados.
* **Lançamento Piloto:** Inicialização controlada em um campus ou curso técnico específico para aferição de métricas de desempenho e usabilidade.

### 6. Operação Contínua, Monitoramento & Melhoria (Run & Governance)
* **Revisão Periódica de Acessos:** Auditorias trimestrais de permissões de usuários no sistema.
* **Ouvidoria de Privacidade:** Canal direto para dúvidas, revogação de consentimento ou exercício de direitos dos titulares (LGPD, Art. 18).
* **Ciclos de Atualização (CI/CD):** Atualizações contínuas de segurança, patches e melhorias baseadas no feedback da comunidade acadêmica.

---

## ✨ Funcionalidades Principais do SISCCD

1. **🚨 Identificação Imediata de "Quem São os Alunos a Serem Avaliados":**
   - Painel e filtro de **Prioridade de Plenária** que destaca automaticamente os estudantes sinalizados pelos professores com rendimento crítico, infrequência ou pedido expresso de análise em reunião.
   - Ordenação automática por **Score de Prioridade Pedagógica** (alunos com alertas em mais disciplinas aparecem no topo da fila do conselho).
2. **📸 Cards de Alunos com Foto e Compressão Automática:**
   - Upload de foto via câmera do celular ou computador com **recorte quadrado 1:1 e compressão automática no navegador (`220x220px WebP/JPEG`)**, permitindo salvar diretamente no banco privado sem pesar.
   - Importação rápida de turmas inteiras via copiar-e-colar do SUAP/CSV.
3. **✍️ Ficha Interativa ao Clicar no Aluno:**
   - **Aba 1 (Registrar Meu Parecer):** Reconhece automaticamente o professor logado e sugere sua disciplina naquela turma; permite marcar indicadores rápidos (Rendimento, Frequência, Participação/Postura), tags de diagnóstico, nota, faltas e observação ética padronizada.
   - **Aba 2 (Visão Consolidada da Turma):** Exibe em tempo real todos os pareceres de todos os professores sobre aquele aluno.
   - **Aba 3 (Encaminhamentos e Ata):** Permite registrar convocação dos responsáveis legais (pais/mães), encaminhamento ao NAPNE, Psicologia/Assistência Estudantil, Monitoria e texto oficial da Ata.
4. **🖥️ Modo Plenária (Passador de Alunos ◀ ▶):**
   - Durante a reunião do conselho, permite navegar de um aluno prioritário para o próximo com 1 clique, sem precisar fechar a janela.

---

## ⚖️ Blindagem Técnica Implementada (LGPD + ECA + ECA Digital)

* **Zero Dados Pessoais no GitHub Pages (`.gitignore` blindado):** Nenhum nome real ou foto de estudante real é versionado no repositório público. Os dados reais ficam restritos à Planilha/Banco Privado Institucional via requisição `POST` autenticada.
* **Gatekeeper com Termo de Sigilo Obrigatório:** O acesso só é liberado após seleção do docente, validação de **PIN individual** e assinatura digital do **Termo de Confidencialidade e Sigilo Funcional (Art. 14 e 23 da LGPD / Art. 17 e 18 do ECA / Res. CONANDA nº 245/2024)**.
* **Marca d'Água Dinâmica Anti-Print:** Toda a tela exibe uma marca d'água diagonal com o nome do professor logado, data e aviso de proibição de reprodução.
* **Modo Projetor / Privacidade (`👁️ Desfocar Fotos`):** Com 1 clique no topo, desfoca as fotos dos alunos e abrevia os sobrenomes quando a tela estiver sendo projetada em sala.
* **Bloqueio de Clique Direito e Auto-Lock:** Impede salvar imagem com botão direito e bloqueia a sessão automaticamente após 15 minutos de inatividade.
* **Trilha de Auditoria Completa (`Auditoria_LGPD`):** Registra quem acessou, quem assinou o termo e quais fichas foram avaliadas ou editadas.

---

## 📂 Estrutura do Repositório

```text
├── index.html                           # Interface principal (Gatekeeper LGPD/ECA, Mural de Fotos e Modais)
├── styles.css                           # Estilos responsivos, marca d'água anti-print e modo projetor
├── app.js                               # Lógica de pareceres, fila de prioridades, modo plenária e ata
├── api.js                               # Compressão de fotos, auditoria LGPD e sincronização segura
├── manifest.json                        # Manifesto PWA instalável
├── sw.js                                # Service Worker seguro (cache apenas da casca estática)
├── backend/
│   ├── Code.gs                          # Backend Google Apps Script com LockService e validação de PIN
│   └── INSTRUCOES_LGPD_E_PLANILHA.md    # Guia passo a passo de configuração da nuvem privada
└── README.md                            # Documentação oficial e Ciclo de Desenvolvimento (SDLC)
```
