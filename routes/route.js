const express = require("express");
const router = express.Router();
const User = require("../models/userSchema")
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const userPresent = require("../middleware/userPresent");
const jwt = require("jsonwebtoken");

router.get("/",userPresent,(req,res) => {
    res.render("list.ejs",{
        name : req.user.name,
        newListItems : req.user.items
    });
})

router.get("/home",(req,res) => {
    res.render("home.ejs");
})

router.get("/login",(req,res)=>{
    const message = req.flash("message");
    res.render("login.ejs",{
        message
    });
})

router.get("/register",(req,res)=>{
    const message = req.flash("message");
    res.render("register.ejs",{
        message
    });
})

router.get("/logout",auth,async(req,res)=>{
    res.clearCookie("jwt");
    req.user.tokens = req.user.tokens.filter((currElem) => {
        return req.token != currElem.token;
    })
    await req.user.save();
    res.redirect("/login");
})

router.post("/register", async (req,res)=>{
    const {name , email , password , cpassword} = req.body;
    
    if(!name || !email || !password || !cpassword){
        req.flash("message" , "Please fill all the Credentials");
        return res.redirect("/register");
    }

    try {
        const userExist = await User.findOne({email : email});

        if(userExist){
            req.flash("message" , "User Already Exists. Please Login");
            return res.redirect("/login");
        }

        if(password != cpassword){
            req.flash("message" , "Passwords not matching");
            return res.redirect("/register");
        }

        const newUser = new User({
            name , 
            email , 
            password , 
            cpassword
        })

        await newUser.save();

        res.redirect('/login');
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post("/login",async (req,res) => {
    const {email , password} = req.body;
    if(!email || !password){
        req.flash("message" , "Please fill all the Credentials");
        return res.redirect("/login");
    }

    try {
        const userLogin = await User.findOne({email : email});

        if(!userLogin){
            req.flash("message" , "Invalid Credentials");
            return res.redirect("/login");
        }

        const isMatch = await bcrypt.compare(password , userLogin.password);

        if(!isMatch){
            req.flash("message" , "Invalid Credentials");
            return res.redirect("/login");
        }

        const token = await userLogin.generateAuthToken();

        res.cookie("jwt",token,{
            expires : new Date(Date.now() + 90000000),
            httpOnly : true
        })
        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

router.post("/addItem",auth,async(req,res)=>{
    const newItem = req.body.newItem;
    await req.user.additems(newItem);
    res.redirect("/");
})

router.post("/deleteItem",auth,async(req,res)=>{
    req.user.items = req.user.items.filter((currElem) => {
        return req.body.checkbox != currElem._id;
    })

    await req.user.save();
    res.redirect("/");
})

module.exports = router;