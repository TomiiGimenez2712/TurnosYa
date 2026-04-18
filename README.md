# Turnos YA - Reserva de Canchas 🎾⚽

Una aplicación web moderna, rápida y responsiva diseñada para facilitar la gestión y reserva de canchas deportivas. Construida con un enfoque minimalista y optimizada tanto para administradores como para clientes.

## 🚀 Características Principales

- **Interfaz Intuitiva y Moderna**: Diseño responsivo y amigable para dispositivos móviles usando TailwindCSS.
- **Reserva de Turnos**: Selección de fechas, canchas y horarios disponibles con formularios simples.
- **Panel de Administrador**: Gestión de configuración, disponibilidad, canchas y visualización de reservas.
- **Arquitectura Multicapa**: Código refactorizado y organizado en capas claras para maximizar la mantenibilidad (Presentación, Lógica, Datos).
- **Gestión de Base de Datos y Autenticación**: Impulsado por Supabase.

## 🏗️ Arquitectura del Proyecto

El proyecto está diseñado bajo un estricto patrón de **Arquitectura Multicapa (N-Tier)**, dividiendo las responsabilidades en capas claras para favorecer la escalabilidad, separación de intereses (SoC) y la fácil mantenibilidad.

### 🌳 Mapa de Directorios (Distribución de Archivos)

```text
Turnos_YA/
├── index.html                   # Punto de entrada y redirección (Router Frontal)
├── capaDePresentacion/          # Capa Nivel 1: Interfaz de Usuario (UI)
│   ├── index.html               # Frontend principal (Vista Clientes: Selección de turnos)
│   ├── admin.html               # Dashboard de gestión de agenda (Vista Staff)
│   ├── configuracion.html       # Interfaz de alta de canchas y definición de datos comerciales
│   ├── misReservas.html         # Portal de autogestión y consulta de turnos para clientes
│   ├── login.html               # Formulario de autenticación administrativa
│   ├── style.css                # Hoja de estilos complementaria (Tailwind va por CDN)
│   └── ui.js                    # Utilidades de DOM globales (Renderizado de alertas y dialogos)
│
├── capaDeLogica/                # Capa Nivel 2: Reglas de Negocio y Controladores
│   ├── app.js                   # Orquestador del Frontend (Maneja el flujo principal cliente-reserva)
│   ├── canchaController.js      # Controlador encargado del CRUD de Canchas y gestión de Reservas (Admin)
│   ├── disponibilidadService.js # Lógica de validación atómica de horarios, solapamientos y turnos
│   ├── authService.js           # Validador y gestor seguro de las sesiones (Router Guard)
│   ├── configController.js      # Gestiona datos y configuraciones estables del sistema
│   ├── canchaFactory.js         # Implementación del patrón Factory Method para estructurar canchas
│   └── cancha.js                # Modelo abstracto del dominio
│
└── capaDeDatos/                 # Capa Nivel 3: Persistencia y Acceso a Datos
    ├── supabaseClient.js        # Patrón Singleton para conexión a BD y funciones Wrapper SQL (createReserva)
    └── supabase/                # Referencias y migraciones históricas locales del BaaS
```

**¿Cómo es el flujo de las cosas?**
1. Los archivos ubicados en la `capaDePresentacion` (Vistas) capturan la intención del usuario a través del DOM y eventos HTML.
2. Estos eventos son delegados inmediatamente a los **Controladores** y **Servicios** correspondientes dentro de la `capaDeLogica`, garantizando que la UI sea tonta (no decida nada).
3. La lógica examina el negocio (por ejemplo, usando `validarSolapamiento`), y si está todo en orden, se comunica bidireccionalmente con la `capaDeDatos` donde se orquestan las consultas asíncronas de Supabase.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (Módulos ES6)
- **Estilos**: [TailwindCSS](https://tailwindcss.com/) (Vía CDN)
- **Backend as a Service (BaaS)**: [Supabase](https://supabase.com/) (Base de datos PostgreSQL y Autenticación)
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
- `/Capa_de_Presentacion/admin.html` -> Dashboard principal para la administración del sistema.
- `/Capa_de_Presentacion/configuracion.html` -> Ajuste de reglas de negocio, horarios del predio y datos de pago.
- `/Capa_de_Presentacion/mis_reservas.html` -> Vista rápida para que los clientes consulten el estado de sus reservas.

---
_Desarrollado para optimizar la gestión de centros deportivos._
