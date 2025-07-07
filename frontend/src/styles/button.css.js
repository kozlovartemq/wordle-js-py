import appConstants from '../common/constants'


export default () => `
.submit-button {
    padding: 10px 20px;
    font-size: 18px;
    background-color: ${appConstants.custom_color.green};
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    height: 41px;
}

.submit-button:hover {
    background-color: ${appConstants.custom_color.light_green};
}

.submit-button:active {
    transform: scale(0.98);
}

.submit-button:disabled {
    background-color: ${appConstants.custom_color.dark_green};
    cursor: auto;
} 

.submit-button:disabled:hover,
.submit-button:disabled:active {
    background-color: ${appConstants.custom_color.dark_green};
    transform: scale(1);
} 

.position-right {
    position: absolute;
    right: 1rem;
}

.position-left {
    position: absolute;
    left: 1rem;
}

.position-bottom {
    position: absolute;
    bottom: 1rem;
}`;