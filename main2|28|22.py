import requests

headers = {"X-TBA-Auth-Key" : "tSAklqAAKXw6IMmTQuN5oIhnSrJ6Pqh3bOgVnVA4LUmmByHPinyb66r1bz7wnSfk"}

# team information
teamINPUT = input("Please input your team (frc#number): ")
year = input("Please input the year you want data for (eg. 2022): ")

response = requests.get(f'https://www.thebluealliance.com/api/v3/team/{teamINPUT}', headers = headers)
TeamInfo = response.json()
TeamKey = TeamInfo['key']
TeamName = TeamInfo['nickname']

won_with_sushi = []
lost_with_sushi = []

# getting event information for 2022 completed by Sushi Squad
response2 = requests.get('https://www.thebluealliance.com/api/v3/team/' + TeamKey + f"/events/{year}/keys", headers = headers)
EventKeysInfo = response2.json() 

for i in range(len(EventKeysInfo)):
  
  # getting information for specific event which sushi squad completed in 2022 (all the matches played)
  response3 = requests.get('https://www.thebluealliance.com/api/v3/team/' + TeamKey + "/event/" + EventKeysInfo[i] + "/matches/keys", headers = headers)
  MatchKeysInfo = response3.json()

  for j in range(len(MatchKeysInfo)):
    
  
    # simple match information for a specific match played by sushi squad
    match1 = requests.get('https://www.thebluealliance.com/api/v3/match/' + MatchKeysInfo[j] + "/simple", headers = headers)
    match2 = match1.json()
    
    # specific alliance information for the match
    alliance = match2['alliances']
    
    # red teams list (with score)
    red = alliance['red']
    
    # red teams list specific
    teams = red['team_keys']
    
    # blue teams list (with score)
    blue = alliance['blue']
    
    # blue teams list specific
    teams2 = blue['team_keys']
    
    sushi_squad_side = ""; 
    sushi_team = ""
    winning = match2["winning_alliance"]
    
    
    for team in teams:
      if (team == teamINPUT):
        sushi_squad_side = "red"
        teams.remove(teamINPUT)
        sushi_team = teams
    
    for team in teams2:
      if (team == teamINPUT):
        sushi_squad_side = "blue"
        teams2.remove(teamINPUT)
        sushi_team = teams2
    
    print(sushi_team)
    if (sushi_squad_side == winning):
      for team in sushi_team:
        won_with_sushi.append(team)
    else:
      for team in sushi_team:
        lost_with_sushi.append(team)


countWINList = []
countLOSTList = []

for team in won_with_sushi:
  countWINList.append(won_with_sushi.count(team))

for team in lost_with_sushi:
  countLOSTList.append(lost_with_sushi.count(team))


maxWIN = 0
index1 = 0
maxWINIndex = 0
for i in countWINList:
  if (i > maxWIN):
    maxWIN = i
    maxWINIndex = index1 
  index1 = index1 + 1

maxLOST = 0
index2 = 0
maxIndexLOST = 0
for i in countLOSTList:
  if (i > maxLOST):
    maxLOST = i
    maxIndexLOST = index2 
  index2 = index2 + 1
    
print(won_with_sushi)
print("\n")
print(lost_with_sushi)
print("\n")
print("Best team for " + teamINPUT + ": "+ won_with_sushi[maxWINIndex] + f", number of times: {maxWIN}")

print("\n")
print("Worst team for " + teamINPUT + ": "+ lost_with_sushi[maxIndexLOST] + f", number of times: {maxLOST}")
