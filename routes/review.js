const express = require("express");
// important topic mergeParams:true;
const router = express.Router({ mergeParams : true });
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema } = require("../schema.js")
const Review= require('../models/reviews.js');
const Listing= require('../models/listing.js');

const  {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");

const reviewcontroller = require("../controller/reviews.js")


// // ?? Reviews routes ?? // 
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewcontroller.createReview));
    
// ?? delete review route ??
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewcontroller.destroyReview));

module.exports = router;
