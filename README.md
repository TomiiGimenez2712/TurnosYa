# Turnos YA - Reserva de Canchas 🎾⚽

Una aplicación web moderna, rápida y responsiva diseñada para facilitar la gestión y reserva de canchas deportivas. Construida con un enfoque minimalista y optimizada tanto para administradores como para clientes.

## 🚀 Características Principales

- **Interfaz Intuitiva y Moderna**: Diseño responsivo y amigable para dispositivos móviles usando TailwindCSS.
- **Reserva de Turnos**: Selección de fechas, canchas y horarios disponibles con formularios simples.
- **Panel de Administrador**: Gestión de configuración, disponibilidad, canchas y visualización de reservas.
- **Arquitectura Multicapa**: Código refactorizado y organizado en capas claras para maximizar la mantenibilidad (Presentación, Lógica, Datos).
- **Integración con WhatsApp**: Envío de comprobantes de transferencia directamente por WhatsApp.
- **Gestión de Base de Datos y Autenticación**: Impulsado por Supabase.

## 🏗️ Arquitectura del Proyecto

El proyecto está diseñado bajo un estricto patrón de **Arquitectura Multicapa (N-Tier)**, dividiendo las responsabilidades lógicas y físicas del sistema de la siguiente manera:

- 📂 **`Capa_de_Presentacion/`**: Contiene todo lo relacionado con la Interfaz de Usuario (UI). Páginas HTML (`index.html`, `admin.html`, `login.html`, etc.), hojas de estilo (`style.css`) y scripts orientados exclusivamente al DOM (`UI.js`).
- 📂 **`Capa_de_Logica/`**: El núcleo de la aplicación. Maneja las reglas de negocio, los controladores y los servicios (`app.js`, `AdminController.js`, `DisponibilidadService.js`, `CanchaFactory.js`, etc.).
- 📂 **`Capa_de_Datos/`**: Encargada de la persistencia e interacción con la base de datos externa (`supabaseClient.js`).

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (Módulos ES6)
- **Estilos**: [TailwindCSS](https://tailwindcss.com/) (Vía CDN)
- **Backend as a Service (BaaS)**: [Supabase](https://supabase.com/) (Base de datos PostgreSQL y Autenticación)
- **Notificaciones/Emails**: [EmailJS](https://www.emailjs.com/)
- **Iconografía**: Google Material Symbols

## ⚙️ Instalación y Uso Local

Dado que la aplicación funciona predominantemente en el lado del cliente (Client-Side con BaaS), su ejecución es extremadamente sencilla:

1. **Clonar/Descargar el repositorio.**
2. **Abrir el proyecto** en cualquier entorno de desarrollo o servidor local (por ejemplo, usando la extensión _Live Server_ de VSCode o `npx serve`).
3. **Punto de Entrada**: Navegar al archivo `Capa_de_Presentacion/index.html` para la vista de clientes.
4. **Configuración de Entorno**: Asegurate de revisar el archivo en `Capa_de_Datos/supabase/supabaseClient.js` para confirmar que las credenciales de Supabase estén correctamente conectadas si es que planeas usar tu propia instancia.

## 📱 Vistas Principales

- `/Capa_de_Presentacion/index.html` -> Página principal para reserva de clientes.
- `/Capa_de_Presentacion/login.html` -> Ingreso seguro para el personal/administradores.
- `/Capa_de_Presentacion/admin.html` -> Dashboard principal para la administración del club.
- `/Capa_de_Presentacion/configuracion.html` -> Ajuste de reglas de negocio, horarios del club y datos de pago.
- `/Capa_de_Presentacion/mis_reservas.html` -> Vista rápida para que los clientes consulten el estado de sus reservas.

---
_Desarrollado para optimizar la gestión de centros deportivos._
