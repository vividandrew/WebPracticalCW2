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
    // This section of code checks the cookie to ensure the currently logged in user is an admin that has access to this page
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
    // This section of code checks the cookie to ensure the currently logged in user is an admin that has access to this page
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    //Sets the data to grab all the users within the database that is used to display a list of users
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
    // This section of code checks the cookie to ensure the currently logged in user is an admin that has access to this page
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
    // This section of code checks the cookie to ensure the currently logged in user is an admin that has access to this page
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) => {
    if (err) console.log(err);
    if (!acc) console.log(accessToken);
    if (acc.role !== 'Admin') {
        return res.redirect('/');
    }

    //Creates an object of user (Model /model/user.js) that is used as the template to insert into the database
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
    // This section of code checks the cookie to ensure the currently logged in user is an admin that has access to this page
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    //Creates a initial dataset in the scenario that there are no users this will be used on the front end to not loop
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
            return res.redirect('/admin/user'); //The user doesn't exist, so the url is not a valid one, redirect to user list page
        }
    })


});
}

// [UPDATE]
export function userUpdate(req,res)
{
    // This section of code checks the cookie to ensure the currently logged in user is an admin that has access to this page
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    //Sets some initial variables used in the scenario that user doesn't fit either role,
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
            return res.redirect('/admin/user'); //user is not a valid user, so this is an invalid page return to user list page
        }
    })


});
}
export function userUpdatePost(req,res)
{
    // This section of code checks the cookie to ensure the currently logged in user is an admin that has access to this page
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    //Updates the user based on the parsed parametes
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
    // This section of code checks the cookie to ensure the currently logged in user is an admin that has access to this page
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
            return res.redirect('/admin/user'); //user doesn't exist so this page is invalid, redirect to user list page
        }
    })


});
}
export function userDeletePost(req,res)
{
    // This section of code checks the cookie to ensure the currently logged in user is an admin that has access to this page
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
        return res.redirect('/admin/user'); //user doesnt exist so this post method is an invalid action, redirect to user list
    })


});
}

// [[COURSE CRUD]]
export function courseList(req,res)
{
    // This section of code checks the cookie to ensure the currently logged in user is an admin that has access to this page
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    //Grabs all courses in the database used to display in list
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
    // This section of code checks the cookie to ensure the currently logged in user is an admin that has access to this page
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
    // This section of code checks the cookie to ensure the currently logged in user is an admin that has access to this page
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) => {
    if (err) console.log(err);
    if (!acc) console.log(accessToken);
    if (acc.role !== 'Admin') {
        return res.redirect('/');
    }

    //Creates a course object (/model/course.js) used as the template structure used to insert into the database
    var c = new course(req.body.name, req.body.description, req.body.date, req.body.maxSize, req.body.cost, req.body.location);
    classdb.insert(c, (err, result) => {
        if (err) {
            console.log(err)
        }
    });
        return res.redirect('/admin/course') //redirect the user to the course list after successful completion of creating a course
    });
}
// [READ]
export function courseRead(req,res)
{
    // This section of code checks the cookie to ensure the currently logged in user is an admin that has access to this page
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
            return res.redirect('/admin/course'); //course doesn't exist so this page is invalid, return to course list
        }
    })


});
}

// [UPDATE]
export function courseUpdate(req,res)
{
    // This section of code checks the cookie to ensure the currently logged in user is an admin that has access to this page
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
            return res.redirect('/admin/course'); // course doesn't exist so this page is invalid, return to course list
        }
    })


});
}
export function courseUpdatePost(req,res)
{
    // This section of code checks the cookie to ensure the currently logged in user is an admin that has access to this page
    if(!req.cookies && !req.cookies.jwt){return res.redirect('/');}
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);userdb.findOne({_id:accessToken._id}, (err, acc) =>{
    if(err)console.log(err);
    if(!acc)console.log(accessToken);
    if(acc.role !== 'Admin') {
        return res.redirect('/');
    }

    classdb.update({_id:req.params.id}, {$set: {name:req.body.name, date: req.body.date, description:req.body.description , maxSize: req.body.maxSize, cost: req.body.cost, location: req.body.location}});
    return res.redirect('/admin/course') //redirect user to course list after successful updating the course


});
}


// [DELETE]
export function courseDelete(req,res)
{
    // This section of code checks the cookie to ensure the currently logged in user is an admin that has access to this page
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
            return res.redirect('/admin/course'); // course doesn't exist so this page is invalid, return to course list
        }
    })
});
}
export function courseDeletePost(req,res)
{
    // This section of code checks the cookie to ensure the currently logged in user is an admin that has access to this page
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
        return res.redirect('/admin/course'); // course doesn't exist so this an invalid action, return to course list
    })


});
}

// Reciept
export function printReceipt(req,res){
// This section of code checks the cookie to ensure the currently logged in user is an admin that has access to this page{
    if (!req.cookies && !req.cookies.jwt) {
        return res.redirect('/');
    }
    var accessToken = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.status(200);
    userdb.findOne({_id: accessToken._id}, (err, acc) => {
        if (err) console.log(err);
        if (!acc) console.log(accessToken);
        if (acc.role !== 'Admin') {
            return res.redirect('/');
        }

        //This grabs the course details that this receipt is for for printing
        classdb.findOne({_id:req.params.id}, (err, course)=>{
            var data =
                {
                    BusinessName: process.env.BUSINESS_NAME, // Sets the business name (.env file) used in display of page
                    staff: user.fullname, //sets the current logged in user that is printing as the organiser
                    location: course.location,
                    course: course,
                    students: [], //sets as empty array to allow for push function when awaiting database pulls
                }
            userClassesdb.find({courseid:data.course._id}, (err, courses)=>{
                if(courses == null){return redirect('/admin/course/', course._id)} //there is no one registered to this course return to coruse list
                var tmp = [] //used as a temp array to await for completion of students list

                //This loops through each student that is registered to this course
                for(var c of courses)
                {

                    //This is a promise function that essnetially async executes the database search that is either pushed or is rejected
                    tmp.push(new Promise((resolve, reject) =>{
                        userdb.findOne({_id:c.userid}, (err, student)=>{
                            if(err)return reject(err);
                            resolve(student); //this returns the student before going to the next search loop

                        })
                    }))
                }

                //This function waits for the async function to fully complete
                //This action must be done or student list may be missing students from the list
                Promise.all(tmp).then(students =>{
                    data.students = students;
                    res.status(200);
                    res.render(path.join(PATH, './admin/courseCRUD/receipt.mustache'), data)
                })
            });
        });
    });
}