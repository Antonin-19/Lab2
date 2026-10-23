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

const port = 3000;                  // Define a port for this app to run on

let carts = [];
let next_id = 1;

// Endpoints
app.get("/", (req, res) => {        // A simple route to check it works!
    res.send("Hello World!");
})

app.post("/cart", (req, res) => {
    const schema = Joi.object({
        item_name: Joi.string().required(),
        item_price: Joi.double().required(),
        quantity: Joi.int().min(1).required()
    })

    console.log(schema.validate(req.body));

    const { error } = schema.validate(req.body);

    console.log(error);

    if(error) return res.status(400).send(error.details[0].message);

    let cart = {
        item_id: next_id,
        item_name: req.body.item_name,
        item_price: req.body.item_price,
        quantity: req.body.quantity
    };

    carts.push(cart);
    next_id++;

    return res.status(201).json(cart);
})

app.get("/cart", (req, res) => {
    const numberOfItems = carts.reduce(
        (total,item) => total + item.quantity, 0
    );

    const totalPrice = carts.reduce(
        (total,item) => total + (item.item_price + item.quantity), 0
    );

    return res.status(200).json({
        number_of_items: numberOfItems,
        total_price: Number(totalPrice.toFixed(2)),
        items: carts.map(item => item.item_id)
    });
})

app.delete("/cart/:id", (req, res) => {
    let id = parseInt(req.params.id);
    const cart = carts.find(temp => temp.item_id === id);
    if(!cart) return res.status(404).send("No user found");

    const index = carts.indexOf(cart);
    carts.splice(index, 1);

    return res.status(200).send("User deleted");
})

app.patch("/cart/:id", (req, res) => {
    let id = parseInt(req.params.id);
    const cart = carts.find(temp => temp.item_id === id);

    if (!cart) return res.status(404).send("This ID doesn't exist");

    cart.quantity = req.body.quantity;
    return res.status(200).send("The user has been updated");
})

app.listen(port, () => {            // Make sure the app can be accessed
    console.log("App is listing on port: " + port);
})