const mongoose = require('./connection');
const config = require('../../config');

const OrderModel = new mongoose.Schema({
    order_id : {
        type : String
    },
    item_name: {
        type: String,
        // required: true
    },
    cost: {
        type: Number,
        // required: true
    },
    order_date: {
		type: Date,
        // required: true,
        default: Date.now()
    },
    delivery_date: {
		type: Date,
        // required: true,
    }
});

const Order = mongoose.model('order', OrderModel);

module.exports = Order