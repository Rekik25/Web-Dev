var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cat_app", { useNewUrlParser: true,useUnifiedTopology: true });
var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

var Cat = mongoose.model("Cat", catSchema);

// var george = new Cat ({
//     name: "Norris", age: 9, temperament: "Evil"
// });


// george.save(function(err, cat){
//     if(err){
//         console.log("SOMETHING WENT WRONG!");
//     }
//     else{
//         console.log("SAVED CAT!");
//         console.log(cat);
//     }
// });

//adding a new cat to the DB
// retrieve all cats from the DB and console.log each cat

Cat.find({}, function(err, cats){
    if(err){
        console.log("OH NO, ERROR!!");
        console.log(err);
    } else{
        console.log("all the cats");
        console.log(cats);
    }
});