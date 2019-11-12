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
var data_entities_1 = require("@waves/data-entities");
var bignumber_1 = require("@waves/bignumber");
var signature_adapter_1 = require("@waves/signature-adapter");
var waves_transactions_1 = require("@waves/waves-transactions");
var assets_1 = require("../assets/assets");
var utils_1 = require("../../utils/utils");
var getOrders_1 = require("../matcher/getOrders");
var sign_1 = require("../../sign");
var ramda_1 = require("ramda");
var SCRIPT_INVOCATION_NUMBER = 16;
var parseAttachment = ramda_1.pipe(String, waves_transactions_1.libs.crypto.base58Decode);
var getFactory = function (isTokens) {
    if (isTokens) {
        return {
            money: utils_1.tokensMoneyFactory,
            price: function (price, pair) { return data_entities_1.Money.fromTokens(price, pair.priceAsset); }
        };
    }
    else {
        return getOrders_1.factory;
    }
};
// TODO Remove is tokens flag after support Dima's api
function parseTx(transactions, isUTX, isTokens) {
    var hash = Object.create(null);
    hash[signature_adapter_1.WAVES_ID] = true;
    transactions.forEach(function (tx) { return getAssetsHashFromTx(tx, hash); });
    var api = sign_1.getSignatureApi();
    return Promise.all([
        assets_1.get(Object.keys(hash)).then(function (assets) { return utils_1.toHash(assets, 'id'); }),
        api && api.getPublicKey() || Promise.resolve(null),
        api && api.getSignVersions() || Promise.resolve({})
    ])
        .then(function (_a) {
        var hash = _a[0], sender = _a[1], versions = _a[2];
        return transactions.map(function (transaction) {
            if ('version' in transaction && versions[transaction.type] != null) {
                var versionList = versions[transaction.type];
                var version = versionList.includes(transaction.version) ? transaction.version : versionList[versionList.lenght - 1];
                transaction.version = version;
            }
            switch (transaction.type) {
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.SEND_OLD:
                    return parseTransferTx(remapOldTransfer(transaction), hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.ISSUE:
                    return parseIssueTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.TRANSFER:
                    return parseTransferTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.REISSUE:
                    return parseReissueTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.BURN:
                    return parseBurnTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.EXCHANGE:
                    return parseExchangeTx(transaction, hash, isUTX, isTokens, sender);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.LEASE:
                    return parseLeasingTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.CANCEL_LEASING:
                    return parseCancelLeasingTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.CREATE_ALIAS:
                    return parseCreateAliasTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.MASS_TRANSFER:
                    return parseMassTransferTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.DATA:
                    return parseDataTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.SPONSORSHIP:
                    return parseSponsorshipTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.SET_SCRIPT:
                    return parseScriptTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.SET_ASSET_SCRIPT:
                    return parseAssetScript(transaction, hash, isUTX);
                case SCRIPT_INVOCATION_NUMBER:
                    return parseInvocationTx(transaction, hash, isUTX);
                default:
                    return transaction;
            }
        });
    });
}
exports.parseTx = parseTx;
function getAssetsHashFromTx(transaction, hash) {
    if (hash === void 0) { hash = Object.create(null); }
    hash[signature_adapter_1.WAVES_ID] = true;
    switch (transaction.type) {
        case signature_adapter_1.TRANSACTION_TYPE_NUMBER.REISSUE:
        case signature_adapter_1.TRANSACTION_TYPE_NUMBER.BURN:
        case signature_adapter_1.TRANSACTION_TYPE_NUMBER.MASS_TRANSFER:
        case signature_adapter_1.TRANSACTION_TYPE_NUMBER.SPONSORSHIP:
            hash[utils_1.normalizeAssetId(transaction.assetId)] = true;
            break;
        case signature_adapter_1.TRANSACTION_TYPE_NUMBER.TRANSFER:
            hash[utils_1.normalizeAssetId(transaction.assetId)] = true;
            hash[utils_1.normalizeAssetId(transaction.feeAssetId)] = true;
            break;
        case signature_adapter_1.TRANSACTION_TYPE_NUMBER.EXCHANGE:
            hash[utils_1.normalizeAssetId(transaction.order1.assetPair.amountAsset)] = true;
            hash[utils_1.normalizeAssetId(transaction.order1.assetPair.priceAsset)] = true;
            hash[utils_1.normalizeAssetId(transaction.order1.matcherFeeAssetId)] = true;
            hash[utils_1.normalizeAssetId(transaction.order2.matcherFeeAssetId)] = true;
            break;
        case SCRIPT_INVOCATION_NUMBER:
            transaction.payment.forEach(function (payment) {
                hash[utils_1.normalizeAssetId(payment.assetId)] = true;
            });
            break;
    }
    return hash;
}
exports.getAssetsHashFromTx = getAssetsHashFromTx;
function remapOldTransfer(tx) {
    var type = signature_adapter_1.TRANSACTION_TYPE_NUMBER.TRANSFER;
    var assetId = signature_adapter_1.WAVES_ID;
    return __assign({}, tx, { type: type, assetId: assetId, attachment: '', feeAssetId: signature_adapter_1.WAVES_ID });
}
exports.remapOldTransfer = remapOldTransfer;
function parseIssueTx(tx, assetsHash, isUTX) {
    var quantity = new bignumber_1.BigNumber(tx.quantity);
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    return __assign({}, tx, { precision: tx.decimals, quantity: quantity, fee: fee, isUTX: isUTX });
}
exports.parseIssueTx = parseIssueTx;
function parseTransferTx(tx, assetsHash, isUTX) {
    var attachment = parseAttachment(tx.attachment);
    var recipient = utils_1.normalizeRecipient(tx.recipient);
    var amount = new data_entities_1.Money(tx.amount, assetsHash[utils_1.normalizeAssetId(tx.assetId)]);
    var fee = new data_entities_1.Money(tx.fee, assetsHash[utils_1.normalizeAssetId(tx.feeAssetId)]);
    var assetId = utils_1.normalizeAssetId(tx.assetId);
    return __assign({}, tx, { amount: amount, fee: fee, assetId: assetId, isUTX: isUTX, attachment: attachment, recipient: recipient });
}
exports.parseTransferTx = parseTransferTx;
function parseReissueTx(tx, assetsHash, isUTX) {
    var quantity = new data_entities_1.Money(tx.quantity, assetsHash[utils_1.normalizeAssetId(tx.assetId)]);
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    return __assign({}, tx, { quantity: quantity, fee: fee, isUTX: isUTX });
}
exports.parseReissueTx = parseReissueTx;
function parseBurnTx(tx, assetsHash, isUTX) {
    var amount = new data_entities_1.Money(tx.amount, assetsHash[utils_1.normalizeAssetId(tx.assetId)]);
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    return __assign({}, tx, { amount: amount, fee: fee, isUTX: isUTX });
}
exports.parseBurnTx = parseBurnTx;
function parseExchangeTx(tx, assetsHash, isUTX, isTokens, sender) {
    var _a;
    var factory = getFactory(isTokens);
    var order1 = parseExchangeOrder(factory, tx.order1, assetsHash);
    var order2 = parseExchangeOrder(factory, tx.order2, assetsHash);
    var orderHash = (_a = {},
        _a[order1.orderType] = order1,
        _a[order2.orderType] = order2,
        _a);
    var buyOrder = orderHash.buy;
    var sellOrder = orderHash.sell;
    var exchangeType = getExchangeType(order1, order2, sender);
    var _b = getExchangeTxMoneys(factory, tx, assetsHash), price = _b.price, amount = _b.amount, total = _b.total;
    var buyMatcherFee = factory.money(tx.buyMatcherFee, buyOrder.matcherFee.asset);
    var sellMatcherFee = factory.money(tx.sellMatcherFee, sellOrder.matcherFee.asset);
    var fee = factory.money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    return __assign({}, tx, { order1: order1,
        order2: order2,
        price: price,
        amount: amount,
        buyMatcherFee: buyMatcherFee,
        sellMatcherFee: sellMatcherFee,
        fee: fee,
        isUTX: isUTX,
        buyOrder: buyOrder,
        sellOrder: sellOrder,
        exchangeType: exchangeType,
        total: total });
}
exports.parseExchangeTx = parseExchangeTx;
function parseScriptTx(tx, assetsHash, isUTX) {
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    var script = tx.script || '';
    return __assign({}, tx, { fee: fee, isUTX: isUTX, script: script });
}
exports.parseScriptTx = parseScriptTx;
function parseAssetScript(tx, assetsHash, isUTX) {
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    var script = tx.script || '';
    return __assign({}, tx, { fee: fee, isUTX: isUTX, script: script });
}
exports.parseAssetScript = parseAssetScript;
function getExchangeTxMoneys(factory, tx, assetsHash) {
    var assetIdPair = utils_1.normalizeAssetPair(tx.order2.assetPair);
    var pair = new data_entities_1.AssetPair(assetsHash[assetIdPair.amountAsset], assetsHash[assetIdPair.priceAsset]);
    var price = factory.price(tx.price, pair);
    var amount = factory.money(tx.amount, pair.amountAsset);
    var total = data_entities_1.Money.fromTokens(amount.getTokens().mul(price.getTokens()), price.asset);
    return { price: price, amount: amount, total: total };
}
exports.getExchangeTxMoneys = getExchangeTxMoneys;
function parseLeasingTx(tx, assetsHash, isUTX) {
    var amount = new data_entities_1.Money(tx.amount, assetsHash[signature_adapter_1.WAVES_ID]);
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    var recipient = utils_1.normalizeRecipient(tx.recipient);
    var isActive = tx.status === 'active';
    return __assign({}, tx, { amount: amount, fee: fee, isUTX: isUTX, recipient: recipient, isActive: isActive });
}
exports.parseLeasingTx = parseLeasingTx;
function parseCancelLeasingTx(tx, assetsHash, isUTX) {
    var lease = tx.lease && parseLeasingTx(tx.lease, assetsHash, false) || null;
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    return __assign({}, tx, { lease: lease, fee: fee, isUTX: isUTX });
}
exports.parseCancelLeasingTx = parseCancelLeasingTx;
function parseCreateAliasTx(tx, assetsHash, isUTX) {
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    return __assign({}, tx, { fee: fee, isUTX: isUTX });
}
exports.parseCreateAliasTx = parseCreateAliasTx;
function parseMassTransferTx(tx, assetsHash, isUTX) {
    var attachment = parseAttachment(tx.attachment);
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    var asset = assetsHash[utils_1.normalizeAssetId(tx.assetId)];
    var transfers = tx.transfers.map(function (transfer) { return ({
        recipient: utils_1.normalizeRecipient(transfer.recipient),
        amount: new data_entities_1.Money(transfer.amount, assetsHash[utils_1.normalizeAssetId(tx.assetId)])
    }); });
    var totalAmount = new data_entities_1.Money(tx.totalAmount || transfers.reduce(function (acc, item) { return acc.add(item.amount); }, new data_entities_1.Money(0, asset)).toCoins(), asset);
    return __assign({}, tx, { totalAmount: totalAmount, transfers: transfers, fee: fee, isUTX: isUTX, attachment: attachment });
}
exports.parseMassTransferTx = parseMassTransferTx;
function parseExchangeOrder(factory, order, assetsHash) {
    var assetPair = utils_1.normalizeAssetPair(order.assetPair);
    var pair = new data_entities_1.AssetPair(assetsHash[assetPair.amountAsset], assetsHash[assetPair.priceAsset]);
    var price = factory.price(order.price, pair);
    var amount = factory.money(order.amount, assetsHash[assetPair.amountAsset]);
    var total = data_entities_1.Money.fromTokens(amount.getTokens().mul(price.getTokens()), price.asset);
    var matcherFee = factory.money(order.matcherFee, assetsHash[utils_1.normalizeAssetId(order.matcherFeeAssetId)]);
    return __assign({}, order, { price: price, amount: amount, matcherFee: matcherFee, assetPair: assetPair, total: total });
}
exports.parseExchangeOrder = parseExchangeOrder;
function parseDataTx(tx, assetsHash, isUTX) {
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    var data = tx.data.map(function (dataItem) {
        if (dataItem.type === 'integer') {
            return __assign({}, dataItem, { value: new bignumber_1.BigNumber(dataItem.value) });
        }
        else {
            return dataItem;
        }
    });
    var txWithBigNumber = __assign({}, tx, { data: data });
    var stringifiedData = JSON.stringify(txWithBigNumber.data, null, 4);
    return __assign({}, txWithBigNumber, { stringifiedData: stringifiedData, fee: fee, isUTX: isUTX });
}
exports.parseDataTx = parseDataTx;
function parseInvocationTx(tx, assetsHash, isUTX) {
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    var dApp = utils_1.normalizeRecipient(tx.dApp);
    var payment = tx.payment.map(function (payment) { return new data_entities_1.Money(payment.amount, assetsHash[utils_1.normalizeAssetId(payment.assetId)]); });
    return __assign({}, tx, { fee: fee, payment: payment, isUTX: isUTX, dApp: dApp });
}
exports.parseInvocationTx = parseInvocationTx;
function parseSponsorshipTx(tx, assetsHash, isUTX) {
    var minSponsoredAssetFee = new data_entities_1.Money(tx.minSponsoredAssetFee || 0, assetsHash[tx.assetId]);
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    return __assign({}, tx, { fee: fee, minSponsoredAssetFee: minSponsoredAssetFee, isUTX: isUTX });
}
function getExchangeType(order1, order2, sender) {
    if (isBothOwnedBy(order1, order2, sender) || isBothNotOwnedBy(order1, order2, sender)) {
        return order1.timestamp > order2.timestamp ? order1.orderType : order2.orderType;
    }
    else {
        return getMineOrder(order1, order2, sender).orderType;
    }
}
function getMineOrder(order1, order2, sender) {
    return order1.senderPublicKey === sender ? order1 : order2;
}
function isBothOwnedBy(order1, order2, sender) {
    return order1.senderPublicKey === sender && order2.senderPublicKey === sender;
}
function isBothNotOwnedBy(order1, order2, sender) {
    return order1.senderPublicKey !== sender && order2.senderPublicKey !== sender;
}
//# sourceMappingURL=parse.js.map