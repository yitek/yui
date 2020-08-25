(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../YA"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var YA_1 = require("../../YA");
    debugger;
    var app = new YA_1.default({
        element: document.body,
        template: YA_1.default.createNodeDescriptor("div", { class: "css", style: { color: "red" } }, "Hello Yui.")
    });
});
//# sourceMappingURL=createElement.test.js.map