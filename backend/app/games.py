from typing import Dict
from fastapi import WebSocket
from app.game import Game
import time
import app.schemas as schemas


class Games:
    def __init__(self):
        self.games: Dict[str] = {}

    def createGame(self, facilitator: str):
        gid = '{0:010x}'.format(int(time.time() * 256))
        game = Game(facilitator)
        self.games[gid] = game
        return gid

    def getGameInfo(self, gameId: str) -> schemas.GameInfo:
        if gameId not in self.games.keys():
            return schemas.GameInfo(
                exists=False,
                state="",
                players=[],
                plays=[],
                guesses=[]
            )
        else:
            return self.games[gameId].getGameInfo()

    async def connect(
            self, websocket: WebSocket, gameId: str, playerId: str):
        if gameId not in self.games:
            raise ValueError("Game does not exist")
        if playerId in self.games[gameId].players.keys() and \
            self.games[gameId].players[playerId].connected:
            raise ValueError("Duplicate player name")
        await self.games[gameId].connect(websocket, playerId)
        self.games[gameId].players[playerId].connected = True

    async def handleMessage(self, game: str, player: str, data: str):
        await self.games[game].handleMessage(player, data)

    async def disconnect(self, game: str, player: str):
        await self.games[game].disconnect(player)
