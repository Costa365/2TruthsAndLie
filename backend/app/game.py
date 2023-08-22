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

    async def connect(self, websocket: WebSocket, player: str):
        await websocket.accept()
        self.players[player] = Player(player, websocket) 
        await self.broadcast('{"connected":"' + player + '"}')

    async def broadcast(self, data: str):
        for playr in self.players.values():
            await playr.webSocket.send_text(data)

    async def handleMessage(self, player:str, data:str):
        jsons = json.loads(data)
        action = jsons['action']
        if action == "start":
            self.state = 'STARTED'
            await self.broadcast('{"game":"started"}')
        if action == "play":
            truth1 = jsons['truth1']
            truth2 = jsons['truth2']
            lie = jsons['lie']
            self.players[player].plays.append((truth1,truth2,lie))
            await self.broadcast('{"played":"'+player+'"}')
        elif action == "lie":
            pass
        elif action == "all_played":
            pass
        elif action == "all_voted":
            pass
        elif action == "next_player":
            pass

    async def disconnect(self, player:str):
        self.players[player].connected = False
        await self.broadcast('{"disconnected":"' + player + '"}')
