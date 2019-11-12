"use strict";
///<reference path="node-global-extends.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const Bridge_1 = require("./Bridge");
const path_1 = require("path");
const utils_1 = require("./utils");
const os_1 = require("os");
const child_process_1 = require("child_process");
const constansts_1 = require("./constansts");
const https_1 = require("https");
const META_PATH = path_1.join(electron_1.app.getPath('userData'), constansts_1.META_NAME);
const argv = Array.prototype.slice.call(process.argv);
class Main {
    constructor() {
        this.ctxMenuList = [];
        this.initializeUrl = '';
        this.hasDevTools = false;
        const canOpenElectron = this.makeSingleInstance();
        if (!canOpenElectron) {
            return null;
        }
        this.pack = require('./package.json');
        this.ignoreSslError = argv.includes(constansts_1.ARGV_FLAGS.IGNORE_SSL_ERROR);
        this.noReplaceDesktopFile = argv.includes(constansts_1.ARGV_FLAGS.NO_REPLACE_DESKTOP_FILE);
        if (this.ignoreSslError) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        }
        this.mainWindow = null;
        this.bridge = new Bridge_1.Bridge(this);
        this.dataPromise = Main.loadMeta();
        this.setHandlers();
    }
    reload() {
        Main.loadVersion(this.pack)
            .catch(() => null)
            .then(version => {
            if (version && version === this.lastLoadedVersion) {
                this.mainWindow.reload();
            }
            else {
                const url = this.mainWindow.webContents.getURL();
                this.mainWindow.loadURL(url, { 'extraHeaders': 'pragma: no-cache\n' });
                this.lastLoadedVersion = version;
            }
        });
    }
    setLanguage(lng) {
        utils_1.changeLanguage(lng);
        this.addContextMenu();
    }
    addDevTools() {
        this.hasDevTools = true;
        this.addContextMenu();
    }
    makeSingleInstance() {
        const isOpenClient = electron_1.app.makeSingleInstance((argv) => {
            const link = argv.find(utils_1.hasProtocol) || '';
            this.openProtocolIn(link);
        });
        if (isOpenClient) {
            electron_1.app.quit();
        }
        return !isOpenClient;
    }
    openProtocolIn(browserLink) {
        if (!browserLink || !utils_1.hasProtocol(browserLink)) {
            return null;
        }
        if (this.mainWindow && this.mainWindow.webContents) {
            const url = utils_1.removeProtocol(browserLink);
            this.mainWindow.webContents.executeJavaScript(`runMainProcessEvent('open-from-browser', '${url}')`);
            if (this.mainWindow.isMinimized()) {
                this.mainWindow.restore();
            }
            this.mainWindow.show();
        }
        else {
            this.initializeUrl = browserLink;
        }
    }
    createWindow() {
        return this.dataPromise.then((meta) => {
            this.mainWindow = new electron_1.BrowserWindow(Main.getWindowOptions(meta));
            const pack = this.pack;
            const parts = utils_1.parseElectronUrl(utils_1.removeProtocol(this.initializeUrl || argv.find(argument => utils_1.hasProtocol(argument)) || ''));
            const path = parts.path === '/' ? '/' : parts.path.replace(/\/$/, '');
            const url = `${path}${parts.search}${parts.hash}`;
            this.mainWindow.loadURL(`https://${pack.server}/#!${url}`, { 'extraHeaders': 'pragma: no-cache\n' });
            Main.loadVersion(pack)
                .catch(() => null)
                .then(version => {
                this.lastLoadedVersion = version;
            });
            this.mainWindow.on('closed', () => {
                this.mainWindow = null;
            });
            this.mainWindow.webContents.on('will-navigate', function (event, url) {
                if (!url.includes(pack.server)) {
                    event.preventDefault();
                }
            });
            const onChangeWindow = Main.asyncHandler(() => {
                const [x, y] = this.mainWindow.getPosition();
                const [width, height] = this.mainWindow.getSize();
                const isFullScreen = this.mainWindow.isFullScreen();
                return Main.updateMeta({ x, y, width, height, isFullScreen });
            }, 200);
            this.mainWindow.on('move', onChangeWindow);
            this.mainWindow.on('resize', onChangeWindow);
            this.mainWindow.on('enter-full-screen', onChangeWindow);
            this.mainWindow.on('leave-full-screen', onChangeWindow);
        });
    }
    // private log(message: string): void {
    //     const command = `console.log('${message}');`
    //     this.mainWindow.webContents.executeJavaScript(command);
    //     console.log(message);
    // }
    setHandlers() {
        if (this.ignoreSslError) {
            // SSL/TSL: this is the self signed certificate support
            electron_1.app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
                // On certificate error we disable default behaviour (stop loading the page)
                // and we then say "it is all fine - true" to the callback
                event.preventDefault();
                callback(true);
            });
        }
        electron_1.app.on('ready', () => this.onAppReady());
        electron_1.app.on('window-all-closed', Main.onAllWindowClosed);
        electron_1.app.on('activate', () => this.onActivate());
        electron_1.app.on('open-url', (event, url) => {
            event.preventDefault();
            this.openProtocolIn(url);
        });
    }
    onAppReady() {
        this.registerProtocol()
            .then(() => this.createWindow())
            .then(() => this.addContextMenu());
    }
    addContextMenu() {
        electron_1.Menu.setApplicationMenu(null);
        return utils_1.localeReady.then(t => {
            this.createAppMenu(t);
            this.createCtxMenu(t);
        });
    }
    createAppMenu(locale) {
        const menuList = constansts_1.GET_MENU_LIST(electron_1.app, locale, this.hasDevTools);
        this.menu = electron_1.Menu.buildFromTemplate(menuList);
        electron_1.Menu.setApplicationMenu(this.menu);
    }
    createCtxMenu(locale) {
        const onContextMenu = (menu) => () => menu.popup({});
        if (this.ctxMenuList.length > 0) {
            this.mainWindow.webContents.removeAllListeners('context-menu');
        }
        const ctxMenuTemplate = constansts_1.CONTEXT_MENU(locale);
        const ctxMenu = electron_1.Menu.buildFromTemplate(ctxMenuTemplate);
        this.ctxMenuList.push(ctxMenu);
        this.mainWindow.webContents.on('context-menu', onContextMenu(ctxMenu));
    }
    registerProtocol() {
        if (this.noReplaceDesktopFile) {
            return Promise.resolve();
        }
        return Main.loadMeta()
            .then(meta => {
            const execPath = process.execPath;
            if (meta.lastOpen && meta.lastOpen.setProtocolStatus && meta.lastOpen.lastOpenPath === execPath) {
                return void 0;
            }
            const setProtocolResult = electron_1.app.setAsDefaultProtocolClient(constansts_1.PROTOCOL.replace('://', ''));
            if (setProtocolResult) {
                return Main.updateMeta({
                    lastOpenPath: execPath,
                    setProtocolStatus: true
                });
            }
            if (process.platform === 'linux') {
                return this.installDesktopFile();
            }
            this.showSetProtocolError();
        });
    }
    showSetProtocolError(error) {
        // const pack = require('./package.json');
        //
        // const details = {
        //     os: platform(),
        //     clientVersion: pack.version,
        //     error: String(error)
        // };
        //
        // const makeUrkWithParams = url => {
        //     return url + '?' + Object.keys(details)
        //         .map(name => ({ name, value: details[name] }))
        //         .reduce((acc, item) => acc + `${name}=${encodeURIComponent(item.value)}&`, '');
        // };
        //
        // this.localeReadyPromise.then(t => {
        //     dialog.showMessageBox({
        //             type: 'warning',
        //             buttons: [t('modal.set_protocol_error.close'), t('modal.set_protocol_error.report')],
        //             defaultId: 0,
        //             cancelId: 0,
        //             title: t('modal.set_protocol_error.title'),
        //             message: t('modal.set_protocol_error.message'),
        //             detail: JSON.stringify(details, null, 4)
        //         },
        //         response => {
        //             if (response === 1) {
        //                 shell.openExternal(makeUrkWithParams('https://bug-report'));
        //             }
        //         });
        // });
    }
    installDesktopFile() {
        const escape = path => path.replace(/\s/g, '\\ ');
        const processDesktopFile = file => file.replace('{{APP_PATH}}', escape(process.execPath));
        const writeDesktop = desktop => utils_1.write(path_1.join(os_1.homedir(), '.local', 'share', 'applications', 'waves.desktop'), desktop);
        const registerProtocolHandler = () => {
            child_process_1.execSync('xdg-mime default waves.desktop x-scheme-handler/waves');
        };
        return utils_1.read(path_1.join(__dirname, 'waves.desktop'))
            .then(processDesktopFile)
            .then(writeDesktop)
            .then(registerProtocolHandler)
            .catch((error) => this.showSetProtocolError(error));
    }
    onActivate() {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (!this.mainWindow) {
            this.createWindow();
        }
    }
    static onAllWindowClosed() {
        electron_1.app.quit();
    }
    static loadMeta() {
        return utils_1.readJSON(META_PATH).catch(() => {
            return utils_1.writeJSON(META_PATH, {}).then(() => ({}));
        });
    }
    static updateMeta(data) {
        return Main.loadMeta().then((meta) => {
            meta.lastOpen = Object.assign({}, meta.lastOpen || Object.create(null), data);
            return utils_1.writeJSON(META_PATH, meta);
        });
    }
    static loadVersion(pack) {
        return new Promise((resolve, reject) => {
            const httpGet = https_1.get(`https://${pack.server}/package.json?${Date.now()}`, res => {
                let data = new Buffer('');
                // A chunk of data has been recieved.
                res.on('data', (chunk) => {
                    data = Buffer.concat([data, chunk]);
                });
                // The whole response has been received. Print out the result.
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data.toString()).version);
                    }
                    catch (e) {
                        reject();
                    }
                });
                res.on('error', e => {
                    reject(e);
                });
            });
            httpGet.on('error', reject);
        });
    }
    static getWindowOptions(meta) {
        const fullscreen = meta.lastOpen && meta.lastOpen.isFullScreen;
        const display = electron_1.screen.getPrimaryDisplay();
        let width, height, x, y;
        if (meta.lastOpen) {
            width = meta.lastOpen.width;
            height = meta.lastOpen.height;
            x = meta.lastOpen.x;
            y = meta.lastOpen.y;
        }
        else {
            const size = Main.getStartSize({ width: display.workAreaSize.width, height: display.size.height });
            width = size.width;
            height = size.height;
            x = (display.size.width - width) / 2;
            y = (display.size.height - height) / 2;
        }
        return {
            minWidth: constansts_1.MIN_SIZE.WIDTH,
            minHeight: constansts_1.MIN_SIZE.HEIGHT,
            icon: path_1.join(__dirname, 'img', 'icon.png'),
            fullscreen, width, height, x, y,
            webPreferences: {
                preload: path_1.join(__dirname, 'preload.js'),
                nodeIntegration: false
            }
        };
    }
    static getStartSize(size) {
        const width = Math.max(Math.min(size.width, constansts_1.FIRST_OPEN_SIZES.MAX_SIZE.WIDTH), constansts_1.FIRST_OPEN_SIZES.MIN_SIZE.WIDTH);
        const height = Math.max(Math.min(size.height, constansts_1.FIRST_OPEN_SIZES.MAX_SIZE.HEIGHT), constansts_1.FIRST_OPEN_SIZES.MIN_SIZE.HEIGHT);
        return { width, height };
    }
    static asyncHandler(handler, timeout) {
        let timer = null;
        return function () {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                timer = null;
                handler();
            }, timeout);
        };
    }
}
exports.main = global.main = new Main();
//# sourceMappingURL=main.js.map