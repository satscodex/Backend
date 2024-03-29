import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
const app=express();

const corsoption={
    origin: process.env.CORS_ORIGIN,
    Credential:true
}
app.use(cors(corsoption))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//import Routes
import router from './routes/user.routes.js';
app.use('/api/v1/users',router);
export {app}