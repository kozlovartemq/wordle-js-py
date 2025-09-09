import appConstants from '../common/constants'


export default () => `

.stats-container {
    padding: 20px;
    background: var(--bg-color-component-soft);
    color: var(--text-color-soft);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    margin: 10px auto;
    font-family: sans-serif;
}

.stats-container h3 {
    color: var(--text-color);
    margin-top: 0;
    margin-bottom: 5px;
    text-align: center;
    font-size: 20px;
}

.stats-container .overall {
    text-align: center;
    margin-bottom: 20px;
    font-size: 14px;
}

.bar-chart {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 200px;
    gap: 10px;
    padding: 0 10px;
}

.bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    height: 100%;
}

.bar-fill-container {
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
}

.bar-inner {
    width: 100%;
    background-color: #7fa7ff;
    border-radius: 4px 4px 0 0;
    transition: height 0.3s ease;
}

.bar.current .bar-inner {
    background-color: ${appConstants.custom_color.wordle_green};
}

.bar-label {
    margin-top: 6px;
    font-size: 12px;
}

.bar-value {
    font-size: 12px;
    margin-top: 4px;
}
`;