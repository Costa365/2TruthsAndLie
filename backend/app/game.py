from typing import Dict
from fastapi import WebSocket
from typing import NamedTuple
from app.player import Player

import json

class Game:
    def __init__(self, facilitator):
        self.facilitator = facilitator
        self.players: Dict[Player] = {}
        self.state = 'WAITING_FOR_PLAYERS'

    async def connect(self, websocket: WebSocket, player_id: str):
        await websocket.accept()
        self.players[player_id] = Player(player_id, True, websocket) 

    async def broadcast(self, data: str):
        for playr in self.players.values():
            await playr.webSocket.send_text(data)

    async def handleMessage(self, player:str, data:str):
        jsons = json.loads(data)
        action = jsons['action']
        if action == "start":
            self.state = 'STARTED'
            await self.broadcast("{'game':'started'}")
        elif action == "lie":
            pass
        elif action == "all_played":
            pass
        elif action == "all_voted":
            pass
        elif action == "next_player":
            pass

    async def disconnect(self, player:str):
        self.players[player]._replace(connected=False)
        await self.broadcast("{'disconnected':'" + player + "'}")
