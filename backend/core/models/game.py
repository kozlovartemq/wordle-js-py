from typing import Sequence
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from api.v1.game.schemas import GameCreate
from core.models.base import Base


class GameModel(Base):
    __tablename__ = "games"
    
    uuid: Mapped[UUID] = mapped_column(index=True)
    word: Mapped[str]


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


async def create_game(
        session: AsyncSession,
        game_create: GameCreate
) -> GameModel:
    game = GameModel(**game_create.model_dump())
    session.add(game)
    await session.commit()
    await session.refresh(game)
    return game