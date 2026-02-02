// ============================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ============================================

// URL de la API (JSON Server local - puerto 3000)
const API_URL = 'http://localhost:3000/productos';

// Arreglo global para almacenar los productos
let productos = [];

// Variable para rastrear si estamos editando
let editandoProducto = null;

// ============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================

/**
 * Función que se ejecuta cuando el DOM está completamente cargado
 * Inicializa todos los event listeners y carga los datos
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Aplicación iniciada correctamente');

    // Cargar productos desde Local Storage al iniciar
    cargarDesdeLocalStorage();

    // Renderizar productos en el DOM
    renderizarProductos();

    // Configurar event listeners
    configurarEventListeners();

    console.log(`Productos cargados: ${productos.length}`);
});

// ============================================
// CONFIGURACIÓN DE EVENT LISTENERS
// ============================================

/**
 * Configura todos los event listeners de la aplicación
 */
function configurarEventListeners() {
    // Event listener para el formulario
    const formulario = document.getElementById('productForm');
    formulario.addEventListener('submit', manejarSubmitFormulario);

    // Event listener para el botón de sincronización
    const btnSync = document.getElementById('btnSync');
    btnSync.addEventListener('click', sincronizarConServidor);

    console.log('Event listeners configurados');
}

// ============================================
// TASK 2: CAPTURA E INTERACCIÓN CON USUARIO
// ============================================

/**
 * Maneja el evento submit del formulario
 * Valida los datos y agrega/actualiza el producto
 */
function manejarSubmitFormulario(evento) {
    // Prevenir el comportamiento por defecto del formulario
    evento.preventDefault();

    // Capturar valores del formulario
    const nombre = document.getElementById('productName').value.trim();
    const precio = parseFloat(document.getElementById('productPrice').value);
    const descripcion = document.getElementById('productDescription').value.trim();
    const productoId = document.getElementById('productId').value;

    // Validar los datos capturados
    if (!validarDatosProducto(nombre, precio)) {
        return; // Si la validación falla, no continuar
    }

    // Crear objeto producto
    const producto = {
        id: productoId || generarId(),
        nombre: nombre,
        precio: precio,
        descripcion: descripcion,
        fechaCreacion: new Date().toISOString(),
        sincronizado: false
    };

    // Verificar si estamos editando o agregando
    if (editandoProducto !== null) {
        actualizarProducto(producto);
    } else {
        agregarProducto(producto);
    }

    // Limpiar el formulario
    limpiarFormulario();
}

/**
 * Valida que los datos del producto sean correctos
 */
function validarDatosProducto(nombre, precio) {
    // Validar que el nombre no esté vacío
    if (nombre === '') {
        mostrarMensaje('El nombre del producto es obligatorio', 'error');
        console.error('Error de validación: nombre vacío');
        return false;
    }

    // Validar que el nombre tenga al menos 3 caracteres
    if (nombre.length < 3) {
        mostrarMensaje('El nombre debe tener al menos 3 caracteres', 'error');
        console.error('Error de validación: nombre muy corto');
        return false;
    }

    // Validar que el precio sea un número válido
    if (isNaN(precio) || precio <= 0) {
        mostrarMensaje('El precio debe ser un número mayor a 0', 'error');
        console.error('Error de validación: precio inválido');
        return false;
    }

    console.log('✅ Validación exitosa');
    return true;
}

/**
 * Genera un ID único para nuevos productos
 */
function generarId() {
    return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ============================================
// OPERACIONES CRUD - ARREGLO LOCAL
// ============================================

/**
 * Agrega un nuevo producto al arreglo
 */
function agregarProducto(producto) {
    // Agregar producto al arreglo
    productos.push(producto);

    console.log('Producto agregado:', producto);

    // Guardar en Local Storage
    guardarEnLocalStorage();

    // Renderizar la lista actualizada
    renderizarProductos();

    // Mostrar mensaje de éxito
    mostrarMensaje(`Producto "${producto.nombre}" agregado exitosamente`, 'success');
}

/**
 * Actualiza un producto existente
 */
function actualizarProducto(productoActualizado) {
    // Encontrar el índice del producto
    const indice = productos.findIndex(p => p.id === productoActualizado.id);

    if (indice !== -1) {
        // Mantener el estado de sincronización
        productoActualizado.sincronizado = productos[indice].sincronizado;

        // Actualizar el producto
        productos[indice] = productoActualizado;

        console.log('Producto actualizado:', productoActualizado);

        // Guardar en Local Storage
        guardarEnLocalStorage();

        // Renderizar la lista actualizada
        renderizarProductos();

        // Mostrar mensaje de éxito
        mostrarMensaje(`Producto "${productoActualizado.nombre}" actualizado`, 'success');

        // Resetear estado de edición
        editandoProducto = null;

        // Restaurar texto del botón
        document.getElementById('formTitle').textContent = 'Agregar Nuevo Producto';
        document.getElementById('btnSubmitText').textContent = 'Agregar Producto';
    }
}

/**
 * Elimina un producto del arreglo
 */
function eliminarProducto(id) {
    // Confirmar eliminación
    const producto = productos.find(p => p.id === id);

    if (confirm(`¿Estás seguro de eliminar "${producto.nombre}"?`)) {
        // Filtrar el arreglo excluyendo el producto
        productos = productos.filter(p => p.id !== id);

        console.log('Producto eliminado:', id);

        // Guardar en Local Storage
        guardarEnLocalStorage();

        // Renderizar la lista actualizada
        renderizarProductos();

        // Mostrar mensaje de éxito
        mostrarMensaje('Producto eliminado correctamente', 'success');
    }
}

/**
 * Prepara un producto para ser editado
 */
function editarProducto(id) {
    // Encontrar el producto
    const producto = productos.find(p => p.id === id);

    if (producto) {
        // Llenar el formulario con los datos del producto
        document.getElementById('productName').value = producto.nombre;
        document.getElementById('productPrice').value = producto.precio;
        document.getElementById('productDescription').value = producto.descripcion || '';
        document.getElementById('productId').value = producto.id;

        // Cambiar el estado a edición
        editandoProducto = id;

        // Cambiar texto del formulario
        document.getElementById('formTitle').textContent = 'Editar Producto';
        document.getElementById('btnSubmitText').textContent = 'Guardar Cambios';

        // Scroll al formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });

        console.log('Editando producto:', producto);
    }
}

// ============================================
// TASK 3: MANIPULACIÓN DINÁMICA DEL DOM
// ============================================

/**
 * Renderiza todos los productos en el DOM
 */
function renderizarProductos() {
    // Obtener el contenedor de la lista
    const listaProductos = document.getElementById('productList');

    // Limpiar la lista actual usando innerHTML
    listaProductos.innerHTML = '';

    // Verificar si hay productos
    if (productos.length === 0) {
        mostrarEstadoVacio(listaProductos);
        return;
    }

    // Crear elementos para cada producto
    productos.forEach(producto => {
        const elementoProducto = crearElementoProducto(producto);

        // Agregar al DOM usando appendChild
        listaProductos.appendChild(elementoProducto);
    });

    console.log(`${productos.length} productos renderizados en el DOM`);
}

/**
 * Crea un elemento DOM para un producto
 */
function crearElementoProducto(producto) {
    // Crear elemento <li>
    const li = document.createElement('li');
    li.className = 'product-item';
    li.setAttribute('data-id', producto.id);

    // Crear estructura HTML del producto
    li.innerHTML = `
        <div class="product-header">
            <div class="product-info">
                <h3>${escapeHTML(producto.nombre)}</h3>
                <span class="badge ${producto.sincronizado ? 'badge-synced' : 'badge-local'}">
                    ${producto.sincronizado ? '✓ Sincronizado' : '⚠ Local'}
                </span>
            </div>
            <div class="product-price">$${producto.precio.toFixed(2)}</div>
        </div>
        ${producto.descripcion ? `
            <p class="product-description">${escapeHTML(producto.descripcion)}</p>
        ` : ''}
        <div class="product-actions">
            <button class="btn btn-edit" onclick="editarProducto('${producto.id}')">
                Editar
            </button>
            <button class="btn btn-delete" onclick="eliminarProducto('${producto.id}')">
                Eliminar
            </button>
        </div>
    `;

    return li;
}

/**
 * Muestra un mensaje cuando no hay productos
 */
function mostrarEstadoVacio(contenedor) {
    const divVacio = document.createElement('div');
    divVacio.className = 'empty-state';
    divVacio.innerHTML = `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4">
            </path>
        </svg>
        <h3>No hay productos registrados</h3>
        <p>Agrega tu primer producto usando el formulario</p>
    `;

    contenedor.appendChild(divVacio);
}

/**
 * Escapa caracteres HTML para prevenir XSS
 */
function escapeHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

/**
 * Limpia el formulario después de agregar/editar
 */
function limpiarFormulario() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    editandoProducto = null;

    // Restaurar textos originales
    document.getElementById('formTitle').textContent = 'Agregar Nuevo Producto';
    document.getElementById('btnSubmitText').textContent = 'Agregar Producto';
}

/**
 * Muestra mensajes al usuario en el DOM
 */
function mostrarMensaje(texto, tipo = 'success') {
    const messageBox = document.getElementById('messageBox');

    // Configurar el mensaje
    messageBox.textContent = texto;
    messageBox.className = `message ${tipo} show`;

    console.log(`Mensaje (${tipo}): ${texto}`);

    // Ocultar después de 3 segundos
    setTimeout(() => {
        messageBox.classList.remove('show');
    }, 3000);
}

// ============================================
// TASK 4: PERSISTENCIA EN LOCAL STORAGE
// ============================================

/**
 * Guarda el arreglo de productos en Local Storage
 */
function guardarEnLocalStorage() {
    try {
        // Convertir el arreglo a JSON
        const productosJSON = JSON.stringify(productos);

        // Guardar en Local Storage
        localStorage.setItem('productos', productosJSON);

        console.log('Datos guardados en Local Storage:', productos.length, 'productos');
    } catch (error) {
        console.error('Error al guardar en Local Storage:', error);
        mostrarMensaje('Error al guardar los datos localmente', 'error');
    }
}

/**
 * Carga los productos desde Local Storage
 */
function cargarDesdeLocalStorage() {
    try {
        // Obtener datos de Local Storage
        const productosJSON = localStorage.getItem('productos');

        // Verificar si hay datos guardados
        if (productosJSON) {
            // Parsear JSON a arreglo
            productos = JSON.parse(productosJSON);
            console.log('Datos cargados desde Local Storage:', productos.length, 'productos');
        } else {
            console.log('No hay datos previos en Local Storage');
            productos = [];
        }
    } catch (error) {
        console.error('Error al cargar desde Local Storage:', error);
        productos = [];
        mostrarMensaje('Error al cargar datos guardados', 'error');
    }
}

// ============================================
// TASK 5: INTEGRACIÓN CON FETCH API
// ============================================

/**
 * Sincroniza los productos con el servidor
 */
async function sincronizarConServidor() {
    console.log('Iniciando sincronización con servidor...');
    mostrarLoading(true);

    try {
        // 1. Obtener productos del servidor (GET)
        await obtenerProductosDelServidor();

        // 2. Enviar productos locales no sincronizados (POST)
        await enviarProductosAlServidor();

        mostrarMensaje('Sincronización completada exitosamente', 'success');
        console.log('Sincronización completada');

    } catch (error) {
        console.error('Error en la sincronización:', error);
        mostrarMensaje('Error al sincronizar con el servidor. Verifica que JSON Server esté ejecutándose.', 'error');
    } finally {
        mostrarLoading(false);
    }
}

/**
 * GET: Obtiene todos los productos del servidor
 */
async function obtenerProductosDelServidor() {
    try {
        console.log('GET: Obteniendo productos del servidor...');

        const respuesta = await fetch(API_URL);

        // Verificar si la respuesta es exitosa
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }

        const productosServidor = await respuesta.json();

        console.log(`GET exitoso: ${productosServidor.length} productos recibidos`);

        // Mergear productos del servidor con locales
        mergearProductos(productosServidor);

    } catch (error) {
        console.error('Error en GET:', error);
        throw error;
    }
}

/**
 * POST: Envía nuevos productos al servidor
 */
async function enviarProductosAlServidor() {
    // Filtrar productos no sincronizados
    const productosNoSincronizados = productos.filter(p => !p.sincronizado);

    if (productosNoSincronizados.length === 0) {
        console.log('No hay productos pendientes de sincronización');
        return;
    }

    console.log(`POST: Enviando ${productosNoSincronizados.length} productos al servidor...`);

    // Enviar cada producto
    for (const producto of productosNoSincronizados) {
        try {
            const respuesta = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: producto.nombre,
                    precio: producto.precio,
                    descripcion: producto.descripcion,
                    fechaCreacion: producto.fechaCreacion
                })
            });

            if (!respuesta.ok) {
                throw new Error(`HTTP error! status: ${respuesta.status}`);
            }

            const productoCreado = await respuesta.json();

            // Actualizar el producto local con el ID del servidor
            const indice = productos.findIndex(p => p.id === producto.id);
            if (indice !== -1) {
                productos[indice].sincronizado = true;
                productos[indice].idServidor = productoCreado.id;
            }

            console.log('POST exitoso para:', producto.nombre);

        } catch (error) {
            console.error('Error en POST para:', producto.nombre, error);
        }
    }

    // Guardar cambios en Local Storage
    guardarEnLocalStorage();

    // Actualizar DOM
    renderizarProductos();
}

/**
 * PUT: Actualiza un producto en el servidor
 */
async function actualizarProductoEnServidor(producto) {
    if (!producto.idServidor) {
        console.log('Producto no tiene ID de servidor, omitiendo PUT');
        return;
    }

    try {
        console.log('PUT: Actualizando producto en servidor...');

        const respuesta = await fetch(`${API_URL}/${producto.idServidor}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: producto.nombre,
                precio: producto.precio,
                descripcion: producto.descripcion,
                fechaCreacion: producto.fechaCreacion
            })
        });

        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }

        console.log('PUT exitoso');

    } catch (error) {
        console.error('Error en PUT:', error);
        throw error;
    }
}

/**
 * DELETE: Elimina un producto del servidor
 */
async function eliminarProductoDelServidor(idServidor) {
    try {
        console.log('DELETE: Eliminando producto del servidor...');

        const respuesta = await fetch(`${API_URL}/${idServidor}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }

        console.log('DELETE exitoso');

    } catch (error) {
        console.error('Error en DELETE:', error);
        throw error;
    }
}

/**
 * Combina productos del servidor con productos locales
 */
function mergearProductos(productosServidor) {
    // Marcar todos los productos del servidor como sincronizados
    productosServidor.forEach(prodServidor => {
        const existeLocal = productos.find(p => p.idServidor === prodServidor.id);

        if (!existeLocal) {
            // Agregar producto del servidor que no existe localmente
            productos.push({
                id: generarId(),
                idServidor: prodServidor.id,
                nombre: prodServidor.nombre,
                precio: prodServidor.precio,
                descripcion: prodServidor.descripcion,
                fechaCreacion: prodServidor.fechaCreacion,
                sincronizado: true
            });
        }
    });

    // Guardar y renderizar
    guardarEnLocalStorage();
    renderizarProductos();
}

/**
 * Muestra/oculta el indicador de carga
 */
function mostrarLoading(mostrar) {
    const loading = document.getElementById('loading');
    if (mostrar) {
        loading.classList.add('show');
    } else {
        loading.classList.remove('show');
    }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Limpia todos los datos (útil para pruebas)
 */
function limpiarTodo() {
    if (confirm('¿Estás seguro de eliminar TODOS los datos?')) {
        productos = [];
        localStorage.removeItem('productos');
        renderizarProductos();
        mostrarMensaje('Todos los datos han sido eliminados', 'success');
        console.log('Datos limpiados');
    }
}

// Exponer función globalmente para pruebas desde consola
window.limpiarTodo = limpiarTodo;

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

// Capturar errores no manejados
window.addEventListener('error', (evento) => {
    console.error('Error no manejado:', evento.error);
});

// Capturar promesas rechazadas
window.addEventListener('unhandledrejection', (evento) => {
    console.error('Promesa rechazada:', evento.reason);
});

console.log('Aplicación cargada y lista para usar');
console.log('Tip: Usa limpiarTodo() en la consola para resetear todos los datos');
