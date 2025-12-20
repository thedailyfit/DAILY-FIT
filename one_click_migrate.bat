@echo off
set "SOURCE=%~dp0"
set "DEST=%USERPROFILE%\Desktop\DailyFit_Complete"

echo ==========================================
echo      DAILYFIT FULL MIGRATION
echo ==========================================
echo.
echo copying EVERYTHING (including node_modules)...
echo This might take a while because node_modules are huge.
echo.
echo Source: %SOURCE%
echo Destination: %DEST%
echo.

if not exist "%DEST%" mkdir "%DEST%"

:: Copy Everything (No Exclusions)
xcopy "%SOURCE%*" "%DEST%\" /E /H /Y

echo.
echo ==========================================
echo           MIGRATION SUCCESSFUL
echo ==========================================
echo.
echo All files (including node_modules) are now at:
echo %DEST%
echo.
pause
