import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const ConnectDb=async()=>{
    
    try {
        const connection=await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`)
        console.log('\n MongoDB connected');
    } catch (error) {
        console.log("MongooseDb is not connected",error);
        process.exit(1)
    }
}
export default ConnectDb;