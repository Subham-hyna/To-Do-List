const mongoose = require("mongoose")

const ListSchema = new mongoose.Schema({
    list:{
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true
    }
});

const List = new mongoose.model("List" , ListSchema);

module.exports = List;