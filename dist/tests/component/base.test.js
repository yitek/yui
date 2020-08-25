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
    var MyComponent = /** @class */ (function () {
        function MyComponent() {
        }
        MyComponent.prototype.onkeypress = function (states, event) {
            states.inputText = event.target.value;
        };
        MyComponent.prototype.template = function (states) {
            return YA_1.default.createNodeDescriptor("div", null,
                YA_1.default.createNodeDescriptor("input", { type: "text", value: states.inputText, onkeyup: this.onkeypress }),
                YA_1.default.createNodeDescriptor("div", null,
                    "\u4F60\u8F93\u5165\u7684\u5B57\u7B26\u662F:",
                    states.inputText));
        };
        return MyComponent;
    }());
    var app = new YA_1.default({
        element: document.body,
        template: YA_1.default.createNodeDescriptor(MyComponent, { inputText: "yi" })
    });
});
//# sourceMappingURL=base.test.js.map