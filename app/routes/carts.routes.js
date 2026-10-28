const carts = require('../controllers/carts.controllers')

module.exports = function(app){

    app.route('/cart')
        .get(carts.getAll)
        .post(carts.create);

    app.route('/cart/:id')
        .get(carts.getOne)
        .patch(carts.updateCart)
        .delete(carts.deleteCart);
};