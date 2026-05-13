@echo off
cd /d "%~dp0"

set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
if not exist "%NODE_EXE%" set "NODE_EXE=%ProgramFiles(x86)%\nodejs\node.exe"

if not exist "%NODE_EXE%" (
  echo Node.js not found at "%ProgramFiles%\nodejs\node.exe"
  echo Install LTS from https://nodejs.org/ then run this again.
  pause
  exit /b 1
)

echo Using: %NODE_EXE%
"%NODE_EXE%" server.js
pause
