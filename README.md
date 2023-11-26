# 2 Truths And A Lie

2 Truths and a Lie makes team-building fun for remote teams. By sharing three statements, team 
members spark conversations, building understanding and camaraderie virtually. It encourages 
interaction, curiosity, and laughter, creating a more cohesive remote team environment. It's a simple 
yet effective way to connect people across distances and strengthen the bonds within a team.

## Backend

The backend is implemented in Python with FastAPI. Rest API endpoints are available to do the following:

- Get the version number of the API
- Create a game
- Get game info
- Admin - get games
  - This returns all games
  - It's protected using basic authentication

Websockets are used for the real time game play.

### Linter

Install flake8:

```
pip install flake8
```

Run flake8:

```
flake8
```

### Run tests

Install Pytest:

```
pip install pytest
```

```
pytest -v
```

## Frontend

The frontend is implemented using JavaScript and React.

## Run locally

Run the backend and frontend with docker compose:

```
docker compose up
```

Access frontend at [http://localhost:3000](http://localhost:3000)

Access backend at [http://localhost:8010/](http://localhost:8010)

## Libraries

Icons were taken from [flaticon.com](https://www.flaticon.com/search?word=question&type=uicon)


Loading spinner was taken from [loading.io](https://loading.io)
