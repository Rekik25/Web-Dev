var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
var campgrounds= [
    {name:"salmon reek",image:"https://pixabay.com/get/57e8d1454b56ae14f1dc84609620367d1c3ed9e04e507440752a7ddc934bc0_340.jpg"},
    {name:"salmon reek",image:"https://pixabay.com/get/57e8d1454b56ae14f1dc84609620367d1c3ed9e04e507440752a7ddc934bc0_340.jpg"},
    {name:"salmon reek",image:"https://pixabay.com/get/57e8d1454b56ae14f1dc84609620367d1c3ed9e04e507440752a7ddc934bc0_340.jpg"},
    {name:"granite hills",image:"https://pixabay.com/get/50e9d4474856b10ff3d8992ccf2934771438dbf852547849702973d09148_340.jpg"},
    {name:"granite hills",image:"https://pixabay.com/get/50e9d4474856b10ff3d8992ccf2934771438dbf852547849702973d09148_340.jpg"},
    {name:"granite hills",image:"https://pixabay.com/get/50e9d4474856b10ff3d8992ccf2934771438dbf852547849702973d09148_340.jpg"},
    {name:"mt. fauji",image:"https://pixabay.com/get/50e9d4474856b10ff3d8992ccf2934771438dbf852547849702973d09148_340.jpg"},
    {name:"mt. fauji",image:"https://pixabay.com/get/50e9d4474856b10ff3d8992ccf2934771438dbf852547849702973d09148_340.jpg"},
    {name:"mt. fauji",image:"https://pixabay.com/get/50e9d4474856b10ff3d8992ccf2934771438dbf852547849702973d09148_340.jpg"}
];
app.get("/", function(req, res){
    res.render("landing.ejs");
});
app.get("/campgrounds", function(req, res){
    
    res.render("campgrounds.ejs",{data:campgrounds});
});
app.post("/campgrounds", function(req, res){
    var name_ret = req.body.name;
    var image_ret = req.body.image;
    var newObj= {name: name_ret, image: image_ret};
    campgrounds.push(newObj);
    //get data from form and add to campgrounds array
    //redirect back to /campgrounds page 
    res.redirect("/campgrounds"); //default as get request
});
app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});
app.listen(5000, function(){
    console.log("YELP has started...")
})