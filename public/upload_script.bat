@echo off
echo ========================================
echo iNest Website - Mobile Responsive Upload
echo ========================================
echo.
echo Server: 31.97.232.56 (inest.space)
echo Target: Web root directory
echo.
echo INSTRUCTIONS:
echo 1. Open Command Prompt or PowerShell as Administrator
echo 2. Navigate to this directory: cd "P:\inest\INest-Website--main"
echo 3. Run these commands ONE BY ONE:
echo.
echo ========================================
echo SCP UPLOAD COMMANDS:
echo ========================================
echo.
echo scp "index.html" root@31.97.232.56:/var/www/inest.space/
echo scp "PG page.html" root@31.97.232.56:/var/www/inest.space/
echo scp "House.html" root@31.97.232.56:/var/www/inest.space/
echo scp "Flats page.html" root@31.97.232.56:/var/www/inest.space/
echo scp "login.html" root@31.97.232.56:/var/www/inest.space/
echo scp "register.html" root@31.97.232.56:/var/www/inest.space/
echo scp "chat page.html" root@31.97.232.56:/var/www/inest.space/
echo scp "responsive-styles.css" root@31.97.232.56:/var/www/inest.space/
echo scp "critical-mobile.css" root@31.97.232.56:/var/www/inest.space/
echo.
echo ========================================
echo ALTERNATIVE: Upload ALL files at once
echo ========================================
echo.
echo scp *.html *.css root@31.97.232.56:/var/www/inest.space/
echo.
echo ========================================
echo VERIFICATION:
echo ========================================
echo.
echo After upload, test: https://inest.space
echo Check mobile responsiveness on phone/tablet
echo.
echo Press any key to close...
pause >nul
