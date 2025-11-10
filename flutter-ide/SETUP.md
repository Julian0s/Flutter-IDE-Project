# Setup do Flutter IDE

## Passo 1: Configurar Firebase

### 1.1 Obter Credenciais do Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/project/flutter-ide-project)
2. Vá em **Project Settings** (ícone de engrenagem)
3. Role até a seção **"Your apps"**
4. Clique no ícone **Web** (`</>`) para adicionar um app web
5. Dê um nome para o app: **Flutter IDE**
6. **NÃO** marque "Firebase Hosting"
7. Clique em **Register app**
8. Copie todo o objeto `firebaseConfig`

### 1.2 Criar arquivo `.env.local`

1. Copie o arquivo `.env.local.example` para `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Abra `.env.local` e preencha com as credenciais do Firebase:
   ```env
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=flutter-ide-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=flutter-ide-project
   VITE_FIREBASE_STORAGE_BUCKET=flutter-ide-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=1021...
   VITE_FIREBASE_APP_ID=1:1021...
   ```

### 1.3 Habilitar Authentication

1. No Firebase Console, vá em **Authentication**
2. Clique em **Get Started**
3. Habilite os seguintes providers:
   - **Google**
   - **GitHub**

#### Configurar Google OAuth
1. Clique em **Google** na lista de providers
2. Habilite o provider
3. Escolha um email de suporte
4. Salve

#### Configurar GitHub OAuth
1. Vá em https://github.com/settings/developers
2. Clique em **New OAuth App**
3. Preencha:
   - **Application name**: Flutter IDE (Development)
   - **Homepage URL**: `http://localhost:1420`
   - **Authorization callback URL**: `https://flutter-ide-project.firebaseapp.com/__/auth/handler`
4. Copie o **Client ID** e **Client Secret**
5. Volte ao Firebase Console → Authentication → GitHub
6. Cole o Client ID e Client Secret
7. Copie a URL de callback e adicione no GitHub OAuth App
8. Salve

## Passo 2: Instalar Dependências

```bash
npm install
```

## Passo 3: Rodar o Projeto

```bash
npm run tauri dev
```

## Troubleshooting

### Erro: "Rust not found"
- Certifique-se que o Rust está instalado: https://rustup.rs/
- Adicione o Rust ao PATH: `C:\Users\{SEU_USUARIO}\.cargo\bin`

### Erro: "Firebase environment variables missing"
- Verifique se o arquivo `.env.local` existe
- Verifique se todas as variáveis estão preenchidas
- Reinicie o servidor de desenvolvimento

### Erro de autenticação
- Verifique se os providers (Google/GitHub) estão habilitados no Firebase Console
- Verifique se as URLs de callback estão configuradas corretamente
- Limpe o cache do navegador e tente novamente
