from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse
import app.schemas as schemas
from app.games import Games

app = FastAPI()

@app.get("/")
async def read_game():
    return {"message": "Team Games API v0.1"}

@app.post("/game")
async def create_game(game:schemas.Game):
    id = games.createGame(game.name)
    return {"id": f"{id}"}

games = Games()

@app.websocket("/ws/{game_id}/{player_id}")
async def websocket_endpoint(websocket: WebSocket, game_id: str, player_id: str):
    await games.connect(websocket,game_id,player_id)
    while True:
        data = await websocket.receive_text()
        await games.handleMessage(game_id,player_id,data)
