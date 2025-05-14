import appConstants from '../common/constants'

class ContentComponent extends HTMLElement {
    constructor(){
        super()
        this._suppressCallback = true
        this.type = appConstants.container.types.main

        const shadow = this.attachShadow({mode: 'open'})
        const wrapper = document.createElement('div')
        wrapper.setAttribute('class', 'common-container')

        const title = document.createElement('h2')
        title.setAttribute('class', 'content-title')
        shadow.appendChild(title)

        const style = document.createElement('style')

        style.textContent = `
            .common-container {
                display: flex;
                flex-direction: column; /* элементы по вертикали */
                gap: 10px; /* интервал между словами */
                align-items: center; /* выравнивание по центру */
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
            }


            .input-container {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 12px;
                margin-top: 30px;
                padding-bottom: 20px;
            }
  
            .word-input {
                padding: 10px 16px;
                font-size: 18px;
                border: 2px solid #ccc;
                border-radius: 8px;
                outline: none;
                width: 200px;
                transition: border-color 0.3s, box-shadow 0.3s;
            }
            
            .word-input:focus {
                border-color: #4caf50;
                box-shadow: 0 0 5px rgba(76, 175, 80, 0.4);
            }
            
            .submit-button {
                padding: 10px 20px;
                font-size: 18px;
                background-color: #4caf50;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                transition: background-color 0.3s, transform 0.2s;
            }
            
            .submit-button:hover {
                background-color: #45a049;
            }
            
            .submit-button:active {
                transform: scale(0.98);
            }
            
            .input-hint {
                text-align: center;
                font-size: 16px;
                color: #e53935; /* красный */
                margin-top: 10px;
                height: 20px; /* зарезервировать место, даже когда пусто */
            }
        `

        shadow.appendChild(style)
        shadow.appendChild(wrapper)

    }

    connectedCallback(){
        console.log('connectedCallback')
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
        console.log('updateComponent')
        const type = this.getAttribute('type')
        if (type) {
            this.type = type
        }
        if (this.type === appConstants.container.types.main) {
            this.getMainPage()
        }
        if (this.type === appConstants.container.types.create) {
            this.getCreatePage()
        }
        if (this.type === appConstants.container.types.games) {
            this.getGamesPage()
        }

    }

    getMainPage(){
        const shadow = this.shadowRoot;
        const title = shadow.querySelector('.content-title')
        title.textContent = 'Начни обычную игру нажатием кнопки!'
        const wrapper = shadow.querySelector('.common-container')
        wrapper.innerHTML = `
        <button class="submit-button" type="start-casual">Начать игру!</button>
        `

    }

    getCreatePage(){
        const shadow = this.shadowRoot;
        const title = shadow.querySelector('.content-title')
        title.textContent = 'Загадай слово, чтобы создать свою игру!'
        const wrapper = shadow.querySelector('.common-container')
        wrapper.innerHTML = `
        <div class="input-container">
            <input type="text" class="word-input" maxLength=6 placeholder="Загадайте слово!" />
            <button class="submit-button" type="create-word">Ввод</button>
            <p class="input-hint"></p>
        </div>
        `

    }    
        
    getGamesPage(){
        const shadow = this.shadowRoot;
        const title = shadow.querySelector('.content-title')
        title.textContent = 'Найди игру, если у тебя есть его id!'
        const wrapper = shadow.querySelector('.common-container')
        wrapper.innerHTML = `
            <div class="input-container">
                <input type="text" class="word-input" maxLength=32 placeholder="Найди игру по его id!" />
                <button class="submit-button" type="check-game">Проверить</button>
                <p class="input-hint"></p>
            </div>
        `

    }    
    
}

customElements.define('content-component', ContentComponent)