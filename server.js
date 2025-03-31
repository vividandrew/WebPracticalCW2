import express from 'express';
import mustacheExpress from 'mustache-express';
import path from 'path';
import { fileURLToPath } from 'url';

//init express
const app = express();
app.use(express.urlencoded({extended:false})) //used to pass through posts data

// Set path for website
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PATH = path.join(__dirname, './src/views');

// Setting template for enginer to use
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(PATH, 'shared'));

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
