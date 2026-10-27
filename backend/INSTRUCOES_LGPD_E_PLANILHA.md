# 🛡️ Guia Passo a Passo: Planilha Privada Google + Respaldo LGPD & ECA Digital

Este documento explica como conectar o **Sistema de Conselho de Classe** a uma **Planilha Privada do Google Drive** para que **nenhum dado ou foto de adolescente (14 a 17 anos)** fique exposto no repositório público do GitHub Pages.

---

## 1️⃣ Por que esta Arquitetura protege você e a Instituição (LGPD + ECA)?

Quando você publica um site no **GitHub Pages**, o código-fonte do repositório é público. Se alguém colocasse fotos (`aluno1.jpg`) ou uma lista de nomes reais dentro da pasta do GitHub, qualquer pessoa na internet poderia acessar esses arquivos — o que violaria o **Art. 14 da LGPD (Lei nº 13.709/2018)** e o **Art. 17 do ECA (Lei nº 8.069/1990)**.

Com a arquitetura implementada neste projeto:
1. **No GitHub Pages fica apenas a "casca" do sistema** (`index.html`, `styles.css`, `app.js`, `api.js`), sem nenhum nome ou foto de aluno real.
2. **Os dados reais e as fotos comprimidas ficam na sua Planilha Google Privada**, que só libera leitura ou gravação via requisição `POST` autenticada com o **PIN do Professor** e assinatura do **Termo de Sigilo Funcional**.
3. **Mesmo que alguém descubra a URL do seu Google Apps Script e cole no navegador (`GET`)**, o servidor bloqueia a leitura e exibe apenas o aviso legal de proteção LGPD/ECA.

---

## 2️⃣ Passo a Passo para Configurar a Planilha Privada (5 Minutos)

1. Acesse o [Google Sheets](https://sheets.google.com) com sua conta institucional ou Google Drive privado.
2. Crie uma **Planilha em Branco** e dê o nome: `BD_Conselho_de_Classe_IFS_Privado`.
   > ⚠️ **Importante:** Mantenha o compartilhamento da planilha como **Restrito** (Apenas você). Você **não** precisa deixar a planilha pública!
3. No menu superior da planilha, clique em **Extensões** > **Apps Script**.
4. Apague qualquer código existente no editor e cole todo o conteúdo do arquivo [`backend/Code.gs`](./Code.gs).
5. Clique no ícone de **Salvar (Disquete)** e depois clique em **Implantar (Deploy)** > **Nova implantação**.
6. Clique na engrenagem ao lado de "Selecionar tipo" e escolha **App da Web (Web App)**:
   - **Descrição:** `API Segura Conselho de Classe LGPD`
   - **Executar como:** `Eu` (seu e-mail)
   - **Quem pode acessar:** `Qualquer pessoa` *(Isso permite que o GitHub Pages envie a requisição POST sem bloqueio de CORS, mas o `Code.gs` exige o PIN Docente válido para devolver ou gravar qualquer dado!)*
7. Clique em **Implantar**, autorize o script na sua conta e **copie a URL do App da Web** gerada (terminada em `/exec`).
8. Abra o seu sistema de Conselho de Classe, faça login (PIN inicial `1234`), clique em **⚙️ Planilha / Nuvem Privada** no topo, cole a URL copiada e clique em **💾 Salvar Configurações**.
9. Clique em **🧹 Limpar Perfis [DEMO]** para remover os alunos fictícios de teste e começar a cadastrar/importar as turmas reais!

---

## 3️⃣ Alteração de PINs Individuais dos Professores

Na primeira vez que o script rodar, ele criará automaticamente na sua planilha as abas:
- `Alunos`
- `Pareceres_Docentes`
- `Encaminhamentos_Ata`
- `Auditoria_LGPD`
- `PINs_Docentes`

Na aba `PINs_Docentes`, você pode definir um PIN exclusivo para cada um dos 24 professores e para a Coordenação Pedagógica.
