var moongoose   = require("mongoose");
var Campground  = require("./models/campground.js");
var Comment     = require("./models/comment");

var data = [
  {name: "Cloud's Rest", 
  image:"https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis eligendi, optio soluta tempora tenetur eum eveniet ex nulla corrupti mollitia, maxime vero, perferendis praesentium quas quibusdam dolorem! Doloribus, accusantium saepe?"
  },
  {name: "Cloud's Rest 1.1", 
  image:"https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis eligendi, optio soluta tempora tenetur eum eveniet ex nulla corrupti mollitia, maxime vero, perferendis praesentium quas quibusdam dolorem! Doloribus, accusantium saepe?"
  },
  {name: "Cloud's Rest 1.2", 
  image:"https://images.unsplash.com/photo-1475483768296-6163e08872a1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis eligendi, optio soluta tempora tenetur eum eveniet ex nulla corrupti mollitia, maxime vero, perferendis praesentium quas quibusdam dolorem! Doloribus, accusantium saepe?"
  },
]
function seedDB(){
  //remove all campgrounds
  Campground.remove({}, function(err){
    if(err){ console.log(err);}
    console.log("removed campgrounds!");
    data.forEach(function(seed){
      Campground.create(seed, function(err, campground){
        if(err){console.log(err);}
        else{
          console.log("added a campground");
          //create a comment
          Comment.create({text: "This place is great!",
                          author: "homer"
          }, function(err, comment){
            if(err){console.log(err);}
            else{
              campground.comments.push(comment);
              campground.save();
              console.log("created comment");
            }
            
          });
        }
      });
    });
  });
  // add a few campgrounds
  
  
  //add a few comments
}

module.exports = seedDB;