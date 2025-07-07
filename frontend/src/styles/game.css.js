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
    color: #4a4a4a;
    text-align: center;
    margin-bottom: 20px;
    padding: 8px 16px;
    background-color: #f0f0f0;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
}

.input-hint {
    text-align: center;
    font-size: 16px;
    color: ${appConstants.custom_color.red};
    margin-top: 10px;
    height: 20px;
}

.dictionary-status {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    justify-content: center;
    align-items: center;
}

.status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: gray;
}`;
