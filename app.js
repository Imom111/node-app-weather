require('dotenv').config();
const { 
    inquirerMenu, 
    pausa, 
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist
 } = require('./helpers/inquirer.js');
const Busquedas = require('./models/busquedas.js');

const main = async() => {
    const busquedas = new Busquedas();
    let opt = 0;
    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                // Mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                // Buscar lugares
                const lugares = await busquedas.ciudad(termino);
                // Seleccionar lugar
                const id = await listarLugares(lugares);
                const lugarSeleccionado = lugares.find( l => l.id === id);
                // Clima
                // Resultados
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSeleccionado.nombre);
                console.log('Lat:', lugarSeleccionado.lat);
                console.log('Lng:', lugarSeleccionado.lng);
                console.log('Temperatura:', );
                console.log('T. mínima:', );
                console.log('T. máxima:', );
                break;
            case 2:
                console.log('Historial');
                break;
        }
        // guardado
        if(opt !== 0) {
            await pausa();
        } else {
            console.log('Bye!');
        }
    } while (opt !== 0);
}

main();
