let axios = require('axios');
var fs = require('fs');
let cheerio = require('cheerio');

let leagueID = "164548";
let currentYear = "2017";
let base_url_currentyear = 'http://games.espn.com/ffl/standings?leagueId=' + leagueID + '&seasonId=' + currentYear;
let base_url_main = 'http://games.espn.com/ffl/leagueoffice?leagueId=' + leagueID + '&seasonId=' + currentYear;
let base_url_history = "";

axios.get(base_url_main).then( (response) => {
  let $ = cheerio.load(response.data);  
  let yearsArray = [];
  $('[id=seasonHistoryMenu]').children().each( (i, elm) => {
    yearsArray.push($(elm).text());
});
//console.log(yearsArray);
return(yearsArray);
})

.then ( (yearsArray) => {
  console.log(yearsArray);
  let historyArray = [];
  for (let y=1; y<yearsArray.length; y++){
    base_url_history = 'http://games.espn.com/ffl/tools/finalstandings?leagueId=' + leagueID + '&seasonId=' + yearsArray[y];
        axios.get(base_url_history).then( (response) => {
          let $ = cheerio.load(response.data);  
          let historyTeams = [];
          $('[id=finalRankingsTable]').children().children().next().next().attr('class','sortableRow').each( (i, elm) => {
            historyTeams.push({
              team : $(elm).children().eq(1).children().attr('title'),
              finalrank : $(elm).children().eq(0).text(),
              record: $(elm).children().eq(4).text(),
              pf : $(elm).children().eq(5).text(),
              pa : $(elm).children().eq(6).text(),
          });
        });
        historyArray.push({
          year : yearsArray[y],
          teams : historyTeams
      });
        fs.appendFile('output.json', JSON.stringify(historyArray, null, 4), function(err){
          console.log('File successfully written! - Check your project directory for the output.json file');
        })
        //console.log(historyArray);
        return(historyArray);
      })
    }
});

axios.get(base_url_currentyear).then( (response) => {
  let $ = cheerio.load(response.data);
  let users = [];
  let currentArray = [];
  let pointsArray = [];
  $('.evenRow, .oddRow').each( (i, elm) => {
      pointsArray.push({
          pointsFor : $(elm).children().eq(1).attr('class','sortablePF').text(),
          pointsAgainst : $(elm).children().eq(2).attr('class','sortablePA').text(),
      });
  });

  $('.tableBody [bgcolor=#f2f2e8], .tableBody [bgcolor=#f8f8f2]').each( (i, elm) => {
    users.push( {
      team : $(elm).children().first().children().attr('title'),
      finalrank : "",
      wins : $(elm).children().eq(1).first().text(),
      losses : $(elm).children().eq(2).first().text(),  
    });
  });

  //console.log(pointsArray);
  for(i in users) {
    for(j in pointsArray){
      if (i == j){
        users[i].pf = pointsArray[j].pointsFor;
        users[i].pa = pointsArray[j].pointsAgainst;
      }
    }
  }

  currentArray.push({
    year : currentYear,
    teams : users
  });
  fs.writeFile('output.json', JSON.stringify(currentArray, null, 4), function(err){
    console.log('File successfully written current teams! - Check your project directory for the output.json file');
  })
  return(currentArray);
})
.then ( (currentArray) => {
 //console.log(currentArray);
});