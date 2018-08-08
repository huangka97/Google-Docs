import http from 'http';
// var app = require('express')();
var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// models required

var User = require("../src/models/models").User;

var Document = require("../src/models/models").Document;



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
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        done(err);
      } else if (user && user.password === password) {
        done(null, user);
      } else {
        done(null);
      }
    });
  }
  //   User.findOne({ username: username }, function (err, user) {
  //     if (err) { return done(err); } // server error since done is given non-null
  //     else if (!user) {
  //       return done(null, false, { message: 'Incorrect username.' });
  //     }
  //     if (!user.validPassword(password)) {
  //       return done(null, false, { message: 'Incorrect password.' });
  //     }
  //         return done(null, user); // success cb
  //   });
  // }
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

// app.post('/login',
//   passport.authenticate('local', { successRedirect: '/',
//                                    failureRedirect: '/login',
//                                    failureFlash: true })
// );

// app.post('/login', function(req,res,next){
//   passport.authenticate('local', function(err,user){
//     if(err){
//       return res.status(500).json({"error": err})
//     }else if(!user){
//       return res.status(400).json({"error": "no user"})
//     }else{
//       return res.status(200).json({"success": true})
//     }
//   })(req, res, next);
// });


app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err || !user) {
      res.status(500).json({"success": false, "message": 'err or bad user/pass'});
    } else {
      req.login(user, (err) => {
        if(err) {
           res.status(500).json({"success": false, "err": err});
        } else {
           res.status(200).json({"success": true});
        }
      })
    }
  })(req, res, next);
});


// app.get('/register',function(req,res){
//   res.render('signup');
// })

app.post("/register", function(req, res) {
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
            res.status(200).json({"success": true})
          }
        })

      }
    })
  }
})


// Backend route to create a new document--fetch request made in docs.jsx

app.post("/create", function(req, res) {
  console.log("REQ BODY==========", req.body);
  if(req.body.title !== null && req.body.password !== null) {

    Document.findOne({title: req.body.title}, function(error, document) {
      if(error) {
        console.log("Error finding a doc", error);
        res.status(500).json({"error": error})
      } else if(document) {
        console.log("Document title already taken");
        res.status(400).json({"error": "Document title already taken"})
      } else if(!document) {
        var newDocument = new Document({
          title: req.body.title,
          password: req.body.password,
          contents: "",
          url: "",
          ownerOfDoc: req.user._id,
          collabsOfDoc: []

        })

        console.log("DOCUMENT IS", newDocument);

        newDocument.url = newDocument._id;
        console.log("***", newDocument);
        newDocument.save(function(err) {
          if(err) {
            console.log("error saving new document", err);
            res.status(500).json({"error": "cannot save document"})
          } else {
            console.log("successfully saved doc");
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
