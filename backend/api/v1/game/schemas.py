import re
from typing import Literal, Dict
from uuid import UUID
from pydantic import BaseModel, RootModel, Field, field_validator, conint, root_validator


class WordRequest(BaseModel):
    word: str = Field(min_length=5, max_length=6)

    @field_validator('word')
    @classmethod
    def validate_cyrillic(cls, value):
        if not re.fullmatch(r'^[а-яА-Я]{5,6}$', value):
            raise ValueError('String should have only cyrillic characters')
        return value


class CheckRequest(WordRequest):
    uuid: UUID


class WordRevision(RootModel):
    root: Dict[conint(ge=0, le=5), Literal["true", "false", "none"]]

    @root_validator(pre=True)
    def check_length(cls, values):
        if not (5 <= len(values.get('__root__')) <= 6):
            raise ValueError("Expected 5 or 6 items")
        return values


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