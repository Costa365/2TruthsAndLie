from typing import List, Dict
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse

import json

class Game:
    def __init__(self, facilitator):
        self.facilitator = facilitator
        self.players: Dict[str] = {}
        self.state = 'WAITING_FOR_PLAYERS'

    async def connect(self, websocket: WebSocket, player_id: str):
        await websocket.accept()
        self.players[player_id] = websocket

    async def broadcast(self, data: str):
        for connection in self.players.values():
            await connection.send_text(data)

    async def handleMessage(self, player:str, data:str):
        jsons = json.loads(data)
        action = jsons['action']
        if action == "start":
            self.state = 'STARTED'
            await self.broadcast("{'action':'start123'}")
        elif action == "lie":
            pass
        elif action == "all_played":
            pass
        elif action == "all_voted":
            pass
        elif action == "next_player":
            pass
