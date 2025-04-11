import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

//Imported Models
import course from '../model/course.js';

// set environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PATH = path.join(__dirname, '../view');
import {userdb, classdb} from '../database.js';
import jwt from "jsonwebtoken";

export function dashboard(req, res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);

    res.render(path.join(PATH, './user/dashboard.mustache'),acc);
});
}