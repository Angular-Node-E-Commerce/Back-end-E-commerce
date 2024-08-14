const {model, Schema} =require("mongoose");
const userSchema=new Schema({
    username:String,
    email:String,
    password:String,
    role:String,
    
    profile:{
        firstName:String,
        lastName:String,
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