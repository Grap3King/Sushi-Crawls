
const headers = {"X-TBA-Auth-Key": "tSAklqAAKXw6IMmTQuN5oIhnSrJ6Pqh3bOgVnVA4LUmmByHPinyb66r1bz7wnSfk"};


const result1 = document.getElementById('result1'); 
const b1 = document.getElementById('b1'); 

const text1 = document.getElementById("text1"); 
const result2 = document.getElementById('result2'); 

b1.addEventListener("click", onINPUT); 


const heading = document.getElementById('heading'); 
const heading2 = document.getElementById('heading2'); 
const heading3 = document.getElementById('heading3'); 

async function onINPUT() {
  alert("Your Team Number Has Been Submitted"); 
  const value = text1.value; 
  const number = value.substring(0, 4); 
  const year = value.substring(5, 9); 

  const TeamName = await getTeamName(parseInt(number)); 

  result1.innerHTML = "Welcome member of " + TeamName  + ". Calculating data for " + year + " season... (Please wait for 2 min)" ; 

  const rokyear = await getRookieYear(parseInt(number)); 

  const years = []; 
  const wins = []; 
  const losss = []; 

  for (let i = rokyear; i <= parseInt(year); i++) {
    years.push(i);
    tempwin = await wins_team(parseInt(number), i); 
    temploss = await loss_team(parseInt(number), i); 
    wins.push(tempwin); 
    losss.push(temploss); 
  }

  
  best_worst_team(parseInt(number), year); 

  heading.innerHTML = "Best teams for " + TeamName + " in the " + year + " season"
  heading2.innerHTML = "Worst teams for " + TeamName + " in the " + year + " season"
  heading3.innerHTML = "Wins/Loss Progression for " + TeamName + " till " + year + " season"


  const data = {
      labels: years,
      datasets: [{
        label: 'Wins',
        backgroundColor: 'rgba(0, 103, 255, 0.8)', 
        borderColor: 'rgba(0, 103, 255, 0.8)', 
        tension: 0.5,
        data: wins
      }, {
        label: 'Loss',
        backgroundColor: 'rgba(255, 0, 0, 0.8)', 
        borderColor: 'rgba(255, 0, 0, 0.8)', 
        tension: 0.5,
        data: losss
      }]
    };

    // config 
    const config = {
      type: 'line', 
      data,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    // render init block
    const myChart = new Chart(
      document.getElementById('myChart'),
      config
    );

    // Instantly assign Chart.js version
    const chartVersion = document.getElementById('chartVersion');
    chartVersion.innerText = Chart.version;
}















async function getTeamName(number) {
  const teamINPUT = "frc" + number;
  const response = await fetch(`https://www.thebluealliance.com/api/v3/team/${teamINPUT}`, {headers});
  const TeamInfo = await response.json();
  var TeamKey = TeamInfo.key;
  var TeamName = TeamInfo.nickname;
  return TeamName; 
}


async function getRookieYear(number) {
   const teamINPUT = "frc" + number;
  const response = await fetch(`https://www.thebluealliance.com/api/v3/team/${teamINPUT}`, {headers});
  const TeamInfo = await response.json();
  var TeamRokYear = TeamInfo.rookie_year;
  return parseInt(TeamRokYear); 
}



async function best_worst_team(number, yearnum) {
  const teamINPUT = "frc" + number; 
  const year = yearnum; 
  const numtop = 4;
  const numbottom = 4;


  const response = await fetch(`https://www.thebluealliance.com/api/v3/team/${teamINPUT}`, { headers });
  const TeamInfo = await response.json();
  const TeamKey = TeamInfo.key;
  const TeamName = TeamInfo.nickname;


  const won_with_team = [];
  let wins = 0;
  let loss = 0;
  const lost_with_team = [];

  const response2 = await fetch(`https://www.thebluealliance.com/api/v3/team/${TeamKey}/events/${year}/keys`, { headers });
  const EventKeysInfo = await response2.json();

  for (let i = 0; i < EventKeysInfo.length; i++) {
    const response3 = await fetch(`https://www.thebluealliance.com/api/v3/team/${TeamKey}/event/${EventKeysInfo[i]}/matches/keys`, { headers });
    const MatchKeysInfo = await response3.json();

    for (let j = 0; j < MatchKeysInfo.length; j++) {
      const match1 = await fetch(`https://www.thebluealliance.com/api/v3/match/${MatchKeysInfo[j]}/simple`, { headers });
      const match2 = await match1.json();
      const alliance = match2.alliances;
      const red = alliance.red;
      const teams = red.team_keys;
      const blue = alliance.blue;
      const teams2 = blue.team_keys;
      let team_side = "";
      let sushi_team = "";
      const winning = match2.winning_alliance;

      for (let k = 0; k < teams.length; k++) {
        if (teams[k] === teamINPUT) {
          team_side = "red";
          teams.splice(k, 1);
          sushi_team = teams;
        }
      }

      for (let k = 0; k < teams2.length; k++) {
        if (teams2[k] === teamINPUT) {
          team_side = "blue";
          teams2.splice(k, 1);
          sushi_team = teams2;
        }
      }

      if (team_side === winning) {
        for (let k = 0; k < sushi_team.length; k++) {
          won_with_team.push(sushi_team[k]);
          wins++;
        }
      } else {
        for (let k = 0; k < sushi_team.length; k++) {
          lost_with_team.push(sushi_team[k]);
          loss++;
        }
      }
    }
  }
  

  const countWINList = won_with_team.map(team => won_with_team.filter(t => t === team).length);
  const countLOSTList = lost_with_team.map(team => lost_with_team.filter(t => t === team).length);

  const best = {};
  for (let i = 0; i < countWINList.length; i++) {
    best[won_with_team[i]] = countWINList[i];
  }

  

  const bestsorted = Object.entries(best).sort((a, b) => parseFloat(a[1]) - parseFloat(b[1]));
  const converted_best = Object.fromEntries(bestsorted);
  const bestKeysFINAL = Object.keys(converted_best);
  const bestValuesFINAL = Object.values(converted_best);


  const worst = {};
  for (let i = 0; i < countLOSTList.length; i++) {
    worst[lost_with_team[i]] = countLOSTList[i];
  }

  const worstsorted = Object.entries(worst).sort((a, b) => a[1] - b[1]);
  const converted_worst = Object.fromEntries(worstsorted);
  const worstKeysFINAL = Object.keys(converted_worst);
  const worstValuesFINAL = Object.values(converted_worst);


  bestname1 = await getTeamName(parseInt((bestKeysFINAL[bestKeysFINAL.length - 1]).substring(3, 7))); 
  bestname1 = "1. " + bestname1 + " - " + (bestKeysFINAL[bestKeysFINAL.length - 1]).substring(3, 7); 
  bestname2 = await getTeamName(parseInt((bestKeysFINAL[bestKeysFINAL.length - 2]).substring(3, 7)));
  bestname2 ="2. " + bestname2 + " - " + (bestKeysFINAL[bestKeysFINAL.length - 2]).substring(3, 7);
  bestname3 = await getTeamName(parseInt((bestKeysFINAL[bestKeysFINAL.length - 3]).substring(3, 7)));
  bestname3 = "3. " + bestname3 + " - " + (bestKeysFINAL[bestKeysFINAL.length - 3]).substring(3, 7);
  bestname4 = await getTeamName(parseInt((bestKeysFINAL[bestKeysFINAL.length - 4]).substring(3, 7)));
  bestname4 = "4. " + bestname4 + " - " + (bestKeysFINAL[bestKeysFINAL.length - 4]).substring(3, 7);

  bestnum1 = Math.ceil((bestValuesFINAL[bestValuesFINAL.length -1] / wins) * 1000) / 10; 
  bestnum2 = Math.ceil((bestValuesFINAL[bestValuesFINAL.length -2] / wins) * 1000) / 10; 
  bestnum3 = Math.ceil((bestValuesFINAL[bestValuesFINAL.length -3] / wins) * 1000) / 10; 
  bestnum4 = Math.ceil((bestValuesFINAL[bestValuesFINAL.length -4] / wins) * 1000) / 10; 

  

  percent = ((bestValuesFINAL[bestValuesFINAL.length-2] / wins) * 100) + ((bestValuesFINAL[bestValuesFINAL.length -1] / wins) * 100) + ((bestValuesFINAL[bestValuesFINAL.length-3] /wins) * 100) + ((bestValuesFINAL[bestValuesFINAL.length-4] / wins) * 100)

  percent = Math.ceil(100 - percent); 

 
  const chartData = {
  labels: [bestname1, bestname2, bestname3, bestname4, "Others"],
  data: [bestnum1, bestnum2, bestnum3, bestnum4, percent],
};

  const myChart = document.querySelector(".my-chart");
  const ul = document.querySelector(".programming-stats .details ul");
  
  new Chart(myChart, {
    type: "doughnut",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "% of wins",
          data: chartData.data,
        },
      ],
    },
    options: {
      borderWidth: 3,
      borderRadius: 2,
      hoverBorderWidth: 0,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
  
  const populateUl = () => {
    chartData.labels.forEach((l, i) => {
      let li = document.createElement("li");
      li.innerHTML = `${l}: <span class='percentage'>${chartData.data[i]}%</span>`;
      ul.appendChild(li);
    });
  };
  populateUl();



  worstname1 = await getTeamName(parseInt((worstKeysFINAL[worstKeysFINAL.length - 1]).substring(3, 7)));
  worstname1 = "1. " + worstname1 + " - " + (worstKeysFINAL[worstKeysFINAL.length - 1]).substring(3, 7); 
  worstname2 = await getTeamName(parseInt((worstKeysFINAL[worstKeysFINAL.length - 2]).substring(3, 7)));
  worstname2 = "2. " + worstname2 + " - " + (worstKeysFINAL[worstKeysFINAL.length - 2]).substring(3, 7); 
  worstname3 = await getTeamName(parseInt((worstKeysFINAL[worstKeysFINAL.length - 3]).substring(3, 7)));
  worstname3 = "3. " + worstname3 + " - " + (worstKeysFINAL[worstKeysFINAL.length - 3]).substring(3, 7); 
  worstname4 = await getTeamName(parseInt((worstKeysFINAL[worstKeysFINAL.length - 4]).substring(3, 7)));
  worstname4 = "4. " + worstname4 + " - " + (worstKeysFINAL[worstKeysFINAL.length - 4]).substring(3, 7); 

  worstnum1 = Math.ceil((worstValuesFINAL[worstValuesFINAL.length -1] / wins) * 1000) / 10; 
  worstnum2 = Math.ceil((worstValuesFINAL[worstValuesFINAL.length -2] / wins) * 1000) / 10; 
  worstnum3 = Math.ceil((worstValuesFINAL[worstValuesFINAL.length -3] / wins) * 1000) / 10; 
  worstnum4 = Math.ceil((worstValuesFINAL[worstValuesFINAL.length -4] / wins) * 1000) / 10; 

  

  percent2 = ((worstValuesFINAL[worstValuesFINAL.length-2] / loss) * 100) + ((worstValuesFINAL[worstValuesFINAL.length -1] / loss) * 100) + ((worstValuesFINAL[worstValuesFINAL.length-3] / loss) * 100) + ((worstValuesFINAL[worstValuesFINAL.length-4] / loss) * 100)

  percent2 = Math.ceil(100 - percent2); 

  const chartData2 = {
  labels: [worstname1, worstname2, worstname3, worstname4, "Others"],
  data: [worstnum1, worstnum2, worstnum3, worstnum4, percent2],
};

  const myChart2 = document.querySelector(".my-chart2");
  const ul2 = document.querySelector(".programming-stats2 .details2 ul");
  
  new Chart(myChart2, {
    type: "doughnut",
    data: {
      labels: chartData2.labels,
      datasets: [
        {
          label: "% of loss",
          data: chartData2.data,
        },
      ],
    },
    options: {
      borderWidth: 3,
      borderRadius: 2,
      hoverBorderWidth: 0,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
  
  const populateUl2 = () => {
    chartData2.labels.forEach((l, i) => {
      let li = document.createElement("li");
      li.innerHTML = `${l}: <span class='percentage'>${chartData2.data[i]}%</span>`;
      ul2.appendChild(li);
    });
  };
  populateUl2();
}



async function wins_team(number, yearnum) {
  const teamINPUT = "frc" + number; 
  const year = yearnum; 


  const response = await fetch(`https://www.thebluealliance.com/api/v3/team/${teamINPUT}`, { headers });
  const TeamInfo = await response.json();
  const TeamKey = TeamInfo.key;
  const TeamName = TeamInfo.nickname;


  const won_with_team = [];
  let wins = 0;
  let loss = 0;
  const lost_with_team = [];

  const response2 = await fetch(`https://www.thebluealliance.com/api/v3/team/${TeamKey}/events/${year}/keys`, { headers });
  const EventKeysInfo = await response2.json();

  for (let i = 0; i < EventKeysInfo.length; i++) {
    const response3 = await fetch(`https://www.thebluealliance.com/api/v3/team/${TeamKey}/event/${EventKeysInfo[i]}/matches/keys`, { headers });
    const MatchKeysInfo = await response3.json();

    for (let j = 0; j < MatchKeysInfo.length; j++) {
      const match1 = await fetch(`https://www.thebluealliance.com/api/v3/match/${MatchKeysInfo[j]}/simple`, { headers });
      const match2 = await match1.json();
      const alliance = match2.alliances;
      const red = alliance.red;
      const teams = red.team_keys;
      const blue = alliance.blue;
      const teams2 = blue.team_keys;
      let team_side = "";
      let sushi_team = "";
      const winning = match2.winning_alliance;

      for (let k = 0; k < teams.length; k++) {
        if (teams[k] === teamINPUT) {
          team_side = "red";
          teams.splice(k, 1);
          sushi_team = teams;
        }
      }

      for (let k = 0; k < teams2.length; k++) {
        if (teams2[k] === teamINPUT) {
          team_side = "blue";
          teams2.splice(k, 1);
          sushi_team = teams2;
        }
      }

      if (team_side === winning) {
        for (let k = 0; k < sushi_team.length; k++) {
          won_with_team.push(sushi_team[k]);
          wins++;
        }
      } else {
        for (let k = 0; k < sushi_team.length; k++) {
          lost_with_team.push(sushi_team[k]);
          loss++;
        }
      }
    }
  }
  

  return wins; 
}


async function loss_team(number, yearnum) {
  const teamINPUT = "frc" + number; 
  const year = yearnum; 


  const response = await fetch(`https://www.thebluealliance.com/api/v3/team/${teamINPUT}`, { headers });
  const TeamInfo = await response.json();
  const TeamKey = TeamInfo.key;
  const TeamName = TeamInfo.nickname;


  const won_with_team = [];
  let wins = 0;
  let loss = 0;
  const lost_with_team = [];

  const response2 = await fetch(`https://www.thebluealliance.com/api/v3/team/${TeamKey}/events/${year}/keys`, { headers });
  const EventKeysInfo = await response2.json();

  for (let i = 0; i < EventKeysInfo.length; i++) {
    const response3 = await fetch(`https://www.thebluealliance.com/api/v3/team/${TeamKey}/event/${EventKeysInfo[i]}/matches/keys`, { headers });
    const MatchKeysInfo = await response3.json();

    for (let j = 0; j < MatchKeysInfo.length; j++) {
      const match1 = await fetch(`https://www.thebluealliance.com/api/v3/match/${MatchKeysInfo[j]}/simple`, { headers });
      const match2 = await match1.json();
      const alliance = match2.alliances;
      const red = alliance.red;
      const teams = red.team_keys;
      const blue = alliance.blue;
      const teams2 = blue.team_keys;
      let team_side = "";
      let sushi_team = "";
      const winning = match2.winning_alliance;

      for (let k = 0; k < teams.length; k++) {
        if (teams[k] === teamINPUT) {
          team_side = "red";
          teams.splice(k, 1);
          sushi_team = teams;
        }
      }

      for (let k = 0; k < teams2.length; k++) {
        if (teams2[k] === teamINPUT) {
          team_side = "blue";
          teams2.splice(k, 1);
          sushi_team = teams2;
        }
      }

      if (team_side === winning) {
        for (let k = 0; k < sushi_team.length; k++) {
          won_with_team.push(sushi_team[k]);
          wins++;
        }
      } else {
        for (let k = 0; k < sushi_team.length; k++) {
          lost_with_team.push(sushi_team[k]);
          loss++;
        }
      }
    }
  }
  

  return loss; 
}
