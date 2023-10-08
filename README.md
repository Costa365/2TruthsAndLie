# Team Games #

Generic Team Games API usng Python / Fast API.

Options: We could make this a totally generic API which can be used by frontend (play game) or by admin (update scores)
Should this API implement the games or just expose the API and another games service should utilise it?

- This or That (as an example)
  - Start a new game
  - The game facilitator should be able to:
    - Select questions
    - Order questions
    - Add/edit/remove questions
    - Select default questions in random order
    - Start the game (by sharing url)
    - Move game on to the next round
    - End the game

- Game itself should have a web sockets interface, so that everyone can play in realtime
  - Player voted
  - FastAPI supports websockets


- To Do
  - Should be able to mark a player as Facilitator 
  - Should be able to set the status of the game (Not started, started, waiting for plays, completed)

```
pip install fastapi
pip install uvicorn
pip install pymongo
```

```
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
or 
```
python -m app.uvicorn main:app --reload
```

## Linter

```
flake8 ./
```

## Run tests

```
pytest -v
```

## Test endpoints:

```
curl -X POST \
  'http://localhost:8000/game' \
  --header 'Content-Type: application/json' \
  --data-raw '{"type":"This or That", "name":"Costa"}'

curl -X GET 'http://127.0.0.1:8
```

## Websockets

connect ws://localhost:8000/ws/64dbc61059/Tim
send {"action":"start"}

