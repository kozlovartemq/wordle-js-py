import appConstants from "../common/constants";
import Route from 'route-parser'

import MainPage from '../pages/main.template'
import GamesPage from '../pages/games.template'
import CreatePage from '../pages/create.template'
import GamePage from '../pages/game.template'
import NotFoundPage from '../pages/not_found.template'
import FailurePage from '../pages/failure.template'

import { getGameByUUID } from '../api/endpoints'


export const routes = {
    Main: new Route(appConstants.routes.index),
    Games: new Route(appConstants.routes.games),
    Create: new Route(appConstants.routes.create),
    Game: new Route(appConstants.routes.game),
    Fail: new Route(appConstants.routes.fail),
}

const routesWithPages = [
    { route: routes.Main, page: MainPage },
    { route: routes.Games, page: GamesPage },
    { route: routes.Create, page: CreatePage },
    { route: routes.Game, page: GamePage },
    { route: routes.Fail, page: FailurePage },
]

export const getPathRoute = async (path) => {
    const target = routesWithPages.find(r => r.route.match(path))
    if (target) {
        const params = target.route.match(path)
        if (target.page === GamePage) {
            const game_uuid = params.game
            const game_response = await getGameByUUID(game_uuid)

            if (!game_response.ok) {
                return null
            }
            params.len = game_response.data.len
        }

        return {
            page: target.page,
            route: target.route,
            params
        }
    }
    return null
}

export const render = async (path) => {
    let result = NotFoundPage()

    const pathRoute = await getPathRoute(path)

    if (pathRoute) {
        result = pathRoute.page(pathRoute.params)
    }
    document.querySelector('#app').innerHTML = result
}

export const getRouterParams = async () => {
    const url = new URL(window.location.href).pathname
    return await getPathRoute(url)
}

export const goTo = (path) => {
    window.history.pushState({ path }, path, path)
    render(path)
}

export const goTofailure = () => {
    goTo('/failure')
}

const initRouter = () => {
    window.addEventListener('popstate', e => {
        render(new URL(window.location.href).pathname)
    })
    document.querySelectorAll('[href^="/"]').forEach(el => {
        el.addEventListener('click', (env) => {
            env.preventDefault()
            const { pathname: path } = new URL(env.target.href)
            goTo(path)
        })
    })
    render(new URL(window.location.href).pathname)
}

export default initRouter