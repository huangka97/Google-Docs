var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var User = new Schema(
{
  name: String,
});


var Document = new Schema(
{
  owner: String,
  password: String
});

var User = mongoose.model("User", UserSchema);
var Document = mongoose.model("Document", DocumentSchema);

module.exports = {User: User, Document: Document};
