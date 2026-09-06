
WorldArts — package final
Frontend
Open frontend/index.html in a browser for the static interface. For Pi login and Pi payments, use the app inside Pi Browser and deploy the frontend on the configured production domain.
Backend
The Node/Express backend is in backend/. Run: npm install npm start
Set environment variables from .env.example before production deployment.
API
Default frontend API: https://worldarts-backend.onrender.com/api
This package contains:
frontend/index.html
frontend/style.css
frontend/script.js
frontend/assets/logo.svg
frontend/assets/favicon.svg
backend/server.js
backend/routes/*
backend/middleware/errorHandler.js
backend/package.json
backend/.env.example
