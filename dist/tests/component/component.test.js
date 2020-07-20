(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../yui"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var yui_1 = require("../yui");
    debugger;
    var app = new yui_1.default({
        element: document.body,
        template: yui_1.default.createVNode("div", null, "Hello Yui.")
    });
});
//# sourceMappingURL=component.test.js.map