const express = require("express");
const router = express.Router();
const Listing= require('../models/listing.js');
const wrapAsync=require("../utils/wrapAsync.js");
//const ExpressError=require("../utils/ExpressError.js");
//const {listingSchema,reviewSchema } = require("../schema.js")
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controller/listings.js");

// reviewSchema is a joy schema which is not necessary

const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage});


router.route("/")
    .get(isLoggedIn,wrapAsync( listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createNewListing)
    );
    

  

// ?? index route ?? //
//router.get("/",isLoggedIn,wrapAsync( listingController.index));

// ?? new route ??
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
    .get(isLoggedIn,wrapAsync(listingController.showListing))
    
    .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))
    
    .delete(isLoggedIn,isOwner,
    wrapAsync(listingController.destroyListing));




// edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing));
    
//  searchfunction
router.post("/search",
isLoggedIn,
wrapAsync( listingController.showSearchListing)  ) ;


module.exports = router;

// // ?? show route ?? .//
// router.get("/:id",isLoggedIn,wrapAsync(listingController.showListing));

// // ?? create route//
// router.post("/",isLoggedIn,
// validateListing,
// wrapAsync(listingController.createNewListing));

// // update route
// router.put("/:id",
//     isLoggedIn,
//     isOwner,
//     validateListing,
//     wrapAsync(listingController.updateListing));

// // ?? delete route ??
// router.delete("/:id",
//     isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.deleteListing));
