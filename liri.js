require("dotenv").config();
// creating a varibles to make arequired packages and convert tham to var
var keys = require("./keys.js");
var spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

// making a 2 variblals for the argument one will target the command that we want to activate (concert-this,spotify-this-song,movie-this,do-what-it-says)
// and the other varibale will target the user search (spotify,movie)
var usercommandtarget = process.argv[2];
var userSerach = process.argv.slice(3).join(" ");

function liriActiv(usercommandtarget, userSerach) {
  switch (usercommandtarget) {
    case 'spotify-this-song':
      getSpotify(userSerach);
      break;

    case 'concert-this':
      getBandsInTown(userSerach);
      break;

    case 'movie-this':
      getmovieOMDB(userSerach);
      break;

    case 'do-what-it-says':
      getRandom();
      break;

    default:
      console.log('please enter one of the following command concert-this,spotify-this-song,movie-this,do-what-it-says');
  };
};

function getSpotify(userSong) {
  var myspotify = new spotify(keys.spotify);
  // console.log("Sporify Key: " + myspotify);
  if (!userSong) {
    songName = "The Sign"
  };
  myspotify.search({ type: 'track', query: userSong }, function (err, data) {
    if (err) {
      return console.log('Error:  ' + err)
    };
    console.log("*******************************");
    console.log("Artist Name:  " + data.tracks.items[0].album.artists[0].name + "\r\n");
    console.log("Song Name:  " + data.tracks.items[0].name + "\r\n");
    console.log("Song Preview Link: " + data.tracks.items[0].href + "\r\n");
    console.log("Album:  " + data.tracks.items[0].album.name + "\r\n");
  var logsong = "======Begin Spotify Log Entry======" + "\nArtist: " + data.tracks.items[0].album.artists[0].name + "\nSong Name: " + data.tracks.items[0].name + "\n Preview Link: " + data.tracks.items[0].href + "\nAlbum Name: " + data.tracks.items[0].album.name + "\n======End Spotify Log Entry======" + "\n";
  fs.appendFile("log.txt", logsong, function (err) {
    if (err) throw err;
  });
});
};

function getBandsInTown(artist) {

  var artist = userSerach;
  var bandQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

  axios.get(bandQueryURL).then(
    function (response) {
      if(response.data.length<=0)
      {
         return console.log("No Preformce are comming");
      }
      console.log("=============================");
      // console.log(response.data);
      console.log("Name of the venue: " + response.data[0].venue.name + "\r\n");
      console.log("Venue Location: " + response.data[0].venue.city + "\r\n");
      console.log("Date of event: " + moment(response.data[0].datetime).format("MM-DD-YYYY") + "\r\n");
      var logConcert = "======Begin Concert Log Entry======" + "\nName of the musician: " + artist + "\nName of the venue: " + response.data[0].venue.name + "\n Venue location: " + response.data[0].venue.city + "\n Date of event: " + moment(response.data[0].datetime).format("MM-DD-YYYY") + "\n======End Concert Log Entry======" + "\n";

      fs.appendFile("log.txt", logConcert, function (err) {
        if (err) throw err;
      });
    });
};

function getmovieOMDB(movie) {
  //console.log("Movie: " + movie);

  //If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
  if (!movie) {
    movie = "Mr. Nobody";
  }
  var movieQueryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
  //console.log(movieQueryUrl);

  axios.request(movieQueryUrl).then(
    function (response) {
      if(response.data.length<=0)
      {
         return console.log("No Moive found by this title");
      }
      // console.log(response.data);
      console.log("=============================");
      console.log("* Title: " + response.data.Title + "\r\n");
      console.log("* Year Released: " + response.data.Year + "\r\n");
      console.log("* IMDB Rating: " + response.data.imdbRating + "\r\n");
      console.log("* Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\r\n");
      console.log("* Country Where Produced: " + response.data.Country + "\r\n");
      console.log("* Language: " + response.data.Language + "\r\n");
      console.log("* Plot: " + response.data.Plot + "\r\n");
      console.log("* Actors: " + response.data.Actors + "\r\n");

      var logMovie = "======Begin Movie Log Entry======" + "\nMovie title: " + response.data.Title + "\nYear released: " + response.data.Year + "\nIMDB rating: " + response.data.imdbRating + "\nRotten Tomatoes rating: " + response.data.Ratings[1].Value + "\nCountry where produced: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors + "\n======End Movie Log Entry======" + "\n";

      fs.appendFile("log.txt", logMovie, function (err) {
        if (err) throw err;
      });
    });
};

// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// FUNCTION RANDOM
function getRandom() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);

    } else {
      console.log(data);

      var randomData = data.split(",");
      liriActiv(randomData[0], randomData[1]);
    }
    console.log("\r\n" + "testing: " + randomData[0] + randomData[1]);

  });
};

// FUNCTION to log results from the other funtions
function logResults(data) {
  fs.appendFile("log.txt", data, function (err) {
    if (err) throw err;
  });
};

liriActiv(usercommandtarget, userSerach);