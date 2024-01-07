const Listing = require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); 
module.exports.index = async (req,res)=>{
    allListings= await Listing.find({})
    res.render("listings/index.ejs",{allListings})
    }

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs")
}
module.exports.showListing = async (req,res)=>{
    let {id} = req.params
    listing = await Listing.findById(id).populate({path : "reviews" , populate: {
     path : "author"
    } }).populate("owner")
    if(!listing){
     req.flash("error", "listing does not exist")
     res.redirect("/listings")
    }
    
    res.render("listings/show.ejs",{listing})
 
 }
 module.exports.createListing = async (req,res)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
        
        
    let url = req.file.path
    let filename = req.file.filename
    let listing= req.body.listing
    const newlisting=new Listing(listing)
    newlisting.owner = req.user
    newlisting.image = {url,filename}
    newlisting.geometry = response.body.features[0].geometry
    let savedlisting = await newlisting.save()
    
    req.flash("success", "new listing added")
    res.redirect("/listings")
}
module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash("error", "listing does not exist")
        res.redirect("/listings")
       }
       let originalimgurl= listing.image.url
     originalimgurl =  originalimgurl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs",{listing,originalimgurl})
}
module.exports.updateListing = async (req,res)=>{
    let {id} = req.params
    let listing =  await Listing.findByIdAndUpdate(id,req.body.listing)
    if(typeof req.file !== "undefined"){
    let url = req.file.path
    let filename = req.file.filename
    listing.image = {url,filename}
    await listing.save()
}
     req.flash("success", " listing updated")
     res.redirect(`/listings/${id}`)
 }
 module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success", "listing deleted")
    res.redirect("/listings")
}
 module.exports.categorise = async (req,res)=>{
    let {value} = req.params
    let allListings = await Listing.find({category:`${value}`})
    
    res.render("listings/index.ejs",{allListings})
    
}