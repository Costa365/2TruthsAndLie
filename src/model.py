import pymongo
import body
import json
import os

class Model():

  def connect():
    pw = os.environ['MONGO_PW']
    client = pymongo.MongoClient("mongodb+srv://costa365:%s@cluster0.mcrcmoe.mongodb.net/?retryWrites=true&w=majority" % (pw))
    db = client.db1
    col = db["games"]
    return col

  def getGame(game_id):
    col = Model.connect()
    res = col.find({"Game": game_id},{'_id':0})
    return res[0]
  
  def getPlayer(game_id, player_id):
    col = Model.connect()
    res = col.find({"Game": game_id, 'Players.Name':player_id},{'_id':0})
    return res[0]
  
  def createGame(game):
    col = Model.connect()
    doc = {'Game': game.game, 'Type': game.type}
    res = col.insert_one(doc)
    return doc
