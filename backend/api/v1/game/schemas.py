import re
from uuid import UUID
from pydantic import BaseModel, Field, field_validator

class WordRequest(BaseModel):
    word: str = Field(min_length=5, max_length=6)

    @field_validator('word')
    @classmethod
    def validate_cyrillic(cls, value):
        if not re.fullmatch(r'[а-яА-ЯёЁ]+', value):
            raise ValueError('String should have only cyrillic characters')
        return value


class GameBase(BaseModel):
    uuid: UUID
    word: str
    created_at: float


class GameCreate(GameBase):
    pass


class GameRead(GameBase):
    id: int


class GameDelete(BaseModel):
    id: int
    word: str