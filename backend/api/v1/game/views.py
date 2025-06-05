import uuid
from fastapi import APIRouter, Depends, HTTPException
from starlette.status import (
    HTTP_401_UNAUTHORIZED,
    HTTP_404_NOT_FOUND,
    HTTP_422_UNPROCESSABLE_ENTITY
)
from sqlalchemy.ext.asyncio import AsyncSession

from api.v1.schemas import (
    GameCreate,
    WordRevision,
    CheckRequest,
    CreateCustomRequest,
    SuccessGameResponse,
    GameParamsResponse,
    GameArchiveResponse,
    DefaultHTTPError,
    StatCreate
)
from core.models.db_helper import db_helper
from core.models.game import (
    create_game,
    get_game_by_word_dictionary,
    get_game_by_uuid,
    get_game_by_is_daily,
    get_games_by_is_archived
)
from core.models.word import get_random_word, get_word
from core.models.stat import create_stat
from utils.time_helper import utc_now_timestamp, timestamp_to_date_str
from utils.game_handler import GameHandler

game_router = APIRouter(tags=["Game"], prefix='/games')


@game_router.post(
    '/check_word',
    response_model=WordRevision,
    responses={
        404: {
            "model": DefaultHTTPError,
            "description": "The word not found"
        }
    }
)
async def check_word(
    data: CheckRequest,
    session: AsyncSession = Depends(db_helper.session_dependency)
):

    game = await get_game_by_uuid(session, data.uuid)
    assert game
    if len(data.word) != len(game.word):
        raise HTTPException(HTTP_422_UNPROCESSABLE_ENTITY, "Введнное слово и эталонное слово имеют разную длину.")
      
    def check():
        return GameHandler(game.word).check_word(data.word)
  
    if game.dictionary:
        word_in_dictionary = await get_word(session=session, word=data.word)
        if word_in_dictionary is not None:
            return check()
        else:
            raise HTTPException(HTTP_404_NOT_FOUND, "Такого слова нет в словаре.")
    else:
        return check()


async def create_game_if_not_exists(
    session: AsyncSession,
    word: str,
    dictionary: bool
):
    game = await get_game_by_word_dictionary(session, word, dictionary)
    if game is not None:
        return {"msg": "Игра уже существует", "game_uuid": game.uuid}
    
    game_uuid = uuid.uuid4()
    new_game = await create_game(
        session=session,
        game_create=GameCreate(
            uuid=game_uuid,
            word=word.upper(),
            dictionary=dictionary,
            created_at=utc_now_timestamp(),
            is_daily=False,
            is_archived=False
        )
    )
    new_stat = await create_stat(
        session=session,
        stat_create=StatCreate(game_id=new_game.id)
    )
    return {"msg": "Игра успешно создана", "game_uuid": new_game.uuid}


@game_router.post(
    '/create_custom',
    response_model=SuccessGameResponse,
    responses={
        404: {
            "model": DefaultHTTPError,
            "description": "The word not found"
        }
    }
)
async def create_custom_game(
    data: CreateCustomRequest,
    session: AsyncSession = Depends(db_helper.session_dependency)
):
    if data.dictionary:
        dictionary_word = await get_word(session, data.word)
        if dictionary_word is None:
            raise HTTPException(HTTP_404_NOT_FOUND, "Такого слова нет в словаре.")

    new_word = data.word
    return await create_game_if_not_exists(session, new_word, dictionary=data.dictionary)


@game_router.post("/create_casual", response_model=SuccessGameResponse)
async def create_casual_game(
    session: AsyncSession = Depends(db_helper.session_dependency)
):
    random_word_response = await get_random_word(session=session, length=5)

    new_word = random_word_response.word
    return await create_game_if_not_exists(session, new_word, dictionary=True)


@game_router.get(
    '/daily',
    response_model=SuccessGameResponse,
    responses={
        404: {
            "model": DefaultHTTPError,
            "description": "The game not found"
        }
    }    
)
async def get_daily_game(
    session: AsyncSession = Depends(db_helper.session_dependency)
):
    daily = await get_game_by_is_daily(session)
    if daily is None:
        raise HTTPException(HTTP_404_NOT_FOUND, "Ежедневная игра не найдена")

    return {"msg": "Ежедневная игра существует", "game_uuid": daily.uuid}


@game_router.get("/get_archive", response_model=list[GameArchiveResponse])
async def get_archive_games(
    page: int = 1,
    limit: int = 20,
    session: AsyncSession = Depends(db_helper.session_dependency)
):
    archive_games = await get_games_by_is_archived(session=session, page=page, limit=limit)
    return [GameArchiveResponse(game_uuid=game.uuid, game_date=timestamp_to_date_str(game.created_at)) for game in archive_games]


@game_router.get(
    '/{game_id}',
    response_model=GameParamsResponse,
    responses={
        404: {
            "model": DefaultHTTPError,
            "description": "The game not found"
        }
    }  
)
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
    raise HTTPException(HTTP_401_UNAUTHORIZED)


