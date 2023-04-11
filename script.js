var number; 
var year; 


button.addEventListener("click", function(e) {
  alert("Your Team Number Has Been Submitted"); 
  let userInput = document.querySelector("#number"); 
  number = parseInt(userInput.value); 
  document.getElementById("result").innerHTML = "WELCOME";
})


const headers = { "X-TBA-Auth-Key": "tSAklqAAKXw6IMmTQuN5oIhnSrJ6Pqh3bOgVnVA4LUmmByHPinyb66r1bz7wnSfk" };

async function best_worst_team(number, year) {
  // team information
  const teamINPUT = "frc#" + number; 
  const year = year; 

  const response = await fetch(`https://www.thebluealliance.com/api/v3/team/${teamINPUT}`, { headers });
  const TeamInfo = await response.json();
  const TeamKey = TeamInfo.key;
  const TeamName = TeamInfo.nickname;

  const won_with_team = [];
  const lost_with_team = [];

  // getting event information for 2022 completed by team
  const response2 = await fetch(`https://www.thebluealliance.com/api/v3/team/${TeamKey}/events/${year}/keys`, { headers });
  const EventKeysInfo = await response2.json();

  for (let i = 0; i < EventKeysInfo.length; i++) {

    // getting information for specific event which team completed year
    const response3 = await fetch(`https://www.thebluealliance.com/api/v3/team/${TeamKey}/event/${EventKeysInfo[i]}/matches/keys`, { headers });
    const MatchKeysInfo = await response3.json();

    for (let j = 0; j < MatchKeysInfo.length; j++) {

      // simple match information for a specific match played by team
      const match1 = await fetch(`https://www.thebluealliance.com/api/v3/match/${MatchKeysInfo[j]}/simple`, { headers });
      const match2 = await match1.json();

      // specific alliance information for the match
      const alliance = match2.alliances;

      // red teams list (with score)
      const red = alliance.red;

      // red teams list specific
      const teams = red.team_keys;

      // blue teams list (with score)
      const blue = alliance.blue;

      // blue teams list specific
      const teams2 = blue.team_keys;

      let team_side = "";
      let sushi_team = "";
      const winning = match2.winning_alliance;

      for (let k = 0; k < teams.length; k++) {
        const team = teams[k];
        if (team === teamINPUT) {
          team_side = "red";
          teams.splice(k, 1);
          sushi_team = teams;
          break;
        }
      }

      for (let k = 0; k < teams2.length; k++) {
        const team = teams2[k];
        if (team === teamINPUT) {
          team_side = "blue";
          teams2.splice(k, 1);
          sushi_team = teams2;
          break;
        }
      }

      if (team_side === winning) {
        for (const team of sushi_team) {
          won_with_team.push(team);
        }
      } else {
        for (const team of sushi_team) {
          lost_with_team.push(team);
        }
      }
    }
  }

  let countWINList = [];
  let countLOSTList = [];
  
  for (let team of won_with_team) {
    countWINList.push(won_with_team.filter(t => t === team).length);
  }
  
  for (let team of lost_with_team) {
    countLOSTList.push(lost_with_team.filter(t => t === team).length);
  }
  
  let maxWIN = 0;
  let index1 = 0;
  let maxWINIndex = 0;
  for (let i of countWINList) {
    if (i > maxWIN) {
      maxWIN = i;
      maxWINIndex = index1;
    }
    index1 = index1 + 1;
  }
  
  let maxLOST = 0;
  let index2 = 0;
  let maxIndexLOST = 0;
  for (let i of countLOSTList) {
    if (i > maxLOST) {
      maxLOST = i;
      maxIndexLOST = index2;
    }
    index2 = index2 + 1;
  }
  
  let responseBest = await fetch(`https://www.thebluealliance.com/api/v3/team/${won_with_team[maxWINIndex]}`, {headers});
  let TeamInfoBest = await responseBest.json();
  let TeamNameBest = TeamInfoBest.nickname;
  
  let responseWorst = await fetch(`https://www.thebluealliance.com/api/v3/team/${lost_with_team[maxIndexLOST]}`, {headers});
  let TeamInfoWorst = await responseWorst.json();
  let TeamNameWorst = TeamInfoWorst.nickname;
  
  console.log(won_with_team);
  console.log("\n");
  console.log(lost_with_team);
  console.log("\n");
  console.log(`Best team for ${TeamName}: ${TeamNameBest}, number of times: ${maxWIN}`);
  
  console.log("\n");
  console.log(`Worst team for ${TeamName}: ${TeamNameWorst}, number of times: ${maxLOST}`);
}
