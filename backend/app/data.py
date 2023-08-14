from fastapi import HTTPException
import pymongo
import app.schemas as schemas
import json
import os
import time

class Data():

  def connect():
    conn = os.environ["MONGO_CONNECT"]
    client = pymongo.MongoClient(conn)
    db = client.db1
    col = db["games"]
    return col

  def getGame(game_id):
    col = Data.connect()
    res = col.find({"Game": game_id},{'_id':0})
    if len(list(res.clone()))>0:
      return res[0]
    raise HTTPException(status_code=404, detail=f"Game {game_id} not found")
  
  def getPlayer(game_id, player_id):
    col = Data.connect()
    res = col.find({"Game": game_id, 'Players.Name':player_id},{'_id':0})
    if len(list(res.clone()))>0:
      return res[0]
    raise HTTPException(status_code=404, detail=f"Game {game_id}, Player {player_id} not found")
  
  def createGame(game):
    col = Data.connect()
    gid = '{0:010x}'.format(int(time.time() * 256))
    doc = {'Game': gid, 'Type': game.type, 'Facilitator':game.name, 'Players': []}
    res = col.insert_one(doc)
    return gid

  def joinGame(player):
    col = Data.connect()
    filter = { 'Game': player.game }
    newvalues = { '$push': { 'Players': {'Name': player.name, 'Score': 0, 'Plays': []}}}
    col.update_one(filter, newvalues)
    return True
  
  def play(play):
    col = Data.connect()
    filter = { 'Game': play.game, 'Players.Name': play.name}
    newvalues = { '$push': { "Players.$[elem].Plays": { "Ref": play.ref, "Data": play.data } } }
    col.update_one(filter, newvalues, upsert=True,array_filters=[{ "elem.Name": play.name }])
    return True
  
  def updateScore(score):
    col = Data.connect()
    filter = { 'Game': score.game, 'Players.Name': score.name}
    newvalues = { '$set': { "Players.$[elem].Score": score.score } }
    col.update_one(filter, newvalues, upsert=True, array_filters=[{ "elem.Name": score.name }])
    return True
