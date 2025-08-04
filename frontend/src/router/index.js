import appConstants from "../common/constants";
import Route from 'route-parser'

import MainPage from '../pages/main.template'
import GamesPage from '../pages/games.template'
import CreatePage from '../pages/create.template'
import GamePage from '../pages/game.template'
import NotFoundPage from '../pages/not_found.template'
import FailurePage from '../pages/failure.template'

import { getGameByUUID, getDailyGame } from '../api/endpoints'


export const routes = {
    Main: new Route(appConstants.routes.index),
    Games: new Route(appConstants.routes.games),
    Create: new Route(appConstants.routes.create),
    Game: new Route(appConstants.routes.game),
    Fail: new Route(appConstants.routes.fail),
    Daily: new Route(appConstants.routes.daily),
}

const routesWithPages = [
    { route: routes.Main, page: MainPage },
    { route: routes.Games, page: GamesPage },
    { route: routes.Create, page: CreatePage },
    { route: routes.Game, page: GamePage },
    { route: routes.Fail, page: FailurePage },
    { route: routes.Daily, page: GamePage },
]

export const getPathRoute = async (path) => {
    const target = routesWithPages.find(r => r.route.match(path))
    if (target) {
        const params = target.route.match(path)
        if (target.page === GamePage) {
            if (target.route === routes.Daily) {
                const daily_game = await getDailyGame()
                if (daily_game.ok) {
                    params.game = daily_game.data.game_uuid
                }
            }
            const game_uuid = params.game
            const game_response = await getGameByUUID(game_uuid)
            if (!game_response.ok) {
                return null
            }
            params.name = game_response.data.name
            params.len = game_response.data.len
            params.dictionary = game_response.data.dictionary
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

let currentPath = window.location.pathname;

export function getCurrentPath() {
  return currentPath
}

export function setCurrentPath(newPath) {
  currentPath = newPath
}

export const isGameRunning = () => document.querySelector('#app')?.isGameRunning || false

const navigate = (path) => {
    if (getCurrentPath() === path) return
    window.history.pushState({ path }, '', path)
    setCurrentPath(path)
    render(path)
}

export const goTo = (path) => {
    if (isGameRunning()) {
        const onConfirm = (e) => {
            e.stopPropagation()
            document.querySelector('#app').isGameRunning = false
            navigate(path)
        }
        showGotoAlert(onConfirm)
    } else {
        navigate(path)
    }
}

export const goTofailure = () => {
    goTo('/failure')
}

const showGotoAlert = (onConfirm) => {
    const app = document.querySelector('#app')
    let popup = app.querySelector('pop-up[type="gotoalert"]')

    if (popup) {
        const shadow = popup.shadowRoot 
        const gotoBtn = shadow.querySelector('button[data-action="goto"]')

        // The easiest way to remove all old event listeners is to clone the node.
        const newGotoBtn = gotoBtn.cloneNode(true)
        gotoBtn.parentNode.replaceChild(newGotoBtn, gotoBtn)
        newGotoBtn.addEventListener('click', onConfirm, { once: true })

    } else {
        popup = document.createElement('pop-up')
        popup.renderGotoAlert()
        app.appendChild(popup)

        const shadow = popup.shadowRoot 
        shadow.querySelector('button[data-action="goto"]').addEventListener('click', onConfirm, { once: true })
        shadow.querySelector('button[data-action="close"]').addEventListener('click', (e) => {
            window.history.pushState({ path: getCurrentPath() }, '', getCurrentPath())
        }, { once: true })
        const wrapper = shadow.querySelector(".popup-overlay")
        wrapper.addEventListener('click', (e) => {
            if (e.target === wrapper) {
                window.history.pushState({ path: getCurrentPath() }, '', getCurrentPath())
            }
        }, { once: true })
    }
}

export const initRouter = () => {
    // Listener for browser Back/Forward buttons
    window.addEventListener('popstate', (e) => {
        const newPath = new URL(window.location.href).pathname
        
        if (newPath === getCurrentPath()) return

        if (isGameRunning()) {
            const onConfirm = (e) => {
                e.stopPropagation()
                document.querySelector('#app').isGameRunning = false
                // The URL is already correct, so we just accept it. We don't need to navigate(path), just render
                setCurrentPath(newPath)
                render(newPath)
            }
            showGotoAlert(onConfirm)
        } else {
            setCurrentPath(newPath)
            render(newPath)
        }
    })

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="/"]')
        if (link) {
            e.preventDefault()
            const { pathname: path } = new URL(link.href)
            goTo(path)
        }
    })

    render(getCurrentPath())
}

export default initRouter