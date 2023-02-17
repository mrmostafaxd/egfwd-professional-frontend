// Setup empty JS object to act as endpoint for all routes
let projectData = {};


// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();


/* Dependencies */
/* Middleware*/
const bodyParser = require('body-parser');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());


// Initialize the main project folder
app.use(express.static("website"));


// Spin up the server with port and callback
const PORT = 8000;

app.listen(PORT, () => {
    console.log(`server started at localhost:${PORT}`);
});


// initialize the GET route
app.get('/all', (req, res) => {
    console.log("GET request received");
    res.send(projectData);
});

// initialize the POST route
app.post('/postData', (req, res) => {
    console.log("POST request received");
    projectData = req.body;
    res.send(JSON.stringify(projectData));
});