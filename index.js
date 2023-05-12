import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import md5 from 'md5';

const app = express();


import {default as userRouter} from './src/routes/user.route.js'

app.set('view engine', 'pug');
app.set('views', './src/views');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const password = 'trongdat1335'
const hashPassword=md5(password);
console.log(password);
console.log(hashPassword);
console.log(md5('trongdat1335'));




app.use('/auth',userRouter);
const port = 3300;

app.listen(3300,()=>{console.log('listening on port '+port);});