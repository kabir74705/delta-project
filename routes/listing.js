const express = require("express")
const wrapAsync=require("../utils/wrapAsync.js")
const listingcontroller = require("../controllers/listing.js")
const multer = require("multer")
const {storage} = require("../cloudConfig.js") 
const upload = multer({storage})


const Listing = require("../models/listing.js")
const {isloggedin, isowner,validatelisting} = require("../middleware.js")

const router = express.Router()
router.get("/new" , isloggedin ,listingcontroller.renderNewForm)
router.get("/category/:value",listingcontroller.categorise)
router.route("/")
.get(wrapAsync(listingcontroller.index))
.post( isloggedin, upload.single("listing[image]"), validatelisting ,wrapAsync(listingcontroller.createListing))  
router.route("/:id") 
.get(wrapAsync(listingcontroller.showListing))
.put(isloggedin, isowner, upload.single("listing[image]"), validatelisting  ,wrapAsync(listingcontroller.updateListing))
.delete(isloggedin, isowner ,wrapAsync(listingcontroller.destroyListing))

router.get("/:id/edit", isloggedin, isowner ,wrapAsync(listingcontroller.renderEditForm))
    
 module.exports = router;