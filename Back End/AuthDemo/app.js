// we have to install
// express, mongoose, body-parser, passport
// passport local, passport local mongoose
// express-mongoose  
var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    LocalStrategy         = require("passport-local"),
    User                  = require("./models/user.js"),
    passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/authdemo", { useNewUrlParser: true,useUnifiedTopology: true });
var app = express();
app.set('view engine', 'ejs');
//we can require to, but also like this too
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
  secret: "My first ever authentication",
  resave: false,
  saveUninitialized: false
}));


//This code basically sets passport up
//always use these 2 lines when setting up passport
app.use(passport.initialize());
app.use(passport.session());
//very important methods for passport
// they- read a session, taking encoded data
// 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//encoding
passport.deserializeUser(User.deserializeUser());//uncoding


app.get('/', function(req,res){
  res.render("home");
});

app.get('/secret', isLoggedin, function(req, res){
  res.render("secret");
});
//Auth Routes, will show sign-up form
app.get("/register", function(req,res){
  res.render("register");
});
//handling user sign-up
app.post("/register", function(req,res){
  req.body.username
  req.body.password
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    if(err){console.log(err); return res.render('register.ejs');}
    passport.authenticate("local")(req, res, function(){
      res.redirect("/secret");
    });
  });
});

//Login Routes, will show login form
app.get("/login", function(req,res){
  res.render("login");
});
//login logic
//middleware
app.post("/login", passport.authenticate("local",{
  successRedirect: "/secret",
  failureRedirect: "/login"
}) ,function(req,res){

});
//logout
app.get("/logout", function(req,res){
  req.logout();
  res.redirect("/");
});

function isLoggedin(req, res, next){
  if(req.isAuthenticated()){
    return next(); 
  }
  res.redirect("/login");
}
app.listen(4200, function(){
  console.log("Serving");
});