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
    busquedas.leerBD();
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
                if( id == '0') continue;
                // Guardar en DB
                const lugarSeleccionado = lugares.find( l => l.id === id);
                busquedas.agregarHistoria( lugarSeleccionado.nombre );
                // Clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);
                // Resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSeleccionado.nombre);
                console.log('Lat:', lugarSeleccionado.lat);
                console.log('Lng:', lugarSeleccionado.lng);
                console.log('Temperatura:', clima.temp);
                console.log('T. mínima:', clima.temp_max);
                console.log('T. máxima:', clima.temp_min);
                console.log('Resumen:', clima.description);
                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    console.log(`${i + 1}. ${lugar}`);
                });
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
