const express = require("express")
const wrapAsync=require("../utils/wrapAsync.js")
const reviewController = require("../controllers/review.js")

const ExpressError=require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")
const Review = require("../models/review.js")
const router = express.Router({mergeParams:true})
const { validatereview, isloggedin, isreviewauthor } = require("../middleware.js")


router.post("/",isloggedin , validatereview , wrapAsync(reviewController.createReview))
   router.delete("/:reviewid" ,isloggedin,isreviewauthor, wrapAsync(reviewController.destroyReview) )
module.exports=router ; 