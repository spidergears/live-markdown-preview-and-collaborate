// server.js

var express = require('express');
var shareJs = require('share');

var lmdApp = express();

lmdApp.set('view engine', 'ejs');

lmdApp.use('/node_modules', express.static(__dirname + '/node_modules'));
lmdApp.use(express.static(__dirname + '/public'));

lmdApp.get('/', function(request, response){
  response.render('index');
});
lmdApp.get('/(:id)', function(request, response){
  response.render('index');
});

var redisClient;
if(process.env.REDISTOGO_URL){
  var redis_to_go = require("url").parse(process.env.REDISTOGO_URL);
  redisClient = require("redis").createClient(redis_to_go.port, redis_to_go.hostname);
  redisClient.auth(redis_to_go.auth.split(":")[1]);
}
else{
  redisClient = require("redis").createClient();
}

var options = {
  db: {type: 'redis', client: redisClient}
};

shareJs.server.attach(lmdApp, options);

var port = process.env.PORT || 8000;
lmdApp.listen(port);
