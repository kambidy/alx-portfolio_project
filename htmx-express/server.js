
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const port = 8000;
const htmx = require('express-htmx')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('ryan.db');
var bodyparser = require('body-parser');
var cors = require('cors')
var path = require('path');

app.use(cors());

app.use(bodyparser())
app.use(htmx.middleware)
app.set('views', path.join(__dirname,'public'))
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
})
let rr;
  db.serialize(() => {
    db.run("CREATE TABLE lorem (name TEXT, email, TEXT)");


});

app.post('/resume', (req, res) => {


  res.render('resume')

})
app.get('/main', (req, res) => {


	res.render('mainindex')
  
  })
app.post('/portfolio', (req, res) => {


  res.render('portfolio')

})
app.post('/contact', (req, res) => {

db.all("SELECT * FROM lorem",[],(err,rows) => {
	if (err){
		console.log("reading err");

	}

	const users = rows.map(row =>({
		name: row.name,
		email: row.email
	}))

  res.render('contact',{ users : users})
})
})
app.post('/hello', (req, res) => {


  res.send(`<h1 id="hello">${rr.a}</h1>`)

})
app.post('/about', async(req, res) => {
	
		const search_query = "naruto";
		let animelist = {}

		/*const HandleSearch = async () => {
			re = await fetch(`https://api.jikan.moe/v4/anime?q=naruto`)
			console.log(re)
			animelist = JSON.parse(re)
			search_query.value = "";
		}*/
		const apiUrl = 'https://api.jikan.moe/v4/anime?q=naruto';

  try {
    // Fetch data from the API
    const response = await fetch(apiUrl);
    
    // Check if the response is ok (status 200-299)
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    // Convert the JSON response into a JavaScript object
    const data = await response.json();
  console.log(data.data[0])
res.render('about',{ anime: data})
    // Send the data as a JSON response
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    res.status(500).send('An error occurred while fetching data');
  }

  //console.log(animelist)
  

})
app.post('/services', (req, res) => {
  
  
    res.render('card')
})
app.post('/p-form', (req, res) => {
	const {name, email} = req.body;
	const stmt = db.prepare("INSERT INTO lorem (name, email) VALUES(?,?)")
	stmt.run(name, email)
	console.log('name :',name)
	console.log('email :',email)

  db.all("SELECT * FROM lorem", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("An error occurred while retrieving data");
      return;
    }
    res.render('formdata', { users: rows });
  });

})


app.listen(port,() => {
  console.log("running")

});
