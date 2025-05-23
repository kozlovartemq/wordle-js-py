import appConstants from '../common/constants'
import { goTo, routes } from '../router'
import { createCustomGame } from '../api/endpoints'

class GameComponent extends HTMLElement {
    constructor(){
        super()
        this._suppressCallback = true
        this.id = this.getAttribute('id')
        this.len = this.getAttribute('len')

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
                width: 200px;
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
        this.getGamePage()
    }

      
        
    getGamePage(){
        const shadow = this.shadowRoot;
        const wrapper = shadow.querySelector('.common-container')
        wrapper.innerHTML = `
        <h2 class="attempts-remaining">Осталось попыток: 6/6</h2>
        <word-component class="common-container" id="words">
            <div class="word-container" id="0">
                <div class="letter-box" id="0">W</div>
                <div class="letter-box" id="1">O</div>
                <div class="letter-box" id="2">R</div>
                <div class="letter-box" id="3">D</div>
                <div class="letter-box" id="4">L</div>
                <div class="letter-box" id="5">E</div>
            </div>
            <div class="word-container" id="1">
                <div class="letter-box" id="0">W</div>
                <div class="letter-box" id="1">O</div>
                <div class="letter-box" id="2">R</div>
                <div class="letter-box" id="3">D</div>
                <div class="letter-box" id="4">S</div>
            </div>
        </word-component> 
        <div class="input-container">
            <input type="text" class="word-input" maxLength=6 placeholder="Введите слово!" />
            <button class="submit-button" type="check-word">Ввод</button>
            <p class="input-hint"></p>
        </div>
        `
        const button = shadow.querySelector('button[type="check-word"]')
        button.addEventListener('click', (e) => {
            e.stopPropagation()
            console.log('button')
            button.disabled = true
            //goto game 
            //const url = 
            //goTo(url)
        })
        const input = shadow.querySelector('input.word-input')
        input.addEventListener("input", (e) => {
            e.stopPropagation()
            button.disabled = false
        })
    }    
    
}

customElements.define('game-component', GameComponent)