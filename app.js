const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config({path : "./config.env" });
require('./db/registerdb')
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT;
const session = require("express-session");
const flash = require("connect-flash")


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: "secret",
    cookie: {maxAge : 2000},
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(require("./routes/route"));

app.listen(PORT , ()=>{
    console.log(`Server connected at port ${PORT}`);
})