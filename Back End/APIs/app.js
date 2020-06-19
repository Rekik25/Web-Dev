var express = require("express");
var app = express();
var request = require("request");

app.set("view engine", "ejs");

app.get("/", function(req,res){
    res.render("search");
});
app.get("/results", function(req,res){
    var moviename= req.query.search;
    var url = "http://www.omdbapi.com/?s="+moviename+"&apikey=64bdeafd";

    request(url, (error, response, body)=> {
      //eval(require('locus'));
        console.error('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      var parsedData = (JSON.parse(body)).Search;
      //res.send(parsedData.Search[0]); // Print the HTML for the Google homepage.
        res.render("results", {data: parsedData});
    });
});

app.listen(4500, function(){
    console.log("MOVIE APP IS running...");
});