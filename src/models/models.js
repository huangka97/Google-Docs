var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var User = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  });


  // var Document = new Schema(
  //   {
  //     owner: String,
  //     password: String
  //   });

  var User = mongoose.model("User", UserSchema);
  var Document = mongoose.model("Document", DocumentSchema);

module.exports = {User: User, Document: Document};
