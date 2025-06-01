import appConstants from '../common/constants'
import { goTo, routes } from '../router'
import { createCustomGame, createCasualGame, getGameByUUID } from '../api/endpoints'
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
                border-left: 5px solid ${appConstants.custom_color.wordle_green};
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
                width: 350px;
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
                background-color: ${appConstants.custom_color.light_green};
            }
            
            .submit-button:active {
                transform: scale(0.98);
            }

            .submit-button:disabled {
                background-color: ${appConstants.custom_color.dark_green};
                cursor: auto;
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

            /* length-selector */

            .word-length-selector {
                text-align: center;
                margin: 1rem auto;
            }

            .selector-title {
                font-size: 1.25rem;
                font-weight: bold;
                margin-bottom: 0.75rem;
                color: #333;
            }

            .length-buttons {
                display: flex;
                justify-content: center;
                gap: 1rem;
            }

            .length-button {
                padding: 0.5rem 1.2rem;
                font-size: 1.1rem;
                font-weight: bold;
                background-color: #ffffff;
                border: 2px solid ${appConstants.custom_color.wordle_green};
                border-radius: 8px;
                cursor: pointer;
                color: #333;
                transition: all 0.2s ease-in-out;
            }

            .length-button:hover {
                background-color: ${appConstants.custom_color.wordle_green};
                color: #fff;
            }

            .length-button.selected {
                background-color: ${appConstants.custom_color.wordle_green};
                color: white;
                box-shadow: 0 0 0 3px rgba(106, 170, 100, 0.3);
            }


            /* чекбокс */

            .dictionary-check {
                display: flex;
                justify-content: center;
            }

            .checkbox-container {
                position: relative;
                padding-left: 2rem;
                cursor: pointer;
                font-size: 1.1rem;
                user-select: none;
                color: #333;
            }

            /* Скрываем стандартный чекбокс */
            .checkbox-container input[type="checkbox"] {
                position: absolute;
                opacity: 0;
                cursor: pointer;
            }

            /* Кастомный чекбокс */
            .custom-checkbox {
                position: absolute;
                top: 0.1rem;
                left: 0;
                height: 1.2rem;
                width: 1.2rem;
                background-color: #fff;
                border: 2px solid ${appConstants.custom_color.wordle_green};
                border-radius: 4px;
                transition: all 0.2s ease;
            }

            /* Галочка при выборе */
            .checkbox-container input:checked ~ .custom-checkbox {
                background-color: ${appConstants.custom_color.wordle_green};
                background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: center;
            }

            /* Hover эффект */
            .checkbox-container:hover .custom-checkbox {
                box-shadow: 0 0 0 2px rgba(106, 170, 100, 0.3);
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

        if (this.type === appConstants.container.types.failure) {
            this.getFailurePage()
        }
        else if (this.type === appConstants.container.types.not_found) {
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
    }

    getFailurePage() {
        const documentTitle = document.head.querySelector('title')
        documentTitle.textContent = "500 - Wordle"

        const shadow = this.shadowRoot;
        const wrapper = shadow.querySelector('.common-container')
        const word = document.createElement('word-component')
        word.content = '500'
        const letters = word.shadowRoot.querySelectorAll('.letter-box')
        letters.forEach(element => {
            element.style.background = appConstants.custom_color.red
            element.style.color = 'white'
        })
        wrapper.appendChild(word)
        const timestamp = new Date().getTime()
        const title = document.createElement('h2')
        title.setAttribute('class', 'content-title')
        title.innerHTML = `Произошла внутренняя ошибка! Сообщите админу что вы делали.<br>Timestamp: ${timestamp}`

        wrapper.appendChild(word)
        wrapper.appendChild(title)
    }

    getNotFoundPage() {
        const documentTitle = document.head.querySelector('title')
        documentTitle.textContent = "404 - Wordle"

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
        const documentTitle = document.head.querySelector('title')
        documentTitle.textContent = "Главная - Wordle"

        const shadow = this.shadowRoot
        const wrapper = shadow.querySelector('.common-container')
        wrapper.innerHTML = `
        <h2 class="content-title"><b>Wordle</b> – игра-головоломка, в которой нужно угадать слово из пяти букв.</h2>
        
        <button class="submit-button" data-action="rules">Правила</button>
        <button class="submit-button" data-action="start-daily">Начать ежедневную игру!</button>
        <button class="submit-button" data-action="start-casual">Начать случайную игру!</button>
        `
        wrapper.querySelector('button[data-action="rules"]').addEventListener('click', (e) => {
            e.stopPropagation()
            const popup = document.createElement('pop-up')
            popup.renderRules()
            shadow.appendChild(popup)
        })
        wrapper.querySelector('button[data-action="start-daily"]').addEventListener('click', (e) => {
            e.stopPropagation()
            const url = routes.Daily.reverse()
            goTo(url)
        })
        wrapper.querySelector('button[data-action="start-casual"]').addEventListener('click', async (e) => {
            e.stopPropagation()
            const create_response = await createCasualGame()
            if (create_response.ok) {
                const url = routes.Game.reverse({ game: create_response.data.game_uuid })
                goTo(url)
            }
        })

    }

    getCreatePage() {
        const documentTitle = document.head.querySelector('title')
        documentTitle.textContent = "Своя игра - Wordle"

        const shadow = this.shadowRoot;
        const wrapper = shadow.querySelector('.common-container')
        wrapper.innerHTML = `
        <h2 class="content-title">Создай свою игру, загадав слово!</h2>
        <div class="word-length-selector">
        <p class="selector-title">Количество букв:</p>
            <div class="length-buttons">
                <button class="length-button" data-action="length-4">4</button>
                <button class="length-button selected" data-action="length-5">5</button>
                <button class="length-button" data-action="length-6">6</button>
            </div>
        </div>
        <div class="dictionary-check">
            <label class="checkbox-container">
                <input type="checkbox" id="check-dictionary" />
                <span class="custom-checkbox"></span>
                Проверять в словаре
            </label>
        </div>
        <div class="input-container">
            <div class="input-wrapper">
                <input type="text" class="word-input" maxLength=5 placeholder="Загадайте слово!" />
                <p class="input-hint"></p>
            </div>
            <button class="submit-button" data-action="create-word">Создать</button>
        </div>
        `

        const length_buttons = shadow.querySelectorAll('button.length-button')
        const submit_button = shadow.querySelector('button[data-action="create-word"]')
        submit_button.disabled = true
        const input = shadow.querySelector('input.word-input')
        const p = wrapper.querySelector('.input-hint')
        let word_len = "5"

        length_buttons.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation()

                if (!btn.classList.contains('selected')) {
                    length_buttons.forEach(b => b.classList.remove('selected'))
                    btn.classList.add('selected')

                    word_len = (index + 4).toString()
                    input.setAttribute('maxlength', word_len)
                    input.value = ""
                    submit_button.disabled = true
                }
            })
        })

        // TODO: dry listeners
        submit_button.addEventListener('click', async (e) => {
            e.stopPropagation()
            const existed_copy_comp = shadow.querySelector('copy-component')
            submit_button.disabled = true
            p.textContent = ""
            if (existed_copy_comp) {
                existed_copy_comp.remove()
            }

            const word = input.value.trim().toUpperCase()
            const checkbox = shadow.querySelector("input#check-dictionary")


            const create_response = await createCustomGame(word, checkbox.checked)
            if (create_response.status === 404) {
                p.textContent = create_response.data["detail"]
            } else if (create_response.status === 422) {
                p.textContent = create_response.data["detail"]["0"]["msg"]
            } else if (!create_response.ok) {
                p.textContent = "Не удалось получить id игры"
            } else {
                p.textContent = create_response.data.msg
                const url = routes.Game.reverse({ game: create_response.data.game_uuid })
                const copy_comp = document.createElement('copy-component')
                copy_comp.content = url
                wrapper.appendChild(copy_comp)
            }

        })
        input.addEventListener("input", (e) => {
            e.stopPropagation()
            e.target.value = e.target.value.replace(/[^а-яА-Я]/g, "")
            if (isValidWord(input.value, word_len)) {
                submit_button.disabled = false
            } else {
                submit_button.disabled = true
            }
        })
    }

    getGamesPage() {
        const documentTitle = document.head.querySelector('title')
        documentTitle.textContent = "Поиск игры - Wordle"

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
        button.disabled = true
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
            e.target.value = e.target.value.replace(" ", "")
            if (isValidUUID(input.value)) {
                button.disabled = false
            } else {
                button.disabled = true
            }
        })
    }

}

customElements.define('content-component', ContentComponent)