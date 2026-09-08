@echo off
echo Starting Wasme Tahir Production Environment...

echo.
echo Starting Node.js Backend Server on Port 6002...
cd backend
start "Wasme Tahir - Backend" cmd /k "npm start"

cd ..
echo.
echo Starting Cloudflare Tunnel...
:: Note: Using 'run' instead of 'service install' so it runs inside this command window
start "Cloudflare Tunnel" cmd /k "cloudflared tunnel run --token eyJhIjoiOGY0ZDBlZTUwNWZiNDdlODhjZjg4ZWQ4MDFmN2ZmNmMiLCJ0IjoiMDRmNTI0NDMtYmMxNy00MzI5LWE2MzgtZTNmOTgzMzU2ODMyIiwicyI6Ill6QmtaakV4WVRjdE1qSTNOQzAwTXpFNExXRTFNell0WmpkaFlXWTBaR1ExWmpBNCJ9"

echo.
echo Both the Backend and Cloudflare Tunnel are running!
echo Keep the new command windows open to keep the server online.
