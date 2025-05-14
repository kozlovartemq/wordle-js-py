import appConstants from "../common/constants";
import Route from 'route-parser'

import MainPage from '../pages/main.template'
import GamesPage from '../pages/games.template'
import CreatePage from '../pages/create.template'
import GamePage from '../pages/game.template'


export const routes = {
    Main: new Route(appConstants.routes.index),
    Games: new Route(appConstants.routes.games),
    Create: new Route(appConstants.routes.create),
    Game: new Route(appConstants.routes.game),
}

export const render = (path) => {
    let result = '<h1>404</h1>'

    if(routes.Main.match(path)){
        result = MainPage()
    } else if(routes.Games.match(path)){
        result = GamesPage()
    } else if(routes.Create.match(path)){
        result = CreatePage()
    }

    document.querySelector('#app').innerHTML = result
}

export const goTo = (path) => {
    window.history.pushState({path}, path, path)
    render(path)
}

const initRouter = () => {
    window.addEventListener('popstate', e => {
        render( new URL(window.location.href).pathname)
    })
    document.querySelectorAll('[href^="/"]').forEach(el => {
        el.addEventListener('click', (env) => {
            env.preventDefault()
            const {pathname: path} = new URL(env.target.href)
            goTo(path)
        })
    })
    render(new URL(window.location.href).pathname)
}

export default initRouter