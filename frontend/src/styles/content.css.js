import appConstants from '../common/constants'


export default () => `
.common-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
}

.content-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 20px 0 10px;
    padding: 10px 20px;
    text-align: center;
    background-color: #f0f0f0;
    color: #333;
    border-left: 5px solid ${appConstants.custom_color.wordle_green};
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    width: 500px;
}

.input-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 12px;
    margin-top: 30px;
    width: 500px;
}

.input-wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0px
    flex-grow: 1;
}

input {
    padding: 10px 16px;
    font-size: 18px;
    border: 2px solid #ccc;
    border-radius: 8px;
    outline: none;
    width: 350px;
    transition: border-color 0.3s, box-shadow 0.3s;
    height: 1rem;
}

input:focus {
    border-color: ${appConstants.custom_color.green};
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.4);
}

.input-hint {
    text-align: center;
    font-size: 16px;
    color: ${appConstants.custom_color.red};
    margin-top: 10px;
    height: 20px;
}

/* length-selector */

.word-length-selector {
    text-align: center;
    margin: 1rem auto;
}

.selector-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.75rem;
    color: #333;
}

.length-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.length-button {
    padding: 0.5rem 1.2rem;
    font-size: 1.1rem;
    font-weight: bold;
    background-color: #ffffff;
    border: 2px solid ${appConstants.custom_color.wordle_green};
    border-radius: 8px;
    cursor: pointer;
    color: #333;
    transition: all 0.2s ease-in-out;
}

.length-button:hover {
    background-color: ${appConstants.custom_color.wordle_green};
    color: #fff;
}

.length-button.selected {
    background-color: ${appConstants.custom_color.wordle_green};
    color: white;
    box-shadow: 0 0 0 3px rgba(106, 170, 100, 0.3);
}


/* чекбокс */

.dictionary-check {
    display: flex;
    justify-content: center;
}

.checkbox-container {
    position: relative;
    padding-left: 2rem;
    cursor: pointer;
    font-size: 1.1rem;
    user-select: none;
    color: #333;
}

/* Скрываем стандартный чекбокс */
.checkbox-container input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

/* Кастомный чекбокс */
.custom-checkbox {
    position: absolute;
    top: 0.1rem;
    left: 0;
    height: 1.2rem;
    width: 1.2rem;
    background-color: #fff;
    border: 2px solid ${appConstants.custom_color.wordle_green};
    border-radius: 4px;
    transition: all 0.2s ease;
}

/* Галочка при выборе */
.checkbox-container input:checked ~ .custom-checkbox {
    background-color: ${appConstants.custom_color.wordle_green};
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
}

/* Hover эффект */
.checkbox-container:hover .custom-checkbox {
    box-shadow: 0 0 0 2px rgba(106, 170, 100, 0.3);
}`;
