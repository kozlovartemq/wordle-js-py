import { goTo } from '../router'

class LinkComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        const link = document.createElement('a')
        const style = document.createElement('style')
        this.selected = false

        style.textContent = `
           
           a {
                color: #f1f1f1;
                text-decoration: none;
                font-size: 1.1rem;
                font-weight: 500;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                transition: background-color 0.3s ease, color 0.3s ease;
                display: block;
                padding: 8px 12px;
           }

           a:hover {
                background-color: #2e2e2e;
                color: #fff;
           }
        `

        shadow.appendChild(style)
        shadow.appendChild(link)

    }

    connectedCallback() {
        const shadow = this.shadowRoot
        const childNodes = shadow.childNodes

        const href = this.getAttribute('href')
        const link = shadow.querySelector('a')
        link.href = href
        link.textContent = this.getAttribute('text')
        link.addEventListener('click', this.onClick)
    }

    onClick = (e) => {
        e.preventDefault()
        if (!this.selected) {
            const { pathname: path } = new URL(e.target.href)
            goTo(path)
        }
    }

    static get observedAttributes() {
        return ['selected']
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'selected') {
            this.updateStyle(JSON.parse(newValue))
        }
    }

    updateStyle(selected) {
        if (selected) {
            const shadow = this.shadowRoot
            const style = shadow.querySelector('style')
            this.selected = true
            style.textContent = `
            a {
                background-color:rgb(65, 65, 65);
                color: #f1f1f1;
                text-decoration: none;
                font-size: 1.1rem;
                font-weight: 500;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                transition: background-color 0.3s ease, color 0.3s ease;
                display: block;
                padding: 8px 12px;
            }
            `
        }
    }
}

customElements.define('nav-link', LinkComponent)