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

    async def handleMessage(self, player: str, data: str):
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
                self.players[player].play = (truth1, truth2, lie)
                await self.broadcast('{"played":"'+player+'"}')
        if action == "all_played":
            self.state = 'GUESS'
            self.playersList = list(self.players.keys())
            self.playerIndex = len(self.playersList)-1
            # TODO move this the function and randomize
            play = schemas.Play(
                name=self.playersList[self.playerIndex],
                item1=self.players[self.playersList[self.playerIndex]].play[0],
                item2=self.players[self.playersList[self.playerIndex]].play[1],
                item3=self.players[self.playersList[self.playerIndex]].play[2]
            )
            await self.broadcast(play.json())
        elif action == "guess":
            self.players[player].guesses[self.playersList[self.playerIndex]] \
                = jsons['item']
            await self.broadcast('{"guessed":"'+player+'"}')
            pass
        elif action == "all_voted":
            if self.playerIndex > 0:
                self.playerIndex -= 1
                play = schemas.Play(
                    name=self.playersList[self.playerIndex],
                    item1=self.players[
                        self.playersList[self.playerIndex]].play[0],
                    item2=self.players[
                        self.playersList[self.playerIndex]].play[1],
                    item3=self.players[
                        self.playersList[self.playerIndex]].play[2]
                )
                await self.broadcast(play.json())
            else:
                self.state = 'RESULTS'
                plays = []
                for p in self.players.keys():
                    ttl = schemas.Ttl(
                        name=p,
                        truth1=self.players[p].play[0],
                        truth2=self.players[p].play[1],
                        lie=self.players[p].play[2]
                    )
                    plays.append(ttl)

                guesses = []
                for p in self.players.keys():
                    for g in self.players[p].guesses.keys():
                        guess = schemas.Guesses(
                            guesser=p,
                            player=g,
                            item=self.players[p].guesses[g]
                        )
                        guesses.append(guess)

                result = schemas.Results(
                    plays=plays,
                    guesses=guesses
                )

                await self.broadcast(result.json())

    async def disconnect(self, player: str):
        self.players[player].connected = False
        await self.broadcast('{"disconnected":"' + player + '"}')
