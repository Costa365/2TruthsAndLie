from pydantic import BaseModel

class Game(BaseModel):
    game: str
    type: str

class Player(BaseModel):
    game: str
    name: str