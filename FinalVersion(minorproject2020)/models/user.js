var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = mongoose.Schema({
	username: String, 
	password : String, 
	avatar: String,
    firstName: String,
    lastName: String,
	about: String, 
    email: {type: String, unique: true, required: true}, 
	 resetPasswordToken: String,
     resetPasswordExpires: Date,
	isAdmin: {type: Boolean, default: false}, 
	
})

UserSchema.plugin(passportLocalMongoose);  //to import the methods of LOCAL-MONGOOSE to our userschema
module.exports = mongoose.model("User", UserSchema);