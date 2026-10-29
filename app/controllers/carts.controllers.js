const carts = require('../models/carts.models')
const Joi = require("joi")

const getAll = (req,res) => {
    carts.getAllCarts((err, num_rows, results) => {
        if(err) return res.sendStatus(500)
            console.log("Number of articles:" + num_rows)
        return res.status(200).send(results)
    })
}

const create = (req,res) => {
    //return res.status(200).send(); 
    const schema = Joi.object({
        item_name: Joi.string().required(),
        item_price: Joi.number().positive().required(),
        quantity: Joi.number().min(1).required()
    })

    const result = schema.validate(req.body);
    console.log(result);

    if(result.error) return res.status(400).send(result.error.details[0].message);

    let cart = Object.assign({}, req.body);

        carts.createItem(cart, (err,id) => {
            if (err){
                return res.sendStatus(500)
            }
            return res.status(201).send({item_id: id})
        })
}
const getOne = (req,res) => {
    const id = parseInt(req.params.id);

    console.log("Requested ID: ", id);

    carts.getOne(id, (err, results) => {
        console.log("Database returned: ", results)
        if (err){
            return res.sendStatus(500);
        } else if (!results) { //no user found
            return res.sendStatus(404);
        }else{
            res.status(200).json(results);
        }
    });
    
}

const updateCart = (req,res) => {
    let id = parseInt(req.params.id);
    console.log(req.body);
    
    const cart = {
        item_name: req.body.item_name,
        item_price: req.body.item_price,
        quantity: req.body.quantity
    };

    carts.updateCart(id, cart, (err, changes) => {
        if (err) return res.sendStatus(500);
        console.log("Changes: ", changes);
        if (changes === 0) {
            return res.status(404).send("This ID doesn't exist");
            
        }
        return res.status(200).send("The item has been updated");
    })
}

const deleteCart = (req,res) => {
    let id = parseInt(req.params.id);
    carts.deleteCart(id, (err) => {
        if(err) return res.sendStatus(500)
        return res.sendStatus(200);
    })
}

module.exports = {
    getAll: getAll,
    create: create,
    getOne: getOne,
    updateCart: updateCart,
    deleteCart: deleteCart
};





// app.get("/cart/:id", (req, res) => {
//     const id = parseInt(req.params.item_id);

//     const sql = 'SELECT * FROM carts WHERE item_id=?'

//     db.get(sql, [id], (err, row) => {
//         if (err) return res.status(500).send("Somethings broke")
//         if(!row) return res.status(404).send("Not Found")

//         return res.send({
//             item_id: row.item_id,
//             item_name: row.item_name,
//             item_price: row.item_price,
//             quantity: row.quantity
//         })
//     });
// })

// app.post("/cart", (req, res) => {
//     const schema = Joi.object({
//         item_name: Joi.string().required(),
//         item_price: Joi.number().positive().required(),
//         quantity: Joi.number().min(1).required()
//     })

//     console.log(schema.validate(req.body));

//     const { error } = schema.validate(req.body);

//     console.log(error);

//     if(error) return res.status(400).send(error.details[0].message);

//     const sql = 'INSERT INTO carts (item_name, item_price, quantity) VALUES (?,?,?)'
//     let values = [req.body.item_name, req.body.item_price, req.body.quantity];

//     db.run(sql, values, function(err){
//         if(err) return document(err)

//         return res.status(201).send({
//             item_id: this.next_id,
//             item_name: req.body.item_name,
//             item_price: req.body.item_price,
//             quantity: req.body.quantity
//         });
//     })
// })

// app.get("/cartData", (req, res) => {
//     const numberOfItems = carts.reduce(
//         (total,item) => total + item.quantity, 0
//     );

//     const totalPrice = carts.reduce(
//         (total,item) => total + (item.item_price + item.quantity), 0
//     );

//     return res.status(200).json({
//         number_of_items: numberOfItems,
//         total_price: Number(totalPrice.toFixed(2)),
//         items: carts.map(item => item.item_id)
//     });
// })

// app.delete("/cart/:id", (req, res) => {
//     let id = parseInt(req.params.id);
//     const cart = carts.find(temp => temp.item_id === id);
//     if(!cart) return res.status(404).send("No user found");

//     const index = carts.indexOf(cart);
//     carts.splice(index, 1);

//     return res.status(200).send("User deleted");
// })

// app.patch("/cart/:id", (req, res) => {
//     let id = parseInt(req.params.id);
//     const cart = carts.find(temp => temp.item_id === id);

//     if (!cart) return res.status(404).send("This ID doesn't exist");

//     cart.quantity = req.body.quantity;
//     return res.status(200).send("The user has been updated");
// })