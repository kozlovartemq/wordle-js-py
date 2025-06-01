export const appConstants = {
    routes: {
        index: '/',
        games: '/games',
        game: '/games/:game',
        create: '/create',
        fail: '/failure',
        daily: '/daily',
    },
    search: {
        types: {
            game: 'game',
            word: 'word',
        }
    },
    container: {
        types: {
            main: 'main',
            create: 'create',
            games: 'games',
            game: 'game',
            not_found: '404',
            failure: '5xx',
        }
    },
    custom_color: {
        green: '#1ba122',
        red: '#e53935',
        dark_red: '#8B0000',
        dark_green: '#08610c',
        wordle_green: '#6aaa64',
        light_green: '#4caf50',
        yellow: '#f3c237',
        dark_yellow: '#997612',
        link_blue: '#0c47a1'
    },
    map_key: {
        KeyQ: "Й", KeyW: "Ц", KeyE: "У", KeyR: "К", KeyT: "Е", KeyY: "Н",
        KeyU: "Г", KeyI: "Ш", KeyO: "Щ", KeyP: "З", BracketLeft: "Х", BracketRight: "Ъ",

        KeyA: "Ф", KeyS: "Ы", KeyD: "В", KeyF: "А", KeyG: "П", KeyH: "Р",
        KeyJ: "О", KeyK: "Л", KeyL: "Д", Semicolon: "Ж", Quote: "Э",

        Backspace: "BACKSPACE", KeyZ: "Я", KeyX: "Ч", KeyC: "С", KeyV: "М", KeyB: "И",
        KeyN: "Т", KeyM: "Ь", Comma: "Б", Period: "Ю", Enter: "ENTER"
    }
}

appConstants["letter_color"] = {
    green: appConstants.custom_color.green,
    yellow: appConstants.custom_color.yellow,
    red: appConstants.custom_color.red
}

export default appConstants