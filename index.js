const express = require("express"); // Pull in the express package to use
const Joi = require('joi');  
const app = express();              // initialise the express app  
const sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "db.sqlite" // the sqlite file

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err){
        console.error(err.message);
        throw err;
    }else{
        console.log("Connected to the SQLite DB");

        db.run(`CREATE TABLE carts (
            item_id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_name TEXT NOT null,
            item_price NUMBER NOT null,
            quantity INTEGER NOT NULL 
        )
        `, (err) => {
            if(err){
                console.log("Carts table already exists");
            }else{
                console.log("Carts table created")
            }
        });
    }   
})

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

// Endpoints
app.get("/cart", (req, res) => {        // A simple route to check it works!
    let results = [];

    db.each(
        "SELECT * FROM CARTS",
        [],
        (err, row) => {
            if(err) return res.status(400).send("Couldn't get cart");

            results.push({
                item_id: row.item_id,
                item_name: row.item_name,
                item_price: row.item_price,
                quantity: row.quantity
            })
        },
        (err, num_rows) => {
            if(err) return res.status(400).send("Couldn't get cart");

            return res.send(results);
        }
    )
})

app.get("/cart/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const sql = 'SELECT * FROM carts WHERE item_id=?'

    db.get(sql, [id], (err, row) => {
        if (err) return res.status(500).send("Somethings broke")
        if(!row) return res.status(404).send("Not Found")

        return res.send({
            item_id: row.item_id,
            item_name: row.item_name,
            item_price: row.item_price,
            quantity: row.quantity
        })
    });
})

app.post("/cart", (req, res) => {
    const schema = Joi.object({
        item_name: Joi.string().required(),
        item_price: Joi.number().positive().required(),
        quantity: Joi.number().min(1).required()
    });

    console.log(schema.validate(req.body));

    const { error } = schema.validate(req.body);

    console.log(error);

    if(error) return res.status(400).send(error.details[0].message);

    const sql = 'INSERT INTO carts (item_name, item_price, quantity) VALUES (?,?,?)'
    let values = [req.body.item_name, req.body.item_price, req.body.quantity];

    db.run(sql, values, function(err){
        if(err) return document(err)

        return res.status(201).send({
            item_id: this.lastID,
            item_name: req.body.item_name,
            item_price: req.body.item_price,
            quantity: req.body.quantity
        });
    })
})

app.get("/cartData", (req, res) => {
    const sql = "SELECT * FROM carts";

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).send("Something broke");
        }

        const numberOfItems = rows.reduce(
            (total, item) => total + item.quantity, 0
        );

        const totalPrice = rows.reduce(
            (total, item) => total + (item.item_price * item.quantity), 0
        );

        return res.status(200).json({
            number_of_items: numberOfItems,
            total_price: Number(totalPrice.toFixed(2)),
            items: rows.map(item => item.item_id)
        });
    });
});

app.delete("/cart/:id", (req, res) => {
    const id = parseInt(req.params.id);
    
    const sql = 'DELETE FROM carts WHERE item_id=?'

    db.run(sql, [id], (err) => {
        if (err) return res.status(500).send("Somethings broke")
        return res.status(200).send('');
    })
});

app.patch("/cart/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const schema = Joi.object({
        item_name: Joi.string().required(),
        item_price: Joi.number().positive().required(),
        quantity: Joi.number().min(1).required()
    });

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const sql = 'UPDATE carts SET item_name=?, item_price=?, quantity=? WHERE item_id=?'
    const values = [req.body.item_name, req.body.item_price, req.body.quantity, id];

    db.run(sql, values, (err) => {
        if (err) return res.status(500).send("Somethings broke")
        return res.status(200).send('');
    })
});

app.listen(port, () => {            // Make sure the app can be accessed
    console.log("App is listing on port: " + port);
})