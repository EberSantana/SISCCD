# 🚀 SISCCD — Sistema de Conselho de Classe Digital
**Sistema de Gestão de Conselho de Classe com Blindagem LGPD & ECA Digital para a Rede Federal de Ensino Médio Técnico**

🌐 **Acesso Produção (GitHub Pages):** [https://ebersantana.github.io/SISCCD/](https://ebersantana.github.io/SISCCD/)

---

## ⚖️ Matriz de Adequação às 6 Leis Vigentes de Proteção Infantojuvenil (14 a 17 anos)

O **SISCCD** implementa controles técnicos de código (*Privacy by Design* e *Security by Design*) para atender integralmente às 6 legislações que regem o tratamento de dados, a imagem e a dignidade de adolescentes no Brasil:

| Legislação | Exigência Legal Principal | Como o SISCCD Implementa no Código |
| :--- | :--- | :--- |
| **1. ECA Digital (Lei nº 15.211/2025)** *(Em vigor desde março/2026)* | Proíbe a simples autodeclaração de idade, exige vinculação de menores de 16 anos aos pais/responsáveis, veda perfilamento comercial e protege contra conteúdos perigosos e automutilação. | • **Vedação de Autodeclaração Etária:** O sistema não possui auto-cadastro livre por alunos; a idade é aferida via documentação oficial da matrícula SUAP (`verificacaoEtariaSUAP`).<br/>• **Vinculação Parental Obrigatória (< 16 anos):** Para estudantes de **14 e 15 anos**, o formulário exige obrigatoriamente o nome e contato do Pai/Mãe ou Responsável Legal vinculado ([`verificarRegraMenor16Cadastro`](app.js)).<br/>• **Zero Perfilamento Comercial:** Zero cookies de terceiros, zero publicidade e vedação de decisão automatizada sem revisão docente.<br/>• **Protocolo de Saúde Mental e Proteção à Vida:** Encaminhamento sigiloso imediato à Psicologia Escolar e Família. |
| **2. LGPD (Lei nº 13.709/2018 — Art. 14 e 18)** | O tratamento de dados de crianças e adolescentes deve ocorrer em seu *melhor interesse*, com consentimento específico e em destaque de pelo menos um dos pais ou responsável legal e direito à revogação. | • **Trava Técnica de Consentimento de Foto (`consentimentoImagemPais`):** Se o consentimento parental para uso de imagem não estiver ativo (ou for revogado com 1 clique pelo botão `🖼️ Consentimento Foto Art. 14`), a função [`obterFotoSeguraAluno`](app.js) **bloqueia automaticamente a foto real** e exibe apenas um Avatar Institucional Anonimizado com iniciais!<br/>• **Zero-PII no GitHub Pages:** Nenhum nome ou foto real fica no código público do GitHub; dados reais trafegam via `POST` autenticado com PIN para planilha institucional privada. |
| **3. Lei do Bullying e Cyberbullying (Lei nº 13.185/2015 e Lei nº 14.811/2024)** | Previne e combate a intimidação sistemática (*bullying* e *cyberbullying*) e veda a exposição humilhante ou estigmatizante no meio digital. | • **Validador Ético Anti-Rotulagem ([`validarLinguagemEticaParecer`](api.js)):** Analisa o texto do parecer em tempo real antes de salvar, bloqueando termos pejorativos/estigmatizantes e sugerindo redação técnica construtiva.<br/>• **Protocolo Anti-Bullying / Cyberbullying:** Ação específica nos encaminhamentos do conselho para mediação multiprofissional imediata. |
| **4. Estatuto da Criança e do Adolescente — ECA (Lei nº 8.069/1990)** | Assegura a proteção integral (Art. 1º), a inviolabilidade da imagem, identidade e autonomia (Art. 17), a dignidade (Art. 18) e a ciência dos pais no processo pedagógico (Art. 53). | • **Proteção de Imagem (Art. 17):** Bloqueio de botão direito/arraste em fotos, **Modo Projetor (`👁️ Desfocar Fotos`)** para reuniões em sala e **Marca d'Água Nominal Anti-Print** com o nome do docente logado.<br/>• **Participação Familiar (Art. 53):** Registro formal de convocação e ciência dos responsáveis legais na Ata. |
| **5. Constituição Federal de 1988 (Artigo 227)** | Dever da família, da sociedade e do Estado de assegurar ao adolescente, com **absoluta prioridade**, o direito à vida, à saúde, à educação, à dignidade e ao respeito. | • **Fila de Prioridade Absoluta ([`analisarSituacaoAluno`](app.js)):** Ordena automaticamente no topo da plenária os estudantes com alertas docentes de risco acadêmico, infrequência ou vulnerabilidade para ação protetiva imediata. |
| **6. Marco Civil da Internet (Lei nº 12.965/2014 — Art. 3º e 7º)** | Proteção da privacidade, inviolabilidade da intimidade, não fornecimento a terceiros e guarda auditável de registros de acesso a aplicações. | • **Trilha de Auditoria ([`registrarLogAuditoriaLGPD`](api.js)):** Registra todos os logins, aceites do Termo de Sigilo, consultas de fichas e alterações, com bloqueio automático de sessão após 15 minutos de inatividade. |

---

## 🔄 Ciclo de Desenvolvimento de Software (SDLC)

O ciclo de desenvolvimento do **SISCCD** foi desenhado sob uma abordagem de **Privacy by Design** e **Security by Design**, garantindo conformidade estrita com a **LGPD (Lei nº 13.709/2018)** e o **ECA Digital (Lei nº 15.211/2025 — Proteção Integral de Adolescentes de 14 a 17 anos)**, além de atender às especificidades pedagógicas dos Institutos Federais.

### 1. Concepção & Alinhamento Legal (Discovery)
* **Mapeamento de Processos Pedagógicos:** Levantamento dos fluxos tradicionais de conselho de classe no ensino médio integrado e técnico.
* **Análise de Conformidade Regulatória:** Definição dos parâmetros legais exigidos pela LGPD (tratamento de dados pessoais sensíveis de menores) e pelas diretrizes do ECA Digital (Lei nº 15.211/2025).
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

## 📂 Estrutura do Repositório

```text
├── index.html                           # Interface principal (Gatekeeper 6 Leis, Mural de Fotos e Modais)
├── styles.css                           # Estilos responsivos, marca d'água anti-print e modo projetor
├── app.js                               # Lógica de pareceres, vínculo parental <16 anos, bloqueio de foto sem consentimento
├── api.js                               # Validador ético anti-bullying, compressão de fotos e auditoria LGPD
├── manifest.json                        # Manifesto PWA instalável
├── sw.js                                # Service Worker seguro (cache apenas da casca estática)
├── backend/
│   ├── Code.gs                          # Backend Google Apps Script com LockService e validação de PIN
│   └── INSTRUCOES_LGPD_E_PLANILHA.md    # Guia passo a passo de configuração da nuvem privada
└── README.md                            # Documentação oficial, Matriz das 6 Leis e SDLC
```
