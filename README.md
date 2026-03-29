![banner](/public/images/mask-group.png "Banner con presentación del logo")

# QMenú - Solución inteligente de menús digitales.

**QMenú** es una plataforma web Fullstack diseñada para que locales gastronómicos autogestionen sus catálogos de platos de manera eficiente, moderna y personalizada. La aplicación permite a los comercios digitalizar su oferta, mejorar la experiencia del cliente y escalar sus ventas mediante herramientas tecnológicas de vanguardia.

---

## 📈 Stack Tecnológico

La arquitectura de QMenú se apoya en tecnologías modernas para garantizar un alto rendimiento y escalabilidad:

* **Frontend:** `Next.js 16` + `React 19` con `Tailwind CSS` (Diseño adaptable y multiplataforma).
* **Backend:** `Node.js` & `Express 5.x`.
* **Base de Datos:** `MongoDB` con `Mongoose`.
* **IA:** Integración de modelos de lenguaje para la optimización inteligente del catálogo.
* **Infraestructura:** Despliegue optimizado con `Vercel Analytics` y `Speed Insights`.

---

## 📝 Características Principales

* **Autenticación y Perfiles:** Sistema completo de usuarios con gestión de datos personales y carga de fotos de perfil.
* **Panel de Administración (CRUD):** Interfaz intuitiva para el control total sobre el inventario de platos (Crear, Leer, Actualizar, Eliminar).
* **Personalización de Marca:** Ajuste de la estética del menú para alinearse con la identidad visual del local.
* **Generador de QR:** Creación dinámica de códigos QR vinculados al menú, listos para descargar e imprimir.
* **Sistema de Pedidos (Premium):** Integración directa con la API de WhatsApp para recibir pedidos en tiempo real.
* **Vista del Usuario:** Interfaz fluida, rápida y visualmente atractiva para explorar platos sin necesidad de instalar aplicaciones externas.

---

## 🫆 Seguridad de Nivel Producción

QMenú implementa una arquitectura de seguridad multi-nivel para proteger la integridad de los datos:

* **Content Security Policy (CSP):** Configuración estricta de encabezados HTTP para mitigar ataques XSS y asegurar que solo scripts autorizados (Mercado Pago, Vercel Analytics y Google Tag Manager) se ejecuten en el cliente.
* **Input Sanitization:** Validación rigurosa de datos en ambos extremos:
    * **Client-side:** Schemas de `Yup` para feedback inmediato al usuario.
    * **Server-side:** Validaciones con `Joi` y `express-validator` para prevenir inyecciones NoSQL.
* **Rate Limiting:** Implementación de `express-rate-limit` para proteger endpoints críticos contra ataques de fuerza bruta.
* **Secure Storage:** Hashing de credenciales con `bcryptjs` y gestión de sesiones mediante tokens **JWT** firmados con cookies `HttpOnly`.

---

## ⚙️ Especificaciones Técnicas Detalladas

### Backend & Core / Repositorio "m-01back"
* **Rutas Asíncronas:** Uso de las últimas capacidades de **Express** para un manejo eficiente de peticiones.
* **Estrategia de Identidad:** Validación mediante **JSON Web Tokens (JWT)** integrada con `Passport.js` y `jsonwebtoken`.
* **Integridad de Datos:** Doble capa de validación para garantizar la consistencia absoluta en el esquema de MongoDB.

### Frontend & Performance
* **State Management:** Gestión de estado ligero, rápido y escalable mediante `Zustand`.
* **UX Animada:** Interfaces dinámicas impulsadas por `Framer Motion`, `Animate.css` y `motion`.
* **Optimización de Media:** Procesamiento de imágenes en cliente con `browser-image-compression` antes de la subida a **Cloudinary**.

### Integraciones de Terceros
* **Mercado Pago API:** Flujo completo de pagos para la gestión de suscripciones.
* **Cloudinary SDK:** Transformación y almacenamiento optimizado de activos visuales en la nube.
* **QR Generation:** Producción de códigos de alta resolución con `qrcode.react`.

---

## 💡 Instalación y Uso

Si deseas ejecutar este proyecto localmente, sigue estos pasos:

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/nicodsd/mp-02.git
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   Primero crea un archivo `.env.local` en la raíz del proyecto con la siguiente clave:
   ```env
    NEXT_PUBLIC_API_URL=http://localhost:[PORT]/
   ```
   Luego crea un archivo `.env.production` en la raíz del proyecto con la siguiente clave:
   ```env
    NEXT_PUBLIC_API_URL="[URL_DEL_BACKEND]"
   ```

4. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

---

## 📄 Licencia

Todos los derechos reservados para Nico Barrera.
