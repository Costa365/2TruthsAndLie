from typing import Dict
from fastapi import WebSocket
import app.schemas as schemas
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
        self.players[player].play = ()
        await self.broadcast('{"connected":"' + player + '"}')

    async def broadcast(self, data: str):
        for playr in self.players.values():
            await playr.webSocket.send_text(data)

    async def handleMessage(self, player:str, data:str):
        jsons = json.loads(data)
        action = jsons['action']
        if action == "start":
            if self.state == 'WAITING_FOR_PLAYERS':
                self.state = 'STARTED'
                await self.broadcast('{"game":"started"}')
        if action == "play":
            if self.state == 'STARTED':
                truth1 = jsons['truth1']
                truth2 = jsons['truth2']
                lie = jsons['lie']
                self.players[player].play = (truth1,truth2,lie)
                await self.broadcast('{"played":"'+player+'"}')
        if action == "all_played":
            self.state = 'GUESS'
            self.playersList = list(self.players.keys())
            self.playerIndex = len(self.playersList)-1
            play = schemas.Play(
                name=self.playersList[self.playerIndex],
                item1=self.players[self.playersList[self.playerIndex]].play[0],
                item2=self.players[self.playersList[self.playerIndex]].play[1],
                item3=self.players[self.playersList[self.playerIndex]].play[2]
            )
            await self.broadcast(play.json())
        elif action == "lie":
            # store the player's guess somewhere
            pass
        elif action == "all_voted":
            # broadcast results
            pass
        elif action == "next_player":
            # Move to the next player
            pass

    async def disconnect(self, player:str):
        self.players[player].connected = False
        await self.broadcast('{"disconnected":"' + player + '"}')
