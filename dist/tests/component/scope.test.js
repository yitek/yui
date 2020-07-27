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
    function Comp1(states) {
        var gender = yui_1.default.localFor(states.genders);
        return yui_1.default.createVNode("select", null,
            yui_1.default.createVNode("option", { for: { each: states.genders, as: gender }, value: gender.value },
                "[states.pre]",
                gender.text));
    }
});
//# sourceMappingURL=scope.test.js.map