import requests

headers = {"X-TBA-Auth-Key" : "tSAklqAAKXw6IMmTQuN5oIhnSrJ6Pqh3bOgVnVA4LUmmByHPinyb66r1bz7wnSfk"}
response = requests.get('https://www.thebluealliance.com/api/v3/team/frc7461', headers = headers)
TeamInfo = response.json()
print(TeamInfo)
TeamKey = TeamInfo['key']
TeamName = TeamInfo['nickname']
response2 = requests.get('https://www.thebluealliance.com/api/v3/team/' + TeamKey + "/events/2022/keys", headers = headers)
EventKeysInfo = response2.json() 
print(EventKeysInfo)

response3 = requests.get('https://www.thebluealliance.com/api/v3/team/' + TeamKey + "/event/" + EventKeysInfo[1] + "/matches/keys", headers = headers)
MatchKeysInfo = response3.json()
print(MatchKeysInfo)

response4 = requests.get()
