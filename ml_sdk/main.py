from games import games
from player_logic import player_logic
import datetime

print(datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'))
games = games(20, player_logic(), player_logic())
games_log = games.start_games()

# print(games_log)
print(datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'))
