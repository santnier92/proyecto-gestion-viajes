### 1. Implementación de Funcionalidades (Producto Mínimo Viable)

Para el primer punto de la Fase 3, se ha desarrollado un prototipo funcional en HTML, CSS (Tailwind) y JavaScript que materializa los requisitos "Must-Have" (prioridad 1) definidos en la Fase 1 y priorizados en la Fase 2.

Este prototipo funcional es una Aplicación de Una Sola Página (SPA) que simula la experiencia de usuario central de la aplicación "Mundo a tu Alcance". Las siguientes son las funcionalidades implementadas:

**1. Funcionalidad: Gestión de Cuentas (RF01, RF03)**
* **Implementación:** Se han implementado las pantallas de "Registro" y "Login". El sistema permite a un nuevo usuario registrarse. Los datos del usuario (nombre, email, contraseña) se guardan en una simulación de base de datos utilizando el `localStorage` del navegador. Un usuario registrado puede iniciar sesión y el sistema valida sus credenciales.
* **Requisitos Cubiertos:** RF01 (Registro), RF03 (Login).

**2. Funcionalidad: Creación de Viajes (RF06)**
* **Implementación:** Una vez dentro de la aplicación, el usuario puede acceder a un formulario modal para "Crear un Nuevo Viaje". Este formulario solicita el nombre del viaje, el destino y las fechas. Al guardarlo, el viaje se asocia con el usuario actual y se almacena en la base de datos (`localStorage`).
* **Requisitos Cubiertos:** RF06 (Crear Viaje).

**3. Funcionalidad: Dashboard de Viajes (RF07)**
* **Implementación:** El "Dashboard" es la pantalla principal después de iniciar sesión. El sistema consulta la base de datos y muestra una lista de todas las tarjetas de viaje que el usuario ha creado. Si no ha creado ningún viaje, muestra un mensaje invitándolo a hacerlo.
* **Requisitos Cubiertos:** RF07 (Ver listado de viajes).

**4. Funcionalidad: Navegación y Sesiones (SPA)**
* **Implementación:** La aplicación funciona como una SPA (Single Page Application). El JavaScript gestiona la navegación entre "páginas" (Login, Registro, Dashboard, Itinerario) sin recargar el navegador, utilizando el *hash* de la URL (ej. `#login`, `#dashboard`).
* **Seguridad de Sesión:** El sistema implementa "rutas protegidas". Un usuario no puede acceder al `#dashboard` si no ha iniciado sesión. La sesión del usuario se mantiene en `sessionStorage`, por lo que se cierra automáticamente al cerrar el navegador.

**5. Funcionalidad: Ver Itinerario (Base) (RF13)**
* **Implementación:** Al hacer clic en una tarjeta de viaje en el Dashboard, el usuario es llevado a una página de "Itinerario" (RF13). Esta página de momento es una plantilla que muestra el título y las fechas del viaje seleccionado. La implementación completa de la línea de tiempo (RF14) se deja para una siguiente iteración.
* **Requisitos Cubiertos:** RF13 (Base para añadir actividades).