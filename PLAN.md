# Flutter IDE - Plano de Desenvolvimento

## 📋 Visão Geral do Projeto

Uma IDE exclusiva para desenvolvimento Flutter com integração de IA (Claude Code), preview em tempo real e funcionalidades avançadas de edição.

---

## 🛠️ Stack Tecnológica

### Backend
- **Tauri 2.0** - Framework desktop (Rust + WebView)
- **Rust** - Backend nativo para operações do sistema
- **Firebase** - Backend-as-a-Service
  - Authentication (Email/Password, Google, GitHub)
  - Firestore Database
  - Cloud Storage

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Zustand** - Gerenciamento de estado
- **Monaco Editor** - Editor de código (engine do VS Code)
- **CSS3** - Estilização

### Ferramentas de Desenvolvimento
- **Flutter SDK** - Para executar projetos Flutter
- **Git** - Controle de versão
- **npm/pnpm** - Gerenciador de pacotes

---

## 📦 Dependências Principais

### Rust (Cargo.toml)
```toml
tauri = "2"
tauri-plugin-opener = "2"
tauri-plugin-dialog = "2"
tauri-plugin-fs = "2"
serde = "1"
serde_json = "1"
lazy_static = "1.4"
```

### TypeScript (package.json)
```json
{
  "react": "^18.x",
  "zustand": "^4.x",
  "@monaco-editor/react": "^4.x",
  "firebase": "^10.x",
  "@tauri-apps/api": "^2.x"
}
```

---

## 🎯 Fases de Desenvolvimento

### ✅ FASE 1: Autenticação (CONCLUÍDA)
**Objetivo:** Sistema completo de login/registro com Firebase

**Implementado:**
- ✅ Configuração Firebase (Project: flutter-ide-project)
- ✅ Firebase Authentication setup
- ✅ Tela de Login/Registro com email/password
- ✅ Hook useAuth para gerenciar autenticação
- ✅ Proteção de rotas (AuthGuard)
- ✅ OAuth preparado para futuro (Google, GitHub)

**Arquivos:**
- `src/lib/firebase.ts`
- `src/hooks/useAuth.tsx`
- `src/components/Auth/LoginPage.tsx`
- `src/components/Auth/LoginPage.css`

---

### ✅ FASE 2: Editor de Código (CONCLUÍDA)

#### ✅ Fase 2.1: Monaco Editor (CONCLUÍDA)
**Objetivo:** Implementar editor de código com sintaxe Dart

**Implementado:**
- ✅ Integração Monaco Editor
- ✅ Configuração completa de sintaxe Dart
- ✅ Tema dark (VS Dark)
- ✅ Autocompletion básico
- ✅ Syntax highlighting para Dart/Flutter

**Arquivos:**
- `src/components/Editor/MonacoEditor.tsx`
- `src/components/Editor/MonacoEditor.css`

#### ✅ Fase 2.2: Sistema de Arquivos (CONCLUÍDA)
**Objetivo:** Navegação e manipulação de arquivos

**Implementado:**
- ✅ Comandos Rust para operações de arquivo
  - `read_directory` - Listar arquivos/pastas
  - `read_file_content` - Ler conteúdo
  - `write_file_content` - Salvar arquivo
  - `create_file` - Criar arquivo
  - `create_directory` - Criar pasta
  - `delete_path` - Deletar arquivo/pasta
  - `rename_path` - Renomear
- ✅ Dialog nativo para selecionar pasta
- ✅ File Explorer com navegação em árvore
- ✅ Expansão recursiva de pastas
- ✅ Abertura de arquivos no editor
- ✅ Salvar com Ctrl+S
- ✅ Gerenciamento de múltiplos arquivos abertos
- ✅ Indicador de mudanças não salvas

**Arquivos:**
- `src-tauri/src/lib.rs` (comandos file system)
- `src/services/fileSystem.ts`
- `src/stores/fileExplorerStore.ts`
- `src/components/Editor/FileExplorer.tsx`
- `src/components/Editor/FileExplorer.css`

#### ✅ Fase 2.3: Layout Principal (CONCLUÍDA)
**Objetivo:** Layout completo da IDE

**Implementado:**
- ✅ Header com logo, arquivo atual e usuário
- ✅ Sidebar esquerda com File Explorer
- ✅ Painel central com Monaco Editor
- ✅ Painel direito para Preview (placeholder)
- ✅ Footer com Console/Terminal
- ✅ Sistema de painéis redimensionáveis (futuro)

**Arquivos:**
- `src/components/Editor/EditorLayout.tsx`
- `src/components/Editor/EditorLayout.css`

---

### ✅ FASE 3: Integração Flutter (CONCLUÍDA)
**Objetivo:** Executar e gerenciar processos Flutter

**Implementado:**
- ✅ Comandos Rust para Flutter
  - `run_flutter` - Iniciar Flutter (Chrome, porta 8080)
  - `stop_flutter` - Parar processo
  - `hot_reload` - Hot reload (preserva estado)
  - `hot_restart` - Hot restart (reseta estado)
- ✅ Streaming de stdout/stderr via eventos
- ✅ Gerenciamento global de processo com lazy_static
- ✅ Serviço TypeScript wrapper (`FlutterService`)
- ✅ Store Zustand para estado Flutter
- ✅ Componente FlutterControls (botões Run/Stop/Reload/Restart)
- ✅ Componente Console (exibição de logs em tempo real)
- ✅ Auto-scroll no console
- ✅ Separação visual de logs vs erros

**Arquivos:**
- `src-tauri/src/lib.rs` (comandos Flutter)
- `src-tauri/Cargo.toml` (lazy_static)
- `src/services/flutterService.ts`
- `src/stores/flutterStore.ts`
- `src/components/Editor/FlutterControls.tsx`
- `src/components/Editor/FlutterControls.css`
- `src/components/Editor/Console.tsx`
- `src/components/Editor/Console.css`

**Como funciona:**
1. Usuário abre pasta Flutter
2. Clica em "▶️ Run"
3. Flutter compila e abre em Chrome (localhost:8080)
4. Logs aparecem no console inferior
5. Hot Reload/Restart disponíveis durante execução

---

### ✅ FASE 4: Preview Embutido (PARCIALMENTE CONCLUÍDA)
**Objetivo:** Preview do app Flutter dentro da IDE

#### ✅ Fase 4A: Preview Web (CONCLUÍDA)
**Inspiração:** DreamFlow (Flutter Web dentro de Flutter Web)

**Implementado:**
- ✅ Componente PreviewPanel com iframe
- ✅ Conexão com Flutter Web (localhost:8080)
- ✅ Device frames visuais (iPhone 14 Pro, Pixel 7, iPad Pro, Desktop)
- ✅ Seletor de dispositivo (dropdown)
- ✅ Controles de zoom (25%-200%)
- ✅ Geração de QR Code com URL do Flutter Web
- ✅ Exibição do QR code no painel de preview
- ✅ Instruções de como testar no celular
- ✅ Detecção automática de IP local (via WebRTC)
- ⏸️ Widget Inspector via VM Service Protocol
- ⏸️ **Toggle de seleção de elementos** (requisito do usuário)
  - Quando ativado: elementos clicáveis (Text, Widget, Button, Container, Column, Row)
  - Mapear elemento visual → código fonte
  - Destacar propriedades do elemento selecionado
  - Fornecer contexto para Claude AI
- ⏸️ Sincronização bidirecional (código ↔ preview)

**Arquivos:**
- `src/components/Editor/PreviewPanel.tsx`
- `src/components/Editor/PreviewPanel.css`
- `src/components/Editor/EditorLayout.tsx` (integração)

**Tecnologias:**
- iframe para embedding
- react-qr-code para QR generation
- WebRTC para detecção de IP local
- CSS custom para device frames

#### Fase 4B: Widget Inspector (PRÓXIMO)
**Objetivo:** Inspeção e seleção de widgets

**A Implementar:**
- ⏸️ Conexão com Flutter DevTools API
- ⏸️ VM Service Protocol integration
- ⏸️ Toggle de seleção de elementos
- ⏸️ Mapear elementos visuais → código fonte

#### Fase 4C: Emulador Android (Futuro)
**Objetivo:** Emulador Android embutido (opcional)

**A Considerar:**
- Requisitos de performance
- Android SDK/AVD Manager
- Alternativa: link direto para emulador externo

---

### 🔄 FASE 5: Integração Claude AI (EM PLANEJAMENTO)
**Objetivo:** Assistente de código com IA

**A Implementar:**
- ⏸️ Painel de chat lateral/inferior
- ⏸️ Input de API Key do usuário (armazenado localmente/Firebase)
- ⏸️ Serviço de integração com Anthropic API
- ⏸️ Context injection:
  - Código do arquivo atual
  - Elemento selecionado no preview (via toggle)
  - Estrutura do projeto
  - Erros/warnings
- ⏸️ Funcionalidades:
  - Explicar código
  - Gerar código
  - Refatorar
  - Corrigir erros
  - **Ajustar propriedades de UI** ("mude a cor desse botão para azul")
- ⏸️ "Apply Changes" - aplicar mudanças automaticamente
- ⏸️ Histórico de conversas (Firebase Firestore)
- ⏸️ Code diff antes de aplicar

**APIs:**
- Anthropic Claude API (via chave do usuário)
- OpenRouter (alternativa)

**Arquivos a criar:**
- `src/services/claudeService.ts`
- `src/stores/aiChatStore.ts`
- `src/components/AI/ChatPanel.tsx`
- `src/components/AI/CodeDiff.tsx`

---

### 🔄 FASE 6: Funcionalidades Avançadas (FUTURO)

#### Terminal Integrado
- ⏸️ Terminal embutido (xterm.js)
- ⏸️ Múltiplas abas de terminal
- ⏸️ Executar comandos Flutter/Git/npm

#### Git Integration
- ⏸️ Status de arquivos (modificados, staged)
- ⏸️ Commit UI
- ⏸️ Push/Pull
- ⏸️ Branch management
- ⏸️ Diff viewer

#### Debug & DevTools
- ⏸️ Breakpoints
- ⏸️ Debug console
- ⏸️ Variáveis watch
- ⏸️ Flutter DevTools embutido

#### Extensibilidade
- ⏸️ Sistema de plugins
- ⏸️ Temas customizáveis
- ⏸️ Snippets personalizados
- ⏸️ Keybindings configuráveis

#### Colaboração (Opcional)
- ⏸️ Live Share (edição colaborativa)
- ⏸️ Comments no código
- ⏸️ Code review

---

## 🗂️ Estrutura de Arquivos Atual

```
IDE-Flutter/
├── flutter-ide/
│   ├── src/                          # Frontend React
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginPage.tsx     ✅ Login/Register
│   │   │   │   └── LoginPage.css
│   │   │   └── Editor/
│   │   │       ├── EditorLayout.tsx  ✅ Layout principal
│   │   │       ├── EditorLayout.css
│   │   │       ├── MonacoEditor.tsx  ✅ Editor de código
│   │   │       ├── MonacoEditor.css
│   │   │       ├── FileExplorer.tsx  ✅ Navegação de arquivos
│   │   │       ├── FileExplorer.css
│   │   │       ├── FlutterControls.tsx ✅ Botões Flutter
│   │   │       ├── FlutterControls.css
│   │   │       ├── Console.tsx       ✅ Console de logs
│   │   │       └── Console.css
│   │   ├── hooks/
│   │   │   └── useAuth.tsx           ✅ Hook autenticação
│   │   ├── lib/
│   │   │   └── firebase.ts           ✅ Config Firebase
│   │   ├── services/
│   │   │   ├── fileSystem.ts         ✅ File system API
│   │   │   └── flutterService.ts     ✅ Flutter API
│   │   ├── stores/
│   │   │   ├── fileExplorerStore.ts  ✅ Estado arquivos
│   │   │   └── flutterStore.ts       ✅ Estado Flutter
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── src-tauri/                    # Backend Rust
│   │   ├── src/
│   │   │   └── lib.rs                ✅ Comandos Tauri
│   │   ├── Cargo.toml                ✅ Dependências Rust
│   │   └── tauri.conf.json           ✅ Config Tauri
│   ├── package.json
│   └── vite.config.ts
├── RUN.bat                           ✅ Script de inicialização
└── PLAN.md                           ✅ Este arquivo
```

---

## 🐛 Problemas Conhecidos e Soluções

### ✅ Resolvidos

1. **Rust não encontrado no PATH**
   - Solução: RUN.bat adiciona `%USERPROFILE%\.cargo\bin` ao PATH

2. **Porta 1420 em uso**
   - Solução: RUN.bat mata processos na porta antes de iniciar

3. **Plugin dialog configuration error**
   - Solução: Removida seção `plugins` do tauri.conf.json

4. **OAuth não funciona em Tauri**
   - Solução: Email/password como método principal

5. **Pastas não expandindo**
   - Solução: Implementado lazy loading com `updateNodeChildren`

---

## 🎨 Requisitos de Design (do usuário)

### Preview Panel (Prioridade Alta)
1. **Preview embutido** com iframe (não emulador)
2. **Toggle de seleção de elementos**:
   - Ativar/desativar modo de seleção
   - Quando ativo: clicar em Text, Widget, Button, Container, Column, Row
   - Selecionar elemento fornece contexto para Claude
   - Exemplo: "Ajuste esse texto para tamanho 20" ou "Mude a cor desse botão para vermelho"
3. **QR Code** para teste em mobile (escaneie e teste no celular)
4. **Device frames** visuais (parecer iPhone/Pixel sem ser emulador real)

### Claude Integration (Prioridade Alta)
1. Usuário fornece própria API key
2. Context-aware (código + elemento selecionado no preview)
3. Apply changes automaticamente
4. Histórico de conversas

### Monetização
- **Fase inicial:** Gratuito e open-source
- **Futuro:** A definir

---

## 📝 Próximos Passos Imediatos

### 1. Testar Fase 3 (Flutter Integration)
- [ ] Executar RUN.bat
- [ ] Fazer login na IDE
- [ ] Abrir projeto Flutter
- [ ] Clicar em "Run" e verificar:
  - Flutter inicia corretamente
  - Logs aparecem no console
  - Hot Reload funciona
  - Hot Restart funciona
  - Stop funciona

### 2. ✅ Fase 4A Concluída (Preview Web)
- [x] Criar componente `PreviewPanel.tsx`
- [x] Adicionar iframe apontando para localhost:8080
- [x] Implementar device frames (CSS)
- [x] Criar seletor de dispositivo
- [x] Integrar no EditorLayout (painel direito)
- [x] Gerar QR code com URL
- [x] Exibir no preview panel
- [x] Detectar IP local automaticamente

### 3. Implementar Widget Inspector (Fase 4B)
- [ ] Pesquisar VM Service Protocol
- [ ] Conectar ao Flutter DevTools
- [ ] Mapear elementos visuais → código
- [ ] Implementar toggle de seleção

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+
- Rust (via rustup)
- Flutter SDK
- Git

### Instalação
```bash
cd flutter-ide
npm install
```

### Desenvolvimento
```bash
# Windows
RUN.bat

# Linux/Mac
npm run tauri dev
```

### Build de Produção
```bash
npm run tauri build
```

---

## 📚 Recursos e Documentação

### Documentação Oficial
- [Tauri](https://tauri.app/)
- [React](https://react.dev/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Firebase](https://firebase.google.com/docs)
- [Flutter](https://flutter.dev/)
- [Anthropic Claude API](https://docs.anthropic.com/)

### Inspiração
- **DreamFlow** - Flutter Web IDE com preview embutido
- **VS Code** - UI/UX do editor
- **Cursor** - Integração AI
- **FlutterFlow** - Visual builder

---

## 👥 Configuração do Usuário

### Firebase
- **Project ID:** flutter-ide-project
- **Authentication:** Email/Password, Google (configurado), GitHub (configurado)
- **Database:** Firestore (padrão)

### Claude API
- Cada usuário deve fornecer sua própria chave
- Armazenamento: Local ou Firebase (a definir)

---

## 🎯 Objetivos do Projeto

### Curto Prazo (1-2 semanas)
- ✅ IDE funcional com editor e file system
- ✅ Flutter run/hot reload integrado
- ✅ Preview embutido funcionando
- ✅ QR code para mobile

### Médio Prazo (1-2 meses)
- ⏸️ Claude AI totalmente integrado
- ⏸️ Widget Inspector com seleção
- ⏸️ Terminal integrado
- ⏸️ Git básico

### Longo Prazo (3-6 meses)
- ⏸️ Debug completo
- ⏸️ Plugins/Extensões
- ⏸️ Colaboração em tempo real
- ⏸️ Marketplace de templates

---

## 📊 Status Geral

| Fase | Status | Progresso |
|------|--------|-----------|
| 1. Autenticação | ✅ Completo | 100% |
| 2. Editor | ✅ Completo | 100% |
| 3. Flutter Integration | ✅ Completo | 100% |
| 4. Preview | 🔄 Em Andamento | 60% (4A completo, 4B pendente) |
| 5. Claude AI | 🔄 Planejado | 0% |
| 6. Avançado | 🔄 Futuro | 0% |

**Progresso Total:** ~60% (3.6/6 fases principais)

---

## 💡 Notas Importantes

1. **Modelo de negócio:** Open-source inicialmente, monetização a definir
2. **API Keys:** Usuários fornecem suas próprias chaves Claude
3. **Preview:** Web first (rápido), emulador Android depois (opcional)
4. **Performance:** Focar em responsividade e experiência fluida
5. **Segurança:** Nunca commitar credentials ou API keys

---

**Última atualização:** 10/11/2025
**Versão atual:** 0.4.0-alpha (Fase 4A concluída - Preview Panel ativo)
