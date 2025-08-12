import appConstants from '../common/constants'


export default () => `

.button-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
}

.submit-button {
    padding: 10px 10px;
    font-size: 18px;
    background-color: ${appConstants.custom_color.green};
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
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
}

.rectangle {
    font-weight: 600;
    padding: 0.5rem 1rem;
}

.surrender-button {
    background-color: ${appConstants.custom_color.red};
    color: white;
    border: none;
    border-radius: 0.5rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
    cursor: pointer;
}

.surrender-button:hover {
    background-color: ${appConstants.custom_color.dark_red};
}

.surrender-button:active {
    transform: scale(0.97);
}

.surrender-button:disabled {
    background-color: ${appConstants.custom_color.dark_red};
    cursor: auto;
} 

.surrender-button:disabled:hover,
.surrender-button:disabled:active {
    background-color: ${appConstants.custom_color.dark_red};
    transform: scale(1);
} 

.other-games {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
}

.other-games-btn {
    background-color: ${appConstants.custom_color.green};
    color: #fff;
    border: none;
    padding: 6px 12px;
    margin: 2px 0;
    border-radius: 6px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease;
}
.other-games-btn:hover {
    background-color: #219150;
}
.other-games-btn:active {
    transform: scale(0.97);
}

.other-games-btn {
    align-items: center;
    justify-content: center;
    white-space: nowrap;
}
`;