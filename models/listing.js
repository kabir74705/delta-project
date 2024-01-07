const mongoose=require("mongoose");
const review = require("./review");
const schema = mongoose.Schema;

const listingschema = new schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
       url : String,
       filename : String
    },
    price:Number,
    location:String,
    country:String,
    reviews : [
        { 
            type: schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner : {
        type : schema.Types.ObjectId,
        ref : "User"
    },
    geometry : {
        type : {
            type : String, 
            enum : ["Point"],
            required : true

        },
        coordinates : {
            type : [Number],
            required : true
        }
    },
    category : {
        type : String,
        enum : ["Rooms","Trending","Iconiccities","Mountains","Castles","Pools","Camping","Farms","Arctic","boats"],
        required : true
    }
}) 
listingschema.post("findOneAndDelete", async(listing)=>{
    if(listing){
      await  review.deleteMany({_id : {$in : listing.reviews}})
    }
   

})
const Listing = mongoose.model("Listing",listingschema) 
module.exports= Listing;