from typing import List, Dict
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from collections import namedtuple
from app.data import Data
import json

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

    async def handleMessage(self, game: str, player:str, data: str):
        jsons = json.loads(data)
        action = jsons['action']
        if action == "start":
            Data.startGame(game,player)
            await self.broadcast(game, "{'action':'start'}")
        elif action == "lie":
            pass
        elif action == "all_played":
            pass
        elif action == "all_voted":
            pass
        elif action == "next_player":
            pass
