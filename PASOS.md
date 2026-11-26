# Publicar en GitHub, Vercel y Render (≈15 min, todo gratis)
1. GitHub: crea un repo vacío `ia-desahogo`. En esta carpeta: `git init && git add . && git commit -m "IA de Desahogo" && git branch -M main && git remote add origin https://github.com/TU_USUARIO/ia-desahogo.git && git push -u origin main`
2. Render: New → Blueprint → elige el repo (lee `render.yaml`). Completa las variables (GEMINI_API_KEY (gratis en aistudio.google.com/apikey), SMTP_*, ALLOW_ORIGIN=https://TU-SITIO.vercel.app, PUBLIC_URL=la URL de Render del agente). Te da 2 URLs.
3. Vercel: Add New → Project → elige el repo (usa `vercel.json`). Te da https://ia-desahogo.vercel.app
4. En `web/index.html` pon: FORM_ENDPOINT=https://<agente>.onrender.com/suscribir · AI_ENDPOINT=https://<proxy>.onrender.com/ · CONTACT_EMAIL=tu correo. Commit y push: Vercel republica solo.
Nota: el plan gratis de Render se duerme tras 15 min sin uso (la primera respuesta tarda ~30 s). No subas .env ni claves al repo.
