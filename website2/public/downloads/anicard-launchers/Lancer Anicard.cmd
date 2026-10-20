@echo off
cd /d "%~dp0"
where py >nul 2>nul
if errorlevel 1 (
  python "%~dp0lancer_anicard.py" %*
) else (
  py -3 "%~dp0lancer_anicard.py" %*
)
if errorlevel 1 pause
