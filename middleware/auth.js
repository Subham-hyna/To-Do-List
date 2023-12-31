const jwt = require("jsonwebtoken")
const User = require("../models/userSchema")

const auth = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token ,"iamsubhamduttahusbandogkhushiduttawholovesmemorethanme");
        const user = await User.findOne({_id:verifyUser._id});

        req.token = token;
        req.user = user;
        next();
        
    } catch (error) {
        req.flash("message","Please Login")
        res.redirect("/login");
    }

}

module.exports = auth;