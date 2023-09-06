from typing import Dict
from fastapi import WebSocket
from app.game import Game
import time


class Games:
    def __init__(self):
        self.games: Dict[str] = {}

    def createGame(self, facilitator: str):
        gid = '{0:010x}'.format(int(time.time() * 256))
        game = Game(facilitator)
        self.games[gid] = game
        return gid

    def getGameStatus(self, gameid: str):
        if gameid not in self.games.keys():
            return {"exists": False, "status": ""}
        else:
            return {"exists": True, "status": self.games[gameid].state}

    async def connect(
            self, websocket: WebSocket, game_id: str, player_id: str):
        if game_id not in self.games:
            raise ValueError("Game does not exist")
        await self.games[game_id].connect(websocket, player_id)

    async def handleMessage(self, game: str, player: str, data: str):
        await self.games[game].handleMessage(player, data)

    async def disconnect(self, game: str, player: str):
        await self.games[game].disconnect(player)
