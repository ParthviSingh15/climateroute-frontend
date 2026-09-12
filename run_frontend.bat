@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Installing frontend dependencies...
  npm install
)
echo Starting ClimateRoute frontend...
npm run dev
