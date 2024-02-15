import { User } from "../models/User.modal.js";
import { ApiError } from "../utils/apierror.js";
import Jwt from 'jsonwebtoken'
export const jwtToken = async (req, res, next) => {
  try {
    const token = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized Request")
    }
    const verified = await Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(verified?._id).select("-password -refreshToken");
    if (!user) {
      //next_video:discuss about frontend
      throw new ApiError(401, "Invalid User");
    }
    //this valid is our own set to use this midddle ware
    req.valid = user;
    next();
  } catch (error) {
    res.status(401).json(new ApiError(401,error.message))
  }
  

}