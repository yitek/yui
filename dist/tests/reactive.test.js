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
    var yui = require("../yui");
    var vm = {
        pageIndex: 1,
        pageSize: 5,
        filter: {
            keyword: "",
            userid: "guid",
            provincies: ['sc', 'cq'],
            createTime_min: "2020-5-3",
            createTime_max: "2020-7-15"
        },
        total: 0,
        rows: [
            { __DEF__: true, id: "guid", name: "yiy", creator: { id: "guid", displayName: "yiy" }, createTime: "2020-6-1", provice: "cq" }
        ],
        permissions: {
            id: "readonly", name: "readonly"
        }
    };
    console.group("测试Schema");
    var schema = (new yui.Schema(vm));
    console.log("创建了一个schema", schema, vm);
    var reactive = schema.createReactive();
    console.log("\u521B\u5EFA\u4E86\u4E00\u4E2Areactive", reactive);
    var old = reactive.get();
    console.log("\u4ECEreactive\u4E2D\u83B7\u53D6\u6570\u636E", old);
    reactive.filter.keyword.subscribe(function (e) {
        console.log('root.filter.keyword的值发生了变化', e.value, e);
    });
    reactive.update({ pageIndex: 2, filter: { keyword: "yiy" }, rows: [{ __DEF__: 1, id: "1", name: "yi", creator: { id: "2", displayName: "y" }, createTime: "2020-6-2", provice: "sc" }] });
    console.log("\u7ED9reactive\u66F4\u65B0\u6570\u636E", reactive.get());
    console.groupEnd();
});
//# sourceMappingURL=reactive.test.js.map