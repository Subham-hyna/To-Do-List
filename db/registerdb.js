const mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/registerDB")
mongoose.connect(process.env.DB)
.then(()=>{console.log("Database Connection Successful")})
.catch((err) => console.log(err))