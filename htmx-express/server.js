
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const port = 8080;
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


var valinit=""
var watchedAnimeName = ""

var anim = 0
function ANIME(newanim){
  anim = newanim
}
function valsh(newval){
  valinit = newval
}

function watan(newWatched){
  watchedAnimeName = newWatched
}
app.get('/', (req, res) => {
  res.render('index')
})
let rr;
db.serialize(() => {
    db.run("CREATE TABLE lorem (name TEXT, email, TEXT,episodeWatched int)");


});
db.serialize(() => {
  db.run("CREATE TABLE animemark (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,episodeWatched int,watchedId int)");


});

app.post('/resume', (req, res) => {


  res.render('resume')

})
app.get('/main', async(req, res) => {

  const apiUrl = 'https://api.jikan.moe/v4/anime/1/recommendations';

  try {
  // Fetch data from the API
  const response = await fetch(apiUrl);
  
  // Check if the response is ok (status 200-299)
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }

  // Convert the JSON response into a JavaScript object
  const data = await response.json();
  res.render('mainindex',{ anime: data})
  // Send the data as a JSON response
} catch (error) {
  console.error('There has been a problem with your fetch operation:', error);
  res.status(500).send('An error occurred while fetching data');
}
	//res.render('mainindex')
  
})


app.post('/mainSearch/:id', async(req, res) => {
  const clickId = parseInt(req.params.id, 10);
  const apiUrl = `https://api.jikan.moe/v4/anime/${clickId}`;

  try {
  // Fetch data from the API
  const response = await fetch(apiUrl);
  
  // Check if the response is ok (status 200-299)
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }

  // Convert the JSON response into a JavaScript object
  const data = await response.json();
  const colour = "btn btn-success"
  const epno = data.data.episodes
  //watan(data.data[clickId].title)
  //ANIME(clickId)
  db.all("SELECT * FROM animemark ORDER BY id DESC LIMIT 1", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("An error occurred while retrieving data");
      return;
    }
    
       res.render('about2',{ anime:data,id: clickId,ep: epno,watched: rows})

  });
  // Send the data as a JSON response
} catch (error) {
  console.error('There has been a problem with your fetch operation:', error);
  res.status(500).send('An error occurred while fetching data');
}

//console.log(animelist)


})

app.post('/search', async(req, res) => {
  var {query} = req.body;

  const apiUrl = `https://api.jikan.moe/v4/anime?q= ${query}`
  valsh(apiUrl)
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
  res.render('card', { anime: data})
  // Send the data as a JSON response
} catch (error) {
  console.error('There has been a problem with your fetch operation:', error);
  res.status(500).send('An error occurred while fetching data');
}
  // Process the search query (e.g., query the database)
  //res.send(`You searched for: ${query}`);

});


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
app.post('/watched/:id', async(req, res) => {
  
const clickId = parseInt(req.params.id, 10);
const stmt = db.prepare("INSERT INTO animemark (name, episodeWatched) VALUES(?,?)")
stmt.run(watchedAnimeName,  clickId)

db.all("SELECT * FROM animemark ORDER BY id DESC LIMIT 1", (err, rows) => {
  if (err) {
    console.error(err);
    res.status(500).send("An error occurred while retrieving data");
    return;
  }
  
  res.render('watched',{watched: rows})
});
})
app.post('/about/:id', async(req, res) => {
    const clickId = parseInt(req.params.id, 10);
		const apiUrl = valinit;

    try {
    // Fetch data from the API
    const response = await fetch(apiUrl);
    
    // Check if the response is ok (status 200-299)
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    // Convert the JSON response into a JavaScript object
    const data = await response.json();
    const colour = "btn btn-success"
    const epno = data.data[clickId].episodes
    const malid = data.data[clickId].mal_id
    console.log(malid)
    watan(data.data[clickId].title)
    ANIME(clickId)
    db.all("SELECT * FROM animemark ORDER BY id DESC LIMIT 1", (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send("An error occurred while retrieving data");
        return;
      }
      
         res.render('about',{ anime:data,id: clickId,ep: epno,watched: rows})
 
    });
    // Send the data as a JSON response
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    res.status(500).send('An error occurred while fetching data');
  }

  //console.log(animelist)
  

})
app.post('/services', async(req, res) => {
  
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
  
  res.render('card', { anime: data})
  // Send the data as a JSON response
} catch (error) {
  console.error('There has been a problem with your fetch operation:', error);
  res.status(500).send('An error occurred while fetching data');
}

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
