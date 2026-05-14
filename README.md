![banner](/public/images/mask-group.png "Banner con presentación del logo")

# QMenú - Smart Digital Menu Solution

**QMenú** is a Fullstack web platform designed for restaurants and gastronomic businesses to self-manage their dish catalogs efficiently, modernly, and customly. The application allows businesses to digitalize their offerings, enhance the customer experience, and scale their sales through cutting-edge technological tools.

---

## 📈 Tech Stack

The architecture of QMenú relies on modern technologies to guarantee high performance and scalability:

* **Frontend:** `Next.js 16` + `React 19` with `Tailwind CSS` (Responsive and cross-platform design).
* **Backend:** `Node.js` & `Express 5.x`.
* **Database:** `MongoDB` with `Mongoose`.
* **AI:** Integration of language models for smart catalog optimization.
* **Infrastructure:** Optimized deployment with `Vercel Analytics` and `Speed Insights`.

---

## 📝 Key Features

* **Authentication & Profiles:** Comprehensive user system featuring personal data management and profile picture uploads.
* **Admin Dashboard (CRUD):** Intuitive interface for complete control over the dish inventory (Create, Read, Update, Delete).
* **Branding Customization:** Fine-tuning of the menu's aesthetics to align with the restaurant's visual identity.
* **QR Generator:** Dynamic creation of QR codes linked directly to the menu, ready to download and print.
* **Ordering System (Premium):** Direct integration with the WhatsApp API to receive orders in real time.
* **User View:** Fluid, fast, and visually appealing interface to explore dishes without installing external applications.

---

## 🛡️ Production-Grade Security

QMenú implements a multi-level security architecture to protect data integrity:

* **Content Security Policy (CSP):** Strict configuration of HTTP headers to mitigate XSS attacks and ensure only authorized third-party scripts (`Mercado Pago`, `Vercel Analytics`, and `Google Tag Manager`) execute on the client-side.
* **Input Sanitization:** Rigorous data validation on both ends:
    * **Client-side:** `Yup` schemas for immediate user feedback.
    * **Server-side:** Validations with `Joi` and `express-validator` to prevent NoSQL injections.
* **Rate Limiting:** Implementation of `express-rate-limit` to protect critical endpoints against brute-force attacks.
* **Secure Storage:** Credential hashing via `bcryptjs` and session management using **JWT** tokens signed within `HttpOnly` cookies.

---

## ⚙️ Detailed Technical Specifications

### Backend & Core / "m-01back" Repository
* **Asynchronous Routing:** Leverages the latest **Express** features for efficient request handling.
* **Identity Strategy:** Authentication via **JSON Web Tokens (JWT)** integrated with `Passport.js` and `jsonwebtoken`.
* **Data Integrity:** Dual-layer validation to guarantee absolute consistency within the MongoDB schema.

### Frontend & Performance
* **State Management:** Lightweight, fast, and scalable state management using `Zustand`.
* **Animated UX:** Dynamic interfaces powered by `Framer Motion`, `Animate.css`, and `motion`.
* **Media Optimization:** Client-side image processing with `browser-image-compression` prior to **Cloudinary** upload.

### Third-Party Integrations
* **Mercado Pago API:** Complete checkout flow for subscription management.
* **Cloudinary SDK:** Cloud-based transformation and optimized storage for visual assets.
* **QR Generation:** High-resolution code production using `qrcode.react`.

---

## 💡 Installation and Usage

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/nicodsd/mp-02.git](https://github.com/nicodsd/mp-02.git)
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
  First, create a .env.local file in the project root with the following key:
   ```env
    NEXT_PUBLIC_API_URL=http://localhost:[PORT]/
   ```
  Then, create a .env.production file in the project root with the following key:
   ```env
    NEXT_PUBLIC_API_URL="[URL_BACKEND]"
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 📄 License

All right reserved by Nico Barrera.
