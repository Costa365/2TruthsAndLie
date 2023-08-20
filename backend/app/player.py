from typing import NamedTuple
from fastapi import WebSocket

class Player(NamedTuple):
    name: str
    connected: bool
    webSocket: WebSocket
