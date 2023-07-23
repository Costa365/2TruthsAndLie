# Team Games #

Generic Team Games API usng Python / Fast API / Mongo DB.

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
  - SHould be able to set the status of the game (Not started, started, waiting for plays, completed)

Mongodb cluster should be created using [MongoDB Atlas](https://www.mongodb.com/)

```
pip install fastapi
pip install uvicorn
pip install pymongo
```

```
uvicorn app.main:app --reload
```
or 
```
python -m app.uvicorn main:app --reload
```

Test endpoints:

```
curl -X POST \
  'http://127.0.0.1:8000/game' \
  --header 'Content-Type: application/json' \
  --data-raw '{"game":"yHdVesGhsN34", "type":"This or That"}'

curl -X GET 'http://127.0.0.1:8000/game/Q46gCdsbc3Jh'

curl -X POST \
  'http://127.0.0.1:8000/player' \
  --header 'Content-Type: application/json' \
  --data-raw '{"game":"yHdVesGhsN34", "name":"Timothy"}'

curl -X POST \
  'http://127.0.0.1:8000/play' \
  --header 'Content-Type: application/json' \
  --data-raw '{"game":"yHdVesGhsN34", "name":"Kevin", "ref":"6", "data":"667"}'

curl -X POST \
  'http://127.0.0.1:8000/score' \
  --header 'Content-Type: application/json' \
  --data-raw '{"game":"yHdVesGhsN34", "name":"Kevin", "score":"5"}'
```

