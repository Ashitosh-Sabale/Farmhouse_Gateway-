if (process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const Review = require("./models/review.js");
const session = require("express-session");

const flash = require('connect-flash');
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");    


const sessionOption ={
    secret: "mysupersecretcode",
    resave: false,     
    saveUninitialized: true,
    cookie : {
        expire: Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
    },
};

app.use(session(sessionOption));
app.use(flash());

//for passport
app.use(passport.initialize());
app.use(passport.session());  //use for user do login ine time use move on diifernt page
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());







const MONGO_URL = 'mongodb://localhost:27017/FARMHOUSE';
main()
  .then (() => {
    console.log("connected to DB");
 })
 .catch ((err) =>{
    console.log(err);
 });


async function main() {
    await mongoose.connect(MONGO_URL)

}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req,res) => {
    res.send("working");
});
// ----------------------------------------------------------------------------------
app.use((req,res,next) =>{
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   next();
});


// ----------------------------------------------------------------------------------
// This is for import listing code from .routes/listings

app.use("/listings",listingsRouter);
app.use("/listings/:id/review",reviewsRouter);
app.use("/", userRouter);



// // ----------------------------------------------------------------------------------
// // review route
// // post route
// app.post("/listings/:id/review", async(req,res) =>{
//  let listing =  await Listing.findById(req.params.id);
//  let newReview = new Review(req.body.review);

//  listing.review.push(newReview);
//  await newReview.save();
//  await listing.save();
//  res.redirect(`/listings/${listing._id}`);
// });




app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error details to the console
    res.status(500).send("Something went wrong! Please try again later.");
});

app.listen(8080, () => {
    console.log("server is listening port 8080");
});