if(process.env.NODE_ENV != "production"){
require('dotenv').config()
}
const dburl = process.env.ATLASDB_URL



const express= require("express")
const mongoose=require("mongoose")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const methodOverride=require("method-override")
const app = express()
const path = require("path")
const ExpressError=require("./utils/ExpressError.js")
const ejsMate=require("ejs-mate")
app.use(methodOverride("_method")) 
app.use(express.urlencoded({extended:true}))
const passport=require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")


app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname,"public")))
const listingsrouter = require("./routes/listing.js")
const reviewsrouter = require("./routes/review.js")
const userrouter = require("./routes/user.js")
const flash = require("connect-flash")
const store = MongoStore.create({
    mongoUrl : dburl,
    crypto : {
        secret: process.env.SECRET
    },
    touchAfter : 24*3600
}) 

const sessionoptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires : Date.now()+7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpsOnly : true
    }
}
app.get("/",(req,res)=>{
    res.redirect("/listings")
})

app.use(session(sessionoptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


async function main() {
    await mongoose.connect(dburl);
 }


app.listen(8080,()=>{
    console.log("listening") 
 }) 


main().then(()=>{
    console.log("kabir")
})
.catch(err => console.log(err));
app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.curruser = req.user
    next()
})

app.use("/listings",listingsrouter)
app.use("/listings/:id/reviews",reviewsrouter)
app.use("/",userrouter)



app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})
app.use((err,req,res,next)=>{
   let {status=500,message}=err;
   res.status(status).render("listings/error.ejs",{message})
   
})


