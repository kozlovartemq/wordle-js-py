import appConstants from '../common/constants'
import { goTo, routes } from '../router'
import { createCustomGame } from '../api/endpoints'

class ContentComponent extends HTMLElement {
    constructor(){
        super()
        this._suppressCallback = true
        this.type = appConstants.container.types.main

        const shadow = this.attachShadow({mode: 'open'})
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
                align-items: center;
                gap: 12px;
                margin-top: 30px;
                padding-bottom: 20px;
                width: 500px;
            }
  
            input {
                padding: 10px 16px;
                font-size: 18px;
                border: 2px solid #ccc;
                border-radius: 8px;
                outline: none;
                width: 300px;
                transition: border-color 0.3s, box-shadow 0.3s;
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

    connectedCallback(){
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

    updateComponent(){
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
    }

    getNotFoundPage(){
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

    getMainPage(){
        const shadow = this.shadowRoot;
        const wrapper = shadow.querySelector('.common-container')
        wrapper.innerHTML = `
        <h2 class="content-title">Начни обычную игру нажатием кнопки!</h2>
        <button class="submit-button" type="start-casual">Начать игру!</button>
        `

    }

    getCreatePage(){
        const shadow = this.shadowRoot;
        const wrapper = shadow.querySelector('.common-container')
        wrapper.innerHTML = `
        <h2 class="content-title">Создай свою игру, загадав слово!</h2>
        <div class="input-container">
            <input type="text" class="word-input" maxLength=6 placeholder="Загадайте слово!" />
            <button class="submit-button" type="create-word">Ввод</button>
            <p class="input-hint"></p>
        </div>
        `
        // TODO: dry listeners
        const button = shadow.querySelector('button[type="create-word"]')
        const input = shadow.querySelector('input.word-input')
        const p = wrapper.querySelector('.input-hint')

        button.addEventListener('click', async (e) => {
            e.stopPropagation()
            button.disabled = true
            p.textContent = ""
            
            const word = input.value.trim().toUpperCase()
            const { game_uuid } = await createCustomGame(word)
            
            if (!game_uuid){
                p.textContent = "Не удалось получить id игры"
            } else {
                const url = routes.Game.reverse({game: game_uuid})
                goTo(url)
                // TODO
                // 'перейти к игре' OR copy game Link
            }
            
        })
        input.addEventListener("input", (e) => {
            e.stopPropagation()
            button.disabled = false
        })
    }    
        
    getGamesPage(){
        const shadow = this.shadowRoot;
        const wrapper = shadow.querySelector('.common-container')
        wrapper.innerHTML = `
        <h2 class="content-title">Найди игру, если у тебя есть его id!</h2>
        <div class="input-container">
            <input type="text" class="game-input" maxLength=32 placeholder="Найди игру по его id!" />
            <button class="submit-button" type="check-game">Проверить</button>
            <p class="input-hint"></p>
        </div>
        `
        const button = shadow.querySelector('button[type="check-game"]')
        button.addEventListener('click', (e) => {
            e.stopPropagation()
            console.log('button')
            button.disabled = true
            //goto game 
            //const url = 
            //goTo(url)
        })
        const input = shadow.querySelector('input.game-input')
        input.addEventListener("input", (e) => {
            e.stopPropagation()
            button.disabled = false
        })
    }    
    
}

customElements.define('content-component', ContentComponent)