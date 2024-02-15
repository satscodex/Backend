
import express from "express";
import {registerUser,loginUser, logOutUser, refreshAccessToken} from "../controllers/User.contraoller.js";
import {upload} from '../middlewares/multer.middleware.js'
import { jwtToken } from "../middlewares/auth.middlware.js";
const router=express.Router();


router.post("/register", upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverimage', maxCount: 1 },
]), registerUser);

router.post("/login",loginUser)

router.post("/logout",jwtToken,logOutUser)
router.post("/refreshaccesstoken",refreshAccessToken)
export default router;
