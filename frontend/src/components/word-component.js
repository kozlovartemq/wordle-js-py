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

}

customElements.define('word-component', WordComponent)