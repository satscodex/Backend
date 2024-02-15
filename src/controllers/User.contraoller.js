
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { User } from "../models/User.modal.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Jwt from 'jsonwebtoken'

const registerUser=asyncHandler(async (req,res)=>{
    //get details from frontend
    //validation-not empty
    //check if user exists:username or email
    //check for images,check for avatar
    //upload them to cloudinary,avatar
    //create user object-entry in db
    //remove password and refreshtoken field from response
    //check for user creation
    //return res
    //  console.log(req.files);
    //  console.log('/n');
    //  console.log(req.body);
   
    const{fullname,username,email,password}=req.body;
    if([fullname,email,password,username].some((field)=>
       field?.trim()===""
    ))
    if(!fullname || !username || !email || !password)
    {
        throw new ApiError(400,"All Fields Are Required");
    }
   const existedUser= await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser)
    throw new ApiError(409,"User alreday Exist");
   
    //below is for multer
    
    const avatarLocalPath=req.files?.avatar[0]?.path
    const coverImageLocalPath=req.files?.coverimage?.[0]?.path
    if(!avatarLocalPath) throw new Error(401,"Avatar is Required To Proceed")
    const avatar=await uploadOnCloudinary(avatarLocalPath);
    let coverImage;   
    if(coverImageLocalPath)
     coverImage=await uploadOnCloudinary(coverImageLocalPath);
    
    const user=await User.create({
        fullname,
        avatar:avatar,
        email,
        password,
        coverimage: coverImage || "",
        username:username.toLowerCase()
    });
   const usercreated= await User.findById(user._id).select(
    "-password -refreshToken"
   );
   if(usercreated)
   return res.status(200).json(new ApiResponse(200,usercreated,"User Registered Successfully"))
   else
   throw new ApiError(500,"something went wrong while Registering")

})

const generateAccesstokenAndrefreshToken=async(userId)=>{
     try {
        const user=await User.findById(userId)
        const Accesstoken=await user.generateAccesstoken();
     const Refreshtoken=await user.generateRefreshtoken();
       user.refreshToken=Refreshtoken;
      
       await user.save({validateBeforeSave:false})
     return {Accesstoken,Refreshtoken}
     } catch (error) {
        throw new ApiError(501,"Something went wrong while generating token")
     }
}

const loginUser=asyncHandler(async (req,res)=>{

    const{username,email,password}=req.body;
   
    if((!username && !email))
    throw new ApiError(400,"please provide username or email");
   if(!password)
   throw new ApiError(400,"Please Provide Password");
    const user= await User.findOne({$or:[{email},{username}]})
    if(!user)
    throw new ApiError(404,"User Doesn't Exists")
    const validuser=await user.isPasswordCorect(password);
    if(!validuser)
    throw new ApiError(401,"Password not correct")
    const {Accesstoken,Refreshtoken}=await generateAccesstokenAndrefreshToken(user._id);
    const data=await User.findById(user._id).select("-password -refreshToken");
    const option={
        httpOnly:true,
        secure:true
    }
    return res.status(200).
    cookie("AccessToken",Accesstoken,option).
    cookie("RefreshToken",Refreshtoken,option).
    json(new ApiResponse(200,{user:data ,Accesstoken,Refreshtoken},"User LoggedIn Successfully"))
})

const logOutUser=asyncHandler(async(req,res)=>{
   
    const{user}=req.valid._id;
    // console.log(user);
    await User.findByIdAndUpdate(user,
        {
        $set:{
            refreshToken:undefined
        }
       },
       {
        new:true
       }
    )
    const option={
        httpOnly:true,
        secure:true
    }
    return res.status(200).clearCookie("AccessToken",option).clearCookie("RefreshToken",option).
    json(new ApiResponse(200,{},"Logged Out Successfully"))
})

const refreshAccessToken=asyncHandler(async (req,res)=>{
    const incomingrefreshtoken=req.cookies.RefreshToken || req.body.RefreshToken;
    if(!incomingrefreshtoken)
    throw new ApiError(401,"Unauthorized Request");
    
    const DecodedToken=await Jwt.verify(incomingrefreshtoken,process.env.REFRESH_TOKEN_SECRET);
   
    const user=await User.findById(DecodedToken?._id);
   
    if(!user)
    throw new ApiError(401,"Invalid request Token");
    if(incomingrefreshtoken!==user?.refreshToken)
    throw new ApiError(401,"Refreshtoken is expired or used")
    const {Accesstoken,Refreshtoken}=await generateAccesstokenAndrefreshToken(user._id);
    const data=await User.findById(user._id).select("-password -refreshToken");
    const option={
        httpOnly:true,
        secure:true
    }
    return res.status(200).
    cookie("AccessToken",Accesstoken,option).
    cookie("RefreshToken",Refreshtoken,option).
    json(new ApiResponse(200,{user:data ,Accesstoken,Refreshtoken},"Token Refreshed Successfully"))

})

export {registerUser,loginUser,logOutUser,refreshAccessToken};