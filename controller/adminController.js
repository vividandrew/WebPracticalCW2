import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

//Imported Models
import course from '../model/course.js';

// set environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PATH = path.join(__dirname, '../view');
import {userdb, classdb, userClassesdb} from '../database.js';
import jwt from "jsonwebtoken";
import user from "../model/user.js";

export function dashboard(req, res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
        if(err)console.log(err);
        if(!acc)console.log(accessToken);
        if(acc.role !== 'Admin') {
            return res.redirect('/');
        }

        res.render(path.join(PATH, './admin/dashboard.mustache'),acc);
    });
}

// [[USER CRUD]]
export function userList(req,res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    var data = {
        accessToken : true,
        users : userdb.getAllData()
    }

    res.render(path.join(PATH, './admin/userCRUD/index.mustache'),data);
});
}
// [CREATE]
export function userCreate(req, res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    res.render(path.join(PATH, './admin/userCRUD/create.mustache'),acc);
});
}

export function userCreatePost(req, res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) => {
    if (err) console.log(err);
    if (!acc) console.log(accessToken);
    if (acc.role !== 'Admin') {
        return res.redirect('/');
    }

    var u = new user(req.body.username, crypto.createHash('sha256').update(req.body.password).digest('hex'), req.body.fullname, req.body.role);
    userdb.findOne({username: req.body.username}, (err, user) => {
        if (!user) {
            userdb.insert(u, (err, result) => {
                if (err) {
                    console.log(err)
                }
            });
        }
        return res.redirect('/admin/user')
    });
});
}
// [READ]
export function userRead(req,res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    var data = {
        accessToken : true,
        user : null,
    }

    userdb.findOne({_id:req.params.id}, (err, user) =>{
        if(user)
        {
            data.user = user;
            res.render(path.join(PATH, './admin/userCRUD/read.mustache'),data);
        }else{
            return res.redirect('/admin/user');
        }
    })


});
}

// [UPDATE]
export function userUpdate(req,res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    var data = {
        accessToken : true,
        user : null,
        isAdmin : false,
        isUser : false
    }

    userdb.findOne({_id:req.params.id}, (err, user) =>{
        if(user)
        {
            data.user = user;
            data.isAdmin = user.role === "Admin";
            data.isUser = user.role === "User";

            res.render(path.join(PATH, './admin/userCRUD/update.mustache'),data);
        }else{
            return res.redirect('/admin/user');
        }
    })


});
}
export function userUpdatePost(req,res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    userdb.update({_id:req.params.id}, {$set: {username:req.body.username, fullname: req.body.fullname, role: req.body.role}})
    if(req.body.password && req.body.password.trim() !== ""){
        userdb.update({_id:req.params.id}, {$set: {password:crypto.createHash('sha256').update(req.body.password).digest('hex')}})
    }

    return res.redirect('/admin/user')


});
}


// [DELETE]
export function userDelete(req,res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    var data = {
        accessToken : true,
        user : null,
    }

    userdb.findOne({_id:req.params.id}, (err, user) =>{
        if(user)
        {
            data.user = user;
            res.render(path.join(PATH, './admin/userCRUD/delete.mustache'),data);
        }else{
            return res.redirect('/admin/user');
        }
    })


});
}
export function userDeletePost(req,res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    var data = {
        accessToken : true,
        user : null,
    }

    userdb.findOne({_id:req.params.id}, (err, user) =>{
        if(user)
        {
            data.user = user;
            userdb.remove({_id: user._id})
        }
        return res.redirect('/admin/user');
    })


});
}

// [[COURSE CRUD]]
export function courseList(req,res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    var data = {
        accessToken : true,
        courses : classdb.getAllData({},(err, course)=>{course.count = userClassesdb.count({courseid:course._id})})
    }

    res.render(path.join(PATH, './admin/courseCRUD/index.mustache'),data);
});
}
// [CREATE]
export function courseCreate(req, res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    res.render(path.join(PATH, './admin/courseCRUD/create.mustache'),acc);
});
}

export function courseCreatePost(req, res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) => {
    if (err) console.log(err);
    if (!acc) console.log(accessToken);
    if (acc.role !== 'Admin') {
        return res.redirect('/');
    }

    var c = new course(req.body.name, req.body.description, req.body.date, req.body.maxSize);
    classdb.insert(c, (err, result) => {
        if (err) {
            console.log(err)
        }
    });
        return res.redirect('/admin/course')
    });
}
// [READ]
export function courseRead(req,res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    var data = {
        accessToken : true,
        course : null,
    }

    classdb.findOne({_id:req.params.id}, (err, course) =>{
        if(course)
        {
            data.course = course;
            res.render(path.join(PATH, './admin/courseCRUD/read.mustache'),data);
        }else{
            return res.redirect('/admin/course');
        }
    })


});
}

// [UPDATE]
export function courseUpdate(req,res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    var data = {
        accessToken : true,
        course : null,
    }

    classdb.findOne({_id:req.params.id}, (err, course) =>{
        if(course)
        {
            data.course = course;

            res.render(path.join(PATH, './admin/courseCRUD/update.mustache'),data);
        }else{
            return res.redirect('/admin/course');
        }
    })


});
}
export function courseUpdatePost(req,res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    classdb.update({_id:req.params.id}, {$set: {name:req.body.name, date: req.body.date, description:req.body.description , maxSize: req.body.maxSize}});
    return res.redirect('/admin/course')


});
}


// [DELETE]
export function courseDelete(req,res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    var data = {
        accessToken : true,
        course : null,
    }

    classdb.findOne({_id:req.params.id}, (err, course) =>{
        if(course)
        {
            data.course = course;
            res.render(path.join(PATH, './admin/courseCRUD/delete.mustache'),data);
        }else{
            return res.redirect('/admin/course');
        }
    })
});
}
export function courseDeletePost(req,res)
{
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    var data = {
        accessToken : true,
        course : null,
    }

    classdb.findOne({_id:req.params.id}, (err, course) =>{
        if(course)
        {
            data.course = course;
            classdb.remove({_id: course._id})
        }
        return res.redirect('/admin/course');
    })


});
}