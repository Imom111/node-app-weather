const fs = require('fs');

const axios = require('axios');

class Busquedas {
    historial = [];
    dbPath = './db/database.json'
    
    constructor() {
    }

    get historialCapitalizado(){
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );
            return palabras.join(' ');
        });
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'language': 'es',
            'limit': 5
        }
    }

    get paramsWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async ciudad(lugar = '') {
        try {
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox,
                headers: {
                    'Accept-Encoding': 'application/json'
                }
            });
            const { data } = await intance.get();
            // const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/M%C3%A9xico.json?language=es&access_token=pk.eyJ1IjoiaW1vbTExMSIsImEiOiJjbGI1ZWxzOWEwMjltM3dwNXh1aDVlZTM2In0.UR0liv28TwYj-G-6uEUYWg&limit=5',{headers: {'Accept-Encoding': 'application/json'}});
            return data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        } catch (error) {
            return [];
        }
    }

    async climaLugar(lat, lon) {
        try {
            const intance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather/`,
                params: {...this.paramsWeather, lat, lon},
                headers: {
                    'Accept-Encoding': 'application/json'
                }
            });
            const { data } = await intance.get();
            return {
                'temp_min': data.main.temp_min,
                'temp_max': data.main.temp_max,
                'temp': data.main.temp,
                'description': data.weather[0].description
            }
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistoria( lugar = '' ){
        if ( this.historial.includes( lugar.toLocaleLowerCase()) ){
            return;
        }
        this.historial = this.historial.splice(0, 5);
        this.historial.unshift(lugar);
        this.guardarBD();
    }

    guardarBD(){
        const payload = {
            historial: this.historial
        };
        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );
    }

    async leerBD(){
        if (!fs.existsSync(this.dbPath)) {
            return null;
        }
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8'});
        const { historial } = JSON.parse(info);
        this.historial = historial;
    }
}

module.exports = Busquedas;