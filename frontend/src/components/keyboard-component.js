import appConstants from '../common/constants'

class KeyboardComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        const wrapper = document.createElement('div')
        wrapper.setAttribute('class', 'keyboard')

        wrapper.innerHTML = `
            
            <div class="keyboard-row">
                <button class="letter">Й</button>
                <button class="letter">Ц</button>
                <button class="letter">У</button>
                <button class="letter">К</button>
                <button class="letter">Е</button>
                <button class="letter">Н</button>
                <button class="letter">Г</button>
                <button class="letter">Ш</button>
                <button class="letter">Щ</button>
                <button class="letter">З</button>
                <button class="letter">Х</button>
                <button class="letter">Ъ</button>
            </div>
            <div class="keyboard-row">
                <button class="letter">Ф</button>
                <button class="letter">Ы</button>
                <button class="letter">В</button>
                <button class="letter">А</button>
                <button class="letter">П</button>
                <button class="letter">Р</button>
                <button class="letter">О</button>
                <button class="letter">Л</button>
                <button class="letter">Д</button>
                <button class="letter">Ж</button>
                <button class="letter">Э</button>
            </div>
            <div class="keyboard-row">
                <button class="action-button" data-action="backspace">⌫</button>
                <button class="letter">Я</button>
                <button class="letter">Ч</button>
                <button class="letter">С</button>
                <button class="letter">М</button>
                <button class="letter">И</button>
                <button class="letter">Т</button>
                <button class="letter">Ь</button>
                <button class="letter">Б</button>  
                <button class="letter">Ю</button>           
                <button class="action-button" data-action="check-word" disabled>⏎</button>
            </div>
            
        `

        const style = document.createElement('style')
        style.textContent = `
        .keyboard {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 0.5rem;
            background-color: #d3d6da;
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
            z-index: 1000;
            box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.2);

            max-width: 500px;
            margin: 0 auto;
            width: 100%;
        }

        .keyboard-row {
            display: flex;
            justify-content: center;
            gap: 0.3rem;
        }

        .keyboard-row button {
            flex: 1;
            padding: 0.8rem 0;
            font-size: 1rem;
            font-weight: bold;
            text-transform: uppercase;
            background-color: #eee;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            user-select: none;
            transition: background-color 0.3s ease;
        }

        .keyboard-row button:hover {
            background-color: #ccc;
        }

        .keyboard-row .letter-none {
            background-color: ${appConstants.map_color.none};
        }
        
        .keyboard-row .letter-none:hover {
            background-color: ${appConstants.custom_color.dark_red};
        }

        .keyboard-row .letter-false {
            background-color: ${appConstants.map_color.false};
        }
        
        .keyboard-row .letter-false:hover {
            background-color: ${appConstants.custom_color.dark_yellow};
        }

        .keyboard-row .letter-true {
            background-color: ${appConstants.map_color.true};
        }
        
        .keyboard-row .letter-true:hover {
            background-color: ${appConstants.custom_color.dark_green};
        }

        /* Стили для кнопок стереть и ввод */
        .keyboard-row .action-button {
            flex: 1.5;
            background-color: #a4aec4;
            color: white;
        }

        .keyboard-row .action-button:hover {
            background-color: #8891a7;
        }

        .keyboard-row .action-button:disabled {
            background-color: #8891a7;
            cursor: auto;
        }

        /* Адаптивность */
        @media (max-width: 600px) {
            .keyboard {
                max-width: none;
                padding: 0.3rem;
                gap: 0.2rem;
            }

            .keyboard-row button {
                font-size: 0.9rem;
                padding: 0.6rem 0;
            }
        } 
        `

        shadow.appendChild(style)
        shadow.appendChild(wrapper)
    }

    findButton(letter){
        const buttons = this.shadowRoot.querySelectorAll('button.letter')
        return Array.from(buttons).find((button) => button.textContent === letter)
    }

    setColor(button, value){
        const value_map = {
            true: 'letter-true',
            false: 'letter-false',
            none: 'letter-none',
        }
        button.classList.add(value_map[value])
    }


    connectedCallback() {
        const shadow = this.shadowRoot
        // const buttons = shadow.querySelectorAll('button.letter')
        // buttons.forEach(button => {
        //     button.addEventListener('click', (e) => {
        //         e.stopPropagation()
        //         this.setColor(button, true)
        //     })
        // })

        // shadow.querySelector('button[data-action="check-word"]').addEventListener('click', (e) => {
        //     e.stopPropagation()
        //     const url = routes.Daily.reverse()
        //     goTo(url)
        // })
    }
}

customElements.define('keyboard-component', KeyboardComponent)