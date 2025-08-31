# wordle-js-py
- Production: https://wordle.kozlovartemq.ru
- Api docs: https://wordle.kozlovartemq.ru/api

### Technologies:
- Backend: Python, FastAPI, Pydantic, SQLite
- Frontend (SPA - Single Page Application): JS Vanila, route-parser
- Infrastructure: Nginx, Docker, Docker-compose, Cloudflare Tunnel

# Features:
### Backend:
- Strict API calls validation
- Daily game scheduled job
- Removing old games scheduled job
- Random game
- Creating your own game (with(/out) dictionary, 4 to 6 letters)
- Search for a game by its uuid
- Archive of games with the pagination
- Statistics of a game
- Health check

### Frontend:
- Single Page Application
- Custom leave game warning on "Back"/"Forward" buttons, nav link clicking 
- Dynamic archive pagination on scroll
- Save games to localStorage
- CleanUp old games from localStorage
- Handle game states in the another tabs
- Mount physical keyboard with the visual one
- Statistics in the form of a diagram
- Countdown timer of a daily game



# TODOs
- Backend tests (pytest?)
- mobile css support