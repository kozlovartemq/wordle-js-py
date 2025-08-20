import timerStyles from '../styles/timer.css.js'


class CountdownTimer extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })

        const wrapper = document.createElement('div')
        wrapper.classList.add('timer')

        wrapper.innerHTML = `
            <span>00:00:00</span>
        `

        const style = document.createElement('style')
        style.textContent = timerStyles()

        shadow.appendChild(style)
        shadow.appendChild(wrapper)
    }

    connectedCallback() {
        this.updateTimer()
        this.interval = setInterval(() => this.updateTimer(), 1000)
    }

    disconnectedCallback() {
        clearInterval(this.interval)
    }

    updateTimer() {
        const shadow = this.shadowRoot
        const timeDisplay = shadow.querySelector('span')

        const now = new Date()
        const updateTime = VITE__DAILY_UPDATE_TIME_UTC
        const [hour, minute, second] = updateTime.split(":").map(Number)

        const next = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            hour,
            minute,
            second
        ))

        if (now >= next) next.setUTCDate(next.getUTCDate() + 1)

        const diff = next - now
        const totalSeconds = Math.floor(diff / 1000)
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
        const seconds = String(totalSeconds % 60).padStart(2, '0')

        timeDisplay.textContent = `${hours}:${minutes}:${seconds}`
    }
}

customElements.define('countdown-timer', CountdownTimer)