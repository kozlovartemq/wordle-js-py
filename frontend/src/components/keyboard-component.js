import keyboardStyles from '../styles/keyboard.css.js'


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
        style.textContent = keyboardStyles()

        shadow.appendChild(style)
        shadow.appendChild(wrapper)
    }

    findButton(letter) {
        return this.shadowRoot.querySelector(`button[data-letter="${letter.toUpperCase()}"]`)
    }

    setColor(button, value) {
        button.classList.remove('letter-green', 'letter-yellow', 'letter-red')
        button.classList.add('letter-' + value)
    }

    disable() {
        const shadow = this.shadowRoot
        const buttons = shadow.querySelectorAll('button')
        buttons.forEach(button => {
            button.disabled = true
        })
    }
}

customElements.define('keyboard-component', KeyboardComponent)