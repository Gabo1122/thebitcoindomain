"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = require("../../utils/request");
var utils_1 = require("../../utils/utils");
var config_1 = require("../../config");
function getAssetsRating(assets) {
    return request_1.request({
        url: config_1.get('tokenrating') + "/api/v1/token/",
        fetchOptions: {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: utils_1.stringifyJSON({
                "assetIds": utils_1.toArray(assets),
                "page": 1,
                "limit": 25
            })
        }
    })
        .then(function (tokensList) {
        return Object.values(tokensList).map(function (ratingItem) {
            return {
                assetId: ratingItem.assetId,
                rating: ratingItem.averageScore
            };
        });
    });
}
exports.getAssetsRating = getAssetsRating;
//# sourceMappingURL=rating.js.map