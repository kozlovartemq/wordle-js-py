import baseApi from './baseApi'

export const createCustomGame = (word) => {
    return baseApi.post(`/games/create_custom`, {word: `${word}`})
}

export default {
    createCustomGame,
}