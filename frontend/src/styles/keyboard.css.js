import appConstants from '../common/constants'

export default () => `
.keyboard {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.5rem;
    background-color: #d3d6da;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    z-index: 1000;
    box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.2);

    max-width: 500px;
    margin: 0 auto;
    width: 100%;
}

.keyboard-row {
    display: flex;
    justify-content: center;
    gap: 0.3rem;
}

.keyboard-row button {
    flex: 1;
    padding: 0.8rem 0;
    font-size: 1rem;
    font-weight: bold;
    text-transform: uppercase;
    background-color: #eee;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.3s ease;
}

.keyboard-row button:hover {
    background-color: #ccc;
}

.keyboard-row button.letter:disabled {
    background-color: #ccc;
    cursor: auto;
}

.keyboard-row .letter-red {
    background-color: ${appConstants.letter_color.red};
}

.keyboard-row .letter-red:hover {
    background-color: ${appConstants.custom_color.dark_red};
}

.keyboard-row button.letter-red:disabled {
    background-color: ${appConstants.custom_color.dark_red};
}

.keyboard-row .letter-yellow {
    background-color: ${appConstants.letter_color.yellow};
}

.keyboard-row .letter-yellow:hover {
    background-color: ${appConstants.custom_color.dark_yellow};
}

.keyboard-row button.letter-yellow:disabled {
    background-color: ${appConstants.custom_color.dark_yellow};
}

.keyboard-row .letter-green {
    background-color: ${appConstants.letter_color.green};
}

.keyboard-row .letter-green:hover {
    background-color: ${appConstants.custom_color.dark_green};
}

.keyboard-row button.letter-green:disabled {
    background-color: ${appConstants.custom_color.dark_green};
}

/* Стили для кнопок стереть и ввод */
.keyboard-row .action-button {
    flex: 1.5;
    background-color: #a4aec4;
    color: white;
}

.keyboard-row .action-button:hover {
    background-color: #8891a7;
}

.keyboard-row .action-button:disabled {
    background-color: #8891a7;
    cursor: auto;
}

/* Адаптивность */
@media (max-width: 600px) {
    .keyboard {
        max-width: none;
        padding: 0.3rem;
        gap: 0.2rem;
    }

    .keyboard-row button {
        font-size: 0.9rem;
        padding: 0.6rem 0;
    }
}`;
