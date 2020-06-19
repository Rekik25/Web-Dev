var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
//COMMENTS NEW
router.get("/new", isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){console.log(err);}
    else{res.render("comments/new", {campground: campground});}
  });
});
//COMMENTS CREATE, connects to campg, redirect to show
router.post("/", isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){console.log(err);res.redirect("/campgrounds");}
    else{
      //console.log(req.body.comment);
      Comment.create(req.body.comment, function(err, comment){
        if(err){console.log(err);}
        else{
          //add username and id to connect
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //req.user
          comment.save()
          //save comment
          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});
//middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}
module.exports = router;