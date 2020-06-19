var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground.js"),
    Comment = require("./models/comment.js"),
    //User = require("./models/user");
    seedDB = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v4", { useNewUrlParser: true,useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");
//SCHEMA SETUP


var campgrounds= [
    {name:"salmon reek",image:"https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}, 
    {name:"salmon reek",image:"https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},     
    {name:"granite hills",image:"https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name:"granite hills",image:"https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name:"granite hills",image:"https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name:"mt. fauji",image:"https://images.unsplash.com/photo-1475483768296-6163e08872a1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name:"mt. fauji",image:"https://images.unsplash.com/photo-1475483768296-6163e08872a1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name:"mt. fauji",image:"https://images.unsplash.com/photo-1475483768296-6163e08872a1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}
    ];
app.get("/", function(req, res){
    res.render("landing.ejs");
});
app.get("/campgrounds", function(req, res){
     //get campgrounds from db
     Campground.find({}, function(err, allcampgrounds){
        if(err){console.log(err);}
        else{res.render("campgrounds/index.ejs",{data:allcampgrounds});}
     });
    //
});
app.post("/campgrounds", function(req, res){
    var name_ret = req.body.name;
    var image_ret = req.body.image;
    var desc_ret = req.body.description;
    var newObj= {name: name_ret, image: image_ret, description: desc_ret};
    Campground.create(newObj,function(err,campground){
        if(err){console.log(err);}
        else{res.redirect("/campgrounds");}
    });
    //get data from form and add to campgrounds array
    //redirect back to /campgrounds page 
    //res.redirect("/campgrounds"); //default as get request
});
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new.ejs");
});

app.get("/campgrounds/:id", function(req, res){
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err,foundCampground){
        if(err){console.log(err);}
        else {
            console.log(foundCampground);
            res.render("campgrounds/show.ejs",{campground: foundCampground});
        }
    });    
});
// ========================
// COMMENTS ROUTES
// ========================
app.get("/campgrounds/:id/comments/new", function(req,res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){console.log(err);}
    else{res.render("comments/new", {campground: campground});}
  });
});
//create new comment, connect to campg, redirect to show
app.post("/campgrounds/:id/comments", function(req,res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){console.log(err);res.redirect("/campgrounds");}
    else{
      console.log(req.body.comment);
      Comment.create(req.body.comment, function(err, comment){
        if(err){console.log(err);}
        else{
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});


app.listen(5000, function(){
    console.log("YELP has started...");
})