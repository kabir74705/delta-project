const Listing = require("../models/listing.js")
const Review = require("../models/review.js")
module.exports.createReview = async (req,res)=>{
    let listing = await Listing.findById(req.params.id)
    let newreview = new Review(req.body.review)
    newreview.author = req.user._id
    listing.reviews.push(newreview)
    await newreview.save()
    await listing.save()

    req.flash("success", "new review added")
    res.redirect(`/listings/${listing._id}`) 
   }
module.exports.destroyReview = async (req,res)=>{
    let{id,reviewid} = req.params
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewid} })
    await Review.findByIdAndDelete(reviewid)
    req.flash("success", "review deleted")
    res.redirect(`/listings/${id}`)
}