import { goTo } from '../router'
import copyStyles from '../styles/copy.css.js'


class CopyComponent extends HTMLElement {
    constructor() {
        super()
        this._content = ""
        this._wordLength = ""

        const shadow = this.attachShadow({ mode: 'open' })
        const wrapper = document.createElement('div')
        wrapper.classList.add('copy-container', 'padding')

        wrapper.innerHTML = `
            
            <p class="copy-text"></p>
            <button class="copy-button width" data-action="copy" title="Скопировать">
                📋
            </button>
            <button class="copy-button width" data-action="goto" title="На страницу игры">
                🡕
            </button>
            <span class="copied-popup">Скопировано!</span>
            
        `

        const style = document.createElement('style')
        style.textContent = copyStyles()

        shadow.appendChild(style)
        shadow.appendChild(wrapper)
    }

    get content() {
        return this._content;
    }

    set content(value) {
        if (this._content === value) return;
        this._content = value
        this.renderText()
    }

    get wordLength() {
        return this._wordLength;
    }

    set wordLength(value) {
        if (this._wordLength === value) return;
        this._wordLength = value
    }

    renderText() {
        const shadow = this.shadowRoot
        const p = shadow.querySelector(".copy-text")
        p.textContent = window.location.origin + this._content
    }

    connectedCallback() {
        const shadow = this.shadowRoot
        const copyButton = shadow.querySelector('button[data-action="copy"]')
        const copyURL = shadow.querySelector('.copy-text').textContent
        const copiedPopup = shadow.querySelector('.copied-popup')
        const copyText = `Я загадал(a) ${this.wordLength}-буквенное слово.
Попробуй разгадать это слово!
${copyURL}`

        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(copyText).then(() => {
                copiedPopup.style.opacity = '1'
                setTimeout(() => {
                    copiedPopup.style.opacity = '0'
                }, 2000)
            })
        })
        const gotoButton = shadow.querySelector('button[data-action="goto"]')
        gotoButton.addEventListener('click', () => {
            goTo(this._content)
        })
    }
}

customElements.define('copy-component', CopyComponent)