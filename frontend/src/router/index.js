import appConstants from "../common/constants";
import Route from 'route-parser'

import MainPage from '../pages/main.template'
import GamesPage from '../pages/games.template'
import CreatePage from '../pages/create.template'
import GamePage from '../pages/game.template'
import NotFoundPage from '../pages/not_found.template'


export const routes = {
    Main: new Route(appConstants.routes.index),
    Games: new Route(appConstants.routes.games),
    Create: new Route(appConstants.routes.create),
    Game: new Route(appConstants.routes.game),
}

const routesWithPages = [
    { route: routes.Main, page: MainPage },
    { route: routes.Games, page: GamesPage },
    { route: routes.Create, page: CreatePage },
    { route: routes.Game, page: GamePage },
]

export const getPathRoute = (path) => {
    const target = routesWithPages.find(r => r.route.match(path))
    if (target) {
        const params = target.route.match(path)
        return {
            page: target.page,
            route: target.route,
            params
        }
    }
    return null
}

export const render = (path) => {
    let result = NotFoundPage()

    const pathRoute = getPathRoute(path)

    if (pathRoute) {
        result = pathRoute.page(pathRoute.params)
    }
    document.querySelector('#app').innerHTML = result
}

export const getRouterParams = () => {
    const url = new URL(window.location.href).pathname
    return getPathRoute(url)
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