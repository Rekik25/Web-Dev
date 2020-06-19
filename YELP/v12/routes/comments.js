var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require(".. /models/comment");
var middleware = require("../middleware");
//COMMENTS NEW
router.get("/new", middleware.isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){console.log(err);}
    else{res.render("comments/new", {campground: campground});}
  });
});
//COMMENTS CREATE, connects to campg, redirect to show
router.post("/", middleware.isLoggedIn, function(req,res){
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
          req.flash("success", "New commend added successfully");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});
//edit comments route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){res.redirect("back");}
    else {
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });
  
});
//update comments route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){res.redirect("back");}
    else{
      res.redirect("/campgrounds/"+ req.params.id);
    }
  });
});
//campground destroy route: /campgrounds/:id
//comment destroy route: /campgrounds/:id/comments/:comment_id
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  //findByIdAndRemove
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){res.redirect("back");}
    else{
      req.flash("success", "Comment deleted successfully!");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });  
});
//middleware


// function checkCommentOwnership(req, res, next) {
//   //is user logged in at all?
//   if (req.isAuthenticated()){
//     Comment.findById(req.params.comment_id, function(err, foundComment){
//       if(err){res.redirect("back");}
//       else{
//         // does user own the comment?
//         // cant use === or ==
//         // obj vs string
//         if(foundComment.author.id.equals(req.user._id)){
//           next();
//         } else {
//           res.redirect("back");
//         }        
//       }
//     });
//   } else{
//     console.log("U NEED TO LOGIN!");
//     res.redirect("back");
//   }
// }
module.exports = router;