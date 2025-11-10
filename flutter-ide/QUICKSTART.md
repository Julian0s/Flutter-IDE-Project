# 🚀 Quick Start - Flutter IDE

## ✅ O que já está configurado:

- ✅ Projeto Tauri criado
- ✅ Firebase SDK instalado
- ✅ Credenciais do Firebase configuradas (`.env.local`)
- ✅ Sistema de autenticação implementado
- ✅ Web App criado no Firebase

## 📋 Último passo necessário (VOCÊ precisa fazer):

### Habilitar Authentication Providers

**Acesse:** https://console.firebase.google.com/project/flutter-ide-project/authentication/providers

1. **Se for a primeira vez:**
   - Clique em "Get Started"

2. **Habilitar Google:**
   - Clique em "Google"
   - Toggle para "Enabled"
   - Email de suporte: `alexandrefeltzpro@gmail.com`
   - Salvar

3. **Habilitar GitHub:**
   - Clique em "GitHub"
   - Toggle para "Enabled"
   - **Você precisará criar um GitHub OAuth App:**
     - Vá em: https://github.com/settings/developers
     - Clique "New OAuth App"
     - Preencha:
       - **Application name**: Flutter IDE (Development)
       - **Homepage URL**: `http://localhost:1420`
       - **Authorization callback URL**: `https://flutter-ide-project.firebaseapp.com/__/auth/handler`
     - Copie o **Client ID** e **Client Secret**
     - Cole no Firebase Console → GitHub provider
   - Salvar

## 🏃 Rodar a Aplicação

```bash
npm run dev
```

**Nota**: A primeira compilação do Tauri demora ~2-5 minutos (compilando Rust).

## 🎯 O que você verá:

1. Aplicação abre com tela de login
2. Botões para login com Google e GitHub
3. Após login, tela principal com seu nome

## 🐛 Troubleshooting

### "Rust not found" ou erro de compilação
- Feche e reabra o terminal (PATH do Rust precisa ser atualizado)
- Ou rode: `refreshenv` (se tiver chocolatey)

### Erro de autenticação
- Verifique se habilitou os providers no Firebase Console
- Limpe cache do navegador

### Porta em uso
- O Tauri usa porta `1420` por padrão
- Se estiver em uso, ele escolhe outra automaticamente

## 📖 Próximos passos (depois que funcionar):

1. Integrar Monaco Editor
2. Implementar Flutter Daemon
3. Adicionar preview em tempo real
4. Integrar Claude AI

---

**Status atual:** ✅ Login pronto para testar!
