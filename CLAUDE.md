# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Flutter IDE built with Tauri 2.0 + React + TypeScript. It's a desktop application that provides a complete development environment for Flutter projects with integrated code editing, file management, Flutter execution, and planned AI assistance features.

**Architecture:** Tauri desktop app with Rust backend for system operations and React frontend for UI. The app uses Monaco Editor (VS Code's editor engine) for code editing and integrates directly with the Flutter CLI for running and managing Flutter projects.

**Current Status:** Phases 1-3 complete (Authentication, Editor, Flutter Integration). Phases 4-6 in planning (Preview Panel, Claude AI Integration, Advanced Features).

## Development Commands

### Running the IDE

```bash
# Start development server (from flutter-ide directory)
npm run tauri dev

# Or use the convenience script (Windows)
# From project root
RUN.bat
```

The `RUN.bat` script handles several important setup steps:
- Adds Rust to PATH (`%USERPROFILE%\.cargo\bin`)
- Kills any processes on port 1420 (Tauri default dev port)
- Starts the Tauri dev server

### Building

```bash
# Build for production
npm run tauri build

# Type checking and Vite build
npm run build
```

### Package Management

```bash
# Install dependencies
npm install
```

## Key Architecture Patterns

### Rust Backend (src-tauri/src/lib.rs)

All system-level operations are handled via Tauri commands in Rust:

**File System Commands:**
- `read_directory` - Lists files/folders with filtering (skips `.`, `node_modules`, `build`)
- `read_file_content` - Reads file contents as string
- `write_file_content` - Writes content to file
- `create_file`, `create_directory`, `delete_path`, `rename_path` - File operations
- `open_folder_dialog` - Native folder picker dialog

**Flutter Process Management:**
- `run_flutter` - Starts Flutter with args: `["run", "-d", "chrome", "--web-port=8080"]`
- `stop_flutter` - Kills the running Flutter process
- `hot_reload`, `hot_restart` - Flutter development commands
- Uses `lazy_static` with `Arc<Mutex<Option<Child>>>` for global process state
- Streams stdout/stderr via Tauri events: `flutter-log`, `flutter-error`

### Frontend State Management (Zustand)

**fileExplorerStore.ts:**
- Manages workspace root, file tree, open files, unsaved changes
- Tracks expanded folders as `Set<string>` of paths
- `openFiles` is `Map<string, string>` (path → content)
- `unsavedChanges` is `Set<string>` of modified file paths

**flutterStore.ts:**
- Manages Flutter process state (isRunning, previewUrl, logs, errors)
- Sets up event listeners for `flutter-log` and `flutter-error` events
- Stores `UnlistenFn` callbacks for cleanup

### Service Layer

**fileSystem.ts:**
- Wraps Tauri file system commands with TypeScript interfaces
- `isFlutterProject()` checks for `pubspec.yaml` existence

**flutterService.ts:**
- Wraps Flutter-related Tauri commands
- Provides event listener setup with `onLog()` and `onError()`

### Monaco Editor Integration

**MonacoEditor.tsx:**
- Uses `@monaco-editor/react` package
- Configured with Dart language support
- Theme: `vs-dark`
- Handles file saving with Ctrl+S keybinding
- Updates are debounced to track unsaved changes

## Firebase Configuration

The project uses Firebase for authentication:
- **Project ID:** flutter-ide-project
- **Auth Methods:** Email/Password (primary), Google OAuth, GitHub OAuth (configured but not fully integrated)
- Firebase config is in `src/lib/firebase.ts`
- Authentication hook: `src/hooks/useAuth.ts`

**Important:** OAuth doesn't work reliably in Tauri desktop apps. Email/Password is the main authentication method.

## Project Structure

```
flutter-ide/
├── src/                           # React frontend
│   ├── components/
│   │   ├── Auth/
│   │   │   └── LoginScreen.tsx    # Login/Register UI
│   │   └── Editor/
│   │       ├── EditorLayout.tsx   # Main IDE layout
│   │       ├── MonacoEditor.tsx   # Code editor
│   │       ├── FileExplorer.tsx   # File tree navigation
│   │       ├── FlutterControls.tsx # Run/Stop/Reload buttons
│   │       └── Console.tsx        # Log output panel
│   ├── hooks/
│   │   └── useAuth.ts             # Firebase auth hook
│   ├── services/
│   │   ├── fileSystem.ts          # File system API wrapper
│   │   └── flutterService.ts      # Flutter CLI wrapper
│   └── stores/
│       ├── fileExplorerStore.ts   # File/editor state
│       └── flutterStore.ts        # Flutter process state
├── src-tauri/                     # Rust backend
│   ├── src/
│   │   ├── lib.rs                 # Tauri commands
│   │   └── main.rs                # Entry point
│   ├── Cargo.toml                 # Rust dependencies
│   └── tauri.conf.json            # Tauri configuration
└── package.json                   # npm dependencies
```

## Known Issues & Important Notes

### Solved Issues (Don't Reintroduce)

1. **Port 1420 conflicts** - RUN.bat kills processes before starting
2. **Plugin dialog configuration** - Don't add `plugins` section to tauri.conf.json
3. **Folder expansion** - Use lazy loading with `updateNodeChildren` pattern
4. **OAuth in Tauri** - Known limitation, use email/password instead

### Development Considerations

1. **File System Operations:** Always use the Rust commands, not Node.js fs module (won't work in Tauri)
2. **Process Management:** Flutter process is global singleton managed by lazy_static - only one can run at a time
3. **Event Listeners:** Must cleanup `UnlistenFn` callbacks to prevent memory leaks
4. **Hot Reload/Restart:** Currently simplified - actual implementation would need stdin communication with Flutter process
5. **Path Handling:** Use forward slashes or properly escaped backslashes; Rust normalizes paths

## Planned Features (Not Yet Implemented)

### Phase 4: Preview Panel (Next Priority)
- Embed Flutter web preview in iframe (localhost:8080)
- Device frame selector (iPhone, Pixel, iPad visual frames)
- QR code generation for mobile testing
- Widget inspector with element selection toggle
- Bidirectional sync between code and preview

### Phase 5: Claude AI Integration
- Chat panel for AI assistance
- User provides their own Claude API key
- Context-aware: current file + selected preview element
- Auto-apply code changes
- Conversation history stored in Firebase

### Phase 6: Advanced Features
- Integrated terminal (xterm.js)
- Git integration UI
- Debug tools with breakpoints
- Plugin system
- Live collaboration

## Firebase Security

**Never commit:**
- API keys
- Firebase config secrets
- User credentials

The Firebase config in `firebase.ts` contains public keys only (safe to commit). API key restrictions should be configured in Firebase Console.

## Testing Workflow

When testing Flutter integration:
1. Open the IDE
2. Login with Firebase credentials
3. Use folder dialog to select a Flutter project
4. Click "Run" button - Flutter should compile and open Chrome at localhost:8080
5. Check console panel for Flutter logs
6. Test Hot Reload and Hot Restart buttons
7. Click "Stop" to terminate Flutter process

## Additional Context

- **Language:** The PLAN.md is in Portuguese (Brazilian), but code/comments should be in English
- **Target Platform:** Windows primary, but Tauri supports Linux/Mac
- **Inspiration:** DreamFlow (Flutter web IDE), VS Code (UI/UX), Cursor (AI integration)
- **License:** Planned as open-source initially, monetization TBD
