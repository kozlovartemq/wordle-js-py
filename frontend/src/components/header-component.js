import appConstants from '../common/constants'
import headerStyles from '../styles/header.css.js'


class HeaderComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        const wrapper = document.createElement('div')
        wrapper.setAttribute('class', 'header-panel')

        const style = document.createElement('style')
        style.textContent = headerStyles()

        shadow.appendChild(style)
        shadow.appendChild(wrapper)
    }

    connectedCallback() {
        const wrapper = this.shadowRoot.querySelector('.header-panel')
        const word = document.createElement('word-component')
        word.content = 'WORDLE'
        const letters = word.shadowRoot.querySelectorAll('.letter-box')
        letters.forEach(element => {
            element.style.background = appConstants.custom_color.green
            element.style.color = 'white'
        });
        wrapper.appendChild(word)
    }
}

customElements.define('header-component', HeaderComponent)