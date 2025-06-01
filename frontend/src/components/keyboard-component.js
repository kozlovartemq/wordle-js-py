import appConstants from '../common/constants'


class KeyboardComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        const wrapper = document.createElement('div')
        wrapper.setAttribute('class', 'keyboard')

        wrapper.innerHTML = `
            
            <div class="keyboard-row">
                <button class="letter" data-letter="Й">Й</button>
                <button class="letter" data-letter="Ц">Ц</button>
                <button class="letter" data-letter="У">У</button>
                <button class="letter" data-letter="К">К</button>
                <button class="letter" data-letter="Е">Е</button>
                <button class="letter" data-letter="Н">Н</button>
                <button class="letter" data-letter="Г">Г</button>
                <button class="letter" data-letter="Ш">Ш</button>
                <button class="letter" data-letter="Щ">Щ</button>
                <button class="letter" data-letter="З">З</button>
                <button class="letter" data-letter="Х">Х</button>
                <button class="letter" data-letter="Ъ">Ъ</button>
            </div>
            <div class="keyboard-row">
                <button class="letter" data-letter="Ф">Ф</button>
                <button class="letter" data-letter="Ы">Ы</button>
                <button class="letter" data-letter="В">В</button>
                <button class="letter" data-letter="А">А</button>
                <button class="letter" data-letter="П">П</button>
                <button class="letter" data-letter="Р">Р</button>
                <button class="letter" data-letter="О">О</button>
                <button class="letter" data-letter="Л">Л</button>
                <button class="letter" data-letter="Д">Д</button>
                <button class="letter" data-letter="Ж">Ж</button>
                <button class="letter" data-letter="Э">Э</button>
            </div>
            <div class="keyboard-row">
                <button class="action-button" data-letter="BACKSPACE" data-action="backspace">⌫</button>
                <button class="letter" data-letter="Я">Я</button>
                <button class="letter" data-letter="Ч">Ч</button>
                <button class="letter" data-letter="С">С</button>
                <button class="letter" data-letter="М">М</button>
                <button class="letter" data-letter="И">И</button>
                <button class="letter" data-letter="Т">Т</button>
                <button class="letter" data-letter="Ь">Ь</button>
                <button class="letter" data-letter="Б">Б</button>  
                <button class="letter" data-letter="Ю">Ю</button>           
                <button class="action-button" data-letter="ENTER" data-action="check-word" disabled>⏎</button>
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

        .keyboard-row .letter-red {
            background-color: ${appConstants.letter_color.red};
        }
        
        .keyboard-row .letter-red:hover {
            background-color: ${appConstants.custom_color.dark_red};
        }

        .keyboard-row .letter-yellow {
            background-color: ${appConstants.letter_color.yellow};
        }
        
        .keyboard-row .letter-yellow:hover {
            background-color: ${appConstants.custom_color.dark_yellow};
        }

        .keyboard-row .letter-green {
            background-color: ${appConstants.letter_color.green};
        }
        
        .keyboard-row .letter-green:hover {
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
        return this.shadowRoot.querySelector(`button[data-letter="${letter.toUpperCase()}"]`)
    }

    setColor(button, value){
        button.classList.remove('letter-green', 'letter-yellow', 'letter-red')
        button.classList.add('letter-' + value)
    }


    connectedCallback() {
        const shadow = this.shadowRoot
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