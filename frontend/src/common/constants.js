 const appConstants = {
    routes: {
        index: '/',
        games: '/games',
        game: '/games/:game',
        create: '/create',
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
       }
    },
    custom_color:{
        green: '#1ba122',
        red: '#e53935',
        dark_green: '#08610c'
    }
}

export default appConstants