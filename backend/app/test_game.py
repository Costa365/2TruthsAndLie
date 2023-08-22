from fastapi import FastAPI
from fastapi.testclient import TestClient
from fastapi.websockets import WebSocket
from .main import app

client = TestClient(app)

ENDPOINT = 'http://127.0.0.1:8000'

def test_endpoint():
    response = client.get(ENDPOINT)
    data = response.json()
    assert response.status_code == 200
    assert 'Team Games API v0.1' in data['message']

def test_join_games():
    url = ENDPOINT + '/game'
    body = {'type':'2 Truths And A Lie', 'name':'costa'}
    response = client.post(url, json = body)
    data = response.json()
    assert response.status_code == 200
    assert 'id' in data and data.get('id') is not None
    gid = data['id']

    with client.websocket_connect(f'ws://localhost:8000/ws/{gid}/Kugan') as websocket:
        data = websocket.receive_json()
        assert data == {"connected":"Kugan"}
