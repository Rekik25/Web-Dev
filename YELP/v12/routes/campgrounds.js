var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
//here, you could have written ../middleware/index.js
//but, index   .js is always automatically require
// the contents of index.js
//
//index-shows all campgrounds
router.get("/", function(req, res){
  //get campgrounds from db
  Campground.find({}, function(err, allcampgrounds){
     if(err){console.log(err);}
     else{res.render("campgrounds/index.ejs",{data:allcampgrounds});}
  });
 //
}); 
//create route
router.post("/", middleware.isLoggedIn,  function(req, res){
  var name_ret = req.body.name;
  var image_ret = req.body.image;
  var desc_ret = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newObj= {name: name_ret, image: image_ret, description: desc_ret, author: author};
  console.log(req.user);
  Campground.create(newObj,function(err,campground){
      if(err){console.log(err);}
      else{
        console.log(campground);
        res.redirect("/campgrounds");
      }
  });
 //get data from form and add to campgrounds array
 //redirect back to /campgrounds page 
 //res.redirect("/campgrounds"); //default as get request
});
//new - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
 res.render("campgrounds/new.ejs");
});
//SHOW- shows more info about one campground
router.get("/:id", function(req, res){
 var id = req.params.id;
 Campground.findById(id).populate("comments").exec(function(err,foundCampground){
     if(err){console.log(err);}
     else {
         console.log(foundCampground);
         res.render("campgrounds/show.ejs",{campground: foundCampground});
     }
 });    
}); 
//EDIT CAMPGROUND
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
  
  // does user own the campground?
  Campground.findById(req.params.id, function(err, foundCampground){
    res.render("campgrounds/edit", {campground: foundCampground});
  });
  
});
//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  //find and update the campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){res.redirect("/campgrounds");}
    else {
      res.redirect("/campgrounds/"+req.params.id)
    }
  })
});
//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
  //find and update the campground
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){res.redirect("/campgrounds");}
    else {
      res.redirect("/campgrounds/");
    }
  });
});

// function checkCampgroundOwnership(req, res, next) {
//   //is user logged in at all?
//   if (req.isAuthenticated()){
//     Campground.findById(req.params.id, function(err, foundCampground){
//       if(err){res.redirect("back");}
//       else{
//         // does user own the campground?
//         // cant use === or ==
//         // obj vs string
//         if(foundCampground.author.id.equals(req.user._id)){
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