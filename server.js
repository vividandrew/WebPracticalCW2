import express from 'express';
import mustacheExpress from 'mustache-express';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './model/user.js';
import course from './model/course.js';
import crypto from 'crypto';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';


dotenv.config();

// init database tables
import {userdb, classdb} from './database.js';

// initial user
var admin = new User('admin',crypto.createHash('sha256').update('changeme').digest('hex'),'Admin','Admin');
userdb.findOne({username:admin.username}, (err, user) =>
{
	if(!user)
	{
		userdb.insert(admin, (err, result) => {
			if(err) console.error(err);
			else console.log(result);
		});
	}else{
		console.log('Admin user already exists,')
	}
});
classdb.find({}, (err, courses)=>{
	if(courses.length === 0)
	{
		//Create initial classes
		console.log("Creating Initial courses for sample purposes");
		let courses ={
			c1: new course("Test Course 1", "Short blurb for description", "05/09/2025", 10),
			c2: new course("Test Course 2", "Short blurb for description", "05/09/2025", 2),
			c3: new course("Test Course 3", "Short blurb for description", "05/09/2025", 20),
			c4: new course("Test Course 4", "Short blurb for description", "05/09/2025", 20),
		}

		for(let key in courses)
		{
			var c = courses[key];
			classdb.insert(c, (err, result)=>
			{
				if(err) console.log("Error with Course database: " + err);
			})
		}
	}
})


//init express
const app = express();
app.use(express.urlencoded({extended:true})) //used to pass through posts data
app.use(cookieParser()); //used for passing cookies

// Set path for website
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PATH = path.join(__dirname, './view');

// Setting template for enginer to use
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(PATH, 'shared'));

// Set static files CSS, Javascript, etc
express.static(__dirname);
app.use(express.static("public"));

// Router
import router from './routes/route.js';
app.use('/', router);

app.listen(process.env.PORT, () => {
	console.log("Node web server is running on port " + process.env.PORT);
});
