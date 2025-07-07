import { goTo } from '../router'
import copyStyles from '../styles/copy.css.js'


class CopyComponent extends HTMLElement {
    constructor() {
        super()
        this._content = ""

        const shadow = this.attachShadow({ mode: 'open' })
        const wrapper = document.createElement('div')
        wrapper.setAttribute('class', 'copy-container')

        wrapper.innerHTML = `
            
            <p class="copy-text"></p>
            <button class="copy-button" data-action="copy" title="Скопировать">
                📋
            </button>
            <button class="copy-button" data-action="goto" title="На страницу игры">
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

    renderText() {
        const shadow = this.shadowRoot
        const p = shadow.querySelector(".copy-text")
        p.textContent = window.location.origin + this._content
    }

    connectedCallback() {
        const shadow = this.shadowRoot
        const copyButton = shadow.querySelector('button[data-action="copy"]')
        const copyText = shadow.querySelector('.copy-text')
        const copiedPopup = shadow.querySelector('.copied-popup')

        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(copyText.textContent).then(() => {
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