@echo off
setlocal
cd /d "%~dp0"
echo Installing backend dependencies (first run may take a minute)...
npm install --no-audit --no-fund
echo Starting backend server...
npm start
endlocal

