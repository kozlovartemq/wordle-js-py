import logging
from fastapi import APIRouter, Depends, Header, HTTPException
from starlette.status import HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND
from sqlalchemy.ext.asyncio import AsyncSession

from api.v1.schemas import (
    GameRead,
    GameDelete,
    SuccessGameResponse,
    StatRead,
    StatUpdate,
    DefaultHTTPError,
    UpdateStatRequest
)
from core.exceptions import GameNotFound, StatNotFound
from core.config import settings
from core.models.db_helper import db_helper
from core.models.game import (
    get_all_games,
    delete_game_by_id,
    delete_old_games,
    create_daily_game,
    get_game_by_uuid
)
from core.models.stat import (
    get_all_stats,
    update_stat,
    delete_stat_by_game_uuid,
    get_stat_by_game_uuid
)


async def verify_admin_header(X_Admin_Token: str = Header(...)):
    if X_Admin_Token != settings.admin_secret:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN,
            detail="Invalid admin token.",
        )


admin_router = APIRouter(
    tags=["Admin"], 
    prefix='/admin', 
    dependencies=[Depends(verify_admin_header)]
)


@admin_router.get("/get_games", response_model=list[GameRead])
async def get_games(
    session: AsyncSession = Depends(db_helper.session_dependency)
):
    games = await get_all_games(session=session)
    return games


@admin_router.get("/get_stats", response_model=list[StatRead])
async def get_stats(
    session: AsyncSession = Depends(db_helper.session_dependency)
):
    games = await get_all_stats(session=session)
    return games

# todo /games/game_uuid/get_stat
# todo game_router /games/game_uuid/update_stat
@admin_router.patch(
    "/update_stat",
    response_model=StatUpdate,
    responses={
        404: {
            "model": DefaultHTTPError,
            "description": "The game or the word not found"
        }
    }
)
async def update_stat_by_game_uuid(
    data: UpdateStatRequest,
    session: AsyncSession = Depends(db_helper.session_dependency)
) -> StatUpdate:

    try:
        game = await get_game_by_uuid(session, data.game_uuid)
    except GameNotFound as ex:
        raise HTTPException(HTTP_404_NOT_FOUND, str(ex))

    try:
        stat = await get_stat_by_game_uuid(session, game_uuid=game.uuid)
    except StatNotFound as ex:
        stat = await create_stat(session, StatCreate(game_id=game.id))
        # raise HTTPException(HTTP_404_NOT_FOUND, str(ex))

    new_stat = await update_stat(session=session, stat=stat, tries=data.try_)
    return new_stat


@admin_router.delete('/delete_game', response_model=GameDelete)
async def delete_game(
    game_id: int,
    session: AsyncSession = Depends(db_helper.session_dependency)
) -> GameDelete:

    try:
        game = await delete_game_by_id(session, game_id)
        stat = await delete_stat_by_game_uuid(session, game.uuid)
    except GameNotFound as ex:
        raise HTTPException(HTTP_404_NOT_FOUND, str(ex))
    except StatNotFound as ex:
        logging.warning('[delete_game] StatNotFound for game.id=%s, game.uuid=%s', game.id, game.uuid)    
    
    return GameDelete(id=game.id, word=game.word, uuid=game.uuid, dictionary=game.dictionary)


### the implementation is taken out for use within the application
@admin_router.delete(
    '/delete_old_games',
    summary=f"Delete games older than {settings.deleteJob.threshold_hours} hours",
    response_model=list[GameDelete]
)
async def delete_old(
    session: AsyncSession = Depends(db_helper.session_dependency),
    threshold_hours: float = settings.deleteJob.threshold_hours
) -> list[GameDelete]:
    
    games: list[GameModel] = await delete_old_games(session, delta_hours=threshold_hours)
    for game in games:
        try:
            await delete_stat_by_game_uuid(session, game.uuid)
        except StatNotFound as ex:
            logging.warning('[delete_old] StatNotFound for game.id=%s, game.uuid=%s', game.id, game.uuid)    

    return [GameDelete(id=game.id, word=game.word, uuid=game.uuid, dictionary=game.dictionary) for game in games]



@admin_router.post("/replace_daily_game", response_model=SuccessGameResponse)
async def replace_daily_game(
    session: AsyncSession = Depends(db_helper.session_dependency)
):
    
    new_game = await create_daily_game(session, to_replace=True)
    assert new_game
    return {"msg": "Ежедневная игра успешна поменяна", "game_uuid": new_game.uuid}
###

# @admin_router.post("/create_daily_game", response_model=SuccessGameResponse)
# async def create_daily(
#     session: AsyncSession = Depends(db_helper.session_dependency)
# ):
    
#     new_game = await create_daily_game(session, to_replace=False)
#     return {"msg": "Поменяна ежедневная игра", "game_uuid": new_game.uuid}
# ###