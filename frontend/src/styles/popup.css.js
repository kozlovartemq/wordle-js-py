import appConstants from '../common/constants'

export default () => `
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
    max-height: 400px;         /* или 60vh для адаптивности */
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 0 12px rgba(0,0,0,0.1);
}

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
}`;
