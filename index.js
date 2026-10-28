const express = require("express"); // Pull in the express package to use
const Joi = require('joi');  
const app = express();              // initialise the express app  

const allowCrossOriginRequests = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-with, Content-Type, Accept'
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
}

app.use(express.json());            // Middleware to parse JSON bodies
app.use(allowCrossOriginRequests);

require('./app/routes/carts.routes')(app);

const port = 3000;                  // Define a port for this app to run on

app.listen(port, () => {            // Make sure the app can be accessed
    console.log("App is listing on port: " + port);
})