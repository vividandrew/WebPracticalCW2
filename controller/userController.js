import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

//Imported Models
import course from '../model/course.js';
import userCourse from '../model/userCourse.js'

// set environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PATH = path.join(__dirname, '../view');
import {userdb, classdb, userClassesdb} from '../database.js';
import jwt from "jsonwebtoken";

export function dashboard(req, res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);

    acc.accessToken = true;

    res.render(path.join(PATH, './user/dashboard.mustache'),acc);
});
}

export function registerClass(req,res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var classid = req.params.id;
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    var uc = new userCourse(accessToken._id, classid);
    userClassesdb.insert(uc, (err, result) =>{
        res.redirect('/') //TODO: Instead of redirecting to homepage, redirect to dashboard with status message
    })
}

export function showCourses(req,res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    userClassesdb.find({userid: accessToken._id}, (err, result)=>{
        const classIds = result.map(entry => entry.courseid);
        classdb.find({_id:{$in:classIds}},(cerr, classes)=>{

            var data ={
                accessToken: true,
                courses : classes,
            }
            res.status(200);
            res.render(path.join(PATH, './user/courses.mustache'), data);
        })
    })
}

export function showCourse(req, res)
{

    var data = {
        accessToken: null,
    };
    res.status(200);
    if(req.cookies && req.cookies.jwt){
        data = {
            accessToken: true,
            course: null,
        }
    }
    classdb.findOne({_id:req.params.id}, (err, course)=>{
        if(course == null) return res.redirect('/user/course');
        if(err) console.log(err);
        data.course = course;
        res.status(200);
        res.render(path.join(PATH, './user/course.view.mustache'), data);
    })
}

export function quitCourse(req, res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)

    //TODO: check if the user is currently registered to the class
    var data = {
        course: null,
        accessToken: true,
    }

    classdb.findOne({_id:req.params.id}, (err, course)=>{
        if(course == null) return res.redirect('/user/course');
        if(err) console.log(err);
        data.course = course;
        res.status(200);
        res.render(path.join(PATH, './user/course.quit.mustache'), data);
    })
}

export function quitCoursePost(req, res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)

    var data = {
        course: null,
        accessToken: true,
    }
    userClassesdb.remove({courseid:req.params.id}, {multi:false},(err, course)=>{
        if(err){
            console.log('Error deleting: ',err);
        }else{
            console.log('Deleted', course, ' courses from database')
        }

        return res.redirect('/user/course');
    })
}