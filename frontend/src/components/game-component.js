import appConstants from '../common/constants'
import { isValidWord } from "../common/utils.js"
import { checkWord } from '../api/endpoints'

class GameComponent extends HTMLElement {
    constructor() {
        super()
        this.game_id = this.getAttribute('id')
        this.len = parseInt(this.getAttribute('len'))
        this.attempts = 6

        const shadow = this.attachShadow({ mode: 'open' })
        const wrapper = document.createElement('div')
        wrapper.setAttribute('class', 'common-container')

        const title = document.createElement('h2')
        title.setAttribute('class', 'attempts-remaining')
        wrapper.appendChild(title)

        for (let i = 0; i < 6; i++) {
            const word = document.createElement('word-component')
            word.id = i
            word.content = ' '.repeat(this.len)
            wrapper.appendChild(word)
        }

        const input_container = document.createElement('div')
        input_container.setAttribute('class', 'input-container')
        const input_wrapper = document.createElement('div')
        input_wrapper.setAttribute('class', 'input-wrapper')
        
        const input = document.createElement('input')
        input.setAttribute('type', 'text')
        input.setAttribute('class', 'word-input')
        input.setAttribute('maxLength', this.len)
        input.setAttribute('placeholder', "Введите слово!")
        const input_hint = document.createElement('p')
        input_hint.setAttribute('class', 'input-hint')

        const button = document.createElement('button')
        button.setAttribute('class', 'submit-button')
        button.setAttribute('data-action', 'check-word')
        button.textContent = "Ввод"
        button.disabled = true

        input_wrapper.appendChild(input)
        input_wrapper.appendChild(input_hint)
        input_container.appendChild(input_wrapper)
        input_container.appendChild(button)

        wrapper.appendChild(input_container)

        const style = document.createElement('style')
        style.textContent = `
            .common-container {
                display: flex;
                flex-direction: column;
                gap: 10px;
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
                // display: none;
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
  
            input {
                padding: 10px 16px;
                font-size: 18px;
                border: 2px solid #ccc;
                border-radius: 8px;
                outline: none;
                width: 200px;
                transition: border-color 0.3s, box-shadow 0.3s;
                height: 1rem;
            }
            
            input:focus {
                border-color: ${appConstants.custom_color.green};
                box-shadow: 0 0 5px rgba(76, 175, 80, 0.4);
            }
            
            .submit-button {
                padding: 10px 20px;
                font-size: 18px;
                background-color: ${appConstants.custom_color.green};
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                transition: background-color 0.3s, transform 0.2s;
                height: 41px;
            }
            
            .submit-button:hover {
                background-color: #4caf50;
            }
            
            .submit-button:active {
                transform: scale(0.98);
            }

            .submit-button:disabled {
                background-color: ${appConstants.custom_color.dark_green};
            } 

            .submit-button:disabled:hover,
            .submit-button:disabled:active {
                background-color: ${appConstants.custom_color.dark_green};
                transform: scale(1);
            } 
            
            .input-hint {
                text-align: center;
                font-size: 16px;
                color: ${appConstants.custom_color.red};
                margin-top: 10px;
                height: 20px; /* зарезервировать место, даже когда пусто */
            }
        `
        shadow.appendChild(style)
        shadow.appendChild(wrapper)
        this.updateAttemptsH2()
    }

    updateAttemptsH2() {
        const shadow = this.shadowRoot
        const h2 = shadow.querySelector('h2.attempts-remaining')
        h2.textContent = `Осталось попыток: ${this.attempts}/6`
    }

    connectedCallback() {
        const shadow = this.shadowRoot
        const button = shadow.querySelector('button[data-action="check-word"]')
        const input = shadow.querySelector('input.word-input')

        button.addEventListener('click', (e) => {
            e.stopPropagation()
            const word = input.value.trim().toUpperCase()
            button.disabled = true
            input.value = ""
            this.fillNext(this.game_id, word)
        })
        input.addEventListener("input", (e) => {
            e.stopPropagation()
            input.value = input.value.replace(' ', '')
            if (isValidWord(input.value)) {
                button.disabled = false
            } else {
                button.disabled = true
            }

        })
    }

    async fillNext(game_id, word) {
        const shadow = this.shadowRoot
        const word_id = 6 - this.attempts
        const word_component = shadow.querySelector(`word-component[id="${word_id}"]`)
        const word_shadow = word_component.shadowRoot
        const response = await checkWord(game_id, word)
        word_component.content = word
        const game_revision = response.data
        const colorMap = {
            true: appConstants.custom_color.green,
            false: appConstants.custom_color.yellow,
            none: appConstants.custom_color.red,
        }

        for (let i = 0; i < this.len; i++) {
            const letter = word_shadow.querySelector(`div[id="${i}"]`)
            const result = game_revision[i]
            letter.style.background = colorMap[result]
        }
        this.attempts--
        this.updateAttemptsH2()
    }

}

customElements.define('game-component', GameComponent)