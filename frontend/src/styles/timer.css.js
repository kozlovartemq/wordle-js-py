export default () => `
.timer {
    padding: 0.2rem 0.5rem;
    background-color: #222;
    color: #0f0;
    border-radius: 8px;
    display: inline-block;
    box-shadow: 0 0 10px rgba(0,255,0,0.5);
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0% { box-shadow: 0 0 5px rgba(0,255,0,0.3); }
    50% { box-shadow: 0 0 20px rgba(0,255,0,0.7); }
    100% { box-shadow: 0 0 5px rgba(0,255,0,0.3); }
}`;
