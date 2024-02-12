import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET
});

const uploadOnCloudinary=async(localpath)=>{
   try {
      if(!localpath)
      return null;
    //upload the file on cloudinary
    const response=await cloudinary.uploader.upload(localpath,{
        resource_type:'auto'
    })
    //file has been uploaded successfully
    console.log("file is uploaded on cloudinary",response);
    return response;
   } catch (error) {
    fs.unlinkSync(localpath)  //remove the local save temporary file as the upload operation got failed
    return null;
   }
}
export default uploadOnCloudinary;


