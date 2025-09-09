export default () => `

.theme-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    left: calc(100% - 75px);
    color: #000000;
    width: 70px;
    height: 24px;
    padding: 4px;
    border-radius: 50px;
    background-color: var(--bg-color-toggle);
    position: relative;
    cursor: pointer;
    transition: background 0.3s ease;
}

.icon {
    font-size: 16px;
    z-index: 2;
    pointer-events: none;
}

.toggle-slider {
    position: absolute;
    top: 4px;
    left: 3px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    transition: left 0.3s ease, background 0.3s ease;
}

.theme-toggle.active .toggle-slider {
    left: calc(100% - 27px);
}`;
