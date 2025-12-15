# 🍰 Pastelería Mil Sabores - Frontend

Interfaz de usuario moderna y responsiva desarrollada con **React 18** y **Vite**. Ofrece una experiencia de compra fluida con diseño "Glassmorphism", gestión de carrito en tiempo real y paneles de administración dedicados.

## Tecnologías Utilizadas

* **React 18** (Functional Components & Hooks)
* **Vite** (Build tool ultrarrápido)
* **CSS Modules / Custom CSS** (Diseño Glassmorphism y Responsive)
* **React Router DOM** (Navegación SPA)
* **Fetch API** (Consumo de servicios REST)
* **LocalStorage** (Persistencia de sesión y carrito)

## Características Clave

* **Experiencia de Usuario (UX):**
    * Diseño Responsivo (Mobile First) con menú hamburguesa.
    * Notificaciones flotantes (Toasts) para feedback de acciones.
    * Modales de confirmación personalizados.
* **Tienda y Carrito:**
    * Lógica de carrito persistente.
    * **Motor de Descuentos:** Cálculo automático (Cumpleaños Alumno Duoc, Tercera Edad).
    * **Pasarela de Pago Simulada:** Integración visual con PayPal (Spinner de carga y validación).
* **Seguridad:**
    * Manejo de sesión mediante **JWT**.
    * Rutas protegidas (`/admin`, `/perfil`) según el Rol del usuario.
* **Gestión (Backoffice):**
    * Panel de Administrador con Dashboard de métricas.
    * CRUD visual de Productos y Usuarios.
    * Historial de ventas con descarga de Boletas PDF.

## Instalación y Ejecución

### Prerrequisitos
* Tener instalado **Node.js** (v16 o superior).

### Pasos para ejecutar

1.  **Entrar a la carpeta del proyecto:**
    ```bash
    cd frontend-pasteleria
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  **Abrir en el navegador:**


## Credenciales de Prueba

Para facilitar la evaluación, el sistema cuenta con usuarios pre-cargados (si se importó el script SQL):

| Rol | Email | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin@mil.cl` | `123456` |
| **Vendedor** | `vendedor@mil.cl` | `123456` |
| **Cliente** | `cliente@mil.cl` | `123456` | --> | **Cliente** | `cliente@duocuc.cl` | `123456` |

## 📸 Capturas

*(Puedes agregar aquí las capturas de pantalla de tu Manual de Usuario para que se vea genial en GitHub)*

---
**Desarrollado por:** Solange Labbé - DESARROLLO FULLSTACK II 003D
