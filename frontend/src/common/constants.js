const appConstants = {
    routes: {
        index: '/',
        games: '/games',
        game: '/games/:game',
        create: '/create',
        fail: '/failure',
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
        dark_green: '#08610c',
        yellow: '#f3c237'
    }
}

export default appConstants