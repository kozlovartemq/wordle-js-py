import appConstants from '../common/constants'

class PopUpComponent extends HTMLElement {
    constructor() {
        super()
        // this._suppressCallback = true
        // this.type = appConstants.container.types.main

        const shadow = this.attachShadow({ mode: 'open' })
        const wrapper = document.createElement('div')
        wrapper.setAttribute('class', 'popup-overlay')
        wrapper.innerHTML = `
            <div class="popup-container">
                <div class="popup-content"></div>
                <button class="submit-button">Закрыть</button>
            </div>
        `
        const style = document.createElement('style')

        style.textContent = `
            .popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }

            .popup-container {
                background: white;
                padding: 4rem;
                border-radius: 10px;
                max-width: 90vw;
                max-height: 90vh;
                overflow: auto;
                position: relative;
                box-shadow: 0 10px 20px rgba(0,0,0,0.3);
            }

            .submit-button {
                position: absolute;    
                padding: 10px 20px;
                font-size: 18px;
                background-color: ${appConstants.custom_color.green};
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                transition: background-color 0.3s, transform 0.2s;
                height: 41px;
                right: 1rem;
                bottom: 1rem;
            }
            
            .submit-button:hover {
                background-color: ${appConstants.custom_color.light_green};
            }
            
            .submit-button:active {
                transform: scale(0.98);
            }

            p a {
                color:rgb(11, 12, 14);
                text-decoration: none;
                transition: color 0.2s ease, border-color 0.2s ease;
                border-bottom: 1px dashed rgb(11, 12, 14);
            }

            p a:focus,
            p a:hover {
                outline: none;
                color: ${appConstants.custom_color.link_blue};
                border-bottom: 1px dashed ${appConstants.custom_color.link_blue};
            }


            p a:active {
                color:${appConstants.custom_color.red};
                border-bottom: 1px dashed ${appConstants.custom_color.red};
            }
        `

        shadow.appendChild(style)
        shadow.appendChild(wrapper)

    }

    connectedCallback() {
        const shadow = this.shadowRoot
        const wrapper = shadow.querySelector(".popup-overlay")
        wrapper.addEventListener('click', (e) => {
            if (e.target === wrapper) {
                this.remove()
            }
        })


        wrapper.querySelector('.submit-button').addEventListener('click', () => {
            this.remove()
        })
    }

    renderRules() {
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

    }


    renderResults() {
        this.innerHTML = ``
    }

    renderArchiveGames() {
        this.innerHTML = ``
    }
}
    

customElements.define('pop-up', PopUpComponent)