const User = require("../models/user");

module.exports.renderSignUpForm = (req,res)=>{
    // res.send("form");
    res.render("users/signup.ejs")
};

module.exports.signUp = async(req,res)=>{
    try{
     let { username,email,password } = req.body;
     const newUser=   new User({email,username});
     const registerUSer= await User.register(newUser,password);
     console.log(registerUSer);
     req.login(registerUSer,(err)=>{
         if(err){
             return next(err);
         }
         req.flash("success","signUp succesfully, Welcome!");
        res.redirect("/listings");
     })
    }
    catch(e){
         req.flash("error",e.message);
         res.redirect("/signup")
    }
 }

 module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
};

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to wanderlust! ");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

}

module.exports.userLogOut = async(req,res,next)=>{
    req.logout((errors)=>{
        if(errors){
            return next(errors);
        }
        //  req.flash("success","Welcome back to wanderlust! ");
         res.redirect("/listings");
    });
   
}