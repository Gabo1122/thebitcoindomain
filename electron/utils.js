"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constansts_1 = require("./constansts");
const fs_1 = require("fs");
const path_1 = require("path");
const i18next = require(path_1.join(__dirname, 'i18next', 'commonjs', 'index.js'));
function initLocale() {
    return readdir(path_1.join(__dirname, 'locales'))
        .then(list => {
        const resources = list.map(lang => ({
            lang,
            value: require(path_1.join(__dirname, 'locales', lang, 'electron.json'))
        }));
        const i18n = i18next.init({
            fallbackLng: 'en',
            lng: 'en',
            ns: ['electron']
        });
        resources.forEach(({ lang, value }) => {
            i18n.addResourceBundle(lang, 'electron', value, true);
        });
        return new Promise((resolve) => {
            i18next.on('initialized', () => {
                resolve((literal, options) => i18n.t(`electron:${literal}`, options));
            });
        });
    });
}
exports.localeReady = initLocale();
function changeLanguage(lng) {
    i18next.changeLanguage(lng);
}
exports.changeLanguage = changeLanguage;
function hasProtocol(str) {
    return str.indexOf(constansts_1.PROTOCOL) === 0;
}
exports.hasProtocol = hasProtocol;
function removeProtocol(str) {
    return str.replace(constansts_1.PROTOCOL, '');
}
exports.removeProtocol = removeProtocol;
function readdir(path) {
    return new Promise((resolve, reject) => {
        fs_1.readdir(path, (error, list) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(list);
            }
        });
    });
}
exports.readdir = readdir;
function parseElectronUrl(url) {
    const [pathAndSearch, hash] = url.split('#');
    const [path, search] = pathAndSearch.split('?');
    return {
        path,
        search: `?${search || ''}`,
        hash: `#${hash || ''}`
    };
}
exports.parseElectronUrl = parseElectronUrl;
function exist(path) {
    const exists = fs_1.existsSync(path);
    if (exists) {
        return Promise.resolve();
    }
    else {
        return Promise.reject(new Error(`File with path ${path} does not exist!`));
    }
}
exports.exist = exist;
function read(path) {
    return exist(path).then(() => {
        return new Promise((resolve, reject) => {
            fs_1.readFile(path, 'utf8', (error, file) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(file);
                }
            });
        });
    });
}
exports.read = read;
function readJSON(path) {
    return read(path).then((file) => JSON.parse(file));
}
exports.readJSON = readJSON;
function write(path, content) {
    return new Promise((resolve, reject) => {
        fs_1.writeFile(path, content, function (error) {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
}
exports.write = write;
function writeJSON(path, content) {
    return write(path, JSON.stringify(content));
}
exports.writeJSON = writeJSON;
//# sourceMappingURL=utils.js.map