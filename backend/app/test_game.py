from fastapi.testclient import TestClient
from .main import app
import pytest

client = TestClient(app)

ENDPOINT = 'http://127.0.0.1:8000'


def test_endpoint():
    response = client.get(ENDPOINT)
    data = response.json()
    assert response.status_code == 200
    assert 'Team Games API v0.1' in data['version']


def test_game_exists():
    url = ENDPOINT + '/game'
    body = {'type': '2 Truths And A Lie', 'name': 'costa'}
    response = client.post(url, json=body)
    data = response.json()
    assert response.status_code == 200
    assert 'id' in data and data.get('id') is not None
    gid = data['id']

    url = url+'/'+gid
    response = client.get(url)
    data = response.json()
    assert response.status_code == 200
    assert data.get('exists') is True

    url = url+'1'
    response = client.get(url)
    data = response.json()
    assert response.status_code == 404


def test_join_game():
    url = ENDPOINT + '/game'
    body = {'type': '2 Truths And A Lie', 'name': 'costa'}
    response = client.post(url, json=body)
    data = response.json()
    assert response.status_code == 200
    assert 'id' in data and data.get('id') is not None
    gid = data['id']

    with client.websocket_connect(
            f'ws://localhost:8000/ws/{gid}/Kugan') as websocket:
        data = websocket.receive_json()
        assert data == {"event": "connected", "player": "Kugan"}


def test_join_game_that_does_not_exist():
    with pytest.raises(ValueError) as excinfo:
        with client.websocket_connect(
                'ws://localhost:8000/ws/11/Kugan') as websocket:
            data = websocket.receive_json()
            assert data == {"event": "connected", "player": "Kugan"}
    assert str(excinfo.value) == "Game does not exist"


def test_duplicate_player_name():
    url = ENDPOINT + '/game'
    body = {'type': '2 Truths And A Lie', 'name': 'costa'}
    response = client.post(url, json=body)
    data = response.json()
    assert response.status_code == 200
    assert 'id' in data and data.get('id') is not None
    gid = data['id']

    with pytest.raises(ValueError) as excinfo:
        with client.websocket_connect(
                f'ws://localhost:8000/ws/{gid}/Kugan') as websocket:
            data = websocket.receive_json()
            assert data == {"event": "connected", "player": "Kugan"}

            with client.websocket_connect(
                    f'ws://localhost:8000/ws/{gid}/Kugan') as websocket2:
                data2 = websocket2.receive_json()
                assert data2 == {"event": "connected", "player": "Kugan"}
    assert str(excinfo.value) == "Duplicate player name"


def test_player_disconnect():
    url = ENDPOINT + '/game'
    body = {'type': '2 Truths And A Lie', 'name': 'Costa'}
    response = client.post(url, json=body)
    data = response.json()
    assert response.status_code == 200
    assert 'id' in data and data.get('id') is not None
    gid = data['id']

    with client.websocket_connect(
            f'ws://localhost:8000/ws/{gid}/Kugan') as websocket:
        data = websocket.receive_json()
        assert data == {"event": "connected", "player": "Kugan"}

        with client.websocket_connect(
                f'ws://localhost:8000/ws/{gid}/Steve') as websocket2:
            data2 = websocket2.receive_json()
            assert data2 == {"event": "connected", "player": "Steve"}

        data = websocket.receive_json()
        assert data == {"event": "connected", "player": "Steve"}

        data = websocket.receive_json()
        assert data == {"event": "disconnected", "player": "Steve"}

        url = ENDPOINT + f'/game/{gid}'
        response = client.get(url)
        data = response.json()
        assert response.status_code == 200
        assert data['exists'] is True
        assert data['state'] == 'WAITING_FOR_PLAYERS'
        assert {'name': 'Kugan', 'online': True, "played": False} \
            in data['players']
        assert {'name': 'Steve', 'online': False, "played": False} \
            in data['players']
        assert data['facilitator'] == "Costa"


def test_game_play():
    url = ENDPOINT + '/game'
    body = {'type': '2 Truths And A Lie', 'name': 'costa'}
    response = client.post(url, json=body)
    data = response.json()
    assert response.status_code == 200
    assert 'id' in data and data.get('id') is not None
    gid = data['id']

    with client.websocket_connect(
            f'ws://localhost:8000/ws/{gid}/Kugan') as websocket:
        data = websocket.receive_json()
        assert data == {"event": "connected", "player": "Kugan"}

        with client.websocket_connect(
                f'ws://localhost:8000/ws/{gid}/Steve') as websocket2:
            data2 = websocket2.receive_json()
            assert data2 == {"event": "connected", "player": "Steve"}
            data = websocket.receive_json()
            assert data == {"event": "connected", "player": "Steve"}

            url = ENDPOINT + f'/game/{gid}'
            response = client.get(url)
            data = response.json()
            assert response.status_code == 200
            assert data['exists'] is True
            assert data['state'] == 'WAITING_FOR_PLAYERS'
            assert {'name': 'Kugan', 'online': True, "played": False} \
                in data['players']
            assert {'name': 'Steve', 'online': True, "played": False} \
                in data['players']

            websocket.send_json({"action": "start"})

            data2 = websocket2.receive_json()
            assert data2 == {"event": "started"}
            data = websocket.receive_json()
            assert data == {"event": "started"}

            websocket.send_json({"action": "play",
                                 "truth1": "I'm a vegan",
                                 "truth2": "I have been to India",
                                 "lie": "I have run 5 marathons"})

            data2 = websocket2.receive_json()
            assert data2 == {"event": "played", "player": "Kugan"}
            data = websocket.receive_json()
            assert data == {"event": "played", "player": "Kugan"}

            websocket2.send_json({"action": "play",
                                  "truth1": "I went to school in France",
                                  "truth2": "I have 5 sisters",
                                  "lie": "I have never eaten bread"})

            data2 = websocket2.receive_json()
            assert data2 == {"event": "played", "player": "Steve"}
            data = websocket.receive_json()
            assert data == {"event": "played", "player": "Steve"}

            url = ENDPOINT + f'/game/{gid}'
            response = client.get(url)
            data = response.json()
            assert response.status_code == 200
            assert {'name': 'Kugan', 'online': True, "played": True} \
                in data['players']
            assert {'name': 'Steve', 'online': True, "played": True} \
                in data['players']

            websocket.send_json({"action": "all_played"})
            data = websocket.receive_json()
            assert data["event"] == "guess"
            assert data["name"] == "Steve"
            assert "I went to school in France" in data.values()
            assert "I have 5 sisters" in data.values()
            assert "I have never eaten bread" in data.values()
            data2 = websocket2.receive_json()
            assert data["event"] == "guess"
            assert data2["name"] == "Steve"
            assert "I went to school in France" in data2.values()
            assert "I have 5 sisters" in data2.values()
            assert "I have never eaten bread" in data2.values()

            websocket.send_json({"action": "guess", "item": 1})
            data = websocket.receive_json()
            assert data == {"event": "guessed", "player": "Kugan"}
            data2 = websocket2.receive_json()
            assert data2 == {"event": "guessed", "player": "Kugan"}

            websocket.send_json({"action": "all_voted"})

            data = websocket.receive_json()
            assert data["name"] == "Kugan"
            assert "I'm a vegan" in data.values()
            assert "I have been to India" in data.values()
            assert "I have run 5 marathons" in data.values()
            data2 = websocket2.receive_json()
            assert data["name"] == "Kugan"
            assert "I'm a vegan" in data.values()
            assert "I have been to India" in data.values()
            assert "I have run 5 marathons" in data.values()

            websocket2.send_json({"action": "guess", "item": 2})
            data = websocket.receive_json()
            assert data == {"event": "guessed", "player": "Steve"}
            data2 = websocket2.receive_json()
            assert data2 == {"event": "guessed", "player": "Steve"}

            websocket.send_json({"action": "all_voted"})
            data = websocket.receive_json()
            expectedData = {'event': 'results',
                            'plays': [{'name': 'Kugan',
                                       'truth1': "I'm a vegan",
                                       'truth2': 'I have been to India',
                                       'lie': 'I have run 5 marathons'}, {
                                       'name': 'Steve',
                                       'truth1': 'I went to school in France',
                                       'truth2': 'I have 5 sisters',
                                       'lie': 'I have never eaten bread'}],
                            'guesses': [{'guesser': 'Kugan',
                                         'player': 'Steve',
                                         'item': 1},
                                        {'guesser': 'Steve',
                                         'player': 'Kugan',
                                         'item': 2}]}
            assert data == expectedData
            data2 = websocket2.receive_json()
            assert data2 == expectedData
