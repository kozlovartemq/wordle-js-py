import logging
from typing import Sequence
from uuid import UUID
from sqlalchemy import select, update, ForeignKey
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from api.v1.schemas import StatCreate, StatDelete, StatRead
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


async def get_all_stats(
    session: AsyncSession,
) -> Sequence[StatModel]:
    
    stmt = select(StatModel).order_by(StatModel.id)
    res = await session.scalars(stmt)
    return res.all()


async def get_stat_by_game_uuid(
    session: AsyncSession,
    game_uuid: UUID
) -> StatModel | None:
    # todo 
    stmt = select(StatModel).join(GameModel, StatModel.game_id == GameModel.id).where(GameModel.uuid == game_uuid)
    join_res = await session.scalars(stmt)
    join_res_first = join_res.first()
    if not join_res_first:
        return None
    stmt = select(StatModel).where(GameModel.id == join_res_first.id)
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
    stat: StatModel,
    tries: int
) -> StatModel:

    try_map = {
        0: 'lost',
        1: 'first_try',
        2: 'second_try',
        3: 'third_try',
        4: 'fourth_try',
        5: 'fifth_try',
        6: 'sixth_try'
    }
    attr = getattr(stat, try_map[tries])
    setattr(stat, try_map[tries], attr + 1)
    stat.games_overall += 1
    await session.commit()
    return stat


async def delete_stat(
    session: AsyncSession,
    game_uuids: list[UUID]
) -> StatDelete:
    # todo
    deleted_stats = []
    for game_uuid in game_uuids:
        stat = await get_stat_by_game_uuid(session, game_uuid)
        if stat:
            await session.delete(stat)
            deleted_stats.append(StatDelete(**stat))

    await session.commit()
    logging.info("[delete_stat] Stats deleted: %s", deleted_stats)
    return deleted_stats
