let axios = require('axios');
let cheerio = require('cheerio');

let base_url = 'http://games.espn.com/ffl/standings?leagueId=164569&seasonId=2017';

axios.get(base_url).then( (response) => {
  let $ = cheerio.load(response.data);
  let users = [];
  let pointsArray = [];
  $('.evenRow, .oddRow').each( (i, elm) => {
      pointsArray.push({
          pointsFor: $(elm).children().eq(1).attr('class','sortablePF').text(),
          pointsAgainst: $(elm).children().eq(2).attr('class','sortablePA').text(),
      });
  });

  $('.tableBody [bgcolor=#f2f2e8], .tableBody [bgcolor=#f8f8f2]').each( (i, elm) => {
    users.push( {
      team: $(elm).children().first().children().attr('title'),
      wins: $(elm).children().eq(1).first().text(),
      losses: $(elm).children().eq(2).first().text(),  
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
  return(users);
})
.then ( (users) => {
 console.log(users);
});