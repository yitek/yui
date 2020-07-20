///////////////////////////////////////////////////////////////
// 类型判断
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function is_string(obj) {
        return typeof obj === "string";
    }
    exports.is_string = is_string;
    function is_bool(obj) {
        return typeof obj === "boolean";
    }
    exports.is_bool = is_bool;
    function is_number(obj) {
        return typeof obj === "number";
    }
    exports.is_number = is_number;
    function is_assoc(obj) {
        if (!obj)
            return false;
        return Object.prototype.toString.call(obj) === "[object Object]";
    }
    exports.is_assoc = is_assoc;
    function is_object(obj) {
        if (!obj)
            return false;
        var t = Object.prototype.toString.call(obj);
        if (t.indexOf("[object ") == 0)
            return true;
    }
    exports.is_object = is_object;
    function is_array(obj) {
        if (!obj)
            return false;
        return Object.prototype.toString.call(obj) === "[object Array]";
    }
    exports.is_array = is_array;
    function is_empty(obj) {
        if (!obj)
            return true;
        var t = typeof obj;
        if (t === "function" || t === "number" || t === "boolean")
            return false;
        for (var n in obj)
            return false;
        return true;
    }
    exports.is_empty = is_empty;
    ////////////////////////////////////////////////////////
    // 字符串处理
    var trimreg = /(^\s+)|(\s+$)/g;
    /**
     *  去掉两边空格
     *
     * @export
     * @param {*} text
     * @returns {string}
     */
    function trim(text) {
        if (text === null || text === undefined)
            return "";
        return text.toString().replace(trimreg, "");
    }
    exports.trim = trim;
    var percentRegx = /([+-]?[\d,]+(?:.\d+))%/g;
    /**
     * 是否是百分数
     *
     * @export
     * @param {*} text
     * @returns {number}
     */
    function is_percent(text) {
        if (text === null || text === undefined)
            return undefined;
        var match = text.toString().match(percentRegx);
        if (match)
            return match[1];
    }
    exports.is_percent = is_percent;
    /////////////////////
    // 数组处理
    function array_index(obj, item, start) {
        if (start === void 0) { start = 0; }
        if (!obj)
            return -1;
        for (var i = start, j = obj.length; i < j; i++) {
            if (obj[i] === item)
                return i;
        }
        return -1;
    }
    exports.array_index = array_index;
    function array_contains(obj, item) {
        return array_index(obj, item) >= 0;
    }
    exports.array_contains = array_contains;
    function array_add_unique(arr, item) {
        if (!arr || !arr.push)
            return false;
        for (var i = 0, j = arr.length; i < j; i++) {
            if (arr[i] === item)
                return false;
        }
        arr.push(item);
        return true;
    }
    exports.array_add_unique = array_add_unique;
    function array_remove(arr, item) {
        if (!arr || !arr.push || !arr.shift)
            return false;
        var hasItem = false;
        for (var i = 0, j = arr.length; i < j; i++) {
            var existed = arr.shift();
            if (existed !== item)
                arr.push(existed);
            else
                hasItem = true;
        }
        return hasItem;
    }
    exports.array_remove = array_remove;
    ///////////////////////////////////////
    // 对象处理
    exports.extend = function () {
        var target = arguments[0] || {};
        for (var i = 1, j = arguments.length; i < j; i++) {
            var o = arguments[i];
            if (o)
                for (var n in o)
                    target[n] = o[n];
        }
        return target;
    };
    function implicit(target, members) {
        function _implicit(target, name, value) {
            if (name === undefined) {
                target = target.prototype || target;
                for (var n in target)
                    Object.defineProperty(target, n, { enumerable: false, writable: true, configurable: true, value: value === undefined ? target[n] : value });
            }
            Object.defineProperty(target, name, { enumerable: false, writable: true, configurable: true, value: value === undefined ? target[name] : value });
        }
        //作为装饰器工厂调用
        if (target === undefined)
            return _implicit;
        //将整个对象成员变成不可枚举
        if (!members) {
            for (var n in target)
                Object.defineProperty(target, n, { enumerable: false, writable: true, configurable: true, value: target[n] });
            return;
        }
        //指定成员对象，noenumerable(obj,['a','b'])
        if (is_array(members)) {
            for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
                var name_1 = members_1[_i];
                Object.defineProperty(target, name_1, { enumerable: false, configurable: true, writable: true, value: target[name_1] });
            }
            return;
        }
        for (var n in members)
            Object.defineProperty(target, n, { enumerable: false, configurable: true, writable: true, value: members[n] });
    }
    var cidSeeds = {};
    function cid(name) {
        if (name === undefined)
            name = "cid";
        var seed = cidSeeds[name];
        if (seed === undefined)
            seed = cidSeeds[name] = 0;
        if (++seed > 2100000000) {
            seed = -2100000000;
            cidSeeds[name] = seed;
        }
        return name + "!{seed}";
    }
    ////////////////////////////////////////////////////////////////////////////////////
    //
    // Fulfill
    //
    var FulfillStates;
    (function (FulfillStates) {
        FulfillStates[FulfillStates["padding"] = 0] = "padding";
        FulfillStates[FulfillStates["fulfilled"] = 1] = "fulfilled";
        FulfillStates[FulfillStates["rejected"] = 2] = "rejected";
    })(FulfillStates = exports.FulfillStates || (exports.FulfillStates = {}));
    var IFulfill = /** @class */ (function () {
        function IFulfill() {
        }
        return IFulfill;
    }());
    exports.IFulfill = IFulfill;
    function disposable(obj) {
        obj.dispose = function (handler) {
            var disposeHandlers = this["$-dispose-handlers"];
            if (disposeHandlers === null)
                throw new Error("已经被释放，不能再调用dispose");
            if (handler === undefined) {
                this["$-dispose-handlers"] = null;
                if (disposeHandlers)
                    for (var _i = 0, disposeHandlers_1 = disposeHandlers; _i < disposeHandlers_1.length; _i++) {
                        var dHandler = disposeHandlers_1[_i];
                        dHandler.call(this);
                    }
            }
            else {
                if (disposeHandlers === undefined) {
                    Object.defineProperty(this, "$-dispose-handlers", { enumerable: false, configurable: true, writable: true, value: disposeHandlers = [] });
                }
                disposeHandlers.push(handler);
            }
            return this;
        };
        return obj;
    }
    exports.disposable = disposable;
    var Subect = /** @class */ (function () {
        function Subect() {
        }
        Subect.prototype.subscribe = function (topic, listener, refObject) {
            if (listener === undefined) {
                listener = topic;
                topic = "";
                refObject = undefined;
            }
            else if (listener.dispose) {
                refObject = listener;
                listener = topic;
                topic = "";
            }
            if (typeof listener !== "function")
                throw new Error("subject\u7684lisntener\u5FC5\u987B\u662F\u51FD\u6570");
            var topics = this["$-subject-topics"];
            if (!topics)
                Object.defineProperty(this, "$-subject-topics", { enumerable: false, writable: false, configurable: false, value: topics = this["$-subject-topics"] = {} });
            var listeners = topics[topic] || (topics[topic] = []);
            listeners.push(listener);
            if (refObject) {
                refObject.dispose(function () {
                    array_remove(listeners, listener);
                });
            }
            return this;
        };
        Subect.prototype.unsubscribe = function (topic, listener) {
            if (listener === undefined) {
                listener = topic;
                topic = "";
            }
            var topics = this["$-subject-topics"];
            if (topics) {
                var listeners = topics[topic];
                array_remove(listeners, listener);
            }
            return this;
        };
        Subect.prototype.notify = function (topic, evt) {
            var evts = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                evts[_i - 2] = arguments[_i];
            }
            var topics = this["$-subject-topics"];
            if (!topics)
                return this;
            var listeners, ckIndex;
            if (typeof topic !== "string") {
                listeners = topics[""];
                ckIndex = 1;
            }
            else {
                listeners = topics[topic];
                ckIndex = 2;
            }
            if (!listeners)
                return this;
            var args, useApply;
            if (arguments[ckIndex] !== undefined) {
                args = [];
                useApply = true;
                for (var i = 0, j = arguments.length; i < j; i++)
                    args.push(arguments[i]);
            }
            else
                args = arguments[ckIndex - 1];
            for (var i = 0, j = listeners.length; i < j; i++) {
                var handler = listeners[i];
                if (useApply)
                    handler.apply(this, args);
                else
                    handler.call(this, args);
            }
            return this;
        };
        Subect.mixin = function (target) {
            for (var n in Subect.prototype)
                target[n] = Subect.prototype[n];
            return target;
        };
        return Subect;
    }());
    exports.Subect = Subect;
    var SchemaTypes;
    (function (SchemaTypes) {
        SchemaTypes[SchemaTypes["value"] = 0] = "value";
        SchemaTypes[SchemaTypes["object"] = 1] = "object";
        SchemaTypes[SchemaTypes["array"] = 2] = "array";
    })(SchemaTypes = exports.SchemaTypes || (exports.SchemaTypes = {}));
    var Schema = /** @class */ (function () {
        function Schema(defaultValue, ownSchema, name) {
            if (defaultValue === Schema_1)
                return;
            if (defaultValue && defaultValue.$schemaType !== undefined)
                defaultValue = defaultValue.$schemaDefaultValue;
            var names = [];
            if (ownSchema) {
                for (var _i = 0, _a = ownSchema.$schemaNames; _i < _a.length; _i++) {
                    var n = _a[_i];
                    names.push(n);
                }
                names.push(name);
            }
            implicit(this, {
                "$ownSchema": ownSchema,
                "$schemaName": name,
                "$schemaDefaultValue": defaultValue,
                "$schemaType": SchemaTypes.value,
                "$schemaNames": names,
                "$-schema-root": undefined,
                "$reactiveRootName": undefined
            });
            var t = typeof defaultValue;
            if (t === "object") {
                if (is_array(defaultValue)) {
                    this.asArray(defaultValue[0]);
                }
                else {
                    for (var n in defaultValue) {
                        this.defineProp(n, defaultValue[n]);
                    }
                }
            }
        }
        Schema_1 = Schema;
        Schema.prototype.defineProp = function (name, propDefaultValue) {
            if (this.$schemaType === SchemaTypes.value) {
                this.$schemaType = SchemaTypes.object;
                if (this.$schemaDefaultValue === undefined)
                    this.$schemaDefaultValue = {};
            }
            else if (this.$schemaType === SchemaTypes.array) {
                throw new Error("\u5DF2\u7ECF\u662Farray\u4E86\uFF0C\u4E0D\u53EF\u4EE5\u518D\u5B9A\u4E49\u5C5E\u6027");
            }
            if (propDefaultValue === undefined) {
                propDefaultValue = this.$schemaDefaultValue ? this.$schemaDefaultValue[name] : undefined;
            }
            var propSchema = new Schema_1(propDefaultValue, this, name);
            this[name] = propSchema;
            return propSchema;
        };
        Schema.prototype.asArray = function (dftItemValue) {
            if (this.$arrayItemSchema && dftItemValue === undefined)
                return this.$arrayItemSchema;
            if (this.$schemaType !== SchemaTypes.value) {
                throw new Error("\u5DF2\u7ECF\u662Farray/object\u4E86\uFF0C\u4E0D\u53EF\u4EE5\u518D\u5B9A\u4E49item");
            }
            this.$schemaType = SchemaTypes.array;
            var itemSchema = new Schema_1(dftItemValue, this);
            Object.defineProperty(this, "$arrayItemSchema", { value: itemSchema, writable: true, enumerable: false, configurable: false });
            var lengthSchema = new Schema_1(0, this, "length");
            Object.defineProperty(this, "length", { value: lengthSchema, enumerable: false, writable: true, configurable: false });
            return itemSchema;
        };
        Schema.prototype.getRootSchema = function () {
            var root = this["$-schema-root"];
            if (!root) {
                root = this;
                while (root.$ownSchema) {
                    root = root.$ownSchema;
                }
                this["$-schema-root"] = root;
            }
            return root;
        };
        Schema.prototype.getValueByPath = function (target) {
            var names = this.$schemaNames;
            var value = target;
            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                var name_2 = names_1[_i];
                value = value[name_2];
                if (value === undefined)
                    return value;
            }
            return value;
        };
        Schema.prototype.createReactive = function (ownOrValue) {
            return new Reactive(ownOrValue, this);
        };
        var Schema_1;
        Schema = Schema_1 = __decorate([
            implicit()
        ], Schema);
        return Schema;
    }());
    exports.Schema = Schema;
    var Reactive = /** @class */ (function (_super) {
        __extends(Reactive, _super);
        function Reactive(ownOrValue, schema, name) {
            var _a;
            var _this = _super.call(this) || this;
            name = name === undefined ? (_a = schema) === null || _a === void 0 ? void 0 : _a.$schemaName : name;
            var own, value;
            if (ownOrValue instanceof Reactive_1) {
                own = ownOrValue;
                var ownValue = own.$reactiveValue;
                if (ownValue)
                    value = ownValue[name];
            }
            else if (ownOrValue !== Reactive_1) {
                value = ownOrValue;
            }
            if (value === undefined && schema)
                value = schema.$schemaDefaultValue;
            implicit(_this, {
                "$reactiveName": name,
                "$schema": schema,
                "$ownReactive": own,
                "$reactiveType": schema ? schema.$schemaType : SchemaTypes.value,
                "$reactiveValue": value
            });
            if (ownOrValue === Reactive_1)
                return _this;
            if (schema.$schemaType === SchemaTypes.object) {
                if (typeof value !== "object")
                    value = {};
                Object.defineProperty(_this, "$reactiveValue", { enumerable: false, writable: true, configurable: true, value: value });
                for (var n in schema) {
                    var fc = n[0];
                    if (n === "constructor" || fc === "$" || fc === "_" || fc === "-")
                        continue;
                    var subReacitve = new Reactive_1(_this, schema[n], n);
                    _this[n] = subReacitve;
                }
            }
            else if (schema.$schemaType === SchemaTypes.array) {
                if (typeof value !== "object")
                    value = [];
                Object.defineProperty(_this, "$reactiveValue", { enumerable: false, writable: true, configurable: true, value: value });
                for (var i = 0, j = value.length; i < j; i++) {
                    var itemReacitve = new Reactive_1(_this, schema.$arrayItemSchema, i);
                    _this[i] = itemReacitve;
                }
                for (var n in schema) {
                    if (!/^\d+$/.test(n))
                        continue;
                    if (!_this[n]) {
                        var itemReacitve = new Reactive_1(_this, schema.$arrayItemSchema, n);
                        _this[n] = itemReacitve;
                    }
                }
                var lengthReactive = new Reactive_1(_this, schema.length);
                Object.defineProperty(_this, "length", { configurable: false, writable: true, enumerable: false, value: lengthReactive });
            }
            else {
                Object.defineProperty(_this, "$reactiveValue", { enumerable: false, writable: true, configurable: true, value: value });
            }
            return _this;
        }
        Reactive_1 = Reactive;
        Reactive.prototype.update = function (value, src) {
            var schemaType = this.$schema.$schemaType;
            if (schemaType === SchemaTypes.object) {
                updateObject(this, value, src);
            }
            else if (schemaType === SchemaTypes.array) {
                updateArray(this, value, src);
            }
            else {
                var old = this.$reactiveValue;
                if (value === old)
                    return this;
                this.$reactiveValue = value;
                if (this.$ownReactive) {
                    this.$ownReactive.$reactiveValue[this.$reactiveName] = value;
                }
                this.notify("", {
                    value: value, old: old, src: src || this, sender: this
                });
            }
            return this;
        };
        Reactive.prototype.get = function () {
            var schemaType = this.$schema.$schemaType;
            if (schemaType === SchemaTypes.object) {
                var result = {};
                for (var n in this) {
                    var reactive = this[n];
                    if (reactive instanceof Reactive_1)
                        result[n] = reactive.get();
                }
                return result;
            }
            else if (schemaType === SchemaTypes.array) {
                var result = [];
                for (var n in this) {
                    var reactive = this[n];
                    if (n !== "length" && reactive instanceof Reactive_1)
                        result.push(reactive.get());
                }
                return result;
            }
            else {
                return this.$reactiveValue;
            }
        };
        var Reactive_1;
        Reactive = Reactive_1 = __decorate([
            implicit()
        ], Reactive);
        return Reactive;
    }(Subect));
    exports.Reactive = Reactive;
    var ConstantReactive = /** @class */ (function (_super) {
        __extends(ConstantReactive, _super);
        function ConstantReactive(value, name) {
            var _this = _super.call(this, Reactive, undefined) || this;
            _this.$reactiveValue = value;
            _this.$reactiveName = name;
            return _this;
        }
        ConstantReactive.prototype.subscribe = function (topic, listener, refObj) {
            return this;
        };
        ConstantReactive.prototype.unsubscribe = function (topic, listener) {
            return this;
        };
        ConstantReactive.prototype.notify = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return this;
        };
        ConstantReactive.prototype.get = function () { return this.$reactiveValue; };
        ConstantReactive.prototype.update = function (value) {
            console.warn("\u5728ConstantReactive\u4E0A\u8C03\u7528\u4E86update\u64CD\u4F5C,\u5FFD\u7565\u3002", this, value);
            return this;
        };
        ConstantReactive = __decorate([
            implicit()
        ], ConstantReactive);
        return ConstantReactive;
    }(Reactive));
    exports.ConstantReactive = ConstantReactive;
    function updateObject(reactive, value, src) {
        var old = reactive.$reactiveValue;
        value || (value = {});
        reactive.$reactiveValue = value;
        if (reactive.$ownReactive) {
            reactive.$ownReactive.$reactiveValue[reactive.$reactiveName] = value;
        }
        var event = {
            value: value, old: old, sender: reactive, src: src || reactive
        };
        if (old !== value) {
            reactive.notify(event);
            if (event.cancel)
                return reactive;
        }
        var keys = Object.keys(value);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var n = keys_1[_i];
            var propReacitve = reactive[n];
            if (propReacitve instanceof Reactive) {
                propReacitve.update(value[n], event);
            }
        }
        return reactive;
    }
    function updateArray(reactive, value, src) {
        var old = reactive.$reactiveValue;
        value || (value = []);
        reactive.$reactiveValue = value;
        if (reactive.$ownReactive) {
            reactive.$ownReactive.$reactiveValue[reactive.$reactiveName] = value;
        }
        var event = {
            value: value, old: old, src: src || reactive, sender: reactive
        };
        var lengthReactive = reactive.length;
        var oldLength = lengthReactive.$reactiveValue;
        var newLength = value.length;
        var appends = [];
        var removes = [];
        var updates = [];
        for (var i = 0, j = oldLength; i < j; i++) {
            var existsReactive = reactive[i];
            var changeItem = { index: i, value: value[i], reactive: existsReactive };
            if (i < newLength) {
                updates.push(changeItem);
            }
            else {
                removes.push(changeItem);
                delete reactive[i];
            }
        }
        for (var i = oldLength, j = newLength - oldLength; i < j; i++) {
            var newItemReactive = new Reactive(reactive, reactive.$schema.$arrayItemSchema, i);
            Object.defineProperty(reactive, i, { value: newItemReactive });
            appends.push({ value: value[i], reactive: newItemReactive, index: i });
        }
        event.appends = appends.length ? appends : null;
        event.removes = removes.length ? removes : null;
        event.updates = updates.length ? updates : null;
        if (value !== old || appends.length || removes.length) {
            reactive.notify(event);
            if (event.cancel)
                return reactive;
        }
        for (var _i = 0, updates_1 = updates; _i < updates_1.length; _i++) {
            var item = updates_1[_i];
            item.reactive.update(item.value, event);
        }
    }
    function _createVNode(tag, attrs) {
        var vnode = {};
        var tagType = typeof tag;
        if (tagType === "string")
            vnode.tag = tag;
        else if (tagType === "function")
            vnode.component = tag;
        else {
            vnode.content = attrs;
            return vnode;
        }
        vnode.attrs = attrs;
        var children;
        for (var i = 2; i < arguments.length; i++) {
            var child = arguments[i];
            if (!children)
                children = [];
            if (typeof child === "string")
                children.push({ content: child });
            else
                children.push(child);
        }
        vnode.children = children;
        return vnode;
    }
    exports.createVNode = _createVNode;
    globalThis.createVNode = exports.createVNode;
    var proxyHandlers = {
        get: function (obj, name) {
            if (name === "$-schema-proxy-raw")
                return obj;
            var value = obj[name];
            if (value === undefined)
                return createSchemaProxy(obj.defineProp(name));
            var ch = name[0];
            if (ch === "$" || ch === "_" || ch === "-")
                return value;
            if (value instanceof Schema)
                return createSchemaProxy(value);
            return value;
        }
    };
    function createSchemaProxy(schema, defaultValue) {
        if (defaultValue !== undefined)
            schema.$schemaDefaultValue = defaultValue;
        return new Proxy(schema, proxyHandlers);
    }
    var renderStack = [];
    function enumerator(arraySchema) {
        if (arraySchema)
            return arraySchema.asArray();
        var context = renderStack.pop();
        renderStack.push(context);
    }
    exports.enumerator = enumerator;
    function buildUI(vnode, ownComponent) {
        var componentType;
        if (vnode.tag) {
            componentType = exports.componentTypes[vnode.tag];
        }
        else
            componentType = vnode.component;
        if (componentType) {
            return buildComponent(componentType, vnode.attrs, vnode.children, ownComponent);
        }
        else {
            if (vnode.tag)
                return buildElement(vnode.tag, vnode.attrs, vnode.children, ownComponent);
            else
                return buildText(vnode.content, ownComponent);
        }
    }
    function buildComponent(compoentType, vm, children, ownComponent) {
        var component = createComponent(compoentType, ownComponent, vm);
        var elem = component.$element = buildUI(component.$meta.vnode, component);
        if (component.render) {
            var newElem = component.render(elem, vm);
            if (newElem)
                elem = newElem;
        }
        Object.defineProperty(elem, "$-yui-component", { value: component });
        return elem;
    }
    function createComponent(componentType, ownComponent, vm) {
        var component = new componentType();
        if (!component.dispose) {
            disposable(component);
        }
        component.$ownComponent = ownComponent;
        sureComponentMeta(component, componentType, vm);
        var states = component.$meta.stateSchema.createReactive();
        component.$reactives = { "": states };
        return component;
    }
    function sureComponentMeta(component, componentType, vm) {
        var meta = componentType.prototype.$meta || (componentType.prototype.$meta = { reactives: {} });
        var vnode = meta.vnode;
        if (vnode === undefined) {
            var schema = meta.stateSchema;
            if (!schema)
                schema = meta.stateSchema = new Schema(undefined);
            schema.$reactiveRootName = "";
            var proxy = createSchemaProxy(schema, vm);
            vnode = meta.vnode = typeof component.template === "function" ? component.template(proxy) : component.template;
        }
        return meta;
    }
    function bindComponentStates(component, attrs) {
        var _a;
        var states = component.$reactives[""];
        var ownReactives = (_a = component.$ownComponent) === null || _a === void 0 ? void 0 : _a.$reactives;
        for (var attrName in attrs)
            (function (attrName, bindValue, states) {
                if (bindValue && bindValue["$-schema-proxy-raw"])
                    bindValue = bindValue["$-schema-proxy-raw"];
                var vmProp = states[attrName];
                if (!vmProp) {
                    debugger;
                    var bindVal = bindValue ? (bindValue.$reactiveType !== undefined ? bindValue.$reactiveValue : bindValue) : bindValue;
                    vmProp = states[attrName] = new ConstantReactive(bindVal, attrName);
                }
                if (bindValue instanceof Schema) {
                    var bindValueReactive = bindValue.getValueByPath(ownReactives[bindValue.getRootSchema().$reactiveRootName]);
                    var handler = function (e) {
                        var propReactive = states[attrName];
                        if (propReactive instanceof Reactive) {
                            propReactive.update(e.value);
                        }
                    };
                    //外面的变化后，触发里面的变化
                    bindValueReactive.subscribe(handler, component);
                }
                else
                    vmProp.$reactiveValue = bindValue;
            })(attrName, attrs[attrName], states);
    }
    var eventNameRegx = /^on/g;
    function buildElement(tag, attrs, children, ownComponent) {
        var states = ownComponent.$reactives;
        var elem = document.createElement(tag);
        var _loop_1 = function (attrName) {
            var attrValue = attrs[attrName];
            //将代理去掉，获取原始的schema
            if (attrValue && attrValue["$-schema-proxy-raw"])
                attrValue = attrValue["$-schema-proxy-raw"];
            var binder = exports.binders[attrName];
            var state = void 0;
            if (attrValue.$schemaType !== undefined) {
                var rootSchema = attrValue.getRootSchema();
                var rootState = states[rootSchema.$reactiveRootName];
                state = attrValue.getValueByPath(rootState);
            }
            else {
                if (binder) {
                    state = new ConstantReactive(attrValue);
                }
            }
            if (eventNameRegx.test(attrName) && elem[attrName] === null) {
                bindEvent(elem, attrName, state || attrValue, ownComponent);
                return "break";
            }
            if (binder) {
                binder(ownComponent, elem, attrName, state);
            }
            else {
                var propName_1 = attributeConvertNames[attrName] || attrName;
                elem[propName_1] = state ? state.get() : attrValue;
                if (state)
                    state.subscribe(function (e) {
                        elem[propName_1] = e.value;
                    }, ownComponent);
            }
        };
        for (var attrName in attrs) {
            var state_1 = _loop_1(attrName);
            if (state_1 === "break")
                break;
        }
        if (children)
            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                var child = children_1[_i];
                var childElement = void 0;
                if (!child)
                    continue;
                if (child["$-schema-proxy-raw"]) {
                    var c = child["$-schema-proxy-raw"];
                    childElement = buildText(c, ownComponent);
                }
                else if (child.$schemaType !== undefined) {
                    childElement = buildText(child, ownComponent);
                }
                else if (child.component) {
                    childElement = buildComponent(child.component, child.attrs, children, ownComponent);
                }
                else {
                    childElement = buildUI(child, ownComponent);
                }
                elem.appendChild(childElement);
            }
        return elem;
    }
    function bindEvent(element, evtName, handler, ownComponent) {
        element[evtName] = function (e) {
            var statesReactive = ownComponent.$reactives[""];
            var states = statesReactive.get();
            var evtHandler = handler.$reactiveValue || handler;
            var newStates = evtHandler.call(ownComponent, states, e);
            if (newStates === undefined)
                newStates = states;
            statesReactive.update(newStates);
        };
    }
    function buildText(bindValue, ownComponent) {
        if (bindValue && bindValue.$schemaType !== undefined) {
            var root = bindValue.getRootSchema();
            var rootReactive = ownComponent.$reactives[root.$reactiveRootName];
            var reactive = bindValue.getValueByPath(rootReactive);
            var node_1 = document.createTextNode(reactive.$reactiveValue);
            var handler = function (e) {
                node_1.nodeValue = e.value;
            };
            reactive.subscribe(handler);
            return node_1;
        }
        else {
            return document.createTextNode(bindValue);
        }
    }
    exports.binders = {};
    exports.binders.style = function (ownComponent, element, attrName, reactive) {
        function setStyles(elem, styles) {
            var t = typeof styles;
            if (t === "string") {
                elem.style.cssText = styles;
            }
            else if (styles) {
                for (var n in styles) {
                    var value = styles[n];
                    elem.style[n] = value;
                }
            }
        }
        reactive.subscribe(function (e) {
            setStyles(element, e.value);
        });
        setStyles(element, reactive.$reactiveValue);
        for (var n in reactive) {
            var sub = reactive[n];
            if (sub instanceof Reactive)
                (function (name, bindValue) {
                    bindValue.subscribe(function (e) {
                        var value = e.value;
                        element.style[name] = value;
                    });
                })(n, sub);
        }
    };
    exports.componentTypes = {};
    var attributeConvertNames = {
        "class": "className"
    };
    var Yui = /** @class */ (function () {
        function Yui(opts) {
            this.opts = opts;
            debugger;
            var elem = this.$element = buildUI(opts.template, this);
            Object.defineProperty(elem, "$yui", { enumerable: false, writable: true, configurable: true, value: this });
            if (opts.element) {
                opts.element.innerHTML = "";
                opts.element.appendChild(elem);
            }
        }
        return Yui;
    }());
    exports.Yui = Yui;
    var YUI = Yui;
    YUI.createVNode = exports.createVNode;
    YUI.componentTypes = exports.componentTypes;
    YUI.binders = exports.binders;
    exports.default = globalThis.Yui = YUI;
});
//# sourceMappingURL=yui.js.map