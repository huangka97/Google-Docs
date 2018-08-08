var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    usersDocs: [{//docsa user has created
      type: mongoose.Schema.ObjectId,
      ref: "Document"
    }],
    usersCollabs: [{//user's accessible documents he/she has not created
      type: mongoose.Schema.ObjectId,
      ref: "Document"
    }]
  });


var DocumentSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    password: {//each doc needs a password to access
      type: String,
      required: true
    },
    contents: String,
    url: String,
    ownerOfDoc: {//creator of document
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    collabsOfDoc: [{//everyone who collaborated on this document
      type: mongoose.Schema.ObjectId,
      ref: "User"
    }]
  });

  var User = mongoose.model("User", UserSchema);
  var Document = mongoose.model("Document", DocumentSchema);

module.exports = {User: User, Document: Document};
