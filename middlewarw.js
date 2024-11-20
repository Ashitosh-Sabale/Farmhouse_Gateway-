
module.exports.isloggedIn = (req,res, next) =>{
    if(!req.isAuthenticated()){ //authr=enticate user login for use of website
        req.flash("error","for create new listing you need logged in");
        return res.redirect("/login");
    }
    next();
}