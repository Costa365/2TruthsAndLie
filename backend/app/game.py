from typing import Dict
from fastapi import WebSocket
import app.schemas as schemas
from app.player import Player
import random

import json


class Game:
    def __init__(self, facilitator):
        self.facilitator = facilitator
        self.players: Dict[Player] = {}
        self.state = 'WAITING'
        self.playersList = []
        self.playerIndex = 0

    async def connect(self, websocket: WebSocket, player: str):
        await websocket.accept()
        self.players[player] = Player(player, websocket)
        self.players[player].play = ()
        await self.broadcast('{"event":"connected","player":"' + player + '"}')

    async def broadcast(self, data: str):
        for playr in self.players.values():
            if playr.connected:
                await playr.webSocket.send_text(data)

    def getRandomIndexes(self):
        n = random.randint(0, 2)
        return [n % 3, (n+1) % 3, (n+2) % 3]

    def getPlayersPlay(self, name) -> schemas.Play:
        indexes = self.getRandomIndexes()
        if(len(self.players[name].play) > 0):
            return schemas.Play(
                    name=name,
                    item1=self.players[name].play[indexes[0]],
                    item2=self.players[name].play[indexes[1]],
                    item3=self.players[name].play[indexes[2]]
                )
        else:
            return schemas.Play(
                    name=name,item1="",item2="",item3=""
                )

    def getGameInfo(self) -> schemas.GameInfo:
        players = []
        for p in self.players.keys():
            player = schemas.Player(
                name=p,
                online=self.players[p].connected,
                played=len(self.players[p].play) > 0
            )
            players.append(player)

        playBeingGuessed = schemas.Play(
                name="",
                item1="",
                item2="",
                item3=""
            )

        if (len(self.playersList) > 0):
            playBeingGuessed = self.getPlayersPlay(
                self.playersList[self.playerIndex])

        return schemas.GameInfo(
            exists=True,
            state=self.state,
            players=players,
            facilitator=self.facilitator,
            playBeingGuessed=playBeingGuessed
        )

    def getPlays(self):
        plays = []
        for p in self.players.keys():
            if (len(self.players[p].play) > 0):
                ttl = schemas.Ttl(
                    name=p,
                    truth1=self.players[p].play[0],
                    truth2=self.players[p].play[1],
                    lie=self.players[p].play[2]
                )
                plays.append(ttl)
        return plays

    def getGuesses(self):
        guesses = []
        for p in self.players.keys():
            for g in self.players[p].guesses.keys():
                guess = schemas.Guesses(
                    guesser=p,
                    player=g,
                    item=self.players[p].guesses[g]
                )
                guesses.append(guess)
        return guesses
    
    async def broadcastNextPlayerToGuess(self):
        while self.playerIndex > 0:
            self.playerIndex -= 1
            play = self.getPlayersPlay(self.playersList[self.playerIndex])
            if(len(play.item1+play.item2+play.item3)>0):
                await self.broadcast(play.json())       
                return  True
        return False

    async def handleMessage(self, player: str, data: str):
        jsons = json.loads(data)
        action = jsons['action']
        if action == "start":
            if self.state == 'WAITING':
                self.state = 'STARTED'
                await self.broadcast('{"event": "started"}')
        if action == "play":
            if self.state == 'STARTED':
                truth1 = jsons['truth1']
                truth2 = jsons['truth2']
                lie = jsons['lie']
                self.players[player].play = (truth1, truth2, lie)
                await self.broadcast('{"event": "played", "player": "' +
                                     player + '"}')
        if action == "all_played":
            self.state = 'GUESS'
            self.playersList = list(self.players.keys())
            self.playerIndex = len(self.playersList)-1
            await self.broadcastNextPlayerToGuess()
        elif action == "guess":
            self.players[player].guesses[self.playersList[self.playerIndex]] \
                = jsons['item']
            await self.broadcast('{"event": "guessed", "player":"'+player+'"}')
            pass
        elif action == "all_guessed":
            print("all_guessed")
            while True:
                print("all_guessed" + str(self.playerIndex))
                if self.playerIndex <= 0:
                    self.state = 'RESULTS'
                    plays = self.getPlays()
                    guesses = self.getGuesses()
                    result = schemas.Results(
                        plays=plays,
                        guesses=guesses
                    )
                    await self.broadcast(result.json())
                    return

                broadcasted = await self.broadcastNextPlayerToGuess()
                if(broadcasted):
                    return  

    async def disconnect(self, player: str):
        self.players[player].connected = False
        await self.broadcast('{"event":"disconnected","player":"' +
                             player + '"}')
