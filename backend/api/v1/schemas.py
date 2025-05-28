import re
from typing import Literal, Dict
from uuid import UUID
from pydantic import BaseModel, RootModel, Field, field_validator, conint, root_validator


class WordRequest(BaseModel):
    word: str = Field(min_length=4, max_length=6)

    @field_validator('word')
    @classmethod
    def validate_cyrillic(cls, value):
        if not re.fullmatch(r'^[а-яА-Я]{4,6}$', value):
            raise ValueError('String should have only cyrillic characters')
        return value


class CreateCustomRequest(WordRequest):
    dictionary: bool


class CheckRequest(WordRequest):
    uuid: UUID


class WordRevision(RootModel):
    root: Dict[conint(ge=0, le=5), Literal["true", "false", "none"]]

    @root_validator(pre=True)
    def check_length(cls, values):
        if not (4 <= len(values.get('__root__')) <= 6):
            raise ValueError("Expected 4 or 5 or 6 items")
        return values


class SuccessGameResponse(BaseModel):
    msg: str
    game_uuid: UUID


class GameParamsResponse(BaseModel):
    msg: str
    len: int
    dictionary: bool


class GameBase(BaseModel):
    uuid: UUID
    word: str
    dictionary: bool
    created_at: float
    is_daily: bool = False
    is_archived: bool = False


class GameCreate(GameBase):
    pass


class GameRead(GameBase):
    id: int


class GameDelete(BaseModel):
    id: int
    word: str


class DefaultHTTPError(BaseModel):
    detail: str