const productos = {
    producto1: {
        id: 1,
        nombre: "Laptop HP",
        precio: 2500000
    },
    producto2: {
        id: 2,
        nombre: "Mouse Logitech",
        precio: 45000
    },
    producto3: {
        id: 3,
        nombre: "Teclado Mecánico",
        precio: 180000
    },
    producto4: {
        id: 4,
        nombre: "Monitor Samsung",
        precio: 850000
    },
    producto5: {
        id: 5,
        nombre: "Audífonos Sony",
        precio: 120000
    }
};

console.log("Objeto de productos:", productos);
console.log(productos);

const numerosConDuplicados = [1, 2, 3, 4, 5, 2, 3, 6, 7, 8, 1, 9, 10, 5];
const conjuntoNumeros = new Set(numerosConDuplicados);

console.log("Trabajando con Set");
console.log("Array original con duplicados:", numerosConDuplicados);
console.log("Set sin duplicados:", conjuntoNumeros);

conjuntoNumeros.add(15);
console.log("Ser después de agregar 15:", conjuntoNumeros);

const numeroBuscado = 7;
console.log(`El numero ${numeroBuscado} existe en el Set?`, conjuntoNumeros.has(numeroBuscado));

const numeroAEliminar = 3;
conjuntoNumeros.delete(numeroAEliminar);
console.log(`Set despues de eliminar ${numeroAEliminar}:`, conjuntoNumeros)

console.log("Recorriendo el Set con for...of: ");
for (const numero of conjuntoNumeros) {
    console.log(` - Valor: ${numero}`);
}

const categoriaProductos = new Map();

categoriaProductos.set("Computación", "Laptop HP");
categoriaProductos.set("Periféricos", "Mouse Logitech");
categoriaProductos.set("Accesorios", "Teclado Mecánico");
categoriaProductos.set("Pantallas", "Monitor Samsung");
categoriaProductos.set("Audio", "Audífonos Sony");

console.log("\n=== MAP DE CATEGORÍAS Y PRODUCTOS ===");
console.log(categoriaProductos);

console.log("\n=== ITERACIÓN CON FOR...IN (Objeto) ===");
for (const clave in productos) {
    console.log(`Clave: ${clave}`);
    console.log(`  ID: ${productos[clave].id}`);
    console.log(`  Nombre: ${productos[clave].nombre}`);
    console.log(`  Precio: $${productos[clave].precio.toLocaleString('es-CO')}`);
    console.log("---");
}

console.log("\n=== ITERACIÓN CON FOR...OF (Set) ===");
for (const valor of conjuntoNumeros) {
    console.log(`  Número único: ${valor}`);
}

console.log("\n=== ITERACIÓN CON FOREACH (Map) ===");
categoriaProductos.forEach((producto, categoria) => {
    console.log(`Categoría: ${categoria} -> Producto: ${producto}`);
});

console.log("\n=== MÉTODOS DE OBJETOS ===");

console.log("Claves del objeto productos:");
const claves = Object.keys(productos);
console.log(claves);

console.log("\nValores del objeto productos:");
const valores = Object.values(productos);
valores.forEach((producto) => {
    console.log(`  ${producto.nombre} - $${producto.precio.toLocaleString('es-CO')}`);
});

console.log("\nEntradas (clave-valor) del objeto productos:");
const entradas = Object.entries(productos);
entradas.forEach(([clave, valor]) => {
    console.log(`  ${clave}: ${valor.nombre}`);
});

const validarProducto = (producto, nombreClave) => {
    if (!producto) {
        console.error(`Error: El producto "${nombreClave}" no existe.`);
        return false;
    }

    if (!producto.hasOwnProperty('id') || !producto.hasOwnProperty('nombre') || !producto.hasOwnProperty('precio')) {
        console.error(`Error: El producto "${nombreClave}" no tiene todas las propiedades requeridas (id, nombre, precio).`);
        return false;
    }

    if (typeof producto.id !== 'number' || producto.id <= 0) {
        console.error(`Error: El ID del producto "${nombreClave}" debe ser un número positivo.`);
        return false;
    }

    if (typeof producto.nombre !== 'string' || producto.nombre.trim() === '') {
        console.error(`Error: El nombre del producto "${nombreClave}" debe ser una cadena no vacía.`);
        return false;
    }

    if (typeof producto.precio !== 'number' || producto.precio <= 0) {
        console.error(`Error: El precio del producto "${nombreClave}" debe ser un número positivo.`);
        return false;
    }

    return true;
};

console.log("\n=== VALIDACIÓN DE PRODUCTOS ===");
for (const clave in productos) {
    const esValido = validarProducto(productos[clave], clave);
    console.log(`${clave}: ${esValido ? '✓ Válido' : '✗ Inválido'}`);
}

console.log("\n=== PRUEBA CON PRODUCTO INVÁLIDO ===");
const productoInvalido = {
    id: -1,
    nombre: "",
    precio: 0
};
validarProducto(productoInvalido, "productoInvalido");

console.log("\n=== RESUMEN FINAL ===");

console.log("\n1. Lista completa de productos (Objeto):");
Object.entries(productos).forEach(([clave, producto]) => {
    console.log(`  - ${producto.nombre} (ID: ${producto.id}) - $${producto.precio.toLocaleString('es-CO')}`);
});

console.log("\n2. Lista de números únicos (Set):");
console.log(`  [${Array.from(conjuntoNumeros).join(', ')}]`);

console.log("\n3. Categorías y nombres de productos (Map):");
categoriaProductos.forEach((producto, categoria) => {
    console.log(`  - ${categoria}: ${producto}`);
});

