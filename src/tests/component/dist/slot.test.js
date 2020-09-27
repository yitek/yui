"use strict";
exports.__esModule = true;
var YA_1 = require("../../YA");
function HasSlotComp(states) {
    return React.createElement("div", null,
        React.createElement("slot", { map: { 'user': states.outer_user, 'profile': states.outer_profile } }));
}
function UseSlotComp(states) {
    debugger;
    var slotUser = YA_1["default"].local(undefined, 'slot-user');
    var slotProfile = YA_1["default"].local(undefined, 'slot-profile');
    return React.createElement(HasSlotComp, { outer_user: states.user, outer_profile: states.profile, "slot-map": { "user": slotUser, "profile": slotProfile } },
        React.createElement("div", null,
            React.createElement("label", null, "\u7528\u6237\u540D"),
            React.createElement("span", null, slotUser.name),
            states.message,
            React.createElement("label", null, "\u6027\u522B"),
            React.createElement("span", null, slotProfile.gender)));
}
var app = new YA_1["default"]({
    element: document.body,
    template: React.createElement(UseSlotComp, { user: { name: "yiy" }, profile: { gender: "male" }, message: "[ok]" })
});
