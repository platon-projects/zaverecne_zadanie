import express from 'express';
import sessions from "express-session";
import nunjucks from 'nunjucks';
import FileStore from 'session-file-store';
import cookieParser from 'cookie-parser';

import dotenv from "dotenv";

import {IndexController} from "./controllers/IndexController.js";
import {UserController} from "./controllers/UserController.js";
// import {PostController} from "./controllers/PostController.js";

// require('dotenv').config();
dotenv.config();
const app = express();
app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.use(sessions({
    name: "moje.session.id",
    secret: "tajne-heslo",
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        SameSite: 'None',
    },
    resave: false,
    //store:  new (FileStore(sessions))({ // ukladanie session dat do suboru (nefunguje dobre vo Windows)
    //     path: 'sessions'
    //}),
    store: new (FileStore(sessions))({}),

}));


// let nunjucksEnv = initNunjucksEnv(app);

app.use(cookieParser());

app.use('/', IndexController);
app.use('/user', UserController);
// app.use("/post", PostController);

let server = app.listen(3001, () => console.log(`Server počúva na adrese http://localhost:${server.address().port}`));