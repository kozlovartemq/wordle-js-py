export default () => `
.copy-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #f2f2f2;
    border-radius: 8px;
    border: 1px solid #ccc;
    position: relative;
    max-width: 100%;
    width: fit-content;
    font-family: sans-serif;
    cursor: default;
}

.padding {
    padding: 0.6rem 1rem;
}

.copy-text {
    margin: 0;
    font-size: 0.95rem;
    color: #333;
    user-select: all;
    overflow-wrap: anywhere;
}

.copy-button {
    background: #e5e5e5;
    border: none;
    cursor: pointer;
    padding: 0.4rem 0.6rem;
    font-size: 1rem;
    border-radius: 6px;
    transition: background 0.2s ease;
}

.width {
    width: 2.5rem;
}

.copy-button:hover {
    background: #d0d0d0;
}

.copied-popup {
    position: absolute;
    top: -1.8rem;
    right: 0;
    background: #333;
    color: white;
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}`;
