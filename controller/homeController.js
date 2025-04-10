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

export function about(req, res)
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
    res.status(200);
    res.render(path.join(PATH, './home/about.mustache'), data);
}

export function showCourses(req, res)
{
    var data = {
        accessToken: null,
        courses: classdb.getAllData()
    };
    res.status(200);
    if(req.cookies && req.cookies.jwt){
        data.accessToken = req.cookies.jwt;
    }
    data.courses = classdb.getAllData()

    res.status(200);
    res.render(path.join(PATH, './home/course.mustache'), data);
}

export function showCourse(req, res)
{

    var data = {
        accessToken: null,
    };
    res.status(200);
    if(req.cookies && req.cookies.jwt){
        data = {
            accessToken: req.cookies.jwt,
            course: null,
        }
    }
    classdb.findOne({_id:req.params.id}, (err, course)=>{
        if(course == null) res.redirect('/course');
        if(err) console.log(err);
        data.course = course;
        res.status(200);
        res.render(path.join(PATH, './home/course.view.mustache'), data);
    })
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
//TODO: Change to check user/ Validating user details
export function loginPost(req,res)
{
    res.status(200);
    //check if user is logged in,
    if(req.cookies && req.cookies.jwt)
    {
        res.redirect('/');
    }
    userdb.findOne({username: req.body.username}, function(err,user){
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
    //final check to ensure there are cookies registered to the user
    //TODO: check if the cookie 'jwt' does not exist first
    if(!req.cookies) res.redirect('/');
    res.clearCookie('jwt').status(200).redirect('/');
}