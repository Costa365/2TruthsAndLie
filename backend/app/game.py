from typing import List, Dict
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from collections import namedtuple

class Game:
    def __init__(self):
        self.connections: Dict[Dict[str]] = {}

    async def connect(self, websocket: WebSocket, game_id: str, player_id: str):
        await websocket.accept()
        if not game_id in self.connections:
          self.connections[game_id] = {}
        self.connections[game_id][player_id] = websocket

    async def broadcast(self, game: str, data: str):
        for connection in self.connections[game].values():
            await connection.send_text(data)