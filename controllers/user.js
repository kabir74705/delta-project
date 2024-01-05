const User = require("../models/user.js")
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs")
    }
module.exports.signup = async(req,res)=>{
    try{
     let {username , email , password}= req.body
    const newuser =  new User({username , email})
    let registereduser = await User.register(newuser,password)
    console.log(registereduser)
    req.login(registereduser,(err)=>{
     if(err){next(err)}
     req.flash("success", "welcome")
     res.redirect("/listings")
 
    })
  
    } catch(e){ 
     req.flash("error", e.message)
     res.redirect("/signup")
    }
 }
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
    }
module.exports.login = async (req,res)=>{
    req.flash("success", "successfully logged in")
    let redirecturl = res.locals.redirecturl || "/listings"
    res.redirect(redirecturl)
    
}
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){next(err)}
        req.flash("success", "you logged out")
        res.redirect('/listings')
    })
}
 