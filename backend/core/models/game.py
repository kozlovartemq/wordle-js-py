import logging
from typing import Sequence
from uuid import UUID
from datetime import datetime, timezone, timedelta
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from api.v1.game.schemas import GameCreate, GameDelete
from core.models.base import Base


class GameModel(Base):
    __tablename__ = "games" # type: ignore
    
    uuid: Mapped[UUID] = mapped_column(index=True)
    word: Mapped[str]
    created_at: Mapped[float]


async def get_all_games(
        session: AsyncSession,
) -> Sequence[GameModel]:
    
    stmt = select(GameModel).order_by(GameModel.id)
    res = await session.scalars(stmt)
    return res.all()


async def get_game_by_word(
        session: AsyncSession,
        game_word: str
) -> GameModel | None:
    
    stmt = select(GameModel).where(GameModel.word == game_word)
    res = await session.scalars(stmt)
    return res.first()


async def get_game_by_uuid(
        session: AsyncSession,
        game_uuid: UUID
) -> GameModel | None:
    
    stmt = select(GameModel).where(GameModel.uuid == game_uuid)
    res = await session.scalars(stmt)
    return res.first()


async def create_game(
        session: AsyncSession,
        game_create: GameCreate
) -> GameModel:
    
    game = GameModel(**game_create.model_dump())
    session.add(game)
    await session.commit()
    await session.refresh(game)
    return game


async def delete_old_games(
        session: AsyncSession,
        delta_hours: float
) -> list[GameDelete]:
    
    threshold = (datetime.now(timezone.utc) - timedelta(hours=delta_hours)).timestamp()
    games = (await session.execute(
        select(GameModel).where(GameModel.created_at < threshold)
    )).scalars().all()

    deleted_games = [GameDelete(id=game.id, word=game.word) for game in games]
    for game in games:
        await session.delete(game)

    await session.commit()
    if deleted_games:
        logging.info("[delete_old_games] Games deleted: %s", deleted_games)
    return deleted_games
