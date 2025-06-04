import baseApi from './baseApi'

export const createCustomGame = (word, dictionary) => {
    return baseApi.post(`/games/create_custom`, { word: `${word}`, dictionary: `${dictionary}` })
}

export const createCasualGame = () => {
    return baseApi.post(`/games/create_casual`)
}

export const getGameByUUID = (game_uuid) => {
    return baseApi.get(`/games/${game_uuid}`)
}

export const checkWord = (game_uuid, word) => {
    return baseApi.post(
        `/games/check_word`,
        { uuid: `${game_uuid}`, word: `${word}` }
    )
}

export const getDailyGame = () => {
    return baseApi.get(`/games/daily`)
}

export const getArchive = (page = 1) => {
    return baseApi.get(`/games/get_archive?page=${page}`)
}

export default {
    createCustomGame,
    createCasualGame,
    getGameByUUID,
    checkWord,
    getDailyGame,
    getArchive,
}