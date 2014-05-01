exports.index = function(req, res){
  //Take query strings and assign them to player objects
  var player1 = req.query.player1,
      player2 = req.query.player2;
  console.log(player1 + " | " + player2);
  res.render('index', { title: 'Hashtag Fighter', player1: player1, player2: player2 });
};
