/**
 * =================================================================
 * PROYECTO INTEGRADOR: MUNDO A TU ALCANCE (FASE 3)
 * ARCHIVO: app.js (Lógica Principal de la Aplicación)
 * =================================================================
 *
 * Este archivo contiene la lógica de JavaScript para una aplicación
 * de una sola página (SPA).
 *
 * BUENA PRÁCTICA (MODULARIDAD):
 * Separamos la lógica (JS) de la estructura (HTML). El HTML
 * solo contiene las 'plantillas' (<template>), y este
 * script decide cuál mostrar y cuándo, dándoles vida.
 */

// === NÚCLEO DE LA APP (SPA) ===

// El 'div' principal donde se dibujará toda la aplicación.
const app = document.getElementById('app');

/**
 * Función principal de renderizado.
 * Clona una plantilla <template> del HTML y la muestra en el div #app.
 * @param {string} pageId - El ID de la plantilla a mostrar (ej. 'login-page').
 */
function renderPage(pageId) {
    // Limpia el contenido anterior del div #app
    app.innerHTML = '';

    // Encuentra la plantilla en el index.html
    const template = document.getElementById(pageId);
    if (template) {
        // Clona el contenido de la plantilla
        const pageContent = template.content.cloneNode(true);
        // Añade el contenido clonado al div #app
        app.appendChild(pageContent);
    } else {
        console.error(`Error: No se encontró la plantilla con ID: ${pageId}`);
        // Renderiza una página de error simple si no se encuentra la plantilla
        app.innerHTML = `<div class="p-10 text-center"><h1>Error 404: Página no encontrada</h1></div>`;
    }
}

/**
 * BUENA PRÁCTICA (MANTENIMIENTO):
 * Este 'Router' (enrutador) centraliza la navegación. En lugar de tener
 * múltiples archivos HTML, cambiamos la página dinámicamente
 * basándonos en el 'hash' de la URL (ej. #login, #dashboard).
 * Esto hace que la navegación sea instantánea y fácil de mantener.
 */
function router() {
    // Obtiene el 'hash' de la URL (ej. #login). Si no hay, usa #login por defecto.
    const hash = window.location.hash || '#login';

    // Oculta el formulario de creación de viaje si está visible
    hideCreateTripForm();

    // Comprueba si el usuario está autenticado
    const currentUser = getCurrentUser();

    // === Lógica de Rutas Protegidas ===
    if (hash.startsWith('#dashboard') || hash.startsWith('#itinerary') || hash.startsWith('#create-trip')) {
        if (!currentUser) {
            // BUENA PRÁCTICA (SEGURIDAD):
            // Si no hay usuario en la sesión y se intenta acceder
            // a una ruta protegida, se redirige al login.
            window.location.hash = '#login';
            return;
        }
    }

    // === Lógica de Rutas Públicas ===
    if (hash === '#login' && currentUser) {
        // Si el usuario ya está logueado, lo mandamos al dashboard
        window.location.hash = '#dashboard';
        return;
    }

    // === Navegación y Renderizado ===
    // Este switch decide qué página mostrar y qué lógica ejecutar
    // después de mostrarla.
    switch (hash) {
        case '#login':
            renderPage('login-page');
            // Añade los 'event listeners' (escuchadores) al formulario de login
            document.getElementById('login-form').addEventListener('submit', handleLogin);
            document.getElementById('link-to-register').addEventListener('click', () => window.location.hash = '#register');
            break;

        case '#register':
            renderPage('register-page');
            // Añade los 'event listeners' al formulario de registro
            document.getElementById('register-form').addEventListener('submit', handleRegister);
            document.getElementById('link-to-login').addEventListener('click', () => window.location.hash = '#login');
            break;

        case '#dashboard':
            renderPage('dashboard-page');
            // Añade los 'event listeners' del dashboard
            document.getElementById('logout-button').addEventListener('click', handleLogout);
            document.getElementById('add-trip-button').addEventListener('click', showCreateTripForm);
            // Carga y muestra los viajes del usuario
            displayWelcomeMessage();
            renderTrips();
            break;
        
        case '#itinerary':
            // Esta ruta es un ejemplo. Usamos `localStorage` para pasar el ID del viaje.
            renderPage('itinerary-page');
            const tripId = localStorage.getItem('selectedTripId');
            if (tripId) {
                // Busca el viaje en la "base de datos"
                const trip = db.getTrips().find(t => t.id === tripId);
                if (trip) {
                    // Actualiza el título y las fechas del itinerario
                    document.getElementById('itinerary-title').textContent = trip.title;
                    document.getElementById('itinerary-dates').textContent = `${trip.startDate} - ${trip.endDate}`;
                }
            }
            document.getElementById('back-to-dashboard').addEventListener('click', () => window.location.hash = '#dashboard');
            break;

        default:
            // Página no encontrada (si el hash no coincide con nada)
            app.innerHTML = `<div class="p-10 text-center"><h1>Error 404: Página no encontrada</h1><a href="#login">Volver al inicio</a></div>`;
            break;
    }
}

// === LÓGICA DE BASE DE DATOS (Simulada con localStorage) ===

/**
 * BUENA PRÁCTICA (MODULARIDAD):
 * Se crea un objeto 'db' (base de datos) que encapsula
 * (esconde) toda la lógica de cómo se guardan y leen los datos.
 * Si mañana cambiamos de localStorage a una base de datos real (Firebase),
 * solo tendríamos que modificar este objeto, y el resto de la
 * aplicación (handleLogin, handleRegister, etc.) seguiría funcionando
 * igual. Esto se llama 'Abstracción'.
 */
const db = {
    // Helper para leer un item de localStorage y convertirlo de JSON
    get: (key) => {
        return JSON.parse(localStorage.getItem(key) || '[]');
    },
    // Helper para guardar un item en localStorage
    set: (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // --- Funciones para Usuarios ---
    getUsers: function() {
        return this.get('users');
    },
    getUserByEmail: function(email) {
        return this.getUsers().find(user => user.email === email);
    },
    addUser: function(newUser) {
        const users = this.getUsers();
        users.push(newUser);
        this.set('users', users);
    },

    // --- Funciones para Viajes ---
    getTrips: function() {
        return this.get('trips');
    },
    addTrip: function(newTrip) {
        const trips = this.getTrips();
        trips.push(newTrip);
        this.set('trips', trips);
    },
    getTripsByUser: function(userEmail) {
        return this.getTrips().filter(trip => trip.userId === userEmail);
    }
};

// === LÓGICA DE AUTENTICACIÓN ===

/**
 * Obtiene el usuario que ha iniciado sesión.
 * Usamos sessionStorage para simular una "sesión" de usuario que
 * se borra al cerrar el navegador.
 */
function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('currentUser'));
}

/**
 * Maneja el evento de envío del formulario de registro.
 */
function handleRegister(event) {
    event.preventDefault(); // Evita que la página se recargue
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const errorEl = document.getElementById('register-error');

    // Validación simple
    if (password.length < 6) {
        errorEl.textContent = 'La contraseña debe tener al menos 6 caracteres.';
        return;
    }

    // Revisa si el usuario ya existe
    if (db.getUserByEmail(email)) {
        errorEl.textContent = 'Este correo electrónico ya está registrado.';
        return;
    }

    // Guarda el nuevo usuario
    db.addUser({ name, email, password });

    // Redirige al login
    alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
    window.location.hash = '#login';
}

/**
 * Maneja el evento de envío del formulario de login.
 */
function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    const errorEl = document.getElementById('login-error');

    // Busca al usuario en la "base de datos"
    const user = db.getUserByEmail(email);

    // Valida la contraseña
    if (user && user.password === password) {
        // ¡Inicio de sesión exitoso!
        // Guarda al usuario en la "sesión"
        sessionStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
        // Redirige al dashboard
        window.location.hash = '#dashboard';
    } else {
        // Error de autenticación
        errorEl.textContent = 'Correo o contraseña incorrectos.';
    }
}

/**
 * Maneja el cierre de sesión.
 */
function handleLogout() {
    // Borra la sesión
    sessionStorage.removeItem('currentUser');
    // Redirige al login
    window.location.hash = '#login';
}

/**
 * Muestra el nombre del usuario en el dashboard.
 */
function displayWelcomeMessage() {
    const user = getCurrentUser();
    if (user) {
        document.getElementById('welcome-message').textContent = `Hola, ${user.name} 👋`;
    }
}


// === LÓGICA DE VIAJES ===

/**
 * Busca y muestra todos los viajes del usuario actual en el dashboard.
 */
function renderTrips() {
    const user = getCurrentUser();
    if (!user) return; // No debería pasar gracias al router, pero es una buena práctica

    const trips = db.getTripsByUser(user.email);
    const tripsListEl = document.getElementById('trips-list');
    const noTripsMessage = document.getElementById('no-trips-message');

    // Limpia la lista antes de volver a dibujar
    tripsListEl.innerHTML = '';

    if (trips.length === 0) {
        noTripsMessage.classList.remove('hidden');
    } else {
        noTripsMessage.classList.add('hidden');
        
        // BUENA PRÁCTICA (MANTENIMIENTO):
        // Usamos una plantilla <template> (trip-card-template) para
        // las tarjetas de viaje. Si queremos cambiar el diseño de
        // *todas* las tarjetas, solo modificamos la plantilla en
        // un lugar (en el HTML), y esta función seguirá funcionando.
        trips.forEach(trip => {
            const cardTemplate = document.getElementById('trip-card-template');
            const card = cardTemplate.content.cloneNode(true);

            // Rellena los datos de la tarjeta
            card.querySelector('.trip-title').textContent = trip.title;
            card.querySelector('.trip-dates').textContent = `${trip.startDate} - ${trip.endDate}`;
            
            // Añade un 'dataset' para saber qué viaje se clickeó
            const cardLink = card.querySelector('.trip-card');
            cardLink.dataset.tripId = trip.id;
            
            // Añade el 'event listener' para ir al itinerario
            cardLink.addEventListener('click', (e) => {
                e.preventDefault();
                // Guarda el ID del viaje seleccionado para que la página de itinerario sepa qué mostrar
                localStorage.setItem('selectedTripId', trip.id);
                window.location.hash = '#itinerary';
            });
            
            tripsListEl.appendChild(card);
        });
    }
}

/**
 * Muestra el formulario modal para crear un nuevo viaje.
 */
function showCreateTripForm() {
    // Renderiza la página de creación de viaje
    renderPage('create-trip-page');
    // Añade los 'event listeners' al formulario
    document.getElementById('create-trip-form').addEventListener('submit', handleCreateTrip);
    document.getElementById('close-create-trip').addEventListener('click', () => window.location.hash = '#dashboard');
}

/**
 * Oculta el formulario de creación de viaje (en caso de que
 * estemos navegando a otra parte).
 */
function hideCreateTripForm() {
    // Esta función se llama en el router para asegurarse
    // que el formulario de creación (que es como un modal)
    // no se quede visible si el usuario navega a otra parte.
    // En este diseño, el router ya se encarga de redibujar
    // la página, así que esto es una doble seguridad.
}

/**
 * Maneja el envío del formulario de creación de viaje.
 */
function handleCreateTrip(event) {
    event.preventDefault();
    const user = getCurrentUser();
    const form = event.target;
    const errorEl = document.getElementById('create-trip-error');

    // Obtiene los datos del formulario
    const newTrip = {
        id: Date.now().toString(), // Genera un ID único basado en la fecha
        userId: user.email,
        title: form['trip-name'].value,
        destination: form['trip-destination'].value,
        startDate: form['trip-start-date'].value,
        endDate: form['trip-end-date'].value
    };

    // Validación simple de fechas
    if (newTrip.endDate < newTrip.startDate) {
        errorEl.textContent = 'La fecha de fin no puede ser anterior a la fecha de inicio.';
        return;
    }

    // Guarda el viaje en la "base de datos"
    db.addTrip(newTrip);

    // Vuelve al dashboard (donde se verá el nuevo viaje)
    alert('¡Viaje creado con éxito!');
    window.location.hash = '#dashboard';
}


// === INICIALIZACIÓN DE LA APP ===

/**
 * Función de inicialización.
 * Se ejecuta cuando la página se carga por primera vez.
 */
function init() {
    // Configura el router para que escuche los cambios de 'hash'
    window.addEventListener('hashchange', router);
    // Llama al router una vez al cargar la página para mostrar la pantalla inicial
    router();
}

// Inicia la aplicación cuando se carga la ventana
window.addEventListener('load', init);