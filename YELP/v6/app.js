var express     = require("express"),
    app         = express(),
    passport    = require("passport"),
    LocalStrategy= require("passport-local"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground.js"),
    Comment = require("./models/comment.js"),
    User = require("./models/user");
    seedDB = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v6", { useNewUrlParser: true,useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");
//PASSPORT CONFIG
app.use(require("express-session")({
  secret:"my 2nd secret!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
  res.locals.currentUser = req.user; next();
});

var campgrounds= [
    {name:"salmon reek",image:"https://images.unspla sh.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}, 
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
     console.log(req.user);
     Campground.find({}, function(err, allcampgrounds){
        if(err){console.log(err);}
        else{res.render("campgrounds/index.ejs",{data:allcampgrounds, currentUser: req.user});}
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
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){console.log(err);}
    else{res.render("comments/new", {campground: campground});}
  });
});
//create new comment, connect to campg, redirect to show
app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
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

//AUTH ROUTES
//show register form
app.get("/register", function(req,res){
  res.render("register");
});
//signup logic
app.post("/register", function(req,res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){console.log(err); return res.render("register");}
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    })
  })
});
//show login form
app.get("/login", function(req,res){
  res.render("login");
});
//login logic
app.post("/login", passport.authenticate("local", 
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),  function(req,res){
});
//logout route
app.get("/logout", function(req,res){
  req.logout();
  res.redirect("/campgrounds");
});
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}
app.listen(5000, function(){
    console.log("YELP has started...");
})