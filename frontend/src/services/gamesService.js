import { arrayRemove, getlocalStorage, setlocalStorage } from "../common/utils.js"


const GAME_THRESHOLD_HOURS = VITE__GAME_THRESHOLD_HOURS
const CLEANUP_INTERVAL_DAYS = VITE__CLEANUP_INTERVAL_DAYS

const INDEX_KEY = "gameIndex"
const GAME_PREFIX = "game_"
const LAST_OPTIMIZED_KEY = "lastOptimized"


// This service is for saving and cleaning expired game states in localStorage
export const GamesService = {

    gameKey(id) {
        return `${GAME_PREFIX}${id}`
    },

    getIndex() {
        return getlocalStorage(INDEX_KEY, [])
    },

    saveGame(id, word, resultColors, createdAt, tries) {
        localStorage.setItem(GamesService.gameKey(id), JSON.stringify({
            word: word,
            result_colors: resultColors,
            createdAt: createdAt,
            tries: tries,
        }))

        const index = GamesService.getIndex()
        if (!index.includes(id)) {
            index.push(id)
            setlocalStorage(INDEX_KEY, index)
        }
    },

    loadGame(id) {
        return getlocalStorage(GamesService.gameKey(id), null)
    },

    loadAllGames() {
        const index = GamesService.getIndex()
        return index.map(id => GamesService.loadGame(id)).filter(Boolean)
    },

    removeGame(id) {
        localStorage.removeItem(GamesService.gameKey(id))
        const index = arrayRemove(GamesService.getIndex())
        setlocalStorage(INDEX_KEY, index)
    },

    cleanupExpiredGames() {
        const now = Date.now()
        const last = Number(localStorage.getItem(LAST_OPTIMIZED_KEY) || 0)
        const cleanUpIntervalMs = CLEANUP_INTERVAL_DAYS * 24 * 60 * 60 * 1000
        if (now - last >= cleanUpIntervalMs) {
            console.log('cleanupExpiredGames (index):')
            const start = performance.now()

            const thresholdMs = GAME_THRESHOLD_HOURS * 60 * 60 * 1000

            const index = GamesService.getIndex()
            const newIndex = []

            for (const id of index) {
                const game = GamesService.loadGame(id)
                if (!game || !Number.isFinite(Number(game.createdAt))) {
                    localStorage.removeItem(GamesService.gameKey(id))
                    continue
                }
                const expiresAt = Number(game.createdAt) + thresholdMs
                if (expiresAt > now) {
                    newIndex.push(id)
                } else {
                    localStorage.removeItem(GamesService.gameKey(id))
                }
            }

            setlocalStorage(INDEX_KEY, newIndex)
            setlocalStorage(LAST_OPTIMIZED_KEY, String(now))
            const end = performance.now()
            console.log(`Время выполнения (index): ${(end - start).toFixed(2)} мс`)
        }
    },

    // For performance tests
    setFakeRecords(n = 1000) {
        function uuid4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0
                const v = c === 'x' ? r : (r & 0x3 | 0x8)
                return v.toString(16)
            })
        }

        const sampleGame = {
            result_colors: [
                ["yellow", "yellow", "yellow", "yellow", "yellow"],
                ["yellow", "yellow", "yellow", "yellow", "yellow"],
                ["yellow", "yellow", "yellow", "yellow", "yellow"],
                ["yellow", "yellow", "yellow", "yellow", "yellow"],
                ["yellow", "yellow", "yellow", "yellow", "yellow"],
                ["yellow", "yellow", "yellow", "yellow", "yellow"]
            ],
            tries: 6,
            createdAt: Date.now(),
            word: "ВЕСНА"
        }
        const gameIndex = []
        for (let i = 0; i < n; i++) {
            const id = uuid4()
            setlocalStorage(GamesService.gameKey(id), sampleGame)
            gameIndex.push(id)
        }
        setlocalStorage(INDEX_KEY, gameIndex)

        console.log(`${n} игр добавлено в localStorage`)
    }
}