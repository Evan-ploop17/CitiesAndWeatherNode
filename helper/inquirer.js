import inquirer from 'inquirer'
import 'colors'

const questions = [ 
    {
        type: 'list',
        name: 'option',
        message: '¿Qué deseas hacer?',
        choices: [
            {
                value: 1,
                name: '1. Buscar ciudad'
            },
            {
                value: 2,
                name: '2. Historial'
            },
            {
                value: 0,
                name: '0. Salir'
            },

        ]
    }
]

const inquirerMenu = async () => {
    console.clear()
    console.log('========================='.green)
    console.log( 'Seleccione una opción'.green )
    console.log('========================='.green)

    const {option} = await inquirer.prompt(questions)
    return option
}

const pause = async () => {
    return await inquirer.prompt([{
        type: 'input',
        name: 'enter',
        message: `Presione ${ 'enter'.green } para continuar`
    }])
}

const readInput = async (message = '') => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message, //Mensaje que sale por consola
            validate(value) {
                if(value.length === 0){
                    return 'Por favor ingrese un valor'
                }
                return true
            }
        }
    ]

    const { desc } = await inquirer.prompt(question)
    return desc
}

const listSpots = async (spots = []) => {
    
    const choices = spots.map((spot, i) => {
        const idx = `${i + 1}`.green
        return {
            value: spot.id,
            name: `${idx} ${spot.place_name}`
        }
    })

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Sleccione un lugar: ',
            choices,
        }
    ]

    const { id } = await inquirer.prompt(questions)
    return id
}

const confirm = async (message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ]

    const { ok } = await inquirer.prompt(question)
    return ok 
}

const showListCheckItems = async (tasks = []) => {
    
    const choices = tasks.map((task, i) => {
        const idx = `${i + 1}`.green
        return {
            value: task.id,
            name: `${idx} ${task.description}`,
            checked: (task.completedAt) ? true : false,
        }
    })

    const question = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices,
        }
    ]

    const { ids } = await inquirer.prompt(question)
    return ids
}

export {
    confirm,
    inquirerMenu,
    listSpots,
    pause,
    readInput,
    showListCheckItems,
}