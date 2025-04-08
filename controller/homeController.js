import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import nedb from "@seald-io/nedb";

// set environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PATH = path.join(__dirname, '../view');
const PATH_DB = path.join(__dirname, '../db');
import {userdb} from '../database.js';
import jwt from "jsonwebtoken";

export function home(req, res)
{
    var data = {
        accessToken: null,
    };
    res.status(200);
    if(req.cookies && req.cookies.jwt){
        data = {
            accessToken: req.cookies.jwt,
        }
    }
    res.render(path.join(PATH, './home/index.mustache'),data);
}

export function login (req,res)
{
    res.status(200);
    if(req.cookies && req.cookies.jwt)
    {
        res.redirect('/');
    }
    res.render(path.join(PATH,'./home/login.mustache'));
}

//For testing to be changed
//TODO: Change to check user
export function loginPost(req,res)
{
    res.status(200);
    if(req.cookies && req.cookies.jwt)
    {
        res.redirect('/');
    }
    userdb.findOne({username: req.body.username}, function(err,user){
        //console.log(user);
        if(user)
        {
            if(user.password === crypto.createHash('sha256').update(req.body.password).digest('hex'))
            {
                let payload = {
                    username: user.username
                };
                let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 60});
                res.cookie("jwt", accessToken);

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

export function logoutPost(req,res)
{
    if(!req.cookies) res.redirect('/');
    res.clearCookie('jwt').status(200).redirect('/');
}