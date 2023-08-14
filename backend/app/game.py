from typing import List, Dict
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from collections import namedtuple

class Game:
    def __init__(self):
        self.connections: Dict[str] = {}

    async def connect(self, websocket: WebSocket, game_id: str, player_id: str):
        await websocket.accept()
        self.connections[f"{game_id}_{player_id}"] = websocket

    async def broadcast(self, data: str):
        for connection in self.connections.values():
            await connection.send_text(data)