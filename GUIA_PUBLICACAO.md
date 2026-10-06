# Manual de Publicação e Configuração · Gab Studio

Este guia detalha o passo a passo completo para colocar o site do **Gab Studio | Especialista em Cílios** em produção com todas as integrações.

---

## 1. Como Criar o Projeto no Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/) com a sua conta Google.
2. Clique em **"Adicionar projeto"** e dê o nome: `gab-studio-cilios`.
3. Desative ou ative o Google Analytics (opcional) e clique em **"Criar projeto"**.
4. No menu lateral esquerdo, vá em **Criação**:
   - **Authentication**:
     - Clique em "Começar".
     - Na aba "Método de login", ative **E-mail/senha**.
     - Na aba "Users", clique em "Adicionar usuário" e cadastre o login da Gab:
       - **E-mail:** `gab@gabstudio.com.br`
       - **Senha:** escolha uma senha forte.
   - **Firestore Database**:
     - Clique em "Criar banco de dados".
     - Escolha a localização mais próxima (`southamerica-east1` - São Paulo).
     - Escolha o modo de produção.
     - Na aba "Regras", copie e cole o conteúdo do arquivo `firestore.rules` deste projeto e clique em "Publicar".
5. Registre o aplicativo web:
   - Na página inicial do projeto, clique no ícone web `</>`.
   - Dê o apelido "Gab Studio Web".
   - Copie os valores do objeto `firebaseConfig` para as variáveis no arquivo `.env` (conforme modelo em `.env.example`).

---

## 2. Como Obter as Credenciais do Mercado Pago

1. Acesse o [Mercado Pago Developers](https://www.mercadopago.com.br/developers).
2. Faça login na conta comercial da Gab Santos.
3. Acesse **"Suas integrações"** > **"Criar aplicação"**:
   - Nome: `Gab Studio Agendamentos`
   - Tipo de pagamento: Pagamentos online.
4. Clique na aplicação criada e vá para **"Credenciais de produção"**:
   - Copie a **Public Key** (`APP_USR-...`) para o arquivo `.env`.
   - Copie o **Access Token** (`APP_USR-...`) para a variável de ambiente segura das Cloud Functions (ou backend).
   - **ATENÇÃO:** O Access Token nunca deve ser exposto no código público do front-end.

---

## 3. Como Configurar o Webhook do Mercado Pago

1. No painel de desenvolvedores do Mercado Pago, vá até a aba **Webhooks** ou **Notificações IPN**.
2. No campo **URL de notificação**, insira a URL da sua Cloud Function:
   `https://<sua-regiao>-<seu-projeto-firebase>.cloudfunctions.net/mercadopagoWebhook`
3. Em eventos notificados, marque:
   - `Pagamentos (Payments)`
4. Clique em **Salvar**. A partir de agora, qualquer pagamento via Pix ou Cartão atualizará o status do agendamento automaticamente para `"confirmado"` e `"pago"`.

---

## 4. Como Publicar o Backend (Firebase Cloud Functions)

1. Instale a CLI do Firebase na sua máquina (caso não tenha):
   ```bash
   npm install -g firebase-tools
   ```
2. Faça login:
   ```bash
   firebase login
   ```
3. Inicialize o projeto apontando para o seu projeto criado:
   ```bash
   firebase use --add
   ```
4. Configure a chave secreta do Mercado Pago nas Cloud Functions:
   ```bash
   firebase functions:config:set mercadopago.token="SEU_MERCADO_PAGO_ACCESS_TOKEN"
   ```
5. Faça o deploy das funções e regras:
   ```bash
   firebase deploy --only functions,firestore:rules
   ```

---

## 5. Como Trocar Fotos, Preços e Número de WhatsApp

Você tem duas formas muito simples:

### Opção A: Pelo Próprio Painel da Gab no Site (Sem mexer em código!)
1. No site, clique no ícone de escudo no topo direito (ou no rodapé em "Acesso Restrito da Gab").
2. Faça login (padrão: `gab@gabstudio.com.br` / `cilios123`).
3. Vá na aba **"Serviços & Preços"**: altere o valor de qualquer procedimento (ex: Fio a Fio para R$ 170,00) ou duração com um clique.
4. Vá na aba **"Horários & Folgas"**: defina se atende das 09h às 19h, dias da semana e horário de almoço.
5. Vá na aba **"Configurações"**: altere a porcentagem do sinal (ex: 30% ou 50%), número de WhatsApp, Instagram e endereço. Salve com um clique!

### Opção B: No Código Fonte
- **Número do WhatsApp e Dados do Estúdio:** Edite em `src/services/storage.ts` dentro do objeto `DEFAULT_SETTINGS`.
- **Serviços e Valores Iniciais:** Edite em `src/services/storage.ts` dentro da lista `DEFAULT_SERVICES`.
- **Fotos:** As imagens ficam localizadas em `src/assets/images/`. Para trocar, basta substituir os arquivos ou mudar o link no painel.

---

## 6. Como Publicar o Site na Web

### Publicação no Firebase Hosting:
```bash
npm run build
firebase init hosting # selecione a pasta 'dist' e configure como SPA (Yes)
firebase deploy --only hosting
```

### Ou publicação na Vercel / Netlify / Cloud Run:
- Conecte o repositório GitHub.
- Comando de build: `npm run build`
- Pasta de saída: `dist`
- Adicione as variáveis de ambiente listadas no `.env.example`.

Pronto! O estúdio da Gab estará no ar recebendo agendamentos e sinais de pagamento 24 horas por dia.
