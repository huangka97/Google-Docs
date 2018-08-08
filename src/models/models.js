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
    ownersDocs: [{
      type: mongoose.Schema.ObjectId,
      ref: "Document"
    }],
    ownersCollabs: [{
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
    password: {
      type: String,
      required: true
    },
    url: {
      type: mongoose.Schema.ObjectId,
      required: true
    },
    ownerOfDoc: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    collabsOfDoc: [{
      type: mongoose.Schema.ObjectId,
      ref: "User"
    }]
  });

  var User = mongoose.model("User", UserSchema);
  var Document = mongoose.model("Document", DocumentSchema);

module.exports = {User: User, Document: Document};
