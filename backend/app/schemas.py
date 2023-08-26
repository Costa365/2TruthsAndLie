from pydantic import BaseModel

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
    game: str
    name: str
    ref: str
    data: str

class Score(BaseModel):
    game: str
    name: str
    score: int