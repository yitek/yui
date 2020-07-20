(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./mock-fra"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var fra = require("./mock-fra");
    console.group("mock-app.ts");
    console.log("mock-app.ts正在执行,检擦单一引用(fra)，依赖项fra", fra);
    exports.mod = {
        modname: "mock-app"
    };
    console.groupEnd();
});
//# sourceMappingURL=mock-app.js.map