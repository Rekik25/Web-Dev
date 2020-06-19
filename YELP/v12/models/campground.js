var mongoose = require("mongoose");
var campSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String
    },
    comments: [
      {
        //embedding the id/reference to the actual
        //comment, not the whole comment
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
});
//var campground = mongoose.model("Campground", campSchema);
module.exports = mongoose.model("Campground", campSchema);