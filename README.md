# Team Games #

Generic Team Games API usng Python / Fast API / Mongo DB

Mongodb cluster should be created using [MongoDB Atlas](https://www.mongodb.com/)

```
pip install fastapi
pip install uvicorn
pip install pymongo
```

```
uvicorn main:app --reload
```
or 
```
python -m uvicorn main:app --reload
```

Test endpoints:

```
curl -X POST \
  'http://127.0.0.1:8000/game' \
  --header 'Content-Type: application/json' \
  --data-raw '{"game":"yHdVesGhsN34", "type":"This or That"}'

curl -X GET 'http://127.0.0.1:8000/game/Q46gCdsbc3Jh'
```

