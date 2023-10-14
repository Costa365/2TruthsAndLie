from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import app.schemas as schemas
from app.games import Games
import os

app = FastAPI()
games = Games()

backendUrl = os.getenv("FRONTEND")

origins = [
    backendUrl
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def get_version() -> schemas.Version:
    return {"version": "Team Games API v0.1"}


@app.get("/game/{gameId}")
async def get_game(gameId: str) -> schemas.GameInfo:
    status = games.getGameInfo(gameId=gameId)
    if status.exists is False:
        raise HTTPException(status_code=404, detail="Game not found")
    return status


@app.post("/game")
async def create_game(game: schemas.Game) -> schemas.Id:
    id = games.createGame(game.name, game.instructions)
    s = schemas.Id(id=id)
    return s


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
