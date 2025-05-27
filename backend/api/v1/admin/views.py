import uuid
from fastapi import APIRouter, Depends, Header, HTTPException
from fastapi.responses import RedirectResponse
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND
from sqlalchemy.ext.asyncio import AsyncSession

from api.v1.schemas import GameRead, GameDelete, SuccessGameResponse
from core.config import settings
from core.models.db_helper import db_helper
from core.models.game import get_all_games, delete_old_games, create_daily_game
from core.models.word import get_random_word, get_word


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


### the implementation is taken out for use within the application
@admin_router.delete('/delete_old_games',
                    summary=f"Delete games older than {settings.deleteJob.threshold_hours} hours",
                    response_model=list[GameDelete]
)
async def delete_old(
    session: AsyncSession = Depends(db_helper.session_dependency)
) -> list[GameDelete]:
    
    deleted_games = await delete_old_games(session, delta_hours=settings.deleteJob.threshold_hours)
    return deleted_games


@admin_router.post("/replace_daily_game", response_model=SuccessGameResponse)
async def replace_daily_game(
    session: AsyncSession = Depends(db_helper.session_dependency)
):
    
    new_game = await create_daily_game(session, to_replace=True)
    return {"msg": "Поменяна ежедневная игра", "game_uuid": new_game.uuid}
###

# @admin_router.post("/create_daily_game", response_model=SuccessGameResponse)
# async def create_daily(
#     session: AsyncSession = Depends(db_helper.session_dependency)
# ):
    
#     new_game = await create_daily_game(session, to_replace=False)
#     return {"msg": "Поменяна ежедневная игра", "game_uuid": new_game.uuid}
# ###