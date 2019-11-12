Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@sentry/core");
var utils_1 = require("@sentry/utils");
var helpers_1 = require("../helpers");
var parsers_1 = require("../parsers");
var tracekit_1 = require("../tracekit");
/** Global handlers */
var GlobalHandlers = /** @class */ (function () {
    /** JSDoc */
    function GlobalHandlers(options) {
        /**
         * @inheritDoc
         */
        this.name = GlobalHandlers.id;
        this._options = tslib_1.__assign({ onerror: true, onunhandledrejection: true }, options);
    }
    /**
     * @inheritDoc
     */
    GlobalHandlers.prototype.setupOnce = function () {
        Error.stackTraceLimit = 50;
        tracekit_1._subscribe(function (stack, _, error) {
            // TODO: use stack.context to get a valuable information from TraceKit, eg.
            // [
            //   0: "  })"
            //   1: ""
            //   2: "  function foo () {"
            //   3: "    Sentry.captureException('some error')"
            //   4: "    Sentry.captureMessage('some message')"
            //   5: "    throw 'foo'"
            //   6: "  }"
            //   7: ""
            //   8: "  function bar () {"
            //   9: "    foo();"
            //   10: "  }"
            // ]
            if (helpers_1.shouldIgnoreOnError()) {
                return;
            }
            var self = core_1.getCurrentHub().getIntegration(GlobalHandlers);
            if (self) {
                core_1.getCurrentHub().captureEvent(self._eventFromGlobalHandler(stack), {
                    data: { stack: stack },
                    originalException: error,
                });
            }
        });
        if (this._options.onerror) {
            utils_1.logger.log('Global Handler attached: onerror');
            tracekit_1._installGlobalHandler();
        }
        if (this._options.onunhandledrejection) {
            utils_1.logger.log('Global Handler attached: onunhandledrejection');
            tracekit_1._installGlobalUnhandledRejectionHandler();
        }
    };
    /**
     * This function creates an Event from an TraceKitStackTrace.
     *
     * @param stacktrace TraceKitStackTrace to be converted to an Event.
     */
    GlobalHandlers.prototype._eventFromGlobalHandler = function (stacktrace) {
        if (!utils_1.isString(stacktrace.message) && stacktrace.mechanism !== 'onunhandledrejection') {
            // There are cases where stacktrace.message is an Event object
            // https://github.com/getsentry/sentry-javascript/issues/1949
            // In this specific case we try to extract stacktrace.message.error.message
            var message = stacktrace.message;
            stacktrace.message =
                message.error && utils_1.isString(message.error.message) ? message.error.message : 'No error message';
        }
        var event = parsers_1.eventFromStacktrace(stacktrace);
        var data = {
            mode: stacktrace.mode,
        };
        if (stacktrace.message) {
            data.message = stacktrace.message;
        }
        if (stacktrace.name) {
            data.name = stacktrace.name;
        }
        var client = core_1.getCurrentHub().getClient();
        var maxValueLength = (client && client.getOptions().maxValueLength) || 250;
        var fallbackValue = stacktrace.original
            ? utils_1.truncate(JSON.stringify(utils_1.normalize(stacktrace.original)), maxValueLength)
            : '';
        var fallbackType = stacktrace.mechanism === 'onunhandledrejection' ? 'UnhandledRejection' : 'Error';
        // This makes sure we have type/value in every exception
        utils_1.addExceptionTypeValue(event, fallbackValue, fallbackType, {
            data: data,
            handled: false,
            type: stacktrace.mechanism,
        });
        return event;
    };
    /**
     * @inheritDoc
     */
    GlobalHandlers.id = 'GlobalHandlers';
    return GlobalHandlers;
}());
exports.GlobalHandlers = GlobalHandlers;
//# sourceMappingURL=globalhandlers.js.map