from typing import List, Dict
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from collections import namedtuple
from app.game import Game
import json
import time

class Games:
    def __init__(self):
        self.games: Dict[str] = {}

    def createGame(self, facilitator: str):
        gid = '{0:010x}'.format(int(time.time() * 256))
        game = Game(facilitator)
        self.games[gid] = game
        return gid

    async def connect(self, websocket: WebSocket, game_id: str, player_id: str):
        if not game_id in self.games:
          pass # throw error
        await self.games[game_id].connect(websocket, player_id)

    async def handleMessage(self, game: str, player:str, data: str):
        await self.games[game].handleMessage(player, data)
