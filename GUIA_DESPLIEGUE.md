# Guía de Despliegue: EFSRT (Siete Sopas)

Esta guía explica cómo desplegar tu proyecto monorepo utilizando **Vercel** para el frontend y **Render** para el backend.

---

## 🚀 1. Frontend: Despliegue en Vercel

Vercel es ideal para aplicaciones React/Vite.

1. **Inicia sesión en [Vercel](https://vercel.com/)** con tu cuenta de GitHub.
2. Haz clic en **"Add New"** > **"Project"**.
3. Busca el repositorio `SieteSopas` y haz clic en **"Import"**.
4. **CONFIGURACIÓN CRÍTICA (Root Directory):**
   - En la sección "Project Settings", busca el campo **Root Directory**.
   - Haz clic en **"Edit"** y selecciona la carpeta `frontend`.
   - Vercel detectará automáticamente que es un proyecto **Vite**.
5. **Inicia sesión en [Vercel](https://vercel.com/)** con tu cuenta de GitHub.
6. Haz clic en **"Add New"** > **"Project"**.
7. Busca el repositorio `SieteSopas` y haz clic en **"Import"**.
8. **CONFIGURACIÓN CRÍTICA (Root Directory):**
   - En la sección "Project Settings", busca el campo **Root Directory**.
   - Haz clic en **"Edit"** y selecciona la carpeta `frontend`.
   - Vercel detectará automáticamente que es un proyecto **Vite**.
9. **Variables de Entorno (Opcional):**
   - Si tu frontend necesita la URL del backend, añádela en "Environment Variables" (ej. `VITE_API_URL`).
10. Haz clic en **"Deploy"**.

---

## ⚙️ 2. Backend: Despliegue en Render (Usando Docker)

Como Render no siempre muestra "Java" directamente en el menú, usaremos **Docker**, que es la forma más profesional y segura de desplegar Spring Boot.

1.  **Inicia sesión en [Render](https://render.com/)** con tu cuenta de GitHub.
2.  Haz clic en **"New"** > **"Web Service"**.
3.  Selecciona el repositorio `SieteSopas`.
4.  **Configuración del Servicio:**
    - **Name**: `siete-sopas-backend`.
    - **Language**: Seleccionar **Docker** (es el primero de la lista en tu captura).
    - **Root Directory**: `backend` (¡Muy importante!).
5.  **Variables de Entorno:**
    - Ve a la pestaña **"Environment"**.
    - Añade `PORT` con el valor `8080`.
    - Añade los datos de tu base de datos si los tienes: `SPRING_DATASOURCE_URL`, etc.
6.  Haz clic en **"Create Web Service"**.

Render detectará automáticamente el archivo `Dockerfile` que acabo de crear dentro de la carpeta `backend` y se encargará de todo.

---

## 💡 Notas Importantes

- **Root Directory**: Esto es lo más importante. Como tienes todo en un solo repo (`EFSRT`), debes decirle a cada servicio en qué carpeta debe trabajar.

---

_¡Buena suerte con el despliegue!_ 🚀
