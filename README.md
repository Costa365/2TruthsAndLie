# Team Games #

Generic Team Games API usng Python / Fast API / Mongo DB

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

