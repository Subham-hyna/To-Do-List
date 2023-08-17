const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    cpassword : {
        type  :String,
        required : true
    },
    tokens : [{
        token:{
            type : String,
            required : true
        }
    }],
    items : [{
        item: {
            type: String
        }
    }]
});

UserSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.cpassword = await bcrypt.hash(this.cpassword,10);
    }
    next();
})

UserSchema.methods.generateAuthToken = async function(){
    const token = jwt.sign({_id : this._id},process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({token : token});
    await this.save();
    return token;
}

UserSchema.methods.additems = async function(item){
    this.items = this.items.concat({item : item});
    await this.save();
}

const User = new mongoose.model("User" , UserSchema);

module.exports = User;