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
    assert 'Team Games API v0.1' in data['version']

def test_join_game():
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

def test_player_disconnect():
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

        with client.websocket_connect(f'ws://localhost:8000/ws/{gid}/Steve') as websocket2:
            data2 = websocket2.receive_json()
            assert data2 == {"connected":"Steve"}
        
        data = websocket.receive_json()
        assert data == {"connected":"Steve"}

        data = websocket.receive_json()
        assert data == {"disconnected":"Steve"}

def test_game_play():
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

        with client.websocket_connect(f'ws://localhost:8000/ws/{gid}/Steve') as websocket2:
            data2 = websocket2.receive_json()
            assert data2 == {"connected":"Steve"}
            data = websocket.receive_json()
            assert data == {"connected":"Steve"}

            websocket.send_json({"action":"start"})

            data2 = websocket2.receive_json()
            assert data2 == {"game":"started"}
            data = websocket.receive_json()
            assert data == {"game":"started"}

            websocket.send_json({"action":"play","truth1":"I'm a vegan","truth2":"I have been to India","lie":"I have run 5 marathons"})

            data2 = websocket2.receive_json()
            assert data2 == {"played":"Kugan"}
            data = websocket.receive_json()
            assert data == {"played":"Kugan"}

            websocket2.send_json({"action":"play","truth1":"I went to school in France","truth2":"I have 5 sisters","lie":"I have never eaten bread"})

            data2 = websocket2.receive_json()
            assert data2 == {"played":"Steve"}
            data = websocket.receive_json()
            assert data == {"played":"Steve"}

            websocket2.send_json({"action":"all_played"})
            data = websocket.receive_json()
            assert data["name"] == "Steve"
            assert "I went to school in France" in data.values()
            assert "I have 5 sisters" in data.values()
            assert "I have never eaten bread" in data.values()