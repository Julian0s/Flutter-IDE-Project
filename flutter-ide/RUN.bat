@echo off
echo ========================================
echo    FLUTTER IDE - Iniciar Aplicacao
echo ========================================
echo.

REM Adicionar Rust ao PATH
set PATH=%PATH%;%USERPROFILE%\.cargo\bin

REM Matar processos Node existentes na porta 1420
echo Limpando processos anteriores...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":1420" ^| find "LISTENING"') do (
    echo Matando processo %%a
    taskkill /F /PID %%a 2>nul
)

echo.
echo Iniciando Tauri...
echo (Primeira compilacao pode demorar 2-5 minutos)
echo.

npm run tauri dev

pause
