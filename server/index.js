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


// *******SOCKET stuff

io.on('connection', function (socket) {
  console.log("client connected***********")
  socket.on("updatedState",function(updatedEditorState,id){
    console.log("Updated editor state on index.js",updatedEditorState)
    socket.to(id).emit('editorState',updatedEditorState)
  })
  socket.on("roomId", function(docId) {
    console.log("DOC ID IS", docId);
    if(socket.room) {
      // socket.leave(socket.room)
    }
      socket.room = docId;
      socket.join(docId);
      console.log("ROOM IS", socket.room);

  })
});






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

//Backend route to get all of the documents user has/collaborates on

// app.get("/documents", function(req, res) {
//   User.findById(req.user._id, function(error, user) {
//     if(error) {
//       console.log("error finding that user", error);
//       res.status(500).json({"error": "error finding that user to fetch documents"})
//     } else if(!user) {
//       console.log("cannot find that user");
//       res.status(400).json({"error": "cannot find that user"})
//     } else {
//
//     }
//   })
// })

//Backend route to check if user logged in

app.get("/user", function(req, res) {
  if(!req.user) {
    throw "Error, you are not logged in";
  } else {
    // const populated = req.user.populate('usersDocs');
    // console.log(req.user);
    User.findById(req.user._id).populate('usersDocs').populate('usersCollabs').then(user => {
      res.status(200).json({"success": true, user});
    });
  }
})

// Backend route to create a new document--fetch request made in docs.jsx

app.post("/create", function(req, res) {
  // console.log("REQ BODY==========", req.bod
  if(req.body.title !== null && req.body.password !== null) {
    console.log("USER IS", req.user);
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
          collabsOfDoc: [],
          history: []
        })

        console.log("DOCUMENT IS", newDocument);

        newDocument.url = newDocument._id;
        // console.log("***", newDocument);
        newDocument.save()
          .then(document => {
            req.user.usersDocs.push(document);
            req.user.save().then(user => {
              res.status(200).json({"success": true, "document": document})
            });

          })
          .catch(e => res.send(e))
      }
    })
  }
})


// Backend route to allow for user to become a collaborator after they get sent the url

app.post("/share", function(req, res) {
  if(req.body.sharedUrl !== null) {
    Document.findOne({_id: req.body.sharedUrl}, function(error, doc) {
      if(error) {
        console.log("problem finding url");
        res.status(500).json({"error": "problem finding url"})
      } else if(!doc) {
        console.log("cannot find doc with that url");
        res.status(400).json({"error": "cannot find that document"})
      } else {
        doc.collabsOfDoc.push(req.user);
        doc.save(function(err) {
          if(err) {
            console.log("couldn't save the updated doc")
            res.status(500).json({"error": "could not update the users on that doc"})
          } else {
            console.log("updated collaborators!");
            User.findOne({_id:req.user._id},function(err,user){
              if(err){
                console.log("problem finding user");
                res.status(500).json({"error":"problem finding user"})
              } else if(!user){
                console.log("cannot find user with that id");
                res.status(400).json({"error":'cannot find that user'})
              } else{
                user.usersCollabs.push(doc.url);
                user.save(function(er) {
                  if(er) {
                    console.log("problem saving user");
                    res.status(500).json({"error": "problem saving user"})
                  } else {
                    res.status(200).json({"success": true, "shared": user.usersCollabs})
                  }
                })
              }
            })
          }
        })
      }
    })
  }
})


// routes for editor-- to get what was in editor and post something new to save change

app.get("/history/:id",function(req,res){
  var docId=req.params.id;
  console.log("entered history get route")
  Document.findById(docId,function(error,doc){
    if(error){
      console.log("could not find contents of that document");
      res.status(500).json({'error':"could not find contents of that document"})
    }else if(!doc){
      console.log("cannot find that docuemnt");
      res.status(400).json({"error":"cannot find that document"})
    }else{
        res.status(200).json({"success":true,"history": doc.history})
      }
    })

})

app.get("/save/:id", function(req, res) {
  var docId = req.params.id;
  console.log('readched')
  Document.findById(docId, function(error, doc) {
    if(error) {
      console.log("could not find contents of that document");
      res.status(500).json({"error": "could not find contents of that document"})
    } else if(!doc) {
      console.log("cannot find that document");
      res.status(400).json({"error": "cannot find that document"})
    } else {
      if(doc.contents){
        res.status(200).json({"success": true, "content": JSON.parse(doc.contents)})
      } else {
        res.status(200).json({"success": true, "content": doc.contents})
      }

    }
  })
})

app.post("/save/:id", function(req, res) {
  var docId = req.params.id;
  console.log("id is", docId);
  console.log("REQ BODY IS IN SAVE ID ROUTE", req.body);
  Document.findOneAndUpdate({_id: docId}, {contents: JSON.stringify(req.body.contents)}, function(error, doc) {
    if(error) {
      console.log("problem finding that document");
      res.status(500).json({"error": "problem finding that document"})
    } else if(!doc) {
      console.log("could not find that document");
      res.status(400).json({"error": "could not find that document"})
    } else {
      console.log("SUCCESS AT UPDATING CONTENTS");
      doc.history.push(JSON.stringify(req.body.contents)); // pushing changes that are saved into document history arr;
      doc.save(function(err) {
        if(err) {
          console.log("failed to save history push");
          res.status(500).json({"error": "failed to save updated history"})
        } else {
            res.status(200).json({"success": true})
        }
      })
    }
  })
})

// Backend route to create a new document--fetch request made in docs.jsx

// app.post("/create", async function(req, res) {
//   if(req.body.title !== null && req.body.password !== null) {
//     try {
//       let document = await Document.findOne({title: req.body.title});
//       if(document) {
//         res.status(400).json({"error": "Document title already taken"})
//       }
//       let newDocument = new Document({
//             title: req.body.title,
//             password: req.body.password,
//             contents: "",
//             url: "",
//             ownerOfDoc: req.user._id,
//             collabsOfDoc: []
//       });
//       newDocument = await newDocument.save();
//       req.user.usersDocs.push(newDocument);
//       await req.user.save();
//       res.status(200).json({ success: 'true', document: newDocument });
//     } catch(e) {
//       console.log(e);
//       res.status(400).send(e);
//     }
//
//
//   }
// })


app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/login');
})


server.listen(8080);
