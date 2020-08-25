(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Pipe = /** @class */ (function () {
        function Pipe() {
            this.length = 0;
        }
        Pipe.prototype.pipe = function (name, handler) {
            var len = this.length;
            if (!handler) {
                handler = name;
                name = 'pipe-handler-' + len;
            }
            this.length = len + 1;
            var internalHandler = function (input, states, pipe, nextInfo, resolve, reject) {
                var _a;
                var output = handler(input, states, pipe);
                var isBreak = false;
                if (output instanceof PipeBreak) {
                    isBreak = true;
                    output = output.value;
                }
                if (typeof ((_a = output) === null || _a === void 0 ? void 0 : _a.then) === 'function') {
                    output.then(function (value) {
                        if (nextInfo && !isBreak) {
                            nextInfo.handler(value, states, pipe, nextInfo.next, resolve, reject);
                        }
                        else {
                            resolve(value);
                        }
                    }, reject);
                }
                else {
                    if (nextInfo && !isBreak)
                        nextInfo.handler(output, states, pipe, nextInfo.next, resolve, reject);
                    else
                        resolve(output);
                }
            };
            var info = {
                raw: handler,
                handler: internalHandler
            };
            var tail = this.tail;
            if (!tail)
                this.tail = this.head = info;
            else {
                this.tail = tail.next = info;
            }
            return this;
        };
        Pipe.prototype.pump = function (value, states) {
            var _this = this;
            return new Thenable(function (resolve, reject) {
                var head = _this.head;
                if (!head)
                    return resolve(value);
                head.handler(value, states || {}, _this, head.next, resolve, reject);
            });
        };
        return Pipe;
    }());
    exports.Pipe = Pipe;
    var PipeBreak = /** @class */ (function () {
        function PipeBreak(value) {
            this.value = value;
        }
        return PipeBreak;
    }());
    exports.PipeBreak = PipeBreak;
});
//# sourceMappingURL=pipe.js.map