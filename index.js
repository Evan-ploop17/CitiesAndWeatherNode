import 'dotenv/config'
import { inquirerMenu, listSpots, pause, readInput } from './helper/inquirer.js'
import {Hunt} from './models/hunt.js'

const main = async () => {
    const searches = new Hunt
    let opt
    do {
        opt = await inquirerMenu('Salecciona una opción: \n')

        switch (opt) {
            case 1: //Buscar ciudad
                const city = await readInput('Ciudad a buscar: ')
                const spots = await searches.city(city)
                const id = await listSpots(spots)
                if(id == '0' ) continue
                const spotSelected = spots.find( spot => spot.id === id)
                searches.addHistory(spotSelected.place_name)

                const weather = await searches.weatherByPlace({lat: spotSelected.lat, lng:spotSelected.lng})

                console.clear()
                console.log(`\n Información de la ciudad:  \n`.green);
                console.log(`Ciudad: ${spotSelected.place_name}`);
                console.log(`Lat: ${spotSelected.lat}`);
                console.log(`Lng: ${spotSelected.lng}`);
                console.log(`Temperatura: ${weather.temp} `);
                console.log(`Temperatura mínima: ${weather.min} `);
                console.log(`Temperatura máxima: ${weather.max} `);
                console.log(`Descripción: ${weather.description} `);
            break;

            case 2:
                searches.historyCapitalized.forEach((spot, i) => {
                    const idx = `${i + 1}.`.green
                    console.log(`${idx} ${spot}`)
                })
            break;
        
            default:
                break;
        }
        
        await pause()

    } while(opt !== 0 || opt !== 3)



}

main()