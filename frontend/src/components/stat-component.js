import statStyles from '../styles/stat.css.js'


class StatComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })

        const wrapper = document.createElement('div')
        wrapper.classList.add('stats-container')

        const style = document.createElement('style')
        style.textContent = statStyles()

        shadow.appendChild(style)
        shadow.appendChild(wrapper)
    }

    renderStatistics(stat, tries) {

        const shadow = this.shadowRoot
        const container = shadow.querySelector("div.stats-container")

        const title = document.createElement("h3")
        title.textContent = `Статистика для этого слова:`
        const overall = document.createElement("p")
        overall.className = "overall"
        overall.textContent = `Всего игр: ${stat.games_overall}`

        const chart = document.createElement("div")
        chart.className = "bar-chart"

        const maxCount = Math.max(
            stat.lost,
            stat.first_try,
            stat.second_try,
            stat.third_try,
            stat.fourth_try,
            stat.fifth_try,
            stat.sixth_try,
            1
        )

        const triesMap = [
            { label: "X/6", key: "lost" },
            { label: "1/6", key: "first_try" },
            { label: "2/6", key: "second_try" },
            { label: "3/6", key: "third_try" },
            { label: "4/6", key: "fourth_try" },
            { label: "5/6", key: "fifth_try" },
            { label: "6/6", key: "sixth_try" }
        ]

        triesMap.forEach((item, index) => {
            const count = stat[item.key]
            const bar = document.createElement("div")
            bar.className = "bar"

            if (index === tries) {
                bar.classList.add("current")
            }

            const barFillContainer = document.createElement("div")
            barFillContainer.className = "bar-fill-container"
            
            const barInner = document.createElement("div")
            barInner.className = "bar-inner"
            barInner.style.height = `${(count / maxCount) * 100}%`
            barInner.style.width = `38px`

            const label = document.createElement("div")
            label.className = "bar-label"
            label.textContent = item.label

            const value = document.createElement("div")
            value.className = "bar-value"
            value.textContent = count

            barFillContainer.appendChild(barInner)
            bar.appendChild(barFillContainer)
            bar.appendChild(value)
            bar.appendChild(label)
            chart.appendChild(bar)
        })

    container.appendChild(title)
    container.appendChild(overall)
    container.appendChild(chart)
    }
}

customElements.define('stat-component', StatComponent)