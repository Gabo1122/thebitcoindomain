"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const utils_1 = require("./utils");
class Storage {
    constructor() {
        this.storagePath = path_1.join(electron_1.remote.app.getPath('userData'), 'storage.json');
        this.backupPath = path_1.join(electron_1.remote.app.getPath('userData'), 'backup.json');
        this.ready = this.initializeStorageCache();
    }
    readStorage(key) {
        return this.ready.then(() => this.storageCache[key]);
    }
    writeStorage(key, value) {
        this.storageCache[key] = value;
        return utils_1.writeJSON(this.storagePath, this.storageCache);
    }
    clearStorage() {
        this.storageCache = Object.create(null);
        return utils_1.writeJSON(this.storagePath, this.storageCache);
    }
    createNotification() {
        utils_1.localeReady.then(t => {
            new Notification(t('storage.read.error.title'), {
                body: t('storage.read.error.body')
            });
        });
    }
    initializeStorageCache() {
        this.storageCache = Object.create(null);
        const applyBackup = () => {
            this.createNotification();
            return utils_1.readJSON(this.backupPath).then(cache => {
                Object.assign(this.storageCache, cache);
            }).catch(() => {
                this.storageCache = Object.create(null);
            });
        };
        return utils_1.exist(this.storagePath)
            .then(() => {
            return utils_1.readJSON(this.storagePath)
                .then(cache => {
                Object.assign(this.storageCache, cache);
                return utils_1.writeJSON(this.backupPath, cache);
            })
                .catch(applyBackup);
        })
            .catch(() => utils_1.exist(this.backupPath).then(applyBackup))
            .catch(() => utils_1.writeJSON(this.storagePath, this.storageCache));
    }
}
exports.Storage = Storage;
//# sourceMappingURL=Storage.js.map