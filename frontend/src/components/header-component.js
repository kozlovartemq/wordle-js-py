import appConstants from '../common/constants'


class HeaderComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        const wrapper = document.createElement('div')
        wrapper.setAttribute('class', 'header-panel')

        const style = document.createElement('style')
        style.textContent = `
        .header-panel {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #fff;
            padding: 1rem 0;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            margin-bottom: 1.5rem;
        }
           
        `

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