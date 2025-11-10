# Flutter IDE 🚀

A modern, AI-powered IDE for Flutter development built with Tauri, React, and TypeScript.

![Version](https://img.shields.io/badge/version-0.4.0--alpha-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey)

## ✨ Features

### ✅ Currently Implemented

- **🔐 Firebase Authentication** - Secure login with email/password
- **📝 Monaco Editor** - VS Code's powerful editor with Dart syntax support
- **📁 File System Management** - Full file tree navigation and manipulation
- **🏃 Flutter Integration** - Run, hot reload, and hot restart Flutter apps
- **📱 Live Preview Panel** - View your Flutter app in real-time with:
  - Multiple device frames (iPhone 14 Pro, Pixel 7, iPad Pro, Desktop)
  - Zoom controls (25%-200%)
  - QR code generation for mobile testing
  - Automatic local IP detection
- **💬 Real-time Console** - View Flutter logs and errors as they happen

### 🔄 In Progress

- **🔍 Widget Inspector** - Select and inspect Flutter widgets
- **🤖 Claude AI Integration** - AI-powered coding assistance

### 🎯 Planned

- **🖥️ Integrated Terminal** - xterm.js-based terminal
- **📊 Git Integration** - Version control UI
- **🐛 Debug Tools** - Breakpoints and debugging
- **🔌 Plugin System** - Extensible architecture

## 🛠️ Tech Stack

### Backend
- **Tauri 2.0** - Desktop framework (Rust + WebView)
- **Rust** - Native system operations
- **Firebase** - Authentication and database

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Zustand** - State management
- **Monaco Editor** - Code editing
- **react-qr-code** - QR code generation

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **Rust** (via [rustup](https://rustup.rs/))
- **Flutter SDK**
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/Julian0s/Flutter-IDE-Project.git
cd Flutter-IDE-Project/flutter-ide

# Install dependencies
npm install
```

### Development

```bash
# Windows
RUN.bat

# Linux/Mac
npm run tauri dev
```

### Build for Production

```bash
npm run tauri build
```

## 📖 Documentation

- **[PLAN.md](PLAN.md)** - Detailed development roadmap (Portuguese)
- **[CLAUDE.md](CLAUDE.md)** - Technical architecture guide

## 🎯 Current Status

| Phase | Status | Progress |
|-------|--------|----------|
| 1. Authentication | ✅ Complete | 100% |
| 2. Code Editor | ✅ Complete | 100% |
| 3. Flutter Integration | ✅ Complete | 100% |
| 4. Preview Panel | 🔄 In Progress | 60% |
| 5. AI Integration | 🔄 Planned | 0% |
| 6. Advanced Features | 🔄 Future | 0% |

**Overall Progress:** ~60%

## 🖼️ Screenshots

### Main IDE Interface
- Monaco editor with Dart syntax highlighting
- File explorer with tree navigation
- Live preview panel with device frames
- Real-time console output

### Preview Panel Features
- **Device Selector**: Switch between iPhone, Pixel, iPad, and Desktop
- **Zoom Controls**: Adjust preview size from 25% to 200%
- **QR Code**: Test on physical devices via QR code scanning
- **Device Frames**: Authentic mobile device appearance with notches

## 🤝 Contributing

This project is currently in early development. Contributions, issues, and feature requests are welcome!

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Inspired by:
- **DreamFlow** - Flutter web IDE concept
- **VS Code** - Editor UI/UX
- **Cursor** - AI integration approach
- **FlutterFlow** - Visual builder concepts

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ using Tauri, React, and Claude AI assistance**
