import { goTo } from '../router'

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
        style.textContent = `
        .copy-container {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1rem;
            background: #f2f2f2;
            border-radius: 8px;
            border: 1px solid #ccc;
            position: relative;
            max-width: 100%;
            width: fit-content;
            font-family: sans-serif;
            cursor: default;
        }

        .copy-text {
            margin: 0;
            font-size: 0.95rem;
            color: #333;
            user-select: all;
            overflow-wrap: anywhere;
        }

        .copy-button {
            background: #e5e5e5;
            border: none;
            cursor: pointer;
            padding: 0.4rem 0.6rem;
            font-size: 1rem;
            border-radius: 6px;
            transition: background 0.2s ease;
            width: 2.5rem;
        }

        .copy-button:hover {
            background: #d0d0d0;
        }

        .copied-popup {
            position: absolute;
            top: -1.8rem;
            right: 0;
            background: #333;
            color: white;
            font-size: 0.75rem;
            padding: 0.3rem 0.6rem;
            border-radius: 4px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
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