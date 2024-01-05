const mongoose=require("mongoose")
const schema = mongoose.Schema;
 
const reviewschema = new schema({
    comment : String,
    rating : {
        type : Number,
        min : 1,
        max : 5
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    author : {
        type : schema.Types.ObjectId,
        ref: "User"
    }

})
module.exports = mongoose.model("Review",reviewschema)
