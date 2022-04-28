const orderController = require('../api/controller/orderController');

module.exports = (router) => {

    /**
     * Orders API
     */
    router.post('/orders/create', orderController.createOrder);
    router.get('/orders/list',orderController.listOfOrder);
    router.patch('/orders/update', orderController.updateOrder);
    router.delete('/orders/delete', orderController.deleteOrder);

};