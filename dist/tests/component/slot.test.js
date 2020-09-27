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
    function HasSlotComp(states) {
        return YA_1.default.createNodeDescriptor("div", null,
            YA_1.default.createNodeDescriptor("slot", { map: { 'user': states.outer_user, 'profile': states.outer_profile } }));
    }
    function UseSlotComp(states) {
        debugger;
        var slotUser = YA_1.default.local(undefined, 'slot-user');
        var slotProfile = YA_1.default.local(undefined, 'slot-profile');
        return YA_1.default.createNodeDescriptor(HasSlotComp, { outer_user: states.user, outer_profile: states.profile, "slot-map": { "user": slotUser, "profile": slotProfile } },
            YA_1.default.createNodeDescriptor("div", null,
                YA_1.default.createNodeDescriptor("label", null, "\u7528\u6237\u540D"),
                YA_1.default.createNodeDescriptor("span", null, slotUser.name),
                states.message,
                YA_1.default.createNodeDescriptor("label", null, "\u6027\u522B"),
                YA_1.default.createNodeDescriptor("span", null, slotProfile.gender)));
    }
    var app = new YA_1.default({
        element: document.body,
        template: YA_1.default.createNodeDescriptor(UseSlotComp, { user: { name: "yiy" }, profile: { gender: "male" }, message: "[ok]" })
    });
});
//# sourceMappingURL=slot.test.js.map