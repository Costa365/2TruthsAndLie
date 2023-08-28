from pydantic import BaseModel
from typing import List


class Version(BaseModel):
    version: str


class Id(BaseModel):
    id: str


class Game(BaseModel):
    type: str
    name: str


class Player(BaseModel):
    game: str
    name: str


class Play(BaseModel):
    name: str
    item1: str
    item2: str
    item3: str


class Ttl(BaseModel):
    name: str
    truth1: str
    truth2: str
    lie: str


class Score(BaseModel):
    game: str
    name: str
    score: int


class Guesses(BaseModel):
    guesser: str
    player: str
    item: int


class Results(BaseModel):
    plays: List[Ttl]
    guesses: List[Guesses]
