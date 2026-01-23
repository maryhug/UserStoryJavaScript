// ========================================
// GESTIÓN DINÁMICA DEL DOM CON PERSISTENCIA
// Historia de Usuario - Semana 3
// ========================================

// TASK 2: Selección e inspección de elementos del DOM

// Seleccionamos el input usando getElementById
const inputNota = document.getElementById('inputNota');

// Seleccionamos el botón usando querySelector
const btnAgregar = document.querySelector('#btnAgregar');

// Seleccionamos la lista (ul) usando getElementById
const listaNotas = document.getElementById('listaNotas');

// Seleccionamos el contador de notas
const contadorElemento = document.getElementById('contador');

// Loggeamos las referencias en consola para confirmar que existen
console.log('=== REFERENCIAS DEL DOM ===');
console.log('Input de nota:', inputNota);
console.log('Botón agregar:', btnAgregar);
console.log('Lista de notas:', listaNotas);
console.log('Contador:', contadorElemento);

// TASK 5: Array en memoria para mantener las notas
let notas = [];

// ========================================
// FUNCIONES PRINCIPALES
// ========================================

/**
 * Actualiza el contador de notas en la interfaz
 */
const actualizarContador = () => {
    const cantidad = notas.length;
    contadorElemento.textContent = `${cantidad} ${cantidad === 1 ? 'nota guardada' : 'notas guardadas'}`;
};

/**
 * TASK 5: Guarda las notas en Local Storage
 */
const guardarEnLocalStorage = () => {
    // Convertimos el array a JSON y lo guardamos
    localStorage.setItem('notas', JSON.stringify(notas));
    console.log(`✅ Notas guardadas en Local Storage (Total: ${notas.length})`);
    console.log('Contenido guardado:', notas);
};

/**
 * TASK 5: Carga las notas desde Local Storage
 */
const cargarDesdeLocalStorage = () => {
    // Intentamos obtener las notas del Local Storage
    const notasGuardadas = localStorage.getItem('notas');

    if (notasGuardadas) {
        // Si existen, las parseamos de JSON a array
        notas = JSON.parse(notasGuardadas);
        console.log(`📥 ${notas.length} nota(s) cargada(s) desde Local Storage`);
        console.log('Notas cargadas:', notas);

        // IMPORTANTE: Limpiamos la lista antes de renderizar
        listaNotas.innerHTML = '';

        // Renderizamos cada nota en el DOM
        notas.forEach((textoNota) => {
            crearElementoNota(textoNota);
        });

        actualizarContador();
    } else {
        console.log('ℹ️ No hay notas previas en Local Storage');
    }
};

/**
 * TASK 3: Crea un elemento <li> para una nota en el DOM
 * @param {string} textoNota - El texto de la nota a crear
 */
const crearElementoNota = (textoNota) => {
    // Creamos el elemento <li>
    const li = document.createElement('li');

    // Creamos un span para el texto de la nota
    const spanTexto = document.createElement('span');
    spanTexto.className = 'nota-texto';
    spanTexto.textContent = textoNota;

    // Creamos el botón "Eliminar"
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = 'btn-eliminar';

    // TASK 4: Agregamos evento de click al botón eliminar
    btnEliminar.addEventListener('click', () => {
        eliminarNota(li, textoNota);
    });

    // Agregamos el texto y el botón al <li>
    li.appendChild(spanTexto);
    li.appendChild(btnEliminar);

    // TASK 3: Insertamos el <li> en la lista usando appendChild()
    listaNotas.appendChild(li);
};

/**
 * TASK 3: Agrega una nueva nota al DOM y al array
 */
const agregarNota = () => {
    // Obtenemos el valor del input y quitamos espacios en blanco
    const textoNota = inputNota.value.trim();

    // TASK 3: Validamos que el input no esté vacío
    if (textoNota === '') {
        alert('⚠️ Por favor, escribe una nota antes de agregar.');
        inputNota.focus();
        return;
    }

    // Agregamos la nota al array en memoria
    notas.push(textoNota);

    // Creamos el elemento visual en el DOM
    crearElementoNota(textoNota);

    // TASK 5: Guardamos en Local Storage
    guardarEnLocalStorage();

    // TASK 3: Limpiamos el input y enfocamos de nuevo
    inputNota.value = '';
    inputNota.focus();

    // Actualizamos el contador
    actualizarContador();

    // Imprimimos en consola
    console.log(`➕ Nota agregada: "${textoNota}"`);
};

/**
 * TASK 4: Elimina una nota del DOM y del array
 * @param {HTMLElement} elementoLi - El elemento <li> a eliminar
 * @param {string} textoNota - El texto de la nota a eliminar
 */
const eliminarNota = (elementoLi, textoNota) => {
    // TASK 4: Removemos el <li> usando removeChild() desde la <ul>
    listaNotas.removeChild(elementoLi);

    // Eliminamos la nota del array
    const indice = notas.indexOf(textoNota);
    if (indice > -1) {
        notas.splice(indice, 1);
    }

    // TASK 5: Actualizamos Local Storage
    guardarEnLocalStorage();

    // Actualizamos el contador
    actualizarContador();

    // TASK 4: Imprimimos en consola que se eliminó
    console.log(`🗑️ Nota eliminada: "${textoNota}"`);
};

// ========================================
// EVENT LISTENERS
// ========================================

// Evento click en el botón "Agregar"
btnAgregar.addEventListener('click', agregarNota);

// Evento para agregar nota al presionar Enter
inputNota.addEventListener('keypress', (evento) => {
    if (evento.key === 'Enter') {
        agregarNota();
    }
});

// ========================================
// INICIALIZACIÓN
// ========================================

// TASK 5: Al cargar la página, recuperamos las notas de Local Storage
console.log('=== APLICACIÓN INICIADA ===');
cargarDesdeLocalStorage();

// ========================================
// FIN DEL SISTEMA DE GESTIÓN DE NOTAS
// ========================================
