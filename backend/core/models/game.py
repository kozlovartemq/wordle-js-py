import logging
from typing import Sequence
from uuid import UUID, uuid4
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from api.v1.schemas import GameCreate, GameDelete
from core.exceptions import GameNotFound, DailyGameNotFound
from core.models.base import Base
from core.models.word import get_random_word
from utils.time_helper import timedelta_from_now_timestamp, todays_first_timestamp, utc_now_timestamp


class GameModel(Base):
    __tablename__ = "games" # type: ignore
    
    id: Mapped[int] = mapped_column(primary_key=True)
    uuid: Mapped[UUID] = mapped_column(index=True)
    word: Mapped[str]
    dictionary: Mapped[bool]
    created_at: Mapped[float]
    is_daily: Mapped[bool]
    is_archived: Mapped[bool]


async def get_all_games(
    session: AsyncSession,
) -> Sequence[GameModel]:
    
    stmt = select(GameModel).order_by(GameModel.id)
    res = await session.scalars(stmt)
    return res.all()


async def get_game_by_word_dictionary(
    session: AsyncSession,
    game_word: str,
    dictionary: bool
) -> GameModel | None:
    
    stmt = select(GameModel).where(GameModel.word == game_word.upper()).where(GameModel.dictionary.is_(dictionary))
    res = await session.scalars(stmt)
    return res.first()


async def get_game_by_uuid(
    session: AsyncSession,
    game_uuid: UUID
) -> GameModel:
    
    stmt = select(GameModel).where(GameModel.uuid == game_uuid)
    res = await session.scalars(stmt)
    game = res.first()
    if not game:
        raise GameNotFound()
    return game


async def get_game_by_is_daily(
    session: AsyncSession,
) -> GameModel:
    
    stmt = select(GameModel).where(GameModel.is_daily.is_(True))
    res = await session.scalars(stmt)
    all_results = res.all()
    if not all_results:
        raise DailyGameNotFound()

    assert len(all_results) == 1, "There must be only one daily game"
    return all_results[0] 



async def get_games_by_is_archived(
    session: AsyncSession,
    page: int = 1,
    limit: int = 20,
) -> Sequence[GameModel]:
    offset = limit * (page-1)
    stmt = select(GameModel).where(GameModel.is_archived.is_(True)).order_by(GameModel.id).offset(offset).limit(limit)
    res = await session.scalars(stmt)
    return res.all()


async def create_game(
    session: AsyncSession,
    game_create: GameCreate
) -> GameModel:
    
    game = GameModel(**game_create.model_dump())
    session.add(game)
    await session.commit()
    await session.refresh(game)
    return game


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
) -> list[GameModel]:
    
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


async def delete_game_by_id(
    session: AsyncSession,
    game_id: int
) -> GameDelete:
    
    res = await session.execute(select(GameModel).where(GameModel.id == game_id))
    game = res.scalars().first()
    if not game:
        raise GameNotFound()

    await session.delete(game)
    await session.commit()
    logging.info("[delete_game_by_id] Game deleted: %s", game)
    return GameDelete(id=game.id, word=game.word, uuid=game.uuid, dictionary=game.dictionary)
