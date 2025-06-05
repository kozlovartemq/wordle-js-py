import logging
from typing import Sequence
from sqlalchemy import select, update, ForeignKey
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from api.v1.schemas import StatCreate
from core.models.base import Base
from core.models.game import GameModel
from utils.time_helper import timedelta_from_now_timestamp, todays_first_timestamp, utc_now_timestamp


class StatModel(Base):
    __tablename__ = "stats" # type: ignore
    
    id: Mapped[int] = mapped_column(primary_key=True)
    game_id: Mapped[int] = mapped_column(ForeignKey("games.id"), index=True)
    games_overall: Mapped[int]
    lost: Mapped[int]
    first_try: Mapped[int]
    second_try: Mapped[int]
    third_try: Mapped[int]
    fourth_try: Mapped[int]
    fifth_try: Mapped[int]
    sixth_try: Mapped[int]


async def get_stat_by_game_uuid(
    session: AsyncSession,
    game_uuid: int
) -> StatModel | None:
    # TODO
    stmt = select(StatModel).join(GameModel, StatModel.game_id == GameModel.id).where(GameModel.game_uuid == game_uuid)
    res = await session.scalars(stmt)
    return res.first()


async def create_stat(
    session: AsyncSession,
    stat_create: StatCreate
) -> StatModel:
    
    stat = StatModel(**stat_create.model_dump())
    session.add(stat)
    await session.commit()
    await session.refresh(stat)
    return stat


async def update_stat(
    session: AsyncSession,
    game_id: int,
    tries: int
) -> StatModel:

    try_map = {
        0: 'lost',
        1: 'first',
        2: 'second',
        3: 'third',
        4: 'fourth',
        5: 'fifth',
        6: 'sixth'
    }
    stat = await get_stat_by_game_id(session, game_id)
    assert stat
    attr = getattr(stat, try_map[tries])
    attr += 1
    setattr(stat, try_map[tries], attr)
    stat.games_overall += 1
    await session.commit()
    return stat
