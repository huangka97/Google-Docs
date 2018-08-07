import http from 'http';
// var app = require('express')();
var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// models required

var User = require("../src/models/models").User



// crypto

var crypto = require("crypto");


// passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var session = require("express-session");
var bodyParser = require("body-parser");

var mongoose = require("mongoose");

var MongoStore = require("connect-mongo")(session);

// MONGODB connection

mongoose.connection.on("connected", function() {
  console.log("Connected to MongoDb!")
})

mongoose.connect(process.env.MONGODB_URI);

app.use(express.static("public"));
app.use(session({ secret: process.env.SECRET,
                  store: new MongoStore({mongooseConnection: mongoose.connection})}
                ));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, ‘public’)));


// hashing function with sha 256 algorithm
// function hashPassword(password) {
//   var hash = crypto.createHash('sha256');
//   hash.update(password);
//   return hash.digest('hex');
// }


// set passport middleware to first try local strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); } // server error since done is given non-null
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
          return done(null, user); // success cb
    });
  }
));

// session configuration
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(error, user) {
    done(error, user);
  })});

// connect passport to express via express middleware
app.use(passport.initialize());
app.use(passport.session());



// io.on('connection', function (socket) {
//   socket.emit('msg', { hello: 'world' });
//   socket.on('cmd', function (data) {
//     console.log(data);
//   });
// });






// passport

// make sure user logged in

app.get("/", function(req, res) {
  console.log('req.session',req.session);
  console.log('req.user',req.user);
  if(!req.user) {
    //failure redirect
    res.redirect('/login');
  } else if(req.user) {
    //success redirect
    res.render('home',{
      user:req.user
    })
  }
})

// app.get('/login',function(req,res){
//   res.render('login');
// });

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);


// app.get('/register',function(req,res){
//   res.render('signup');
// })

app.post("/register", function(req, res) {
  console.log("BODY IS$$$$$$$$$", req.body)
  if(req.body.username !== null && req.body.password !== null) {
    User.findOne({username: req.body.username, password: req.body.password}, function(error, user) {
      if(error) {
        console.log("error finding that user", error);
        res.status(500).json({"error": "Problem finding that user"})
      } else if(user) {
        console.log("Username already taken", user);
        res.status(400).json({"error": "username already taken"})
      } else if(!user) {
        var newUser = new User({
          username: req.body.username,
          password: req.body.password
        })
        newUser.save(function(err) {

          if(err) {
            res.status(500).json({"error": "failed to save user"})
          } else {
            console.log("Full send");
            res.status(200).json({"success": true})
          }
        })

      }
    })
  }
})

app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/login');
})


server.listen(8080);
