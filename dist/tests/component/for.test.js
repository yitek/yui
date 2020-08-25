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
    function Comp1(states) {
        var change = function (states) {
            states.genders = [{ value: undefined, text: "请选择" }, { value: 10, text: '启用' }, { value: 20, text: '禁用' }];
            debugger;
        };
        var gender = YA_1.default.localFor(states.genders);
        return YA_1.default.createNodeDescriptor("div", null,
            YA_1.default.createNodeDescriptor("select", null,
                YA_1.default.createNodeDescriptor("option", { "for-each": states.genders, "for-as": gender, value: gender.value }, gender.text)),
            YA_1.default.createNodeDescriptor("button", { onclick: change }, "\u53D8\u5316"));
    }
    var app = new YA_1.default({
        element: document.body,
        template: YA_1.default.createNodeDescriptor(Comp1, { inputText: "yi", genders: [{ value: 1, text: 'male' }, { value: 0, text: 'female' }] })
    });
});
//# sourceMappingURL=for.test.js.map