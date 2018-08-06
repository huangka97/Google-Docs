import http from 'http';
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// set passport middleware to first try local strategy
passport.use(new LocalStrategy(function(user, pass, cb){...});

// session configuration
passport.serializeUser(...);
passport.deserializeUser(...);

// connect passport to express via express middleware
app.use(passport.initialize());
app.use(passport.session());
server.listen(8080);
io.on('connection', function (socket) {
  socket.emit('msg', { hello: 'world' });
  socket.on('cmd', function (data) {
    console.log(data);
  });
});

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
