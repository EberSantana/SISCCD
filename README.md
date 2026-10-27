# 🚀 SISCCD — Sistema de Conselho de Classe Digital
**Sistema de Gestão de Conselho de Classe com Blindagem LGPD & ECA Digital para a Rede Federal de Ensino Médio Técnico**

🌐 **Acesso em Produção (GitHub Pages):** [https://ebersantana.github.io/SISCCD/](https://ebersantana.github.io/SISCCD/)

---

## 📜 Marco Regulatório: As 6 Leis de Proteção Infantojuvenil (Adolescentes de 14 a 17 anos)

O **SISCCD** foi projetado para respaldar juridicamente docentes, coordenadores de curso, equipes técnico-pedagógicas e a instituição de ensino no tratamento de dados pessoais, acadêmicos e de imagem de adolescentes (14 a 17 anos), cumprindo rigorosamente as **6 legislações brasileiras aplicáveis**:

1. **ECA Digital (Lei nº 15.211/2025):** É a principal e mais recente legislação específica para o ambiente digital (em vigor desde março de 2026). Ela proíbe a simples autodeclaração de idade, exige a vinculação de contas/registros de menores de 16 anos aos pais ou responsáveis, veda a publicidade direcionada por perfilamento e o uso de *loot boxes* em jogos infantis, além de obrigar as plataformas a removerem conteúdos perigosos e protegerem contra exploração, violência e automutilação.
2. **Estatuto da Criança e do Adolescente — ECA (Lei nº 8.069/1990):** A base histórica da proteção infantojuvenil no Brasil, que assegura o princípio da proteção integral, a inviolabilidade da integridade física, psíquica e moral — abrangendo a preservação da imagem, da identidade, da autonomia, dos valores e da dignidade (Arts. 17 e 18) — e o direito dos pais ou responsáveis de terem ciência do processo pedagógico (Art. 53, parágrafo único).
3. **Constituição Federal de 1988 (Artigo 227):** Estabelece que é dever da família, da sociedade e do Estado assegurar à criança, ao adolescente e ao jovem, com **absoluta prioridade**, o direito à vida, à saúde, à alimentação, à educação, ao lazer, à profissionalização, à cultura, à dignidade, ao respeito, à liberdade e à convivência familiar e comunitária, além de colocá-los a salvo de toda forma de negligência, discriminação, exploração, violência, crueldade e opressão.
4. **Marco Civil da Internet (Lei nº 12.965/2014):** Estabelece princípios, garantias, direitos e deveres para o uso da internet no Brasil, com foco na proteção da privacidade, na inviolabilidade da intimidade e da vida privada, na proteção dos dados pessoais e na guarda segura de registros de acesso a aplicações (Arts. 3º e 7º).
5. **Lei Geral de Proteção de Dados Pessoais — LGPD (Lei nº 13.709/2018):** Possui um artigo específico (**Art. 14**) que determina que o tratamento de dados pessoais de crianças e adolescentes deve ser realizado em seu *melhor interesse*, exigindo o consentimento específico e em destaque dado por pelo menos um dos pais ou responsável legal, além de garantir o direito de revogação do consentimento a qualquer momento (**Art. 18**).
6. **Lei do Bullying e Cyberbullying (Lei nº 13.185/2015 / atualizada pela Lei nº 14.811/2024):** Combate a intimidação sistemática (*bullying* e *cyberbullying*), prevendo medidas de conscientização, prevenção, diagnose, combate e vedação de condutas humilhantes ou estigmatizantes no ambiente escolar e no meio digital.

---

## ⚖️ Como Cada Lei Foi Adequada no Código do SISCCD

### 1. ECA Digital (Lei nº 15.211/2025 — em vigor desde março de 2026)
* **Proibição da Simples Autodeclaração de Idade:** O sistema não possui auto-cadastro livre para estudantes; o registro de idade exige a **aferição documental via matrícula institucional SUAP** (Certidão/RG validado na secretaria escolar — campo `verificacaoEtariaSUAP`).
* **Vinculação Obrigatória de Menores de 16 Anos (14 e 15 anos) aos Pais/Responsáveis:** Nas funções [`verificarRegraMenor16Cadastro`](./app.js) e [`salvarCadastroAluno`](./app.js), sempre que o estudante tiver **menos de 16 anos (14 ou 15 anos)**, o sistema exibe o alerta da Lei nº 15.211/2025, bloqueia o salvamento se o nome do Pai/Mãe/Responsável Legal não for informado e disponibiliza um filtro dedicado (`🔒 Menores de 16 Anos • Lei 15.211/2025`).
* **Vedação de Perfilamento Comercial:** Zero cookies de terceiros, zero rastreadores publicitários e diagnóstico exclusivamente humano/pedagógico pelo colegiado.
* **Proteção à Saúde Mental e Prevenção à Automutilação/Violência:** Na aba de Encaminhamentos da ficha do aluno, foi criado o seletor **Protocolo de Proteção Integral (Lei 15.211/2025)** com encaminhamento prioritário e sigiloso à Psicologia/Assistência Estudantil e Ciência Familiar.

### 2. LGPD (Lei nº 13.709/2018 — Art. 14 e Art. 18)
* **Consentimento Parental Específico e em Destaque para Uso de Foto + Bloqueio Automático:**
  * Na função [`obterFotoSeguraAluno`](./app.js), se o estudante não possuir o **Termo de Consentimento Parental de Imagem (`consentimentoImagemPais`)** ativo — ou se os pais solicitarem a revogação (Art. 18 da LGPD) —, o sistema **bloqueia automaticamente a exibição da foto real** e exibe apenas um **Avatar Institucional Anonimizado com Iniciais** (`SEM CONSENTIMENTO FOTO - ART. 14`).
  * Na própria ficha do aluno, há o botão **`🖼️ Consentimento Foto (Art. 14)`** ([`alternarConsentimentoFotoAlunoAtual`](./app.js)) para ativar ou revogar a foto com 1 clique, registrando o ato na Trilha de Auditoria.
* **Arquitetura Zero-PII no GitHub Pages:** Nenhum nome real ou foto de menor fica exposto no código-fonte público do GitHub; os dados reais residem exclusivamente na Planilha/Drive Privado Institucional via requisição `POST` autenticada com PIN.

### 3. Lei do Bullying e Cyberbullying (Lei nº 13.185/2015 / Lei nº 14.811/2024)
* **Validador Ético Anti-Rotulagem em Tempo Real ([`validarLinguagemEticaParecer`](./api.js)):** Antes de salvar qualquer parecer docente, o sistema analisa o texto digitado para impedir o registro acidental de termos pejorativos, humilhantes ou estigmatizantes sobre o adolescente, sugerindo automaticamente uma redação técnica e construtiva.
* **Protocolo de Mediação Anti-Bullying / Cyberbullying:** Adicionado marcador específico de alerta de convivência/intimidação sistemática que eleva automaticamente o estudante para prioridade de acolhimento multiprofissional no conselho.

### 4. Estatuto da Criança e do Adolescente — ECA (Lei nº 8.069/1990 — Arts. 17, 18 e 53)
* **Inviolabilidade da Imagem e Dignidade (Arts. 17 e 18):** Bloqueio de botão direito/arraste nas fotos, **Modo Projetor (`👁️ Desfocar Fotos`)** para uso em reuniões plenárias e **Marca d'Água Dinâmica Anti-Print** com o nome do docente logado e data/hora.
* **Ciência dos Pais no Processo Pedagógico (Art. 53):** Registro formal na Ata do responsável legal vinculado e status de convocação familiar.

### 5. Constituição Federal de 1988 (Artigo 227)
* **Princípio da Prioridade Absoluta:** O algoritmo de fila da plenária ([`analisarSituacaoAluno`](./app.js)) prioriza automaticamente no topo da lista os adolescentes com risco de retenção, infrequência ou conflito de convivência para intervenção protetiva imediata da escola e da família.

### 6. Marco Civil da Internet (Lei nº 12.965/2014 — Arts. 3º e 7º)
* **Guarda Auditável de Registros de Acesso e Inviolabilidade da Intimidade:** Toda sessão exige autenticação por PIN + assinatura digital do Termo de Sigilo ([`registrarLogAuditoriaLGPD`](./api.js)), registrando data, hora, usuário e base legal na aba **`⚖️ Adequação às 6 Leis`**, além de encerrar e limpar a sessão automaticamente após 15 minutos de inatividade.

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
└── README.md                            # Documentação oficial, Adequação às 6 Leis e SDLC
```
