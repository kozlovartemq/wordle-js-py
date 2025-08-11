import appConstants from '../common/constants'
import { arrayRemove, areObjectsEqual } from "../common/utils.js"
import { checkWord, finishGameByGameUUID } from '../api/endpoints'
import { mergeStyles } from '../common/utils.js'
import gameStyles from '../styles/game.css.js'
import buttonStyles from '../styles/button.css.js'


class GameComponent extends HTMLElement {
    constructor() {
        super()
        this.game_id = this.getAttribute('id')
        this.game_name = this.getAttribute('name')
        this.len = parseInt(this.getAttribute('len'))
        this.dictionary = this.getAttribute('dictionary') === "true"
        this.current_word_id = 0
        this.pressed_buttons = []
        this.colored_letters = {}
        this.result_colors = []
        this.is_game_finished = false

        const shadow = this.attachShadow({ mode: 'open' })
        const wrapper = document.createElement('div')
        wrapper.setAttribute('class', 'common-container')

        wrapper.innerHTML = `       
            <div class="dictionary-status">
                <span class="status-indicator"></span>
                <span class="status-text"></span>
            </div>
            <h2 class="attempts-remaining"></h2>
            <word-component id="0"></word-component>
            <word-component id="1"></word-component>
            <word-component id="2"></word-component>
            <word-component id="3"></word-component>
            <word-component id="4"></word-component>
            <word-component id="5"></word-component>
            <p class="result-hint"></p>
            <keyboard-component></keyboard-component>
        `

        const style = document.createElement('style')
        style.textContent = mergeStyles(gameStyles, buttonStyles)

        shadow.appendChild(style)
        shadow.appendChild(wrapper)
        this.updateAttemptsH2()

        const keyboard = shadow.querySelector(`keyboard-component`)
        this.mountKeyUpToKeyboardComponent = (event) => {
            const letter = appConstants.map_key[event.code]
            if (letter) {
                const k_button = keyboard.findButton(letter)
                k_button.click()
            }
        }
        this.beforeUnloadHandler = (event) => {
            if (this.is_game_finished) return
            event.preventDefault();
            event.returnValue = ""
        }
        document.querySelector('#app').isGameRunning = true
    }

    updateAttemptsH2() {
        const shadow = this.shadowRoot
        const h2 = shadow.querySelector('h2.attempts-remaining')
        h2.textContent = `Использовано попыток: ${this.current_word_id}/6`
    }

    async finishGame() {
        document.querySelector('#app').isGameRunning = false
        window.removeEventListener('beforeunload', this.beforeUnloadHandler)
        
        const shadow = this.shadowRoot
        const p = shadow.querySelector('.result-hint')
        let tries = 0
        if (this.success) {
            p.textContent = "ПОБЕДА"
            p.style.color = appConstants.custom_color.green
            tries = this.current_word_id
        } else {
            p.textContent = "ПОРАЖЕНИЕ"
        }

        const surrender_button = shadow.querySelector('button[data-action="surrender"]')
        if (surrender_button) surrender_button.disabled = true
        
        const keyboard = shadow.querySelector(`keyboard-component`)
        keyboard.disable()
        const finishResponse = await finishGameByGameUUID(this.game_id, tries)
        if (finishResponse.ok) {
            const popup = document.createElement('pop-up')
            popup.renderResults({
                resultArray: this.result_colors,
                game_uuid: this.game_id,
                tries: tries,
                game_name: this.game_name,
                game_length: this.len,
                finishResponse: finishResponse.data
            })
            shadow.appendChild(popup)
        }
    }

    async spendAttempt() {
        this.current_word_id++
        this.pressed_buttons = []
        this.updateAttemptsH2()
        this.is_game_finished = this.success || this.current_word_id === 6
        if (this.is_game_finished) {
            await this.finishGame()
        } else if (this.current_word_id === 1) {

            const shadow = this.shadowRoot
            const surrender_button = document.createElement('button')
            surrender_button.classList.add('surrender-button', 'rectangle')
            surrender_button.textContent = 'Сдаться'
            surrender_button.setAttribute('data-action', "surrender")

            const onSurrenderConfirm = async () => {
                shadow.querySelector('pop-up[type="surrenderalert"]').hide()
                this.is_game_finished = true
                this.success = false
                await this.finishGame()
            }
            surrender_button.addEventListener('click', (e) => {
                e.stopPropagation()
                const popup = document.createElement('pop-up')
                popup.renderSurrenderAlert(onSurrenderConfirm)
                shadow.appendChild(popup)
            })
            const wrapper = shadow.querySelector('div.common-container')
            const keyboard = shadow.querySelector(`keyboard-component`)
            wrapper.insertBefore(surrender_button, keyboard)
        }
    }

    getCurrentWord() {
        const shadow = this.shadowRoot
        return shadow.querySelector(`word-component[id="${this.current_word_id}"]`)
    }

    connectedCallback() {
        const shadow = this.shadowRoot
        const documentTitle = document.head.querySelector('title')
        documentTitle.textContent = "Игра - Wordle"

        const status_indicator = shadow.querySelector('.status-indicator')
        const status_text = shadow.querySelector('.status-text')
        const text_core = "Проверка слов в словаре "
        if (this.dictionary) {
            status_indicator.style.backgroundColor = appConstants.custom_color.wordle_green
            status_text.textContent = text_core + "включена"
            status_text.style.color = appConstants.custom_color.wordle_green
        } else {
            status_indicator.style.backgroundColor = appConstants.custom_color.red
            status_text.textContent = text_core + "отключена"
            status_text.style.color = appConstants.custom_color.red
        }

        const word_components = shadow.querySelectorAll(`word-component`)
        word_components.forEach(word => word.content = ' '.repeat(this.len))

        const p = shadow.querySelector('.result-hint')
        const keyboard = shadow.querySelector(`keyboard-component`)
        const keyboard_shadow = keyboard.shadowRoot
        const k_enter_button = keyboard_shadow.querySelector('button[data-action="check-word"]')
        k_enter_button.addEventListener('click', (e) => {
            e.stopPropagation()
            const current_word = this.getCurrentWord()
            const word = current_word.content
            k_enter_button.disabled = true
            this.checkCurrent(this.game_id, word)
        })
        const letter_buttons = keyboard_shadow.querySelectorAll('button.letter')
        letter_buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation()
                const current_word = this.getCurrentWord()
                const was_filled = current_word.fillNextEmpty(button.textContent)
                if (was_filled) {
                    this.pressed_buttons.push(button)
                    if (current_word.is_full()) {
                        k_enter_button.disabled = false
                    }
                }

            })
        })
        const backspace_button = keyboard_shadow.querySelector('button[data-action="backspace"]')
        backspace_button.addEventListener('click', (e) => {
            e.stopPropagation()
            p.textContent = ""
            const current_word = this.getCurrentWord()
            k_enter_button.disabled = true
            const cleared_letter = current_word.clearPreviousBusy()
            if (cleared_letter != null) {
                this.pressed_buttons = arrayRemove(this.pressed_buttons, keyboard.findButton(cleared_letter))
            }
        })

        document.addEventListener('keyup', this.mountKeyUpToKeyboardComponent)
        window.addEventListener('beforeunload', this.beforeUnloadHandler)
    }

    disconnectedCallback() {
        document.removeEventListener('keyup', this.mountKeyUpToKeyboardComponent)
        window.removeEventListener('beforeunload', this.beforeUnloadHandler)
    }

    async checkCurrent(game_id, word) {
        const shadow = this.shadowRoot
        const p = shadow.querySelector('.result-hint')
        p.textContent = ""
        const word_component = this.getCurrentWord()
        const response = await checkWord(game_id, word.toUpperCase())
        if (!response.ok) {
            p.textContent = response.data["detail"]
        } else {
            const word_revision = response.data
            this.result_colors.push(Object.values(word_revision))
            word_component.setColors(word_revision)

            // Set keyboard buttons color by color prority
            const keyboard = shadow.querySelector('keyboard-component')
            const priority = {
                'red': 0,
                'yellow': 1,
                'green': 2
            }

            this.pressed_buttons.forEach((button, index) => {
                const letter = button.textContent
                const new_result = word_revision[index]

                const existing_result = this.colored_letters[letter]

                if (!existing_result || priority[new_result] > priority[existing_result]) {
                    this.colored_letters[letter] = new_result
                    keyboard.setColor(button, new_result)
                }
            })
            const success_revision = Object.fromEntries([...Array(this.len).keys()].map(x => [x, 'green']))
            this.success = areObjectsEqual(word_revision, success_revision)
            this.spendAttempt()
        }

    }

}

customElements.define('game-component', GameComponent)