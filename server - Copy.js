var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
  // Scrape the ESPN standings page
  url = 'http://games.espn.com/ffl/standings?leagueId=164548&seasonId=2017';

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);

      var team, wins, losses;
      var json = { team : "", wins : "", losses : ""};

      $('.tableBody').filter(function(){
        var data = $(this);
        team = data.children().first().text().trim();
        wins = data.children().eq(1).first().text().trim();
        losses = data.children().eq(2).first().text().trim();

        json.team = team;
        json.wins = wins;
        json.losses = losses;
      })
/*
      $('.ratingValue').filter(function(){
        var data = $(this);
        rating = data.text().trim();

        json.rating = rating;
      })*/
    }

    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    })

    res.send('Check your console!')
  })
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
