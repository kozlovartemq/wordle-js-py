
import uuid

from fastapi import APIRouter, Depends, Request, Response, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from api.v1.game.schemas import GameCreate, GameRead, WordRequest
from core.models.db_helper import db_helper
from core.models.game import get_all_games, create_game, get_game_by_word



game_router = APIRouter(tags=["Game"], prefix='/game')


@game_router.post('/create_custom')
async def create_custom_game(
    data: WordRequest,
    session: AsyncSession = Depends(db_helper.session_dependency)
):
    new_word = data.word.upper()
    old_game = await get_game_by_word(session, new_word)
    if old_game is not None:
        return {"msg": "Игра уже существует", "game_uuid": old_game.uuid}
    
    game_uuid = str(uuid.uuid4())
    new_game = await create_game(session=session, game_create=GameCreate(uuid=game_uuid, word=new_word))
    
    return {"msg": "Создана новая игра", "game_uuid": new_game.uuid}



@game_router.get("/create_casual")
async def create_casual_game(request: Request):
    game_id = str(uuid.uuid4())

    #todo
    # get_word: word from dictionary
    # set_word: game_id: word
    
    redirect_url = request.url_for("get_game", game_id)
    return RedirectResponse(url=redirect_url)


@game_router.get("/games", response_model=list[GameRead])
async def get_games(
    session: AsyncSession = Depends(db_helper.session_dependency)
):
    games = await get_all_games(session=session)
    return games

@game_router.get('/games')
def all_games():
    # todo html- img
    return Response(status_code=401, ) # content=


@game_router.get('/games/{game_id}')
def get_game(game_id: uuid.UUID):
    # if not active_words.get(game_id):
    #     raise HTTPException(404, "Слово с таким идентификатором не найдено")
    # word = active_words[game_id]
    # session_id = str(uuid.uuid4())
    # new_game = GameHandler(word=word)
    # active_sessions[session_id] = new_game
    # return Response({'success': True, "len": len(word)})
    ...


class ResponseContent(BaseModel):
    success: bool = True
    details: dict | None

    def __str__(self):
        return {'success': self.success} if self.details is None else {'success': self.success, 'details': self.details}
