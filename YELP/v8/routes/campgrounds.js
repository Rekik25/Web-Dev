var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
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
router.post("/", isLoggedIn,  function(req, res){
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
router.get("/new", isLoggedIn, function(req, res){
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
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}
module.exports = router;