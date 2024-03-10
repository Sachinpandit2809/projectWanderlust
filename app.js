if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing= require('./models/listing.js');
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema } = require("./schema.js")
const Review= require('./models/reviews.js');

// const {reviewSchema} = require("./schema.js")

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require("connect-mongo")
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const user = require("./models/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
//taki jo bhi data hamre request se aaye o parse ho pYE
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const database = process.env.ATLAS;
// const database1 = `mongodb+srv://userSachin2809:user2809@cluster0.sdwvxkm.mongodb.net/`
main().then(()=>{
    console.log ("connected to database");
}).catch((err)=>{
    console.log(`error in database ${err}`);
});

async function main(){
    await mongoose.connect(database);
}
const store = MongoStore.create({
    mongoUrl : database,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 * 3600,
});
store.on("error",()=>{
    console.log("ERROR in MONGO Session STORE Errr",err);
})

const sessionOptions = {
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized : true,
    cookie:{
        expires:Date.now()+ 7 * 24 *60 * 60 * 1000,
        maxAge:7 * 24 *60 * 60 * 1000,
        httpOnly:true,
    }
};




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// const validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
   
//     if(error){
//         let errMsg = error.details.map((el)=>el.message).join(" , ");
//      throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// };

// const validateReview = (req,res,next)=>{
//     let {error} = reviewSchema.validate(req.body);
   
//     if(error){
//         let errMsg = error.details.map((el)=>el.message).join(" , ");
//      throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// };

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser= req.user;
    // console.log(res.locals.success);
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:  "student@gmail.com",
//         username: "delta-student"
//     });

//    let resisterUser= await  User.register(fakeUser,"helloworld");
//    res.send(resisterUser)
// })

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);








app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"))
})
app.use((err,req,res,next)=>{
    let {statusCode = 500,message="some thing went wrong "} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{err})
})






app.listen(8080,()=>{
    console.log("server has been started ..");
});