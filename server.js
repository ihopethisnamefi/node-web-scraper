let axios = require('axios');
let cheerio = require('cheerio');

let base_url = 'http://games.espn.com/ffl/standings?leagueId=164548&seasonId=2017';

axios.get(base_url).then( (response) => {
  let $ = cheerio.load(response.data);
  let users = [];
  $('.tableBody [bgcolor=#f2f2e8], .tableBody [bgcolor=#f8f8f2]').each( (i, elm) => {
    users.push( {
      team: $(elm).children().first().children().attr('title'),
      wins: $(elm).children().eq(1).first().text(),
      losses: $(elm).children().eq(2).first().text(),
    });
  });

  return(users);
})
.then ( (users) => {
  console.log(users);
});