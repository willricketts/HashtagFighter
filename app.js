var express = require('express');
var engine = require('ejs-locals');
var routes = require('./routes');
var path = require('path');
var Twit = require('twit');
var app = express();
var port = 3000;
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var twitterKeys = require('./modules/twitterkeys.js');
var T = new Twit(twitterKeys);

//Set up Twitter wrapper with twitterKeys module exports

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', engine);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Routes
app.get('/', function(req, res){
  var clients = io.sockets.clients();
  console.log(clients.id);
  var player1 = "",
      player2 = "";

  //Once players are selected
  if((req.query.player1 != "") && (req.query.player2 != "")){
    player1 = req.query.player1,
    player2 = req.query.player2;
    console.log(player1 + " | " + player2);
    
    //Add # to brand strings
    var hashtags = ["#" + player1, "#" + player2];
    io.sockets.on('connection', function(socket){
      console.log('client connected');
      console.log('streaming tweets for: ' + hashtags[0] + " & " + hashtags[1]);
      var options = { track : hashtags, language: 'en' };
      var stream = T.stream('statuses/filter', options);
      stream.on('tweet', function (tweet) {
        socket.emit('twitter', tweet);
      });
    });
    io.sockets.on('disconnect', function(socket) {
      socket.socket.disconnect();
    });
  };

  //Render view
  res.render('index', { title: 'Hashtag Fighter', player1: player1, player2: player2 });
});

server.listen(port, function(){
    console.log("Server listening on port " + port + ". HADOUKEN!");
});
