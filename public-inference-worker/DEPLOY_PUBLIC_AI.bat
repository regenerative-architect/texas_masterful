@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required to deploy the Cloudflare Worker.
  echo Install Node.js from https://nodejs.org/ then run this file again.
  pause
  exit /b 1
)
echo.
echo === Texas Public Intelligence Router ===
echo This will open a browser window for Cloudflare login if needed.
echo.
call npx wrangler login
if errorlevel 1 goto :fail
call npx wrangler deploy
if errorlevel 1 goto :fail
echo.
echo Deployment complete. Copy the workers.dev URL shown above.
echo In Texas Master Systems OS: AI Lab ^> Public intelligence router ^> Worker gateway URL.
echo.
pause
exit /b 0
:fail
echo Deployment failed. Review the message above.
pause
exit /b 1
