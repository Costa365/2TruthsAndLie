import requests
import websocket

ENDPOINT = 'http://127.0.0.1:8000'

def test_endpoint():
    response = requests.get(ENDPOINT)
    data = response.json()
    assert response.status_code == 200
    assert 'Team Games API' in data['message']
    

def test_create_game():
    url = ENDPOINT + '/game'
    body = {'type':'2 Truths And A Lie', 'name':'costa'}
    response = requests.post(url, json = body)
    data = response.json()
    assert response.status_code == 200
    assert 'id' in data and data.get('id') is not None


def test_join_games():
    url = ENDPOINT + '/game'
    body = {'type':'2 Truths And A Lie', 'name':'costa'}
    response = requests.post(url, json = body)
    data = response.json()
    assert response.status_code == 200
    assert 'id' in data and data.get('id') is not None
    gid = data['id']

    ws = websocket.WebSocket()
    ws.connect(f'ws://localhost:8000/ws/{gid}/Kugan')
    ws.close()