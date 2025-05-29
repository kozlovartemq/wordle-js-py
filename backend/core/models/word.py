from sqlalchemy import select
from sqlalchemy.sql.expression import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column
from core.models.base import Base


class WordModel(Base):
    __tablename__ = "nouns" # type: ignore
    
    IID: Mapped[int] = mapped_column(primary_key=True)
    word: Mapped[str] = mapped_column(index=True)
    code: Mapped[int]
    code_parent: Mapped[int]
    gender: Mapped[str]
    wcase: Mapped[str]
    soul: Mapped[int]



async def get_random_word(
    session: AsyncSession,
    length: int
) -> WordModel:
    
    stmt = select(WordModel).where(func.char_length(WordModel.word) == length).order_by(func.random()).limit(1)
    res = await session.scalars(stmt)
    word = res.first()
    assert word
    return word


async def get_word(
    session: AsyncSession,
    word: str
) -> WordModel | None:
    
    stmt = select(WordModel).where(WordModel.word == word.lower())
    res = await session.scalars(stmt)
    return res.first()
