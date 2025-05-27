import appConstants from '../common/constants'

class NavComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        const wrapper = document.createElement('div')
        this.searchType = appConstants.search.types.game

        wrapper.setAttribute('class', 'main-menu')
        this.links = [
            { href: appConstants.routes.index, name: 'Домой', class: 'home-link' },
            { href: appConstants.routes.create, name: 'Создать игру', class: 'create-link' },
            { href: appConstants.routes.games, name: 'Найти игру', class: 'games-link' },
        ]

        const style = document.createElement('style')

        style.textContent = `
           .main-menu {
           
                position: fixed;
                top: 20px;
                left: 20px;    
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                display: flex;
                flex-direction: column;
                gap: 10px;
                z-index: 1000;
                width: 160px;

                justify-content: center;
                gap: 10px;
                padding: 1rem 0;
                background-color: #1e1e1e;
                border-bottom: 1px solid #333;
                border-radius: 12px;
           }

           .global-search {
               font-size: 16px;
               border: 1px solid #ccc;
               border-radius: 8px;
               padding: 4px 20px;
               width: 100%;
               margin: 0 50px;
           }

           .global-search:placeholder{
               color: #aaa;
           }
           
        `

        shadow.appendChild(style)
        shadow.appendChild(wrapper)

        this.links.forEach(link => {
            const l = document.createElement('nav-link')
            l.setAttribute('class', `main-link ${link.class}`)
            l.setAttribute('href', link.href)
            l.setAttribute('text', link.name)
            wrapper.appendChild(l)
        })

        const search = document.createElement('input')
        search.setAttribute('class', 'global-search')
        search.addEventListener('keyup', (e) => {
            e.stopPropagation()
            if (e.key === 'Enter') {
                e.preventDefault()
                const text = e.target.value
                console.log('search', text)
            }
        })

        // wrapper.appendChild(search)

    }

    // updateSearch() {
    //     const shadow = this.shadowRoot
    //     const input = shadow.querySelector('input')
    //     const search = this.getAttribute('search')
    //     input.value = search
    //     if(this.searchType === appConstants.search.types.game){
    //         input.setAttribute('placeholder', 'Search game by id...')
    //     }

    // }

    connectedCallback() {
        const shadow = this.shadowRoot;
        // const searchText = this.getAttribute('search')
        this.searchType = this.getAttribute('type') ? this.getAttribute('type') : appConstants.search.types.game

        // if(searchText){
        //     const input = shadow.querySelector('input')
        //     input.value = searchText
        // }

        const { pathname: path } = new URL(window.location.href)
        const link = this.links.find((l) => l.href === path)

        if (link) {
            const linkElement = shadow.querySelector(`.${link.class}`)
            linkElement.setAttribute('selected', 'true')
        }
    }


    static get observedAttributes() {
        return ['search', 'type']
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // if(name === 'search'){
        //     this.updateSearch()
        // }
        if (name === 'type') {
            this.searchType = newValue
            // this.updateSearch()
        }
    }
}

customElements.define('main-nav', NavComponent)