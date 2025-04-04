import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import nedb from "nedb";

// set environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PATH = path.join(__dirname, '../view');
const PATH_DB = path.join(__dirname, '../db');
import {userdb} from '../database.js';

export function home(req, res)
{
    res.status(200);
    res.render(path.join(PATH, './home/index.mustache'));
}

export function login (req,res)
{
    res.status(200);
    res.render(path.join(PATH,'./home/login.mustache'));
}

//For testing to be changed
//TODO: Change to check user
export function loginPost(req,res)
{
    res.status(200);
    userdb.findOne({username: req.body.username}, function(err,user){
        if(user)
        {
            if(user.password === crypto.createHash('sha256').update(req.body.password).digest('hex'))
            {
                res.render(path.join(PATH, './user/dashboard.mustache'),user);
            }
        }else{
            let data = {
                fullname: "[!!] Error, could not get user",
            }
            res.render(path.join(PATH, './user/dashboard.mustache'),data);
        }
    });
}