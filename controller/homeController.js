import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

//Imported Models
import course from '../model/course.js';
import user from '../model/user.js';

// set environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PATH = path.join(__dirname, '../view');
import {userdb, classdb, userClassesdb} from '../database.js';
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
        accessToken: null
    };
    res.status(200);
    if(req.cookies && req.cookies.jwt){
        data = {
            accessToken: req.cookies.jwt,
            course: null,
            count: null,
            full: false,
            alreadyRegistered: false,
        }
    }
    userClassesdb.count({courseid:req.params.id}, (err, count)=> {
        classdb.findOne({_id:req.params.id}, (err, course)=>{
            if(course == null) return res.redirect('/course');
            if(err) console.log(err);

            //is there a cookie with the accounts accesstoken?
            if(data.accessToken){
                var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
                userClassesdb.findOne({userid:accessToken._id, courseid:req.params.id}, (err, acc) =>{
                    data.alreadyRegistered = acc != null; // checks if account is already registered to this course
                    data.course = course;
                    data.count = count;
                    data.full = count >= course.maxSize;
                    res.status(200);
                    return res.render(path.join(PATH, './home/course.view.mustache'), data);
                });
            }else{
                data.course = course;
                data.count = count;
                data.full = count >= course.maxSize;
                res.status(200);
                return res.render(path.join(PATH, './home/course.view.mustache'), data);
            }
        })
    });
}

export function login (req,res)
{
    res.status(200);
    if(req.cookies && req.cookies.jwt)
    {
        return res.redirect('/');
    }
    res.render(path.join(PATH,'./home/login.mustache'));
}


//TODO: Change to check user/ Validating user details
export function loginPost(req,res)
{
    res.status(200);
    //check if user is logged in,
    if(req.cookies && req.cookies.jwt)
    {
        return res.redirect('/');
    }
    userdb.findOne({username: req.body.username}, function(err,user){
        if(user)
        {
            if(user.password === crypto.createHash('sha256').update(req.body.password).digest('hex'))
            {
                let payload = {
                    _id: user._id
                };
                let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_LIFE});
                res.cookie("jwt", accessToken);

                if(user.role === 'Admin')
                {
                    return res.redirect('/admin/dashboard')
                    //res.render(path.join(PATH, './admin/dashboard.mustache'),user);
                }else{
                    return res.redirect('/dashboard')
                    //res.render(path.join(PATH, './user/dashboard.mustache'),user);
                }
            }else{
                return res.redirect('/login');
            }
        }else{
            return res.redirect('/login');
        }
    });
}


export function register (req,res)
{
    res.status(200);
    if(req.cookies && req.cookies.jwt)
    {
        return res.redirect('/');
    }
    res.render(path.join(PATH,'./home/register.mustache'));
}


export function registerPost(req,res)
{
    res.status(200);
    //check if user is logged in,
    if(req.cookies && req.cookies.jwt)
    {
        return res.redirect('/');
    }
    var u = new user(req.body.username,crypto.createHash('sha256').update(req.body.password).digest('hex'),req.body.fullname,'User');
    userdb.findOne({username: req.body.username}, function(err,user){
        if(user) {
            //Send back error to register page
            return res.redirect('/signup')
        }else{
            userdb.insert(u, (err, result) =>{
            if(err){
                console.log(err)
            }else{
                let payload = {
                    _id: result._id
                };
                let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_LIFE});
                res.cookie("jwt", accessToken);
                return res.redirect('/dashboard')
            }});
        }
    });
}

export function logoutPost(req,res)
{
    //final check to ensure there are cookies registered to the user
    if(!req.cookies || (req.cookies && !req.cookies.jwt)) return res.redirect('/');
    res.clearCookie('jwt').status(200).redirect('/');
}