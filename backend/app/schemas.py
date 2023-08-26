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
    name: str
    item1: str
    item2: str
    item3: str

class Score(BaseModel):
    game: str
    name: str
    score: int
