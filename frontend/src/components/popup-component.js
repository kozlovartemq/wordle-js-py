import appConstants from '../common/constants'
import { routes } from '../router'
import { getArchive } from '../api/endpoints'
import { mergeStyles } from '../common/utils.js'
import popupStyles from '../styles/popup.css.js'
import buttonStyles from '../styles/button.css.js'


class PopUpComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        const wrapper = document.createElement('div')
        wrapper.setAttribute('class', 'popup-overlay')
        wrapper.innerHTML = `
            <div class="popup-container">
                <div class="popup-content"></div>
                <button class="submit-button position-right position-bottom" data-action="close">Закрыть</button>
            </div>
        `
        const style = document.createElement('style')
        style.textContent = mergeStyles(popupStyles, buttonStyles)

        shadow.appendChild(style)
        shadow.appendChild(wrapper)

    }

    connectedCallback() {
        const shadow = this.shadowRoot
        const wrapper = shadow.querySelector(".popup-overlay")

        wrapper.addEventListener('click', (e) => {
            if (e.target === wrapper) {
                this.hide()
            }
        })

        wrapper.querySelector('button[data-action="close"]').addEventListener('click', () => {
            this.hide()   
        }, { once: true })
    }

    show() {
        requestAnimationFrame(() => {
            // вторым кадром — ещё надёжнее
            requestAnimationFrame(() => {
                this.classList.add('visible')
            })
        })
    }

    hide() {
        this.classList.remove('visible');

        // Удаляем элемент после завершения анимации
        this.addEventListener('transitionend', () => {
            this.remove();
        }, { once: true });
    }

    renderRules() {
        this.setAttribute('type', 'rules')
        const shadow = this.shadowRoot
        const content = shadow.querySelector(".popup-content")
        content.innerHTML = `
        <h2>Правила игры</h2>
        <p>
            <b>Цель игры:</b><br>
            Угадать загаданное пятибуквенное слово за 6 попыток.<br><br>
            После каждой попытки буквы в загаданном слове подсвечиваются цветом:<br>
            <b><span style="color: ${appConstants.custom_color.green};">Зеленый:</span></b> буква есть в загаданном слове и находится на правильном месте.<br>
            <b><span style="color: ${appConstants.custom_color.yellow};">Желтый:</span></b> буква есть в загаданном слове, но находится не на правильном месте.<br>
            <b><span style="color: ${appConstants.custom_color.red};">Красный:</span></b> буква отсутствует в загаданном слове.<br><br>
            <a href="/daily"><b>Ежедневная игра:</b></a> В Wordle загадывается одно и то же слово дня для всех игроков.<br> 
            <a href="/create"><b>Своя игра:</b></a> Загадай В Wordle свое слово и поделись ссылкой с друзьями.<br> 
            <b>Случайная игра:</b> В Wordle загадывается случайное слово из словаря для игрока.<br> 

        </p>
        `
        this.show()
    }

    async renderResults(resultObj) {
        this.setAttribute('type', 'results')
        const resultArray = resultObj.resultArray
        const game_uuid = resultObj.game_uuid
        const tries = resultObj.tries
        const game_name = resultObj.game_name
        const game_length = resultObj.game_length
        const finishResponse = resultObj.finishResponse

        const getWordsSchema = (colorArrays) => {
            const squareMap = {
                'red': '⬛',
                'yellow': '🟨',
                'green': '🟩',
            }
            let wordsSchema = ''
            colorArrays.forEach(word => {
                word.forEach(letter => {
                    wordsSchema += squareMap[letter]
                })
                wordsSchema += '<br>'
            })
            return wordsSchema
        }
        const getCopyText = (colorSchema, tries) => {
            if (colorSchema) {}
        }
        
        const colorSchema = getWordsSchema(resultArray)
        let result
        if (tries === 0) {
            result = `<b>Поражение! Было загадано слово "${finishResponse.word}".</b>`
            const copyText = `
            Я не смог(лa) разгадать ${game_length}-буквенное слово. <br><br>

            ${colorSchema} <br>

            Может ты сможешь разгадать это слово? <br>
            ${window.location.origin}${routes.Game.reverse({ game: game_uuid })}
            `
        } else {
            result = `<b>Победа! ${tries}/6! Загаданное слово "${finishResponse.word}".</b>`
            const copy_text = `
            Я разгадал(a) ${game_length}-буквенное слово за ${tries}/6 попыток. <br><br>

            ${colorSchema} <br>

            Сможешь ли ты разгадать это слово? <br>
            ${window.location.origin}${routes.Game.reverse({ game: game_uuid })}
            `
        }
        
        const shadow = this.shadowRoot
        const content = shadow.querySelector(".popup-content")
        content.innerHTML = `
        <h2>${game_name}</h2>
        <p>${result}</p>
        <p>${colorSchema}</p>
        <div class="copy-container">
            <button class="submit-button" data-action="copy-result">📋Скопировать результат!</button>
        </div>
        <stat-component></stat-component> 
        <p><b>Другие игры:</b></p>
        <div class="other-games button-group">
            <button class="submit-button" data-action="start-daily">Начни ежедневную игру!
                <countdown-timer></countdown-timer>
            </button>
            <button class="submit-button" data-action="start-casual">Начни случайную игру!</button>
            <button class="submit-button" data-action="start-custom">Создай свою игру!</button>
            <button class="submit-button" data-action="archive-game">Архивные игры</button>
        </div> 
        `
        content.querySelector('button[data-action="copy-result"]').addEventListener('click', () => {
            const copyText = getCopyText(colorSchema, tries)
        })
        content.querySelector('stat-component').renderStatistics(finishResponse.stat, tries)


        setTimeout(() => {
            this.show()
        }, 600);
    }

    renderGotoAlert() {
        this.setAttribute('type', 'gotoalert')
        const shadow = this.shadowRoot
        const content = shadow.querySelector(".popup-content")
        content.innerHTML = `
        <h2>Вы покидаете страницу игры!</h2>
        <p>
            После ухода со страницы весь прогресс игры будет утерян. Продолжить?
        </p>
        <button class="submit-button position-left" data-action="goto">Уйти</button>
        `
        this.show()
    }

    renderSurrenderAlert(onConfirm) {
        this.setAttribute('type', 'surrenderalert')
        const shadow = this.shadowRoot
        const content = shadow.querySelector(".popup-content")
        content.innerHTML = `
        <h2>Сдаться?</h2>
        <p>
            Вот так просто сдаться и увидеть загаданное слово?
        </p>
        <button class="submit-button surrender-button position-left position-bottom" data-action="action-surrender">Сдаться</button>
        `
        content.querySelector('button[data-action="action-surrender"]').addEventListener('click', onConfirm)
        this.show()
    }

    async renderArchiveGames() {
        this.setAttribute('type', 'archive')
        this.archivePage = 1
        this.isLoadingArchive = false
        this.hasMoreArchive = true

        const shadow = this.shadowRoot
        const content = shadow.querySelector(".popup-content")
        content.innerHTML = `
        <h2>Архивные игры</h2>
        <div class="archive-list">
            <div id="loader" class="loader">Загрузка...</div>
        </div>
        `
        const loadArchivePage = async () => {
            if (!this.hasMoreArchive) this.archiveObserver.disconnect()

            if (this.isLoadingArchive || !this.hasMoreArchive) return

            this.isLoadingArchive = true
            const shadow = this.shadowRoot
            const loader = shadow.querySelector('.loader')
            const archiveList = shadow.querySelector('.archive-list')
            const archiveResponse = await getArchive(this.archivePage)
            if (archiveResponse.ok) {
                if (archiveResponse.data.length === 0 && this.archivePage === 1) {
                    loader.textContent = "Архивных игр пока нет :("
                    this.hasMoreArchive = false
                    return
                } else if (archiveResponse.data.length === 0) {
                    this.hasMoreArchive = false
                    loader.textContent = 'Больше игр нет'
                    return
                }
                archiveResponse.data.forEach(game => {
                    const tile = document.createElement('a');
                    tile.className = 'archive-tile'
                    tile.href = `games/${game.game_uuid}`
                    tile.textContent = `Ежедневная игра от ${game.game_date}`
                    archiveList.insertBefore(tile, loader)
                })
            } else {
                const error_text = 'Ошибка загрузки архива'
                console.error(error_text)
                loader.textContent = error_text
                this.hasMoreArchive = false
            }
            this.isLoadingArchive = false
        }
        
        await loadArchivePage(this.archivePage)

        this.archiveObserver = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting) {
                this.archivePage++
                await loadArchivePage(this.archivePage)
            }
        }, {
            root: null,
            threshold: 1.0
        })
        this.archiveObserver.observe(shadow.querySelector('.loader'))
        this.show()
    }

}


customElements.define('pop-up', PopUpComponent)