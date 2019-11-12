"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = require("../utils/request");
var getOrders_1 = require("../api/matcher/getOrders");
var config_1 = require("../config");
var store_1 = require("../store");
var utils_1 = require("../utils/utils");
function broadcast(data) {
    return request_1.request({
        url: config_1.get('node') + "/transactions/broadcast",
        fetchOptions: {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: utils_1.stringifyJSON(data)
        }
    });
}
exports.broadcast = broadcast;
function createOrderSend(txData) {
    return request_1.request({
        url: config_1.get('matcher') + "/orderbook",
        fetchOptions: {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: utils_1.stringifyJSON(txData)
        }
    })
        .then(function (data) {
        return getOrders_1.parse([__assign({}, data.message, { type: data.message.orderType, status: 'Accepted', filled: 0 })]);
    })
        .then(store_1.addOrderToStore);
}
exports.createOrderSend = createOrderSend;
function cancelOrderSend(txData, amountId, priceId, type) {
    if (type === void 0) { type = 'cancel'; }
    return request_1.request({
        url: config_1.get('matcher') + "/orderbook/" + amountId + "/" + priceId + "/" + type,
        fetchOptions: {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: utils_1.stringifyJSON(txData)
        }
    }).then(function (data) {
        store_1.removeOrderFromStore({ id: txData.orderId });
        return data;
    });
}
exports.cancelOrderSend = cancelOrderSend;
function cancelAllOrdersSend(txData) {
    return request_1.request({
        url: config_1.get('matcher') + "/orderbook/cancel",
        fetchOptions: {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: utils_1.stringifyJSON(txData)
        }
    }).then(function (data) {
        store_1.removeAllOrdersFromStore();
        return data;
    });
}
exports.cancelAllOrdersSend = cancelAllOrdersSend;
//# sourceMappingURL=broadcast.js.map