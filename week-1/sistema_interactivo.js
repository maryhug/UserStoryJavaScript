const nombre = prompt("Ingresa tu nombre: ");
const edadIngresada = prompt("Ingresa tu edad: ");

const edad = Number(edadIngresada);

if (isNaN(edad) || edadIngresada === "" || edadIngresada === null ) {
    console.error("Error: Por favor ingresa una edad valida en números.");
} else {
    if (edad < 18) {
        const mensajeMenor = `Hola ${nombre}, eres menor de edad. ¡Sigue aprendiendo y disfrutando del código!`;
        alert(mensajeMenor);
        console.log(mensajeMenor);
    } else {
        const mensajeMayor = `Hola ${nombre}, eres mayor de edad. ¡Prepárate para grandes oportunidades en el mundo de la programación!`;
        alert(mensajeMayor);
        console.log(mensajeMayor);
    }
}