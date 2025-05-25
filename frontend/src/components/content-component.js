import appConstants from '../common/constants'
import { goTo, routes } from '../router'
import { createCustomGame, getGameByUUID } from '../api/endpoints'
import { isValidUUID, isValidWord } from '../common/utils'

class ContentComponent extends HTMLElement {
    constructor() {
        super()
        this._suppressCallback = true
        this.type = appConstants.container.types.main

        const shadow = this.attachShadow({ mode: 'open' })
        const wrapper = document.createElement('div')
        wrapper.setAttribute('class', 'common-container')

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
                width: 300px;
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

    }

    connectedCallback() {
        this.updateComponent()
    }

    // static get observedAttributes(){
    //     return ['type']
    // }

    // attributeChangedCallback(name, oldValue, newValue){
    //     console.log('attributeChangedCallback')
    //     if (this._suppressCallback) return;
    //     this.updateComponent()
    // }

    updateComponent() {
        const type = this.getAttribute('type')
        if (type) {
            this.type = type
        }
        if (this.type === appConstants.container.types.not_found) {
            this.getNotFoundPage()
        }
        else if (this.type === appConstants.container.types.main) {
            this.getMainPage()
        }
        else if (this.type === appConstants.container.types.create) {
            this.getCreatePage()
        }
        else if (this.type === appConstants.container.types.games) {
            this.getGamesPage()
        }
        else if (this.type === appConstants.container.types.failure) {
            this.getFailurePage()
        }
    }

    getFailurePage() {
        const shadow = this.shadowRoot;
        const wrapper = shadow.querySelector('.common-container')
        const word = document.createElement('word-component')
        word.content = '500'
        const letters = word.shadowRoot.querySelectorAll('.letter-box')
        letters.forEach(element => {
            element.style.background = appConstants.custom_color.red
            element.style.color = 'white'
        });
        wrapper.appendChild(word)
        const title = document.createElement('h2')
        title.setAttribute('class', 'content-title')
        title.textContent = 'Произошла внутренняя ошибка! Сообщите админу что вы делали.'

        wrapper.appendChild(word)
        wrapper.appendChild(title)
    }

    getNotFoundPage() {
        const shadow = this.shadowRoot;
        const wrapper = shadow.querySelector('.common-container')
        const word = document.createElement('word-component')
        word.content = '404'
        const letters = word.shadowRoot.querySelectorAll('.letter-box')
        letters.forEach(element => {
            element.style.background = appConstants.custom_color.red
            element.style.color = 'white'
        });
        wrapper.appendChild(word)
        const title = document.createElement('h2')
        title.setAttribute('class', 'content-title')
        title.textContent = 'Cтраница не найдена!'

        wrapper.appendChild(word)
        wrapper.appendChild(title)
    }

    getMainPage() {
        const shadow = this.shadowRoot;
        const wrapper = shadow.querySelector('.common-container')
        wrapper.innerHTML = `
        <h2 class="content-title">Начни обычную игру нажатием кнопки!</h2>
        <button class="submit-button" data-action="start-casual">Начать игру!</button>
        `

    }

    getCreatePage() {
        const shadow = this.shadowRoot;
        const wrapper = shadow.querySelector('.common-container')
        wrapper.innerHTML = `
        <h2 class="content-title">Создай свою игру, загадав слово!</h2>
        <div class="input-container">
            <div class="input-wrapper">
                <input type="text" class="word-input" maxLength=6 placeholder="Загадайте слово!" />
                <p class="input-hint"></p>
            </div>
            <button class="submit-button" data-action="create-word">Проверить</button>
        </div>
        `
        // TODO: dry listeners
        const button = shadow.querySelector('button[data-action="create-word"]')
        const input = shadow.querySelector('input.word-input')
        const p = wrapper.querySelector('.input-hint')

        button.addEventListener('click', async (e) => {
            e.stopPropagation()
            button.disabled = true
            p.textContent = ""

            const word = input.value.trim().toUpperCase()
            const create_response = await createCustomGame(word)

            if (!create_response.ok) {
                p.textContent = "Не удалось получить id игры"
            } else {
                const url = routes.Game.reverse({ game: create_response.data.game_uuid })
                goTo(url)
                // TODO
                // 'перейти к игре' OR copy game Link
            }

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

    getGamesPage() {
        const shadow = this.shadowRoot;
        const wrapper = shadow.querySelector('.common-container')
        wrapper.innerHTML = `
        <h2 class="content-title">Найди игру, если у тебя есть его id!</h2>
        <div class="input-container">
            <div class="input-wrapper">
                <input type="text" class="game-input" maxLength=36 placeholder="Найди игру по его id!" />
                <p class="input-hint"></p>
            </div>
            <button class="submit-button" data-action="check-game">Проверить</button>
        </div>
        `
        const button = shadow.querySelector('button[data-action="check-game"]')
        const input = shadow.querySelector('input.game-input')
        const p = wrapper.querySelector('.input-hint')

        button.addEventListener('click', async (e) => {
            e.stopPropagation()
            const game_uuid = input.value.trim().toLowerCase()
            button.disabled = true
            p.textContent = ""

            const game_response = await getGameByUUID(game_uuid)
            if (game_response.status >= 400 && game_response.status < 500) {
                p.textContent = game_response.data["detail"]["0"]["msg"]
            }
            if (game_response.ok) {
                const url = routes.Game.reverse({ game: game_uuid })
                goTo(url)
            }

        })
        input.addEventListener("input", (e) => {
            e.stopPropagation()
            input.value = input.value.replace(' ', '')
            if (isValidUUID(input.value)) {
                button.disabled = false
            } else {
                button.disabled = true
            }
        })
    }

}

customElements.define('content-component', ContentComponent)