@echo off
TITLE Inicializador TCC - Restaurante

echo ==========================================
echo      INICIANDO SISTEMA RESTAURANTE
echo ==========================================

:: 1. Verifica Node
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado.
    pause
    exit
)

:: 2. Verifica Java
java -version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Java JDK nao encontrado.
    pause
    exit
)

echo.
echo [1/3] Verificando dependencias do Frontend...
cd frontend
if not exist node_modules (
    echo       Primeira vez rodando? Instalando pacotes...
    call npm install
)
cd ..

echo.
echo [2/3] Iniciando BACKEND...
:: O comando 'start' abre uma nova janela independente
start "SERVER JAVA" cmd /k "cd backend && mvnw spring-boot:run"

echo.
echo Aguardando 5 segundos para iniciar o Front...
timeout /t 5 >nul

echo.
echo [3/3] Iniciando FRONTEND...
:: O comando 'start' abre uma nova janela independente
start "CLIENTE REACT" cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo   TUDO PRONTO!
echo   O sistema vai abrir em janelas separadas.
echo   Fechando este terminal em 5 segundos...
echo ==========================================

:: Espera 5 segundos e fecha ESTA janela, mantendo as outras
timeout /t 5
exit