const Listing = require("./models/listing.js")
const Review = require("./models/review.js")
const {listingschema , reviewschema}= require("./schema.js")
const ExpressError=require("./utils/ExpressError.js")
module.exports.isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.originalurl = req.originalUrl
        req.flash("error", "please login before performing this action")
        res.redirect("/login")
    }
    else { next() }

}
module.exports.saveurl = (req, res, next) => {
    if (req.session.originalurl) {
        res.locals.redirecturl = req.session.originalurl
    }
    next()
}
module.exports.isowner = async (req, res, next) => {
    let { id } = req.params
   let listing = await Listing.findById(id)
    if (!listing.owner.equals(res.locals.curruser._id)) {
        req.flash("error", " you are not permitted to perform this task")
       return res.redirect(`/listings/${id}`)
    }
    next()
}
module.exports.isreviewauthor = async (req, res, next) => {
    let { reviewid ,id } = req.params
    let  review =  await Review.findById(reviewid)
    if (!review.author._id.equals(res.locals.curruser._id)) {
        req.flash("error", " you are not permitted to perform this task")
       return res.redirect(`/listings/${id}`)
    }
    next()
}
module.exports.validatelisting = (req,res,next)=>{
    let {error} = listingschema.validate(req.body)
    if(error){
        throw new ExpressError(400,error)
    }
    else{ next() }
   
}
module.exports.validatereview = (req,res,next)=>{
    let {error} = reviewschema.validate(req.body)
    if(error){
        throw new ExpressError(400,error)
    }
    else{ next() }
   
}

 