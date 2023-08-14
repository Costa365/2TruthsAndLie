from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse
from app.data import Data
import app.schemas as schemas
from app.game import Game

app = FastAPI()

@app.get("/")
async def read_game():
    return {"message": "Team Games API v0.1"}

@app.get("/game/{game_id}")
async def read_game(game_id):
    data = Data.getGame(game_id)
    return data

@app.post("/game")
async def create_game(game:schemas.Game):
    id = Data.createGame(game)
    return {"id": f"{id}"}

@app.get("/player/{game_id}/{player_id}")
async def read_player(game_id, player_id):
    data = Data.getPlayer(game_id, player_id)
    return data

@app.post("/player")
async def create_player(player:schemas.Player):
    Data.joinGame(player)
    return {"message": "Joined Game"}
"""
@app.post("/play")
async def create_play(play:schemas.Play):
    Data.play(play)
    return {"message": "Created Play"}

@app.post("/score")
async def update_score(score:schemas.Score):
    Data.updateScore(score)
    return {"message": "Updated Score"}
"""
game = Game()

@app.websocket("/ws/{game_id}/{player_id}")
async def websocket_endpoint(websocket: WebSocket, game_id: str, player_id: str):
    await game.connect(websocket,game_id,player_id)
    while True:
        data = await websocket.receive_text()
        await game.broadcast(game_id, f"game_id {game_id}, player_id {player_id}: {data}")