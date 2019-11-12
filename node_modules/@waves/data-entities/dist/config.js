"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var storage = {
    remapAsset: function (data) { return data; },
    remapCandle: function (data) { return data; }
};
var config;
(function (config) {
    function get(key) {
        return storage[key];
    }
    config.get = get;
    function set(key, value) {
        if (typeof key === 'string') {
            storage[key] = value;
        }
        else {
            Object.keys(key).forEach(function (configKey) { return set(configKey, key[configKey]); });
        }
    }
    config.set = set;
})(config = exports.config || (exports.config = {}));
//# sourceMappingURL=config.js.map