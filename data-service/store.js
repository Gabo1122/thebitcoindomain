"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils/utils");
var ramda_1 = require("ramda");
var ordersStore = [];
var toRemoveOrders = [];
function createAddStore(container, timeout) {
    return function (item) {
        utils_1.toArray(item).forEach(function (item) {
            var storeItem = {
                data: item,
                expiration: window.setTimeout(function () {
                    container.splice(container.indexOf(storeItem), 1);
                }, timeout)
            };
            container.push(storeItem);
        });
        return item;
    };
}
function removeFromStoreById(container, idKey, item) {
    var id = item[idKey];
    for (var i = container.length - 1; i >= 0; i--) {
        if (container[i].data[idKey] === id) {
            window.clearTimeout(container[i].expiration);
            container.splice(i, 1);
            break;
        }
    }
}
function removeFromStoreAll(container) {
    for (var i = container.length - 1; i >= 0; i--) {
        window.clearTimeout(container[i].expiration);
        container.splice(i, 1);
    }
}
function createClearStore(addContainer, addRemoveF, idKey) {
    return function (item) {
        utils_1.toArray(item).forEach(function (item) {
            removeFromStoreById(addContainer, idKey, item);
        });
        addRemoveF(item);
        return item;
    };
}
function createClearStoreAll(container, addRemoveF) {
    return function () {
        removeFromStoreAll(container);
    };
}
function createProcessStore(toAddContainer, toRemoveContainer, idKey) {
    return ramda_1.pipe(function (list) { return ramda_1.concat(toAddContainer.map(ramda_1.prop('data')), list); }, function (list) { return ramda_1.differenceWith(ramda_1.eqProps(idKey), list, toRemoveContainer.map(ramda_1.prop('data'))); }, ramda_1.uniqBy(ramda_1.prop(idKey)));
}
var addToRemoveStore = createAddStore(toRemoveOrders, 3000);
exports.addOrderToStore = createAddStore(ordersStore, 3000);
exports.removeOrderFromStore = createClearStore(ordersStore, addToRemoveStore, 'id');
exports.removeAllOrdersFromStore = createClearStoreAll(ordersStore, addToRemoveStore);
exports.processOrdersWithStore = createProcessStore(ordersStore, toRemoveOrders, 'id');
//# sourceMappingURL=store.js.map