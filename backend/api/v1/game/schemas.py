from uuid import UUID
from pydantic import BaseModel, Field

class WordRequest(BaseModel):
    word: str = Field(min_length=4, max_length=6)


class GameBase(BaseModel):
    uuid: UUID
    word: str


class GameCreate(GameBase):
    pass


class GameRead(GameBase):
    id: int