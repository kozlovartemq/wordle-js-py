import timerStyles from '../styles/timer.css.js'


class CountdownTimer extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })

        const wrapper = document.createElement('div')
        wrapper.classList.add('timer')
        
        wrapper.innerHTML = `
            <span>00:00:00</span>
            <div class="update-message">Ежедневная игра обновилась!</div>
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
            const message = shadow.querySelector('div.update-message')
        
        const now = new Date()
        const nextUtcMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1))
        nextUtcMidnight.setTime(nextUtcMidnight.getTime() + 5 * 1000) // Add 5 seconds to syncronize with 'update word' job time on backend
        const diff = nextUtcMidnight - now

        if (diff <= 0) {
            clearInterval(this.interval)
            timeDisplay.style.display = 'none'
            message.style.display = 'block'
            return
        }

        const totalSeconds = Math.floor(diff / 1000)
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
        const seconds = String(totalSeconds % 60).padStart(2, '0')

        timeDisplay.textContent = `${hours}:${minutes}:${seconds}`
    }
}

customElements.define('countdown-timer', CountdownTimer)