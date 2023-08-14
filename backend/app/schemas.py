from pydantic import BaseModel

class Game(BaseModel):
    type: str

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