var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var middleware = require("../middleware");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto"); 


router.get("/", function(req, res){
	res.render("landing");
})

//======================
//AUTH ROUTES
//======================

//show REGISTER form
router.get("/register", function(req, res){
	res.render("register", {page: 'register'})
})

//handlin user SIGNUP
router.post("/register", function(req, res){
	  //in the NEXT line we store the USERNAME not PASSWORD in the NEWLY created USER,  because PASSWORD is stored in the form of HASH or SOME code
	var newUser = new User({
		username: req.body.username, 
		firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
		 });
	//ADMIN setup
	if(req.body.adminCode === 'deadshot') {
      newUser.isAdmin = true;
    }
	
	  User.register(newUser, req.body.password, function(err, user){
        if(err){
             req.flash("error", err.message);
            return res.redirect('register');
        }
		  //this line will run the AUTHANTICATION process LOG the USER in , here in place of LOCAL we can add FB twitter and GOOGLE etc .
        passport.authenticate("local")(req, res, function(){
			req.flash("success", "Successfully Signed Up! Nice to meet you " + user.username);
           res.redirect("/campgrounds");
        });
    });
})

//show LOGIN form
router.get("/login", function(req, res){
	res.render("login", {page: 'login'});
})
//handeling LOGIN logic
//app.post("/login,  AUTHENTICATION middleware, callback function)
//middleware - those function happen between start and end of the routes
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) ,function(req, res){
});

//logout handling
router.get("/logout", function(req, res){
    req.logout();
	 req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

//middleware to check if the user is logged in and then shoow him the SECRET padge
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
//==================
// USER PROFILE
//================
router.get("/users/:id", isLoggedIn, async function(req, res) {
	
  User.findById(req.params.id, function(err, foundUser) {
    if(err) {
      req.flash("error", "Something went wrong.");
      return res.redirect("/");
    }
	 Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds) {
	 if(err) {
	 req.flash("error", "Something went wrong.");
	 return res.redirect("/");
	 }
	 res.render("users/show", {user:foundUser, campgrounds: campgrounds});
	 })
   
  });
});

// SEARCH RESULT of USER
router.get("/users", isLoggedIn, function(req, res){
	var noMatch = null;
    if(req.query.search) {
        var regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        User.find({username: regex}, function(err, allUsers){
           if(err){
               console.log(err);
           } else {
              if(allUsers.length < 1) {
                  noMatch = "No User found, please try again.";
              }
              res.render("users/index",{users:allUsers, noMatch: noMatch});
		   }
        });
		
    } //if someone doesnot input any SEARCH
	else {
        // Get all campgrounds from DB
        Campground.find({}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
           }
        });
    }
	
})
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


// EDIT user profile ROUTE
router.get("/users/:id/edit", middleware.checkAccountOwnership,  function(req, res){
    User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
		} else{
			 res.render("users/edit" , {user: foundUser});
		}
    });
});

// UPDATE user profile ROUTE
router.put("/users/:id", function(req, res){
	 User.findByIdAndUpdate(req.params.id, req.body.user, function(err, user){
		  if(err){
			req.flash("error", err.message);  
           res.redirect("back");
       } else {
           //redirect somewhere(show page)
           res.redirect("/users/" + req.params.id);
       }
	 });
});



//=====================
// forgot password
//======================
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'minorproject06@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'minorproject06@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'minorproject06@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'minorproject06@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/campgrounds');
  });
});





module.exports = router;