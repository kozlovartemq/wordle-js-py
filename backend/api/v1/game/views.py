
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Request, Response, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from api.v1.game.schemas import GameCreate, GameRead, GameDelete, WordRequest
from core.config import settings
from core.models.db_helper import db_helper
from core.models.game import get_all_games, create_game, get_game_by_word, get_game_by_uuid, delete_old_games



game_router = APIRouter(tags=["Game"], prefix='/games')


@game_router.post('/create_custom')
async def create_custom_game(
    data: WordRequest,
    session: AsyncSession = Depends(db_helper.session_dependency)
):
    new_word = data.word.upper()
    game = await get_game_by_word(session, new_word)
    if game is not None:
        return {"msg": "Игра уже существует", "game_uuid": game.uuid}
    
    game_uuid = uuid.uuid4()
    new_game = await create_game(
        session=session,
        game_create=GameCreate(uuid=game_uuid, word=new_word, created_at=datetime.now(timezone.utc).timestamp())
    )
    
    return {"msg": "Создана новая игра", "game_uuid": new_game.uuid}


@game_router.get("/create_casual")
async def create_casual_game(request: Request):
    game_id = uuid.uuid4()

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


@game_router.get('/{game_id}')
async def get_game(
    game_id: uuid.UUID,
    session: AsyncSession = Depends(db_helper.session_dependency)
):
    game = await get_game_by_uuid(session, game_id)
    if game is None:
        raise HTTPException(404, "Игра с таким идентификатором не найдена")
    return {"msg": "Игра существует", "len": len(game.word)}
    

@game_router.get('/')
def all_games():
    # todo html- img
    return Response(status_code=401, ) # content=


@game_router.delete('/delete_old',
                    summary=f"Delete games older than {settings.deleteJob.threshold_hours} hours",
                    response_model=list[GameDelete]
)
async def delete_old(
    session: AsyncSession = Depends(db_helper.session_dependency)
) -> list[GameDelete]:
    deleted_games = await delete_old_games(session, delta_hours=settings.deleteJob.threshold_hours)
    return deleted_games


class ResponseContent(BaseModel):
    success: bool = True
    details: dict | None

    def __str__(self):
        return {'success': self.success} if self.details is None else {'success': self.success, 'details': self.details}
