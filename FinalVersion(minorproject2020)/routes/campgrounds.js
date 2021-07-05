//====================
//ROUTES//
//====================
var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");

var middleware = require("../middleware");
// MULTER setup from line 9 to 23
var request = require("request");
var multer = require('multer');

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
// store selected file in uplouad
var upload = multer({ storage: storage, fileFilter: imageFilter})
////

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: process.env.APINAME, 
  api_key: process.env.APIKEY, 
  api_secret: process.env.APISECRET
});
// nVJz-pLHiaLsK0SwvPvRxysjzGI


// INDEX - show the campgrounds
router.get("/", middleware.isLoggedIn, function(req, res){
	var noMatch = null;
    if(req.query.search) {
		//checking and storing search entry in regex variablr
        var regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Campground.find({name: regex}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              if(allCampgrounds.length < 1) {
                  noMatch = "No post match that query, please try again.";
              }
              res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
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


// CREATE - add new campgrounds to database
router.post("/", middleware.isLoggedIn, upload.single('image'), async function(req, res){
	//next line will upload the image to cloudinary
 cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      if(err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      // add cloudinary url for the image to the campground object under image property
      req.body.campground.image = result.secure_url;
      // add image's public_id to campground object
      req.body.campground.imageId = result.public_id;
      // add author to campground
      req.body.campground.author = {
        id: req.user._id,
        username: req.user.username
      }
      Campground.create(req.body.campground, function(err, campground) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/campgrounds/' + campground.id);
      });
    });
});

	// // get data from form and add to campgrounds array
	// var name = req.body.name;
	// var price = req.body.price;
	// var image = req.body.image;
	// var desc = req.body.description;
	// var author = {
	// id: req.user._id,
	// username: req.user.username
	// }
	// var newCampground = {name: name, price:price,  image: image, description: desc, author: author}
	// // Create a new campground and save to DB
	// Campground.create(newCampground, function(err, newlyCreated){
	// if(err){
	// console.log(err);
	// } else {
	// //redirect back to campgrounds page
	// res.redirect("/campgrounds");
	// }
	// });
    // });

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn,  function(req, res){
   res.render("campgrounds/new"); 
});



// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments likes").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})


// Campground LIKE Route
router.post("/:id/like", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
            return res.redirect("/campgrounds");
        }

        // check if req.user._id exists in foundCampground.likes
        var foundUserLike = foundCampground.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundCampground.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundCampground.likes.push(req.user);
        }

        foundCampground.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/campgrounds");
            }
            return res.redirect("back");
			 // + foundCampground_id
        });
    });
});


// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership,  function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, upload.single('image'),  function(req, res){
	 Campground.findById(req.params.id, async function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");                 //ASYNc is used to use try and await keywords
        } else {
			
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(campground.imageId);// AWAIT will stop the code for execution of respective line
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  campground.imageId = result.public_id;// id of image stord in cloudinary
                  campground.image = result.secure_url;// url of image stroe in cloudinay
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            campground.name = req.body.name;
            campground.description = req.body.description;
            campground.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
});
  
// 	//     // find and update the correct campground
//     Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
//        if(err){
//            res.redirect("/campgrounds");
//        } else {
//            //redirect somewhere(show page)
//            res.redirect("/campgrounds/" + req.params.id);
//        }
//     });
// });


// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership,  function(req, res){
 Campground.findById(req.params.id, async function(err, campground) {
    if(err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
        await cloudinary.v2.uploader.destroy(campground.imageId);
        campground.remove();
        req.flash('success', 'Campground deleted successfully!');
        res.redirect('/campgrounds');
    } catch(err) {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
    }
  });
});
	//    Campground.findByIdAndRemove(req.params.id, function(err){
//       if(err){
//           res.redirect("/campgrounds");
//       } else {
//           res.redirect("/campgrounds");
//       }
//    });
// });



module.exports = router;

