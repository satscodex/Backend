import mongoose from "mongoose";
import Jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
const userschema=new mongoose.Schema({
      username:{
        type:String,
        required:true,
        unique:true,
        lowerCase:true,
        trim:true,
        index:true
      },
      email:{
        type:String,
        required:true,
        unique:true,
        lowerCase:true,
        trim:true,
      },
      fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
      },
      avatar:{
        type:String, //cloudinary url 
        required:true,
      },
      coverimage:{
        type:String,//cloudinary url 
      },
      watchHistory:[
          {
            type:mongoose.Schema.Types.ObjectId,
             ref:'Video'
          }
      ],
      password:{
        type:String,
        required:[true,'Password Is Required'],
      },
      refreshToken:{
        type:String,
      }
},{timestamps:true})
userschema.pre("save",async function (next){
    if(this.isModified("password"))
    this.password= await bcrypt.hash(this.password,10);
    next();
})
userschema.methods.isPasswordCorect=async function(password){
    return await bcrypt.compare(password,this.password);
}
userschema.methods.generateAccesstoken=function (){
    return Jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname

     },process.env.ACCESS_TROKEN_SECRET,{
       expiresIn:ACCESS_TOKEN_EXPIRY
     })
}
userschema.methods.generateRefreshtoken=function (){
    return Jwt.sign({
        _id:this._id,
     },process.env.ACCESS_TROKEN_SECRET,{
       expiresIn:REFRESH_TOKEN_EXPIRY
     })
}
export const User=mongoose.model('User',userschema);