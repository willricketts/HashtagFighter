exports.index = function(req, res){
  //Take query strings and assign them to player objects
var clients = io.sockets.clients();
console.log(clients.id);
var player1 = req.query.player1,
    player2 = req.query.player2;
console.log(player1 + " | " + player2);

var hashtags = [player1, player2];
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
res.render('index', { title: 'Hashtag Fighter', player1: player1, player2: player2 });


};
