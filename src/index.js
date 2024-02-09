import dotenv from 'dotenv';
dotenv.config();

import express from 'express'
import ConnectDB from './db/index.js'

//db connection
ConnectDB()






// (async()=>{
//   try {
//     await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`)

//   } catch (error) {
//     console.log("Db is not conncetd ",error);
//   }
// })()