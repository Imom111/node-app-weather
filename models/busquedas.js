const axios = require('axios');

class Busquedas {
    historial = ['México', 'The USA', 'Canadá'];

    constructor(){

    }

    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'language': 'es',
            'limit': 5
        }
    }

    async ciudad( lugar = '' ){
        try {
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox,
                headers: {
                    'Accept-Encoding': 'application/json'
                }
            });
            const { data } = await intance.get();
            // const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/M%C3%A9xico.json?language=es&access_token=pk.eyJ1IjoiaW1vbTExMSIsImEiOiJjbGI1ZWxzOWEwMjltM3dwNXh1aDVlZTM2In0.UR0liv28TwYj-G-6uEUYWg&limit=5',{headers: {'Accept-Encoding': 'application/json'}});
            return data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        } catch (error) {
            return [];            
        }
    }
}

module.exports = Busquedas;