import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Request, Response, HTTPException
from fastapi.responses import RedirectResponse
from starlette.status import HTTP_404_NOT_FOUND, HTTP_422_UNPROCESSABLE_ENTITY
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from api.v1.game.schemas import GameCreate, GameRead, GameDelete, WordRevision, CheckRequest, CreateCustomRequest, SuccessGameResponse
from core.config import settings
from core.models.db_helper import db_helper
from core.models.game import get_all_games, create_game, get_game_by_word, get_game_by_uuid, delete_old_games
from core.models.word import get_random_word, get_word


game_router = APIRouter(tags=["Game"], prefix='/games')


@game_router.post('/check_word', response_model=WordRevision)
async def check_word(
    data: CheckRequest,
    session: AsyncSession = Depends(db_helper.session_dependency)
):

    async def check():
        from game_handler import GameHandler

        game = await get_game_by_uuid(session, data.uuid)
        if len(data.word) != len(game.word):
            raise HTTPException(HTTP_422_UNPROCESSABLE_ENTITY, "Введнное слово и эталонное слово имеют разную длину.")
        return GameHandler(game.word).check_word(data.word)

    if data.dictionary:
        is_in_dictionary = await get_word(session=session, word=data.word)
        if is_in_dictionary is not None:
            return await check()
        else:
            raise HTTPException(HTTP_404_NOT_FOUND, "Такого слова нет в словаре.")
    else:
        return await check()

    


@game_router.post('/create_custom', response_model=SuccessGameResponse)
async def create_custom_game(
    data: CreateCustomRequest,
    session: AsyncSession = Depends(db_helper.session_dependency)
):
    if data.dictionary:
        dictionary_word = await get_word(session, data.word)
        if dictionary_word is None:
            raise HTTPException(HTTP_404_NOT_FOUND, "Такого слова нет в словаре.")

    new_word = data.word
    game = await get_game_by_word(session, new_word, data.dictionary)
    if game is not None:
        return {"msg": "Игра уже существует", "game_uuid": game.uuid}
    
    game_uuid = uuid.uuid4()
    new_game = await create_game(
        session=session,
        game_create=GameCreate(
            uuid=game_uuid,
            word=new_word.upper(),
            dictionary=data.dictionary,
            created_at=datetime.now(timezone.utc).timestamp()
        )
    )
    
    return {"msg": "Создана новая игра", "game_uuid": new_game.uuid}


@game_router.post("/create_casual", response_model=SuccessGameResponse)
async def create_casual_game(
    session: AsyncSession = Depends(db_helper.session_dependency)
):
    random_word_response = await get_random_word(session=session, length=5)
    
    game_uuid = uuid.uuid4()
    new_game = await create_game(
        session=session,
        game_create=GameCreate(
            uuid=game_uuid,
            word=random_word_response.word.upper(),
            dictionary=True,
            created_at=datetime.now(timezone.utc).timestamp()
        )
    )
    
    return {"msg": "Создана новая игра", "game_uuid": new_game.uuid}


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
        raise HTTPException(HTTP_404_NOT_FOUND, "Игра с таким идентификатором не найдена")
    return {"msg": "Игра существует", "len": len(game.word), "dictionary": game.dictionary}
    

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
