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
    /**
     * 判定字符串是否以某个串开始
     *
     * @export
     * @param {*} text 要判定的字符串
     * @param {*} token 开始标记字符串
     * @returns {boolean}
     */
    function startWith(text, token) {
        if (!text)
            return false;
        if (token === undefined || token === null)
            return false;
        return text.toString().indexOf(token.toString()) === 0;
    }
    exports.startWith = startWith;
    /**
     * 判定字符串是否以某个串结束
     *
     * @export
     * @param {*} text 要检测的字符串
     * @param {*} token 结束标记字符串
     * @returns {boolean}
     */
    function endWith(text, token) {
        if (!text)
            return false;
        if (token === undefined || token === null)
            return false;
        text = text.toString();
        token = token.toString();
        return text.indexOf(token) === text.length - token.length;
    }
    exports.endWith = endWith;
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
    function deepClone(obj, _clones) {
        var t = typeof obj;
        if (t === 'object') {
            if (!_clones)
                _clones = [];
            else
                for (var _i = 0, _clones_1 = _clones; _i < _clones_1.length; _i++) {
                    var cloneInfo = _clones_1[_i];
                    if (cloneInfo.origin === obj)
                        return cloneInfo.cloned;
                }
            var clone = is_array(obj) ? [] : {};
            _clones.push({ origin: obj, cloned: clone });
            for (var n in obj) {
                clone[n] = deepClone(obj[n], _clones);
            }
        }
        else
            return obj;
    }
    exports.deepClone = deepClone;
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
    function accessable(desc, target, name, value) {
        // 标记用法 @notation() 
        if (target === undefined)
            return function (target, name) {
                if (name === undefined) {
                    // 标记应用在class或object上 
                    // @notation() class T {}
                    target = target.prototype || target;
                    for (var n_1 in target) {
                        desc.value = target[n_1];
                        Object.defineProperty(target, n_1, desc);
                    }
                }
                else {
                    // 标记应用在成员上
                    // class T { @notation() id:string;} 
                    desc.value = target[name];
                    Object.defineProperty(target, name, desc);
                }
            };
        if (name === undefined) {
            // 指定对象所有成员的可访问性
            // implicit({name:''})
            for (var n_2 in target) {
                desc.value = target[n_2];
                Object.defineProperty(target, n_2, desc);
            }
            return target;
        }
        if (typeof name === 'object') {
            if (is_array(name)) {
                for (var _i = 0, name_1 = name; _i < name_1.length; _i++) {
                    var membername = name_1[_i];
                    desc.value = target[membername];
                    Object.defineProperty(target, membername, desc);
                }
            }
            else {
                for (var n in name) {
                    desc.value = name[n];
                    Object.defineProperty(target, n, desc);
                }
            }
            return target;
        }
        desc.value = value;
        Object.defineProperty(target, name, desc);
        return target;
    }
    exports.accessable = accessable;
    /**
     * 将成员变成隐式成员
     * 不会被for循环到
     * 但外部还是可以修改
     *
     * @export
     * @param {*} [target]
     * @param {*} [name]
     * @param {*} [value]
     * @returns
     */
    function implicit(target, name, value) {
        return accessable({ enumerable: false, writable: true, configurable: true }, target, name, value);
    }
    exports.implicit = implicit;
    function constant(enumerable, target, name, value) {
        return accessable({ enumerable: enumerable !== false, writable: false, configurable: true }, target, name, value);
    }
    exports.constant = constant;
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
        else {
            cidSeeds[name] = seed;
        }
        return "" + name + seed;
    }
    var Exception = /** @class */ (function (_super) {
        __extends(Exception, _super);
        function Exception(message, infos) {
            var _this = _super.call(this, message) || this;
            if (infos)
                for (var n in infos)
                    _this[n] = infos[n];
            return _this;
        }
        return Exception;
    }(Error));
    exports.Exception = Exception;
    ////////////////////////////////////////////////////////////////////////////////////
    //
    // Fulfill
    //
    var FulfillStates;
    (function (FulfillStates) {
        FulfillStates[FulfillStates["padding"] = 0] = "padding";
        FulfillStates[FulfillStates["fulfilled"] = 1] = "fulfilled";
        FulfillStates[FulfillStates["rejected"] = 2] = "rejected";
    })(FulfillStates || (FulfillStates = {}));
    var IFulfillInternalData = /** @class */ (function () {
        function IFulfillInternalData() {
        }
        return IFulfillInternalData;
    }());
    var Thenable = /** @class */ (function () {
        function Thenable(process) {
            var _this = this;
            var status = FulfillStates.padding;
            var resolveCallbacks = undefined;
            var rejectCallbacks = undefined;
            var fulfillValue = undefined;
            var resolve = function (value) {
                var _a;
                if (status !== FulfillStates.padding)
                    throw new TypeError('已经处于终值状态,不能再调用resolve');
                if (fulfillValue)
                    throw new TypeError('已经调用过resolve,传入的是Thenable');
                if (value === _this)
                    throw TypeError('不能resolve自己');
                if (typeof ((_a = value) === null || _a === void 0 ? void 0 : _a.then) === 'function') {
                    value.then(resolve, reject);
                    return _this;
                }
                if (resolveCallbacks)
                    setTimeout(function () {
                        for (var _i = 0, resolveCallbacks_1 = resolveCallbacks; _i < resolveCallbacks_1.length; _i++) {
                            var handler = resolveCallbacks_1[_i];
                            handler(fulfillValue);
                        }
                    }, 0);
                return _this;
            }; //end resolve
            var reject = function (err) {
                if (status !== FulfillStates.padding)
                    throw new TypeError('已经处于终值状态,不能再调用resolve');
                if (fulfillValue)
                    throw new TypeError('已经调用过resolve,传入的是Thenable');
                if (rejectCallbacks)
                    setTimeout(function () {
                        for (var _i = 0, rejectCallbacks_1 = rejectCallbacks; _i < rejectCallbacks_1.length; _i++) {
                            var handler = rejectCallbacks_1[_i];
                            handler(fulfillValue);
                        }
                    }, 0);
                return this;
            };
            implicit(this, 'then', function (resolved, rejected) {
                if (status === FulfillStates.fulfilled) {
                    if (resolved)
                        setTimeout(function () {
                            resolved(fulfillValue);
                        }, 0);
                    return this;
                }
                else if (status === FulfillStates.rejected) {
                    if (rejected)
                        setTimeout(function () {
                            rejected(fulfillValue);
                        }, 0);
                    return this;
                }
                return new Thenable_1(function (nextResolve, nextReject) {
                    if (resolved) {
                        if (!resolveCallbacks)
                            resolveCallbacks = [];
                        resolveCallbacks.push(function (value) {
                            var _a;
                            if (typeof ((_a = value) === null || _a === void 0 ? void 0 : _a.then) === 'function') {
                                value.then(nextResolve, nextReject);
                            }
                            else {
                                nextResolve(value);
                            }
                        });
                    }
                    ;
                    if (!rejectCallbacks)
                        rejectCallbacks = [];
                    if (reject) {
                        rejectCallbacks.push(reject);
                    }
                    rejectCallbacks.push(nextReject);
                });
            });
            if (process) {
                setTimeout(function () {
                    process(resolve, reject);
                }, 0);
            }
        }
        Thenable_1 = Thenable;
        Thenable.prototype.then = function (resolve, reject) {
            throw 'placehold function';
        };
        Thenable.isThenable = function (obj) {
            var _a;
            return typeof ((_a = obj) === null || _a === void 0 ? void 0 : _a.then) === 'function';
        };
        var Thenable_1;
        Thenable = Thenable_1 = __decorate([
            implicit()
        ], Thenable);
        return Thenable;
    }());
    exports.Thenable = Thenable;
    function disposable(obj) {
        implicit(obj, 'dispose', function (handler) {
            var disposeHandlers = this['$-dispose-handlers'];
            if (disposeHandlers === null)
                throw new Exception("已经被释放，不能再调用dispose", { 'disposedObject': this });
            if (handler === undefined) {
                if (disposeHandlers) {
                    for (var _i = 0, disposeHandlers_1 = disposeHandlers; _i < disposeHandlers_1.length; _i++) {
                        var dHandler = disposeHandlers_1[_i];
                        dHandler.call(this);
                    }
                    constant(false, this, '$-dispose-handlers', null);
                }
            }
            else {
                if (disposeHandlers === undefined) {
                    constant(false, this, '$-dispose-handlers', disposeHandlers = []);
                }
                disposeHandlers.push(handler);
            }
            return this;
        });
        return obj;
    }
    exports.disposable = disposable;
    var Disposable = /** @class */ (function () {
        function Disposable() {
        }
        Disposable.prototype.dispose = function (handler) { return this; };
        return Disposable;
    }());
    exports.Disposable = Disposable;
    disposable(Disposable.prototype);
    var Subject = /** @class */ (function (_super) {
        __extends(Subject, _super);
        function Subject() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Subject.prototype.subscribe = function (topic, listener, refObject) {
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
            if (typeof listener !== 'function')
                throw new Exception("subject\u7684lisntener\u5FC5\u987B\u662F\u51FD\u6570", { 'listener': listener });
            var topics = this['$-subject-topics'];
            if (topics === null)
                throw new Exception('该对象已经被释放', { 'disposedObject': this });
            if (!topics)
                constant(false, this, '$-subject-topics', topics = this["$-subject-topics"] = {});
            var listeners = topics[topic] || (topics[topic] = []);
            listeners.push(listener);
            if (refObject) {
                refObject.dispose(function () {
                    array_remove(listeners, listener);
                });
            }
            return this;
        };
        Subject.prototype.unsubscribe = function (topic, listener) {
            if (listener === undefined) {
                listener = topic;
                topic = "";
            }
            var topics = this['$-subject-topics'];
            if (topics) {
                var listeners = topics[topic];
                array_remove(listeners, listener);
            }
            return this;
        };
        Subject.prototype.notify = function (topic, evt) {
            var evts = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                evts[_i - 2] = arguments[_i];
            }
            var topics = this['$-subject-topics'];
            if (!topics)
                return this;
            var listeners, ckIndex;
            if (typeof topic !== "string") {
                listeners = topics[''];
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
        Subject.prototype.dispose = function (handler) {
            if (handler !== undefined) {
                return _super.prototype.dispose.call(this, handler);
            }
            else {
                constant(false, this, '$-subject-topics', null);
            }
            return this;
        };
        return Subject;
    }(Disposable));
    exports.Subject = Subject;
    var SchemaTypes;
    (function (SchemaTypes) {
        SchemaTypes[SchemaTypes["value"] = 0] = "value";
        SchemaTypes[SchemaTypes["object"] = 1] = "object";
        SchemaTypes[SchemaTypes["array"] = 2] = "array";
        SchemaTypes[SchemaTypes["constant"] = 3] = "constant";
        SchemaTypes[SchemaTypes["computed"] = 4] = "computed";
    })(SchemaTypes = exports.SchemaTypes || (exports.SchemaTypes = {}));
    var Schema = /** @class */ (function () {
        function Schema(defaultValue, ownSchema, name) {
            if (defaultValue === Schema_1)
                return;
            if (defaultValue && defaultValue.$schemaType !== undefined)
                defaultValue = defaultValue.$schemaDefaultValue;
            implicit(this, {
                '$schemaName': name,
                '$-schema-root': undefined,
                '$-schema-name-paths-from-root': undefined,
                '$scopedName': undefined,
                '$-schema-scoped': undefined,
                '$-schema-name-paths-from-scope': undefined,
                '$schemaOwn': ownSchema,
                '$schemaDefaultValue': defaultValue,
                '$schemaType': SchemaTypes.value,
                '$schemaArrayItem': undefined
            });
            var t = typeof defaultValue;
            if (t === 'object') {
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
        Schema.prototype.asObject = function (dftValue) {
            if (this.$schemaType === SchemaTypes.value) {
                this.$schemaType = SchemaTypes.object;
                if (this.$schemaDefaultValue === undefined)
                    this.$schemaDefaultValue = {};
            }
            else if (this.$schemaType === SchemaTypes.array) {
                throw new Error("\u5DF2\u7ECF\u662Farray\u4E86\uFF0C\u4E0D\u53EF\u4EE5\u518D\u5B9A\u4E49\u5C5E\u6027");
            }
            if (dftValue)
                for (var n in dftValue) {
                    var existed = this[n];
                    var propValue = dftValue[n];
                    var propSchema = void 0;
                    if (existed) {
                        if (!propValue)
                            continue;
                    }
                    propSchema = new Schema_1(propValue, this, name);
                    this[n] = propSchema;
                }
            return this;
        };
        Schema.prototype.asArray = function (dftItemValue) {
            if (this.$schemaArrayItem && dftItemValue === undefined)
                return this.$schemaArrayItem;
            if (this.$schemaType !== SchemaTypes.value) {
                throw new Error("\u5DF2\u7ECF\u662Farray/object\u4E86\uFF0C\u4E0D\u53EF\u4EE5\u518D\u5B9A\u4E49item");
            }
            this.$schemaType = SchemaTypes.array;
            var itemSchema = new Schema_1(dftItemValue, this);
            this.$schemaArrayItem = itemSchema;
            var lengthSchema = new Schema_1(0, this, 'length');
            constant(false, this, 'length', lengthSchema);
            return itemSchema;
        };
        Schema.prototype.getRootSchema = function () {
            var root = this['$-schema-root'];
            if (!root) {
                root = this;
                while (root.$schemaOwn) {
                    root = root.$schemaOwn;
                }
                this['$-schema-root'] = root;
            }
            return root;
        };
        Schema.prototype.getNamePaths = function () {
            var names = this['$-schema-name-paths-from-root'];
            if (names)
                return names;
            names = [this.$schemaName];
            var schema = this;
            while (schema) {
                names.unshift(schema.$schemaName);
                schema = schema.$schemaOwn;
            }
            this['$-schema-name-paths-from-root'] = names;
            return names;
        };
        Schema.prototype.getValueFromRoot = function (target) {
            var names = this.getNamePaths();
            var value = target;
            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                var name_2 = names_1[_i];
                value = value[name_2];
                if (value === undefined)
                    return value;
            }
            return value;
        };
        Schema.prototype.getScopedSchema = function () {
            var scoped = this['$-schema-scoped'];
            if (scoped === undefined) {
                scoped = this;
                while (scoped && !scoped.$schemaScopedName) {
                    scoped = scoped.$schemaOwn;
                }
                this['$-schema-root'] = scoped || null;
            }
            return scoped;
        };
        Schema.prototype.getScopedNamePaths = function () {
            var names = this['$-schema-name-paths-from-scoped'];
            if (names)
                return names;
            names = [];
            var schema = this;
            while (schema && !schema.$schemaScopedName) {
                names.unshift(schema.$schemaName);
                schema = schema.$schemaOwn;
            }
            if (schema)
                names.unshift(schema.$schemaScopedName);
            this['$-schema-name-paths-from-scoped'] = names.length === 0 ? null : names;
            return names;
        };
        Schema.prototype.getValueFromScope = function (scope, schema, initValue, onlyCheckCurrentScope) {
            var names = this.getScopedNamePaths();
            if (!names) {
                console.warn("\u6CA1\u6709\u627E\u5230scopedName,\u9ED8\u8BA4\u8FD4\u56DEundefined", this, scope);
            }
            var value = scope.reactive(names[0], !schema || schema.$schemaType === undefined ? undefined : schema, initValue, onlyCheckCurrentScope);
            for (var i = 1, j = names.length; i < j; i++) {
                value = value[names[i]];
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
    var ComputedSchema = /** @class */ (function () {
        function ComputedSchema(func, deps) {
            implicit(this, {
                '$schemaType': SchemaTypes.computed,
                '$schemaFunc': func,
                '$schemaDependences': deps
            });
        }
        ComputedSchema.prototype.getValueFromScope = function (scope, own) {
            return new ComputedReactive(this, scope, own);
        };
        ComputedSchema = __decorate([
            implicit()
        ], ComputedSchema);
        return ComputedSchema;
    }());
    exports.ComputedSchema = ComputedSchema;
    function computed() {
        var deps = [];
        for (var i = 0, j = arguments.length - 1; i < j; i++) {
            deps.push(arguments[i]);
        }
        var func = arguments[arguments.length - 1];
        return new ComputedSchema(func, deps);
    }
    exports.computed = computed;
    var ComputedReactive = /** @class */ (function (_super) {
        __extends(ComputedReactive, _super);
        function ComputedReactive(schema, scope, own) {
            var _this = _super.call(this) || this;
            var deps = [];
            var args = [];
            for (var _i = 0, _a = schema.$schemaDependences; _i < _a.length; _i++) {
                var depSchema = _a[_i];
                var depReactive = depSchema.getValueFromScope(scope, own);
                deps.push(depReactive);
                args.push(depReactive.$reactiveValue);
                depReactive.subscribe(function (e) {
                    _this.get(e);
                }, own);
            }
            var value;
            try {
                value = schema.$schemaFunc.apply(_this, args);
            }
            catch (ex) {
                console.warn('计算表达式无法正常完成', _this, args);
            }
            implicit(_this, {
                '$reactiveType': SchemaTypes.computed,
                '$reactiveDependences': deps,
                '$reactiveSchema': schema,
                '$reactiveScope': scope,
                '$reactiveValue': value
            });
            return _this;
        }
        ComputedReactive.prototype.get = function (src) {
            var args = [];
            for (var _i = 0, _a = this.$reactiveDependences; _i < _a.length; _i++) {
                var depReactive = _a[_i];
                args.push(depReactive.get());
            }
            var newValue;
            try {
                newValue = this.$reactiveSchema.$schemaFunc.apply(this, args);
            }
            catch (ex) {
                console.warn('计算表达式无法正常完成', this, args);
            }
            var oldValue = this.$reactiveValue;
            if (oldValue !== newValue) {
                this.$reactiveValue = newValue;
                var evt = { type: ChangeEventTypes.setted, src: src, sender: this, value: newValue, old: oldValue };
                this.notify('', evt);
            }
            return newValue;
        };
        ComputedReactive = __decorate([
            implicit()
        ], ComputedReactive);
        return ComputedReactive;
    }(Subject));
    exports.ComputedReactive = ComputedReactive;
    var ChangeEventTypes;
    (function (ChangeEventTypes) {
        ChangeEventTypes[ChangeEventTypes["notify"] = 0] = "notify";
        ChangeEventTypes[ChangeEventTypes["setted"] = 1] = "setted";
        ChangeEventTypes[ChangeEventTypes["bubbled"] = 2] = "bubbled";
        ChangeEventTypes[ChangeEventTypes["appended"] = 3] = "appended";
        ChangeEventTypes[ChangeEventTypes["removed"] = 4] = "removed";
    })(ChangeEventTypes = exports.ChangeEventTypes || (exports.ChangeEventTypes = {}));
    var Reactive = /** @class */ (function (_super) {
        __extends(Reactive, _super);
        function Reactive(ownOrValue, schema, name, scope) {
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
            if (!schema)
                schema = new Schema(value);
            if (value === undefined)
                value = schema.$schemaDefaultValue;
            implicit(_this, {
                '$reactiveName': name,
                '$reactiveSchema': schema,
                '$reactiveOwn': own,
                '$reactiveType': schema ? schema.$schemaType : SchemaTypes.value,
                '$reactiveScope': scope
            });
            // Reactive作为第一个参数，是不做类型检查，用于constantReactive等
            if (ownOrValue === Reactive_1) {
                implicit(_this, '$reactiveValue', value);
                return _this;
            }
            if (schema.$schemaType === SchemaTypes.object) {
                if (typeof value !== "object")
                    value = {};
                implicit(_this, '$reactiveValue', value);
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
                implicit(_this, '$reactiveValue', value);
                for (var i = 0, j = value.length; i < j; i++) {
                    var itemReacitve = new Reactive_1(_this, schema.$schemaArrayItem, i);
                    _this[i] = itemReacitve;
                }
                var numRegx = /^\d+$/;
                for (var n in schema) {
                    if (!numRegx.test(n))
                        continue;
                    if (!_this[n]) {
                        var itemReacitve = new Reactive_1(_this, schema.$schemaArrayItem, n);
                        _this[n] = itemReacitve;
                    }
                }
                var lengthReactive = new Reactive_1(_this, schema.length);
                constant(false, _this, 'length', lengthReactive);
            }
            else {
                implicit(_this, '$reactiveValue', value);
            }
            return _this;
        }
        Reactive_1 = Reactive;
        Reactive.prototype.update = function (value, src, bubble) {
            var schemaType = this.$reactiveSchema.$schemaType;
            if (schemaType === SchemaTypes.object) {
                return updateObject(this, value, src, bubble);
            }
            else if (schemaType === SchemaTypes.array) {
                return updateArray(this, value, src, bubble);
            }
            else {
                var old = this.$reactiveValue;
                if (value === old)
                    return false;
                this.$reactiveValue = value;
                if (this.$reactiveOwn) {
                    this.$reactiveOwn.$reactiveValue[this.$reactiveName] = value;
                }
                this.notify({
                    type: ChangeEventTypes.setted, value: deepClone(value), old: old, sender: this, src: src
                }, bubble);
            }
            return true;
        };
        Reactive.prototype.get = function () {
            var schemaType = this.$reactiveSchema.$schemaType;
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
                return deepClone(this.$reactiveValue);
            }
        };
        Reactive.prototype.notify = function (evt, bubble) {
            if (evt === undefined) {
                var value = deepClone(this.$reactiveValue);
                evt = {
                    type: ChangeEventTypes.notify, value: value, old: value, sender: this
                };
            }
            else {
                if (!evt.sender)
                    evt.sender = this;
            }
            _super.prototype.notify.call(this, "", evt);
            if (bubble === true) {
                if (this.$reactiveOwn) {
                    var value = deepClone(this.$reactiveValue);
                    var ownEvt = { type: ChangeEventTypes.bubbled, value: value, old: value, src: evt };
                    this.$reactiveOwn.notify(ownEvt, true);
                }
            }
            return this;
        };
        var Reactive_1;
        Reactive = Reactive_1 = __decorate([
            implicit()
        ], Reactive);
        return Reactive;
    }(Subject));
    exports.Reactive = Reactive;
    var ConstantReactive = /** @class */ (function (_super) {
        __extends(ConstantReactive, _super);
        function ConstantReactive(value, name) {
            var _this = _super.call(this, Reactive, undefined) || this;
            _this.$reactiveValue = value;
            _this.$reactiveName = name;
            _this.$reactiveType = SchemaTypes.constant;
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
            debugger;
            console.warn("\u5728ConstantReactive\u4E0A\u8C03\u7528\u4E86update\u64CD\u4F5C,\u5FFD\u7565\u3002", this, value);
            return false;
        };
        ConstantReactive = __decorate([
            implicit()
        ], ConstantReactive);
        return ConstantReactive;
    }(Reactive));
    exports.ConstantReactive = ConstantReactive;
    function updateObject(reactive, value, evtSrc, bubble) {
        var old = reactive.$reactiveValue;
        value || (value = {});
        reactive.$reactiveValue = value;
        if (reactive.$reactiveOwn) {
            reactive.$reactiveOwn.$reactiveValue[reactive.$reactiveName] = value;
        }
        var event = {
            type: ChangeEventTypes.setted, value: value, old: old, sender: reactive, src: evtSrc
        };
        var hasChanges = value !== old;
        var keys = Object.keys(value);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var n = keys_1[_i];
            var propReacitve = reactive[n];
            if (propReacitve instanceof Reactive) {
                if (propReacitve.update(value[n], event, false))
                    hasChanges = true;
            }
        }
        if (bubble === false)
            return hasChanges;
        else {
            if (hasChanges) {
                var evt = { type: ChangeEventTypes.bubbled, value: value, old: old, sender: this };
                reactive.notify(evt, true);
            }
            return false;
        }
    }
    function updateArray(reactive, value, src, bubble) {
        var old = reactive.$reactiveValue;
        value || (value = []);
        reactive.$reactiveValue = value;
        if (reactive.$reactiveOwn) {
            reactive.$reactiveOwn.$reactiveValue[reactive.$reactiveName] = value;
        }
        var hasChanges = old !== value;
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
        for (var i = oldLength, j = newLength; i < j; i++) {
            var newItemReactive = new Reactive(reactive, reactive.$reactiveSchema.$schemaArrayItem, i);
            reactive[i] = newItemReactive;
            appends.push({ value: value[i], reactive: newItemReactive, index: i });
        }
        if (appends.length) {
            var event_1 = {
                type: ChangeEventTypes.appended, value: value, old: old, src: src || reactive,
                appends: appends, sender: reactive
            };
            hasChanges = true;
            reactive.notify(event_1, false);
        }
        for (var _i = 0, removes_1 = removes; _i < removes_1.length; _i++) {
            var item = removes_1[_i];
            hasChanges = true;
            item.reactive.update(undefined, null, false);
        }
        for (var _a = 0, updates_1 = updates; _a < updates_1.length; _a++) {
            var item = updates_1[_a];
            if (item.reactive.update(item.value, null, false))
                hasChanges = true;
        }
        if (bubble === false)
            return hasChanges;
        else {
            if (hasChanges) {
                var evt = { type: ChangeEventTypes.bubbled, value: value, old: old, sender: this };
                reactive.notify(evt, true);
            }
            return false;
        }
    }
    ///////////////////////////////////////////////////////////////////////////
    // Scope
    var Scope = /** @class */ (function () {
        function Scope(parent, name) {
            constant(false, this, '$-scope-parent', parent);
            constant(false, this, '$-scope-name', name);
        }
        Scope_1 = Scope;
        Scope.prototype.reactive = function (name, schema, initValue, onlyCheckCurrentScope) {
            var reactive;
            if (schema === undefined) {
                var scope = this;
                while (scope) {
                    if (reactive = scope[name])
                        break;
                    if (onlyCheckCurrentScope)
                        break;
                    scope = scope['$-scope-parent'];
                }
            }
            if (!reactive) {
                reactive = new Reactive(initValue, schema, undefined, this);
                this[name] = reactive;
            }
            else {
                if (initValue !== undefined)
                    reactive.update(initValue);
            }
            return reactive;
        };
        Scope.prototype.createScope = function (name) {
            return new Scope_1(this, name);
        };
        Scope.prototype.rootScope = function () {
            var root = this['$-scope-root'];
            if (root)
                return root;
            root = this;
            while (root) {
                var p = root["$-scope-parent"];
                if (p)
                    root = p;
                else {
                    constant(false, this, '$-scope-root', root);
                    return root;
                }
            }
        };
        Scope.prototype.dispose = function () {
            for (var n in this) {
                var reactive = this[n];
                if (typeof reactive.dispose === 'function')
                    reactive.dispose();
            }
        };
        var Scope_1;
        Scope = Scope_1 = __decorate([
            implicit()
        ], Scope);
        return Scope;
    }());
    exports.Scope = Scope;
    function _createNodeDescriptor(tag, attrs) {
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
    exports.createNodeDescriptor = _createNodeDescriptor;
    globalThis.createVNode = exports.createNodeDescriptor;
    var proxyHandlers = {
        get: function (obj, name) {
            if (name === '$-schema-proxy-raw')
                return obj;
            var value = obj[name];
            if (value === undefined)
                return createSchemaProxy(obj.defineProp(name));
            var ch = name[0];
            if (ch === '$' || ch === '_' || ch === '-')
                return value;
            if (value instanceof Schema)
                return createSchemaProxy(value);
            return value;
        }
    };
    function createElement(descriptor, ownComponent, scope, ignoreDirective) {
        if (!scope) {
            if (ownComponent)
                scope = ownComponent.$scope;
            else
                scope = new Scope();
        }
        if (!ignoreDirective) {
            var elem = createIterationNodes(descriptor, ownComponent, scope);
            if (elem)
                return elem;
        }
        var element = createSlotNode(descriptor, ownComponent, scope);
        if (!element)
            element = createComponentNode(descriptor, ownComponent, scope);
        if (!element)
            element = createElementNode(descriptor, ownComponent, scope);
        if (!element)
            element = createTextNode(descriptor.content, ownComponent, scope);
        return element;
    }
    /**
     * 创建迭代for-each,for-as
     *
     * @param {INodeDescriptor} descriptor
     * @param {IComponent<any>} [ownComponent]
     * @param {Scope} [scope]
     */
    function createIterationNodes(descriptor, ownComponent, scope) {
        //没有属性，肯定不是迭代
        var attrs = descriptor.attrs;
        if (!attrs)
            return undefined;
        var each = attrs['for-each'];
        if (!each)
            return undefined;
        if (each["$-schema-proxy-raw"])
            each = each["$-schema-proxy-raw"];
        if (!each)
            return undefined;
        var itemSchema = attrs['for-as'];
        if (!itemSchema)
            throw new Exception('没找到for-as', { 'nodeDescriptor': descriptor, 'ownComponent': ownComponent });
        if (itemSchema["$-schema-proxy-raw"])
            itemSchema = itemSchema["$-schema-proxy-raw"];
        if (!itemSchema.$schemaType)
            throw new Exception('for-as 必须是Scheme,请用YA.for/YA.local创建循环变量', { 'nodeDescriptor': descriptor, 'ownComponent': ownComponent });
        var anchor = document.createComment('for-each/as anchor node');
        setTimeout(function () {
            var eachReactive = each;
            if (eachReactive.$schemaType !== undefined)
                eachReactive = each.getValueFromScope(scope, ownComponent);
            renderIteration(descriptor, ownComponent, eachReactive, itemSchema, anchor, scope);
        }, 0);
        return anchor;
    }
    function renderIteration(descriptor, ownComponent, eachReactive, asSchema, anchor, eachScope) {
        for (var n in eachReactive) {
            var itemReactive = eachReactive[n];
            renderIterationItem(descriptor, ownComponent, itemReactive, asSchema, anchor, eachScope);
        }
        if (eachReactive.$reactiveType !== undefined) {
            eachReactive.subscribe(function (e) {
                if (!e.appends)
                    return;
                for (var _i = 0, _a = e.appends; _i < _a.length; _i++) {
                    var appendItem = _a[_i];
                    renderIterationItem(descriptor, ownComponent, appendItem.reactive, asSchema, anchor, eachScope);
                }
            }, ownComponent);
        }
    }
    function renderIterationItem(descriptor, ownComponent, itemReactive, asSchema, anchor, eachScope) {
        var itemScope = eachScope.createScope(asSchema.$schemaScopedName);
        itemScope[asSchema.$schemaScopedName] = itemReactive;
        var elem = createElement(descriptor, ownComponent, itemScope, true);
        anchor.parentElement.insertBefore(elem, anchor);
        itemReactive.subscribe(function (e) {
            if (e.type === ChangeEventTypes.removed) {
                if (elem.parentNode)
                    elem.parentElement.removeChild(elem);
            }
        }, ownComponent);
        return elem;
    }
    function createSlotNode(descriptor, ownComponent, scope) {
        if (descriptor.tag !== 'slot')
            return undefined;
        var attrs = descriptor.attrs || {};
        var name = attrs.name || '';
        var map = attrs.map || {};
        var slotData = {};
        for (var mapName in map) {
            var mapValue = map[mapName];
            debugger;
            //if(attrName[0])
            //将代理去掉，获取原始的schema
            if (mapValue && mapValue["$-schema-proxy-raw"])
                mapValue = mapValue["$-schema-proxy-raw"];
            var mapReactive = mapValue;
            if (mapReactive.$schemaType !== undefined) {
                mapReactive = mapValue.getValueFromScope(scope);
            }
            slotData[mapName] = mapReactive;
        }
        var placeholder = document.createComment("slot " + (name || 'default') + " placeholder");
        var slots = ownComponent.$slots;
        if (!slots) {
            slots = {};
            constant(false, ownComponent, '$slots', slots);
        }
        var slotInfo = { map: slotData, placeholder: placeholder };
        if (slots[name]) {
            console.warn('有相同名称的slot，后面的将会替换掉前面的slot', ownComponent.$meta.vnode);
        }
        slots[name] = slotInfo;
        return placeholder;
    }
    function createComponentNode(descriptor, ownComponent, scope) {
        var componentFunc;
        if (descriptor.component) {
            componentFunc = descriptor.component;
        }
        else if (descriptor.tag)
            componentFunc = exports.componentTypes[descriptor.tag];
        if (!componentFunc)
            return null;
        var component = newComponent(componentFunc, descriptor.attrs, ownComponent, scope);
        bindComponentStates(component, descriptor.attrs, scope);
        var element = component.$element = createElement(component.$meta.vnode, component, component.$scope);
        createSlotContentNodes(component, descriptor, scope);
        constant(false, element, '$-ya-component', component);
        constant(false, component, '$element', element);
        return element;
    }
    function newComponent(componentFunc, attrs, ownComponent, scope) {
        var _a;
        // 获取或构建componentType
        var componentType;
        var isTemplateFunc = false;
        // 没有template方法，它自己就是template方法
        if (!componentFunc.prototype.template) {
            isTemplateFunc = true;
            // 从template方法中获取到原先构建的componentType
            componentType = componentFunc['$-component-type'];
            // 没获取到，表示从未构建，要重新构建一个componentType
            if (!componentType) {
                var template = componentFunc;
                componentType = function () { };
                componentType.prototype.template = template;
                constant(false, template, '$-component-type', componentType);
                constant(false, componentType, '$-component-template', template);
            }
        }
        else
            componentType = componentFunc;
        var meta = componentType.prototype.$meta;
        if (!meta) {
            constant(false, componentType.prototype, '$meta', meta = {});
        }
        meta.localSchemas || (meta.localSchemas = {});
        var statesSchemaBuilder = sureStatesSchema(meta, componentType);
        var component = new componentType(statesSchemaBuilder || function () { });
        constant(false, component, '$ownComponent', ownComponent);
        sureTagAndIds(component, meta, componentType);
        sureNodeDescriptor(component, meta, statesSchemaBuilder, attrs);
        if (!component.dispose) {
            disposable(component);
        }
        scope || (scope = (_a = ownComponent) === null || _a === void 0 ? void 0 : _a.$scope);
        var componentScope = scope ? scope.createScope(component.$tag + cid("@CS")) : new Scope();
        constant(false, component, '$scope', componentScope);
        //let states= {};
        constant(false, component, '$states', componentScope.reactive('states', meta.statesSchema));
        return component;
    }
    function sureStatesSchema(meta, componentType) {
        var _this = this;
        var statesSchemaBuilder;
        if (!meta.statesSchema) {
            var statesSchema_1 = new Schema(undefined, undefined);
            statesSchema_1.$schemaScopedName = "states";
            meta.statesSchema = statesSchema_1;
            statesSchemaBuilder = function (builder) {
                var dftStatesObj = builder.call(_this, statesSchema_1);
                if (dftStatesObj !== undefined) {
                    statesSchema_1.asObject(dftStatesObj);
                }
            };
        }
        return statesSchemaBuilder;
    }
    function sureTagAndIds(compInstance, meta, componentType) {
        var tag = compInstance.$tag;
        if (!tag) {
            tag = meta.tag || (meta.tag = cid('ya-component-type-'));
            constant(false, compInstance, '$tag', tag);
            constant(false, componentType.prototype, '$tag', tag);
        }
        var existed = exports.componentTypes[tag];
        if (existed) {
            if (existed !== componentType) {
                exports.componentTypes[tag] = componentType;
                console.warn("\u6807\u7B7E" + tag + "\u88AB\u66FF\u6362\u6210\u4E86\u65B0\u7684\u7EC4\u4EF6\u7C7B", componentType, existed);
            }
        }
        else
            exports.componentTypes[tag] = componentType;
        constant(false, compInstance, '$cid', cid(tag + '@'));
    }
    function sureNodeDescriptor(component, meta, statesSchemaBuilder, vm) {
        var vnode = meta.vnode;
        templateStack.push(meta.localSchemas);
        if (vnode === undefined) {
            var proxy = createSchemaProxy(meta.statesSchema, vm);
            try {
                vnode = meta.vnode =
                    typeof component.template === "function"
                        ? component.template(proxy, statesSchemaBuilder)
                        : component.template;
            }
            finally {
            }
        }
        templateStack.pop();
    }
    function createSlotContentNodes(ownComponent, descriptor, scope) {
        if (!descriptor.children)
            return;
        var slots = ownComponent.$slots;
        if (!slots) {
            console.warn("\u7EC4\u4EF6" + ownComponent.$tag + "\u672A\u63D0\u4F9Bslot\uFF0C\u4F46\u8C03\u7528\u8BE5\u7EC4\u4EF6\u65F6\u7ED9\u5B9A\u4E86\u5B50\u8282\u70B9\uFF0C\u5FFD\u7565\u5B50\u8282\u70B9\u5185\u5BB9", ownComponent);
            return;
        }
        for (var _i = 0, _a = descriptor.children; _i < _a.length; _i++) {
            var childDescriptor = _a[_i];
            if (!childDescriptor)
                continue;
            var childElement = void 0, slotInfo = void 0, slotScope = void 0;
            if (childDescriptor["$-schema-proxy-raw"]) {
                slotInfo = slots[''];
                if (slotInfo) {
                    slotScope = createSlotScope(ownComponent.$slotMap, '', slotInfo, ownComponent, scope);
                    childElement = createTextNode(childDescriptor["$-schema-proxy-raw"], ownComponent, slotScope);
                }
            }
            else if (childDescriptor.$schemaType !== undefined) {
                slotInfo = slots[''];
                if (slotInfo) {
                    slotScope = createSlotScope(ownComponent.$slotMap, '', slotInfo, ownComponent, scope);
                    childElement = createTextNode(childDescriptor, ownComponent, slotScope);
                }
            }
            else {
                var slotname = childDescriptor.attrs ? childDescriptor.attrs['slot-name'] : undefined;
                if (!slotname)
                    slotname = '';
                else if (slotname.$reactiveType === SchemaTypes.constant) {
                    slotname = slotname.$reactiveValue;
                }
                if (slotname === undefined) {
                    console.warn("\u975E\u6CD5\u7684slot-name\u5C5E\u6027\u503C\uFF0C\u4E0D\u53EF\u4EE5\u662F\u53D8\u91CF", ownComponent);
                    return;
                }
                slotInfo = slots[slotname];
                if (slotInfo) {
                    debugger;
                    slotScope = createSlotScope(ownComponent.$slotMap, slotname, slotInfo, ownComponent, scope);
                    childElement = createElement(childDescriptor, ownComponent, slotScope);
                }
            }
            if (childElement) {
                var slotPlaceholder = slotInfo.placeholder;
                slotPlaceholder.parentNode.insertBefore(childElement, slotPlaceholder);
            }
        }
    }
    function createSlotScope(slotMap, name, slotInfo, ownComponent, scope) {
        var slotScope = scope.createScope('slot-' + (name || 'default'));
        debugger;
        var _loop_1 = function (n) {
            var srcReactive = slotInfo.map[n];
            var schema = slotMap[n];
            if (!srcReactive) {
                console.warn("\u8BF7\u6C42slot\u4E0A\u7684" + n + "\u6570\u636E,\u4F46\u8BE5slot\u5E76\u672A\u63D0\u4F9B\u8BE5\u540D\u79F0\u7684\u6620\u5C04", ownComponent, slotMap, slotInfo);
                return "continue";
            }
            if (!schema.$schemaScopedName) {
                console.warn(name + "\u4E0D\u6B63\u786E\u7684slot\u6620\u5C04,slot-map\u7684\u503C\u5FC5\u987B\u662Flocal\u53D8\u91CF", ownComponent);
            }
            var destReactive = slotScope.reactive(schema.$schemaScopedName, schema, srcReactive.$reactiveValue, true);
            srcReactive.subscribe(function (e) {
                destReactive.update(e.value);
            }, ownComponent);
            slotScope[schema.$schemaScopedName] = destReactive;
        };
        for (var n in slotMap) {
            _loop_1(n);
        }
        return slotScope;
    }
    function createSchemaProxy(schema, defaultValue) {
        if (defaultValue !== undefined)
            schema.$schemaDefaultValue = defaultValue;
        return new Proxy(schema, proxyHandlers);
    }
    var templateStack = [];
    function local(localSchema, name) {
        localSchema || (localSchema = new Schema(undefined));
        //if(arraySchema) return arraySchema.asArray() as any as T;
        var context = templateStack.pop();
        var localVarName;
        if (name) {
            localVarName = name + cid('@LVN');
        }
        else {
            var localVarNo = context['$-localvar-no'];
            if (localVarNo === undefined)
                localVarNo = context['$-localvar-no'] = 0;
            localVarName = '$-local-' + localVarNo;
            context['$-localvar-no'] = (++localVarNo);
        }
        localSchema.$schemaScopedName = localVarName;
        var proxy = createSchemaProxy(localSchema);
        context[localVarName] = proxy;
        templateStack.push(context);
        return proxy;
    }
    exports.local = local;
    function localFor(schema, name) {
        return local(schema.$schemaArrayItem, name);
    }
    exports.localFor = localFor;
    function bindComponentStates(component, attrs, scope) {
        var innerStates = component.$states;
        for (var attrName in attrs)
            (function (attrName, bindValue, innerStates) {
                if (attrName == "slot-map") {
                    component.$slotMap = bindValue;
                    return;
                }
                if (bindValue && bindValue["$-schema-proxy-raw"])
                    bindValue = bindValue["$-schema-proxy-raw"];
                var prop = innerStates[attrName];
                if (!prop) {
                    var bindVal = bindValue
                        ? (bindValue.$reactiveType !== undefined ? bindValue.$reactiveValue : bindValue)
                        : bindValue;
                    prop = innerStates[attrName] = new ConstantReactive(bindVal, attrName);
                }
                if (bindValue instanceof Schema) {
                    var bindValueReactive = bindValue.getValueFromScope(scope, component);
                    if (!bindValueReactive) {
                        console.warn("\u6CA1\u6709\u627E\u5230\u76F8\u5173\u53D8\u91CF:" + bindValue.getNamePaths().join('.') + ",\u5C06\u5FFD\u7565\u8BE5\u53D8\u91CF", component);
                        return;
                    }
                    var handler = function (e) {
                        var propReactive = innerStates[attrName];
                        if (propReactive instanceof Reactive) {
                            propReactive.update(e.value);
                        }
                    };
                    //外面的变化后，触发里面的变化
                    bindValueReactive.subscribe(handler, component);
                    prop.$reactiveValue = bindValueReactive.$reactiveValue;
                }
                else
                    prop.$reactiveValue = bindValue;
            })(attrName, attrs[attrName], innerStates);
    }
    var eventNameRegx = /^on/g;
    function createElementNode(descriptor, ownComponent, scope) {
        if (!descriptor.tag)
            return null;
        var element = document.createElement(descriptor.tag);
        var attrs = descriptor.attrs;
        var children = descriptor.children;
        for (var attrName in attrs) {
            if (attrName === 'for-each' || attrName === 'for-as' || attrName === 'if' || attrName === 'if-not')
                continue;
            var attrValue = attrs[attrName];
            //if(attrName[0])
            //将代理去掉，获取原始的schema
            if (attrValue && attrValue["$-schema-proxy-raw"])
                attrValue = attrValue["$-schema-proxy-raw"];
            if (eventNameRegx.test(attrName) && element[attrName] === null) {
                bindEvent(element, attrName, attrValue, ownComponent, scope);
                continue;
            }
            bindAttr(element, attrName, attrValue, ownComponent, scope);
        }
        if (children)
            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                var child = children_1[_i];
                var childElement = void 0;
                if (!child)
                    continue;
                if (child["$-schema-proxy-raw"]) {
                    childElement = createTextNode(child["$-schema-proxy-raw"], ownComponent, scope);
                }
                else if (child.$schemaType !== undefined) {
                    childElement = createTextNode(child, ownComponent, scope);
                }
                else {
                    childElement = createElement(child, ownComponent, scope);
                }
                element.appendChild(childElement);
            }
        return element;
    }
    function bindAttr(element, attrName, attrValue, ownComponent, scope) {
        var binder = exports.binders[attrName];
        var reactive;
        if (attrValue.$schemaType !== undefined) {
            reactive = attrValue.getValueFromScope(scope, ownComponent);
        }
        else {
            if (binder) {
                reactive = new ConstantReactive(attrValue);
            }
        }
        if (binder) {
            binder(ownComponent, element, attrName, reactive);
        }
        else {
            var propName_1 = attributeConvertNames[attrName] || attrName;
            element[propName_1] = reactive ? reactive.get() : attrValue;
            if (reactive)
                reactive.subscribe(function (e) {
                    element[propName_1] = e.value;
                }, ownComponent);
        }
    }
    function bindEvent(element, evtName, handler, ownComponent, scope) {
        element[evtName] = function (e) {
            var func = handler;
            if (handler.$schemaType !== undefined) {
                func = handler.getValueFromScope(scope, ownComponent);
            }
            if (func.$reactiveType !== undefined)
                func = func.$reactiveValue;
            var statesReactive = ownComponent.$states;
            var statesData = statesReactive.get();
            var newStates = func.call(ownComponent, statesData, e);
            if (newStates === undefined)
                newStates = statesData;
            statesReactive.update(newStates);
        };
    }
    //<select><option for={{each: options, as: option }} value={option.value}>{option.text}</option></select>
    function makeFor(anchorElement, vnode, each, item, scope) {
    }
    function buildForItem(itemSchema, item, vnode) { }
    function createTextNode(bindValue, ownComponent, scope) {
        var _a;
        if (!bindValue)
            return document.createTextNode(bindValue);
        var reactive;
        if (bindValue["$-schema-proxy-raw"])
            bindValue = bindValue["$-schema-proxy-raw"];
        else if (bindValue.$reactiveType !== undefined) {
            reactive = bindValue;
        }
        else if (bindValue.$schemaType !== undefined) {
            scope || (scope = (_a = ownComponent) === null || _a === void 0 ? void 0 : _a.$scope);
            if (!scope) {
                console.warn("\u4F20\u5165\u4E86schema,\u4F46\u5374\u6CA1\u6709ownComponent,\u4F7F\u7528schema\u7684defaultValue\u4F5C\u4E3A\u5185\u5BB9");
                return document.createTextNode(bindValue.$schemaDefaultValue);
            }
            reactive = bindValue.getValueFromScope(scope, ownComponent);
        }
        if (reactive) {
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
    var YA = /** @class */ (function () {
        function YA(opts) {
            this.opts = opts;
            this.$scope = new Scope(undefined, opts.name || 'root');
            var elem = this.$element = createElement(opts.template, this, this.$scope, true);
            constant(false, elem, '$YA', this);
            if (opts.element) {
                opts.element.innerHTML = "";
                opts.element.appendChild(elem);
            }
        }
        return YA;
    }());
    exports.YA = YA;
    var IYA = YA;
    IYA.createNodeDescriptor = exports.createNodeDescriptor;
    IYA.localFor = localFor;
    IYA.local = local;
    IYA.componentTypes = exports.componentTypes;
    IYA.binders = exports.binders;
    IYA.computed = computed;
    exports.default = globalThis.YA = IYA;
});
//# sourceMappingURL=YA.js.map