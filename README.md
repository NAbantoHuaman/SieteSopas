# SIGEPAM - Sistema de Gestión del Restaurante Siete Sopas

Este proyecto es un sistema de gestión integral para el restaurante "Siete Sopas", que permite administrar mesas, productos, pedidos y personal a través de una interfaz moderna y eficiente.

---

## 🚀 Tecnologías Utilizadas

### Backend
- **Java 17+**
- **Spring Boot 3.x**
- **Spring Security (JWT)**
- **Spring Data JPA**
- **H2 Database** (Base de datos en memoria para desarrollo)
- **Lombok**
- **Maven**

### Frontend
- **React 19**
- **Vite**
- **Tailwind CSS 4**
- **Lucide React** (Iconografía)
- **React PageFlip** (Menú interactivo)

---

## 📋 Requisitos Previos

Asegúrate de tener instalado:
- [Java JDK 17+](https://www.oracle.com/java/technologies/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [Maven](https://maven.apache.org/download.cgi)

---

## ⚙️ Configuración y Ejecución

### 1. Backend
Navega a la carpeta del backend y ejecuta el servidor de Spring Boot:

```bash
cd backend
mvn spring-boot:run
```
El backend se ejecutará en: `http://localhost:8080`
La consola de H2 está disponible en: `http://localhost:8080/h2-console`
- **JDBC URL:** `jdbc:h2:mem:sigepam_db`
- **Usuario:** `sa`
- **Contraseña:** (vacío)

### 2. Frontend
En una nueva terminal, navega a la carpeta del frontend e instala las dependencias (si es necesario) y ejecuta el entorno de desarrollo:

```bash
cd frontend
npm install
npm run dev
```
El frontend se ejecutará normalmente en: `http://localhost:5173` (o el puerto que indique la terminal).

---

## 🔐 Credenciales de Acceso (Modo Prueba)

El sistema inicializa automáticamente los siguientes usuarios de prueba:

| Rol | Email | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `sopas@gmail.com` | `130404` |
| **Anfitrión** | `anfitrion@sigepam.com` | `anfitrion123` |
| **Cocinero** | `cocinero@sigepam.com` | `cocinero123` |
| **Cajero** | `caja@sietesopas.com` | `caja123` |

---

## 📂 Estructura del Proyecto

- `backend/`: Código fuente de la API REST desarrollada con Spring Boot.
- `frontend/`: Aplicación cliente desarrollada con React y Tailwind CSS.
- `presentacion-efsrt.html`: Material de presentación del proyecto.

---

## ✨ Características Principales

- **Gestión de Mesas:** Visualización del estado en tiempo real (Libre, Ocupada, Reservada).
- **Menú Digital:** Carta interactiva con categorías y detalles de productos.
- **Autenticación:** Seguridad basada en roles y tokens JWT.
- **Dashboard:** Panel de control para administración y estadísticas.
