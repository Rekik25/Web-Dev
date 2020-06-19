// all the middlewares go here
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middlewareObj = {};
middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership(req, res, next) {
    //is user logged in at all?
  if (req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){res.redirect("back");}
      else{
        // does user own the campground?
        // cant use === or ==
        // obj vs string
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        } else {
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
      if(err){res.redirect("back");}
      else{
        // does user own the comment?
        // cant use === or ==
        // obj vs string
        if(foundComment.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect("back");
        }        
      }
    });
  } else{
    console.log("U NEED TO LOGIN!");
    res.redirect("back");
  }
}
middlewareObj.isLoggedIn = function (req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}
module.exports = middlewareObj;