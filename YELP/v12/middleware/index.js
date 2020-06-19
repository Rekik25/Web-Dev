// all the middlewares go here
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middlewareObj = {};
middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    //is user logged in at all?
  if (req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        req.flash("error", "Campground not found!");
        res.redirect("back");}
      else{
        // does user own the campground?
        // cant use === or ==
        // obj vs string
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        } else {// then its a different user
          req.flash("error", "You don't have the permission to do that!");
          res.redirect("back");
        }        
      }
    });
  } else{
    console.log("U NEED TO LOGIN!");
    res.redirect("back");
  }
}
middlewareObj.checkCommentOwnership = function(req, res, next){
  //is user logged in at all?
  if (req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        req.flash("error", "Comment not found!");
        res.redirect("back");
      }
      else{
        // does user own the comment?
        // cant use === or ==
        // obj vs string
        if(foundComment.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }        
      }
    });
  } 
  else{// the user isn't logged in
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("back");
  }
}
middlewareObj.isLoggedIn = function (req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  //this line has to be written before "redirect"
  req.flash("error", "please login first!");
  res.redirect("/login");
}
module.exports = middlewareObj;