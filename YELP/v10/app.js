var express     = require("express"),
    app         = express(),
    passport    = require("passport"),
    LocalStrategy= require("passport-local"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    methodOverride= require("method-override"),
    Campground  = require("./models/campground.js"),
    Comment     = require("./models/comment.js"),
    User        = require("./models/user");
    seedDB      = require("./seeds"),
    // requiring routes
    commentRoutes     = require("./routes/comments"),
    campgroundRoutes  = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");

//seedDB();// seed the database
mongoose.connect("mongodb://localhost/yelp_camp_v6", { useNewUrlParser: true,useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
//passport config
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

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use(indexRoutes);

app.listen(5000, function(){
    console.log("YELP has started...");
})