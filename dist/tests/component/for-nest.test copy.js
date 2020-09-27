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
        var col = YA_1.default.localFor(states.cols, 'col');
        var row = YA_1.default.localFor(states.rows, 'row');
        var displayCol = function (row, col) {
            return row[col.name];
        };
        return YA_1.default.createNodeDescriptor("table", { border: "1" },
            YA_1.default.createNodeDescriptor("tbody", null,
                YA_1.default.createNodeDescriptor("tr", { "for-each": states.rows, "for-as": row },
                    YA_1.default.createNodeDescriptor("td", { "for-each": states.cols, "for-as": col }, YA_1.default.computed(row, col, displayCol)))));
    }
    var app = new YA_1.default({
        element: document.body,
        template: YA_1.default.createNodeDescriptor(Comp1, { cols: [{ name: 'id', text: 'id' }, { name: 'mail', text: 'display name' }], rows: [{ id: 1, mail: '1@ya.com' }, { id: 2, mail: '2@ya.com' }] })
    });
});
//# sourceMappingURL=for-nest.test copy.js.map