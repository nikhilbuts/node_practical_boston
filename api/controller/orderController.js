const _ = require("lodash");
const Order = require("../models/order");
const localization = require("../service/localization");
const Service = require('../service');
const config = require("../../config");

module.exports = {
    createOrder: async (req, res) => {
        try {
            const params = _.pick(req.body, [
                "item_name",
                "cost",
                "delivery_date"
            ]);

            console.log("REQ BODY", req.body);
            let resObj = {};

            if (
                _.isEmpty(params.item_name) || _.isEmpty(params.cost)) {
                return res
                    .status(200)
                    .json(Service.response(0, localization.missingParamError, null));
            }

            if (
                _.isEmpty(params.delivery_date)) {
                return res
                    .status(200)
                    .json(Service.response(0, "Delivery Date Missing", null));
            }

            const order = new Order({
                order_id : await Service.generateUniqueNum(),
                item_name: params.item_name,
                order_date: new Date(),
                cost : params.cost,
                delivery_date : await Service.formatMoment(params.delivery_date),
                created_at : new Date(),
            });

            const rez = await order.save();

            if (!rez) {
                res
                    .status(200)
                    .json(Service.response(0, localization.ServerError, null));
            }

            resObj = {
                order_id : rez.order_id,
                item_name: rez.item_name,
                order_date: await Service.formatMoment(rez.order_date),
                cost : rez.cost,
                delivery_date : await Service.formatMoment(rez.delivery_date),
                created_at: await Service.formateDate(rez.created_at)
            };

            res
                .status(200)
                .json(Service.response(1, "Order Created Successfully", resObj));
        } catch (err) {
            console.log("err.message", err.message);
            res
                .status(200)
                .json(Service.response(0, localization.ServerError, err.message));
        }
    },

    /**
     * List Order
     */
    listOfOrder: async (req, res) => {
        console.log("REQ", req);
        try {
            const orders = await Order.find({}).sort({'order_date': -1});
            if (!orders) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }
            const list = await Promise.all(orders.map(async (o) => {
                return {
                    'order_id': o.order_id,
                    'item_name': o.item_name,
                    'cost': o.cost,
                    'order_date': o.order_date,
                    'delivery_date': o.delivery_date
                }
            }));
            res.status(200).json(Service.response(1, localization.Success, list));
        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },

    /**
     * Update Order
     */
    updateOrder: async (req, res) => {
        console.log("REQQQ", req.body);
        try {
            const params = _.pick(req.body, ["order_id"]);
            req.order.order_id = params.order_id;

            const rez = await req.order.save();

            if (!rez) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            resObj = {
                order_id: rez.order_id,
                item_name: rez.item_name,
                order_date: rez.order_date,
                delivery_date: await Service.formatMoment(rez.delivery_date)
            };
            return res.status(200).json(Service.response(1, localization.updateOrderSuccess, resObj));
        } catch (error) {
            console.log('Error Occured While Editing order :: ', error)
        }
    },

    /**
     * Delete Order
     */

    deleteOrder: async (req, res) => {
        try {
            const params = _.pick(req.body, ['order_id']);
            if(_.isEmpty(params.order_id)) {
                return res.status(200).json(Service.response(0, localization.missingParamError, null));
            }

            const rez = await Order.findByIdAndDelete(params.order_id);

            if(!rez) {
                return res.status(200).json(Service.response(0, localization.ServerError, null));
            }

            res.status(200).json(Service.response(1, localization.deleteOrder, null));

        } catch (err) {
            res.status(200).json(Service.response(0, localization.ServerError, err.message));
        }
    },
  
};
