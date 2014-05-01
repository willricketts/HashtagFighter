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

//Set up Twitter wrapper with twitterKeys module exports
var T = new Twit(twitterKeys);

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
app.get('/', routes.index);

server.listen(port, function(){
    console.log("Server listening on port " + port + ". HADOUKEN!");
});
