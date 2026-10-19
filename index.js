const express = require("express"); // Pull in the express package to use
const app = express();              // initialise the express app
app.use(express.json());            // Middleware to parse JSON bodies

const port = 3000;                  // Define a port for this app to run on

app.get("/", (req, res) => {        // A simple route to check it works!
    res.send("Hello World!");
})

app.listen(port, () => {            // Make sure the app can be accessed
    console.log("App is listing on port: " + port);
})

let users = [];
let next_id = 1;

app.post("/users", (req, res) => {
    let user = {
        user_id: next_id,
        user_name: req.body.name
    }

    users.push(user);
    next_id++;

    return res.status(201).json(users);
})

app.get("/users", (req, res) => {
    return res.status(200).send(users);
})

app.delete("/users/:id", (req, res) => {
    let id = parseInt(req.params.id);
    const user = users.find(temp => temp.user_id === id);
    if(!user) return res.status(404).send("No user found");

    const index = users.indexOf(user);
    users.splice(index, 1);

    return res.status(200).send("User deleted");
})

app.listen(port, () => {            // Make sure the app can be accessed

})