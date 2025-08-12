import appConstants from '../common/constants'
import navLinkStyles from '../styles/nav-link.css.js'


class NavComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        const wrapper = document.createElement('div')

        wrapper.setAttribute('class', 'main-menu')
        this.links = [
            { href: appConstants.routes.index, name: 'Домой', class: 'home-link' },
            { href: appConstants.routes.create, name: 'Создать игру', class: 'create-link' },
            { href: appConstants.routes.games, name: 'Найти игру', class: 'games-link' },
        ]

        const style = document.createElement('style')
        style.textContent = navLinkStyles()

        shadow.appendChild(style)
        shadow.appendChild(wrapper)

        this.links.forEach(link => {
            const l = document.createElement('nav-link')
            l.setAttribute('class', `main-link ${link.class}`)
            l.setAttribute('href', link.href)
            l.setAttribute('text', link.name)
            wrapper.appendChild(l)
        })
    }

    connectedCallback() {
        const shadow = this.shadowRoot
        const { pathname: path } = new URL(window.location.href)
        const link = this.links.find((l) => l.href === path)

        if (link) {
            const linkElement = shadow.querySelector(`.${link.class}`)
            linkElement.setAttribute('selected', 'true')
        }
    }
}

customElements.define('main-nav', NavComponent)