✈️ Mundo a tu Alcance: Prototipo Funcional

Un prototipo funcional de una aplicación de gestión de viajes, desarrollado como parte del "Proyecto Integrador".

Estado del Proyecto: Fase 3 - Implementación de Funcionalidades Clave.

🚀 Demo en Vivo (GitHub Pages)

Puedes probar la aplicación funcional directamente en tu navegador. Toda la información (usuarios y viajes) se guardará localmente en tu navegador usando localStorage.

Haz clic aquí para probar la aplicación

(Nota: Este enlace asume que tu repositorio se llama proyecto-integrador-actividad-2 y tu usuario es santnier92. Si es diferente, ajusta el enlace).

📸 Vista Previa de la Aplicación

Aquí puedes ver el flujo principal de la aplicación que ha sido implementado.

1. Inicio de Sesión y Registro

El usuario puede iniciar sesión o navegar para crear una nueva cuenta.

2. Dashboard (Mis Viajes)

Una vez dentro, el usuario ve su panel principal con los viajes que ha creado.

3. Crear Viaje (Modal)

Al hacer clic en el botón "+", el usuario puede rellenar un formulario para añadir un nuevo viaje.

4. Itinerario (Plantilla)

Al hacer clic en un viaje, el usuario es llevado a la pantalla de itinerario (actualmente una plantilla funcional).

✨ Características Implementadas (Fase 3)

Este prototipo funcional es una Aplicación de Una Sola Página (SPA) que implementa las funcionalidades "Must-Have" definidas en la Fase 1:

🔐 Autenticación de Usuarios:

Registro de nuevos usuarios.

Inicio de sesión (Login) con validación de credenciales.

Cierre de sesión.

✈️ Gestión de Viajes:

Creación de nuevos viajes (nombre, destino, fechas).

Dashboard principal que muestra un listado de los viajes creados por el usuario.

Mensaje dinámico si el usuario no tiene viajes creados.

🧭 Navegación y Sesiones:

Navegación entre páginas (Login, Registro, Dashboard, Itinerario) sin recargar el navegador.

Enrutamiento basado en hash (ej. #login, #dashboard).

Rutas protegidas: El usuario no puede acceder al Dashboard si no ha iniciado sesión.

La sesión de usuario se simula con sessionStorage.

💾 Persistencia de Datos (Simulada):

Todos los usuarios y viajes se guardan en el localStorage del navegador, simulando una base de datos.

💻 Stack Tecnológico y Arquitectura

Frontend: HTML5, JavaScript (ES6+), Tailwind CSS

Arquitectura: SPA (Single Page Application)

Base de Datos (Simulada): localStorage y sessionStorage del navegador

Diseño y Prototipado: Figma

Hosting: GitHub Pages

📂 Estructura del Código

Siguiendo las buenas prácticas de modularidad, el código está separado lógicamente:

index.html: Contiene el esqueleto de la aplicación. Todas las pantallas se almacenan como etiquetas <template> invisibles, manteniendo el HTML limpio y semántico.

app.js: Es el cerebro de la aplicación. Contiene toda la lógica para:

Renderizar las plantillas (<template>) en el DOM.

Manejar el enrutamiento (el "router" de la SPA).

Gestionar los eventos (clics, envíos de formulario).

Simular la base de datos (a través del objeto db) y la lógica de autenticación.

🏃‍♂️ Cómo Ejecutarlo Localmente

Clona o descarga este repositorio.

Asegúrate de que index.html y app.js estén en la misma carpeta.

Abre index.html en tu navegador web (¡No se requiere un servidor local!).

Autor: Santiago Nieto Rodriguez
Curso: Proyecto Integrador
Institución: Universidad de La Salle
