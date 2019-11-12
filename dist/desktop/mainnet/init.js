(function initConfig(config) {
            var global = (window);
            var __controllers = Object.create(null);
            global.buildIsWeb = config.isWeb;
            global.isDesktop = !config.isWeb;
            var USE_NATIVE_API = [
                global.Promise,
                global.fetch,
                Object.values,
                Object.assign,
                Object.getOwnPropertyDescriptor,
                Object.entries,
                global.URL,
                global.crypto || global.msCrypto
            ];
            var isSupported = true;
            try {
                for (var i = 0; i < USE_NATIVE_API.length; i++) {
                    if (!USE_NATIVE_API[i]) {
                        throw new Error('Not supported');
                    }
                }
            }
            catch (e) {
                isSupported = false;
            }
            config.notSupportedSelector = '.not-supported-browser';
            window.getConfig = function () {
                config.isBrowserSupported = function () {
                    return isSupported;
                };
                config._initScripts = function () {
                    if (!isSupported) {
                        return null;
                    }
                    for (var i = 0; i < config.scripts.length; i++) {
                        document.write(config.scripts[i]);
                    }
                };
                config._initStyles = function () {
                    for (var i = 0; i < config.styles.length; i++) {
                        document.write(config.styles[i]);
                    }
                };
                config._initApp = function () {
                    // Signed 64-bit integer.
                    const { BigNumber } = require('@waves/bignumber');
                    WavesApp.maxCoinsCount = new BigNumber('9223372036854775807');
                    WavesApp.analyticsIframe = config.analyticsIframe;
                    WavesApp.device = new MobileDetect(navigator.userAgent);
                    (function () {
                        var wrapper = require('worker-wrapper');
                        var worker = wrapper.create({
                            libs: ['/node_modules/parse-json-bignumber/dist/parse-json-bignumber.min.js?v' + WavesApp.version]
                        });
                        worker.process(function () {
                            self.parse = parseJsonBignumber().parse;
                        });
                        var stringify = parseJsonBignumber({
                            parse: (data) => new BigNumber(data),
                            stringify: (data) => data.toFixed(),
                            isInstance: (data) => BigNumber.isBigNumber(data)
                        }).stringify;
                        WavesApp.parseJSON = function (str) {
                            return worker.process(function (str) {
                                return parse(str);
                            }, str);
                        };
                        WavesApp.stringifyJSON = function () {
                            return stringify.apply(this, arguments);
                        };
                    })();
                    (function () {
                        var analytics = require('@waves/event-sender');
                        analytics.addApi({
                            apiToken: '7a280fdf83a5efc5b8dfd52fc89de3d7',
                            libraryUrl: location.origin + '/amplitude.js',
                            initializeMethod: 'amplitudeInit',
                            sendMethod: 'amplitudePushEvent',
                            type: 'logic'
                        });
                        analytics.addApi({
                            apiToken: 'UA-75283398-20',
                            libraryUrl: location.origin + '/googleAnalytics.js',
                            initializeMethod: 'gaInit',
                            sendMethod: 'gaPushEvent',
                            type: 'ui'
                        });
                        if (location.pathname.replace('/', '') === '') {
                            analytics.send({ name: 'Onboarding In Show', target: 'ui' });
                        }
                    })();
                    if (WavesApp.isDesktop()) {
                        var listenDevTools = false;
                        Mousetrap.bind('i d d q d', function () {
                            if (!listenDevTools) {
                                transfer('addDevToolsMenu');
                                listenDevTools = true;
                            }
                        });
                    }
                    global.Mousetrap.bind('c l e a n a l l', function () {
                        localStorage.clear();
                        if (WavesApp.isDesktop()) {
                            transfer('reload');
                        }
                        else {
                            window.location.reload();
                        }
                    });
                };
                config.getLocaleData = function () {
                    return WavesApp.localize[global.i18next.language];
                };
                config.addController = function (name, controller) {
                    __controllers[name] = controller;
                };
                config.getController = function (name) {
                    return __controllers[name];
                };
                config.isWeb = function () {
                    return config.build.type === 'web';
                };
                config.isDesktop = function () {
                    return config.build.type === 'desktop';
                };
                config._isProduction = function () {
                    return config.isProduction;
                };
                config.reload = function () {
                    if (WavesApp.isDesktop()) {
                        transfer('reload');
                    }
                    else {
                        window.location.reload();
                    }
                };
                config.remappedAssetNames = {};
                config.remappedAssetNames[config.network.assets.EUR] = 'Euro';
                config.remappedAssetNames[config.network.assets.USD] = 'US Dollar';
                config.remappedAssetNames[config.network.assets.TRY] = 'TRY';
                config.remappedAssetNames[config.network.assets.BTC] = 'Bitcoin';
                config.remappedAssetNames[config.network.assets.ETH] = 'Ethereum';
                return config;
            };
        })({
    "pack": {
        "name": "waves-client",
        "version": "1.3.19",
        "description": "The official client application for the Waves platform",
        "private": true,
        "repository": {
            "type": "git",
            "url": "https://github.com/wavesplatform/WavesGUI.git"
        },
        "author": {
            "name": "Waves Platform",
            "email": "info@wavesplatform.com",
            "url": "https://wavesplatform.com"
        },
        "license": "Apache-2.0",
        "devDependencies": {
            "@types/babel-core": "6.25.2",
            "@types/connect": "3.4.31",
            "@types/cookie": "0.3.1",
            "@types/fs-extra": "3.0.3",
            "@types/gulp": "4.0.6",
            "@types/gulp-angular-templatecache": "2.0.3",
            "@types/gulp-babel": "6.1.29",
            "@types/gulp-concat": "0.0.30",
            "@types/gulp-copy": "0.0.4",
            "@types/gulp-htmlmin": "1.3.30",
            "@types/gulp-less": "0.0.31",
            "@types/handlebars": "4.0.36",
            "@types/html-minifier": "1.1.30",
            "@types/i18next": "8.4.2",
            "@types/jasmine": "2.6.0",
            "@types/jquery": "^3.2.13",
            "@types/js-cookie": "2.1.0",
            "@types/less": "0.0.32",
            "@types/mime": "2.0.0",
            "@types/node": "8.0.34",
            "@types/papaparse": "4.1.33",
            "@types/serve-static": "1.7.32",
            "@types/yargs": "13.0.0",
            "autoprefixer": "7.1.5",
            "babel-cli": "6.26.0",
            "babel-eslint": "8.2.3",
            "babel-plugin-transform-async-to-generator": "^6.24.1",
            "babel-plugin-transform-class-properties": "6.24.1",
            "babel-plugin-transform-decorators": "6.24.1",
            "babel-plugin-transform-decorators-legacy": "1.3.4",
            "babel-plugin-transform-object-rest-spread": "6.26.0",
            "babel-polyfill": "6.26.0",
            "babel-preset-es2015": "6.24.1",
            "browserify": "16.2.2",
            "cookie": "0.4.0",
            "cssnano": "4.1.10",
            "electron": "2.0.13",
            "electron-builder": "^20.43.0",
            "electron-packager": "12.1.0",
            "eslint": "4.18.2",
            "fs-extra": "4.0.2",
            "gulp": "4.0.2",
            "gulp-angular-templatecache": "3.0.0",
            "gulp-babel": "6.1.3",
            "gulp-concat": "2.6.1",
            "gulp-copy": "4.0.1",
            "gulp-footer": "2.0.2",
            "gulp-hash-filename": "2.0.1",
            "gulp-header": "2.0.7",
            "gulp-htmlmin": "5.0.1",
            "gulp-less": "4.0.1",
            "gulp-postcss": "8.0.0",
            "gulp-uglify": "3.0.2",
            "handlebars": "^4.1.2",
            "html-minifier": "^3.5.20",
            "husky": "^3.0.0",
            "less": "2.7.2",
            "lint-staged": "9.1.0",
            "mime": "2.0.3",
            "my-local-ip": "1.0.0",
            "opn": "^5.4.0",
            "pixrem": "4.0.1",
            "postcss-cli": "5.0.0",
            "serve-static": "1.13.1",
            "ts-node": "8.3.0",
            "typescript": "^3.5.3",
            "yargs": "13.2.4"
        },
        "scripts": {
            "start": "ts-node server.ts startSimple openUrl",
            "preinstall": "sh scripts/preinstall.sh",
            "postinstall": "sh scripts/postinstall.sh",
            "preversion": "sh scripts/preversion.sh",
            "postversion": "sh scripts/postversion.sh",
            "lessc": "sh scripts/lessc",
            "build": "tsc -p ./tsconfig.json && gulp all",
            "server": "npm run build && ts-node server.ts",
            "electron:linux": "electron-packager ./dist/desktop/mainnet/ --icon=./electron/icons/icon.png --platform=linux --out=./dist/linux",
            "electron:win": "electron-packager ./dist/desktop/mainnet/ --icon=./electron/icons/icon.ico --platform=win32 --out=./dist/win",
            "electron:osx": "electron-packager ./dist/desktop/mainnet/ --icon=./electron/icons/icon.icns --platform=darwin --out=./dist/osx",
            "electron": "tsc -p ./tsconfig.json && gulp all && npm run electron:linux && npm run electron:win && npm run electron:osx",
            "electron-debug": "gulp electron-debug && node_modules/.bin/electron dist/desktop/electron-debug/ --ignore-ssl-error --no-replace-desktop --inspect",
            "data-services": "gulp data-services"
        },
        "dependencies": {
            "@sentry/browser": "5.4.3",
            "@types/ramda": "0.25.34",
            "@uirouter/angularjs": "1.0.8",
            "@waves/assets-pairs-order": "4.0.0",
            "@waves/bignumber": "0.0.1",
            "@waves/data-entities": "^2.0.0",
            "@waves/data-service-client-js": "^4.0.1",
            "@waves/event-sender": "^1.1.0",
            "@waves/ledger": "^3.4.0",
            "@waves/marshall": "^0.8.0",
            "@waves/oracle-data": "^0.0.6",
            "@waves/signature-adapter": "^5.2.0",
            "@waves/ts-types": "0.0.2",
            "@waves/waves-browser-bus": "^0.1.5",
            "@waves/waves-transactions": "^3.16.3",
            "angular": "1.6.6",
            "angular-animate": "1.6.6",
            "angular-aria": "1.6.6",
            "angular-material": "1.1.5",
            "clipboard": "1.7.1",
            "d3": "3.5.17",
            "extract-zip": "^1.6.7",
            "i18next": "9.1.0",
            "i18next-locize-backend": "1.2.1",
            "identity-img": "1.0.0",
            "jquery": "^3.4.0",
            "js-cookie": "2.2.0",
            "mobile-detect": "^1.4.1",
            "mousetrap": "1.6.1",
            "ng-i18next": "1.0.5",
            "papaparse": "4.3.7",
            "parse-json-bignumber": "^1.0.0",
            "qrcode": "1.3.2",
            "qrcode-reader": "1.0.4",
            "ramda": "^0.25.0",
            "ts-api-validator": "2.1.2",
            "ts-utils": "^6.0.6",
            "worker-wrapper": "^1.3.2"
        },
        "husky": {
            "hooks": {
                "pre-commit": "lint-staged",
                "commit-msg": "ts-node ./ts-scripts/commit-msg.ts $HUSKY_GIT_PARAMS",
                "post-commit": "git update-index --again"
            }
        },
        "lint-staged": {
            "*.js": [
                "eslint"
            ]
        }
    },
    "isWeb": false,
    "origin": "https://client.wavesplatform.com",
    "analyticsIframe": "https://iframe.wavesplatform.com",
    "tradingPairs": [
        "8ouNBeYFxJMaeyPBwF8jY86R457CyEjAY98HaNLFox7N",
        "7eMpAC1CVLeZq7Mi16AkvkY2BmLytyApLaUG4TxNFew5",
        "BFWboD9xC64tSmirFbCNARR1NSu6Ep9rP4SRoLkQhBUF"
    ],
    "oracles": {
        "waves": "3P6t5mKGwVDkyjFhtUqw4NnecyC3DRpLfkw",
        "tokenomica": "3P5yz6NiyBoT3KWBrc1iwQeMAen56FcMGTW"
    },
    "styles": [
        "<link  rel=\"stylesheet\" href=\"/css/vendor-styles.min-ab3c9a89820a9d0f664d6957fdfad5cb.css\">",
        "<link theme=\"default\" rel=\"stylesheet\" href=\"/css/default-styles.min-c06c5fbb6d116aaef4a04e0da53f3601.css\">",
        "<link theme=\"black\" rel=\"stylesheet\" href=\"/css/black-styles.min-bf105807710da639abbbda9372c2e78f.css\">"
    ],
    "scripts": [
        "<script src=\"js/vendors.min-0b4fc558ae12266526b2e46810980e69.js\"></script>",
        "<script src=\"js/not-wrapped-vendors.min-8b3c2e64f89a7d48b22a96893c549c91.js\"></script>",
        "<script src=\"js/bundle.min-2eb5720da6a8617c6ca8535333977884.js\"></script>",
        "<script src=\"js/templates.min-440fce9dbf84267fac142747ed775c05.js\"></script>",
        "<script>Sentry.init({ dsn: \"https://edc3970622f446d7aa0c9cb38be44a4f@sentry.io/291068\" });</script>"
    ],
    "isProduction": true,
    "feeConfigUrl": "https://raw.githubusercontent.com/wavesplatform/waves-client-config/master/fee.json",
    "bankRecipient": "3P7qtv5Z7AMhwyvf5sM6nLuWWypyjVKb7Us",
    "build": {
        "type": "desktop"
    },
    "network": {
        "tradingPairs": [
            "8ouNBeYFxJMaeyPBwF8jY86R457CyEjAY98HaNLFox7N",
            "7eMpAC1CVLeZq7Mi16AkvkY2BmLytyApLaUG4TxNFew5",
            "BFWboD9xC64tSmirFbCNARR1NSu6Ep9rP4SRoLkQhBUF"
        ],
        "oracles": {
            "waves": "3P6t5mKGwVDkyjFhtUqw4NnecyC3DRpLfkw",
            "tokenomica": "3P5yz6NiyBoT3KWBrc1iwQeMAen56FcMGTW"
        },
        "apiVersion": "v0",
        "bankRecipient": "3P7qtv5Z7AMhwyvf5sM6nLuWWypyjVKb7Us",
        "code": "W",
        "node": "https://nodes.wavesplatform.com",
        "matcher": "https://matcher.wavesplatform.com/matcher",
        "api": "https://api.wavesplatform.com",
        "explorer": "https://wavesexplorer.com",
        "coinomat": "https://coinomat.com",
        "wavesGateway": "https://gw.wavesplatform.com",
        "support": "https://support.wavesplatform.com",
        "termsAndConditions": "https://wavesplatform.com/files/docs/Waves_terms_and_conditions.pdf",
        "privacyPolicy": "https://wavesplatform.com/files/docs/Waves_privacy_policy.pdf",
        "nodeList": "https://forum.wavesplatform.com/c/pools",
        "tokensNameListUrl": "https://raw.githubusercontent.com/wavesplatform/waves-community/master/Prominent%20token%20name%20list.csv",
        "scamListUrl": "https://raw.githubusercontent.com/wavesplatform/waves-community/master/Scam%20tokens%20according%20to%20the%20opinion%20of%20Waves%20Community.csv",
        "origin": "https://client.wavesplatform.com",
        "featuresConfigUrl": "https://raw.githubusercontent.com/wavesplatform/waves-client-config/master/config.json",
        "feeConfigUrl": "https://raw.githubusercontent.com/wavesplatform/waves-client-config/master/fee.json",
        "VSTNetworkByte": "V",
        "tokenrating": "https://tokenrating.wavesexplorer.com",
        "assets": {
            "EUR": "Gtb1WRznfchDnTh37ezoDTJ4wcoKaRsKqKjJjy7nm2zU",
            "USD": "Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck",
            "BTC": "8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS",
            "BSV": "62LyMjcr2DtiyF5yVXFhoQ2q414VPPJXjsNYp72SuDCH",
            "ETH": "474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu",
            "LTC": "HZk1mbfuJpmxU1Fs4AX5MWLVYtctsNcg6e2C6VKqK8zk",
            "ZEC": "BrjUWjndUanm5VsJkbUip8VRYy6LWJePtxya3FNv4TQa",
            "BCH": "zMFqXuoyrn5w17PFurTqxB7GsS71fp9dfk6XFwxbPCy",
            "TRY": "2mX5DzVKWrAJw8iwdJnV2qtoeVG9h5nTDpTqC1wb1WEN",
            "DASH": "B3uGHFRpSUuGEDWjqB9LWWxafQj8VTvpMucEyoxzws5H",
            "EFYT": "725Yv9oceWsB4GsYwyy4A52kEwyVrL5avubkeChSnL46",
            "WNET": "AxAmJaro7BJ4KasYiZhw7HkjwgYtt2nekPuF2CN9LMym",
            "XMR": "5WvPKSJXzVE2orvbkJ8wsQmmQKqTv9sGBPksV4adViw3",
            "VST": "4LHHvYGNKJUg5hj65aGD5vgScvCBmLpdRFtjokvCjSL8",
            "ERGO": "5dJj4Hn9t2Ve3tRpNGirUHy4yBK6qdJRAJYV21yPPuGz",
            "WCT": "DHgwrRvVyqJsepd32YbBqUeDH4GJ1N984X8QoekjgH8J",
            "BNT": "F81SdfzBZr5ce8JArRWLPJEDg1V8yT257ohbcHk75yCp"
        },
        "matcherPriorityList": [
            {
                "ticker": "USD",
                "id": "Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck"
            },
            {
                "ticker": "EUR",
                "id": "Gtb1WRznfchDnTh37ezoDTJ4wcoKaRsKqKjJjy7nm2zU"
            },
            {
                "ticker": "CNY",
                "id": "DEJbZipbKQjwEiRjx2AqQFucrj5CZ3rAc4ZvFM8nAsoA"
            },
            {
                "ticker": "TRY",
                "id": "2mX5DzVKWrAJw8iwdJnV2qtoeVG9h5nTDpTqC1wb1WEN"
            },
            {
                "ticker": "BTC",
                "id": "8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS"
            },
            {
                "ticker": "WAVES",
                "id": "WAVES"
            },
            {
                "ticker": "BCH",
                "id": "zMFqXuoyrn5w17PFurTqxB7GsS71fp9dfk6XFwxbPCy"
            },
            {
                "ticker": "ETH",
                "id": "474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu"
            },
            {
                "ticker": "LTC",
                "id": "HZk1mbfuJpmxU1Fs4AX5MWLVYtctsNcg6e2C6VKqK8zk"
            },
            {
                "ticker": "DASH",
                "id": "B3uGHFRpSUuGEDWjqB9LWWxafQj8VTvpMucEyoxzws5H"
            },
            {
                "ticker": "Monero",
                "id": "5WvPKSJXzVE2orvbkJ8wsQmmQKqTv9sGBPksV4adViw3"
            },
            {
                "ticker": "ZEC",
                "id": "BrjUWjndUanm5VsJkbUip8VRYy6LWJePtxya3FNv4TQa"
            }
        ]
    },
    "themesConf": {
        "themes": [
            "default",
            "black"
        ],
        "default": {
            "tradingView": {
                "candles": {
                    "blue": {
                        "upColor": "#5a81ea",
                        "downColor": "#e5494d",
                        "volume0": "rgba(209,56,60,0.3)",
                        "volume1": "rgba(90,129,234,0.3)"
                    },
                    "green": {
                        "upColor": "#39a12c",
                        "downColor": "#e5494d",
                        "volume0": "rgba(200,0,00,0.3)",
                        "volume1": "rgba(0,200,0,0.3)"
                    }
                },
                "toolbarBg": "#fff",
                "customCssUrl": "/tradingview-style/style.css",
                "OVERRIDES": {
                    "scalesProperties.lineColor": "#edf0f4",
                    "scalesProperties.textColor": "#4e5c6e",
                    "paneProperties.background": "#FFF",
                    "paneProperties.gridProperties.color": "#edf0f4",
                    "paneProperties.vertGridProperties.color": "#edf0f4",
                    "paneProperties.horzGridProperties.color": "#edf0f4",
                    "mainSeriesProperties.candleStyle.borderDownColor": "#e5494d",
                    "mainSeriesProperties.candleStyle.borderUpColor": "#5a81ea",
                    "mainSeriesProperties.hollowCandleStyle.borderDownColor": "#e5494d",
                    "mainSeriesProperties.hollowCandleStyle.borderUpColor": "#e5494d",
                    "mainSeriesProperties.haStyle.borderDownColor": "#e5494d",
                    "mainSeriesProperties.candleStyle.wickUpColor": "rgba(90, 129, 234, 0.5)",
                    "mainSeriesProperties.candleStyle.wickDownColor": "rgba(229, 73, 77, 0.5)",
                    "mainSeriesProperties.hollowCandleStyle.wickUpColor": "rgba(90, 129, 234, 0.5)",
                    "mainSeriesProperties.hollowCandleStyle.wickDownColor": "rgba(229, 73, 77, 0.5)",
                    "mainSeriesProperties.haStyle.wickUpColor": "rgba(90, 129, 234, 0.5)",
                    "mainSeriesProperties.haStyle.wickDownColor": "rgba(229, 73, 77, 0.5)"
                }
            },
            "wAssetRateChart": {
                "seriesColor": "#5a81ea",
                "lineColor": "#5a81ea"
            },
            "TokenChangeModalCtrl": {
                "seriesColor": "#5a81ea"
            },
            "bgColor": "#2d2d2d"
        },
        "black": {
            "tradingView": {
                "candles": {
                    "blue": {
                        "upColor": "#5a81ea",
                        "downColor": "#e5494d",
                        "volume0": "rgba(209,56,60,0.3)",
                        "volume1": "rgba(90,129,234,0.3)"
                    },
                    "green": {
                        "upColor": "#39a12c",
                        "downColor": "#e5494d",
                        "volume0": "rgba(200,0,00,0.3)",
                        "volume1": "rgba(0,200,0,0.3)"
                    }
                },
                "toolbarBg": "#2d2d2d",
                "customCssUrl": "/tradingview-style/dark-style.css",
                "OVERRIDES": {
                    "paneProperties.background": "#2d2d2d",
                    "scalesProperties.lineColor": "#424242",
                    "scalesProperties.textColor": "#8c8c8c",
                    "paneProperties.gridProperties.color": "#424242",
                    "paneProperties.vertGridProperties.color": "#424242",
                    "paneProperties.horzGridProperties.color": "#424242",
                    "mainSeriesProperties.candleStyle.borderDownColor": "#e5494d",
                    "mainSeriesProperties.hollowCandleStyle.borderDownColor": "#e5494d",
                    "mainSeriesProperties.candleStyle.borderUpColor": "#5a81ea",
                    "mainSeriesProperties.haStyle.borderUpColor": "#5a81ea",
                    "mainSeriesProperties.hollowCandleStyle.borderUpColor": "#e5494d",
                    "mainSeriesProperties.haStyle.borderDownColor": "#e5494d",
                    "mainSeriesProperties.candleStyle.wickUpColor": "rgba(90, 129, 234, 0.5)",
                    "mainSeriesProperties.candleStyle.wickDownColor": "rgba(229, 73, 77, 0.5)",
                    "mainSeriesProperties.hollowCandleStyle.wickUpColor": "rgba(90, 129, 234, 0.5)",
                    "mainSeriesProperties.hollowCandleStyle.wickDownColor": "rgba(229, 73, 77, 0.5)",
                    "mainSeriesProperties.haStyle.wickUpColor": "rgba(90, 129, 234, 0.5)",
                    "mainSeriesProperties.haStyle.wickDownColor": "rgba(229, 73, 77, 0.5)"
                }
            },
            "wAssetRateChart": {
                "seriesColor": "#5c5b5b",
                "lineColor": "#eaeaea"
            },
            "TokenChangeModalCtrl": {
                "seriesColor": "rgba(255,255,255,0.80)"
            },
            "bgColor": "#fff"
        }
    },
    "langList": {
        "en": {
            "name": "English",
            "separators": {
                "group": ",",
                "decimal": "."
            }
        },
        "ru": {
            "name": "Russian",
            "separators": {
                "group": " ",
                "decimal": "."
            }
        },
        "ko": {
            "name": "Korean",
            "separators": {
                "group": ",",
                "decimal": "."
            }
        },
        "zh_CN": {
            "name": "Chinese",
            "separators": {
                "group": ",",
                "decimal": "."
            }
        },
        "tr": {
            "name": "Turkish",
            "separators": {
                "group": " ",
                "decimal": "."
            }
        },
        "ja": {
            "name": "Japanese",
            "separators": {
                "group": ",",
                "decimal": "."
            }
        },
        "nl_NL": {
            "name": "Dutch",
            "separators": {
                "group": ",",
                "decimal": "."
            }
        },
        "hi_IN": {
            "name": "Hindi",
            "separators": {
                "group": ",",
                "decimal": "."
            }
        },
        "es": {
            "name": "Spanish",
            "separators": {
                "group": ",",
                "decimal": "."
            }
        },
        "et_EE": {
            "name": "Estonian",
            "separators": {
                "group": ",",
                "decimal": "."
            }
        },
        "pt_BR": {
            "name": "Brazil",
            "separators": {
                "group": ",",
                "decimal": "."
            }
        },
        "pl": {
            "name": "Polish",
            "separators": {
                "group": ",",
                "decimal": "."
            }
        },
        "it": {
            "name": "Italian",
            "separators": {
                "group": ",",
                "decimal": "."
            }
        },
        "de": {
            "name": "German",
            "separators": {
                "group": ",",
                "decimal": "."
            }
        },
        "id": {
            "name": "Indonesian",
            "separators": {
                "group": ",",
                "decimal": "."
            }
        },
        "fr": {
            "name": "French",
            "separators": {
                "group": ",",
                "decimal": "."
            }
        }
    }
})