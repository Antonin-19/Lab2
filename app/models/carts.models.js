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

const getOne = (req, res) => {
    const id = parseInt(req.params.item_id);

    const sql = 'SELECT * FROM carts WHERE item_id=?'

    db.get(sql, [id], (err, row) => {
        if (err) return done(err)
        if(!row) return res.status(404).send("Not Found")

        return {
            item_id: row.item_id,
            item_name: row.item_name,
            item_price: row.item_price,
            quantity: row.quantity
        }
    });
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
    getOne: getOne,
    deleteCart: deleteCart
};