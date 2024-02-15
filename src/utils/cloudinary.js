import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'

cloudinary.config({ 
    cloud_name: 'dlcd3x6wb', 
    api_key:'183722957597592', 
    api_secret: 'RU_DpIzC72y6PcYVeu-lzxjQB_U'
});

// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET 
//   });

const uploadOnCloudinary=async(localpath)=>{
     
   try {
      if(!localpath)
      return null;
    //upload the file on cloudinary
    console.log("cloudinary start");
    const response=await cloudinary.uploader.upload(localpath,{
        resource_type:'auto',
    })
    //file has been uploaded successfully
    console.log("file is uploaded on cloudinary",response.url);
    fs.unlinkSync(localpath)
    return response.url;
   } catch (error) {
    console.log(error);
    fs.unlinkSync(localpath)  //remove the local save temporary file as the upload operation got failed
    return null;
   }
}
export default uploadOnCloudinary;


