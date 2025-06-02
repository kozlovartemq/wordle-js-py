import appConstants from '../common/constants'
import { arrayRemove, areMapsEqual } from "../common/utils.js"
import { checkWord } from '../api/endpoints'


class GameComponent extends HTMLElement {
    constructor() {
        super()
        this.game_id = this.getAttribute('id')
        this.len = parseInt(this.getAttribute('len'))
        this.dictionary = this.getAttribute('dictionary') === "true"
        this.current_word_id = 0
        this.pressed_buttons = []
        this.colored_letters = {}

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
            <div class="input-container">
                <div class="input-wrapper">
                    <p class="input-hint"></p>
                </div>
            </div>
            <keyboard-component></keyboard-component>
        `

        const style = document.createElement('style')
        style.textContent = `
            .common-container {
                display: flex;
                flex-direction: column;
                gap: 0px;
                align-items: center;
            }

            .content-title {
                font-size: 1.5rem;
                font-weight: 600;
                margin: 20px 0 10px;
                padding: 10px 20px;
                text-align: center;
                background-color: #f0f0f0;
                color: #333;
                border-left: 5px solid #6c63ff;
                border-radius: 8px;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                width: 500px;
            }

            .attempts-remaining {
                font-size: 20px;
                font-weight: 700;
                color: #4a4a4a;
                text-align: center;
                margin-bottom: 20px;
                padding: 8px 16px;
                background-color: #f0f0f0;
                border-radius: 12px;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                width: fit-content;
                margin-left: auto;
                margin-right: auto;
            }

            .input-container {
                display: flex;
                justify-content: center;
                align-items: flex-start;
                gap: 12px;
                margin-top: 30px;
                padding-bottom: 20px;
                width: 500px;
            }

            .input-wrapper {
                display: flex;
                flex-direction: column;
                align-items: stretch;
                gap: 0px
                flex-grow: 1;
            }
            
            .input-hint {
                text-align: center;
                font-size: 16px;
                color: ${appConstants.custom_color.red};
                margin-top: 10px;
                height: 20px;
            }

            /* dictionary-status */

            .dictionary-status {
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
                justify-content: center;
                align-items: center;
            }

            .status-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: gray; /* по умолчанию */
            }

        `
        shadow.appendChild(style)
        shadow.appendChild(wrapper)
        this.updateAttemptsH2()
    }

    updateAttemptsH2() {
        const shadow = this.shadowRoot
        const h2 = shadow.querySelector('h2.attempts-remaining')
        h2.textContent = `Использовано попыток: ${this.current_word_id}/6`
    }

    spendAttempt(success) {
        this.current_word_id++
        this.pressed_buttons = []
        this.updateAttemptsH2()
        if (this.current_word_id === 6 || success) {
            const shadow = this.shadowRoot
            const keyboard = shadow.querySelector(`keyboard-component`)
            keyboard.disable()
            const popup = document.createElement('pop-up')
            popup.renderResults()
            shadow.appendChild(popup)
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

        const p = shadow.querySelector('.input-hint')
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
        const mountKeyUpToKeyboardComponent = (event) => {
            const letter = appConstants.map_key[event.code]
            if (letter) {
                const k_button = keyboard.findButton(letter)
                k_button.click()
            }

        }
        document.removeEventListener('keyup', mountKeyUpToKeyboardComponent)
        document.addEventListener('keyup', mountKeyUpToKeyboardComponent)

    }

    async checkCurrent(game_id, word) {
        const shadow = this.shadowRoot
        const p = shadow.querySelector('.input-hint')
        p.textContent = ""
        const word_component = this.getCurrentWord()
        const response = await checkWord(game_id, word.toUpperCase())
        if (!response.ok) {
            p.textContent = response.data["detail"]
        } else {
            const word_revision = response.data
            word_component.setColors(word_revision)

            // Set keyboard buttons color by color prority
            const keyboard = shadow.querySelector(`keyboard-component`)
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
            this.spendAttempt(areMapsEqual(word_revision, success_revision))
        }

    }

}

customElements.define('game-component', GameComponent)