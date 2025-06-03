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
        style.textContent = `
        
            .timer {
                font-family: 'Courier New', monospace;
                font-size: 1.5rem;
                padding: 0.5rem 1rem;
                background-color: #222;
                color: #0f0;
                border-radius: 8px;
                display: inline-block;
                box-shadow: 0 0 10px rgba(0,255,0,0.5);
                animation: pulse 1s infinite;
            }

            .update-message {
                display: none;
                margin-top: 0.5rem;
                font-size: 1rem;
                color: #00ff00;
                animation: fadeIn 1s ease-in;
            }

            @keyframes pulse {
                0% { box-shadow: 0 0 5px rgba(0,255,0,0.3); }
                50% { box-shadow: 0 0 20px rgba(0,255,0,0.7); }
                100% { box-shadow: 0 0 5px rgba(0,255,0,0.3); }
            }
        `

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