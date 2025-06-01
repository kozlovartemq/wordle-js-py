import appConstants from '../common/constants'
import { countOccurrences } from '../common/utils'


class WordComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        const wrapper = document.createElement('div')
        wrapper.setAttribute('class', 'word-container')
        this._content = ''

        const style = document.createElement('style')
        style.textContent = `
        .word-container {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
            justify-content: center;
        }
        
        .letter-box {
            width: 50px;
            height: 50px;
            border: 2px solid #ccc;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            vertical-align: middle;
            line-height: 50px;
            text-transform: uppercase;
            background-color: white;
            color: black;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease;
        }
           
        `

        shadow.appendChild(style)
        shadow.appendChild(wrapper)
    }

    get content() {
        return this._content;
    }

    set content(value) {
        if (this._content === value) return;
        this._content = value.toUpperCase()
        this._renderLetters()
    }

    _renderLetters() {
        const wrapper = this.shadowRoot.querySelector('.word-container')
        if (!wrapper) return

        wrapper.innerHTML = ''
        for (let i = 0; i < this._content.length; i++) {
            const letter = document.createElement("div")
            letter.className = "letter-box"
            letter.id = i
            letter.textContent = this._content[i]
            wrapper.appendChild(letter)
        }
    }

    setColors(word_revision){
        const shadow = this.shadowRoot
        const letters = shadow.querySelectorAll("div.letter-box")
        letters.forEach((element, index) => {
            element.style.backgroundColor = appConstants.letter_color[word_revision[index]]
        })
    }

    fillNextEmpty(letter){
        const empties = countOccurrences(this.content, ' ')
        const letters_part = this.content.replaceAll(' ', '')
        if (empties > 0) {
           this.content = letters_part + letter + ' '.repeat(empties - 1)
           return true 
        } else return false
    }
    
    clearPreviousBusy(){
        const empties = countOccurrences(this.content, ' ')
        const letter_part = this.content.replaceAll(' ', '')
        if (letter_part.length > 0) {
            this.content = letter_part.slice(0, -1) + ' '.repeat(empties + 1)
            return letter_part.slice(-1)
        } else return null
    }

    is_full(){
        return this.content.search(' ') === -1
    }
}

customElements.define('word-component', WordComponent)