import express from 'express';
import mustacheExpress from 'mustache-express';
import path from 'path';
import { fileURLToPath } from 'url';
import nedb from '@seald-io/nedb';
import User from './model/user.js';
import crypto from 'crypto';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';


dotenv.config();

// init database tables
import {userdb} from './database.js';

// initial user
var admin = new User('0','admin',crypto.createHash('sha256').update('changeme').digest('hex'),'Admin','Admin');
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

// Environment variables variables
const PORT = 3620;

// Set static files CSS, Javascript, etc
express.static(__dirname);
app.use(express.static("public"));

// Router
import router from './routes/route.js';
app.use('/', router);

app.listen(PORT, () => {
	console.log("Node web server is running on port " + PORT);
});
