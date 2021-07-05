var mongoose = require("mongoose")

//SCHEMA setup
var campgroundSchema = new mongoose.Schema({
	 name: String, 
	 price: String, 
	 image: String,
	 imageId: String, 
	 description: String, 
	 createdAt: { type: Date, default: Date.now }, 
	 author: {
     id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String, 
	  firstName: String	 
      },
	 comments: [
      {   //array of COMMENTS ids
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
      ], 
	 likes: [
       {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
       }
      ]
});

//make the model(it has its own methods which is useful) of SCHEMA and store it in Campground variable

module.exports = mongoose.model("Campground", campgroundSchema);   //to return the schema to app js file
