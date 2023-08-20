from fastapi import WebSocket

class Player():
    def __init__(self, name, webSocket):
        self.name = name
        self.connected = True
        self.webSocket = webSocket
        self.plays = []
        self.guesses = []
