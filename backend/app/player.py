class Player():
    def __init__(self, name, webSocket):
        self.name = name
        self.connected = True
        self.webSocket = webSocket
        self.play = {}
        self.guesses = {}
