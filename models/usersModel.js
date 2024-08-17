const { types } = require("joi");
const {model, Schema} =require("mongoose");
const userSchema=new Schema({
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    role:String,
    
    profile:{
        firstName:{
            type: String,
            required: true,
        },
        lastName:{
            type: String,
            required: true,
        },
        address:{
            country:String,
            city:String,
            street:String,
        }
    },
    
},{
    timestamps:true
})

const user=model("User",userSchema);

module.exports=user;