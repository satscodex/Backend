import dotenv from 'dotenv';
dotenv.config();
import ConnectDB from './db/index.js'
import { app } from './app.js';
//db connection
ConnectDB().then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running on the port ${process.env.PORT}`);
    })
}).catch((err) => {
    console.log(err);
})






// (async()=>{
//   try {
//     await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`)

//   } catch (error) {
//     console.log("Db is not conncetd ",error);
//   }
// })()