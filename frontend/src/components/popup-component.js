import appConstants from '../common/constants'
import { goTo } from '../router'
import { getArchive } from '../api/endpoints'


class PopUpComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        const wrapper = document.createElement('div')
        wrapper.setAttribute('class', 'popup-overlay')
        wrapper.innerHTML = `
            <div class="popup-container">
                <div class="popup-content"></div>
                <button class="submit-button position-right" data-action="close">Закрыть</button>
            </div>
        `
        const style = document.createElement('style')

        style.textContent = `
            .popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }

            .popup-container {
                background: white;
                padding: 1rem 4rem 4rem;
                border-radius: 10px;
                max-width: 90vw;
                max-height: 90vh;
                overflow: auto;
                position: relative;
                box-shadow: 0 10px 20px rgba(0,0,0,0.3);
            }

            .submit-button {
                position: absolute;    
                padding: 10px 20px;
                font-size: 18px;
                background-color: ${appConstants.custom_color.green};
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                transition: background-color 0.3s, transform 0.2s;
                height: 41px;
                bottom: 1rem;
            }

            .position-right {
                right: 1rem;
            }

            .position-left {
                left: 1rem;
            }
            
            .submit-button:hover {
                background-color: ${appConstants.custom_color.light_green};
            }
            
            .submit-button:active {
                transform: scale(0.98);
            }

            p a {
                color:rgb(11, 12, 14);
                text-decoration: none;
                transition: color 0.2s ease, border-color 0.2s ease;
                border-bottom: 1px dashed rgb(11, 12, 14);
            }

            p a:focus,
            p a:hover {
                outline: none;
                color: ${appConstants.custom_color.link_blue};
                border-bottom: 1px dashed ${appConstants.custom_color.link_blue};
            }


            p a:active {
                color:${appConstants.custom_color.red};
                border-bottom: 1px dashed ${appConstants.custom_color.red};
            }

            .archive-list {
                max-height: 400px;         /* или 60vh — если хочешь адаптивность */
                overflow-y: auto;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;

                background-color: #f9f9f9;
                border-radius: 12px;
                box-shadow: 0 0 12px rgba(0,0,0,0.1);
            }

            /* Стили плитки */
            .archive-tile {
                display: block;
                padding: 14px 18px;
                background-color: #e7ffe7;
                border-left: 6px solid ${appConstants.custom_color.wordle_green};
                border-radius: 8px;
                color: #222;
                text-decoration: none;
                font-weight: 500;
                transition: background-color 0.2s, transform 0.1s;
            }

            .archive-tile:hover {
                background-color: #d9fdd9;
                transform: translateX(3px);
            }

            .loader {
                text-align: center;
                padding: 10px;
                font-size: 14px;
                color: #888;
            }

            .hidden {
                display: none;
            }
        `

        shadow.appendChild(style)
        shadow.appendChild(wrapper)

    }

    connectedCallback() {
        const shadow = this.shadowRoot
        const wrapper = shadow.querySelector(".popup-overlay")
        wrapper.addEventListener('click', (e) => {
            if (e.target === wrapper) {
                this.remove()
            }
        })

        wrapper.querySelector('button[data-action="close"]').addEventListener('click', () => {
            this.remove()
        })
    }

    renderRules() {
        const shadow = this.shadowRoot
        const content = shadow.querySelector(".popup-content")
        content.innerHTML = `
        <h2>Правила игры</h2>
        <p>
            <b>Цель игры:</b><br>
            Угадать загаданное пятибуквенное слово за 6 попыток.<br><br>
            После каждой попытки буквы в загаданном слове подсвечиваются цветом:<br>
            <b><span style="color: ${appConstants.custom_color.green};">Зеленый:</span></b> буква есть в загаданном слове и находится на правильном месте.<br>
            <b><span style="color: ${appConstants.custom_color.yellow};">Желтый:</span></b> буква есть в загаданном слове, но находится не на правильном месте.<br>
            <b><span style="color: ${appConstants.custom_color.red};">Красный:</span></b> буква отсутствует в загаданном слове.<br><br>
            <a href="/daily"><b>Ежедневная игра:</b></a> В Wordle загадывается одно и то же слово дня для всех игроков.<br> 
            <a href="/create"><b>Своя игра:</b></a> Загадай В Wordle свое слово и поделись ссылкой с друзьями.<br> 
            <b>Случайная игра:</b> В Wordle загадывается случайное слово из словаря для игрока.<br> 

        </p>
        `

    }

    renderResults() {
        let copy_text = `
        Я разгадал(a) 5-буквенное слово с 3/6 попыток. 

        ⬛⬛⬛🟨🟩
        🟨⬛⬛🟨🟩
        🟩🟩🟩🟩🟩

        Сможешь ли ты разгадать это слово? 
        ${url}
        `
        this.innerHTML = ``
    }

    renderGotoAlert(path) {
        const shadow = this.shadowRoot
        const content = shadow.querySelector(".popup-content")
        content.innerHTML = `
        <h2>Вы покидаете страницу игры!</h2>
        <p>
            После ухода со страницы весь прогресс игры будет утерян. Продолжить?
        </p>
        <button class="submit-button position-left" data-action="goto">Уйти</button>
        `

        content.querySelector('button[data-action="goto"]').addEventListener('click', () => {
            goTo(path)
        })
    }

    async renderArchiveGames() {
        this.archivePage = 1
        this.isLoadingArchive = false
        this.hasMoreArchive = true

        const shadow = this.shadowRoot
        const content = shadow.querySelector(".popup-content")
        content.innerHTML = `
        <h2>Архивные игры</h2>
        <div class="archive-list">
            <div id="loader" class="loader">Загрузка...</div>
        </div>
        `
        await this.loadArchivePage(this.archivePage)

        this.archiveObserver = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting) {
                this.archivePage++
                await this.loadArchivePage(this.archivePage)
            }
        }, {
            root: null,
            threshold: 1.0
        })
        this.archiveObserver.observe(shadow.querySelector('.loader'))
    }

    async loadArchivePage() {
        if (!this.hasMoreArchive) this.archiveObserver.disconnect()

        if (this.isLoadingArchive || !this.hasMoreArchive) return

        this.isLoadingArchive = true
        const shadow = this.shadowRoot
        const loader = shadow.querySelector('.loader')
        const archiveList = shadow.querySelector('.archive-list')
        const archiveResponse = await getArchive(this.archivePage)
        if (archiveResponse.ok) {
            if (archiveResponse.data.length === 0 && this.archivePage === 1) {
                loader.textContent = "Архивных игр пока нет :("
                this.hasMoreArchive = false
                return
            } else if (archiveResponse.data.length === 0) {
                this.hasMoreArchive = false
                loader.textContent = 'Больше игр нет'
                return
            }
            archiveResponse.data.forEach(game => {
                const tile = document.createElement('a');
                tile.className = 'archive-tile'
                tile.href = `games/${game.game_uuid}`
                tile.textContent = `Ежедневная игра от ${game.game_date}`
                archiveList.insertBefore(tile, loader)
            })
        } else {
            const error_text = 'Ошибка загрузки архива'
            console.error(error_text)
            loader.textContent = error_text
            this.hasMoreArchive = false
        }
        this.isLoadingArchive = false;
    }
}


customElements.define('pop-up', PopUpComponent)