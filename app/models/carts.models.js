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

const getAllCarts = (done) => {
    const sql = 'SELECT * FROM carts'

    const errors = []
    const results = []

    db.each(sql,[],(err, row) => {
        if(err) errors.push(err)

            results.push({
                item_id: row.item_id,
                item_name: row.item_name,
                item_price: row.item_price,
                quantity: row.quantity
            })
        },
        (err, num_rows) => {
            return done(err, num_rows, results)
        }
    )
}

const createItem = (cart, done) => {
    const sql = 'INSERT INTO carts (item_name, item_price, quantity) VALUES (?,?,?)'
    let values = [cart.item_name, cart.item_price, cart.quantity];

    db.run(sql, values, function(err){
        if(err) return done(err)

        done(null, this.lastID)
    })
}

const getOne = (id, done) => {
    const sql = 'SELECT * FROM carts WHERE item_id=?'

    db.get(sql, [id], (err, row) => {
        if (err) return done(err)
        if(!row) return done(null, null);

        done(null, {
            item_id: row.item_id,
            item_name: row.item_name,
            item_price: row.item_price,
            quantity: row.quantity
        })
    });
}

const updateCart = (id, cart, done) => {
    console.log("ID: ", id);
    console.log("Cart: ", cart);
    const sql = `UPDATE carts SET item_name=?, item_price=?, quantity=? WHERE item_id=?`;

    const values = [cart.item_name, cart.item_price, cart.quantity, id];

    console.log("Values: ", values);

    db.run(sql, values, function(err) {
        if (err) return done(err);

        done(null, this.changes);
    })
}

const deleteCart = (id, done) => {
    const sql = 'DELETE FROM carts WHERE item_id=?'

    db.run(sql, [id], (err) => {
        if (err) return done(err)
        return done()
    },
)
}

module.exports = {
    getAllCarts: getAllCarts,
    createItem: createItem,
    getOne: getOne,
    updateCart: updateCart,
    deleteCart: deleteCart
};