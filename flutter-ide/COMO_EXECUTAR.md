# Como Executar o Flutter IDE

## ⚠️ IMPORTANTE

Você **DEVE** executar o `RUN.bat` no **Prompt de Comando do Windows** (CMD), **NÃO** no Git Bash ou terminal integrado do VS Code.

## Passos para Executar:

### Opção 1: Duplo Clique (Mais Fácil)
1. Navegue até a pasta `C:\dev\IDE-Flutter\flutter-ide`
2. Dê **duplo clique** no arquivo `RUN.bat`
3. Aguarde a compilação (primeira vez demora 2-5 minutos)
4. A janela do Flutter IDE abrirá automaticamente

### Opção 2: Prompt de Comando
1. Pressione `Win + R`
2. Digite `cmd` e pressione Enter
3. Execute os comandos:
   ```cmd
   cd C:\dev\IDE-Flutter\flutter-ide
   RUN.bat
   ```

### Opção 3: Terminal do VS Code (Windows)
1. No VS Code, abra o terminal
2. Clique na seta ao lado do `+`
3. Selecione "Command Prompt" (não Git Bash)
4. Execute:
   ```cmd
   RUN.bat
   ```

## O que o RUN.bat faz:

1. ✅ Adiciona o Rust (cargo) ao PATH automaticamente
2. ✅ Limpa processos anteriores na porta 1420
3. ✅ Inicia o servidor de desenvolvimento Tauri
4. ✅ Compila o código Rust (primeira vez demora)
5. ✅ Abre a janela do Flutter IDE

## Se der erro:

### Erro: "cargo metadata failed"
- **Causa**: Você está no Git Bash ou terminal errado
- **Solução**: Use o Prompt de Comando do Windows (CMD)

### Erro: "Port 1420 already in use"
- **Causa**: Processo anterior ainda rodando
- **Solução**: O RUN.bat já limpa isso automaticamente, mas se persistir:
  ```cmd
  netstat -ano | findstr :1420
  taskkill /F /PID [número_do_processo]
  ```

### Erro na compilação Rust
- **Causa**: Dependências novas foram adicionadas
- **Solução**: Aguarde a compilação completa (pode demorar 5-10 minutos na primeira vez)

## Após abrir o IDE:

1. Faça login com email/senha
2. Clique no botão 📁 no Explorador (sidebar esquerda)
3. Selecione uma pasta Flutter
4. Clique em um arquivo .dart para editar
5. Use Ctrl+S para salvar

## Teclas de Atalho:

- `Ctrl + S` - Salvar arquivo atual
- `Ctrl + C` (no terminal) - Parar o servidor

## Primeira Compilação:

A primeira vez que você executar, o Rust vai compilar **TODOS** os pacotes. Isso pode demorar entre 2 a 10 minutos dependendo do seu computador. Seja paciente!

Nas próximas execuções será muito mais rápido (10-30 segundos).
