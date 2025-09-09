import appConstants from '../common/constants'


export default () => `
.common-container {
    display: flex;
    flex-direction: column;
    gap: 0px;
    align-items: center;
}

.attempts-remaining {
    font-size: 20px;
    font-weight: 700;
    background-color: var(--bg-color-component-soft);
    color: var(--text-color-soft);
    transition: background 0.3s ease, color 0.3s ease;
    text-align: center;
    margin-bottom: 8px;
    padding: 8px 16px;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
}

.result-hint {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: ${appConstants.custom_color.red};
    margin-top: 5px;
    height: 20px;
}

.dictionary-status {
    display: flex;
    gap: 8px;
    justify-content: center;
    align-items: center;
}

.status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: gray;
}`;
