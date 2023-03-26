import pymongo
import app.schemas as schemas
import json
import os

class Data():

  def connect():
    pw = os.environ['MONGO_PW']
    client = pymongo.MongoClient("mongodb+srv://costa365:%s@cluster0.mcrcmoe.mongodb.net/?retryWrites=true&w=majority" % (pw))
    db = client.db1
    col = db["games"]
    return col

  def getGame(game_id):
    col = Data.connect()
    res = col.find({"Game": game_id},{'_id':0})
    return res[0]
  
  def getPlayer(game_id, player_id):
    col = Data.connect()
    res = col.find({"Game": game_id, 'Players.Name':player_id},{'_id':0})
    return res[0]
  
  def createGame(game):
    col = Data.connect()
    doc = {'Game': game.game, 'Type': game.type, 'Players': []}
    res = col.insert_one(doc)
    return doc

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
