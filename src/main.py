from fastapi import FastAPI
from model import Model
import body

app = FastAPI()

@app.get("/")
async def read_game(game_id):
    return {"message": "Team Games API"}

@app.get("/game/{game_id}")
async def read_game(game_id):
    data = Model.getGame(game_id)
    return data

@app.post("/game")
async def create_game(game:body.Game):
    data = Model.createGame(game)
    return {"message": "Created Game"}

@app.get("/player/{game_id}/{player_id}")
async def read_player(game_id, player_id):
    data = Model.getPlayer(game_id, player_id)
    return data

@app.post("/player")
async def create_player(player:body.Player):
    Model.joinGame(player)
    return {"message": "Joined Game"}

@app.post("/play")
async def create_play(play:body.Play):
    Model.play(play)
    return {"message": "Created Play"}

