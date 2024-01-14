import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import md5 from 'md5';

const app = express();


import {default as userRouter} from './src/routes/user.route.js'
import {default as mediaRouter} from './src/routes/media.route.js'

app.set('view engine', 'pug');
app.set('views', './src/views');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



app.use('/api/user',userRouter);
app.use('/api/media',mediaRouter);
const port = 3300;

app.listen(port,()=>{console.log('listening on port '+port);});