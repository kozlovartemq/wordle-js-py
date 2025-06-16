import re
from typing import Annotated, Literal, Dict
from uuid import UUID
from pydantic import BaseModel, RootModel, Field, field_validator, model_validator


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
    root: Dict[
        Annotated[int, Field(ge=0, le=5)],
        Literal["green", "yellow", "red"]
    ]

    @model_validator(mode='before')
    @classmethod
    def check_length(cls, values):
        if not (4 <= len(values) <= 6):
            raise ValueError("Expected 4 to 6 items")
        return values


class SuccessGameResponse(BaseModel):
    msg: str
    game_uuid: UUID


class GameParamsResponse(BaseModel):
    msg: str
    len: int
    dictionary: bool


class GameArchiveResponse(BaseModel):
    game_uuid: UUID
    game_date: str

    @field_validator('game_date')
    @classmethod
    def validate_cyrillic(cls, value):
        if not re.fullmatch(r'^(\d{2})\.(\d{2})\.(\d{4})$', value):
            raise ValueError('Date should match "%d.%m.%Y" format')
        return value


class GameBase(WordRequest):
    uuid: UUID
    dictionary: bool
    created_at: float
    is_daily: bool = False
    is_archived: bool = False


class GameCreate(GameBase):
    pass


class GameRead(GameBase):
    id: int


class GameDelete(WordRequest):
    id: int
    uuid: UUID
    dictionary: bool


class DefaultHTTPError(BaseModel):
    detail: str


class StatBase(BaseModel):
    game_id: int
    games_overall: int = 0
    lost: int = 0
    first_try: int = 0
    second_try: int = 0
    third_try: int = 0
    fourth_try: int = 0
    fifth_try: int = 0
    sixth_try: int = 0


class StatCreate(StatBase):
    pass


class StatUpdate(StatBase):
    id: int


class StatRead(StatBase):
    id: int


class StatDelete(StatBase):
    id: int


class TryRequest(BaseModel):
    try_: int = Field(ge=0, le=6)


class UpdateStatRequest(TryRequest):
    game_uuid: UUID