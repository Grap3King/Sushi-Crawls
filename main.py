import requests

headers = {"X-TBA-Auth-Key" : "tSAklqAAKXw6IMmTQuN5oIhnSrJ6Pqh3bOgVnVA4LUmmByHPinyb66r1bz7wnSfk"}
response = requests.get('https://www.thebluealliance.com/api/v3/team/frc7461', headers = headers)
TeamInfo = response.json()
print(TeamInfo)
TeamKey = TeamInfo['key']
TeamName = TeamInfo['nickname']

response2 = requests.get('https://www.thebluealliance.com/api/v3/team/' + TeamKey + "/events/2022/keys", headers = headers)
EventKeysInfo = response2.json() 
print("\n")
print(EventKeysInfo)

response3 = requests.get('https://www.thebluealliance.com/api/v3/team/' + TeamKey + "/event/" + EventKeysInfo[1] + "/matches/keys", headers = headers)
MatchKeysInfo = response3.json()
print("\n")
print(MatchKeysInfo)

match1 = requests.get('https://www.thebluealliance.com/api/v3/match/' + MatchKeysInfo[1] + "/simple", headers = headers)
match2 = match1.json()
alliance = match2['alliances']
red = alliance['red']
teams = red['team_keys']
blue = alliance['blue']
teams2 = blue['team_keys']
print("\n")
print(teams)
print("\n")
print(teams2)
