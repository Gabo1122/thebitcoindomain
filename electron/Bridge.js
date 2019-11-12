"use strict";
///<reference path="interface.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const utils_1 = require("./utils");
class Bridge {
    constructor(main) {
        this.main = main;
        this.bridgeCommands = {
            'addDevToolsMenu': this.addDevToolsMenu,
            'reload': this.reload,
            'getLocale': this.getLocale,
            'download': this.download,
            'setLanguage': this.setLanguage
        };
    }
    transfer(command, data) {
        if (this.bridgeCommands.hasOwnProperty(command)) {
            try {
                const result = this.bridgeCommands[command].call(this, data);
                if (result && result.then) {
                    return result;
                }
                else {
                    return Promise.resolve(result);
                }
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            return Promise.reject(new Error(`Wrong command! "${command}"`));
        }
    }
    setLanguage(lng) {
        this.main.setLanguage(lng);
    }
    download(data) {
        return new Promise((resolve, reject) => {
            const path = electron_1.app.getPath('downloads');
            const options = { defaultPath: path_1.join(path, data.fileName) };
            electron_1.dialog.showSaveDialog(this.main.mainWindow, options, function (filename) {
                if (filename) {
                    return utils_1.write(filename, data.fileContent).then(resolve, reject);
                }
                else {
                    return reject(new Error('Cancel'));
                }
            });
        });
    }
    getLocale() {
        return electron_1.app.getLocale() || 'en';
    }
    addDevToolsMenu() {
        this.main.addDevTools();
    }
    reload() {
        this.main.reload();
    }
}
exports.Bridge = Bridge;
//# sourceMappingURL=Bridge.js.map