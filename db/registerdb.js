const mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/registerDB")
mongoose.connect("mongodb+srv://subhamdutta:subham@cluster0.vrb602n.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{console.log("Database Connection Successful")})
.catch((err) => console.log(err))