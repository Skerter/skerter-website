@echo off
setlocal

cd /d "%~dp0"

where node.exe >nul 2>&1
if errorlevel 1 (
  echo [error] Node.js is not installed or is not available in PATH.
  echo Install the current Node.js LTS release and run this file again.
  pause
  exit /b 1
)

where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo [error] npm is not available in PATH.
  echo Reinstall Node.js with npm and run this file again.
  pause
  exit /b 1
)

if not exist "node_modules\astro\package.json" (
  echo Installing project dependencies...
  call npm.cmd ci
  if errorlevel 1 (
    echo [error] Dependency installation failed.
    pause
    exit /b 1
  )
)

echo Starting Skerter at http://127.0.0.1:4321/
echo Press Ctrl+C to stop the server.
echo.

call npm.cmd run dev

if errorlevel 1 (
  echo.
  echo [error] The development server stopped with an error.
  pause
  exit /b 1
)
