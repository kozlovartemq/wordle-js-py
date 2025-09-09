export default () => `
.word-container {
    display: flex;
    gap: 8px;
    margin-top: 6px;
    margin-bottom: 6px;
    justify-content: center;
}

.letter-box {
    width: 50px;
    height: 50px;
    border: 2px solid #ccc;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    vertical-align: middle;
    line-height: 50px;
    text-transform: uppercase;
    background: var(--bg-color-component);
    color: var(--text-color);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
}`;
