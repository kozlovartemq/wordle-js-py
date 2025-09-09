import appConstants from '../common/constants'
import toggleStyles from '../styles/bg-toggle.css.js'


class BGToggleComponent extends HTMLElement {
    constructor() {
        super()
        this.selected = localStorage.getItem('theme') || appConstants.theme.LIGHT

        const shadow = this.attachShadow({ mode: 'open' })
        const wrapper = document.createElement('div')
        wrapper.classList.add('theme-toggle')

        wrapper.innerHTML = `
            <span class="icon">🔆</span>
            <div class="toggle-slider"></div>
            <span class="icon">🌙</span>
        `

        const style = document.createElement('style')
        style.textContent = toggleStyles()

        shadow.appendChild(style)
        shadow.appendChild(wrapper)
    }

    connectedCallback() {
        this.initTheme()
        const shadow = this.shadowRoot

        const themeToggle = shadow.querySelector("div.theme-toggle")
        themeToggle.addEventListener("click", () => {
            this.setTheme(this.selected === appConstants.theme.LIGHT ? appConstants.theme.DARK : appConstants.theme.LIGHT)
        })
    }

    initTheme() {
        const saved = localStorage.getItem("theme")
        if (saved) {
            this.setTheme(saved)
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            const theme = prefersDark ? appConstants.theme.DARK : appConstants.theme.LIGHT
            this.setTheme(theme)
            localStorage.setItem("theme", theme)
        }
    }

    setTheme(theme) {
        const shadow = this.shadowRoot
        const themeToggle = shadow.querySelector("div.theme-toggle")

        document.documentElement.setAttribute("data-theme", theme)
        localStorage.setItem("theme", theme)
        this.selected = theme

        if (theme === appConstants.theme.DARK) {
            themeToggle.classList.add("active")
        } else {
            themeToggle.classList.remove("active")
        }
    }
}

customElements.define('bg-toggle', BGToggleComponent)