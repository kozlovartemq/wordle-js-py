import baseApi from './baseApi'

export const createCustomGame = (word) => {
    return baseApi.post(`/games/create_custom`, {word: `${word}`})
}

export const getGameByUUID = (game_uuid) => {
    return baseApi.get(`/games/${game_uuid}`)
}

export default {
    createCustomGame,
}