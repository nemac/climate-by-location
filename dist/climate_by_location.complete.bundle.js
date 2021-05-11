(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ClimateByLocationWidget = {}));
}(this, (function (exports) { 'use strict';

  self.fetch||(self.fetch=function(e,n){return n=n||{},new Promise(function(t,s){var r=new XMLHttpRequest,o=[],u=[],i={},a=function(){return {ok:2==(r.status/100|0),statusText:r.statusText,status:r.status,url:r.responseURL,text:function(){return Promise.resolve(r.responseText)},json:function(){return Promise.resolve(r.responseText).then(JSON.parse)},blob:function(){return Promise.resolve(new Blob([r.response]))},clone:a,headers:{keys:function(){return o},entries:function(){return u},get:function(e){return i[e.toLowerCase()]},has:function(e){return e.toLowerCase()in i}}}};for(var c in r.open(n.method||"get",e,!0),r.onload=function(){r.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm,function(e,n,t){o.push(n=n.toLowerCase()),u.push([n,t]),i[n]=i[n]?i[n]+","+t:t;}),t(a());},r.onerror=s,r.withCredentials="include"==n.credentials,n.headers)r.setRequestHeader(c,n.headers[c]);r.send(n.body||null);})});

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Built-in value references. */
  var Symbol = root.Symbol;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /** Built-in value references. */
  var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$1.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag$1 = Symbol ? Symbol.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag$1 && symToStringTag$1 in Object(value))
      ? getRawTag(value)
      : objectToString(value);
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike(value) && baseGetTag(value) == symbolTag);
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isArray(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return arrayMap(value, baseToString) + '';
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  /** Used as references for various `Number` constants. */
  var NAN = 0 / 0;

  /** Used to match leading and trailing whitespace. */
  var reTrim = /^\s+|\s+$/g;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Built-in method references without a dependency on `root`. */
  var freeParseInt = parseInt;

  /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3.2);
   * // => 3.2
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3.2');
   * // => 3.2
   */
  function toNumber(value) {
    if (typeof value == 'number') {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject(value)) {
      var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
      value = isObject(other) ? (other + '') : other;
    }
    if (typeof value != 'string') {
      return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return (isBinary || reIsOctal.test(value))
      ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
      : (reIsBadHex.test(value) ? NAN : +value);
  }

  /** Used as references for various `Number` constants. */
  var INFINITY$1 = 1 / 0,
      MAX_INTEGER = 1.7976931348623157e+308;

  /**
   * Converts `value` to a finite number.
   *
   * @static
   * @memberOf _
   * @since 4.12.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted number.
   * @example
   *
   * _.toFinite(3.2);
   * // => 3.2
   *
   * _.toFinite(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toFinite(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toFinite('3.2');
   * // => 3.2
   */
  function toFinite(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY$1 || value === -INFINITY$1) {
      var sign = (value < 0 ? -1 : 1);
      return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
  }

  /**
   * Converts `value` to an integer.
   *
   * **Note:** This method is loosely based on
   * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted integer.
   * @example
   *
   * _.toInteger(3.2);
   * // => 3
   *
   * _.toInteger(Number.MIN_VALUE);
   * // => 0
   *
   * _.toInteger(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toInteger('3.2');
   * // => 3
   */
  function toInteger(value) {
    var result = toFinite(value),
        remainder = result % 1;

    return result === result ? (remainder ? result - remainder : result) : 0;
  }

  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */
  function identity(value) {
    return value;
  }

  /** `Object#toString` result references. */
  var asyncTag = '[object AsyncFunction]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      proxyTag = '[object Proxy]';

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  /** Used to detect overreaching core-js shims. */
  var coreJsData = root['__core-js_shared__'];

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }

  /** Used for built-in method references. */
  var funcProto = Function.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used for built-in method references. */
  var funcProto$1 = Function.prototype,
      objectProto$2 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$1 = funcProto$1.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }

  /* Built-in method references that are verified to be native. */
  var WeakMap = getNative(root, 'WeakMap');

  /** Used to store function metadata. */
  var metaMap = WeakMap && new WeakMap;

  /**
   * The base implementation of `setData` without support for hot loop shorting.
   *
   * @private
   * @param {Function} func The function to associate metadata with.
   * @param {*} data The metadata.
   * @returns {Function} Returns `func`.
   */
  var baseSetData = !metaMap ? identity : function(func, data) {
    metaMap.set(func, data);
    return func;
  };

  /** Built-in value references. */
  var objectCreate = Object.create;

  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} proto The object to inherit from.
   * @returns {Object} Returns the new object.
   */
  var baseCreate = (function() {
    function object() {}
    return function(proto) {
      if (!isObject(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object;
      object.prototype = undefined;
      return result;
    };
  }());

  /**
   * Creates a function that produces an instance of `Ctor` regardless of
   * whether it was invoked as part of a `new` expression or by `call` or `apply`.
   *
   * @private
   * @param {Function} Ctor The constructor to wrap.
   * @returns {Function} Returns the new wrapped function.
   */
  function createCtor(Ctor) {
    return function() {
      // Use a `switch` statement to work with class constructors. See
      // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
      // for more details.
      var args = arguments;
      switch (args.length) {
        case 0: return new Ctor;
        case 1: return new Ctor(args[0]);
        case 2: return new Ctor(args[0], args[1]);
        case 3: return new Ctor(args[0], args[1], args[2]);
        case 4: return new Ctor(args[0], args[1], args[2], args[3]);
        case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
        case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
        case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
      }
      var thisBinding = baseCreate(Ctor.prototype),
          result = Ctor.apply(thisBinding, args);

      // Mimic the constructor's `return` behavior.
      // See https://es5.github.io/#x13.2.2 for more details.
      return isObject(result) ? result : thisBinding;
    };
  }

  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG = 1;

  /**
   * Creates a function that wraps `func` to invoke it with the optional `this`
   * binding of `thisArg`.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @returns {Function} Returns the new wrapped function.
   */
  function createBind(func, bitmask, thisArg) {
    var isBind = bitmask & WRAP_BIND_FLAG,
        Ctor = createCtor(func);

    function wrapper() {
      var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
      return fn.apply(isBind ? thisArg : this, arguments);
    }
    return wrapper;
  }

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max;

  /**
   * Creates an array that is the composition of partially applied arguments,
   * placeholders, and provided arguments into a single array of arguments.
   *
   * @private
   * @param {Array} args The provided arguments.
   * @param {Array} partials The arguments to prepend to those provided.
   * @param {Array} holders The `partials` placeholder indexes.
   * @params {boolean} [isCurried] Specify composing for a curried function.
   * @returns {Array} Returns the new array of composed arguments.
   */
  function composeArgs(args, partials, holders, isCurried) {
    var argsIndex = -1,
        argsLength = args.length,
        holdersLength = holders.length,
        leftIndex = -1,
        leftLength = partials.length,
        rangeLength = nativeMax(argsLength - holdersLength, 0),
        result = Array(leftLength + rangeLength),
        isUncurried = !isCurried;

    while (++leftIndex < leftLength) {
      result[leftIndex] = partials[leftIndex];
    }
    while (++argsIndex < holdersLength) {
      if (isUncurried || argsIndex < argsLength) {
        result[holders[argsIndex]] = args[argsIndex];
      }
    }
    while (rangeLength--) {
      result[leftIndex++] = args[argsIndex++];
    }
    return result;
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax$1 = Math.max;

  /**
   * This function is like `composeArgs` except that the arguments composition
   * is tailored for `_.partialRight`.
   *
   * @private
   * @param {Array} args The provided arguments.
   * @param {Array} partials The arguments to append to those provided.
   * @param {Array} holders The `partials` placeholder indexes.
   * @params {boolean} [isCurried] Specify composing for a curried function.
   * @returns {Array} Returns the new array of composed arguments.
   */
  function composeArgsRight(args, partials, holders, isCurried) {
    var argsIndex = -1,
        argsLength = args.length,
        holdersIndex = -1,
        holdersLength = holders.length,
        rightIndex = -1,
        rightLength = partials.length,
        rangeLength = nativeMax$1(argsLength - holdersLength, 0),
        result = Array(rangeLength + rightLength),
        isUncurried = !isCurried;

    while (++argsIndex < rangeLength) {
      result[argsIndex] = args[argsIndex];
    }
    var offset = argsIndex;
    while (++rightIndex < rightLength) {
      result[offset + rightIndex] = partials[rightIndex];
    }
    while (++holdersIndex < holdersLength) {
      if (isUncurried || argsIndex < argsLength) {
        result[offset + holders[holdersIndex]] = args[argsIndex++];
      }
    }
    return result;
  }

  /**
   * Gets the number of `placeholder` occurrences in `array`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} placeholder The placeholder to search for.
   * @returns {number} Returns the placeholder count.
   */
  function countHolders(array, placeholder) {
    var length = array.length,
        result = 0;

    while (length--) {
      if (array[length] === placeholder) {
        ++result;
      }
    }
    return result;
  }

  /**
   * The function whose prototype chain sequence wrappers inherit from.
   *
   * @private
   */
  function baseLodash() {
    // No operation performed.
  }

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295;

  /**
   * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
   *
   * @private
   * @constructor
   * @param {*} value The value to wrap.
   */
  function LazyWrapper(value) {
    this.__wrapped__ = value;
    this.__actions__ = [];
    this.__dir__ = 1;
    this.__filtered__ = false;
    this.__iteratees__ = [];
    this.__takeCount__ = MAX_ARRAY_LENGTH;
    this.__views__ = [];
  }

  // Ensure `LazyWrapper` is an instance of `baseLodash`.
  LazyWrapper.prototype = baseCreate(baseLodash.prototype);
  LazyWrapper.prototype.constructor = LazyWrapper;

  /**
   * This method returns `undefined`.
   *
   * @static
   * @memberOf _
   * @since 2.3.0
   * @category Util
   * @example
   *
   * _.times(2, _.noop);
   * // => [undefined, undefined]
   */
  function noop() {
    // No operation performed.
  }

  /**
   * Gets metadata for `func`.
   *
   * @private
   * @param {Function} func The function to query.
   * @returns {*} Returns the metadata for `func`.
   */
  var getData = !metaMap ? noop : function(func) {
    return metaMap.get(func);
  };

  /** Used to lookup unminified function names. */
  var realNames = {};

  /** Used for built-in method references. */
  var objectProto$3 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

  /**
   * Gets the name of `func`.
   *
   * @private
   * @param {Function} func The function to query.
   * @returns {string} Returns the function name.
   */
  function getFuncName(func) {
    var result = (func.name + ''),
        array = realNames[result],
        length = hasOwnProperty$2.call(realNames, result) ? array.length : 0;

    while (length--) {
      var data = array[length],
          otherFunc = data.func;
      if (otherFunc == null || otherFunc == func) {
        return data.name;
      }
    }
    return result;
  }

  /**
   * The base constructor for creating `lodash` wrapper objects.
   *
   * @private
   * @param {*} value The value to wrap.
   * @param {boolean} [chainAll] Enable explicit method chain sequences.
   */
  function LodashWrapper(value, chainAll) {
    this.__wrapped__ = value;
    this.__actions__ = [];
    this.__chain__ = !!chainAll;
    this.__index__ = 0;
    this.__values__ = undefined;
  }

  LodashWrapper.prototype = baseCreate(baseLodash.prototype);
  LodashWrapper.prototype.constructor = LodashWrapper;

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */
  function copyArray(source, array) {
    var index = -1,
        length = source.length;

    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }

  /**
   * Creates a clone of `wrapper`.
   *
   * @private
   * @param {Object} wrapper The wrapper to clone.
   * @returns {Object} Returns the cloned wrapper.
   */
  function wrapperClone(wrapper) {
    if (wrapper instanceof LazyWrapper) {
      return wrapper.clone();
    }
    var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
    result.__actions__ = copyArray(wrapper.__actions__);
    result.__index__  = wrapper.__index__;
    result.__values__ = wrapper.__values__;
    return result;
  }

  /** Used for built-in method references. */
  var objectProto$4 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

  /**
   * Creates a `lodash` object which wraps `value` to enable implicit method
   * chain sequences. Methods that operate on and return arrays, collections,
   * and functions can be chained together. Methods that retrieve a single value
   * or may return a primitive value will automatically end the chain sequence
   * and return the unwrapped value. Otherwise, the value must be unwrapped
   * with `_#value`.
   *
   * Explicit chain sequences, which must be unwrapped with `_#value`, may be
   * enabled using `_.chain`.
   *
   * The execution of chained methods is lazy, that is, it's deferred until
   * `_#value` is implicitly or explicitly called.
   *
   * Lazy evaluation allows several methods to support shortcut fusion.
   * Shortcut fusion is an optimization to merge iteratee calls; this avoids
   * the creation of intermediate arrays and can greatly reduce the number of
   * iteratee executions. Sections of a chain sequence qualify for shortcut
   * fusion if the section is applied to an array and iteratees accept only
   * one argument. The heuristic for whether a section qualifies for shortcut
   * fusion is subject to change.
   *
   * Chaining is supported in custom builds as long as the `_#value` method is
   * directly or indirectly included in the build.
   *
   * In addition to lodash methods, wrappers have `Array` and `String` methods.
   *
   * The wrapper `Array` methods are:
   * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
   *
   * The wrapper `String` methods are:
   * `replace` and `split`
   *
   * The wrapper methods that support shortcut fusion are:
   * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
   * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
   * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
   *
   * The chainable wrapper methods are:
   * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
   * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
   * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
   * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
   * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
   * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
   * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
   * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
   * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
   * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
   * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
   * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
   * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
   * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
   * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
   * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
   * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
   * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
   * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
   * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
   * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
   * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
   * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
   * `zipObject`, `zipObjectDeep`, and `zipWith`
   *
   * The wrapper methods that are **not** chainable by default are:
   * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
   * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
   * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
   * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
   * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
   * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
   * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
   * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
   * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
   * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
   * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
   * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
   * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
   * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
   * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
   * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
   * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
   * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
   * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
   * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
   * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
   * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
   * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
   * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
   * `upperFirst`, `value`, and `words`
   *
   * @name _
   * @constructor
   * @category Seq
   * @param {*} value The value to wrap in a `lodash` instance.
   * @returns {Object} Returns the new `lodash` wrapper instance.
   * @example
   *
   * function square(n) {
   *   return n * n;
   * }
   *
   * var wrapped = _([1, 2, 3]);
   *
   * // Returns an unwrapped value.
   * wrapped.reduce(_.add);
   * // => 6
   *
   * // Returns a wrapped value.
   * var squares = wrapped.map(square);
   *
   * _.isArray(squares);
   * // => false
   *
   * _.isArray(squares.value());
   * // => true
   */
  function lodash(value) {
    if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
      if (value instanceof LodashWrapper) {
        return value;
      }
      if (hasOwnProperty$3.call(value, '__wrapped__')) {
        return wrapperClone(value);
      }
    }
    return new LodashWrapper(value);
  }

  // Ensure wrappers are instances of `baseLodash`.
  lodash.prototype = baseLodash.prototype;
  lodash.prototype.constructor = lodash;

  /**
   * Checks if `func` has a lazy counterpart.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
   *  else `false`.
   */
  function isLaziable(func) {
    var funcName = getFuncName(func),
        other = lodash[funcName];

    if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
      return false;
    }
    if (func === other) {
      return true;
    }
    var data = getData(other);
    return !!data && func === data[0];
  }

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800,
      HOT_SPAN = 16;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeNow = Date.now;

  /**
   * Creates a function that'll short out and invoke `identity` instead
   * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
   * milliseconds.
   *
   * @private
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new shortable function.
   */
  function shortOut(func) {
    var count = 0,
        lastCalled = 0;

    return function() {
      var stamp = nativeNow(),
          remaining = HOT_SPAN - (stamp - lastCalled);

      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(undefined, arguments);
    };
  }

  /**
   * Sets metadata for `func`.
   *
   * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
   * period of time, it will trip its breaker and transition to an identity
   * function to avoid garbage collection pauses in V8. See
   * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
   * for more details.
   *
   * @private
   * @param {Function} func The function to associate metadata with.
   * @param {*} data The metadata.
   * @returns {Function} Returns `func`.
   */
  var setData = shortOut(baseSetData);

  /** Used to match wrap detail comments. */
  var reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
      reSplitDetails = /,? & /;

  /**
   * Extracts wrapper details from the `source` body comment.
   *
   * @private
   * @param {string} source The source to inspect.
   * @returns {Array} Returns the wrapper details.
   */
  function getWrapDetails(source) {
    var match = source.match(reWrapDetails);
    return match ? match[1].split(reSplitDetails) : [];
  }

  /** Used to match wrap detail comments. */
  var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;

  /**
   * Inserts wrapper `details` in a comment at the top of the `source` body.
   *
   * @private
   * @param {string} source The source to modify.
   * @returns {Array} details The details to insert.
   * @returns {string} Returns the modified source.
   */
  function insertWrapDetails(source, details) {
    var length = details.length;
    if (!length) {
      return source;
    }
    var lastIndex = length - 1;
    details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
    details = details.join(length > 2 ? ', ' : ' ');
    return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
  }

  /**
   * Creates a function that returns `value`.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {*} value The value to return from the new function.
   * @returns {Function} Returns the new constant function.
   * @example
   *
   * var objects = _.times(2, _.constant({ 'a': 1 }));
   *
   * console.log(objects);
   * // => [{ 'a': 1 }, { 'a': 1 }]
   *
   * console.log(objects[0] === objects[1]);
   * // => true
   */
  function constant(value) {
    return function() {
      return value;
    };
  }

  var defineProperty = (function() {
    try {
      var func = getNative(Object, 'defineProperty');
      func({}, '', {});
      return func;
    } catch (e) {}
  }());

  /**
   * The base implementation of `setToString` without support for hot loop shorting.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var baseSetToString = !defineProperty ? identity : function(func, string) {
    return defineProperty(func, 'toString', {
      'configurable': true,
      'enumerable': false,
      'value': constant(string),
      'writable': true
    });
  };

  /**
   * Sets the `toString` method of `func` to return `string`.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var setToString = shortOut(baseSetToString);

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */
  function baseIsNaN(value) {
    return value !== value;
  }

  /**
   * A specialized version of `_.indexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    return value === value
      ? strictIndexOf(array, value, fromIndex)
      : baseFindIndex(array, baseIsNaN, fromIndex);
  }

  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludes(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseIndexOf(array, value, 0) > -1;
  }

  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG$1 = 1,
      WRAP_BIND_KEY_FLAG = 2,
      WRAP_CURRY_FLAG = 8,
      WRAP_CURRY_RIGHT_FLAG = 16,
      WRAP_PARTIAL_FLAG = 32,
      WRAP_PARTIAL_RIGHT_FLAG = 64,
      WRAP_ARY_FLAG = 128,
      WRAP_REARG_FLAG = 256,
      WRAP_FLIP_FLAG = 512;

  /** Used to associate wrap methods with their bit flags. */
  var wrapFlags = [
    ['ary', WRAP_ARY_FLAG],
    ['bind', WRAP_BIND_FLAG$1],
    ['bindKey', WRAP_BIND_KEY_FLAG],
    ['curry', WRAP_CURRY_FLAG],
    ['curryRight', WRAP_CURRY_RIGHT_FLAG],
    ['flip', WRAP_FLIP_FLAG],
    ['partial', WRAP_PARTIAL_FLAG],
    ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
    ['rearg', WRAP_REARG_FLAG]
  ];

  /**
   * Updates wrapper `details` based on `bitmask` flags.
   *
   * @private
   * @returns {Array} details The details to modify.
   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
   * @returns {Array} Returns `details`.
   */
  function updateWrapDetails(details, bitmask) {
    arrayEach(wrapFlags, function(pair) {
      var value = '_.' + pair[0];
      if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {
        details.push(value);
      }
    });
    return details.sort();
  }

  /**
   * Sets the `toString` method of `wrapper` to mimic the source of `reference`
   * with wrapper details in a comment at the top of the source body.
   *
   * @private
   * @param {Function} wrapper The function to modify.
   * @param {Function} reference The reference function.
   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
   * @returns {Function} Returns `wrapper`.
   */
  function setWrapToString(wrapper, reference, bitmask) {
    var source = (reference + '');
    return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
  }

  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG$2 = 1,
      WRAP_BIND_KEY_FLAG$1 = 2,
      WRAP_CURRY_BOUND_FLAG = 4,
      WRAP_CURRY_FLAG$1 = 8,
      WRAP_PARTIAL_FLAG$1 = 32,
      WRAP_PARTIAL_RIGHT_FLAG$1 = 64;

  /**
   * Creates a function that wraps `func` to continue currying.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
   * @param {Function} wrapFunc The function to create the `func` wrapper.
   * @param {*} placeholder The placeholder value.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {Array} [partials] The arguments to prepend to those provided to
   *  the new function.
   * @param {Array} [holders] The `partials` placeholder indexes.
   * @param {Array} [argPos] The argument positions of the new function.
   * @param {number} [ary] The arity cap of `func`.
   * @param {number} [arity] The arity of `func`.
   * @returns {Function} Returns the new wrapped function.
   */
  function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
    var isCurry = bitmask & WRAP_CURRY_FLAG$1,
        newHolders = isCurry ? holders : undefined,
        newHoldersRight = isCurry ? undefined : holders,
        newPartials = isCurry ? partials : undefined,
        newPartialsRight = isCurry ? undefined : partials;

    bitmask |= (isCurry ? WRAP_PARTIAL_FLAG$1 : WRAP_PARTIAL_RIGHT_FLAG$1);
    bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG$1 : WRAP_PARTIAL_FLAG$1);

    if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
      bitmask &= ~(WRAP_BIND_FLAG$2 | WRAP_BIND_KEY_FLAG$1);
    }
    var newData = [
      func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
      newHoldersRight, argPos, ary, arity
    ];

    var result = wrapFunc.apply(undefined, newData);
    if (isLaziable(func)) {
      setData(result, newData);
    }
    result.placeholder = placeholder;
    return setWrapToString(result, func, bitmask);
  }

  /**
   * Gets the argument placeholder value for `func`.
   *
   * @private
   * @param {Function} func The function to inspect.
   * @returns {*} Returns the placeholder value.
   */
  function getHolder(func) {
    var object = func;
    return object.placeholder;
  }

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;

    return !!length &&
      (type == 'number' ||
        (type != 'symbol' && reIsUint.test(value))) &&
          (value > -1 && value % 1 == 0 && value < length);
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMin = Math.min;

  /**
   * Reorder `array` according to the specified indexes where the element at
   * the first index is assigned as the first element, the element at
   * the second index is assigned as the second element, and so on.
   *
   * @private
   * @param {Array} array The array to reorder.
   * @param {Array} indexes The arranged array indexes.
   * @returns {Array} Returns `array`.
   */
  function reorder(array, indexes) {
    var arrLength = array.length,
        length = nativeMin(indexes.length, arrLength),
        oldArray = copyArray(array);

    while (length--) {
      var index = indexes[length];
      array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
    }
    return array;
  }

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value === placeholder || value === PLACEHOLDER) {
        array[index] = PLACEHOLDER;
        result[resIndex++] = index;
      }
    }
    return result;
  }

  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG$3 = 1,
      WRAP_BIND_KEY_FLAG$2 = 2,
      WRAP_CURRY_FLAG$2 = 8,
      WRAP_CURRY_RIGHT_FLAG$1 = 16,
      WRAP_ARY_FLAG$1 = 128,
      WRAP_FLIP_FLAG$1 = 512;

  /**
   * Creates a function that wraps `func` to invoke it with optional `this`
   * binding of `thisArg`, partial application, and currying.
   *
   * @private
   * @param {Function|string} func The function or method name to wrap.
   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {Array} [partials] The arguments to prepend to those provided to
   *  the new function.
   * @param {Array} [holders] The `partials` placeholder indexes.
   * @param {Array} [partialsRight] The arguments to append to those provided
   *  to the new function.
   * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
   * @param {Array} [argPos] The argument positions of the new function.
   * @param {number} [ary] The arity cap of `func`.
   * @param {number} [arity] The arity of `func`.
   * @returns {Function} Returns the new wrapped function.
   */
  function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
    var isAry = bitmask & WRAP_ARY_FLAG$1,
        isBind = bitmask & WRAP_BIND_FLAG$3,
        isBindKey = bitmask & WRAP_BIND_KEY_FLAG$2,
        isCurried = bitmask & (WRAP_CURRY_FLAG$2 | WRAP_CURRY_RIGHT_FLAG$1),
        isFlip = bitmask & WRAP_FLIP_FLAG$1,
        Ctor = isBindKey ? undefined : createCtor(func);

    function wrapper() {
      var length = arguments.length,
          args = Array(length),
          index = length;

      while (index--) {
        args[index] = arguments[index];
      }
      if (isCurried) {
        var placeholder = getHolder(wrapper),
            holdersCount = countHolders(args, placeholder);
      }
      if (partials) {
        args = composeArgs(args, partials, holders, isCurried);
      }
      if (partialsRight) {
        args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
      }
      length -= holdersCount;
      if (isCurried && length < arity) {
        var newHolders = replaceHolders(args, placeholder);
        return createRecurry(
          func, bitmask, createHybrid, wrapper.placeholder, thisArg,
          args, newHolders, argPos, ary, arity - length
        );
      }
      var thisBinding = isBind ? thisArg : this,
          fn = isBindKey ? thisBinding[func] : func;

      length = args.length;
      if (argPos) {
        args = reorder(args, argPos);
      } else if (isFlip && length > 1) {
        args.reverse();
      }
      if (isAry && ary < length) {
        args.length = ary;
      }
      if (this && this !== root && this instanceof wrapper) {
        fn = Ctor || createCtor(fn);
      }
      return fn.apply(thisBinding, args);
    }
    return wrapper;
  }

  /**
   * Creates a function that wraps `func` to enable currying.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
   * @param {number} arity The arity of `func`.
   * @returns {Function} Returns the new wrapped function.
   */
  function createCurry(func, bitmask, arity) {
    var Ctor = createCtor(func);

    function wrapper() {
      var length = arguments.length,
          args = Array(length),
          index = length,
          placeholder = getHolder(wrapper);

      while (index--) {
        args[index] = arguments[index];
      }
      var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
        ? []
        : replaceHolders(args, placeholder);

      length -= holders.length;
      if (length < arity) {
        return createRecurry(
          func, bitmask, createHybrid, wrapper.placeholder, undefined,
          args, holders, undefined, undefined, arity - length);
      }
      var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
      return apply(fn, this, args);
    }
    return wrapper;
  }

  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG$4 = 1;

  /**
   * Creates a function that wraps `func` to invoke it with the `this` binding
   * of `thisArg` and `partials` prepended to the arguments it receives.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} partials The arguments to prepend to those provided to
   *  the new function.
   * @returns {Function} Returns the new wrapped function.
   */
  function createPartial(func, bitmask, thisArg, partials) {
    var isBind = bitmask & WRAP_BIND_FLAG$4,
        Ctor = createCtor(func);

    function wrapper() {
      var argsIndex = -1,
          argsLength = arguments.length,
          leftIndex = -1,
          leftLength = partials.length,
          args = Array(leftLength + argsLength),
          fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

      while (++leftIndex < leftLength) {
        args[leftIndex] = partials[leftIndex];
      }
      while (argsLength--) {
        args[leftIndex++] = arguments[++argsIndex];
      }
      return apply(fn, isBind ? thisArg : this, args);
    }
    return wrapper;
  }

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER$1 = '__lodash_placeholder__';

  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG$5 = 1,
      WRAP_BIND_KEY_FLAG$3 = 2,
      WRAP_CURRY_BOUND_FLAG$1 = 4,
      WRAP_CURRY_FLAG$3 = 8,
      WRAP_ARY_FLAG$2 = 128,
      WRAP_REARG_FLAG$1 = 256;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMin$1 = Math.min;

  /**
   * Merges the function metadata of `source` into `data`.
   *
   * Merging metadata reduces the number of wrappers used to invoke a function.
   * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
   * may be applied regardless of execution order. Methods like `_.ary` and
   * `_.rearg` modify function arguments, making the order in which they are
   * executed important, preventing the merging of metadata. However, we make
   * an exception for a safe combined case where curried functions have `_.ary`
   * and or `_.rearg` applied.
   *
   * @private
   * @param {Array} data The destination metadata.
   * @param {Array} source The source metadata.
   * @returns {Array} Returns `data`.
   */
  function mergeData(data, source) {
    var bitmask = data[1],
        srcBitmask = source[1],
        newBitmask = bitmask | srcBitmask,
        isCommon = newBitmask < (WRAP_BIND_FLAG$5 | WRAP_BIND_KEY_FLAG$3 | WRAP_ARY_FLAG$2);

    var isCombo =
      ((srcBitmask == WRAP_ARY_FLAG$2) && (bitmask == WRAP_CURRY_FLAG$3)) ||
      ((srcBitmask == WRAP_ARY_FLAG$2) && (bitmask == WRAP_REARG_FLAG$1) && (data[7].length <= source[8])) ||
      ((srcBitmask == (WRAP_ARY_FLAG$2 | WRAP_REARG_FLAG$1)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG$3));

    // Exit early if metadata can't be merged.
    if (!(isCommon || isCombo)) {
      return data;
    }
    // Use source `thisArg` if available.
    if (srcBitmask & WRAP_BIND_FLAG$5) {
      data[2] = source[2];
      // Set when currying a bound function.
      newBitmask |= bitmask & WRAP_BIND_FLAG$5 ? 0 : WRAP_CURRY_BOUND_FLAG$1;
    }
    // Compose partial arguments.
    var value = source[3];
    if (value) {
      var partials = data[3];
      data[3] = partials ? composeArgs(partials, value, source[4]) : value;
      data[4] = partials ? replaceHolders(data[3], PLACEHOLDER$1) : source[4];
    }
    // Compose partial right arguments.
    value = source[5];
    if (value) {
      partials = data[5];
      data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
      data[6] = partials ? replaceHolders(data[5], PLACEHOLDER$1) : source[6];
    }
    // Use source `argPos` if available.
    value = source[7];
    if (value) {
      data[7] = value;
    }
    // Use source `ary` if it's smaller.
    if (srcBitmask & WRAP_ARY_FLAG$2) {
      data[8] = data[8] == null ? source[8] : nativeMin$1(data[8], source[8]);
    }
    // Use source `arity` if one is not provided.
    if (data[9] == null) {
      data[9] = source[9];
    }
    // Use source `func` and merge bitmasks.
    data[0] = source[0];
    data[1] = newBitmask;

    return data;
  }

  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG$6 = 1,
      WRAP_BIND_KEY_FLAG$4 = 2,
      WRAP_CURRY_FLAG$4 = 8,
      WRAP_CURRY_RIGHT_FLAG$2 = 16,
      WRAP_PARTIAL_FLAG$2 = 32,
      WRAP_PARTIAL_RIGHT_FLAG$2 = 64;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax$2 = Math.max;

  /**
   * Creates a function that either curries or invokes `func` with optional
   * `this` binding and partially applied arguments.
   *
   * @private
   * @param {Function|string} func The function or method name to wrap.
   * @param {number} bitmask The bitmask flags.
   *    1 - `_.bind`
   *    2 - `_.bindKey`
   *    4 - `_.curry` or `_.curryRight` of a bound function
   *    8 - `_.curry`
   *   16 - `_.curryRight`
   *   32 - `_.partial`
   *   64 - `_.partialRight`
   *  128 - `_.rearg`
   *  256 - `_.ary`
   *  512 - `_.flip`
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {Array} [partials] The arguments to be partially applied.
   * @param {Array} [holders] The `partials` placeholder indexes.
   * @param {Array} [argPos] The argument positions of the new function.
   * @param {number} [ary] The arity cap of `func`.
   * @param {number} [arity] The arity of `func`.
   * @returns {Function} Returns the new wrapped function.
   */
  function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
    var isBindKey = bitmask & WRAP_BIND_KEY_FLAG$4;
    if (!isBindKey && typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var length = partials ? partials.length : 0;
    if (!length) {
      bitmask &= ~(WRAP_PARTIAL_FLAG$2 | WRAP_PARTIAL_RIGHT_FLAG$2);
      partials = holders = undefined;
    }
    ary = ary === undefined ? ary : nativeMax$2(toInteger(ary), 0);
    arity = arity === undefined ? arity : toInteger(arity);
    length -= holders ? holders.length : 0;

    if (bitmask & WRAP_PARTIAL_RIGHT_FLAG$2) {
      var partialsRight = partials,
          holdersRight = holders;

      partials = holders = undefined;
    }
    var data = isBindKey ? undefined : getData(func);

    var newData = [
      func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
      argPos, ary, arity
    ];

    if (data) {
      mergeData(newData, data);
    }
    func = newData[0];
    bitmask = newData[1];
    thisArg = newData[2];
    partials = newData[3];
    holders = newData[4];
    arity = newData[9] = newData[9] === undefined
      ? (isBindKey ? 0 : func.length)
      : nativeMax$2(newData[9] - length, 0);

    if (!arity && bitmask & (WRAP_CURRY_FLAG$4 | WRAP_CURRY_RIGHT_FLAG$2)) {
      bitmask &= ~(WRAP_CURRY_FLAG$4 | WRAP_CURRY_RIGHT_FLAG$2);
    }
    if (!bitmask || bitmask == WRAP_BIND_FLAG$6) {
      var result = createBind(func, bitmask, thisArg);
    } else if (bitmask == WRAP_CURRY_FLAG$4 || bitmask == WRAP_CURRY_RIGHT_FLAG$2) {
      result = createCurry(func, bitmask, arity);
    } else if ((bitmask == WRAP_PARTIAL_FLAG$2 || bitmask == (WRAP_BIND_FLAG$6 | WRAP_PARTIAL_FLAG$2)) && !holders.length) {
      result = createPartial(func, bitmask, thisArg, partials);
    } else {
      result = createHybrid.apply(undefined, newData);
    }
    var setter = data ? baseSetData : setData;
    return setWrapToString(setter(result, newData), func, bitmask);
  }

  /**
   * The base implementation of `assignValue` and `assignMergeValue` without
   * value checks.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function baseAssignValue(object, key, value) {
    if (key == '__proto__' && defineProperty) {
      defineProperty(object, key, {
        'configurable': true,
        'enumerable': true,
        'value': value,
        'writable': true
      });
    } else {
      object[key] = value;
    }
  }

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  /** Used for built-in method references. */
  var objectProto$5 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

  /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty$4.call(object, key) && eq(objValue, value)) ||
        (value === undefined && !(key in object))) {
      baseAssignValue(object, key, value);
    }
  }

  /**
   * Copies properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Array} props The property identifiers to copy.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Function} [customizer] The function to customize copied values.
   * @returns {Object} Returns `object`.
   */
  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});

    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];

      var newValue = customizer
        ? customizer(object[key], source[key], key, object, source)
        : undefined;

      if (newValue === undefined) {
        newValue = source[key];
      }
      if (isNew) {
        baseAssignValue(object, key, newValue);
      } else {
        assignValue(object, key, newValue);
      }
    }
    return object;
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax$3 = Math.max;

  /**
   * A specialized version of `baseRest` which transforms the rest array.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @param {Function} transform The rest array transform.
   * @returns {Function} Returns the new function.
   */
  function overRest(func, start, transform) {
    start = nativeMax$3(start === undefined ? (func.length - 1) : start, 0);
    return function() {
      var args = arguments,
          index = -1,
          length = nativeMax$3(args.length - start, 0),
          array = Array(length);

      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return apply(func, this, otherArgs);
    };
  }

  /**
   * The base implementation of `_.rest` which doesn't validate or coerce arguments.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   */
  function baseRest(func, start) {
    return setToString(overRest(func, start, identity), func + '');
  }

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER$1 = 9007199254740991;

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */
  function isLength(value) {
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
  }

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }

  /**
   * Checks if the given arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
   *  else `false`.
   */
  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == 'number'
          ? (isArrayLike(object) && isIndex(index, object.length))
          : (type == 'string' && index in object)
        ) {
      return eq(object[index], value);
    }
    return false;
  }

  /**
   * Creates a function like `_.assign`.
   *
   * @private
   * @param {Function} assigner The function to assign values.
   * @returns {Function} Returns the new assigner function.
   */
  function createAssigner(assigner) {
    return baseRest(function(object, sources) {
      var index = -1,
          length = sources.length,
          customizer = length > 1 ? sources[length - 1] : undefined,
          guard = length > 2 ? sources[2] : undefined;

      customizer = (assigner.length > 3 && typeof customizer == 'function')
        ? (length--, customizer)
        : undefined;

      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        customizer = length < 3 ? undefined : customizer;
        length = 1;
      }
      object = Object(object);
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, index, customizer);
        }
      }
      return object;
    });
  }

  /** Used for built-in method references. */
  var objectProto$6 = Object.prototype;

  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */
  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$6;

    return value === proto;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]';

  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag;
  }

  /** Used for built-in method references. */
  var objectProto$7 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

  /** Built-in value references. */
  var propertyIsEnumerable = objectProto$7.propertyIsEnumerable;

  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty$5.call(value, 'callee') &&
      !propertyIsEnumerable.call(value, 'callee');
  };

  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */
  function stubFalse() {
    return false;
  }

  /** Detect free variable `exports`. */
  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Built-in value references. */
  var Buffer = moduleExports ? root.Buffer : undefined;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */
  var isBuffer = nativeIsBuffer || stubFalse;

  /** `Object#toString` result references. */
  var argsTag$1 = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag$1 = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */
  function baseIsTypedArray(value) {
    return isObjectLike(value) &&
      isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /** Detect free variable `exports`. */
  var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports$1 && freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule$1 && freeModule$1.require && freeModule$1.require('util').types;

      if (types) {
        return types;
      }

      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  /* Node.js helper references. */
  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

  /** Used for built-in method references. */
  var objectProto$8 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value),
        isArg = !isArr && isArguments(value),
        isBuff = !isArr && !isArg && isBuffer(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? baseTimes(value.length, String) : [],
        length = result.length;

    for (var key in value) {
      if ((inherited || hasOwnProperty$6.call(value, key)) &&
          !(skipIndexes && (
             // Safari 9 has enumerable `arguments.length` in strict mode.
             key == 'length' ||
             // Node.js 0.10 has enumerable non-index properties on buffers.
             (isBuff && (key == 'offset' || key == 'parent')) ||
             // PhantomJS 2 has enumerable non-index properties on typed arrays.
             (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
             // Skip index properties.
             isIndex(key, length)
          ))) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeKeys = overArg(Object.keys, Object);

  /** Used for built-in method references. */
  var objectProto$9 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty$7.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */
  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }

  /**
   * This function is like
   * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * except that it includes inherited enumerable properties.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }

  /** Used for built-in method references. */
  var objectProto$a = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

  /**
   * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeysIn(object) {
    if (!isObject(object)) {
      return nativeKeysIn(object);
    }
    var isProto = isPrototype(object),
        result = [];

    for (var key in object) {
      if (!(key == 'constructor' && (isProto || !hasOwnProperty$8.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * Creates an array of the own and inherited enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   */
  function keysIn(object) {
    return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
  }

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/;

  /**
   * Checks if `value` is a property name and not a property path.
   *
   * @private
   * @param {*} value The value to check.
   * @param {Object} [object] The object to query keys on.
   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
   */
  function isKey(value, object) {
    if (isArray(value)) {
      return false;
    }
    var type = typeof value;
    if (type == 'number' || type == 'symbol' || type == 'boolean' ||
        value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
      (object != null && value in Object(object));
  }

  /* Built-in method references that are verified to be native. */
  var nativeCreate = getNative(Object, 'create');

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used for built-in method references. */
  var objectProto$b = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$9 = objectProto$b.hasOwnProperty;

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty$9.call(data, key) ? data[key] : undefined;
  }

  /** Used for built-in method references. */
  var objectProto$c = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$a = objectProto$c.hasOwnProperty;

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$a.call(data, key);
  }

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
    return this;
  }

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  /** Used for built-in method references. */
  var arrayProto = Array.prototype;

  /** Built-in value references. */
  var splice = arrayProto.splice;

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;

  /* Built-in method references that are verified to be native. */
  var Map = getNative(root, 'Map');

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new Hash,
      'map': new (Map || ListCache),
      'string': new Hash
    };
  }

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
      ? (value !== '__proto__')
      : (value === null);
  }

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    var result = getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet(key, value) {
    var data = getMapData(this, key),
        size = data.size;

    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;

  /** Error message constants. */
  var FUNC_ERROR_TEXT$1 = 'Expected a function';

  /**
   * Creates a function that memoizes the result of `func`. If `resolver` is
   * provided, it determines the cache key for storing the result based on the
   * arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is used as the map cache key. The `func`
   * is invoked with the `this` binding of the memoized function.
   *
   * **Note:** The cache is exposed as the `cache` property on the memoized
   * function. Its creation may be customized by replacing the `_.memoize.Cache`
   * constructor with one whose instances implement the
   * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
   * method interface of `clear`, `delete`, `get`, `has`, and `set`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] The function to resolve the cache key.
   * @returns {Function} Returns the new memoized function.
   * @example
   *
   * var object = { 'a': 1, 'b': 2 };
   * var other = { 'c': 3, 'd': 4 };
   *
   * var values = _.memoize(_.values);
   * values(object);
   * // => [1, 2]
   *
   * values(other);
   * // => [3, 4]
   *
   * object.a = 2;
   * values(object);
   * // => [1, 2]
   *
   * // Modify the result cache.
   * values.cache.set(object, ['a', 'b']);
   * values(object);
   * // => ['a', 'b']
   *
   * // Replace `_.memoize.Cache`.
   * _.memoize.Cache = WeakMap;
   */
  function memoize(func, resolver) {
    if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
      throw new TypeError(FUNC_ERROR_TEXT$1);
    }
    var memoized = function() {
      var args = arguments,
          key = resolver ? resolver.apply(this, args) : args[0],
          cache = memoized.cache;

      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache);
    return memoized;
  }

  // Expose `MapCache`.
  memoize.Cache = MapCache;

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /**
   * A specialized version of `_.memoize` which clears the memoized function's
   * cache when it exceeds `MAX_MEMOIZE_SIZE`.
   *
   * @private
   * @param {Function} func The function to have its output memoized.
   * @returns {Function} Returns the new memoized function.
   */
  function memoizeCapped(func) {
    var result = memoize(func, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });

    var cache = result.cache;
    return result;
  }

  /** Used to match property names within property paths. */
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Converts `string` to a property path array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the property path array.
   */
  var stringToPath = memoizeCapped(function(string) {
    var result = [];
    if (string.charCodeAt(0) === 46 /* . */) {
      result.push('');
    }
    string.replace(rePropName, function(match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
    });
    return result;
  });

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString(value) {
    return value == null ? '' : baseToString(value);
  }

  /**
   * Casts `value` to a path array if it's not one.
   *
   * @private
   * @param {*} value The value to inspect.
   * @param {Object} [object] The object to query keys on.
   * @returns {Array} Returns the cast property path array.
   */
  function castPath(value, object) {
    if (isArray(value)) {
      return value;
    }
    return isKey(value, object) ? [value] : stringToPath(toString(value));
  }

  /** Used as references for various `Number` constants. */
  var INFINITY$2 = 1 / 0;

  /**
   * Converts `value` to a string key if it's not a string or symbol.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {string|symbol} Returns the key.
   */
  function toKey(value) {
    if (typeof value == 'string' || isSymbol(value)) {
      return value;
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY$2) ? '-0' : result;
  }

  /**
   * The base implementation of `_.get` without support for default values.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @returns {*} Returns the resolved value.
   */
  function baseGet(object, path) {
    path = castPath(path, object);

    var index = 0,
        length = path.length;

    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return (index && index == length) ? object : undefined;
  }

  /**
   * Gets the value at `path` of `object`. If the resolved value is
   * `undefined`, the `defaultValue` is returned in its place.
   *
   * @static
   * @memberOf _
   * @since 3.7.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @param {*} [defaultValue] The value returned for `undefined` resolved values.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c': 3 } }] };
   *
   * _.get(object, 'a[0].b.c');
   * // => 3
   *
   * _.get(object, ['a', '0', 'b', 'c']);
   * // => 3
   *
   * _.get(object, 'a.b.c', 'default');
   * // => 'default'
   */
  function get(object, path, defaultValue) {
    var result = object == null ? undefined : baseGet(object, path);
    return result === undefined ? defaultValue : result;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /** Built-in value references. */
  var getPrototype = overArg(Object.getPrototypeOf, Object);

  /** `Object#toString` result references. */
  var objectTag$1 = '[object Object]';

  /** Used for built-in method references. */
  var funcProto$2 = Function.prototype,
      objectProto$d = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$2 = funcProto$2.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$b = objectProto$d.hasOwnProperty;

  /** Used to infer the `Object` constructor. */
  var objectCtorString = funcToString$2.call(Object);

  /**
   * Checks if `value` is a plain object, that is, an object created by the
   * `Object` constructor or one with a `[[Prototype]]` of `null`.
   *
   * @static
   * @memberOf _
   * @since 0.8.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * _.isPlainObject(new Foo);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   *
   * _.isPlainObject(Object.create(null));
   * // => true
   */
  function isPlainObject(value) {
    if (!isObjectLike(value) || baseGetTag(value) != objectTag$1) {
      return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty$b.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor &&
      funcToString$2.call(Ctor) == objectCtorString;
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeIsFinite = root.isFinite,
      nativeMin$2 = Math.min;

  /**
   * Creates a function like `_.round`.
   *
   * @private
   * @param {string} methodName The name of the `Math` method to use when rounding.
   * @returns {Function} Returns the new round function.
   */
  function createRound(methodName) {
    var func = Math[methodName];
    return function(number, precision) {
      number = toNumber(number);
      precision = precision == null ? 0 : nativeMin$2(toInteger(precision), 292);
      if (precision && nativeIsFinite(number)) {
        // Shift with exponential notation to avoid floating-point issues.
        // See [MDN](https://mdn.io/round#Examples) for more details.
        var pair = (toString(number) + 'e').split('e'),
            value = func(pair[0] + 'e' + (+pair[1] + precision));

        pair = (toString(value) + 'e').split('e');
        return +(pair[0] + 'e' + (+pair[1] - precision));
      }
      return func(number);
    };
  }

  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */
  function stackClear() {
    this.__data__ = new ListCache;
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function stackDelete(key) {
    var data = this.__data__,
        result = data['delete'](key);

    this.size = data.size;
    return result;
  }

  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function stackGet(key) {
    return this.__data__.get(key);
  }

  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function stackHas(key) {
    return this.__data__.has(key);
  }

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs = data.__data__;
      if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }

  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }

  // Add methods to `Stack`.
  Stack.prototype.clear = stackClear;
  Stack.prototype['delete'] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;

  /** Detect free variable `exports`. */
  var freeExports$2 = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule$2 = freeExports$2 && typeof module == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;

  /** Built-in value references. */
  var Buffer$1 = moduleExports$2 ? root.Buffer : undefined,
      allocUnsafe = Buffer$1 ? Buffer$1.allocUnsafe : undefined;

  /**
   * Creates a clone of  `buffer`.
   *
   * @private
   * @param {Buffer} buffer The buffer to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Buffer} Returns the cloned buffer.
   */
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length,
        result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

    buffer.copy(result);
    return result;
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  /**
   * This method returns a new empty array.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {Array} Returns the new empty array.
   * @example
   *
   * var arrays = _.times(2, _.stubArray);
   *
   * console.log(arrays);
   * // => [[], []]
   *
   * console.log(arrays[0] === arrays[1]);
   * // => false
   */
  function stubArray() {
    return [];
  }

  /** Used for built-in method references. */
  var objectProto$e = Object.prototype;

  /** Built-in value references. */
  var propertyIsEnumerable$1 = objectProto$e.propertyIsEnumerable;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeGetSymbols = Object.getOwnPropertySymbols;

  /**
   * Creates an array of the own enumerable symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */
  var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter(nativeGetSymbols(object), function(symbol) {
      return propertyIsEnumerable$1.call(object, symbol);
    });
  };

  /**
   * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
   * `keysFunc` and `symbolsFunc` to get the enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @param {Function} symbolsFunc The function to get the symbols of `object`.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
  }

  /**
   * Creates an array of own enumerable property names and symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
  }

  /* Built-in method references that are verified to be native. */
  var DataView = getNative(root, 'DataView');

  /* Built-in method references that are verified to be native. */
  var Promise$1 = getNative(root, 'Promise');

  /* Built-in method references that are verified to be native. */
  var Set = getNative(root, 'Set');

  /** `Object#toString` result references. */
  var mapTag$1 = '[object Map]',
      objectTag$2 = '[object Object]',
      promiseTag = '[object Promise]',
      setTag$1 = '[object Set]',
      weakMapTag$1 = '[object WeakMap]';

  var dataViewTag$1 = '[object DataView]';

  /** Used to detect maps, sets, and weakmaps. */
  var dataViewCtorString = toSource(DataView),
      mapCtorString = toSource(Map),
      promiseCtorString = toSource(Promise$1),
      setCtorString = toSource(Set),
      weakMapCtorString = toSource(WeakMap);

  /**
   * Gets the `toStringTag` of `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  var getTag = baseGetTag;

  // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
  if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$1) ||
      (Map && getTag(new Map) != mapTag$1) ||
      (Promise$1 && getTag(Promise$1.resolve()) != promiseTag) ||
      (Set && getTag(new Set) != setTag$1) ||
      (WeakMap && getTag(new WeakMap) != weakMapTag$1)) {
    getTag = function(value) {
      var result = baseGetTag(value),
          Ctor = result == objectTag$2 ? value.constructor : undefined,
          ctorString = Ctor ? toSource(Ctor) : '';

      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString: return dataViewTag$1;
          case mapCtorString: return mapTag$1;
          case promiseCtorString: return promiseTag;
          case setCtorString: return setTag$1;
          case weakMapCtorString: return weakMapTag$1;
        }
      }
      return result;
    };
  }

  var getTag$1 = getTag;

  /** Built-in value references. */
  var Uint8Array$1 = root.Uint8Array;

  /**
   * Creates a clone of `arrayBuffer`.
   *
   * @private
   * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array$1(result).set(new Uint8Array$1(arrayBuffer));
    return result;
  }

  /**
   * Creates a clone of `typedArray`.
   *
   * @private
   * @param {Object} typedArray The typed array to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned typed array.
   */
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }

  /**
   * Initializes an object clone.
   *
   * @private
   * @param {Object} object The object to clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneObject(object) {
    return (typeof object.constructor == 'function' && !isPrototype(object))
      ? baseCreate(getPrototype(object))
      : {};
  }

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

  /**
   * Adds `value` to the array cache.
   *
   * @private
   * @name add
   * @memberOf SetCache
   * @alias push
   * @param {*} value The value to cache.
   * @returns {Object} Returns the cache instance.
   */
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED$2);
    return this;
  }

  /**
   * Checks if `value` is in the array cache.
   *
   * @private
   * @name has
   * @memberOf SetCache
   * @param {*} value The value to search for.
   * @returns {number} Returns `true` if `value` is found, else `false`.
   */
  function setCacheHas(value) {
    return this.__data__.has(value);
  }

  /**
   *
   * Creates an array cache object to store unique values.
   *
   * @private
   * @constructor
   * @param {Array} [values] The values to cache.
   */
  function SetCache(values) {
    var index = -1,
        length = values == null ? 0 : values.length;

    this.__data__ = new MapCache;
    while (++index < length) {
      this.add(values[index]);
    }
  }

  // Add methods to `SetCache`.
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;

  /**
   * A specialized version of `baseIsEqualDeep` for arrays with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Array} array The array to compare.
   * @param {Array} other The other array to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `array` and `other` objects.
   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
   */
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
        arrLength = array.length,
        othLength = other.length;

    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    // Assume cyclic values are equal.
    var stacked = stack.get(array);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var index = -1,
        result = true,
        seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

    stack.set(array, other);
    stack.set(other, array);

    // Ignore non-index properties.
    while (++index < arrLength) {
      var arrValue = array[index],
          othValue = other[index];

      if (customizer) {
        var compared = isPartial
          ? customizer(othValue, arrValue, index, other, array, stack)
          : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== undefined) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      // Recursively compare arrays (susceptible to call stack limits).
      if (seen) {
        if (!arraySome(other, function(othValue, othIndex) {
              if (!cacheHas(seen, othIndex) &&
                  (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                return seen.push(othIndex);
              }
            })) {
          result = false;
          break;
        }
      } else if (!(
            arrValue === othValue ||
              equalFunc(arrValue, othValue, bitmask, customizer, stack)
          )) {
        result = false;
        break;
      }
    }
    stack['delete'](array);
    stack['delete'](other);
    return result;
  }

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$1 = 1,
      COMPARE_UNORDERED_FLAG$1 = 2;

  /** `Object#toString` result references. */
  var boolTag$1 = '[object Boolean]',
      dateTag$1 = '[object Date]',
      errorTag$1 = '[object Error]',
      mapTag$2 = '[object Map]',
      numberTag$1 = '[object Number]',
      regexpTag$1 = '[object RegExp]',
      setTag$2 = '[object Set]',
      stringTag$1 = '[object String]',
      symbolTag$1 = '[object Symbol]';

  var arrayBufferTag$1 = '[object ArrayBuffer]',
      dataViewTag$2 = '[object DataView]';

  /** Used to convert symbols to primitives and strings. */
  var symbolProto$1 = Symbol ? Symbol.prototype : undefined,
      symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;

  /**
   * A specialized version of `baseIsEqualDeep` for comparing objects of
   * the same `toStringTag`.
   *
   * **Note:** This function only supports comparing values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {string} tag The `toStringTag` of the objects to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag$2:
        if ((object.byteLength != other.byteLength) ||
            (object.byteOffset != other.byteOffset)) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;

      case arrayBufferTag$1:
        if ((object.byteLength != other.byteLength) ||
            !equalFunc(new Uint8Array$1(object), new Uint8Array$1(other))) {
          return false;
        }
        return true;

      case boolTag$1:
      case dateTag$1:
      case numberTag$1:
        // Coerce booleans to `1` or `0` and dates to milliseconds.
        // Invalid dates are coerced to `NaN`.
        return eq(+object, +other);

      case errorTag$1:
        return object.name == other.name && object.message == other.message;

      case regexpTag$1:
      case stringTag$1:
        // Coerce regexes to strings and treat strings, primitives and objects,
        // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
        // for more details.
        return object == (other + '');

      case mapTag$2:
        var convert = mapToArray;

      case setTag$2:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
        convert || (convert = setToArray);

        if (object.size != other.size && !isPartial) {
          return false;
        }
        // Assume cyclic values are equal.
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG$1;

        // Recursively compare objects (susceptible to call stack limits).
        stack.set(object, other);
        var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack['delete'](object);
        return result;

      case symbolTag$1:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$2 = 1;

  /** Used for built-in method references. */
  var objectProto$f = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$c = objectProto$f.hasOwnProperty;

  /**
   * A specialized version of `baseIsEqualDeep` for objects with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
        objProps = getAllKeys(object),
        objLength = objProps.length,
        othProps = getAllKeys(other),
        othLength = othProps.length;

    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty$c.call(other, key))) {
        return false;
      }
    }
    // Assume cyclic values are equal.
    var stacked = stack.get(object);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);

    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key],
          othValue = other[key];

      if (customizer) {
        var compared = isPartial
          ? customizer(othValue, objValue, key, other, object, stack)
          : customizer(objValue, othValue, key, object, other, stack);
      }
      // Recursively compare objects (susceptible to call stack limits).
      if (!(compared === undefined
            ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
            : compared
          )) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == 'constructor');
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor,
          othCtor = other.constructor;

      // Non `Object` object instances with different constructors are not equal.
      if (objCtor != othCtor &&
          ('constructor' in object && 'constructor' in other) &&
          !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
            typeof othCtor == 'function' && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack['delete'](object);
    stack['delete'](other);
    return result;
  }

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$3 = 1;

  /** `Object#toString` result references. */
  var argsTag$2 = '[object Arguments]',
      arrayTag$1 = '[object Array]',
      objectTag$3 = '[object Object]';

  /** Used for built-in method references. */
  var objectProto$g = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$d = objectProto$g.hasOwnProperty;

  /**
   * A specialized version of `baseIsEqual` for arrays and objects which performs
   * deep comparisons and tracks traversed objects enabling objects with circular
   * references to be compared.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} [stack] Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray(object),
        othIsArr = isArray(other),
        objTag = objIsArr ? arrayTag$1 : getTag$1(object),
        othTag = othIsArr ? arrayTag$1 : getTag$1(other);

    objTag = objTag == argsTag$2 ? objectTag$3 : objTag;
    othTag = othTag == argsTag$2 ? objectTag$3 : othTag;

    var objIsObj = objTag == objectTag$3,
        othIsObj = othTag == objectTag$3,
        isSameTag = objTag == othTag;

    if (isSameTag && isBuffer(object)) {
      if (!isBuffer(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack);
      return (objIsArr || isTypedArray(object))
        ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
        : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
      var objIsWrapped = objIsObj && hasOwnProperty$d.call(object, '__wrapped__'),
          othIsWrapped = othIsObj && hasOwnProperty$d.call(other, '__wrapped__');

      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object,
            othUnwrapped = othIsWrapped ? other.value() : other;

        stack || (stack = new Stack);
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack);
    return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }

  /**
   * The base implementation of `_.isEqual` which supports partial comparisons
   * and tracks traversed objects.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {boolean} bitmask The bitmask flags.
   *  1 - Unordered comparison
   *  2 - Partial comparison
   * @param {Function} [customizer] The function to customize comparisons.
   * @param {Object} [stack] Tracks traversed `value` and `other` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$4 = 1,
      COMPARE_UNORDERED_FLAG$2 = 2;

  /**
   * The base implementation of `_.isMatch` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @param {Object} source The object of property values to match.
   * @param {Array} matchData The property names, values, and compare flags to match.
   * @param {Function} [customizer] The function to customize comparisons.
   * @returns {boolean} Returns `true` if `object` is a match, else `false`.
   */
  function baseIsMatch(object, source, matchData, customizer) {
    var index = matchData.length,
        length = index,
        noCustomizer = !customizer;

    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (index--) {
      var data = matchData[index];
      if ((noCustomizer && data[2])
            ? data[1] !== object[data[0]]
            : !(data[0] in object)
          ) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0],
          objValue = object[key],
          srcValue = data[1];

      if (noCustomizer && data[2]) {
        if (objValue === undefined && !(key in object)) {
          return false;
        }
      } else {
        var stack = new Stack;
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack);
        }
        if (!(result === undefined
              ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
              : result
            )) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` if suitable for strict
   *  equality comparisons, else `false`.
   */
  function isStrictComparable(value) {
    return value === value && !isObject(value);
  }

  /**
   * Gets the property names, values, and compare flags of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the match data of `object`.
   */
  function getMatchData(object) {
    var result = keys(object),
        length = result.length;

    while (length--) {
      var key = result[length],
          value = object[key];

      result[length] = [key, value, isStrictComparable(value)];
    }
    return result;
  }

  /**
   * A specialized version of `matchesProperty` for source values suitable
   * for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */
  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue &&
        (srcValue !== undefined || (key in Object(object)));
    };
  }

  /**
   * The base implementation of `_.matches` which doesn't clone `source`.
   *
   * @private
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new spec function.
   */
  function baseMatches(source) {
    var matchData = getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || baseIsMatch(object, source, matchData);
    };
  }

  /**
   * The base implementation of `_.hasIn` without support for deep paths.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {Array|string} key The key to check.
   * @returns {boolean} Returns `true` if `key` exists, else `false`.
   */
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }

  /**
   * Checks if `path` exists on `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @param {Function} hasFunc The function to check properties.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   */
  function hasPath(object, path, hasFunc) {
    path = castPath(path, object);

    var index = -1,
        length = path.length,
        result = false;

    while (++index < length) {
      var key = toKey(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index != length) {
      return result;
    }
    length = object == null ? 0 : object.length;
    return !!length && isLength(length) && isIndex(key, length) &&
      (isArray(object) || isArguments(object));
  }

  /**
   * Checks if `path` is a direct or inherited property of `object`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   * @example
   *
   * var object = _.create({ 'a': _.create({ 'b': 2 }) });
   *
   * _.hasIn(object, 'a');
   * // => true
   *
   * _.hasIn(object, 'a.b');
   * // => true
   *
   * _.hasIn(object, ['a', 'b']);
   * // => true
   *
   * _.hasIn(object, 'b');
   * // => false
   */
  function hasIn(object, path) {
    return object != null && hasPath(object, path, baseHasIn);
  }

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$5 = 1,
      COMPARE_UNORDERED_FLAG$3 = 2;

  /**
   * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
   *
   * @private
   * @param {string} path The path of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */
  function baseMatchesProperty(path, srcValue) {
    if (isKey(path) && isStrictComparable(srcValue)) {
      return matchesStrictComparable(toKey(path), srcValue);
    }
    return function(object) {
      var objValue = get(object, path);
      return (objValue === undefined && objValue === srcValue)
        ? hasIn(object, path)
        : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
    };
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * A specialized version of `baseProperty` which supports deep paths.
   *
   * @private
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyDeep(path) {
    return function(object) {
      return baseGet(object, path);
    };
  }

  /**
   * Creates a function that returns the value at `path` of a given object.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new accessor function.
   * @example
   *
   * var objects = [
   *   { 'a': { 'b': 2 } },
   *   { 'a': { 'b': 1 } }
   * ];
   *
   * _.map(objects, _.property('a.b'));
   * // => [2, 1]
   *
   * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
   * // => [1, 2]
   */
  function property(path) {
    return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
  }

  /**
   * The base implementation of `_.iteratee`.
   *
   * @private
   * @param {*} [value=_.identity] The value to convert to an iteratee.
   * @returns {Function} Returns the iteratee.
   */
  function baseIteratee(value) {
    // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
    // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
    if (typeof value == 'function') {
      return value;
    }
    if (value == null) {
      return identity;
    }
    if (typeof value == 'object') {
      return isArray(value)
        ? baseMatchesProperty(value[0], value[1])
        : baseMatches(value);
    }
    return property(value);
  }

  /**
   * Creates a base function for methods like `_.forIn` and `_.forOwn`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1,
          iterable = Object(object),
          props = keysFunc(object),
          length = props.length;

      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }

  /**
   * The base implementation of `baseForOwn` which iterates over `object`
   * properties returned by `keysFunc` and invokes `iteratee` for each property.
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */
  var baseFor = createBaseFor();

  /**
   * The base implementation of `_.forOwn` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */
  function baseForOwn(object, iteratee) {
    return object && baseFor(object, iteratee, keys);
  }

  /**
   * Creates a `baseEach` or `baseEachRight` function.
   *
   * @private
   * @param {Function} eachFunc The function to iterate over a collection.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseEach(eachFunc, fromRight) {
    return function(collection, iteratee) {
      if (collection == null) {
        return collection;
      }
      if (!isArrayLike(collection)) {
        return eachFunc(collection, iteratee);
      }
      var length = collection.length,
          index = fromRight ? length : -1,
          iterable = Object(collection);

      while ((fromRight ? index-- : ++index < length)) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }

  /**
   * The base implementation of `_.forEach` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   */
  var baseEach = createBaseEach(baseForOwn);

  /**
   * This function is like `assignValue` except that it doesn't assign
   * `undefined` values.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignMergeValue(object, key, value) {
    if ((value !== undefined && !eq(object[key], value)) ||
        (value === undefined && !(key in object))) {
      baseAssignValue(object, key, value);
    }
  }

  /**
   * This method is like `_.isArrayLike` except that it also checks if `value`
   * is an object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array-like object,
   *  else `false`.
   * @example
   *
   * _.isArrayLikeObject([1, 2, 3]);
   * // => true
   *
   * _.isArrayLikeObject(document.body.children);
   * // => true
   *
   * _.isArrayLikeObject('abc');
   * // => false
   *
   * _.isArrayLikeObject(_.noop);
   * // => false
   */
  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }

  /**
   * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function safeGet(object, key) {
    if (key === 'constructor' && typeof object[key] === 'function') {
      return;
    }

    if (key == '__proto__') {
      return;
    }

    return object[key];
  }

  /**
   * Converts `value` to a plain object flattening inherited enumerable string
   * keyed properties of `value` to own properties of the plain object.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {Object} Returns the converted plain object.
   * @example
   *
   * function Foo() {
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.assign({ 'a': 1 }, new Foo);
   * // => { 'a': 1, 'b': 2 }
   *
   * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
   * // => { 'a': 1, 'b': 2, 'c': 3 }
   */
  function toPlainObject(value) {
    return copyObject(value, keysIn(value));
  }

  /**
   * A specialized version of `baseMerge` for arrays and objects which performs
   * deep merges and tracks traversed objects enabling objects with circular
   * references to be merged.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {string} key The key of the value to merge.
   * @param {number} srcIndex The index of `source`.
   * @param {Function} mergeFunc The function to merge values.
   * @param {Function} [customizer] The function to customize assigned values.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   */
  function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
    var objValue = safeGet(object, key),
        srcValue = safeGet(source, key),
        stacked = stack.get(srcValue);

    if (stacked) {
      assignMergeValue(object, key, stacked);
      return;
    }
    var newValue = customizer
      ? customizer(objValue, srcValue, (key + ''), object, source, stack)
      : undefined;

    var isCommon = newValue === undefined;

    if (isCommon) {
      var isArr = isArray(srcValue),
          isBuff = !isArr && isBuffer(srcValue),
          isTyped = !isArr && !isBuff && isTypedArray(srcValue);

      newValue = srcValue;
      if (isArr || isBuff || isTyped) {
        if (isArray(objValue)) {
          newValue = objValue;
        }
        else if (isArrayLikeObject(objValue)) {
          newValue = copyArray(objValue);
        }
        else if (isBuff) {
          isCommon = false;
          newValue = cloneBuffer(srcValue, true);
        }
        else if (isTyped) {
          isCommon = false;
          newValue = cloneTypedArray(srcValue, true);
        }
        else {
          newValue = [];
        }
      }
      else if (isPlainObject(srcValue) || isArguments(srcValue)) {
        newValue = objValue;
        if (isArguments(objValue)) {
          newValue = toPlainObject(objValue);
        }
        else if (!isObject(objValue) || isFunction(objValue)) {
          newValue = initCloneObject(srcValue);
        }
      }
      else {
        isCommon = false;
      }
    }
    if (isCommon) {
      // Recursively merge objects and arrays (susceptible to call stack limits).
      stack.set(srcValue, newValue);
      mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      stack['delete'](srcValue);
    }
    assignMergeValue(object, key, newValue);
  }

  /**
   * The base implementation of `_.merge` without support for multiple sources.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {number} srcIndex The index of `source`.
   * @param {Function} [customizer] The function to customize merged values.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   */
  function baseMerge(object, source, srcIndex, customizer, stack) {
    if (object === source) {
      return;
    }
    baseFor(source, function(srcValue, key) {
      stack || (stack = new Stack);
      if (isObject(srcValue)) {
        baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
      }
      else {
        var newValue = customizer
          ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
          : undefined;

        if (newValue === undefined) {
          newValue = srcValue;
        }
        assignMergeValue(object, key, newValue);
      }
    }, keysIn);
  }

  /**
   * The base implementation of `_.filter` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function baseFilter(collection, predicate) {
    var result = [];
    baseEach(collection, function(value, index, collection) {
      if (predicate(value, index, collection)) {
        result.push(value);
      }
    });
    return result;
  }

  /**
   * Iterates over elements of `collection`, returning an array of all elements
   * `predicate` returns truthy for. The predicate is invoked with three
   * arguments: (value, index|key, collection).
   *
   * **Note:** Unlike `_.remove`, this method returns a new array.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [predicate=_.identity] The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   * @see _.reject
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': true },
   *   { 'user': 'fred',   'age': 40, 'active': false }
   * ];
   *
   * _.filter(users, function(o) { return !o.active; });
   * // => objects for ['fred']
   *
   * // The `_.matches` iteratee shorthand.
   * _.filter(users, { 'age': 36, 'active': true });
   * // => objects for ['barney']
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.filter(users, ['active', false]);
   * // => objects for ['fred']
   *
   * // The `_.property` iteratee shorthand.
   * _.filter(users, 'active');
   * // => objects for ['barney']
   */
  function filter(collection, predicate) {
    var func = isArray(collection) ? arrayFilter : baseFilter;
    return func(collection, baseIteratee(predicate));
  }

  /**
   * Creates a `_.find` or `_.findLast` function.
   *
   * @private
   * @param {Function} findIndexFunc The function to find the collection index.
   * @returns {Function} Returns the new find function.
   */
  function createFind(findIndexFunc) {
    return function(collection, predicate, fromIndex) {
      var iterable = Object(collection);
      if (!isArrayLike(collection)) {
        var iteratee = baseIteratee(predicate);
        collection = keys(collection);
        predicate = function(key) { return iteratee(iterable[key], key, iterable); };
      }
      var index = findIndexFunc(collection, predicate, fromIndex);
      return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
    };
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax$4 = Math.max;

  /**
   * This method is like `_.find` except that it returns the index of the first
   * element `predicate` returns truthy for instead of the element itself.
   *
   * @static
   * @memberOf _
   * @since 1.1.0
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {Function} [predicate=_.identity] The function invoked per iteration.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the found element, else `-1`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'active': false },
   *   { 'user': 'fred',    'active': false },
   *   { 'user': 'pebbles', 'active': true }
   * ];
   *
   * _.findIndex(users, function(o) { return o.user == 'barney'; });
   * // => 0
   *
   * // The `_.matches` iteratee shorthand.
   * _.findIndex(users, { 'user': 'fred', 'active': false });
   * // => 1
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.findIndex(users, ['active', false]);
   * // => 0
   *
   * // The `_.property` iteratee shorthand.
   * _.findIndex(users, 'active');
   * // => 2
   */
  function findIndex(array, predicate, fromIndex) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return -1;
    }
    var index = fromIndex == null ? 0 : toInteger(fromIndex);
    if (index < 0) {
      index = nativeMax$4(length + index, 0);
    }
    return baseFindIndex(array, baseIteratee(predicate), index);
  }

  /**
   * Iterates over elements of `collection`, returning the first element
   * `predicate` returns truthy for. The predicate is invoked with three
   * arguments: (value, index|key, collection).
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to inspect.
   * @param {Function} [predicate=_.identity] The function invoked per iteration.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {*} Returns the matched element, else `undefined`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'age': 36, 'active': true },
   *   { 'user': 'fred',    'age': 40, 'active': false },
   *   { 'user': 'pebbles', 'age': 1,  'active': true }
   * ];
   *
   * _.find(users, function(o) { return o.age < 40; });
   * // => object for 'barney'
   *
   * // The `_.matches` iteratee shorthand.
   * _.find(users, { 'age': 1, 'active': true });
   * // => object for 'pebbles'
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.find(users, ['active', false]);
   * // => object for 'fred'
   *
   * // The `_.property` iteratee shorthand.
   * _.find(users, 'active');
   * // => object for 'barney'
   */
  var find = createFind(findIndex);

  /**
   * The base implementation of `_.map` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function baseMap(collection, iteratee) {
    var index = -1,
        result = isArrayLike(collection) ? Array(collection.length) : [];

    baseEach(collection, function(value, key, collection) {
      result[++index] = iteratee(value, key, collection);
    });
    return result;
  }

  /**
   * Creates an array of values by running each element in `collection` thru
   * `iteratee`. The iteratee is invoked with three arguments:
   * (value, index|key, collection).
   *
   * Many lodash methods are guarded to work as iteratees for methods like
   * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
   *
   * The guarded methods are:
   * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
   * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
   * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
   * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   * @example
   *
   * function square(n) {
   *   return n * n;
   * }
   *
   * _.map([4, 8], square);
   * // => [16, 64]
   *
   * _.map({ 'a': 4, 'b': 8 }, square);
   * // => [16, 64] (iteration order is not guaranteed)
   *
   * var users = [
   *   { 'user': 'barney' },
   *   { 'user': 'fred' }
   * ];
   *
   * // The `_.property` iteratee shorthand.
   * _.map(users, 'user');
   * // => ['barney', 'fred']
   */
  function map(collection, iteratee) {
    var func = isArray(collection) ? arrayMap : baseMap;
    return func(collection, baseIteratee(iteratee));
  }

  /**
   * The base implementation of `_.gt` which doesn't coerce arguments.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if `value` is greater than `other`,
   *  else `false`.
   */
  function baseGt(value, other) {
    return value > other;
  }

  /**
   * Performs a deep comparison between two values to determine if they are
   * equivalent.
   *
   * **Note:** This method supports comparing arrays, array buffers, booleans,
   * date objects, error objects, maps, numbers, `Object` objects, regexes,
   * sets, strings, symbols, and typed arrays. `Object` objects are compared
   * by their own, not inherited, enumerable properties. Functions and DOM
   * nodes are compared by strict equality, i.e. `===`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.isEqual(object, other);
   * // => true
   *
   * object === other;
   * // => false
   */
  function isEqual(value, other) {
    return baseIsEqual(value, other);
  }

  /**
   * The base implementation of `_.lt` which doesn't coerce arguments.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if `value` is less than `other`,
   *  else `false`.
   */
  function baseLt(value, other) {
    return value < other;
  }

  /**
   * The base implementation of methods like `_.max` and `_.min` which accepts a
   * `comparator` to determine the extremum value.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The iteratee invoked per iteration.
   * @param {Function} comparator The comparator used to compare values.
   * @returns {*} Returns the extremum value.
   */
  function baseExtremum(array, iteratee, comparator) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      var value = array[index],
          current = iteratee(value);

      if (current != null && (computed === undefined
            ? (current === current && !isSymbol(current))
            : comparator(current, computed)
          )) {
        var computed = current,
            result = value;
      }
    }
    return result;
  }

  /**
   * Computes the maximum value of `array`. If `array` is empty or falsey,
   * `undefined` is returned.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Math
   * @param {Array} array The array to iterate over.
   * @returns {*} Returns the maximum value.
   * @example
   *
   * _.max([4, 2, 8, 6]);
   * // => 8
   *
   * _.max([]);
   * // => undefined
   */
  function max(array) {
    return (array && array.length)
      ? baseExtremum(array, identity, baseGt)
      : undefined;
  }

  /**
   * The base implementation of `_.sum` and `_.sumBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the sum.
   */
  function baseSum(array, iteratee) {
    var result,
        index = -1,
        length = array.length;

    while (++index < length) {
      var current = iteratee(array[index]);
      if (current !== undefined) {
        result = result === undefined ? current : (result + current);
      }
    }
    return result;
  }

  /** Used as references for various `Number` constants. */
  var NAN$1 = 0 / 0;

  /**
   * The base implementation of `_.mean` and `_.meanBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the mean.
   */
  function baseMean(array, iteratee) {
    var length = array == null ? 0 : array.length;
    return length ? (baseSum(array, iteratee) / length) : NAN$1;
  }

  /**
   * Computes the mean of the values in `array`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Math
   * @param {Array} array The array to iterate over.
   * @returns {number} Returns the mean.
   * @example
   *
   * _.mean([4, 2, 8, 6]);
   * // => 5
   */
  function mean(array) {
    return baseMean(array, identity);
  }

  /**
   * This method is like `_.assign` except that it recursively merges own and
   * inherited enumerable string keyed properties of source objects into the
   * destination object. Source properties that resolve to `undefined` are
   * skipped if a destination value exists. Array and plain object properties
   * are merged recursively. Other objects and value types are overridden by
   * assignment. Source objects are applied from left to right. Subsequent
   * sources overwrite property assignments of previous sources.
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 0.5.0
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @example
   *
   * var object = {
   *   'a': [{ 'b': 2 }, { 'd': 4 }]
   * };
   *
   * var other = {
   *   'a': [{ 'c': 3 }, { 'e': 5 }]
   * };
   *
   * _.merge(object, other);
   * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
   */
  var merge = createAssigner(function(object, source, srcIndex) {
    baseMerge(object, source, srcIndex);
  });

  /**
   * Computes the minimum value of `array`. If `array` is empty or falsey,
   * `undefined` is returned.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Math
   * @param {Array} array The array to iterate over.
   * @returns {*} Returns the minimum value.
   * @example
   *
   * _.min([4, 2, 8, 6]);
   * // => 2
   *
   * _.min([]);
   * // => undefined
   */
  function min(array) {
    return (array && array.length)
      ? baseExtremum(array, identity, baseLt)
      : undefined;
  }

  /** Used to compose bitmasks for function metadata. */
  var WRAP_PARTIAL_FLAG$3 = 32;

  /**
   * Creates a function that invokes `func` with `partials` prepended to the
   * arguments it receives. This method is like `_.bind` except it does **not**
   * alter the `this` binding.
   *
   * The `_.partial.placeholder` value, which defaults to `_` in monolithic
   * builds, may be used as a placeholder for partially applied arguments.
   *
   * **Note:** This method doesn't set the "length" property of partially
   * applied functions.
   *
   * @static
   * @memberOf _
   * @since 0.2.0
   * @category Function
   * @param {Function} func The function to partially apply arguments to.
   * @param {...*} [partials] The arguments to be partially applied.
   * @returns {Function} Returns the new partially applied function.
   * @example
   *
   * function greet(greeting, name) {
   *   return greeting + ' ' + name;
   * }
   *
   * var sayHelloTo = _.partial(greet, 'hello');
   * sayHelloTo('fred');
   * // => 'hello fred'
   *
   * // Partially applied with placeholders.
   * var greetFred = _.partial(greet, _, 'fred');
   * greetFred('hi');
   * // => 'hi fred'
   */
  var partial = baseRest(function(func, partials) {
    var holders = replaceHolders(partials, getHolder(partial));
    return createWrap(func, WRAP_PARTIAL_FLAG$3, undefined, partials, holders);
  });

  // Assign default placeholders.
  partial.placeholder = {};

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeCeil = Math.ceil,
      nativeMax$5 = Math.max;

  /**
   * The base implementation of `_.range` and `_.rangeRight` which doesn't
   * coerce arguments.
   *
   * @private
   * @param {number} start The start of the range.
   * @param {number} end The end of the range.
   * @param {number} step The value to increment or decrement by.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Array} Returns the range of numbers.
   */
  function baseRange(start, end, step, fromRight) {
    var index = -1,
        length = nativeMax$5(nativeCeil((end - start) / (step || 1)), 0),
        result = Array(length);

    while (length--) {
      result[fromRight ? length : ++index] = start;
      start += step;
    }
    return result;
  }

  /**
   * Creates a `_.range` or `_.rangeRight` function.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new range function.
   */
  function createRange(fromRight) {
    return function(start, end, step) {
      if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
        end = step = undefined;
      }
      // Ensure the sign of `-0` is preserved.
      start = toFinite(start);
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = toFinite(end);
      }
      step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
      return baseRange(start, end, step, fromRight);
    };
  }

  /**
   * Creates an array of numbers (positive and/or negative) progressing from
   * `start` up to, but not including, `end`. A step of `-1` is used if a negative
   * `start` is specified without an `end` or `step`. If `end` is not specified,
   * it's set to `start` with `start` then set to `0`.
   *
   * **Note:** JavaScript follows the IEEE-754 standard for resolving
   * floating-point values which can produce unexpected results.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {number} [start=0] The start of the range.
   * @param {number} end The end of the range.
   * @param {number} [step=1] The value to increment or decrement by.
   * @returns {Array} Returns the range of numbers.
   * @see _.inRange, _.rangeRight
   * @example
   *
   * _.range(4);
   * // => [0, 1, 2, 3]
   *
   * _.range(-4);
   * // => [0, -1, -2, -3]
   *
   * _.range(1, 5);
   * // => [1, 2, 3, 4]
   *
   * _.range(0, 20, 5);
   * // => [0, 5, 10, 15]
   *
   * _.range(0, -4, -1);
   * // => [0, -1, -2, -3]
   *
   * _.range(1, 4, 0);
   * // => [1, 1, 1]
   *
   * _.range(0);
   * // => []
   */
  var range = createRange();

  /**
   * Computes `number` rounded to `precision`.
   *
   * @static
   * @memberOf _
   * @since 3.10.0
   * @category Math
   * @param {number} number The number to round.
   * @param {number} [precision=0] The precision to round to.
   * @returns {number} Returns the rounded number.
   * @example
   *
   * _.round(4.006);
   * // => 4
   *
   * _.round(4.006, 2);
   * // => 4.01
   *
   * _.round(4060, -2);
   * // => 4100
   */
  var round = createRound('round');

  /**
   * Performs a rolling window average using the given array, returning a single value.
   * @param collection
   * @param year
   * @param window_size
   * @return {number}
   * @private
   */
  function rolling_window_average(collection, year, window_size = 10, ignore_nans = true) {
    let _values = range(window_size).map(x => get(collection, year - x, Math.NaN));

    if (ignore_nans) {
      _values = _values.filter(y => Number.isFinite(y));
    }

    return mean(_values);
  }
  /**
   * Utility function to convert F to C
   * @param f
   * @return {number}
   */

  function fahrenheit_to_celsius(f) {
    return 5 / 9 * (f - 32);
  }
  /**
   * Utility function to convert F degree days to C degree days
   * @param fdd
   * @return {number}
   */

  function fdd_to_cdd(fdd) {
    return fdd / 9 * 5;
  }
  /**
   * Utility function inches to mm
   * @param inches
   * @return {number}
   */

  function inches_to_mm(inches) {
    return inches * 25.4;
  }
  /**
   * Utility function to add an alpha channel to an rgb color. Doesn't play nice with hex colors.
   * @param rgb
   * @param opacity
   * @return {string}
   * @private
   */

  function rgba(rgb, opacity) {
    const [r, g, b] = rgb.split('(').splice(-1)[0].split(')')[0].split(',').slice(0, 3);
    return "rgba(".concat(r, ",").concat(g, ",").concat(b, ",").concat(opacity, ")");
  }
  /**
   * This function is used to toggle features based on whether the selected area_id is in Alaska or not.
   *
   * @param area_id
   * @returns {boolean}
   */

  function is_ak_area(area_id) {
    return String(area_id).startsWith('02') || area_id === 'AK';
  }
  /**
   * This function is used to toggle features based on whether the selected area_id is an island or other non-conus area.
   *
   * @param area_id
   * @returns {boolean}
   */

  function is_island_area(area_id) {
    return get(ClimateByLocationWidget.get_areas({
      type: null,
      state: null,
      area_id: area_id
    }), [0, 'area_type']) === 'island';
  }
  function is_usfs_forest_area(area_id) {
    const area = ClimateByLocationWidget.get_areas({
      type: null,
      state: null,
      area_id: area_id
    });
    return get(area, [0, 'area_type']) === 'forest';
  }
  function is_usfs_forest_ecoregion_area(area_id) {
    const area = ClimateByLocationWidget.get_areas({
      type: null,
      state: null,
      area_id: area_id
    });
    return get(area, [0, 'area_type']) === 'ecoregion';
  }
  /**
   * This function is used to toggle features based on whether the selected area_id is a CONUS area.
   *
   * @param area_id
   * @returns {boolean}
   */

  function is_conus_area(area_id) {
    const non_conus_states = ['HI', 'AK'];

    if (non_conus_states.includes(area_id)) {
      return false;
    }

    const area = ClimateByLocationWidget.get_areas({
      type: null,
      state: null,
      area_id: area_id
    });
    return !(get(area, [0, 'area_type']) === 'island') && !(get(area, [0, 'area_type']) === 'county' && non_conus_states.includes(get(area, [0, 'state'])));
  }
  function is_annual(frequency, area_id = null) {
    return frequency === 'annual' || frequency === 'yearly' || frequency === 'decadal';
  }
  function is_monthly(frequency, area_id = null) {
    return frequency === 'monthly' || frequency === 'seasonal';
  }
  function compute_decadal_means(data, year_col_idx, stat_col_idx, min_year, max_year) {
    min_year = min_year - min_year % 10;
    max_year = max_year + (10 - max_year % 10); // 2d array for values

    const decadal_values = range(Math.floor((max_year - min_year) / 10)).map(() => []);

    for (let i = 0; i < data.length; i++) {
      if (data[i][year_col_idx] >= min_year && data[i][year_col_idx] <= max_year) {
        // console.log(data[i][year_col_idx])
        decadal_values[Math.floor((data[i][year_col_idx] - min_year) / 10)].push(data[i][stat_col_idx]);
      }
    }

    return decadal_values.map(_decadal_values => mean(_decadal_values));
  }
  function compute_rolling_window_means(data, year_col_idx, stat_col_idx, min_year, max_year, rolling_window_years) {
    //expand the years to be an exact number of rolling windows
    const _data = data.map(a => a[stat_col_idx]);

    const rolling_means = range(_data.length).map(year_idx => ClimateByLocationWidget._rolling_window_average(_data, year_idx, rolling_window_years, false)); // rolling_means.unshift(...lodash_range(rolling_window_years - 1).map(()=>Number.NaN))

    return rolling_means;
  }
  function format_export_data(column_labels, data) {
    let export_data = data.map(row => row.filter(cell => cell !== null));
    export_data.unshift(column_labels); // return 'data:text/csv;base64,' + window.btoa(export_data.map((a) => a.join(', ')).join('\n'));

    return export_data.map(a => a.join(', ')).join('\n');
  }
  /**
   * Helper function which handles saving dataurls as files in several browsers.
   *
   * Copied from plotly.js with minimal tweaks https://github.com/plotly/plotly.js/blob/master/src/snapshot/filesaver.js (MIT licensed)
   * Originally based on FileSaver.js  https://github.com/eligrey/FileSaver.js (MIT licensed)
   *
   * @param url
   * @param filename
   */

  async function save_file(url, filename) {
    const saveLink = document.createElement('a');
    const canUseSaveLink = ('download' in saveLink);
    const format = filename.split('.').slice(-1)[0];
    let blob;
    let objectUrl; // Copied from https://bl.ocks.org/nolanlawson/0eac306e4dac2114c752

    function fixBinary(b) {
      var len = b.length;
      var buf = new ArrayBuffer(len);
      var arr = new Uint8Array(buf);

      for (var i = 0; i < len; i++) {
        arr[i] = b.charCodeAt(i);
      }

      return buf;
    }

    const IS_DATA_URL_REGEX = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i; // Copied from https://github.com/plotly/plotly.js/blob/master/src/snapshot/helpers.js

    const createBlob = function (url, format) {
      if (format === 'svg') {
        return new window.Blob([url], {
          type: 'image/svg+xml;charset=utf-8'
        });
      } else if (format === 'full-json') {
        return new window.Blob([url], {
          type: 'application/json;charset=utf-8'
        });
      } else if (format === 'csv') {
        return new window.Blob([url], {
          type: 'text/csv;charset=utf-8'
        });
      } else {
        const binary = fixBinary(window.atob(url));
        return new window.Blob([binary], {
          type: 'image/' + format
        });
      }
    };

    const octetStream = function (s) {
      document.location.href = 'data:application/octet-stream' + s;
    };

    const IS_SAFARI_REGEX = /Version\/[\d\.]+.*Safari/; // Safari doesn't allow downloading of blob urls

    if (IS_SAFARI_REGEX.test(window.navigator.userAgent)) {
      const prefix = format === 'svg' ? ',' : ';base64,';
      octetStream(prefix + encodeURIComponent(url));
      return filename;
    } // IE 10+ (native saveAs)


    if (typeof window.navigator.msSaveBlob !== 'undefined' && !url.match(IS_DATA_URL_REGEX)) {
      // At this point we are only dealing with a decoded SVG as
      // a data URL (since IE only supports SVG)
      blob = createBlob(url, format);
      window.navigator.msSaveBlob(blob, filename);
      blob = null;
      return filename;
    }

    const DOM_URL = window.URL || window.webkitURL;

    if (canUseSaveLink) {
      if (!!url.match(IS_DATA_URL_REGEX)) {
        objectUrl = url;
      } else {
        blob = createBlob(url, format);
        objectUrl = DOM_URL.createObjectURL(blob);
      }

      saveLink.href = objectUrl;
      saveLink.download = filename;
      document.body.appendChild(saveLink);
      saveLink.click();
      document.body.removeChild(saveLink);
      DOM_URL.revokeObjectURL(objectUrl);
      blob = null;
      return filename;
    }

    throw new Error('download error');
  }

  const bool_options = ['show_historical_observed', 'show_historical_modeled', 'show_projected_rcp45', 'show_projected_rcp85'];
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const months_labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthly_timeperiods = [2025, 2050, 2075];
  const monthly_variables = ['tmax', 'tmin', 'pcpn'];
  const variables = [{
    id: "tmax",
    title: {
      english: "Average Daily Max Temp",
      metric: "Average Daily Max Temp"
    },
    acis_elements: {
      annual: {
        "name": "maxt",
        "units": "degreeF",
        "interval": "yly",
        "duration": "yly",
        "reduce": "mean"
      },
      monthly: {
        "name": "maxt",
        "units": "degreeF",
        "interval": "mly",
        "duration": "mly",
        "reduce": "mean"
      }
    },
    unit_conversions: {
      metric: fahrenheit_to_celsius,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Average Daily Max Temp (°F)",
        metric: "Average Daily Max Temp (°C)"
      },
      monthly: {
        english: "Average Daily Max Temp (°F)",
        metric: "Average Daily Max Temp (°C)"
      }
    },
    supports_frequency: () => true,
    supports_area: () => true
  }, {
    id: "tmin",
    title: {
      english: "Average Daily Min Temp",
      metric: "Average Daily Min Temp"
    },
    acis_elements: {
      annual: {
        "name": "mint",
        "units": "degreeF",
        "interval": "yly",
        "duration": "yly",
        "reduce": "mean"
      },
      monthly: {
        "name": "mint",
        "units": "degreeF",
        "interval": "mly",
        "duration": "mly",
        "reduce": "mean"
      }
    },
    unit_conversions: {
      metric: fahrenheit_to_celsius,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Average Daily Min Temp (°F)",
        metric: "Average Daily Min Temp (°C)"
      },
      monthly: {
        english: "Average Daily Min Temp (°F)",
        metric: "Average Daily Min Temp (°C)"
      }
    },
    supports_frequency: () => true,
    supports_area: () => true
  }, {
    id: "days_tmax_gt_50f",
    title: {
      english: "Days per year with max above 50°F",
      metric: "Days per year with max above 10°C"
    },
    acis_elements: {
      annual: {
        "name": "maxt",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_50"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with max above 50°F",
        metric: "Days per year with max above 10°C"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_ak_area
  }, {
    id: "days_tmax_gt_60f",
    title: {
      english: "Days per year with max above 60°F",
      metric: "Days per year with max above 15.5°C"
    },
    acis_elements: {
      annual: {
        "name": "maxt",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_60"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with max above 60°F",
        metric: "Days per year with max above 15.5°C"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_ak_area
  }, {
    id: "days_tmax_gt_70f",
    title: {
      english: "Days per year with max above 70°F",
      metric: "Days per year with max above 21.1°C"
    },
    acis_elements: {
      annual: {
        "name": "maxt",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_70"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with max above 70°F",
        metric: "Days per year with max above 21.1°C"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_ak_area
  }, {
    id: "days_tmax_gt_80f",
    title: {
      english: "Days per year with max above 80°F",
      metric: "Days per year with max above 26.6°C"
    },
    acis_elements: {
      annual: {
        "name": "maxt",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_80"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with max above 80°F",
        metric: "Days per year with max above 26.6°C"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_ak_area
  }, {
    id: "days_tmax_gt_90f",
    title: {
      english: "Days per year with max above 90°F",
      metric: "Days per year with max above 32.2°C"
    },
    acis_elements: {
      annual: {
        "name": "maxt",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_90"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with max above 90°F",
        metric: "Days per year with max above 32.2°C"
      }
    },
    supports_frequency: is_annual,
    supports_area: () => true
  }, {
    id: "days_tmax_gt_95f",
    title: {
      english: "Days per year with max above 95°F",
      metric: "Days per year with max above 35°C"
    },
    acis_elements: {
      annual: {
        "name": "maxt",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_95"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with max above 95°F",
        metric: "Days per year with max above 35°C"
      }
    },
    supports_frequency: is_annual,
    supports_area: area_id => !is_ak_area(area_id)
  }, {
    id: "days_tmax_gt_100f",
    title: {
      english: "Days per year with max above 100°F",
      metric: "Days per year with max above 37.7°C"
    },
    acis_elements: {
      annual: {
        "name": "maxt",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_100"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with max above 100°F",
        metric: "Days per year with max above 37.7°C"
      }
    },
    supports_frequency: is_annual,
    supports_area: area_id => !is_ak_area(area_id)
  }, {
    id: "days_tmax_gt_105f",
    title: {
      english: "Days per year with max above 105°F",
      metric: "Days per year with max above 40.5°C"
    },
    acis_elements: {
      annual: {
        "name": "maxt",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_105"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with max above 105°F",
        metric: "Days per year with max above 40.5°C"
      }
    },
    supports_frequency: is_annual,
    supports_area: area_id => !is_ak_area(area_id)
  }, {
    id: "days_tmax_lt_32f",
    title: {
      english: "Days per year with max below 32°F (Icing days)",
      metric: "Days per year with max below 0°C (Icing days)"
    },
    acis_elements: {
      annual: {
        "name": "maxt",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_lt_32"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with max below 32°F (Icing days)",
        metric: "Days per year with max below 0°C (Icing days)"
      }
    },
    supports_frequency: is_annual,
    supports_area: () => true
  }, {
    id: "days_tmax_lt_50f",
    title: {
      english: "Days per year with max below 50°F",
      metric: "Days per year with max below 10°C"
    },
    acis_elements: {
      annual: {
        "name": "maxt",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_lt_50"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with max below 50°F",
        metric: "Days per year with max below 10°C"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_island_area
  }, {
    id: "days_tmax_lt_65f",
    title: {
      english: "Days per year with max below 65°F",
      metric: "Days per year with max below 18.3°C"
    },
    acis_elements: {
      annual: {
        "name": "maxt",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_lt_65"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with max below 65°F",
        metric: "Days per year with max below 18.3°C"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_island_area
  }, {
    id: "days_tmin_lt_32f",
    title: {
      english: "Days per year with min below 32°F (frost days)",
      metric: "Days per year with min below 0°C (frost days)"
    },
    acis_elements: {
      annual: {
        "name": "mint",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_lt_32"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with min below 32°F (frost days)",
        metric: "Days per year with min below 0°C (frost days)"
      }
    },
    supports_frequency: is_annual,
    supports_area: () => true
  }, {
    id: "days_tmin_lt_65f",
    title: {
      english: "Days per year with min below 65°F",
      metric: "Days per year with min below 18.3°C"
    },
    acis_elements: {
      annual: {
        "name": "mint",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_lt_65"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with min below 65°F",
        metric: "Days per year with min below 18.3°C"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_island_area
  }, {
    id: "days_tmin_lt_minus_40f",
    title: {
      english: "Days per year with min below -40°F",
      metric: "Days per year with min below -40°C"
    },
    acis_elements: {
      annual: {
        "name": "mint",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_lt_-40"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with min below -40°F",
        metric: "Days per year with min below -40°C"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_ak_area
  }, {
    id: "days_tmin_gt_60f",
    title: {
      english: "Days per year with min above 60°F",
      metric: "Days per year with min above 15.5°C"
    },
    acis_elements: {
      annual: {
        "name": "mint",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_60"
      },
      monthly: {
        "name": "mint",
        "interval": "mly",
        "duration": "mly",
        "reduce": "cnt_gt_60"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with min above 60°F",
        metric: "Days per year with min above 15.5°C"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_ak_area
  }, {
    id: "days_tmin_gt_75f",
    title: {
      english: "Days per year with min above 75°F",
      metric: "Days per year with min above 23.8°C"
    },
    acis_elements: {
      annual: {
        "name": "mint",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_75"
      },
      monthly: {
        "name": "mint",
        "interval": "mly",
        "duration": "mly",
        "reduce": "cnt_gt_75"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with min above 75°F",
        metric: "Days per year with min above 23.8°C"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_island_area
  }, {
    id: "days_tmin_gt_80f",
    title: {
      english: "Days per year with min above 80°F",
      metric: "Days per year with min above 26.6°C"
    },
    acis_elements: {
      annual: {
        "name": "mint",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_80"
      },
      monthly: {
        "name": "mint",
        "interval": "mly",
        "duration": "mly",
        "reduce": "cnt_gt_80"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with min above 80°F",
        metric: "Days per year with min above 26.6°C"
      }
    },
    supports_frequency: is_annual,
    supports_area: area_id => !is_ak_area(area_id)
  }, {
    id: "days_tmin_gt_90f",
    title: {
      english: "Days per year with min above 90°F",
      metric: "Days per year with min above 32.2°C"
    },
    acis_elements: {
      annual: {
        "name": "mint",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_90"
      },
      monthly: {
        "name": "mint",
        "interval": "mly",
        "duration": "mly",
        "reduce": "cnt_gt_90"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with min above 90°F",
        metric: "Days per year with min above 32.2°C"
      }
    },
    supports_frequency: is_annual,
    supports_area: area_id => !is_ak_area(area_id)
  }, {
    id: "hdd_65f",
    title: {
      english: "Heating Degree Days",
      metric: "Heating Degree Days"
    },
    acis_elements: {
      annual: {
        "name": "hdd",
        "interval": "yly",
        "duration": "yly",
        "reduce": "sum"
      }
    },
    unit_conversions: {
      metric: fdd_to_cdd,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Heating Degree Days (°F-days)",
        metric: "Heating Degree Days (°C-days)"
      }
    },
    supports_frequency: is_annual,
    supports_area: () => true
  }, {
    id: "cdd_65f",
    title: {
      english: "Cooling Degree Days",
      metric: "Cooling Degree Days"
    },
    acis_elements: {
      annual: {
        "name": "cdd",
        "interval": "yly",
        "duration": "yly",
        "reduce": "sum"
      }
    },
    unit_conversions: {
      metric: fdd_to_cdd,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Cooling Degree Days (°F-days)",
        metric: "Cooling Degree Days (°C-days)"
      }
    },
    supports_frequency: is_annual,
    supports_area: () => true
  }, {
    id: "gdd",
    title: {
      english: "Growing Degree Days",
      metric: "Growing Degree Days"
    },
    acis_elements: {
      annual: {
        "name": "gdd",
        "interval": "yly",
        "duration": "yly",
        "reduce": "sum"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Growing Degree Days (°F-days)",
        metric: "Growing Degree Days (°C-days)"
      }
    },
    supports_frequency: is_annual,
    supports_area: () => true
  }, {
    id: "gddmod",
    title: {
      english: "Modified Growing Degree Days",
      metric: "Modified Growing Degree Days"
    },
    acis_elements: {
      annual: {
        "name": "gdd",
        "duration": "yly",
        "limit": [86, 50],
        "interval": "yly",
        "reduce": "sum"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Modified Growing Degree Days (°F-days)",
        metric: "Modified Growing Degree Days (°C-days)"
      }
    },
    supports_frequency: is_annual,
    supports_area: area_id => is_conus_area(area_id) || is_island_area(area_id)
  }, {
    id: "gdd_32f",
    title: {
      english: "Thawing Degree Days",
      metric: "Thawing Degree Days"
    },
    acis_elements: {
      annual: {
        "name": "gdd32",
        "interval": "yly",
        "duration": "yly",
        "reduce": "sum"
      }
    },
    unit_conversions: {
      metric: fdd_to_cdd,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Thawing Degree Days (°F-days)",
        metric: "Thawing Degree Days (°C-days)"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_ak_area
  }, {
    id: "hdd_32f",
    title: {
      english: "Freezing Degree Days",
      metric: "Freezing Degree Days"
    },
    acis_elements: {
      annual: {
        "name": "hdd32",
        "interval": "yly",
        "duration": "yly",
        "reduce": "sum"
      }
    },
    unit_conversions: {
      metric: fdd_to_cdd,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Freezing Degree Days (°F-days)",
        metric: "Freezing Degree Days (°C-days)"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_ak_area
  }, {
    id: "pcpn",
    title: {
      english: "Total Precipitation",
      metric: "Total Precipitation"
    },
    acis_elements: {
      annual: {
        "name": "pcpn",
        "interval": "yly",
        "duration": "yly",
        "reduce": "sum",
        "units": "inch"
      },
      monthly: {
        "name": "pcpn",
        "interval": "mly",
        "duration": "mly",
        "reduce": "sum",
        "units": "inch"
      }
    },
    unit_conversions: {
      metric: inches_to_mm,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Total Precipitation (in.)",
        metric: "Total Precipitation"
      },
      monthly: {
        english: "Total Precipitation (in.)",
        metric: "Total Precipitation"
      }
    },
    supports_frequency: () => true,
    supports_area: () => true
  }, {
    id: "days_dry_days",
    title: {
      english: "Dry Days",
      metric: "Dry Days"
    },
    acis_elements: {
      annual: {
        "name": "pcpn",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_lt_0.01"
      },
      monthly: {
        "name": "pcpn",
        "interval": "mly",
        "duration": "mly",
        "reduce": "cnt_lt_0.01"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Dry Days (days/period)",
        metric: "Dry Days (days/period)"
      }
    },
    supports_frequency: is_annual,
    supports_area: () => true
  }, {
    id: "days_pcpn_gt_0_25in",
    title: {
      english: "Days per year with more than 0.25in precipitation",
      metric: "Days per year with more than 6.35mm precipitation"
    },
    acis_elements: {
      annual: {
        "name": "pcpn",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_1"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with more than 0.25in precipitation",
        metric: "Days per year with more than 6.35mm precipitation"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_ak_area
  }, {
    id: "days_pcpn_gt_1in",
    title: {
      english: "Days per year with more than 1in precip",
      metric: "Days per year with more than 25.3mm precip"
    },
    acis_elements: {
      annual: {
        "name": "pcpn",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_1"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with more than 1in precip",
        metric: "Days per year with more than 25.3mm precip"
      }
    },
    supports_frequency: is_annual,
    supports_area: () => true
  }, {
    id: "days_pcpn_gt_2in",
    title: {
      english: "Days per year with more than 2in precip",
      metric: "Days per year with more than 50.8mm precip"
    },
    acis_elements: {
      annual: {
        "name": "pcpn",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_2"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with more than 2in precip",
        metric: "Days of Precipitation Above 50.8mm"
      }
    },
    supports_frequency: is_annual,
    supports_area: () => true
  }, {
    id: "days_pcpn_gt_3in",
    title: {
      english: "Days per year with more than 3in precip",
      metric: "Days per year with more than 76.2mm precip"
    },
    acis_elements: {
      annual: {
        "name": "pcpn",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_3"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with more than 3in precip",
        metric: "Days per year with more than 76.2mm precip"
      }
    },
    supports_frequency: is_annual,
    supports_area: () => true
  }, {
    id: "days_pcpn_gt_4in",
    title: {
      english: "Days per year with more than 4in precip",
      metric: "Days per year with more than 101.6mm precip"
    },
    acis_elements: {
      annual: {
        "name": "pcpn",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_4"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with more than 4in precip",
        metric: "Days per year with more than 101.6mm precip"
      }
    },
    supports_frequency: is_annual,
    supports_area: area_id => !is_ak_area(area_id)
  }, {
    id: "days_pcpn_gt_5in",
    title: {
      english: "Days per year with more than 5in precip",
      metric: "Days per year with more than 127mm precip"
    },
    acis_elements: {
      annual: {
        "name": "pcpn",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_5"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with more than 5in precip",
        metric: "Days per year with more than 127mm precip"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_island_area
  }];
  const frequencies = [{
    id: 'annual',
    title: 'Annual',
    supports_area: () => true
  }, {
    id: 'monthly',
    title: 'Monthly',
    supports_area: area_id => is_conus_area(area_id) || is_island_area(area_id)
  }];
  let areas_json_url = window.climate_by_location_config && window.climate_by_location_config.areas_json_url ? window.climate_by_location_config.areas_json_url : 'all_areas.json';
  let data_api_url = window.climate_by_location_config && window.climate_by_location_config.data_api_url ? window.climate_by_location_config.data_api_url : 'https://grid2.rcc-acis.org/GridData';
  let island_data_url_template = window.climate_by_location_config && window.climate_by_location_config.island_data_url_template ? window.climate_by_location_config.island_data_url_template : 'https://climate-by-location.nemac.org/island_data/{area_id}.json';
  function set_areas_json_url(value) {
    areas_json_url = value;
  }

  let _all_areas = null;
  /** @type Promise */

  let _when_areas = null;
  /* globals jQuery, window, Plotly, fetch */

  class ClimateByLocationWidget$1 {
    /**
     * @param {Element|string|jQuery} element as jquery object, string query selector, or element object
     * @param {Object} options
     * @param {string|number} options.area_id - // Id obtained from available areas (use ClimateByLocationWidget.when_areas() to lookup areas)
     * @param {string} options.frequency - time frequency of graph to display ("annual", "monthly")
     * @param {string} options.variable - name of variable to display (use ClimateByLocationWidget.when_variables() to lookup options)
     * @param {number} options.monthly_timeperiod - time period center for monthly graphs ("2025", "2050", or "2075")
     * @param {number} options.unitsystem - unit system to use for data presentation ("english", "metric")
     * @param {array<number, number>} options.x_axis_range - Sets the range of the x-axis.
     * @param {array<number, number>} options.y_axis_range - Sets the range of the y-axis.
     * @param {string} options.font - Defaults to 'Roboto'.
     * @param {boolean} options.show_legend - Whether or not to show the built-in legend. Defaults to false.
     * @param {boolean} options.show_historical_observed - Whether to show historical observed data, if available.
     * @param {boolean} options.show_historical_modeled - Whether to show historical modeled data, if available.
     * @param {boolean} options.show_projected_rcp45 - Whether to show projected modeled RCP4.5 data, if available.
     * @param {boolean} options.show_projected_rcp85 - Whether to show projected modeled RCP8.5 data, if available.
     * @param {boolean} options.show_decadal_means - Whether to show decadal means of modeled data, if available.
     * @param {boolean} options.hover_decadal_means - Whether to show decadal means instead of annual values of modeled data, if available.
     * @param {boolean} options.show_rolling_window_means - Whether or not to show rolling window means of modeled data, if available.
     * @param {number} options.rolling_window_mean_years - The number of years to include in the rolling window, defaults to 10.
     * @param {boolean} options.responsive - Whether or not to listen to window resize events and auto-resize the graph. Can only be set on instantiation.
     */
    constructor(element, options = {}) {
      this.options = {
        // default values:
        area_id: null,
        unitsystem: "english",
        variable: "tmax",
        frequency: "annual",
        monthly_timeperiod: "2025",
        x_axis_range: null,
        y_axis_range: null,
        colors: {
          rcp85: {
            line: 'rgb(245,68,45)',
            innerBand: 'rgb(246,86,66)',
            outerBand: 'rgb(247,105,86)'
          },
          rcp45: {
            line: 'rgb(0,88,207)',
            innerBand: 'rgb(25,104,211)',
            outerBand: 'rgb(50,121,216)'
          },
          hist: {
            innerBand: "rgb(170,170,170)",
            outerBand: "rgb(187,187,187)",
            line: 'rgb(0,0,0)',
            bar: 'rgb(119,119,119)'
          },
          opacity: {
            ann_hist_minmax: 0.6,
            ann_proj_minmax: 0.5,
            mon_proj_minmax: 0.5,
            hist_obs: 1,
            proj_line: 1
          }
        },
        get_area_label: this.get_area_label.bind(this),
        show_historical_observed: true,
        show_historical_modeled: true,
        show_projected_rcp45: true,
        show_projected_rcp85: true,
        show_legend: false,
        responsive: true,
        plotly_layout_defaults: {
          hoverdistance: 50,
          autosize: true,
          margin: {
            l: 50,
            t: 12,
            r: 12,
            b: 60
          },
          hovermode: 'x unified',
          legend: {
            "orientation": "h"
          }
        },
        hover_decadal_means: true,
        show_decadal_means: false,
        show_annual_values: true,
        show_rolling_window_means: false,
        rolling_window_mean_years: 10,
        data_api_url: data_api_url,
        island_data_url_template: island_data_url_template
      }; // this.options = merge(this.options, options);

      this.view = null;

      if (typeof element === "string") {
        element = document.querySelector(this.element);
      } else if (!!jQuery && element instanceof jQuery) {
        element = element[0];
      }

      this.element = element;

      if (!this.element) {
        console.log('Climate By Location widget created with no element. Nothing will be displayed.');
      }

      if (!this.element.id) {
        this.element.id = 'climatebylocation-' + Math.floor(Math.random() * Math.floor(100));
      }

      this._styles = ['#' + this.element.id + ' .climate_by_location_view {width: 100%; height: 100%;}'];
      this.element.innerHTML = "<div class='climate_by_location_view'></div><style></style>";

      this._update_styles();

      this.view_container = this.element.querySelector('div.climate_by_location_view');
      /** @type {function} */

      this._update_visibility = null;
      /** @var _when_chart {Promise} - Promise for the most recent plotly graph. */

      this._when_chart = null;
      this.update(options);

      if (this.options.responsive) {
        window.addEventListener('resize', this.resize.bind(this));
      }
    }

    _update_styles() {
      const el = this.element.querySelector('style');

      if (el) {
        el.innerHTML = this._styles.join('\n');
      }
    }
    /*
     * Public instance methods
     */

    /**
     * Gets the county or state that is currently selected.
     */


    get_area_label() {
      return get(this.get_area(), 'area_label', null) || this.options.area_id;
    }
    /**
     * Gets the area object for the area that is currently selected.
     * @return {{area_id, area_label, area_type, state}}
     */


    get_area() {
      return get(ClimateByLocationWidget$1.get_areas({
        type: null,
        state: null,
        area_id: this.options.area_id
      }), 0, null);
    }

    update(options) {
      let old_options = Object.assign({}, this.options);
      let old_view_class = null;

      try {
        old_view_class = this.get_view_class();
      } catch {}

      this.options = merge({}, old_options, options);
      bool_options.forEach(option => {
        if (typeof options[option] === "string") {
          options[option] = options[option].toLowerCase() === "true";
        }
      }); // catch cases where user was on monthly and switched to AK

      if (!find(frequencies, frequency => frequency.id === this.options.frequency && frequency.supports_area(this.options.area_id))) {
        this.options.frequency = frequencies[0].id;
      } // catch cases where user was on annual for a non-monthly variable and switched to monthly


      if (is_monthly(this.options.frequency) && !monthly_variables.includes(this.options.variable)) {
        this.options.variable = ClimateByLocationWidget$1.get_variables({
          frequency: this.options.frequency,
          unitsystem: null,
          area_id: this.options.area_id
        })[0].id;
      } // catch cases where the user was on a variable for only certain area and switched to a non-supported areas.


      const variable_config = this.get_variable_config();

      if (variable_config && variable_config.supports_area && !variable_config.supports_area(this.options.area_id)) {
        this.options.variable = ClimateByLocationWidget$1.get_variables({
          frequency: this.options.frequency,
          unitsystem: null,
          area_id: this.options.area_id
        })[0].id;
      } // if frequency, state, county, or variable changed, trigger a larger update cycle (new data + plots maybe changed):


      if (this.options.frequency !== old_options.frequency || this.options.area_id !== old_options.area_id || this.options.variable !== old_options.variable || this.options.monthly_timeperiod !== old_options.monthly_timeperiod || !!this.options.show_decadal_means && this.options.show_decadal_means !== old_options.show_decadal_means || !!this.options.show_rolling_window_means && this.options.show_rolling_window_means !== old_options.show_rolling_window_means || !!this.options.show_rolling_window_means && this.options.rolling_window_mean_years !== old_options.rolling_window_mean_years) {
        if (old_view_class !== this.get_view_class() && this.view) {
          this.view.destroy();
          this.view = null;
        }

        this._update();
      } else {
        if (this.view !== null && this.view.style_option_names.some(k => this.options[k] !== old_options[k])) {
          this.view.request_style_update();
        }

        if (this.options.x_axis_range !== old_options.x_axis_range) {
          this.set_x_axis_range(...this.options.x_axis_range);
        }
      }

      return this;
    }

    get_variable_config() {
      return find(variables, c => c.id === this.options.variable);
    }
    /**
     * Options which force re-evaluation of which view class should be used and request that view to fully update.
     * @return {string[]}
     * @private
     */


    get _view_selection_option_names() {
      return ['frequency', 'area_id', 'variable', 'monthly_timeperiod', 'show_decadal_means', 'show_rolling_window_means', 'rolling_window_mean_years'];
    }
    /**
     * @returns View
     */


    get_view_class() {
      throw new Error('Not Implemented!');
    }
    /**
     * This function will set the range of data visible on the graph's x-axis without refreshing the rest of the graph.
     *
     * @param min
     * @param max
     * @returns {boolean}
     */


    set_x_axis_range(min, max) {
      this.options.x_axis_range = [min, max];

      if (this.options.frequency === 'annual') {
        Plotly.relayout(this.view_container, {
          'xaxis.range': this.options.x_axis_range
        });
      }

      return this.options.x_axis_range;
    }
    /**
     * Registers an event handler for the specified event. Equivalent to `instance.element.addEventListener(type, listener)`
     */


    on(type, listener) {
      return this.element.addEventListener(type, listener);
    }
    /**
     * Forces chart to resize.
     */


    resize() {
      window.requestAnimationFrame(() => {
        try {
          Plotly.relayout(this.view_container, {
            'xaxis.autorange': true,
            'yaxis.autorange': true
          });
        } catch {// do nothing
        }
      });
    }
    /**
     * Gets the available downloads for the current view.
     * @return {Promise<*[]>}
     */


    async request_downloads() {
      if (this.view) {
        return (await this.view.request_downloads()).map(d => new Proxy(d, {
          get: (target, prop) => {
            if (prop === 'download') {
              return async () => {
                try {
                  const url = await target.when_data();
                  return await save_file(url, target['filename']);
                } catch (e) {
                  console.log('Failed download with message', e);
                  throw new Error('Failed to download ' + target['label']);
                }
              };
            }

            return target[prop];
          }
        }));
      }

      return [];
    }
    /*
     * Private methods
     */

    /**
     * Requests the widget update according to its current options. Use `set_options()` to change options instead.
     * @returns {Promise<void>}
     */


    async _update() {
      this._show_spinner();

      await ClimateByLocationWidget$1.when_areas({});

      try {
        if (this.view === null) {
          this.view = new (this.get_view_class())(this, this.view_container);
        }

        await this.view.request_update();
      } catch (e) {
        console.error(e);

        this._show_spinner_error();
      }
    }
    /**
     * Updates this.options.xrange and this.options.yrange (if they are not null) based on new ranges computed from data and emits range events.
     * @param x_range_min
     * @param x_range_max
     * @param y_range_min
     * @param y_range_max
     * @return {*[]}
     * @private
     */


    _update_axes_ranges(x_range_min, x_range_max, y_range_min, y_range_max) {
      if (!!this.options.x_axis_range) {
        this.options.x_axis_range = [Math.max(x_range_min, get(this.options, ['x_axis_range', 0], x_range_min)), Math.min(x_range_max, get(this.options, ['x_axis_range', 1], x_range_max))];
      }

      if (!!this.options.y_axis_range) {
        this.options.y_axis_range = [Math.max(y_range_min, get(this.options, ['y_axis_range', 0], y_range_min)), Math.min(y_range_max, get(this.options, ['y_axis_range', 1], y_range_max))];
      }

      if (Number.isFinite(x_range_min) && Number.isFinite(x_range_max)) {
        window.setTimeout(() => {
          this.element.dispatchEvent(new CustomEvent('x_axis_range_change', {
            detail: [x_range_min, x_range_max, get(this.options, ['x_axis_range', 0], x_range_min), get(this.options, ['x_axis_range', 1], x_range_max)]
          }));
          this.element.dispatchEvent(new CustomEvent('y_axis_range_change', {
            detail: [y_range_min, y_range_max, get(this.options, ['y_axis_range', 0], y_range_min), get(this.options, ['y_axis_range', 1], y_range_max)]
          }));
        });
      }

      return [...(this.options.x_axis_range || [x_range_min, x_range_max]), ...(this.options.y_axis_range || [y_range_min, y_range_max])];
    }

    _get_y_axis_layout(y_range_min, y_range_max, variable_config) {
      return {
        type: 'linear',
        range: y_range_min === 0 && y_range_max === 0 ? [0, 20] : [y_range_min, y_range_max],
        showline: true,
        showgrid: true,
        linecolor: 'rgb(0,0,0)',
        linewidth: 1,
        tickcolor: 'rgb(0,0,0)',
        tickfont: {
          size: 10,
          family: 'roboto, monospace',
          color: 'rgb(0,0,0)'
        },
        nticks: 25,
        tickangle: 0,
        title: {
          text: variable_config['ytitles']['annual'][this.options.unitsystem],
          font: {
            family: 'roboto, monospace',
            size: 12,
            color: '#494949'
          }
        }
      };
    }

    _get_x_axis_layout(x_range_min, x_range_max) {
      return {
        type: 'linear',
        range: this.options.x_axis_range || [x_range_min, x_range_max],
        showline: true,
        linecolor: 'rgb(0,0,0)',
        linewidth: 1,
        // dtick: 5,
        nticks: 15,
        tickcolor: 'rgb(0,0,0)',
        tickfont: {
          size: 12,
          family: 'roboto, monospace',
          color: 'rgb(0,0,0)'
        },
        tickangle: 0 // title: {
        //   text: 'Year',
        //   font: {
        //     family: 'roboto, monospace',
        //     size: 13,
        //     color: '#494949'
        //   }
        // },

      };
    }

    _get_plotly_options() {
      return {
        displaylogo: false,
        modeBarButtonsToRemove: ['toImage', 'lasso2d', 'select2d', 'resetScale2d']
      };
    }

    _show_spinner() {
      this._hide_spinner();

      let style = "<style>.climatebylocation-spinner { margin-top: -2.5rem; border-radius: 100%;border-style: solid;border-width: 0.25rem;height: 5rem;width: 5rem;animation: basic 1s infinite linear; border-color: rgba(0, 0, 0, 0.2);border-top-color: rgba(0, 0, 0, 1); }@keyframes basic {0%   { transform: rotate(0); }100% { transform: rotate(359.9deg); }} .climatebylocation-spinner-container {display:flex; flex-flow: column; align-items: center; justify-content: center; background-color: rgba(255,255,255, 0.4); } .climatebylocation-spinner-error span { opacity: 1 !important;} .climatebylocation-spinner-error .climatebylocation-spinner {border-color: red !important; animation: none;} </style>";
      this.element.style.position = 'relative';
      const spinner_el = document.createElement('div');
      spinner_el.classList.add('climatebylocation-spinner-container');
      spinner_el.style.position = 'absolute';
      spinner_el.style.width = "100%";
      spinner_el.style.height = "100%";
      spinner_el.style.left = '0px';
      spinner_el.style.top = '0px';
      spinner_el.style.zIndex = '1000000';
      spinner_el.innerHTML = style + "<div class='climatebylocation-spinner'></div><span style=\"opacity: 0; color: red; margin: 1rem;\">Failed to retrieve data. Please try again.</span>";
      this.element.appendChild(spinner_el);
    }

    _hide_spinner() {
      if (this.element) {
        const spinner_el = this.element.querySelector('.climatebylocation-spinner-container');

        if (spinner_el) {
          this.element.removeChild(spinner_el);
        }
      }
    }

    _show_spinner_error() {
      if (this.element) {
        const spinner_el = this.element.querySelector('.climatebylocation-spinner-container');

        if (spinner_el) {
          spinner_el.classList.add('climatebylocation-spinner-error');
        }
      }
    }
    /*
     * Public static methods
     */

    /**
     * Gets available variable options for a specified combination of frequency and area_id.
     *
     * @param frequency
     * @param unitsystem
     * @param area_id
     * @returns {promise<{id: *, title: *}[]>}
     */


    static when_variables({
      frequency,
      unitsystem,
      area_id
    } = {}) {
      return ClimateByLocationWidget$1.when_areas({}).then(ClimateByLocationWidget$1.get_variables.bind(this, {
        frequency,
        unitsystem,
        area_id
      }));
    }
    /**
     * Gets available variable options for a specified combination of frequency and area_id. If areas are not loaded, returns empty
     *
     * @param frequency
     * @param unitsystem
     * @param area_id
     * @returns {{id: *, title: *}[]}
     */


    static get_variables({
      frequency,
      unitsystem,
      area_id
    } = {}) {
      unitsystem = unitsystem || 'english';
      let _variables = variables;

      if (frequency && is_monthly(frequency)) {
        _variables = _variables.filter(v => monthly_variables.includes(v.id));
      }

      return _variables.filter(v => frequency in v.ytitles && (typeof v.supports_area === "function" ? v.supports_area(area_id) : true)).map(v => {
        return {
          id: v.id,
          title: v.title[unitsystem]
        };
      });
    }
    /**
     * Generates an image of the chart and downloads it.
     * @returns {Promise}
     */


    download_image() {
      return new Promise((resolve, reject) => {
        this.request_downloads().then(downloads => {
          const download = downloads.find(d => d['filename'].slice(-3) === 'png');

          if (!download) {
            return reject(new Error('Chart image is not available for download'));
          }

          download.download().then(() => resolve());
        });
      });
    }
    /**
     * Download the historic observed data.
     * @returns {Promise<void>}
     */


    download_hist_obs_data() {
      return new Promise((resolve, reject) => {
        this.request_downloads().then(downloads => {
          const download = downloads.find(d => d['label'] === 'Observed Data');

          if (!download) {
            return reject(new Error('Observed Data is not available for download'));
          }

          download.download().then(() => resolve());
        });
      });
    }
    /**
     * Download the historic modelled data.
     * @returns {Promise<void>}
     */


    download_hist_mod_data() {
      return new Promise((resolve, reject) => {
        this.request_downloads().then(downloads => {
          const download = downloads.find(d => d['label'] === 'Historical Modeled Data');

          if (!download) {
            return reject(new Error('Historical Modeled Data is not available for download'));
          }

          download.download().then(() => resolve());
        });
      });
    }
    /**
     * Download the projected modelled data.
     * @returns {Promise<void>}
     */


    download_proj_mod_data() {
      return new Promise((resolve, reject) => {
        this.request_downloads().then(downloads => {
          const download = downloads.find(d => d['label'] === 'Projected Modeled Data');

          if (!download) {
            return reject(new Error('Projected Modeled Data is not available for download'));
          }

          download.download().then(() => resolve());
        });
      });
    }
    /**
     * Gets available frequency options for a specified area.
     *
     * @param area_id
     * @returns {promise<{id: (string), title: (string)}[]>}
     */


    static when_frequencies(area_id) {
      return ClimateByLocationWidget$1.when_areas({}).then(ClimateByLocationWidget$1.get_frequencies.bind(this, area_id));
    }
    /**
     * Gets available frequency options for a specified area.
     *
     * @param area_id
     * @returns {{id: (string), title: (string)}[]}
     */


    static get_frequencies(area_id) {
      return frequencies.filter(f => typeof f.supports_area === "function" ? f.supports_area(area_id) : true).map(v => {
        return {
          id: v.id,
          title: v.title
        };
      });
    }
    /**
     * Gets available areas based on type or the state they belong to (counties only).
     * @param type {string|null} Area type to filter by. Any of 'state', 'county', 'island'.
     * @param state {string|null} Two-digit abbreviation of state to filter by. Implies type='state'
     * @param area_id {string|null} Area id to filter by. Will never return more than 1 result.
     * @returns Promise<array<{area_id, area_label, area_type, state}>>
     */


    static when_areas({
      type = null,
      state = null,
      area_id = null
    } = {}) {
      if (ClimateByLocationWidget$1._all_areas === null && ClimateByLocationWidget$1._when_areas === null) {
        ClimateByLocationWidget$1._when_areas = fetch(ClimateByLocationWidget$1.areas_json_url).then(response => response.json()).then(data => {
          if (!data) {
            throw new Error("Failed to retrieve areas!");
          }

          ClimateByLocationWidget$1._all_areas = data;
        });
      }

      return ClimateByLocationWidget$1._when_areas.then(ClimateByLocationWidget$1.get_areas.bind(this, {
        type,
        state,
        area_id
      }));
    }
    /**
     * Gets available areas based on type or the state they belong to (counties only). If called before areas are loaded, returns empty.
     * @param type {string|null} Area type to filter by. Any of 'state', 'county', 'island'.
     * @param state {string|null} Two-digit abbreviation of state to filter by. Implies type='state'
     * @param area_id {string|null} Area id to filter by. Will never return more than 1 result.
     * @returns array<{area_id, area_label, area_type, state}>
     */


    static get_areas({
      type = null,
      state = null,
      area_id = null
    } = {}) {
      if (!ClimateByLocationWidget$1._all_areas) {
        console.error('Areas not yet loaded! Use when_areas() for async access to areas.');
        return [];
      }

      if (!!area_id) {
        area_id = String(area_id).toLowerCase();
        return ClimateByLocationWidget$1._all_areas.filter(area => String(area.area_id).toLowerCase() === area_id);
      }

      if (!!state) {
        state = String(state).toUpperCase();
        return ClimateByLocationWidget$1._all_areas.filter(area => area['area_type'] === 'county' && area.state === state);
      }

      if (!!type) {
        type = String(type).toLowerCase();

        if (!['state', 'county', 'island', 'forest', 'ecoregion'].includes(type)) {
          throw Error("Invalid area type \"".concat(type, "\", valid types are 'state','county', 'island', 'forest', and 'ecoregion'"));
        }

        return ClimateByLocationWidget$1._all_areas.filter(area => area['area_type'] === type);
      }

      return ClimateByLocationWidget$1._all_areas;
    }
    /**
     * Gets available areas based on type or the state they belong to (counties only). Returns first area. If called before areas are loaded, returns empty.
     * @param type {string|null} Area type to filter by. Any of 'state', 'county', 'island'.
     * @param state {string|null} Two-digit abbreviation of state to filter by. Implies type='state'
     * @param area_id {string|null} Area id to filter by. Will never return more than 1 result.
     * @returns {area_id, area_label, area_type, state}
     */


    static find_area({
      type = null,
      state = null,
      area_id = null
    } = {}) {
      const areas = ClimateByLocationWidget$1.get_areas({
        type: type,
        state: state,
        area_id: area_id
      });
      return areas.length > 0 ? areas[0] : null;
    }
    /*
     * Private static methods
     */


    static get areas_json_url() {
      return areas_json_url;
    }

    static set areas_json_url(value) {
      set_areas_json_url(value);
    }

    static get _when_areas() {
      return _when_areas;
    }

    static set _when_areas(value) {
      _when_areas = value;
    }

    static get _all_areas() {
      return _all_areas;
    }

    static set _all_areas(value) {
      _all_areas = value;
    }

    destroy() {
      if (this.view) {
        this.view.destroy();
      }
    }

  }

  /**
   * A base class for CBL views
   */
  class View {
    constructor(parent, element) {
      this.parent = parent;
      this.element = element;
      this._download_callbacks = {};
    }
    /**
     * Prompt the view to update itself, requesting data and creating dom elements as needed.
     * @return {Promise<void>}
     */


    async request_update() {}
    /**
     * Prompt the view to update its styles, without requesting data or creating dom elements.
     * @return {Promise<void>}
     */


    async request_style_update() {}
    /**
     * Get the list of data that can be downloaded in the view.
     * @return {Promise<array<object>>}
     */


    async request_downloads() {
      return [];
    }
    /**
     * Clean up any data, dom nodes, etc.
     */


    destroy() {}
    /**
     * Options which force re-evaluation of which traces are visible within the current view.
     * @return {string[]}
     * @private
     */


    get style_option_names() {
      return ['show_projected_rcp45', 'show_projected_rcp85', 'show_historical_observed', 'show_historical_modeled'];
    }

  }

  /* globals jQuery, window, Plotly,jStat, fetch */

  async function get_historical_observed_livneh_data({
    frequency,
    unitsystem,
    data_api_url,
    variable,
    variable_config,
    area
  }) {
    const {
      area_id,
      area_type,
      area_bbox
    } = area;
    const unit_conversion_fn = variable_config.unit_conversions[unitsystem];
    const area_params = !!area_bbox ? {
      bbox: area_bbox
    } : {
      [area_type]: area_id
    };
    const elems = [Object.assign(variable_config['acis_elements'][frequency === 'annual' ? 'annual' : 'monthly'], {
      "area_reduce": !!area_bbox ? 'bbox_mean' : area_type + '_mean'
    })];
    const response = await (await fetch(data_api_url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "sdate": "1950-01-01",
        "edate": "2013-12-31",
        "grid": 'livneh',
        "elems": elems,
        ...area_params
      })
    })).json();

    if (!response) {
      throw new Error("Failed to retrieve ".concat(frequency, " livneh data for ").concat(variable, " and area ").concat(area_id));
    } // transform data


    if (frequency === 'annual') {
      let values = [];

      for (const [key, value] of response.data) {
        if (undefined !== value[area_id] && String(value[area_id]) !== '-999' && String(value[area_id]) !== '') {
          values.push([key, unit_conversion_fn(value[area_id])]);
        }
      }

      return values;
    } // monthly
    // build output of [month, [values...]].


    let month_values = Object.fromEntries(months.map(m => [m, []]));

    for (const [key, value] of response.data) {
      if (undefined !== value[area_id]) {
        let v = parseFloat(value[area_id]);

        if (v === -999 || !Number.isFinite(v)) {
          v = 0;
        }

        month_values[key.slice(-2)].push([Number.parseInt(key.slice(0, 4)), unit_conversion_fn(v)]);
      }
    }

    return month_values;
  }
  async function get_historical_annual_loca_model_data({
    frequency,
    unitsystem,
    data_api_url,
    variable,
    variable_config,
    area
  }) {
    const sdate_year = 1950;
    const edate_year = 2006;
    const sdate = sdate_year + '-01-01';
    const edate = edate_year + '-12-31';
    const unit_conversion_fn = variable_config.unit_conversions[unitsystem];
    const data = await Promise.all([fetch_acis_data({
      grid: 'loca:wMean:rcp85',
      sdate,
      edate,
      frequency,
      area,
      data_api_url,
      unitsystem,
      variable_config
    }), fetch_acis_data({
      grid: 'loca:allMin:rcp85',
      sdate,
      edate,
      frequency,
      area,
      data_api_url,
      unitsystem,
      variable_config
    }), fetch_acis_data({
      grid: 'loca:allMax:rcp85',
      sdate,
      edate,
      frequency,
      area,
      data_api_url,
      unitsystem,
      variable_config
    })]);
    let values = [];

    for (let i = 0; i < edate_year - sdate_year; i++) {
      values.push([i + sdate_year, data[0][1][i], data[1][1][i], data[2][1][i]]);
    }

    return values;
  }
  async function get_projected_loca_model_data({
    frequency,
    unitsystem,
    data_api_url,
    variable,
    variable_config,
    area
  }) {
    const sdate_year = frequency === 'monthly' ? 2010 : 2006;
    const sdate = sdate_year + '-01-01';
    const edate_year = 2099;
    const edate = edate_year + '-12-31';
    const data = await Promise.all([fetch_acis_data({
      grid: 'loca:wMean:rcp45',
      sdate,
      edate,
      frequency,
      area,
      data_api_url,
      variable_config,
      unitsystem
    }), fetch_acis_data({
      grid: 'loca:allMin:rcp45',
      sdate,
      edate,
      frequency,
      area,
      data_api_url,
      variable_config,
      unitsystem
    }), fetch_acis_data({
      grid: 'loca:allMax:rcp45',
      sdate,
      edate,
      frequency,
      area,
      data_api_url,
      variable_config,
      unitsystem
    }), fetch_acis_data({
      grid: 'loca:wMean:rcp85',
      sdate,
      edate,
      frequency,
      area,
      data_api_url,
      variable_config,
      unitsystem
    }), fetch_acis_data({
      grid: 'loca:allMin:rcp85',
      sdate,
      edate,
      frequency,
      area,
      data_api_url,
      variable_config,
      unitsystem
    }), fetch_acis_data({
      grid: 'loca:allMax:rcp85',
      sdate,
      edate,
      frequency,
      area,
      data_api_url,
      variable_config,
      unitsystem
    })]);

    if (frequency === 'annual') {
      for (const [keys, _] of data) {
        if (keys.length !== edate_year - sdate_year + 1) {
          throw new Error('Missing years in projected loca data!');
        }
      }

      let values = [];

      for (let i = 0; i < edate_year - sdate_year + 1; i++) {
        values.push([i + sdate_year, data[0][1][i], data[1][1][i], data[2][1][i], data[3][1][i], data[4][1][i], data[5][1][i]]);
      }

      return values;
    } // monthly
    // build output of {month: [year, rcp45_mean, rcp45_min, rcp45_max, rcp85_mean, rcp85_min, rcp85_max]}.


    let monthly_values = Object.fromEntries(months.map(m => [m, []]));

    const _get_val = (array, idx) => {
      if (undefined !== array[idx]) {
        let v = parseFloat(array[idx]);

        if (v === -999) {
          v = Number.NaN;
        }

        return v;
      }

      return Number.NaN;
    };

    for (let i = 0; i < data[0][0].length; i++) {
      monthly_values[data[0][0][i].slice(-2)].push([Number.parseInt(data[0][0][i].slice(0, 4)), _get_val(data[0][1], i), _get_val(data[1][1], i), _get_val(data[2][1], i), _get_val(data[3][1], i), _get_val(data[4][1], i), _get_val(data[5][1], i)]);
    }

    return monthly_values;
  }
  /**
   * Retrieves data from ACIS.
   * @param grid
   * @param sdate
   * @param edate
   * @param variable
   * @param frequency
   * @param area
   * @param data_api_url
   * @param variable_config
   * @param unitsystem
   * @return {Promise<[][]>}
   * @private
   */

  async function fetch_acis_data({
    grid,
    sdate,
    edate,
    frequency,
    area,
    data_api_url,
    variable_config,
    unitsystem
  }) {
    const {
      area_id,
      area_type,
      area_bbox
    } = area;
    const unit_conversion_fn = variable_config.unit_conversions[unitsystem];
    const elems = [Object.assign(variable_config['acis_elements'][frequency === 'annual' ? 'annual' : 'monthly'], {
      "area_reduce": !!area_bbox ? 'bbox_mean' : area_type + '_mean'
    })];
    const area_params = !!area_bbox ? {
      bbox: area_bbox
    } : {
      [area_type]: area_id
    };
    const response = await (await fetch(data_api_url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "grid": grid,
        "sdate": String(sdate),
        "edate": String(edate),
        "elems": elems,
        ...area_params
      })
    })).json();
    let keys = [];
    let values = [];

    for (const [key, value] of get(response, 'data', [])) {
      if (undefined !== value[area_id] && String(value[area_id]) !== '-999' && String(value[area_id]) !== '') {
        keys.push(key);
        values.push(unit_conversion_fn(value[area_id]));
      }
    }

    return [keys, values];
  }
  /**
   * Retrieves island data and pre-filters it to just the variable we're interested in.
   * @return {Promise<array<{area_id,scenario,sdate,area_label,gcm_coords,area_type,variable,annual_data:{all_max, all_mean,all_min}, monthly_data:{all_max, all_mean,all_min}}>>}
   * @private
   */

  async function fetch_island_data(variable, area, island_data_url_template) {
    const {
      area_id
    } = area;
    const response = await (await fetch(island_data_url_template.replace('{area_id}', area_id), {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })).json();

    if (!response) {
      throw new Error("No data found for area \"".concat(area_id, "\" and variable \"").concat(variable, "\""));
    } // variable names are slightly different in the island data


    if (variable === 'days_dry_days') {
      // noinspection SpellCheckingInspection
      variable = 'dryday';
    } else if (variable.startsWith('days_t')) {
      variable = variable.replace(/days_(.+?)_.+?_([0-9]+)f/, "$1$2F");
    } else if (variable.startsWith('days_pcpn')) {
      variable = variable.replace(/.+?([0-9]+)in/, "pr$1in");
    } else if (variable.endsWith('_65f')) {
      variable = variable.replace('_65f', '');
    } else if (variable === 'gddmod') {
      // noinspection SpellCheckingInspection
      variable = 'mgdd';
    } else if (variable === 'pcpn') {
      variable = 'precipitation';
    }

    return response.data.filter(series => series.area_id === area_id && series.variable === variable);
  }

  /* globals jQuery, window, Plotly, fetch, jStat */
  // noinspection DuplicatedCode

  /**
   * Creates/updates an annual graph (with a focus on decadal data) for the CONUS.
   * @return {Promise<void>}
   * @private
   */

  class ConusDecadeView extends View {
    constructor(parent, element) {
      super(parent, element);
      this._style = '#' + this.parent.element.id + " .legendtitletext{ display: none; }";

      parent._styles.push(this._style);

      this.parent._update_styles();
    }

    async request_update() {
      const {
        colors,
        hover_decadal_means,
        plotly_layout_defaults,
        rolling_window_mean_years,
        show_decadal_means,
        show_historical_modeled,
        show_historical_observed,
        show_legend,
        show_projected_rcp45,
        show_projected_rcp85,
        show_rolling_window_means,
        variable
      } = this.parent.options;
      const area = this.parent.get_area();
      const variable_config = this.parent.get_variable_config();

      const _options = Object.assign({
        area,
        variable_config
      }, this.parent.options);

      const [hist_obs_data, hist_mod_data, proj_mod_data] = await Promise.all([get_historical_observed_livneh_data(_options), get_historical_annual_loca_model_data(_options), get_projected_loca_model_data(_options)]);
      this._download_callbacks = {
        hist_obs: async () => format_export_data(['year', variable_config.id], hist_obs_data),
        hist_mod: async () => format_export_data(['year', 'weighted_mean', 'min', 'max'], hist_mod_data),
        proj_mod: async () => format_export_data(['year', 'rcp45_weighted_mean', 'rcp45_min', 'rcp45_max', 'rcp85_weighted_mean', 'rcp85_min', 'rcp85_max'], proj_mod_data)
      }; // unpack arrays

      const chart_data = {
        'hist_obs_base': [],
        'hist_obs_year': [],
        'hist_obs': [],
        'hist_obs_diff': [],
        'hist_year': [],
        'hist_mean': [],
        'hist_min': [],
        'hist_max': [],
        'hist_max_diff': [],
        'proj_year': [],
        'rcp45_mean': [],
        'rcp45_min': [],
        'rcp45_max': [],
        'rcp85_mean': [],
        'rcp85_min': [],
        'rcp85_max': [],
        'hist_year_decade': [],
        'hist_decadal_mean': [],
        'hist_decadal_min': [],
        'hist_decadal_max': [],
        'proj_year_decade': [],
        'rcp45_decadal_mean': [],
        'rcp45_decadal_min': [],
        'rcp45_decadal_max': [],
        'rcp85_decadal_mean': [],
        'rcp85_decadal_min': [],
        'rcp85_decadal_max': [],
        'hist_rolling_mean': [],
        'hist_rolling_min': [],
        'hist_rolling_max': [],
        'rcp45_rolling_mean': [],
        'rcp45_rolling_min': [],
        'rcp45_rolling_max': [],
        'rcp85_rolling_mean': [],
        'rcp85_rolling_min': [],
        'rcp85_rolling_max': []
      };
      const precision = 1;
      let decadal_means_traces = [];
      let hist_decadal_data = [];
      let rcp45_decadal_data = [];
      let rcp85_decadal_data = [];

      if (show_decadal_means || hover_decadal_means) {
        const hist_stat_annual_values = [...hist_mod_data.map(a => [a[0], null, null, null, a[1], a[2], a[3]]), ...proj_mod_data.slice(0, 4)];
        const scenario_stat_annual_values = [...hist_mod_data.slice(-6).map(a => [a[0], a[1], a[2], a[3], a[1], a[2], a[3]]), ...proj_mod_data]; // compute decadal averages

        for (let i = 0; i < proj_mod_data.length; i++) {
          chart_data['proj_year_decade'][i] = Math.trunc(proj_mod_data[i][0] / 10) * 10;
        }

        for (let i = 0; i < hist_mod_data.length; i++) {
          chart_data['hist_year_decade'][i] = Math.trunc(hist_mod_data[i][0] / 10) * 10;
        }

        for (const [scenario, scenario_col_offset] of [['rcp45', 0], ['rcp85', 3]]) {
          for (const [stat, col_offset] of [['mean', 1], ['min', 2], ['max', 3]]) {
            const decadal_means = compute_decadal_means(scenario_stat_annual_values, 0, scenario_col_offset + col_offset, 2005, 2099);

            for (let i = 0; i < proj_mod_data.length; i++) {
              chart_data[scenario + '_decadal_' + stat][i] = decadal_means[Math.floor((i + 6) / 10)];
            } // compute decadal averages for hist using extra values from rcp85


            if (scenario === 'rcp85') {
              const hist_decadal_means = compute_decadal_means(hist_stat_annual_values, 0, scenario_col_offset + col_offset, 1950, 2004);

              for (let i = 0; i < hist_mod_data.length; i++) {
                chart_data['hist_decadal_' + stat][i] = hist_decadal_means[Math.floor(i / 10)];
              }
            }
          }
        }

        if (hover_decadal_means) {
          hist_decadal_data = range(hist_mod_data.length).map(i => [chart_data['hist_year_decade'][i], chart_data['hist_decadal_mean'][i], chart_data['hist_decadal_min'][i], chart_data['hist_decadal_max'][i]]);
          rcp45_decadal_data = range(proj_mod_data.length).map(i => [chart_data['proj_year_decade'][i], chart_data['rcp45_decadal_mean'][i], chart_data['rcp45_decadal_min'][i], chart_data['rcp45_decadal_max'][i]]);
          rcp45_decadal_data.unshift(hist_decadal_data.slice(-1)[0]); // repeat 2005

          rcp85_decadal_data = range(proj_mod_data.length).map(i => [chart_data['proj_year_decade'][i], chart_data['rcp85_decadal_mean'][i], chart_data['rcp85_decadal_min'][i], chart_data['rcp85_decadal_max'][i]]);
          rcp85_decadal_data.unshift(hist_decadal_data.slice(-1)[0]); // repeat 2005
        }

        if (show_decadal_means) {
          decadal_means_traces = [{
            name: 'Modeled maximum (historical decadal mean)',
            x: chart_data['hist_year'],
            y: chart_data['hist_decadal_max'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.hist.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_historical_modeled ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled mean (historical decadal mean)',
            x: chart_data['hist_year'],
            y: chart_data['hist_decadal_mean'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.hist.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_historical_modeled ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled minimum (historical decadal mean)',
            x: chart_data['hist_year'],
            y: chart_data['hist_decadal_min'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.hist.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_historical_modeled ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled maximum (RCP 4.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp45_decadal_max'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp45.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp45 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled minimum (RCP 4.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp45_decadal_min'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp45.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp45 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled mean (RCP 4.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp45_decadal_mean'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp45.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp45 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled maximum (RCP 8.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp85_decadal_max'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp85.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp85 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled minimum (RCP 8.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp85_decadal_min'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp85.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp85 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled mean (RCP 8.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp85_decadal_mean'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp85.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp85 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }];
        }

        chart_data['proj_year_decade'].unshift(2005); // repeat 2005
      }

      let rolling_means_traces = [];

      if (show_rolling_window_means) {
        const hist_stat_annual_values = [...range(rolling_window_mean_years).map(x => [1950 - (rolling_window_mean_years - x), Number.NaN, Number.NaN, Number.NaN, Number.NaN, Number.NaN, Number.NaN]), ...hist_mod_data.map(a => [a[0], null, null, null, a[1], a[2], a[3]])];
        const scenario_stat_annual_values = [...hist_mod_data.slice(-rolling_window_mean_years - 1).map(a => [a[0], a[1], a[2], a[3], a[1], a[2], a[3]]), ...proj_mod_data]; // compute rolling window means for proj

        for (const [scenario, scenario_col_offset] of [['rcp45', 0], ['rcp85', 3]]) {
          for (const [stat, col_offset] of [['mean', 1], ['min', 2], ['max', 3]]) {
            chart_data[scenario + '_rolling_' + stat] = compute_rolling_window_means(scenario_stat_annual_values, 0, scenario_col_offset + col_offset, 2005, 2099, rolling_window_mean_years).slice(rolling_window_mean_years);

            if (scenario === 'rcp85') {
              chart_data['hist_rolling_' + stat] = compute_rolling_window_means(hist_stat_annual_values, 0, scenario_col_offset + col_offset, 1950, 2004, rolling_window_mean_years).slice(rolling_window_mean_years);
            }
          }
        }

        rolling_means_traces = [{
          name: "Modeled maximum (historical ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['hist_year'],
          y: chart_data['hist_rolling_max'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.hist.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_historical_modeled ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled mean (historical ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['hist_year'],
          y: chart_data['hist_rolling_mean'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.hist.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_historical_modeled ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled minimum (historical ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['hist_year'],
          y: chart_data['hist_rolling_min'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.hist.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_historical_modeled ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled maximum (RCP 4.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp45_rolling_max'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp45.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp45 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled minimum (RCP 4.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp45_rolling_min'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp45.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp45 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled mean (RCP 4.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp45_rolling_mean'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp45.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp45 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled maximum (RCP 8.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp85_rolling_max'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp85.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp85 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled minimum (RCP 8.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp85_rolling_min'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp85.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp85 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled mean (RCP 8.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp85_rolling_mean'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp85.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp85 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }];
      }

      for (let i = 0; i < hist_obs_data.length; i++) {
        chart_data['hist_obs_year'].push(round(hist_obs_data[i][0], precision));
        chart_data['hist_obs'].push(round(hist_obs_data[i][1], precision));

        if (1961 <= hist_obs_data[i][0] <= 1990) {
          chart_data['hist_obs_base'].push(round(hist_obs_data[i][1], precision));
        }
      }

      const hist_obs_bar_base = mean(chart_data['hist_obs_base']);

      for (let i = 0; i < hist_obs_data.length; i++) {
        chart_data['hist_obs_diff'].push(round(hist_obs_data[i][1] - hist_obs_bar_base, precision));
      }

      for (let i = 0; i < hist_mod_data.length; i++) {
        chart_data['hist_year'].push(hist_mod_data[i][0]);
        chart_data['hist_mean'].push(round(hist_mod_data[i][1], precision));
        chart_data['hist_min'].push(round(hist_mod_data[i][2], precision));
        chart_data['hist_max'].push(round(hist_mod_data[i][3], precision));
      } // repeat 2005 data point to fill gap


      proj_mod_data.unshift([hist_mod_data[hist_mod_data.length - 1][0], round(hist_mod_data[hist_mod_data.length - 1][1], precision), round(hist_mod_data[hist_mod_data.length - 1][2], precision), round(hist_mod_data[hist_mod_data.length - 1][3], precision), round(hist_mod_data[hist_mod_data.length - 1][1], precision), round(hist_mod_data[hist_mod_data.length - 1][2], precision), round(hist_mod_data[hist_mod_data.length - 1][3], precision)]);

      for (let i = 0; i < proj_mod_data.length; i++) {
        chart_data['proj_year'].push(proj_mod_data[i][0]);
        chart_data['rcp45_mean'].push(round(proj_mod_data[i][1], precision));
        chart_data['rcp45_min'].push(round(proj_mod_data[i][2], precision));
        chart_data['rcp45_max'].push(round(proj_mod_data[i][3], precision));
        chart_data['rcp85_mean'].push(round(proj_mod_data[i][4], precision));
        chart_data['rcp85_min'].push(round(proj_mod_data[i][5], precision));
        chart_data['rcp85_max'].push(round(proj_mod_data[i][6], precision));
      }

      const [x_range_min, x_range_max, y_range_min, y_range_max] = this.parent._update_axes_ranges(min([min(chart_data['hist_year']), min(chart_data['proj_year'])]), max([max(chart_data['hist_year']), max(chart_data['proj_year'])]), min([min(chart_data['hist_min']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]), max([max(chart_data['hist_max']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])]));

      if (!(round(y_range_min, 1) === 0 && round(hist_obs_bar_base, 1) === 0)) {
        this._annotations = [{
          visible: show_historical_observed,
          x: 1,
          y: hist_obs_bar_base,
          xref: 'paper',
          yref: 'y',
          xanchor: 'right',
          yanchor: hist_obs_bar_base - (y_range_max - y_range_min) * 0.1 - y_range_min > 0 ? 'top' : 'bottom',
          text: '1961-1990 observed average',
          showarrow: false,
          font: {
            color: colors.hist.bar
          }
        }];
      } else {
        this._annotations = [];
      }

      Plotly.react(this.element, [{
        name: '1961-1990 observed average',
        x: [1950, 2099],
        y: [0, 0],
        yaxis: 'y4',
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        connectgaps: false,
        line: {
          color: rgba(colors.hist.bar, colors.opacity.hist_obs),
          width: 1,
          opacity: 1,
          dash: 'dot'
        },
        visible: !!show_historical_observed ? true : 'legendonly',
        hoverinfo: 'skip'
      }, {
        name: 'Modeled minimum (historical)',
        x: chart_data['hist_year'],
        y: chart_data['hist_min'],
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        line: {
          color: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
          width: 0,
          opacity: colors.opacity.ann_hist_minmax
        },
        legendgroup: 'hist',
        visible: !!show_historical_modeled ? true : 'legendonly',
        hoverinfo: 'skip'
      }, {
        x: chart_data['hist_year'],
        // y: chart_data['hist_max_diff'],
        y: chart_data['hist_max'],
        name: 'Modeled maximum (historical)',
        type: 'scatter',
        mode: 'lines',
        fill: 'tonexty',
        fillcolor: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
        line: {
          color: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
          width: 0,
          opacity: colors.opacity.ann_hist_minmax
        },
        legendgroup: 'hist',
        visible: !!show_historical_modeled ? true : 'legendonly',
        hoverlabel: {
          namelength: 0
        },
        // hoverinfo: 'text',
        customdata: hover_decadal_means ? hist_decadal_data : hist_mod_data,
        hovertemplate: "%{customdata[0]}".concat(hover_decadal_means ? 's' : '', " modeled range: %{customdata[2]:.1f}&#8211;%{customdata[3]:.1f}")
      }, // {
      //   x: chart_data['hist_year'],
      //   y: chart_data['hist_mean'],
      //   type: 'scatter',
      //   mode: 'lines',
      //   name: 'Historical Mean',
      //   line: {color: '#000000'},
      //   legendgroup: 'hist',
      //   visible: !!show_historical_modeled ? true : 'legendonly',
      // },
      {
        x: chart_data['proj_year'],
        y: chart_data['rcp45_min'],
        name: 'Modeled minimum (RCP 4.5 projection)',
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        fillcolor: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp45',
        visible: show_projected_rcp45 ? true : 'legendonly',
        hoverinfo: 'skip'
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp45_max'],
        name: 'Modeled maximum (RCP 4.5 projection)',
        fill: 'tonexty',
        type: 'scatter',
        mode: 'lines',
        fillcolor: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp45',
        visible: show_projected_rcp45 ? true : 'legendonly',
        hoverlabel: {
          namelength: 0
        },
        customdata: hover_decadal_means ? rcp45_decadal_data : proj_mod_data,
        hovertemplate: "(range: %{customdata[2]:.1f}&#8211;%{customdata[3]:.1f})"
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp85_min'],
        name: 'Modeled minimum (RCP 8.5 projection)',
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        fillcolor: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp85',
        visible: show_projected_rcp85 ? true : 'legendonly',
        showlegend: false,
        hoverinfo: 'skip'
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp85_max'],
        name: 'Modeled maximum (RCP 8.5 projection)',
        fill: 'tonexty',
        type: 'scatter',
        mode: 'lines',
        fillcolor: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp85',
        visible: show_projected_rcp85 ? true : 'legendonly',
        hoverlabel: {
          namelength: 0
        },
        customdata: hover_decadal_means ? rcp85_decadal_data : proj_mod_data,
        hovertemplate: "(range: %{customdata[2]:.1f}&#8211;%{customdata[3]:.1f})"
      }, {
        x: chart_data['hist_obs_year'],
        y: chart_data['hist_obs_diff'],
        type: 'bar',
        yaxis: 'y2',
        base: hist_obs_bar_base,
        name: 'Historical Observed',
        line: {
          color: colors.hist.line,
          width: 0.5
        },
        marker: {
          color: rgba(colors.hist.bar, colors.opacity.hist_obs)
        },
        legendgroup: 'histobs',
        visible: !!show_historical_observed ? true : 'legendonly',
        customdata: null,
        hovertemplate: "%{x} observed: <b>%{y:.1f}</b><br>1961-1990 observed average: <b>".concat(round(hist_obs_bar_base, 1), "</b>"),
        hoverlabel: {
          namelength: 0
        }
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp45_mean'],
        type: 'scatter',
        mode: 'lines',
        name: 'RCP 4.5 projections (weighted mean)',
        line: {
          color: rgba(colors.rcp45.line, colors.opacity.proj_line)
        },
        visible: show_projected_rcp45 ? true : 'legendonly',
        legendgroup: 'rcp45',
        yaxis: 'y3',
        hoverlabel: {
          namelength: 0
        },
        customdata: hover_decadal_means ? rcp45_decadal_data : proj_mod_data,
        hovertemplate: "%{customdata[0]}".concat(hover_decadal_means ? 's' : '', " lower emissions average projection: <b>%{customdata[1]:.1f}</b>")
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp85_mean'],
        type: 'scatter',
        mode: 'lines',
        name: 'Modeled mean (RCP 8.5 projections, weighted)',
        visible: show_projected_rcp85 ? true : 'legendonly',
        line: {
          color: rgba(colors.rcp85.line, colors.opacity.proj_line)
        },
        legendgroup: 'rcp85',
        yaxis: 'y3',
        hoverlabel: {
          namelength: 0
        },
        customdata: hover_decadal_means ? rcp85_decadal_data : proj_mod_data,
        hovertemplate: "%{customdata[0]}".concat(hover_decadal_means ? 's' : '', " higher emissions average projection: <b>%{customdata[1]:.1f}</b>")
      }, ...decadal_means_traces, ...rolling_means_traces], // layout
      Object.assign({}, plotly_layout_defaults, {
        margin: {
          l: 50,
          t: 12,
          r: 32,
          b: 60
        },
        showlegend: show_legend,
        hoverlabel: {
          namelength: -1
        },
        xaxis: this.parent._get_x_axis_layout(x_range_min, x_range_max),
        yaxis: this.parent._get_y_axis_layout(y_range_min, y_range_max, variable_config),
        yaxis2: {
          type: 'linear',
          matches: 'y',
          overlaying: 'y',
          showline: false,
          showgrid: false,
          showticklabels: false,
          nticks: 0
        },
        yaxis3: {
          type: 'linear',
          matches: 'y',
          overlaying: 'y',
          showline: false,
          showgrid: false,
          showticklabels: false,
          nticks: 0
        },
        yaxis4: {
          type: 'linear',
          range: [y_range_min - hist_obs_bar_base, y_range_max - hist_obs_bar_base],
          overlaying: 'y',
          autorange: false,
          scaleratio: 1,
          showline: true,
          // linecolor: '#494949',
          linecolor: 'rgb(0,0,0)',
          linewidth: 1,
          showgrid: false,
          zeroline: false,
          side: 'right',
          ticks: 'outside',
          tickcolor: 'rgb(0,0,0)',
          tickfont: {
            size: 9,
            family: 'roboto, monospace',
            color: '#494949'
          },
          nticks: 12,
          tickangle: 0,
          title: {
            text: 'Difference from Observed Average',
            font: {
              family: 'roboto, monospace',
              size: 10,
              color: '#494949'
            }
          }
        },
        annotations: this._annotations || []
      }), // options
      this.parent._get_plotly_options());
      this._when_chart = new Promise(resolve => {
        this.element.once('plotly_afterplot', gd => {
          resolve(gd);
        });

        if (this._relayout_handler) {
          this.element.removeEventListener('plotly_relayout', this._relayout_handler);
        }

        this._relayout_handler = partial(this.sync_y_axis_ranges.bind(this), hist_obs_bar_base, [y_range_min, y_range_max]);
        this.element.on('plotly_relayout', this._relayout_handler);
      });
      await this._when_chart;

      this.parent._hide_spinner();
    }

    sync_y_axis_ranges(offset, y_range_default, eventdata) {
      // keep secondary y-axis in sync
      const y_min_range = eventdata['yaxis.range[0]'];
      const y_max_range = eventdata['yaxis.range[1]'];
      const y4_min_range = eventdata['yaxis4.range[0]'];
      const y4_max_range = eventdata['yaxis4.range[1]'];

      if (Number.isFinite(y_min_range) && Number.isFinite(y_max_range)) {
        if (y_min_range - offset !== y4_min_range || y_max_range - offset !== y4_max_range) {
          Plotly.relayout(this.element, {
            'yaxis4.range': [y_min_range - offset, y_max_range - offset]
          });
        }
      } else if (Number.isFinite(y4_min_range) && Number.isFinite(y4_max_range)) {
        if (y_min_range - offset !== y4_min_range || y_max_range - offset !== y4_max_range) {
          Plotly.relayout(this.element, {
            'yaxis.range': [y4_min_range + offset, y4_max_range + offset]
          });
        }
      } else if (eventdata['yaxis.autorange'] || eventdata['yaxis4.autorange']) {
        Plotly.relayout(this.element, {
          'yaxis.range': [y_range_default[0], y_range_default[1]],
          'yaxis4.range': [y_range_default[0] - offset, y_range_default[1] - offset]
        });
      }
    }

    async request_style_update() {
      const {
        show_decadal_means,
        show_historical_modeled,
        show_historical_observed,
        show_projected_rcp45,
        show_projected_rcp85,
        show_rolling_window_means
      } = this.parent.options;
      let visible_traces = [!!show_historical_observed ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', // !!show_historical_modeled ? true : 'legendonly',
      !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_historical_observed ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly'];

      if (show_decadal_means) {
        visible_traces.push(!!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly');
      } // cleanup hidden decadal traces
      else if (!!this.element && !!this.element.data && this.element.data.find(trace => trace['name'].includes('decadal'))) {
          visible_traces.push(false, false, false, false, false, false, false, false, false);
        }

      if (show_rolling_window_means) {
        visible_traces.push(!!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly');
      } // cleanup hidden rolling window traces
      else if (!!this.element && !!this.element.data && this.element.data.find(trace => trace['name'].includes('rolling'))) {
          visible_traces.push(false, false, false, false, false, false, false, false, false);
        }

      if (this._annotations && this._annotations.length > 0) {
        this._annotations[0].visible = show_historical_observed;
      }

      Plotly.update(this.element, {
        visible: visible_traces
      }, {
        annotations: this._annotations || []
      });
    }
    /**
     * Options which force re-evaluation of which traces are visible within the current view.
     * @return {string[]}
     * @private
     */


    get style_option_names() {
      return ['show_projected_rcp45', 'show_projected_rcp85', 'show_historical_observed', 'show_historical_modeled', 'show_decadal_means', 'show_rolling_window_means'];
    }

    async request_downloads() {
      const {
        get_area_label,
        frequency,
        variable
      } = this.parent.options;
      return [{
        label: 'Observed Data',
        icon: 'bar-chart',
        attribution: 'ACIS: livneh',
        when_data: this._download_callbacks['hist_obs'],
        filename: [get_area_label.bind(this)(), frequency, "hist_obs", variable].join('-').replace(/ /g, '_') + '.csv'
      }, {
        label: 'Historical Modeled Data',
        icon: 'area-chart',
        attribution: 'ACIS: LOCA (CMIP 5)',
        when_data: this._download_callbacks['hist_mod'],
        filename: [get_area_label.bind(this)(), frequency, "hist_mod", variable].join('-').replace(/ /g, '_') + '.csv'
      }, {
        label: 'Projected Modeled Data',
        icon: 'area-chart',
        attribution: 'ACIS: LOCA (CMIP 5)',
        when_data: this._download_callbacks['proj_mod'],
        filename: [get_area_label.bind(this)(), frequency, "proj_mod", variable].join('-').replace(/ /g, '_') + '.csv'
      }, {
        label: 'Chart image',
        icon: 'picture-o',
        attribution: 'ACIS: Livneh & LOCA (CMIP 5)',
        when_data: async () => {
          let {
            width,
            height
          } = window.getComputedStyle(this.element);
          width = Number.parseFloat(width) * 1.2;
          height = Number.parseFloat(height) * 1.2;
          return await Plotly.toImage(this.element, {
            format: 'png',
            width: width,
            height: height
          });
        },
        filename: [get_area_label.bind(this)(), frequency, variable, "graph"].join('-').replace(/[^A-Za-z0-9\-]/g, '_') + '.png'
      }];
    }

    destroy() {
      super.destroy();

      try {
        //cleanup style
        const _style_idx = this.parent._styles.indexOf(this._style);

        if (_style_idx > -1) {
          this.parent._styles.splice(_style_idx, 1);
        }

        this.parent._update_styles(); // remove y-axis sync event handler


        if (this._relayout_handler) {
          this.element.removeEventListener('plotly_relayout', this._relayout_handler);
        }
      } catch {// do nothing
      }
    }

  }

  /* globals jQuery, window, Plotly, fetch */
  // noinspection DuplicatedCode

  class AlaskaYearView extends View {
    constructor(parent, element) {
      super(parent, element);
      this._style = '#' + this.parent.element.id + " .legendtitletext{ display: none; }";

      parent._styles.push(this._style);

      this.parent._update_styles();
    }

    async request_update() {
      // get data for GFDL-CM3 and NCAR-CCSM4
      const {
        colors,
        data_api_url,
        frequency,
        plotly_layout_defaults,
        rolling_window_mean_years,
        show_historical_modeled,
        show_legend,
        show_projected_rcp85,
        unitsystem,
        variable
      } = this.parent.options;
      const area = this.parent.get_area();
      const variable_config = this.parent.get_variable_config();
      let hist_sdate_year = 1970; // let hist_sdate = hist_sdate_year + '-01-01';

      let hist_edate_year = 2005; // let hist_edate = hist_edate_year + '-12-31';

      let proj_edate_year = 2099;
      const unit_conversion_fn = variable_config.unit_conversions[unitsystem];
      const [[gfdl_cm3_rcp85_years, gfdl_cm3_rcp85], [ncar_ccsm4_rcp85_years, ncar_ccsm4_rcp85]] = await Promise.all([fetch_acis_data({
        grid: 'snap:GFDL-CM3:rcp85',
        sdate: hist_sdate_year,
        edate: proj_edate_year,
        variable: variable,
        frequency: frequency,
        area: area,
        data_api_url: data_api_url,
        variable_config,
        unitsystem
      }), fetch_acis_data({
        grid: 'snap:NCAR-CCSM4:rcp85',
        sdate: hist_sdate_year,
        edate: proj_edate_year,
        variable: variable,
        frequency: frequency,
        area: area,
        data_api_url: data_api_url,
        variable_config,
        unitsystem
      })]);

      if (!isEqual(gfdl_cm3_rcp85_years, ncar_ccsm4_rcp85_years) || Number.parseInt(gfdl_cm3_rcp85_years[0]) !== hist_sdate_year || Number.parseInt(ncar_ccsm4_rcp85_years[0]) !== hist_sdate_year || Number.parseInt(gfdl_cm3_rcp85_years[gfdl_cm3_rcp85_years.length - 1]) !== proj_edate_year || Number.parseInt(ncar_ccsm4_rcp85_years[ncar_ccsm4_rcp85_years.length - 1]) !== proj_edate_year) {
        throw new Error("Unexpected annual data!");
      } // split into hist mod vs proj mod


      let hist_mod_data = [];
      let proj_mod_data = [];

      for (let i = 0; i < hist_edate_year - hist_sdate_year + 1; i++) {
        //year,gfdl_cm3_rcp85,ncar_ccsm4_rcp85
        hist_mod_data.push([i + hist_sdate_year, rolling_window_average(gfdl_cm3_rcp85, i, rolling_window_mean_years), rolling_window_average(ncar_ccsm4_rcp85, i, rolling_window_mean_years), i + hist_sdate_year - rolling_window_mean_years]);
      }

      for (let i = hist_edate_year - hist_sdate_year; i <= proj_edate_year - hist_sdate_year + 1; i++) {
        //year,gfdl_cm3_rcp85,ncar_ccsm4_rcp85
        proj_mod_data.push([i + hist_sdate_year, rolling_window_average(gfdl_cm3_rcp85, i, rolling_window_mean_years), rolling_window_average(ncar_ccsm4_rcp85, i, rolling_window_mean_years), i + hist_sdate_year - rolling_window_mean_years]);
      }

      this._download_callbacks = {
        hist_mod: async () => format_export_data(['year', 'gfdl_cm3_rcp85', 'ncar_ccsm4_rcp85', "*Note that the values shown have had a ".concat(rolling_window_mean_years, "-year rolling window average applied.")], hist_mod_data),
        proj_mod: async () => format_export_data(['year', 'gfdl_cm3_rcp85', 'ncar_ccsm4_rcp85', "*Note that the values shown have had a ".concat(rolling_window_mean_years, "-year rolling window average applied.")], proj_mod_data)
      };
      const chart_data = {
        'hist_year': [],
        'hist_min': [],
        'hist_max': [],
        'proj_year': [],
        'rcp85_min': [],
        'rcp85_max': []
      };
      const precision = 1;

      for (let i = 0; i < hist_mod_data.length; i++) {
        chart_data['hist_year'].push(hist_mod_data[i][0]);
        chart_data['hist_min'].push(round(Math.min(hist_mod_data[i][1], hist_mod_data[i][2]), precision));
        chart_data['hist_max'].push(round(Math.max(hist_mod_data[i][1], hist_mod_data[i][2]), precision));
      } // repeat 2005 data point to fill gap
      // chart_data['proj_year'].push(hist_mod_data[hist_mod_data.length - 1][0]);
      // chart_data['rcp85_min'].push(round(Math.min(hist_mod_data[hist_mod_data.length - 1][1], hist_mod_data[hist_mod_data.length - 1][2]), precision));
      // chart_data['rcp85_max'].push(round(Math.max(hist_mod_data[hist_mod_data.length - 1][1], hist_mod_data[hist_mod_data.length - 1][2]), precision));


      for (let i = 0; i < proj_mod_data.length; i++) {
        chart_data['proj_year'].push(proj_mod_data[i][0]);
        chart_data['rcp85_min'].push(round(Math.min(proj_mod_data[i][1], proj_mod_data[i][2]), precision));
        chart_data['rcp85_max'].push(round(Math.max(proj_mod_data[i][1], proj_mod_data[i][2]), precision));
      }

      const [x_range_min, x_range_max, y_range_min, y_range_max] = this.parent._update_axes_ranges(min([min(chart_data['hist_year']), min(chart_data['proj_year'])]), max([max(chart_data['hist_year']), max(chart_data['proj_year'])]), min([min(chart_data['hist_min']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]), max([max(chart_data['hist_max']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])]));

      Plotly.react(this.parent.view_container, [{
        name: 'Modeled minimum (historical)',
        x: chart_data['hist_year'],
        y: chart_data['hist_min'],
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        line: {
          color: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
          width: 0,
          opacity: colors.opacity.ann_hist_minmax
        },
        legendgroup: 'hist',
        visible: !!show_historical_modeled ? true : 'legendonly',
        customdata: null,
        hovertemplate: "<extra></extra>"
      }, {
        x: chart_data['hist_year'],
        y: chart_data['hist_max'],
        name: 'Modeled maximum (historical)',
        type: 'scatter',
        mode: 'lines',
        fill: 'tonexty',
        fillcolor: rgba(colors.hist.outerBand, 1),
        line: {
          color: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
          width: 0,
          opacity: 1
        },
        legendgroup: 'hist',
        visible: !!show_historical_modeled ? true : 'legendonly',
        customdata: hist_mod_data,
        hovertemplate: "%{customdata[3]}&#8211;%{customdata[0]} modeled averages:<br>GFDL-CM3: %{customdata[1]:.1f}<br>NCAR-CCSM4: %{customdata[2]:.1f}",
        hoverlabel: {
          namelength: 0
        }
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp85_min'],
        name: 'Modeled minimum (RCP 8.5)',
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        fillcolor: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: 1
        },
        legendgroup: 'rcp85',
        visible: show_projected_rcp85 ? true : 'legendonly',
        showlegend: false,
        hoverinfo: 'skip'
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp85_max'],
        name: 'Modeled maximum (RCP 8.5)',
        fill: 'tonexty',
        type: 'scatter',
        mode: 'lines',
        fillcolor: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: 1
        },
        legendgroup: 'rcp85',
        visible: show_projected_rcp85 ? true : 'legendonly',
        customdata: proj_mod_data,
        hovertemplate: "%{customdata[3]}&#8211;%{customdata[0]} higher emissions average projections:<br>GFDL-CM3: %{customdata[1]:.1f}<br>NCAR-CCSM4: %{customdata[2]:.1f}",
        hoverlabel: {
          namelength: 0
        }
      }], // layout
      Object.assign({}, plotly_layout_defaults, {
        showlegend: show_legend,
        legend: {
          "orientation": "h"
        },
        xaxis: this.parent._get_x_axis_layout(x_range_min, x_range_max),
        yaxis: this.parent._get_y_axis_layout(y_range_min, y_range_max, variable_config)
      }), // options
      this.parent._get_plotly_options());
      this._when_chart = new Promise(resolve => {
        this.element.once('plotly_afterplot', gd => {
          resolve(gd);
        });
      });
      await this._when_chart;

      this.parent._hide_spinner();
    }

    async request_style_update() {
      const {
        show_historical_modeled,
        show_projected_rcp85
      } = this.parent.options;
      Plotly.restyle(this.parent.view_container, {
        visible: [!!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly']
      });
    }

    async request_downloads() {
      const {
        get_area_label,
        frequency,
        variable
      } = this.parent.options;
      return [{
        label: 'Historical Modeled Data',
        icon: 'area-chart',
        attribution: 'ACIS: GFDL-CM3 and NCAR-CCSM4',
        when_data: this._download_callbacks['hist_mod'],
        filename: [get_area_label.bind(this)(), frequency, "hist_mod", variable].join('-').replace(/ /g, '_') + '.csv'
      }, {
        label: 'Projected Modeled Data',
        icon: 'area-chart',
        attribution: 'ACIS: GFDL-CM3 and NCAR-CCSM4',
        when_data: this._download_callbacks['proj_mod'],
        filename: [get_area_label.bind(this)(), frequency, "proj_mod", variable].join('-').replace(/ /g, '_') + '.csv'
      }, {
        label: 'Chart image',
        icon: 'picture-o',
        attribution: 'ACIS: GFDL-CM3 and NCAR-CCSM4',
        when_data: async () => {
          let {
            width,
            height
          } = window.getComputedStyle(this.element);
          width = Number.parseFloat(width) * 1.2;
          height = Number.parseFloat(height) * 1.2;
          return await Plotly.toImage(this.element, {
            format: 'png',
            width: width,
            height: height
          });
        },
        filename: [get_area_label.bind(this)(), frequency, variable, "graph"].join('-').replace(/[^A-Za-z0-9\-]/g, '_') + '.png'
      }];
    }
    /**
     * Options which force re-evaluation of which traces are visible within the current view.
     * @return {string[]}
     * @private
     */


    get style_option_names() {
      return ['show_projected_rcp85', 'show_historical_modeled'];
    }

    destroy() {
      super.destroy(); //cleanup style

      const _style_idx = this.parent._styles.indexOf(this._style);

      if (_style_idx > -1) {
        this.parent._styles.splice(_style_idx, 1);
      }

      this.parent._update_styles();
    }

  }

  /* globals jQuery, window, Plotly, fetch, jStat */
  // noinspection DuplicatedCode

  class IslandMonthView extends View {
    async request_update() {
      const {
        colors,
        island_data_url_template,
        monthly_timeperiod,
        plotly_layout_defaults,
        show_historical_modeled,
        show_legend,
        variable,
        show_projected_rcp45,
        show_projected_rcp85,
        unitsystem
      } = this.parent.options;
      const area = this.parent.get_area();
      const variable_config = this.parent.get_variable_config();
      let data = await fetch_island_data(variable, area, island_data_url_template);
      let hist_mod_series = data.find(series => series.scenario === 'historical');
      let rcp45_mod_series = data.find(series => series.scenario === 'rcp45');
      let rcp85_mod_series = data.find(series => series.scenario === 'rcp85');
      const unit_conversion_fn = variable_config.unit_conversions[unitsystem];
      let hist_mod_data = [];

      for (const month of months) {
        //year,mean,min,max
        hist_mod_data.push([month, unit_conversion_fn(mean(hist_mod_series.monthly_data.all_mean[month])), unit_conversion_fn(mean(hist_mod_series.monthly_data.all_min[month])), unit_conversion_fn(mean(hist_mod_series.monthly_data.all_max[month]))]);
      }

      const proj_sdate_year = Number.parseInt(rcp85_mod_series.sdate.substr(0, 4));
      let proj_mod_data = [];

      for (const month of months) {
        let _month_data = [];

        for (const year_range of monthly_timeperiods) {
          let year_range_min_idx = year_range - 15 - proj_sdate_year;

          for (const scenario_monthly_data of [rcp45_mod_series.monthly_data, rcp85_mod_series.monthly_data]) {
            for (const value_name of ['mean', 'min', 'max']) {
              _month_data.push(unit_conversion_fn(mean(scenario_monthly_data['all_' + value_name][month].slice(year_range_min_idx, year_range_min_idx + 30))));
            }
          }
        }

        proj_mod_data.push([month, ..._month_data]);
      }

      this._download_callbacks = {
        hist_mod: async () => format_export_data(['year', 'mean', 'min', 'max'], hist_mod_data),
        proj_mod: async () => format_export_data(['month', '2025_rcp45_mean', '2025_rcp45_min', '2025_rcp45_max', '2025_rcp85_mean', '2025_rcp85_min', '2025_rcp85_max', '2050_rcp45_mean', '2050_rcp45_min', '2050_rcp45_max', '2050_rcp85_mean', '2050_rcp85_min', '2050_rcp85_max', '2075_rcp45_mean', '2075_rcp45_min', '2075_rcp45_max', '2075_rcp85_mean', '2075_rcp85_min', '2075_rcp85_max'], proj_mod_data)
      };
      const chart_data = {
        'month': [],
        'month_label': [],
        'hist_min': [],
        'hist_max': [],
        'rcp45_mean': [],
        'rcp45_min': [],
        'rcp45_max': [],
        'rcp85_mean': [],
        'rcp85_min': [],
        'rcp85_max': []
      };
      const precision = 1;

      const _monthly_timeperiod = Number.parseInt(monthly_timeperiod);

      const col_offset = 1 + monthly_timeperiods.indexOf(_monthly_timeperiod) * 6; // for some reason unknown to me, the following month cycle is shown.

      const month_indexes = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

      for (const m of month_indexes) {
        const _m = m % 12;

        chart_data['month'].push(m);
        chart_data['month_label'].push(months_labels[_m]);
        chart_data['hist_min'].push(round(hist_mod_data[_m][1], precision));
        chart_data['hist_max'].push(round(hist_mod_data[_m][2], precision));
        chart_data['rcp45_mean'].push(round(proj_mod_data[_m][col_offset], precision));
        chart_data['rcp45_min'].push(round(proj_mod_data[_m][1 + col_offset], precision));
        chart_data['rcp45_max'].push(round(proj_mod_data[_m][2 + col_offset], precision));
        chart_data['rcp85_mean'].push(round(proj_mod_data[_m][3 + col_offset], precision));
        chart_data['rcp85_min'].push(round(proj_mod_data[_m][4 + col_offset], precision));
        chart_data['rcp85_max'].push(round(proj_mod_data[_m][5 + col_offset], precision));
      }

      const [x_range_min, x_range_max, y_range_min, y_range_max] = this.parent._update_axes_ranges(month_indexes, month_indexes[month_indexes.length - 1], min([min(chart_data['hist_min']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]), max([max(chart_data['hist_max']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])]));

      Plotly.react(this.element, [{
        name: 'Modeled minimum (historical)',
        x: chart_data['month'],
        y: chart_data['hist_min'],
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        line: {
          color: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
          width: 0,
          opacity: colors.opacity.ann_hist_minmax
        },
        legendgroup: 'hist',
        visible: !!show_historical_modeled ? true : 'legendonly',
        hoverinfo: 'skip'
      }, {
        x: chart_data['month'],
        // y: chart_data['hist_max_diff'],
        y: chart_data['hist_max'],
        // text: chart_data['hist_max'],
        // hoverinfo: 'text',
        name: 'Modeled maximum (historical)',
        type: 'scatter',
        mode: 'lines',
        fill: 'tonexty',
        fillcolor: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
        line: {
          color: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
          width: 0,
          opacity: colors.opacity.ann_hist_minmax
        },
        legendgroup: 'hist',
        visible: !!show_historical_modeled ? true : 'legendonly',
        customdata: hist_mod_data,
        hovertemplate: "1961-1990 modeled range: %{customdata[2]:.1f}&#8211;%{customdata[3]:.1f}",
        hoverlabel: {
          namelength: 0
        }
      }, {
        x: chart_data['month'],
        y: chart_data['rcp45_min'],
        name: 'Modeled minimum (RCP 4.5 projection)',
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        fillcolor: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp45',
        visible: show_projected_rcp45 ? true : 'legendonly',
        hoverinfo: 'skip'
      }, {
        x: chart_data['month'],
        y: chart_data['rcp45_max'],
        name: 'Modeled maximum (RCP 4.5 projection)',
        fill: 'tonexty',
        type: 'scatter',
        mode: 'lines',
        fillcolor: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp45',
        visible: show_projected_rcp45 ? true : 'legendonly',
        hoverlabel: {
          namelength: 0
        },
        customdata: proj_mod_data,
        hovertemplate: "(range: %{customdata[2]:.1f}&#8211;%{customdata[3]:.1f})"
      }, {
        x: chart_data['month'],
        y: chart_data['rcp85_min'],
        name: 'Modeled minimum (RCP 8.5 projection)',
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        fillcolor: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp85',
        visible: show_projected_rcp85 ? true : 'legendonly',
        showlegend: false,
        hoverinfo: 'skip'
      }, {
        x: chart_data['month'],
        y: chart_data['rcp85_max'],
        name: 'Modeled maximum (RCP 8.5 projection)',
        fill: 'tonexty',
        type: 'scatter',
        mode: 'lines',
        fillcolor: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp85',
        visible: show_projected_rcp85 ? true : 'legendonly',
        hoverlabel: {
          namelength: 0
        },
        customdata: proj_mod_data,
        hovertemplate: "(range: %{customdata[2]:.1f}&#8211;%{customdata[3]:.1f})"
      }, {
        x: chart_data['month'],
        y: chart_data['rcp45_mean'],
        type: 'scatter',
        mode: 'lines',
        name: 'Modeled mean (RCP 4.5 projection)',
        line: {
          color: rgba(colors.rcp45.line, colors.opacity.proj_line)
        },
        visible: show_projected_rcp45 ? true : 'legendonly',
        legendgroup: 'rcp45',
        hoverlabel: {
          namelength: 0
        },
        hovertemplate: "lower emissions average projection: <b>%{y:.1f}</b>"
      }, {
        x: chart_data['month'],
        y: chart_data['rcp85_mean'],
        type: 'scatter',
        mode: 'lines',
        name: 'Modeled mean (RCP 8.5 projection)',
        visible: show_projected_rcp85 ? true : 'legendonly',
        line: {
          color: rgba(colors.rcp85.line, colors.opacity.proj_line)
        },
        legendgroup: 'rcp85',
        hoverlabel: {
          namelength: 0
        },
        hovertemplate: "higher emissions average projection: <b>%{y:.1f}</b>"
      }], // layout
      Object.assign({}, plotly_layout_defaults, {
        showlegend: show_legend,
        xaxis: Object.assign(this.parent._get_x_axis_layout(x_range_min, x_range_max), {
          tickmode: 'array',
          tickvals: month_indexes,
          ticktext: chart_data['month_label']
        }),
        yaxis: this.parent._get_y_axis_layout(y_range_min, y_range_max, variable_config)
      }), // options
      this.parent._get_plotly_options());
      this._when_chart = new Promise(resolve => {
        this.element.once('plotly_afterplot', gd => {
          resolve(gd);
        });
      });
      await this._when_chart;

      this.parent._hide_spinner();
    }

    async request_style_update() {
      const {
        show_projected_rcp45,
        show_projected_rcp85,
        show_historical_modeled
      } = this.parent.options;
      Plotly.restyle(this.element, {
        visible: [!!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly']
      });
    }

    async request_downloads() {
      const {
        get_area_label,
        frequency,
        variable
      } = this.parent.options;
      return [{
        label: 'Historical Modeled Data',
        icon: 'area-chart',
        attribution: 'ACIS: LOCA (CMIP 5)',
        when_data: this._download_callbacks['hist_mod'],
        filename: [get_area_label.bind(this)(), frequency, "hist_mod", variable].join('-').replace(/ /g, '_') + '.csv'
      }, {
        label: 'Projected Modeled Data',
        icon: 'area-chart',
        attribution: 'ACIS: LOCA (CMIP 5)',
        when_data: this._download_callbacks['proj_mod'],
        filename: [get_area_label.bind(this)(), frequency, "proj_mod", variable].join('-').replace(/ /g, '_') + '.csv'
      }, {
        label: 'Chart image',
        icon: 'picture-o',
        attribution: 'ACIS: Livneh & LOCA (CMIP 5)',
        when_data: async () => {
          let {
            width,
            height
          } = window.getComputedStyle(this.element);
          width = Number.parseFloat(width) * 1.2;
          height = Number.parseFloat(height) * 1.2;
          return await Plotly.toImage(this.element, {
            format: 'png',
            width: width,
            height: height
          });
        },
        filename: [get_area_label.bind(this)(), frequency, variable, "graph"].join('-').replace(/[^A-Za-z0-9\-]/g, '_') + '.png'
      }];
    }

  }

  /* globals jQuery, window, Plotly, fetch, jStat */
  // noinspection DuplicatedCode

  class ConusMonthView extends View {
    async request_update() {
      const {
        colors,
        monthly_timeperiod,
        plotly_layout_defaults,
        show_historical_observed,
        show_legend,
        show_projected_rcp45,
        show_projected_rcp85,
        variable
      } = this.parent.options;
      const area = this.parent.get_area();
      const variable_config = this.parent.get_variable_config();

      const _options = Object.assign({
        area,
        variable_config
      }, this.parent.options);

      const [hist_obs_month_values, proj_mod_month_values] = await Promise.all([get_historical_observed_livneh_data(_options), get_projected_loca_model_data(_options)]);
      const hist_obs_sdate_year = hist_obs_month_values['01'][0][0];
      const hist_obs_edate_year = hist_obs_month_values['01'][hist_obs_month_values['01'].length - 1][0];
      let hist_obs_data = [];

      for (const month of months) {
        hist_obs_data.push([month, mean(hist_obs_month_values[month].map(a => a[1]))]);
      } // reshape from {month: [year, rcp45_mean, rcp45_min, rcp45_max, rcp85_mean, rcp85_min, rcp85_max]} to ['month', '2025_rcp45_mean', '2025_rcp45_min', '2025_rcp45_max', '2025_rcp85_mean', '2025_rcp85_min', '2025_rcp85_max', '2050_rcp45_mean', '2050_rcp45_min', '2050_rcp45_max', '2050_rcp85_mean', '2050_rcp85_min', '2050_rcp85_max', '2075_rcp45_mean', '2075_rcp45_min', '2075_rcp45_max', '2075_rcp85_mean', '2075_rcp85_min', '2075_rcp85_max']


      const proj_sdate_year = proj_mod_month_values['01'][0][0]; // const proj_edate_year = proj_mod_month_values['01'][proj_mod_month_values['01'].length - 1][0];

      let proj_mod_data = [];

      for (const month of months) {
        let _month_data = [];

        for (const year_range of monthly_timeperiods) {
          let year_range_min_idx = year_range - 15 - proj_sdate_year;

          for (const scenario_column_offset of [0, 3]) {
            // rcp45, rcp85
            for (const value_i of [0, 1, 2]) {
              //mean, min, max
              _month_data.push(mean(proj_mod_month_values[month].slice(year_range_min_idx, year_range_min_idx + 30).map(a => a[1 + scenario_column_offset + value_i])));
            }
          }
        }

        proj_mod_data.push([month, ..._month_data]);
      }

      this._download_callbacks = {
        hist_obs: async () => format_export_data(['month', 'mean', "* Note that the mean is based on monthly data for years  ".concat(hist_obs_sdate_year, "-").concat(hist_obs_edate_year)], hist_obs_data),
        proj_mod: async () => format_export_data(['month', '2025_rcp45_mean', '2025_rcp45_min', '2025_rcp45_max', '2025_rcp85_mean', '2025_rcp85_min', '2025_rcp85_max', '2050_rcp45_mean', '2050_rcp45_min', '2050_rcp45_max', '2050_rcp85_mean', '2050_rcp85_min', '2050_rcp85_max', '2075_rcp45_mean', '2075_rcp45_min', '2075_rcp45_max', '2075_rcp85_mean', '2075_rcp85_min', '2075_rcp85_max'], proj_mod_data)
      };
      const chart_data = {
        'month': [],
        'month_label': [],
        'hist_obs': [],
        'rcp45_mean': [],
        'rcp45_min': [],
        'rcp45_max': [],
        'rcp85_mean': [],
        'rcp85_min': [],
        'rcp85_max': []
      };
      const precision = 1;

      const _monthly_timeperiod = Number.parseInt(monthly_timeperiod);

      const col_offset = 1 + monthly_timeperiods.indexOf(_monthly_timeperiod) * 6; // for some reason unknown to me, the following month cycle is shown.

      const month_indexes = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

      for (const m of month_indexes) {
        const _m = m % 12;

        chart_data['month'].push(m);
        chart_data['month_label'].push(months_labels[_m]);
        chart_data['hist_obs'].push(round(hist_obs_data[_m][1], precision));
        chart_data['rcp45_mean'].push(round(proj_mod_data[_m][col_offset], precision));
        chart_data['rcp45_min'].push(round(proj_mod_data[_m][1 + col_offset], precision));
        chart_data['rcp45_max'].push(round(proj_mod_data[_m][2 + col_offset], precision));
        chart_data['rcp85_mean'].push(round(proj_mod_data[_m][3 + col_offset], precision));
        chart_data['rcp85_min'].push(round(proj_mod_data[_m][4 + col_offset], precision));
        chart_data['rcp85_max'].push(round(proj_mod_data[_m][5 + col_offset], precision));
      }

      const [x_range_min, x_range_max, y_range_min, y_range_max] = this.parent._update_axes_ranges(month_indexes, month_indexes[month_indexes.length - 1], min([min(chart_data['hist_obs']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]), max([max(chart_data['hist_obs']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])]));

      Plotly.react(this.element, [{
        x: chart_data['month'],
        y: chart_data['rcp45_min'],
        name: 'Modeled minimum (RCP 4.5 projection)',
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        fillcolor: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp45',
        visible: show_projected_rcp45 ? true : 'legendonly',
        hoverinfo: 'skip'
      }, {
        x: chart_data['month'],
        y: chart_data['rcp45_max'],
        name: 'Modeled maximum (RCP 4.5 projection)',
        fill: 'tonexty',
        type: 'scatter',
        mode: 'lines',
        fillcolor: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp45',
        visible: show_projected_rcp45 ? true : 'legendonly',
        hoverlabel: {
          namelength: 0
        },
        customdata: proj_mod_data,
        hovertemplate: "(range: %{customdata[2]:.1f}&#8211;%{customdata[3]:.1f})"
      }, {
        x: chart_data['month'],
        y: chart_data['rcp85_min'],
        name: 'Modeled minimum (RCP 8.5 projection)',
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        fillcolor: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp85',
        visible: show_projected_rcp85 ? true : 'legendonly',
        showlegend: false,
        hoverinfo: 'skip'
      }, {
        x: chart_data['month'],
        y: chart_data['rcp85_max'],
        name: 'Modeled maximum (RCP 8.5 projection)',
        fill: 'tonexty',
        type: 'scatter',
        mode: 'lines',
        fillcolor: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp85',
        visible: show_projected_rcp85 ? true : 'legendonly',
        hoverlabel: {
          namelength: 0
        },
        customdata: proj_mod_data,
        hovertemplate: "(range: %{customdata[2]:.1f}&#8211;%{customdata[3]:.1f})"
      }, {
        x: chart_data['month'],
        y: chart_data['hist_obs'],
        type: 'scatter',
        mode: 'lines',
        name: "".concat(hist_obs_sdate_year, "-").concat(hist_obs_edate_year, " observed average"),
        line: {
          color: colors.hist.line
        },
        legendgroup: 'histobs',
        visible: !!show_historical_observed ? true : 'legendonly',
        hovertemplate: "".concat(hist_obs_sdate_year, "-").concat(hist_obs_edate_year, " observed average: <b>%{y:.1f}</b>"),
        hoverlabel: {
          namelength: 0
        }
      }, {
        x: chart_data['month'],
        y: chart_data['rcp45_mean'],
        type: 'scatter',
        mode: 'lines',
        name: 'Modeled mean (RCP 4.5 projection)',
        line: {
          color: rgba(colors.rcp45.line, colors.opacity.proj_line)
        },
        visible: show_projected_rcp45 ? true : 'legendonly',
        legendgroup: 'rcp45',
        hoverlabel: {
          namelength: 0
        },
        hovertemplate: "lower emissions average projection: <b>%{y:.1f}</b>"
      }, {
        x: chart_data['month'],
        y: chart_data['rcp85_mean'],
        type: 'scatter',
        mode: 'lines',
        name: 'Modeled mean (RCP 8.5 projection)',
        visible: show_projected_rcp85 ? true : 'legendonly',
        line: {
          color: rgba(colors.rcp85.line, colors.opacity.proj_line)
        },
        legendgroup: 'rcp85',
        hoverlabel: {
          namelength: 0
        },
        hovertemplate: "higher emissions average projection: <b>%{y:.1f}</b>"
      }], // layout
      Object.assign({}, plotly_layout_defaults, {
        showlegend: show_legend,
        xaxis: Object.assign(this.parent._get_x_axis_layout(x_range_min, x_range_max), {
          tickmode: 'array',
          tickvals: month_indexes,
          ticktext: chart_data['month_label']
        }),
        yaxis: this.parent._get_y_axis_layout(y_range_min, y_range_max, variable_config)
      }), // options
      this.parent._get_plotly_options());
      this._when_chart = new Promise(resolve => {
        this.element.once('plotly_afterplot', gd => {
          resolve(gd);
        });
      });
      await this._when_chart;

      this.parent._hide_spinner();
    }

    async request_style_update() {
      const {
        show_projected_rcp45,
        show_projected_rcp85,
        show_historical_observed
      } = this.parent.options;
      Plotly.restyle(this.element, {
        visible: [!!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_historical_observed ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly']
      });
    }

    async request_downloads() {
      const {
        get_area_label,
        frequency,
        variable
      } = this.parent.options;
      return [{
        label: 'Observed Data',
        icon: 'bar-chart',
        attribution: 'ACIS: livneh',
        when_data: this._download_callbacks['hist_obs'],
        filename: [get_area_label.bind(this)(), frequency, "hist_obs", variable].join('-').replace(/ /g, '_') + '.csv'
      }, {
        label: 'Projected Modeled Data',
        icon: 'area-chart',
        attribution: 'ACIS: LOCA (CMIP 5)',
        when_data: this._download_callbacks['proj_mod'],
        filename: [get_area_label.bind(this)(), frequency, "proj_mod", variable].join('-').replace(/ /g, '_') + '.csv'
      }, {
        label: 'Chart image',
        icon: 'picture-o',
        attribution: 'ACIS: Livneh & LOCA (CMIP 5)',
        when_data: async () => {
          let {
            width,
            height
          } = window.getComputedStyle(this.element);
          width = Number.parseFloat(width) * 1.2;
          height = Number.parseFloat(height) * 1.2;
          return await Plotly.toImage(this.element, {
            format: 'png',
            width: width,
            height: height
          });
        },
        filename: [get_area_label.bind(this)(), frequency, variable, "graph"].join('-').replace(/[^A-Za-z0-9\-]/g, '_') + '.png'
      }];
    }

  }

  /* globals jQuery, window, Plotly,jStat, fetch */
  // noinspection DuplicatedCode

  class ConusYearView extends View {
    /**
     * Creates/updates an annual graph for the CONUS.
     * @return {Promise<void>}
     * @private
     */
    async request_update() {
      const {
        colors,
        show_decadal_means,
        hover_decadal_means,
        show_projected_rcp85,
        show_projected_rcp45,
        show_historical_modeled,
        show_rolling_window_means,
        show_historical_observed,
        rolling_window_mean_years,
        plotly_layout_defaults,
        show_legend,
        variable,
        data_api_url
      } = this.parent.options;

      const _options = Object.assign({
        area: this.parent.get_area(),
        variable_config: this.parent.get_variable_config()
      }, this.parent.options);

      const [hist_obs_data, hist_mod_data, proj_mod_data] = await Promise.all([get_historical_observed_livneh_data(_options), get_historical_annual_loca_model_data(_options), get_projected_loca_model_data(_options)]); // prepare a function to compute significance, but don't do it yet.

      this._download_callbacks = {
        hist_obs: async () => format_export_data(['year', variable], hist_obs_data),
        hist_mod: async () => format_export_data(['year', 'weighted_mean', 'min', 'max'], hist_mod_data),
        proj_mod: async () => format_export_data(['year', 'rcp45_weighted_mean', 'rcp45_min', 'rcp45_max', 'rcp85_weighted_mean', 'rcp85_min', 'rcp85_max'], proj_mod_data),
        departure_significance: async () => this.get_departure_significance_stats(hist_mod_data, proj_mod_data)
      };

      const chart_data = {
        'hist_obs_base': [],
        'hist_obs_year': [],
        'hist_obs': [],
        'hist_obs_diff': [],
        'hist_year': [],
        'hist_mean': [],
        'hist_min': [],
        'hist_max': [],
        'hist_max_diff': [],
        'proj_year': [],
        'rcp45_mean': [],
        'rcp45_min': [],
        'rcp45_max': [],
        'rcp85_mean': [],
        'rcp85_min': [],
        'rcp85_max': [],
        'hist_year_decade': [],
        'hist_decadal_mean': [],
        'hist_decadal_min': [],
        'hist_decadal_max': [],
        'proj_year_decade': [],
        'rcp45_decadal_mean': [],
        'rcp45_decadal_min': [],
        'rcp45_decadal_max': [],
        'rcp85_decadal_mean': [],
        'rcp85_decadal_min': [],
        'rcp85_decadal_max': [],
        'hist_rolling_mean': [],
        'hist_rolling_min': [],
        'hist_rolling_max': [],
        'rcp45_rolling_mean': [],
        'rcp45_rolling_min': [],
        'rcp45_rolling_max': [],
        'rcp85_rolling_mean': [],
        'rcp85_rolling_min': [],
        'rcp85_rolling_max': []
      };
      const precision = 1;
      let decadal_means_traces = [];
      let hist_decadal_data = [];
      let rcp45_decadal_data = [];
      let rcp85_decadal_data = [];

      if (show_decadal_means || hover_decadal_means) {
        const hist_stat_annual_values = [...hist_mod_data.map(a => [a[0], null, null, null, a[1], a[2], a[3]]), ...proj_mod_data.slice(0, 4)];
        const scenario_stat_annual_values = [...hist_mod_data.slice(-6).map(a => [a[0], a[1], a[2], a[3], a[1], a[2], a[3]]), ...proj_mod_data];

        for (let i = 0; i < proj_mod_data.length; i++) {
          chart_data['proj_year_decade'][i] = Math.trunc(proj_mod_data[i][0] / 10) * 10;
        }

        for (let i = 0; i < hist_mod_data.length; i++) {
          chart_data['hist_year_decade'][i] = Math.trunc(hist_mod_data[i][0] / 10) * 10;
        } // compute decadal averages for proj


        for (const [scenario, scenario_col_offset] of [['rcp45', 0], ['rcp85', 3]]) {
          for (const [stat, col_offset] of [['mean', 1], ['min', 2], ['max', 3]]) {
            const decadal_means = compute_decadal_means(scenario_stat_annual_values, 0, scenario_col_offset + col_offset, 2005, 2099);

            for (let i = 0; i < proj_mod_data.length + 1; i++) {
              chart_data[scenario + '_decadal_' + stat][i] = decadal_means[Math.floor((10 + i - 5) / 10)];
            } // compute decadal averages for hist using extra values from rcp85


            if (scenario === 'rcp85') {
              const hist_decadal_means = compute_decadal_means(hist_stat_annual_values, 0, scenario_col_offset + col_offset, 1950, 2004);

              for (let i = 0; i < hist_mod_data.length; i++) {
                chart_data['hist_decadal_' + stat][i] = hist_decadal_means[Math.floor(i / 10)];
              }
            }
          }
        }

        if (hover_decadal_means) {
          hist_decadal_data = range(hist_mod_data.length).map(i => [chart_data['hist_year_decade'][i], chart_data['hist_decadal_mean'][i], chart_data['hist_decadal_min'][i], chart_data['hist_decadal_max'][i]]);
          rcp45_decadal_data = range(proj_mod_data.length).map(i => [chart_data['proj_year_decade'][i], chart_data['rcp45_decadal_mean'][i], chart_data['rcp45_decadal_min'][i], chart_data['rcp45_decadal_max'][i]]);
          rcp45_decadal_data.unshift(hist_decadal_data.slice(-1)[0]);
          rcp85_decadal_data = range(proj_mod_data.length).map(i => [chart_data['proj_year_decade'][i], chart_data['rcp85_decadal_mean'][i], chart_data['rcp85_decadal_min'][i], chart_data['rcp85_decadal_max'][i]]);
          rcp85_decadal_data.unshift(hist_decadal_data.slice(-1)[0]);
        }

        if (show_decadal_means) {
          decadal_means_traces = [{
            name: 'Modeled maximum (historical decadal mean)',
            x: chart_data['hist_year'],
            y: chart_data['hist_decadal_max'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.hist.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_historical_modeled ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled mean (historical decadal mean)',
            x: chart_data['hist_year'],
            y: chart_data['hist_decadal_mean'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.hist.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_historical_modeled ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled minimum (historical decadal mean)',
            x: chart_data['hist_year'],
            y: chart_data['hist_decadal_min'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.hist.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_historical_modeled ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled maximum (RCP 4.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp45_decadal_max'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp45.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp45 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled minimum (RCP 4.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp45_decadal_min'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp45.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp45 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled mean (RCP 4.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp45_decadal_mean'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp45.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp45 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled maximum (RCP 8.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp85_decadal_max'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp85.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp85 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled minimum (RCP 8.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp85_decadal_min'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp85.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp85 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled mean (RCP 8.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp85_decadal_mean'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp85.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp85 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }];
        }
      }

      let rolling_means_traces = [];

      if (show_rolling_window_means) {
        const hist_stat_annual_values = [...range(rolling_window_mean_years).map(x => [1950 - (rolling_window_mean_years - x), Number.NaN, Number.NaN, Number.NaN, Number.NaN, Number.NaN, Number.NaN]), ...hist_mod_data.map(a => [a[0], null, null, null, a[1], a[2], a[3]])];
        const scenario_stat_annual_values = [...hist_mod_data.slice(-rolling_window_mean_years - 1).map(a => [a[0], a[1], a[2], a[3], a[1], a[2], a[3]]), ...proj_mod_data]; // compute rolling window means for proj

        for (const [scenario, scenario_col_offset] of [['rcp45', 0], ['rcp85', 3]]) {
          for (const [stat, col_offset] of [['mean', 1], ['min', 2], ['max', 3]]) {
            chart_data[scenario + '_rolling_' + stat] = compute_rolling_window_means(scenario_stat_annual_values, 0, scenario_col_offset + col_offset, 2005, 2099, rolling_window_mean_years).slice(rolling_window_mean_years);

            if (scenario === 'rcp85') {
              chart_data['hist_rolling_' + stat] = compute_rolling_window_means(hist_stat_annual_values, 0, scenario_col_offset + col_offset, 1950, 2004, rolling_window_mean_years).slice(rolling_window_mean_years);
            }
          }
        }

        rolling_means_traces = [{
          name: "Modeled maximum (historical ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['hist_year'],
          y: chart_data['hist_rolling_max'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.hist.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_historical_modeled ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled mean (historical ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['hist_year'],
          y: chart_data['hist_rolling_mean'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.hist.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_historical_modeled ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled minimum (historical ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['hist_year'],
          y: chart_data['hist_rolling_min'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.hist.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_historical_modeled ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled maximum (RCP 4.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp45_rolling_max'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp45.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp45 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled minimum (RCP 4.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp45_rolling_min'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp45.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp45 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled mean (RCP 4.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp45_rolling_mean'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp45.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp45 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled maximum (RCP 8.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp85_rolling_max'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp85.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp85 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled minimum (RCP 8.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp85_rolling_min'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp85.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp85 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled mean (RCP 8.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp85_rolling_mean'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp85.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp85 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }];
      }

      for (let i = 0; i < hist_obs_data.length; i++) {
        chart_data['hist_obs_year'].push(round(hist_obs_data[i][0], precision));
        chart_data['hist_obs'].push(round(hist_obs_data[i][1], precision));

        if (1961 <= hist_obs_data[i][0] <= 1990) {
          chart_data['hist_obs_base'].push(round(hist_obs_data[i][1], precision));
        }
      }

      const hist_obs_bar_base = mean(chart_data['hist_obs_base']);

      for (let i = 0; i < hist_obs_data.length; i++) {
        chart_data['hist_obs_diff'].push(round(hist_obs_data[i][1] - hist_obs_bar_base, precision));
      }

      for (let i = 0; i < hist_mod_data.length; i++) {
        chart_data['hist_year'].push(hist_mod_data[i][0]);
        chart_data['hist_mean'].push(round(hist_mod_data[i][1], precision));
        chart_data['hist_min'].push(round(hist_mod_data[i][2], precision));
        chart_data['hist_max'].push(round(hist_mod_data[i][3], precision));
      } // repeat 2005 data point to fill gap


      proj_mod_data.unshift([hist_mod_data[hist_mod_data.length - 1][0], round(hist_mod_data[hist_mod_data.length - 1][1], precision), round(hist_mod_data[hist_mod_data.length - 1][2], precision), round(hist_mod_data[hist_mod_data.length - 1][3], precision), round(hist_mod_data[hist_mod_data.length - 1][1], precision), round(hist_mod_data[hist_mod_data.length - 1][2], precision), round(hist_mod_data[hist_mod_data.length - 1][3], precision)]);

      for (let i = 0; i < proj_mod_data.length; i++) {
        chart_data['proj_year'].push(proj_mod_data[i][0]);
        chart_data['rcp45_mean'].push(round(proj_mod_data[i][1], precision));
        chart_data['rcp45_min'].push(round(proj_mod_data[i][2], precision));
        chart_data['rcp45_max'].push(round(proj_mod_data[i][3], precision));
        chart_data['rcp85_mean'].push(round(proj_mod_data[i][4], precision));
        chart_data['rcp85_min'].push(round(proj_mod_data[i][5], precision));
        chart_data['rcp85_max'].push(round(proj_mod_data[i][6], precision));
      }

      const [x_range_min, x_range_max, y_range_min, y_range_max] = this.parent._update_axes_ranges(min([min(chart_data['hist_year']), min(chart_data['proj_year'])]), max([max(chart_data['hist_year']), max(chart_data['proj_year'])]), min([min(chart_data['hist_min']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]), max([max(chart_data['hist_max']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])]));

      Plotly.react(this.element, [{
        name: 'Modeled minimum (historical)',
        x: chart_data['hist_year'],
        y: chart_data['hist_min'],
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        line: {
          color: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
          width: 0,
          opacity: colors.opacity.ann_hist_minmax
        },
        legendgroup: 'hist',
        visible: !!show_historical_modeled ? true : 'legendonly',
        hoverinfo: 'skip'
      }, {
        x: chart_data['hist_year'],
        // y: chart_data['hist_max_diff'],
        y: chart_data['hist_max'],
        name: 'Modeled maximum (historical)',
        type: 'scatter',
        mode: 'lines',
        fill: 'tonexty',
        fillcolor: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
        line: {
          color: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
          width: 0,
          opacity: colors.opacity.ann_hist_minmax
        },
        legendgroup: 'hist',
        visible: !!show_historical_modeled ? true : 'legendonly',
        // hovertemplate: "%{text}",
        hoverlabel: {
          namelength: 0
        },
        text: chart_data['hist_year'].map((year, i) => "Range of hindcast values for the ".concat(Math.trunc(year / 10), "0s: <b>").concat(round(chart_data['hist_decadal_min'][i], 1), "</b> - <b>").concat(round(chart_data['hist_decadal_max'][i], 1), "</b>")),
        // hoverinfo: 'text',
        customdata: hover_decadal_means ? hist_decadal_data : hist_mod_data,
        hovertemplate: hover_decadal_means ? "Range of hindcast values for %{customdata[0]}s: <b>%{customdata[2]:.1f}</b> - <b>%{customdata[3]:.1f}</b>" : "Range of hindcast values for %{customdata[0]}: <b>%{customdata[2]:.1f}</b> - <b>%{customdata[3]:.1f}</b>"
      }, // {
      //   x: chart_data['hist_year'],
      //   y: chart_data['hist_mean'],
      //   type: 'scatter',
      //   mode: 'lines',
      //   name: 'Historical Mean',
      //   line: {color: '#000000'},
      //   legendgroup: 'hist',
      //   visible: !!show_historical_modeled ? true : 'legendonly',
      // },
      {
        x: chart_data['proj_year'],
        y: chart_data['rcp45_min'],
        name: 'Modeled minimum (RCP 4.5 projection)',
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        fillcolor: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp45',
        visible: show_projected_rcp45 ? true : 'legendonly',
        // customdata: null,
        // hovertemplate: "<extra></extra>",
        hoverinfo: 'skip'
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp45_max'],
        name: 'Modeled maximum (RCP 4.5 projection)',
        fill: 'tonexty',
        type: 'scatter',
        mode: 'lines',
        fillcolor: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp45',
        visible: show_projected_rcp45 ? true : 'legendonly',
        // customdata: proj_mod_data,
        // hovertemplate: "(%{customdata[2]:.1f} - %{customdata[3]:.1f})<extra></extra>"
        hoverlabel: {
          namelength: 0
        },
        // text: chart_data['proj_year'].map((year, i) => `Range of projections for lower emissions for ${Math.trunc(year / 10)}0s: <b>${round(chart_data['rcp45_decadal_min'][i], 1)}</b> - <b>${round(chart_data['rcp45_decadal_max'][i], 1)}</b>`),
        // hoverinfo: 'text',
        customdata: hover_decadal_means ? rcp45_decadal_data : proj_mod_data,
        hovertemplate: hover_decadal_means ? "Range of projections for lower emissions for %{customdata[0]}s: <b>%{customdata[2]:.1f}</b> - <b>%{customdata[3]:.1f}</b>" : "Range of projections for lower emissions for %{customdata[0]}: <b>%{customdata[2]:.1f}</b> - <b>%{customdata[3]:.1f}</b>"
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp85_min'],
        name: 'Modeled minimum (RCP 8.5 projection)',
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        fillcolor: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp85',
        visible: show_projected_rcp85 ? true : 'legendonly',
        showlegend: false,
        // customdata: null,
        // hovertemplate: "<extra></extra>",
        hoverinfo: 'skip'
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp85_max'],
        name: 'Modeled maximum (RCP 8.5 projection)',
        fill: 'tonexty',
        type: 'scatter',
        mode: 'lines',
        fillcolor: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp85',
        visible: show_projected_rcp85 ? true : 'legendonly',
        // customdata: proj_mod_data,
        // hovertemplate: "(%{customdata[5]:.1f} - %{customdata[6]:.1f})<extra></extra>"
        hoverlabel: {
          namelength: 0
        },
        // text: chart_data['proj_year'].map((year, i) => `Range of projections for higher emissions for ${Math.trunc(year / 10)}0s: <b>${round(chart_data['rcp85_decadal_min'][i], 1)}</b> - <b>${round(chart_data['rcp85_decadal_max'][i], 1)}</b>`),
        // hoverinfo: 'text',
        customdata: hover_decadal_means ? rcp85_decadal_data : proj_mod_data,
        hovertemplate: hover_decadal_means ? "Range of projections for higher emissions for %{customdata[0]}s: <b>%{customdata[2]:.1f}</b> - <b>%{customdata[3]:.1f}</b>" : "Range of projections for higher emissions for %{customdata[0]}: <b>%{customdata[5]:.1f}</b> - <b>%{customdata[6]:.1f}</b>"
      }, {
        x: chart_data['hist_obs_year'],
        y: chart_data['hist_obs_diff'],
        type: 'bar',
        yaxis: 'y2',
        base: hist_obs_bar_base,
        name: 'Historical Observed',
        line: {
          color: colors.hist.line,
          width: 0.5
        },
        marker: {
          color: rgba(colors.hist.bar, colors.opacity.hist_obs)
        },
        legendgroup: 'histobs',
        visible: !!show_historical_observed ? true : 'legendonly',
        customdata: null,
        hovertemplate: "Observed average for %{x}: <b>%{y:.1f}</b><br>Average from 1961-1990: <b>".concat(round(hist_obs_bar_base, 1), "</b>"),
        hoverlabel: {
          namelength: 0
        } // text: chart_data['hist_year'].map((year, i)=>`Observed average for ${year}: ${round(chart_data['rcp85_decadal_min'][i],1)} - ${round(chart_data['rcp85_decadal_max'][i],1)}`),
        // hoverinfo: 'text',

      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp45_mean'],
        type: 'scatter',
        mode: 'lines',
        name: 'RCP 4.5 projections (weighted mean)',
        line: {
          color: rgba(colors.rcp45.line, colors.opacity.proj_line)
        },
        visible: show_projected_rcp45 ? true : 'legendonly',
        legendgroup: 'rcp45',
        yaxis: 'y3',
        // customdata: null,
        // hovertemplate: "RCP 4.5: <b>%{y:.1f}</b><extra></extra>"
        hoverlabel: {
          namelength: 0
        },
        // text: chart_data['proj_year'].map((year, i) => `Projected average for lower emissions for ${Math.trunc(year / 10)}0s: <b>${round(chart_data['rcp45_decadal_mean'][i], 1)}</b>`),
        // hoverinfo: 'text',
        customdata: hover_decadal_means ? rcp45_decadal_data : proj_mod_data,
        hovertemplate: hover_decadal_means ? "Range of projections for lower emissions for %{customdata[0]}s: <b>%{customdata[1]:.1f}</b>" : "Projected average for lower emissions for %{customdata[0]}: <b>%{customdata[1]:.1f}</b>"
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp85_mean'],
        type: 'scatter',
        mode: 'lines',
        name: 'Modeled mean (RCP 8.5 projections, weighted)',
        visible: show_projected_rcp85 ? true : 'legendonly',
        line: {
          color: rgba(colors.rcp85.line, colors.opacity.proj_line)
        },
        legendgroup: 'rcp85',
        yaxis: 'y3',
        // customdata: null,
        // hovertemplate: "RCP 8.5: <b>%{y:.1f}</b><extra></extra>"
        hoverlabel: {
          namelength: 0
        },
        // text: chart_data['proj_year'].map((year, i) => `Projected average for higher emissions for ${Math.trunc(year / 10)}0s: <b>${round(chart_data['rcp45_decadal_mean'][i], 1)}</b>`),
        // hoverinfo: 'text',
        customdata: hover_decadal_means ? rcp85_decadal_data : proj_mod_data,
        hovertemplate: hover_decadal_means ? "Projected average for higher emissions for %{customdata[0]}s: <b>%{customdata[1]:.1f}</b>" : "Projected average for higher emissions for %{customdata[0]}: <b>%{customdata[1]:.1f}</b>"
      }, ...decadal_means_traces, ...rolling_means_traces], // layout
      Object.assign({}, plotly_layout_defaults, {
        showlegend: show_legend,
        hoverlabel: {
          namelength: -1
        },
        xaxis: this.parent._get_x_axis_layout(x_range_min, x_range_max),
        yaxis: this.parent._get_y_axis_layout(y_range_min, y_range_max, variable_config),
        yaxis2: {
          type: 'linear',
          matches: 'y',
          overlaying: 'y',
          showline: false,
          showgrid: false,
          showticklabels: false,
          nticks: 0
        },
        yaxis3: {
          type: 'linear',
          matches: 'y',
          overlaying: 'y',
          showline: false,
          showgrid: false,
          showticklabels: false,
          nticks: 0
        }
      }), // options
      this.parent._get_plotly_options());

      this._update_visibility = () => {
        let visible_traces = [!!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', // !!show_historical_modeled ? true : 'legendonly',
        !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_historical_observed ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly'];

        if (show_decadal_means) {
          visible_traces.push(!!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly');
        } // cleanup hidden decadal traces
        else if (!!this.element && !!this.element.data && this.element.data.find(trace => trace['name'].includes('decadal'))) {
            visible_traces.push(false, false, false, false, false, false, false, false, false);
          }

        if (show_rolling_window_means) {
          visible_traces.push(!!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly');
        } // cleanup hidden rolling window traces
        else if (!!this.element && !!this.element.data && this.element.data.find(trace => trace['name'].includes('rolling'))) {
            visible_traces.push(false, false, false, false, false, false, false, false, false);
          }

        Plotly.restyle(this.element, {
          visible: visible_traces
        });
      };

      this._when_chart = new Promise(resolve => {
        this.element.once('plotly_afterplot', gd => {
          resolve(gd);
        });
      });
      await this._when_chart;

      this.parent._hide_spinner();
    }

    async request_style_update() {
      const {
        show_historical_modeled,
        show_projected_rcp45,
        show_projected_rcp85,
        show_historical_observed,
        show_rolling_window_means
      } = this.parent.options;
      let visible_traces = [!!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', // !!show_historical_modeled ? true : 'legendonly',
      !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_historical_observed ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly'];

      if (show_decadal_means) {
        visible_traces.push(!!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly');
      } // cleanup hidden decadal traces
      else if (!!this.element && !!this.element.data && this.element.data.find(trace => trace['name'].includes('decadal'))) {
          visible_traces.push(false, false, false, false, false, false, false, false, false);
        }

      if (show_rolling_window_means) {
        visible_traces.push(!!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly');
      } // cleanup hidden rolling window traces
      else if (!!this.element && !!this.element.data && this.element.data.find(trace => trace['name'].includes('rolling'))) {
          visible_traces.push(false, false, false, false, false, false, false, false, false);
        }

      Plotly.restyle(this.element, {
        visible: visible_traces
      });
    }

    get_departure_significance_stats(hist_mod_data, proj_mod_data, hist_start_year = 1961, hist_end_year = 1990, proj_start_year = 2036, proj_end_year = 2065) {
      const {
        area_id,
        variable
      } = this.parent.options;
      const p = 0.05; // 95% CI

      const n = 30;
      let result = []; // scenario, stat, change, CI, significance

      if (hist_end_year - hist_start_year + 1 !== 30) {
        throw new Error('Historical year range must be exactly 30 years.');
      }

      if (proj_end_year - proj_start_year + 1 !== 30) {
        throw new Error('Projected year range must be exactly 30 years.');
      }

      const t_score = 2.002; // t-score for two 30-sample series (df = (n_a - 1) + (n_b - 1))

      for (const [i, stat] of ['mean', 'min', 'max'].entries()) {
        const hist_col_offset = 1;
        const hist_series = map(filter(hist_mod_data, r => r[0] >= hist_start_year && r[0] <= hist_end_year), v => round(v[i + hist_col_offset], 4));
        const hist_mean = mean(hist_series);
        const hist_var = jStat.variance(hist_series, true);

        for (const scenario of ['rcp45', 'rcp85']) {
          const proj_col_offset = scenario === 'rcp45' ? 1 : 4; // compute mean

          const proj_series = map(filter(proj_mod_data, r => r[0] >= proj_start_year && r[0] <= proj_end_year), v => round(v[i + proj_col_offset], 4));
          const proj_mean = mean(proj_series);
          const proj_var = jStat.variance(proj_series, true); // compute change stat

          const change = proj_mean - hist_mean; // compute CI

          const ci = Math.sqrt(2 * ((hist_var + proj_var) / 2) / n) * t_score; // I understand this line least, but it's consistent with the output I expect.
          // F-test (larger variance as numerator to get right-sided

          const f = 2 * jStat.ftest(Math.max(hist_var, proj_var) / Math.min(hist_var, proj_var), n - 1, n - 1); // compute significance

          const t_equal_variance = jStat.ttest(hist_series, proj_series, true, 2);
          const t_unequal_variance = jStat.ttest(hist_series, proj_series, false, 2);
          const significant = f < p && t_equal_variance < p || f >= p && t_unequal_variance < p;
          result.push([area_id, variable, scenario, stat, round(hist_mean, 1), round(proj_mean, 1), round(change, 1), round(ci, 5), round(f, 5), round(t_equal_variance, 5), round(t_unequal_variance, 5), significant ? 'S' : 'NS']);
        }
      }

      return format_export_data(['area_id', 'variable', 'scenario', 'stat', 'hist_mean', 'proj_mean', 'change', 'CI', 'ftest', 'ttest_ev', 'ttest_uv', 'significance'], result);
    }

    async request_downloads() {
      const {
        get_area_label,
        frequency,
        variable
      } = this.parent.options;
      const downloads = [{
        label: 'Observed Data',
        icon: 'bar-chart',
        attribution: 'ACIS: livneh',
        when_data: this._download_callbacks['hist_obs'],
        filename: [get_area_label.bind(this)(), frequency, "hist_obs", variable].join('-').replace(/ /g, '_') + '.csv'
      }, {
        label: 'Historical Modeled Data',
        icon: 'area-chart',
        attribution: 'ACIS: LOCA (CMIP 5)',
        when_data: this._download_callbacks['hist_mod'],
        filename: [get_area_label.bind(this)(), frequency, "hist_mod", variable].join('-').replace(/ /g, '_') + '.csv'
      }, {
        label: 'Projected Modeled Data',
        icon: 'area-chart',
        attribution: 'ACIS: LOCA (CMIP 5)',
        when_data: this._download_callbacks['proj_mod'],
        filename: [get_area_label.bind(this)(), frequency, "proj_mod", variable].join('-').replace(/ /g, '_') + '.csv'
      }, {
        label: 'Departure from natural range of variation report (1961-1990 compared to 2036-2065) ',
        icon: 'balance-scale',
        attribution: 'ACIS: LOCA (CMIP 5)',
        when_data: this._download_callbacks['departure_significance'],
        filename: [get_area_label.bind(this)().toLowerCase(), frequency, variable, "departure_significance"].join('-').replace(/ /g, '_') + '.csv'
      }, {
        label: 'Chart image',
        icon: 'picture-o',
        attribution: 'ACIS: Livneh & LOCA (CMIP 5)',
        when_data: async () => {
          let {
            width,
            height
          } = window.getComputedStyle(this.element);
          width = Number.parseFloat(width) * 1.2;
          height = Number.parseFloat(height) * 1.2;
          return await Plotly.toImage(this.element, {
            format: 'png',
            width: width,
            height: height
          });
        },
        filename: [get_area_label.bind(this)(), frequency, variable, "graph"].join('-').replace(/[^A-Za-z0-9\-]/g, '_') + '.png'
      }];

      if (!jStat) {
        // remove departure significance if jStat is not available.
        downloads.splice(3, 1);
      }

      return downloads;
    }

  }

  /* globals jQuery, window, Plotly, fetch, jStat */
  // noinspection DuplicatedCode

  /**
   * Creates/updates an annual graph (with a focus on decadal data) for islands and other areas outside CONUS.
   * @return {Promise<void>}
   * @private
   */

  class IslandDecadeView extends View {
    constructor(parent, element) {
      super(parent, element);
      this._style = '#' + this.parent.element.id + " .legendtitletext{ display: none; }";

      parent._styles.push(this._style);

      this.parent._update_styles();
    }

    async request_update() {
      const {
        colors,
        hover_decadal_means,
        island_data_url_template,
        plotly_layout_defaults,
        rolling_window_mean_years,
        show_decadal_means,
        show_historical_modeled,
        show_legend,
        show_projected_rcp45,
        show_projected_rcp85,
        show_rolling_window_means,
        unitsystem,
        variable
      } = this.parent.options;
      const area = this.parent.get_area();
      const variable_config = this.parent.get_variable_config();
      let data = await fetch_island_data(variable, area, island_data_url_template);
      let hist_mod_series = data.find(series => series.scenario === 'historical');
      let rcp45_mod_series = data.find(series => series.scenario === 'rcp45');
      let rcp85_mod_series = data.find(series => series.scenario === 'rcp85');
      const unit_conversion_fn = variable_config.unit_conversions[unitsystem]; // reshape hist data to an array of [[year,mean,min,max], ...] (to match how update_annual_conus shapes it's data)

      const hist_sdate_year = Number.parseInt(hist_mod_series.sdate.substr(0, 4));
      let hist_mod_data = hist_mod_series.annual_data.all_mean.reduce((_data, v, i) => {
        _data.push([hist_sdate_year + i, unit_conversion_fn(v), unit_conversion_fn(hist_mod_series.annual_data.all_min[i]), unit_conversion_fn(hist_mod_series.annual_data.all_max[i])]);

        return _data;
      }, []); // reshape proj data to an array of [[year,rcp45mean,rcp45min,rcp45max,rcp85mean,rcp85min,rcp85max], ...] (to match how update_annual_conus shapes it's data)

      const proj_sdate_year = Number.parseInt(rcp45_mod_series.sdate.substr(0, 4));
      let proj_mod_data = rcp45_mod_series.annual_data.all_mean.reduce((_data, v, i) => {
        _data.push([proj_sdate_year + i, unit_conversion_fn(v), unit_conversion_fn(rcp45_mod_series.annual_data.all_min[i]), unit_conversion_fn(rcp45_mod_series.annual_data.all_max[i]), unit_conversion_fn(rcp85_mod_series.annual_data.all_mean[i]), unit_conversion_fn(rcp85_mod_series.annual_data.all_min[i]), unit_conversion_fn(rcp85_mod_series.annual_data.all_max[i])]);

        return _data;
      }, []); // format download data.

      this._download_callbacks = {
        hist_mod: async () => format_export_data(['year', 'mean', 'min', 'max'], hist_mod_data),
        proj_mod: async () => format_export_data(['year', 'rcp45_mean', 'rcp45_min', 'rcp45_max', 'rcp85_mean', 'rcp85_min', 'rcp85_max'], proj_mod_data)
      }; // unpack arrays

      const chart_data = {
        'hist_year': [],
        'hist_mean': [],
        'hist_min': [],
        'hist_max': [],
        'hist_max_diff': [],
        'proj_year': [],
        'rcp45_mean': [],
        'rcp45_min': [],
        'rcp45_max': [],
        'rcp85_mean': [],
        'rcp85_min': [],
        'rcp85_max': [],
        'hist_year_decade': [],
        'hist_decadal_mean': [],
        'hist_decadal_min': [],
        'hist_decadal_max': [],
        'proj_year_decade': [],
        'rcp45_decadal_mean': [],
        'rcp45_decadal_min': [],
        'rcp45_decadal_max': [],
        'rcp85_decadal_mean': [],
        'rcp85_decadal_min': [],
        'rcp85_decadal_max': [],
        'hist_rolling_mean': [],
        'hist_rolling_min': [],
        'hist_rolling_max': [],
        'rcp45_rolling_mean': [],
        'rcp45_rolling_min': [],
        'rcp45_rolling_max': [],
        'rcp85_rolling_mean': [],
        'rcp85_rolling_min': [],
        'rcp85_rolling_max': []
      };
      const precision = 1;
      let decadal_means_traces = [];
      let hist_decadal_data = [];
      let rcp45_decadal_data = [];
      let rcp85_decadal_data = [];

      if (show_decadal_means || hover_decadal_means) {
        const hist_stat_annual_values = [...hist_mod_data.map(a => [a[0], null, null, null, a[1], a[2], a[3]]), ...proj_mod_data.slice(0, 4)];
        const scenario_stat_annual_values = [...hist_mod_data.slice(-6).map(a => [a[0], a[1], a[2], a[3], a[1], a[2], a[3]]), ...proj_mod_data];
        scenario_stat_annual_values.pop(); // remove 2100 from decadals
        // compute decadal averages

        for (let i = 0; i < proj_mod_data.length; i++) {
          chart_data['proj_year_decade'][i] = Math.trunc(proj_mod_data[i][0] / 10) * 10;
        }

        for (let i = 0; i < hist_mod_data.length; i++) {
          chart_data['hist_year_decade'][i] = Math.trunc(hist_mod_data[i][0] / 10) * 10;
        }

        for (const [scenario, scenario_col_offset] of [['rcp45', 0], ['rcp85', 3]]) {
          for (const [stat, col_offset] of [['mean', 1], ['min', 2], ['max', 3]]) {
            const decadal_means = compute_decadal_means(scenario_stat_annual_values, 0, scenario_col_offset + col_offset, 2005, 2099);

            for (let i = 0; i < proj_mod_data.length; i++) {
              chart_data[scenario + '_decadal_' + stat][i] = decadal_means[Math.floor((i + 6) / 10)];
            } // compute decadal averages for hist using extra values from rcp85


            if (scenario === 'rcp85') {
              const hist_decadal_means = compute_decadal_means(hist_stat_annual_values, 0, scenario_col_offset + col_offset, 1950, 2004);

              for (let i = 0; i < hist_mod_data.length; i++) {
                chart_data['hist_decadal_' + stat][i] = hist_decadal_means[Math.floor(i / 10)];
              }
            }
          }
        }

        if (hover_decadal_means) {
          hist_decadal_data = range(hist_mod_data.length).map(i => [chart_data['hist_year_decade'][i], chart_data['hist_decadal_mean'][i], chart_data['hist_decadal_min'][i], chart_data['hist_decadal_max'][i]]);
          rcp45_decadal_data = range(proj_mod_data.length).map(i => [chart_data['proj_year_decade'][i], chart_data['rcp45_decadal_mean'][i], chart_data['rcp45_decadal_min'][i], chart_data['rcp45_decadal_max'][i]]);
          rcp45_decadal_data.unshift(hist_decadal_data.slice(-1)[0]); // repeat 2005

          rcp45_decadal_data[rcp45_decadal_data.length - 1] = [2100, "NaN", "NaN", "NaN"]; // NaN 2100

          rcp85_decadal_data = range(proj_mod_data.length).map(i => [chart_data['proj_year_decade'][i], chart_data['rcp85_decadal_mean'][i], chart_data['rcp85_decadal_min'][i], chart_data['rcp85_decadal_max'][i]]);
          rcp85_decadal_data.unshift(hist_decadal_data.slice(-1)[0]); // repeat 2005

          rcp85_decadal_data[rcp85_decadal_data.length - 1] = [2100, "NaN", "NaN", "NaN"]; // NaN 2100
        }

        if (show_decadal_means) {
          decadal_means_traces = [{
            name: 'Modeled maximum (historical decadal mean)',
            x: chart_data['hist_year'],
            y: chart_data['hist_decadal_max'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.hist.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_historical_modeled ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled mean (historical decadal mean)',
            x: chart_data['hist_year'],
            y: chart_data['hist_decadal_mean'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.hist.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_historical_modeled ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled minimum (historical decadal mean)',
            x: chart_data['hist_year'],
            y: chart_data['hist_decadal_min'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.hist.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_historical_modeled ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled maximum (RCP 4.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp45_decadal_max'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp45.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp45 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled minimum (RCP 4.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp45_decadal_min'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp45.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp45 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled mean (RCP 4.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp45_decadal_mean'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp45.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp45 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled maximum (RCP 8.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp85_decadal_max'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp85.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp85 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled minimum (RCP 8.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp85_decadal_min'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp85.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp85 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled mean (RCP 8.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp85_decadal_mean'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp85.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp85 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }];
        }

        chart_data['proj_year_decade'].unshift(2005); // repeat 2005
        // chart_data['proj_year_decade'].push(2100) // 2100
      }

      let rolling_means_traces = [];

      if (show_rolling_window_means) {
        const hist_stat_annual_values = [...range(rolling_window_mean_years).map(x => [1950 - (rolling_window_mean_years - x), Number.NaN, Number.NaN, Number.NaN, Number.NaN, Number.NaN, Number.NaN]), ...hist_mod_data.map(a => [a[0], null, null, null, a[1], a[2], a[3]])];
        const scenario_stat_annual_values = [...hist_mod_data.slice(-rolling_window_mean_years - 1).map(a => [a[0], a[1], a[2], a[3], a[1], a[2], a[3]]), ...proj_mod_data];
        scenario_stat_annual_values.pop(); // remove 2100 from rolling means
        // compute rolling window means for proj

        for (const [scenario, scenario_col_offset] of [['rcp45', 0], ['rcp85', 3]]) {
          for (const [stat, col_offset] of [['mean', 1], ['min', 2], ['max', 3]]) {
            chart_data[scenario + '_rolling_' + stat] = compute_rolling_window_means(scenario_stat_annual_values, 0, scenario_col_offset + col_offset, 2005, 2099, rolling_window_mean_years).slice(rolling_window_mean_years);

            if (scenario === 'rcp85') {
              chart_data['hist_rolling_' + stat] = compute_rolling_window_means(hist_stat_annual_values, 0, scenario_col_offset + col_offset, 1950, 2004, rolling_window_mean_years).slice(rolling_window_mean_years);
            }
          }
        }

        rolling_means_traces = [{
          name: "Modeled maximum (historical ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['hist_year'],
          y: chart_data['hist_rolling_max'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.hist.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_historical_modeled ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled mean (historical ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['hist_year'],
          y: chart_data['hist_rolling_mean'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.hist.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_historical_modeled ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled minimum (historical ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['hist_year'],
          y: chart_data['hist_rolling_min'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.hist.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_historical_modeled ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled maximum (RCP 4.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp45_rolling_max'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp45.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp45 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled minimum (RCP 4.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp45_rolling_min'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp45.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp45 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled mean (RCP 4.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp45_rolling_mean'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp45.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp45 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled maximum (RCP 8.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp85_rolling_max'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp85.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp85 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled minimum (RCP 8.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp85_rolling_min'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp85.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp85 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled mean (RCP 8.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp85_rolling_mean'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp85.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp85 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }];
      }

      for (let i = 0; i < hist_mod_data.length; i++) {
        chart_data['hist_year'].push(hist_mod_data[i][0]);
        chart_data['hist_mean'].push(round(hist_mod_data[i][1], precision));
        chart_data['hist_min'].push(round(hist_mod_data[i][2], precision));
        chart_data['hist_max'].push(round(hist_mod_data[i][3], precision));
      } // repeat 2005 data point to fill gap


      proj_mod_data.unshift([hist_mod_data[hist_mod_data.length - 1][0], round(hist_mod_data[hist_mod_data.length - 1][1], precision), round(hist_mod_data[hist_mod_data.length - 1][2], precision), round(hist_mod_data[hist_mod_data.length - 1][3], precision), round(hist_mod_data[hist_mod_data.length - 1][1], precision), round(hist_mod_data[hist_mod_data.length - 1][2], precision), round(hist_mod_data[hist_mod_data.length - 1][3], precision)]);

      for (let i = 0; i < proj_mod_data.length; i++) {
        chart_data['proj_year'].push(proj_mod_data[i][0]);
        chart_data['rcp45_mean'].push(round(proj_mod_data[i][1], precision));
        chart_data['rcp45_min'].push(round(proj_mod_data[i][2], precision));
        chart_data['rcp45_max'].push(round(proj_mod_data[i][3], precision));
        chart_data['rcp85_mean'].push(round(proj_mod_data[i][4], precision));
        chart_data['rcp85_min'].push(round(proj_mod_data[i][5], precision));
        chart_data['rcp85_max'].push(round(proj_mod_data[i][6], precision));
      }

      const [x_range_min, x_range_max, y_range_min, y_range_max] = this.parent._update_axes_ranges(min([min(chart_data['hist_year']), min(chart_data['proj_year'])]), max([max(chart_data['hist_year']), max(chart_data['proj_year'])]), min([min(chart_data['hist_min']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]), max([max(chart_data['hist_max']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])]));

      Plotly.react(this.element, [{
        name: 'Modeled minimum (historical)',
        x: chart_data['hist_year'],
        y: chart_data['hist_min'],
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        line: {
          color: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
          width: 0,
          opacity: colors.opacity.ann_hist_minmax
        },
        legendgroup: 'hist',
        visible: !!show_historical_modeled ? true : 'legendonly',
        hoverinfo: 'skip'
      }, {
        x: chart_data['hist_year'],
        // y: chart_data['hist_max_diff'],
        y: chart_data['hist_max'],
        name: 'Modeled maximum (historical)',
        type: 'scatter',
        mode: 'lines',
        fill: 'tonexty',
        fillcolor: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
        line: {
          color: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
          width: 0,
          opacity: colors.opacity.ann_hist_minmax
        },
        legendgroup: 'hist',
        visible: !!show_historical_modeled ? true : 'legendonly',
        hoverlabel: {
          namelength: 0
        },
        // hoverinfo: 'text',
        customdata: hover_decadal_means ? hist_decadal_data : hist_mod_data,
        hovertemplate: "%{customdata[0]}".concat(hover_decadal_means ? 's' : '', " modeled range: %{customdata[2]:.1f}&#8211;%{customdata[3]:.1f}")
      }, // {
      //   x: chart_data['hist_year'],
      //   y: chart_data['hist_mean'],
      //   type: 'scatter',
      //   mode: 'lines',
      //   name: 'Historical Mean',
      //   line: {color: '#000000'},
      //   legendgroup: 'hist',
      //   visible: !!show_historical_modeled ? true : 'legendonly',
      // },
      {
        x: chart_data['proj_year'],
        y: chart_data['rcp45_min'],
        name: 'Modeled minimum (RCP 4.5 projection)',
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        fillcolor: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp45',
        visible: show_projected_rcp45 ? true : 'legendonly',
        hoverinfo: 'skip'
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp45_max'],
        name: 'Modeled maximum (RCP 4.5 projection)',
        fill: 'tonexty',
        type: 'scatter',
        mode: 'lines',
        fillcolor: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp45',
        visible: show_projected_rcp45 ? true : 'legendonly',
        hoverlabel: {
          namelength: 0
        },
        customdata: hover_decadal_means ? rcp45_decadal_data : proj_mod_data,
        hovertemplate: "(range: %{customdata[2]:.1f}&#8211;%{customdata[3]:.1f})"
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp85_min'],
        name: 'Modeled minimum (RCP 8.5 projection)',
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        fillcolor: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp85',
        visible: show_projected_rcp85 ? true : 'legendonly',
        showlegend: false,
        hoverinfo: 'skip'
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp85_max'],
        name: 'Modeled maximum (RCP 8.5 projection)',
        fill: 'tonexty',
        type: 'scatter',
        mode: 'lines',
        fillcolor: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp85',
        visible: show_projected_rcp85 ? true : 'legendonly',
        hoverlabel: {
          namelength: 0
        },
        customdata: hover_decadal_means ? rcp85_decadal_data : proj_mod_data,
        hovertemplate: "(range: %{customdata[2]:.1f}&#8211;%{customdata[3]:.1f})"
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp45_mean'],
        type: 'scatter',
        mode: 'lines',
        name: 'RCP 4.5 projections (weighted mean)',
        line: {
          color: rgba(colors.rcp45.line, colors.opacity.proj_line)
        },
        visible: show_projected_rcp45 ? true : 'legendonly',
        legendgroup: 'rcp45',
        yaxis: 'y3',
        hoverlabel: {
          namelength: 0
        },
        customdata: hover_decadal_means ? rcp45_decadal_data : proj_mod_data,
        hovertemplate: "%{customdata[0]}".concat(hover_decadal_means ? 's' : '', " lower emissions average projection: <b>%{customdata[1]:.1f}</b>")
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp85_mean'],
        type: 'scatter',
        mode: 'lines',
        name: 'Modeled mean (RCP 8.5 projections, weighted)',
        visible: show_projected_rcp85 ? true : 'legendonly',
        line: {
          color: rgba(colors.rcp85.line, colors.opacity.proj_line)
        },
        legendgroup: 'rcp85',
        yaxis: 'y3',
        hoverlabel: {
          namelength: 0
        },
        customdata: hover_decadal_means ? rcp85_decadal_data : proj_mod_data,
        hovertemplate: "%{customdata[0]}".concat(hover_decadal_means ? 's' : '', " higher emissions average projection: <b>%{customdata[1]:.1f}</b>")
      }, ...decadal_means_traces, ...rolling_means_traces], // layout
      Object.assign({}, plotly_layout_defaults, {
        showlegend: show_legend,
        hoverlabel: {
          namelength: -1
        },
        xaxis: this.parent._get_x_axis_layout(x_range_min, x_range_max),
        yaxis: this.parent._get_y_axis_layout(y_range_min, y_range_max, variable_config),
        yaxis2: {
          type: 'linear',
          matches: 'y',
          overlaying: 'y',
          showline: false,
          showgrid: false,
          showticklabels: false,
          nticks: 0
        },
        yaxis3: {
          type: 'linear',
          matches: 'y',
          overlaying: 'y',
          showline: false,
          showgrid: false,
          showticklabels: false,
          nticks: 0
        }
      }), // options
      this.parent._get_plotly_options());
      this._when_chart = new Promise(resolve => {
        this.element.once('plotly_afterplot', gd => {
          resolve(gd);
        });
      });
      await this._when_chart;

      this.parent._hide_spinner();
    }

    async request_style_update() {
      const {
        show_decadal_means,
        show_historical_modeled,
        show_projected_rcp45,
        show_projected_rcp85,
        show_rolling_window_means
      } = this.parent.options;
      let visible_traces = [!!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', // !!show_historical_modeled ? true : 'legendonly',
      !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly'];

      if (show_decadal_means) {
        visible_traces.push(!!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly');
      } // cleanup hidden decadal traces
      else if (!!this.element && !!this.element.data && this.element.data.find(trace => trace['name'].includes('decadal'))) {
          visible_traces.push(false, false, false, false, false, false, false, false, false);
        }

      if (show_rolling_window_means) {
        visible_traces.push(!!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly');
      } // cleanup hidden rolling window traces
      else if (!!this.element && !!this.element.data && this.element.data.find(trace => trace['name'].includes('rolling'))) {
          visible_traces.push(false, false, false, false, false, false, false, false, false);
        }

      Plotly.restyle(this.element, {
        visible: visible_traces
      });
    }
    /**
     * Options which force re-evaluation of which traces are visible within the current view.
     * @return {string[]}
     * @private
     */


    get style_option_names() {
      return ['show_projected_rcp45', 'show_projected_rcp85', 'show_historical_modeled', 'show_decadal_means', 'show_rolling_window_means'];
    }

    async request_downloads() {
      const {
        get_area_label,
        frequency,
        variable
      } = this.parent.options;
      return [{
        label: 'Historical Modeled Data',
        icon: 'area-chart',
        attribution: 'ACIS: LOCA (CMIP 5)',
        when_data: this._download_callbacks['hist_mod'],
        filename: [get_area_label.bind(this)(), frequency, "hist_mod", variable].join('-').replace(/ /g, '_') + '.csv'
      }, {
        label: 'Historical Modeled Data',
        icon: 'area-chart',
        attribution: 'ACIS: LOCA (CMIP 5)',
        when_data: this._download_callbacks['hist_mod'],
        filename: [get_area_label.bind(this)(), frequency, "hist_mod", variable].join('-').replace(/ /g, '_') + '.csv'
      }, {
        label: 'Projected Modeled Data',
        icon: 'area-chart',
        attribution: 'ACIS: LOCA (CMIP 5)',
        when_data: this._download_callbacks['proj_mod'],
        filename: [get_area_label.bind(this)(), frequency, "proj_mod", variable].join('-').replace(/ /g, '_') + '.csv'
      }, {
        label: 'Chart image',
        icon: 'picture-o',
        attribution: 'ACIS: Livneh & LOCA (CMIP 5)',
        when_data: async () => {
          let {
            width,
            height
          } = window.getComputedStyle(this.element);
          width = Number.parseFloat(width) * 1.2;
          height = Number.parseFloat(height) * 1.2;
          return await Plotly.toImage(this.element, {
            format: 'png',
            width: width,
            height: height
          });
        },
        filename: [get_area_label.bind(this)(), frequency, variable, "graph"].join('-').replace(/[^A-Za-z0-9\-]/g, '_') + '.png'
      }];
    }

    destroy() {
      super.destroy(); //cleanup style

      const _style_idx = this.parent._styles.indexOf(this._style);

      if (_style_idx > -1) {
        this.parent._styles.splice(_style_idx, 1);
      }

      this.parent._update_styles();
    }

  }

  /* globals jQuery, window, Plotly, fetch, jStat */
  // noinspection DuplicatedCode

  class IslandYearView extends View {
    async request_update() {
      const {
        variable,
        unitsystem,
        show_decadal_means,
        hover_decadal_means,
        colors,
        show_rolling_window_means,
        show_historical_modeled,
        show_projected_rcp45,
        show_projected_rcp85,
        rolling_window_mean_years,
        show_legend,
        plotly_layout_defaults
      } = this.parent.options;
      const area = this.parent.get_area();
      const variable_config = this.parent.get_variable_config();
      let data = await fetch_island_data(variable, area, island_data_url_template);
      let hist_mod_series = data.find(series => series.scenario === 'historical');
      let rcp45_mod_series = data.find(series => series.scenario === 'rcp45');
      let rcp85_mod_series = data.find(series => series.scenario === 'rcp85');
      const unit_conversion_fn = variable_config.unit_conversions[unitsystem]; // reshape hist data to an array of [[year,mean,min,max], ...] (to match how update_annual_conus shapes it's data)

      const hist_sdate_year = Number.parseInt(hist_mod_series.sdate.substr(0, 4));
      let hist_mod_data = hist_mod_series.annual_data.all_mean.reduce((_data, v, i) => {
        _data.push([hist_sdate_year + i, unit_conversion_fn(v), unit_conversion_fn(hist_mod_series.annual_data.all_min[i]), unit_conversion_fn(hist_mod_series.annual_data.all_max[i])]);

        return _data;
      }, []); // reshape proj data to an array of [[year,rcp45mean,rcp45min,rcp45max,rcp85mean,rcp85min,rcp85max], ...] (to match how update_annual_conus shapes it's data)

      const proj_sdate_year = Number.parseInt(rcp45_mod_series.sdate.substr(0, 4));
      let proj_mod_data = rcp45_mod_series.annual_data.all_mean.reduce((_data, v, i) => {
        _data.push([proj_sdate_year + i, unit_conversion_fn(v), unit_conversion_fn(rcp45_mod_series.annual_data.all_min[i]), unit_conversion_fn(rcp45_mod_series.annual_data.all_max[i]), unit_conversion_fn(rcp85_mod_series.annual_data.all_mean[i]), unit_conversion_fn(rcp85_mod_series.annual_data.all_min[i]), unit_conversion_fn(rcp85_mod_series.annual_data.all_max[i])]);

        return _data;
      }, []); // format download data.

      this._download_callbacks['hist_obs'] = async () => format_export_data(['year', 'mean', 'min', 'max'], hist_mod_data);

      this._download_callbacks['proj_mod'] = async () => format_export_data(['year', 'rcp45_mean', 'rcp45_min', 'rcp45_max', 'rcp85_mean', 'rcp85_min', 'rcp85_max'], proj_mod_data);

      const chart_data = {
        'hist_year': [],
        'hist_mean': [],
        'hist_min': [],
        'hist_max': [],
        'hist_max_diff': [],
        'proj_year': [],
        'rcp45_mean': [],
        'rcp45_min': [],
        'rcp45_max': [],
        'rcp85_mean': [],
        'rcp85_min': [],
        'rcp85_max': [],
        'hist_year_decade': [],
        'hist_decadal_mean': [],
        'hist_decadal_min': [],
        'hist_decadal_max': [],
        'proj_year_decade': [],
        'rcp45_decadal_mean': [],
        'rcp45_decadal_min': [],
        'rcp45_decadal_max': [],
        'rcp85_decadal_mean': [],
        'rcp85_decadal_min': [],
        'rcp85_decadal_max': [],
        'hist_rolling_mean': [],
        'hist_rolling_min': [],
        'hist_rolling_max': [],
        'rcp45_rolling_mean': [],
        'rcp45_rolling_min': [],
        'rcp45_rolling_max': [],
        'rcp85_rolling_mean': [],
        'rcp85_rolling_min': [],
        'rcp85_rolling_max': []
      };
      const precision = 1;
      let decadal_means_traces = [];
      let hist_decadal_data = [];
      let rcp45_decadal_data = [];
      let rcp85_decadal_data = [];

      if (show_decadal_means || hover_decadal_means) {
        const hist_stat_annual_values = [...hist_mod_data.map(a => [a[0], null, null, null, a[1], a[2], a[3]]), ...proj_mod_data.slice(0, 4)];
        const scenario_stat_annual_values = [...hist_mod_data.slice(-6).map(a => [a[0], a[1], a[2], a[3], a[1], a[2], a[3]]), ...proj_mod_data.slice(0, -1)]; // compute decadal averages for proj

        for (let i = 0; i < proj_mod_data.length; i++) {
          chart_data['proj_year_decade'][i] = Math.trunc(proj_mod_data[i][0] / 10) * 10;
        }

        for (let i = 0; i < hist_mod_data.length; i++) {
          chart_data['hist_year_decade'][i] = Math.trunc(hist_mod_data[i][0] / 10) * 10;
        }

        for (const [scenario, scenario_col_offset] of [['rcp45', 0], ['rcp85', 3]]) {
          for (const [stat, col_offset] of [['mean', 1], ['min', 2], ['max', 3]]) {
            const decadal_means = compute_decadal_means(scenario_stat_annual_values, 0, scenario_col_offset + col_offset, 2005, 2099);

            for (let i = 0; i < proj_mod_data.length + 1; i++) {
              chart_data[scenario + '_decadal_' + stat][i] = decadal_means[Math.floor((10 + i - 5) / 10)];
            } // compute decadal averages for hist using extra values from rcp85


            if (scenario === 'rcp85') {
              const hist_decadal_means = compute_decadal_means(hist_stat_annual_values, 0, scenario_col_offset + col_offset, 1950, 2004);

              for (let i = 0; i < hist_mod_data.length; i++) {
                chart_data['hist_decadal_' + stat][i] = hist_decadal_means[Math.floor(i / 10)];
              }
            }
          }
        }

        if (hover_decadal_means) {
          hist_decadal_data = range(hist_mod_data.length).map(i => [chart_data['hist_year_decade'][i], chart_data['hist_decadal_mean'][i], chart_data['hist_decadal_min'][i], chart_data['hist_decadal_max'][i]]);
          rcp45_decadal_data = range(proj_mod_data.length).map(i => [chart_data['proj_year_decade'][i], chart_data['rcp45_decadal_mean'][i], chart_data['rcp45_decadal_min'][i], chart_data['rcp45_decadal_max'][i]]);
          rcp45_decadal_data.unshift(hist_decadal_data.slice(-1)[0]);
          rcp85_decadal_data = range(proj_mod_data.length).map(i => [chart_data['proj_year_decade'][i], chart_data['rcp85_decadal_mean'][i], chart_data['rcp85_decadal_min'][i], chart_data['rcp85_decadal_max'][i]]);
          rcp85_decadal_data.unshift(hist_decadal_data.slice(-1)[0]);
        }

        if (show_decadal_means) {
          decadal_means_traces = [{
            name: 'Modeled maximum (historical decadal mean)',
            x: chart_data['hist_year'],
            y: chart_data['hist_decadal_max'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.hist.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_historical_modeled ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled mean (historical decadal mean)',
            x: chart_data['hist_year'],
            y: chart_data['hist_decadal_mean'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.hist.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_historical_modeled ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled minimum (historical decadal mean)',
            x: chart_data['hist_year'],
            y: chart_data['hist_decadal_min'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.hist.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_historical_modeled ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled maximum (RCP 4.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp45_decadal_max'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp45.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp45 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled minimum (RCP 4.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp45_decadal_min'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp45.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp45 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled mean (RCP 4.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp45_decadal_mean'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp45.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp45 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled maximum (RCP 8.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp85_decadal_max'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp85.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp85 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled minimum (RCP 8.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp85_decadal_min'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp85.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp85 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }, {
            name: 'Modeled mean (RCP 8.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp85_decadal_mean'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {
              color: rgba(colors.rcp85.outerBand, 1),
              width: 1.3,
              opacity: 1
            },
            visible: !!show_projected_rcp85 ? true : 'legendonly',
            customdata: null,
            hovertemplate: '%{y:.1f}'
          }];
        }
      }

      let rolling_means_traces = [];

      if (show_rolling_window_means) {
        const hist_stat_annual_values = [...range(rolling_window_mean_years).map(x => [1950 - (rolling_window_mean_years - x), Number.NaN, Number.NaN, Number.NaN, Number.NaN, Number.NaN, Number.NaN]), ...hist_mod_data.map(a => [a[0], null, null, null, a[1], a[2], a[3]])];
        const scenario_stat_annual_values = [...hist_mod_data.slice(-rolling_window_mean_years - 1).map(a => [a[0], a[1], a[2], a[3], a[1], a[2], a[3]]), ...proj_mod_data.slice(0, -1)]; // compute rolling window means for proj

        for (const [scenario, scenario_col_offset] of [['rcp45', 0], ['rcp85', 3]]) {
          for (const [stat, col_offset] of [['mean', 1], ['min', 2], ['max', 3]]) {
            chart_data[scenario + '_rolling_' + stat] = compute_rolling_window_means(scenario_stat_annual_values, 0, scenario_col_offset + col_offset, 2005, 2099, rolling_window_mean_years).slice(rolling_window_mean_years);

            if (scenario === 'rcp85') {
              chart_data['hist_rolling_' + stat] = compute_rolling_window_means(hist_stat_annual_values, 0, scenario_col_offset + col_offset, 1950, 2004, rolling_window_mean_years).slice(rolling_window_mean_years);
            }
          }
        }

        rolling_means_traces = [{
          name: "Modeled maximum (historical ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['hist_year'],
          y: chart_data['hist_rolling_max'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.hist.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_historical_modeled ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled mean (historical ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['hist_year'],
          y: chart_data['hist_rolling_mean'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.hist.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_historical_modeled ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled minimum (historical ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['hist_year'],
          y: chart_data['hist_rolling_min'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.hist.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_historical_modeled ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled maximum (RCP 4.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp45_rolling_max'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp45.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp45 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled minimum (RCP 4.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp45_rolling_min'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp45.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp45 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled mean (RCP 4.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp45_rolling_mean'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp45.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp45 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled maximum (RCP 8.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp85_rolling_max'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp85.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp85 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled minimum (RCP 8.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp85_rolling_min'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp85.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp85 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }, {
          name: "Modeled mean (RCP 8.5 ".concat(rolling_window_mean_years, "-yr rolling window mean)"),
          x: chart_data['proj_year'],
          y: chart_data['rcp85_rolling_mean'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.rcp85.outerBand, 1),
            width: 1.3,
            opacity: 1
          },
          visible: !!show_projected_rcp85 ? true : 'legendonly',
          customdata: null,
          hovertemplate: '%{y:.1f}'
        }];
      }

      for (let i = 0; i < hist_mod_data.length; i++) {
        chart_data['hist_year'].push(hist_mod_data[i][0]);
        chart_data['hist_mean'].push(hist_mod_data[i][1]);
        chart_data['hist_min'].push(hist_mod_data[i][2]);
        chart_data['hist_max'].push(hist_mod_data[i][3]);
      } // repeat 2005 data point to fill gap


      proj_mod_data.unshift([hist_mod_data[hist_mod_data.length - 1][0], round(hist_mod_data[hist_mod_data.length - 1][1], precision), round(hist_mod_data[hist_mod_data.length - 1][2], precision), round(hist_mod_data[hist_mod_data.length - 1][3], precision), round(hist_mod_data[hist_mod_data.length - 1][1], precision), round(hist_mod_data[hist_mod_data.length - 1][2], precision), round(hist_mod_data[hist_mod_data.length - 1][3], precision)]);

      for (let i = 0; i < proj_mod_data.length; i++) {
        chart_data['proj_year'].push(proj_mod_data[i][0]);
        chart_data['rcp45_mean'].push(round(proj_mod_data[i][1], precision));
        chart_data['rcp45_min'].push(round(proj_mod_data[i][2], precision));
        chart_data['rcp45_max'].push(round(proj_mod_data[i][3], precision));
        chart_data['rcp85_mean'].push(round(proj_mod_data[i][4], precision));
        chart_data['rcp85_min'].push(round(proj_mod_data[i][5], precision));
        chart_data['rcp85_max'].push(round(proj_mod_data[i][6], precision));
      }

      const [x_range_min, x_range_max, y_range_min, y_range_max] = this.parent._update_axes_ranges(min([min(chart_data['hist_year']), min(chart_data['proj_year'])]), max([max(chart_data['hist_year']), max(chart_data['proj_year'])]), min([min(chart_data['hist_min']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]), max([max(chart_data['hist_max']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])]));

      Plotly.react(this.element, [{
        name: 'Modeled minimum (historical)',
        x: chart_data['hist_year'],
        y: chart_data['hist_min'],
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        line: {
          color: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
          width: 0,
          opacity: colors.opacity.ann_hist_minmax
        },
        legendgroup: 'hist',
        visible: !!show_historical_modeled ? true : 'legendonly',
        hoverinfo: 'skip'
      }, {
        x: chart_data['hist_year'],
        // y: chart_data['hist_max_diff'],
        y: chart_data['hist_max'],
        name: 'Modeled maximum (historical)',
        type: 'scatter',
        mode: 'lines',
        fill: 'tonexty',
        fillcolor: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
        line: {
          color: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
          width: 0,
          opacity: colors.opacity.ann_hist_minmax
        },
        legendgroup: 'hist',
        visible: !!show_historical_modeled ? true : 'legendonly',
        // hovertemplate: "%{text}",
        hoverlabel: {
          namelength: 0
        },
        text: chart_data['hist_year'].map((year, i) => "Range of hindcast values for the ".concat(Math.trunc(year / 10), "0s: <b>").concat(round(chart_data['hist_decadal_min'][i], 1), "</b> - <b>").concat(round(chart_data['hist_decadal_max'][i], 1), "</b>")),
        // hoverinfo: 'text',
        customdata: hover_decadal_means ? hist_decadal_data : hist_mod_data,
        hovertemplate: hover_decadal_means ? "Range of hindcast values for %{customdata[0]}s: <b>%{customdata[2]:.1f}</b> - <b>%{customdata[3]:.1f}</b>" : "Range of hindcast values for %{customdata[0]}: <b>%{customdata[2]:.1f}</b> - <b>%{customdata[3]:.1f}</b>"
      }, // {
      //   x: chart_data['hist_year'],
      //   y: chart_data['hist_mean'],
      //   type: 'scatter',
      //   mode: 'lines',
      //   name: 'Historical Mean',
      //   line: {color: '#000000'},
      //   legendgroup: 'hist',
      //   visible: !!show_historical_modeled ? true : 'legendonly',
      // },
      {
        x: chart_data['proj_year'],
        y: chart_data['rcp45_min'],
        name: 'Modeled minimum (RCP 4.5 projection)',
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        fillcolor: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp45',
        visible: show_projected_rcp45 ? true : 'legendonly',
        // customdata: null,
        // hovertemplate: "<extra></extra>",
        hoverinfo: 'skip'
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp45_max'],
        name: 'Modeled maximum (RCP 4.5 projection)',
        fill: 'tonexty',
        type: 'scatter',
        mode: 'lines',
        fillcolor: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp45',
        visible: show_projected_rcp45 ? true : 'legendonly',
        // customdata: proj_mod_data,
        // hovertemplate: "(%{customdata[2]:.1f} - %{customdata[3]:.1f})<extra></extra>"
        hoverlabel: {
          namelength: 0
        },
        // text: chart_data['proj_year'].map((year, i) => `Range of projections for lower emissions for ${Math.trunc(year / 10)}0s: <b>${round(chart_data['rcp45_decadal_min'][i], 1)}</b> - <b>${round(chart_data['rcp45_decadal_max'][i], 1)}</b>`),
        // hoverinfo: 'text',
        customdata: hover_decadal_means ? rcp45_decadal_data : proj_mod_data,
        hovertemplate: hover_decadal_means ? "Range of projections for lower emissions for %{customdata[0]}s: <b>%{customdata[2]:.1f}</b> - <b>%{customdata[3]:.1f}</b>" : "Range of projections for lower emissions for %{customdata[0]}: <b>%{customdata[2]:.1f}</b> - <b>%{customdata[3]:.1f}</b>"
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp85_min'],
        name: 'Modeled minimum (RCP 8.5 projection)',
        type: 'scatter',
        mode: 'lines',
        fill: 'none',
        fillcolor: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp85',
        visible: show_projected_rcp85 ? true : 'legendonly',
        showlegend: false,
        // customdata: null,
        // hovertemplate: "<extra></extra>",
        hoverinfo: 'skip'
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp85_max'],
        name: 'Modeled maximum (RCP 8.5 projection)',
        fill: 'tonexty',
        type: 'scatter',
        mode: 'lines',
        fillcolor: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
        line: {
          color: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
          width: 0,
          opacity: colors.opacity.ann_proj_minmax
        },
        legendgroup: 'rcp85',
        visible: show_projected_rcp85 ? true : 'legendonly',
        hoverlabel: {
          namelength: 0
        },
        customdata: hover_decadal_means ? rcp85_decadal_data : proj_mod_data,
        hovertemplate: hover_decadal_means ? "Range of projections for higher emissions for %{customdata[0]}s: <b>%{customdata[2]:.1f}</b> - <b>%{customdata[3]:.1f}</b>" : "Range of projections for higher emissions for %{customdata[0]}: <b>%{customdata[5]:.1f}</b> - <b>%{customdata[6]:.1f}</b>"
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp45_mean'],
        type: 'scatter',
        mode: 'lines',
        name: 'RCP 4.5 projections (weighted mean)',
        line: {
          color: rgba(colors.rcp45.line, colors.opacity.proj_line)
        },
        visible: show_projected_rcp45 ? true : 'legendonly',
        legendgroup: 'rcp45',
        yaxis: 'y3',
        hoverlabel: {
          namelength: 0
        },
        customdata: hover_decadal_means ? rcp45_decadal_data : proj_mod_data,
        hovertemplate: hover_decadal_means ? "Range of projections for lower emissions for %{customdata[0]}s: <b>%{customdata[1]:.1f}</b>" : "Projected average for lower emissions for %{customdata[0]}: <b>%{customdata[1]:.1f}</b>"
      }, {
        x: chart_data['proj_year'],
        y: chart_data['rcp85_mean'],
        type: 'scatter',
        mode: 'lines',
        name: 'Modeled mean (RCP 8.5 projections, weighted)',
        visible: show_projected_rcp85 ? true : 'legendonly',
        line: {
          color: rgba(colors.rcp85.line, colors.opacity.proj_line)
        },
        legendgroup: 'rcp85',
        yaxis: 'y3',
        // customdata: null,
        // hovertemplate: "RCP 8.5: <b>%{y:.1f}</b><extra></extra>"
        hoverlabel: {
          namelength: 0
        },
        // text: chart_data['proj_year'].map((year, i) => `Projected average for higher emissions for ${Math.trunc(year / 10)}0s: <b>${round(chart_data['rcp45_decadal_mean'][i], 1)}</b>`),
        // hoverinfo: 'text',
        customdata: hover_decadal_means ? rcp85_decadal_data : proj_mod_data,
        hovertemplate: hover_decadal_means ? "Range of projections for higher emissions for %{customdata[0]}s: <b>%{customdata[1]:.1f}</b>" : "Projected average for higher emissions for %{customdata[0]}: <b>%{customdata[1]:.1f}</b>"
      }, ...decadal_means_traces, ...rolling_means_traces], // layout
      Object.assign({}, plotly_layout_defaults, {
        showlegend: show_legend,
        xaxis: this.parent._get_x_axis_layout(x_range_min, x_range_max),
        yaxis: this.parent._get_y_axis_layout(y_range_min, y_range_max, variable_config),
        yaxis2: {
          type: 'linear',
          matches: 'y',
          overlaying: 'y',
          showline: false,
          showgrid: false,
          showticklabels: false,
          nticks: 0
        },
        yaxis3: {
          type: 'linear',
          matches: 'y',
          overlaying: 'y',
          showline: false,
          showgrid: false,
          showticklabels: false,
          nticks: 0
        }
      }), // options
      this.parent._get_plotly_options());

      this._update_visibility = () => {
        let visible_traces = [!!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', // !!show_historical_modeled ? true : 'legendonly',
        !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly'];

        if (show_decadal_means) {
          visible_traces.push(!!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly');
        } // cleanup hidden decadal traces
        else if (!!this.element && !!this.element.data && this.element.data.find(trace => trace['name'].includes('decadal'))) {
            visible_traces.push(false, false, false, false, false, false, false, false, false);
          }

        if (show_rolling_window_means) {
          visible_traces.push(!!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_historical_modeled ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp45 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly', !!show_projected_rcp85 ? true : 'legendonly');
        } // cleanup hidden rolling window traces
        else if (!!this.element && !!this.element.data && this.element.data.find(trace => trace['name'].includes('rolling'))) {
            visible_traces.push(false, false, false, false, false, false, false, false, false);
          }

        Plotly.restyle(this.element, {
          visible: visible_traces
        });
      };

      this._when_chart = new Promise(resolve => {
        this.element.once('plotly_afterplot', gd => {
          resolve(gd);
        });
      });
      await this._when_chart;

      this.parent._hide_spinner();
    }
    /**
     * Options which force re-evaluation of which traces are visible within the current view.
     * @return {string[]}
     * @private
     */


    get style_option_names() {
      return ['show_projected_rcp45', 'show_projected_rcp85', 'show_historical_modeled', 'show_decadal_means', 'show_rolling_window_means'];
    }

    async request_downloads() {
      const {
        get_area_label,
        frequency,
        variable
      } = this.parent.options;
      return [{
        label: 'Historical Modeled Data',
        icon: 'area-chart',
        attribution: 'ACIS: LOCA (CMIP 5)',
        when_data: this._download_callbacks['hist_mod'],
        filename: [get_area_label.bind(this)(), frequency, "hist_mod", variable].join('-').replace(/ /g, '_') + '.csv'
      }, {
        label: 'Projected Modeled Data',
        icon: 'area-chart',
        attribution: 'ACIS: LOCA (CMIP 5)',
        when_data: this._download_callbacks['proj_mod'],
        filename: [get_area_label.bind(this)(), frequency, "proj_mod", variable].join('-').replace(/ /g, '_') + '.csv'
      }, {
        label: 'Chart image',
        icon: 'picture-o',
        attribution: 'ACIS: Livneh & LOCA (CMIP 5)',
        when_data: async () => {
          let {
            width,
            height
          } = window.getComputedStyle(this.element);
          width = Number.parseFloat(width) * 1.2;
          height = Number.parseFloat(height) * 1.2;
          return await Plotly.toImage(this.element, {
            format: 'png',
            width: width,
            height: height
          });
        },
        filename: [get_area_label.bind(this)(), frequency, variable, "graph"].join('-').replace(/[^A-Za-z0-9\-]/g, '_') + '.png'
      }];
    }

  }

  /**
   * Modules and customizations bundled for Climate Explorer
   */
  class ClimateByLocationComplete extends ClimateByLocationWidget$1 {
    get_view_class() {
      if (!!this.options.area_id && !!this.options.variable && !!this.options.frequency) {
        if (this.options.frequency === "annual") {
          if (is_ak_area(this.options.area_id)) {
            return AlaskaYearView;
          } else if (is_island_area(this.options.area_id)) {
            if (!!this.options.show_decadal_means && !this.options.show_annual_values) {
              return IslandDecadeView;
            } else {
              return IslandYearView;
            }
          } else if (is_conus_area(this.options.area_id) || is_usfs_forest_area(this.options.area_id) || is_usfs_forest_ecoregion_area(this.options.area_id)) {
            if (!!this.options.show_decadal_means && !this.options.show_annual_values) {
              return ConusDecadeView;
            } else {
              return ConusYearView;
            }
          }
        }

        if (this.options.frequency === "monthly") {
          if (is_ak_area(this.options.area_id)) ; else if (is_island_area(this.options.area_id)) {
            return IslandMonthView;
          } else if (is_conus_area(this.options.area_id) || is_usfs_forest_area(this.options.area_id) || is_usfs_forest_ecoregion_area(this.options.area_id)) {
            return ConusMonthView;
          }
        }
      }

      throw new Error('Invalid Climate By Location configuration! No view matches the current configuration.');
    }
    /**
     * Options which force re-evaluation of which view class should be used and request that view to fully update.
     * @return {string[]}
     * @private
     */


    get _view_selection_option_names() {
      return ['frequency', 'area_id', 'variable', 'monthly_timeperiod', 'show_decadal_means', 'show_rolling_window_means', 'rolling_window_mean_years'];
    }

  }

  if (typeof window.ClimateByLocationWidget === "undefined") {
    window.ClimateByLocationWidget = ClimateByLocationComplete;
  }

  exports.ClimateByLocationComplete = ClimateByLocationComplete;
  exports.default = ClimateByLocationComplete;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
