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
    StatDelete,
    DefaultHTTPError,
    UpdateRequest
)
from core.config import settings
from core.models.db_helper import db_helper
from core.models.game import (
    get_all_games,
    delete_old_games,
    create_daily_game,
    get_game_by_uuid
)
from core.models.stat import (
    get_all_stats,
    update_stat,
    delete_stat,
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

# todo game_router
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
    data: UpdateRequest,
    session: AsyncSession = Depends(db_helper.session_dependency)
):
    game = await get_game_by_uuid(session, data.game_uuid)
    if not game:
        raise HTTPException(HTTP_404_NOT_FOUND, "Игра с таким идентификатором не найдена")
    stat = await get_stat_by_game_uuid(session, game_uuid=game.uuid)
    if not stat:
        stat = await create_stat(session, StatCreate(game_id=game.id))
        # raise HTTPException(HTTP_404_NOT_FOUND, "Статистика для этой игры не найдена")

    new_stat = await update_stat(session=session, stat=stat, tries=data.try_)
    return new_stat


### the implementation is taken out for use within the application
@admin_router.delete('/delete_old_games',
                    summary=f"Delete games older than {settings.deleteJob.threshold_hours} hours",
                    response_model=list[GameDelete]
)
async def delete_old(
    session: AsyncSession = Depends(db_helper.session_dependency),
    threshold_hours: float = settings.deleteJob.threshold_hours
) -> list[GameDelete]:
    
    deleted_games: list[GameDelete] = await delete_old_games(session, delta_hours=threshold_hours)
    deleted_stats: list[StatDelete] = await delete_stat(session, [game.uuid for game in deleted_games])
    if len(deleted_games) != len(deleted_stats):
        logging.error(
            "[delete_old] Some stats did not delete.\n"
            "deleted_games: %s\n"
            "deleted_stats: %s",
            deleted_games, deleted_stats
        )
    return deleted_games


@admin_router.post("/replace_daily_game", response_model=SuccessGameResponse)
async def replace_daily_game(
    session: AsyncSession = Depends(db_helper.session_dependency)
):
    
    new_game = await create_daily_game(session, to_replace=True)
    assert new_game
    return {"msg": "Ежедневная игра успешна поменяна ", "game_uuid": new_game.uuid}
###

# @admin_router.post("/create_daily_game", response_model=SuccessGameResponse)
# async def create_daily(
#     session: AsyncSession = Depends(db_helper.session_dependency)
# ):
    
#     new_game = await create_daily_game(session, to_replace=False)
#     return {"msg": "Поменяна ежедневная игра", "game_uuid": new_game.uuid}
# ###