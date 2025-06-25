import logging
from typing import Sequence
from uuid import uuid4
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from api.v1.schemas import GameCreate, StatCreate
from core.exceptions import DailyGameNotFound
from core.models.game import get_game_by_is_daily, GameModel, create_game
from core.models.stat import create_stat
from core.models.word import get_random_word
from utils.time_helper import timedelta_from_now_timestamp, todays_first_timestamp, utc_now_timestamp



async def create_daily_game(
    session: AsyncSession,
    to_replace: bool,
) -> GameModel | None:
    try:
        old_daily = await get_game_by_is_daily(session)
        if to_replace:
            await session.delete(old_daily)
        else:
            todays_timestamp = todays_first_timestamp()
            if old_daily.created_at > todays_timestamp:
                logging.info(
                    "[create_daily_game] Todays daily game is already set. Returning.. \n"
                    "todays_timestamp: %s\n"
                    "Daily game was created at: %s",
                    todays_timestamp,
                    old_daily.created_at
                )
                return

            old_daily.is_daily = False    
            old_daily.is_archived = True
            await session.commit()

    except DailyGameNotFound as ex:
        logging.info('[create_daily_game] DailyGameNotFound: %s', str(ex))

    game_uuid = uuid4()
    random_word = await get_random_word(session, length=5)
    new_word = random_word.word
    new_daily = await create_game(
        session=session,
        game_create=GameCreate(
            uuid=game_uuid,
            word=new_word.upper(),
            dictionary=True,
            created_at=utc_now_timestamp(),
            is_daily=True,
            is_archived=False
        )
    )
    new_stat = await create_stat(
        session=session,
        stat_create=StatCreate(game_id=new_daily.id)
    )
    logging.info("[create_daily_game] New daily game is set: %s", new_daily.word)
    return new_daily
        

async def delete_old_games(
    session: AsyncSession,
    delta_hours: float
) -> Sequence[GameModel]:
    
    threshold = timedelta_from_now_timestamp(hours=-delta_hours)
    games = (await session.execute(
        select(GameModel).
        where(GameModel.created_at < threshold).
        where(GameModel.is_daily.is_(False)).
        where(GameModel.is_archived.is_(False))
    )).scalars().all()

    for game in games:
        await session.delete(game)

    await session.commit() 
    logging.info("[delete_old_games] Games deleted: %s", games)
    return games
