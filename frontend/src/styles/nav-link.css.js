export default () => `
.main-menu {
    position: fixed;
    top: 20px;
    left: 20px;    
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 1000;
    width: 160px;

    justify-content: center;
    padding: 1rem 0;
    background-color: #1e1e1e;
    border-bottom: 1px solid #333;
    border-radius: 12px;
}`;
