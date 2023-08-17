const jwt = require("jsonwebtoken")
const User = require("../models/userSchema")

const userPresent = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token , process.env.SECRET_KEY);
        const user = await User.findOne({_id:verifyUser._id});

        req.token = token;
        req.user = user;
        next();
        
    } catch (error) {
        res.redirect("/home");
    }

}

module.exports = userPresent;