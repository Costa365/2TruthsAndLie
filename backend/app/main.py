from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import app.schemas as schemas
from app.games import Games

app = FastAPI()
games = Games()

@app.get("/")
async def get_version() -> schemas.Version:
    return {"version": "Team Games API v0.1"}


@app.post("/game")
async def create_game(game: schemas.Game) -> schemas.Id:
    id = games.createGame(game.name)
    s = schemas.Id(id=id)
    return s.dict()


@app.websocket("/ws/{game_id}/{player_id}")
async def websocket_endpoint(
        websocket: WebSocket, game_id: str, player_id: str):
    await games.connect(websocket, game_id, player_id)
    try:
        while True:
            data = await websocket.receive_text()
            await games.handleMessage(game_id, player_id, data)
    except WebSocketDisconnect:
        await games.disconnect(game_id, player_id)
