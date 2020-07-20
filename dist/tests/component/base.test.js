(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../yui"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var yui_1 = require("../../yui");
    var MyComponent = /** @class */ (function () {
        function MyComponent() {
        }
        MyComponent.prototype.onkeypress = function (states, event) {
            states.inputText = event.target.value;
        };
        MyComponent.prototype.template = function (states) {
            return yui_1.default.createVNode("div", null,
                yui_1.default.createVNode("input", { type: "text", value: states.inputText, onkeyup: this.onkeypress }),
                yui_1.default.createVNode("div", null,
                    "\u4F60\u8F93\u5165\u7684\u5B57\u7B26\u662F:",
                    states.inputText));
        };
        return MyComponent;
    }());
    var app = new yui_1.default({
        element: document.body,
        template: yui_1.default.createVNode(MyComponent, { inputText: "yi" })
    });
});
//# sourceMappingURL=base.test.js.map