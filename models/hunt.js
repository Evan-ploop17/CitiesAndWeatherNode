import * as fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import axios from 'axios'

export class Hunt {
    history = []
    dbPath = './db/database.json'

    constructor() {
        this.readDB()
    }

    get historyCapitalized() {
        return this.history.map((spot) => {
            let words = spot.split(' ')
            words = words.map( word => word[0].toUpperCase() + word.substring(1))
            return words.join(' ')
        })
    }

    async city(spot = ''){

        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${spot}.json`,
                params: {
                    'access_token': process.env.MAPBOX_KEY || '',
                    'language': 'es',
                    'limit': 5,
                    'proximity': 'ip',
                }
            })
    
            const {data} = await instance.get()
            return data.features.map(({id, place_name, center}) => ({
                id,
                place_name,
                lng: center[0],
                lat: center[1]
            }))   
        } catch (error) {
            throw error
        }
    }

    weatherByPlace = async ({lat, lng}) => {
        try {
            
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    lat: lat,
                    lon: lng,
                    appid: process.env.OPENWEATHER_KEY,
                    units: 'metric',
                    lang: 'es'
                }
            })

            const { data } = await instance.get()
            const { weather, main } = data

            return {
                description: weather[0].description,
                max: main.temp_max,
                min: main.temp_min,
                temp: main.temp,
            }

        } catch (error) {
            throw error
        }
    }


    addHistory = ( spot = '' ) => {
        if(this.history.includes(spot.toLocaleLowerCase())) return
        this.history = this.history.splice(0,5)
        this.history.unshift(spot.toLocaleLowerCase())
        this.saveOnDB()
    }

    saveOnDB = () => {
        const payload = {
            history: this.history
        }
        fs.writeFile(this.dbPath, JSON.stringify(payload))
    }

    readDB = async () => {
        if(!existsSync(this.dbPath)) return 
        const data = await fs.readFile(this.dbPath, {encoding: 'utf-8'})
        const dataParsed = JSON.parse(data)
        this.history = dataParsed.history

    }
}