from fastapi import FastAPI
from app.data import Data
import app.schemas as schemas

app = FastAPI()

@app.get("/")
async def read_game(game_id):
    return {"message": "Team Games API"}

@app.get("/game/{game_id}")
async def read_game(game_id):
    data = Data.getGame(game_id)
    return data

@app.post("/game")
async def create_game(game:schemas.Game):
    data = Data.createGame(game)
    return {"message": "Created Game"}

@app.get("/player/{game_id}/{player_id}")
async def read_player(game_id, player_id):
    data = Data.getPlayer(game_id, player_id)
    return data

@app.post("/player")
async def create_player(player:schemas.Player):
    Data.joinGame(player)
    return {"message": "Joined Game"}

@app.post("/play")
async def create_play(play:schemas.Play):
    Data.play(play)
    return {"message": "Created Play"}

