(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ClimateByLocationWidget = factory());
}(this, (function () { 'use strict';

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function unfetch(url, options) {
  	options = options || {};
  	return new Promise( (resolve, reject) => {
  		const request = new XMLHttpRequest();
  		const keys = [];
  		const all = [];
  		const headers = {};

  		const response = () => ({
  			ok: (request.status/100|0) == 2,		// 200-299
  			statusText: request.statusText,
  			status: request.status,
  			url: request.responseURL,
  			text: () => Promise.resolve(request.responseText),
  			json: () => Promise.resolve(JSON.parse(request.responseText)),
  			blob: () => Promise.resolve(new Blob([request.response])),
  			clone: response,
  			headers: {
  				keys: () => keys,
  				entries: () => all,
  				get: n => headers[n.toLowerCase()],
  				has: n => n.toLowerCase() in headers
  			}
  		});

  		request.open(options.method || 'get', url, true);

  		request.onload = () => {
  			request.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, (m, key, value) => {
  				keys.push(key = key.toLowerCase());
  				all.push([key, value]);
  				headers[key] = headers[key] ? `${headers[key]},${value}` : value;
  			});
  			resolve(response());
  		};

  		request.onerror = reject;

  		request.withCredentials = options.credentials=='include';

  		for (const i in options.headers) {
  			request.setRequestHeader(i, options.headers[i]);
  		}

  		request.send(options.body || null);
  	});
  }

  if (!self.fetch) self.fetch = unfetch;

  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  !(function(global) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    var inModule = typeof module === "object";
    var runtime = global.regeneratorRuntime;
    if (runtime) {
      if (inModule) {
        // If regeneratorRuntime is defined globally and we're in a module,
        // make the exports object identical to regeneratorRuntime.
        module.exports = runtime;
      }
      // Don't bother evaluating the rest of this file if the runtime was
      // already defined globally.
      return;
    }

    // Define the runtime globally (as expected by generated code) as either
    // module.exports (if we're in a module) or a new, empty object.
    runtime = global.regeneratorRuntime = inModule ? module.exports : {};

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    runtime.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] =
      GeneratorFunction.displayName = "GeneratorFunction";

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        prototype[method] = function(arg) {
          return this._invoke(method, arg);
        };
      });
    }

    runtime.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    runtime.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    runtime.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return Promise.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return Promise.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration. If the Promise is rejected, however, the
            // result for this iteration will be rejected with the same
            // reason. Note that rejections of yielded Promises are not
            // thrown back into the generator function, as is the case
            // when an awaited Promise is rejected. This difference in
            // behavior between yield and await is important, because it
            // allows the consumer to decide what to do with the yielded
            // rejection (swallow it and continue, manually .throw it back
            // into the generator, abandon iteration, whatever). With
            // await, by contrast, there is no opportunity to examine the
            // rejection reason outside the generator function, so the
            // only option is to throw it from the await expression, and
            // let the generator function handle the exception.
            result.value = unwrapped;
            resolve(result);
          }, reject);
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new Promise(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    runtime.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    runtime.async = function(innerFn, outerFn, self, tryLocsList) {
      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList)
      );

      return runtime.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          if (delegate.iterator.return) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    Gp[toStringTagSymbol] = "Generator";

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function() {
      return this;
    };

    Gp.toString = function() {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    runtime.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    runtime.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };
  })(
    // In sloppy mode, unbound `this` refers to the global object, fallback to
    // Function constructor if we're in global strict mode. That is sadly a form
    // of indirect eval which violates Content Security Policy.
    (function() { return this })() || Function("return this")()
  );

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Built-in value references. */
  var Symbol$1 = root.Symbol;

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
  var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

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
  var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

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
  var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
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
  var objectProto$3 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

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
    if (!(hasOwnProperty$2.call(object, key) && eq(objValue, value)) ||
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
  var nativeMax = Math.max;

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
    start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
    return function() {
      var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
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
  var objectProto$4 = Object.prototype;

  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */
  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$4;

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
  var objectProto$5 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$3 = objectProto$5.hasOwnProperty;

  /** Built-in value references. */
  var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;

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
    return isObjectLike(value) && hasOwnProperty$3.call(value, 'callee') &&
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
  var objectProto$6 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

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
      if ((inherited || hasOwnProperty$4.call(value, key)) &&
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
  var objectProto$7 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

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
      if (hasOwnProperty$5.call(object, key) && key != 'constructor') {
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
  var objectProto$8 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

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
      if (!(key == 'constructor' && (isProto || !hasOwnProperty$6.call(object, key)))) {
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
  var objectProto$9 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

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
    return hasOwnProperty$7.call(data, key) ? data[key] : undefined;
  }

  /** Used for built-in method references. */
  var objectProto$a = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

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
    return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$8.call(data, key);
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
  var FUNC_ERROR_TEXT = 'Expected a function';

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
      throw new TypeError(FUNC_ERROR_TEXT);
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
      objectProto$b = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$2 = funcProto$2.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$9 = objectProto$b.hasOwnProperty;

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
    var Ctor = hasOwnProperty$9.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor &&
      funcToString$2.call(Ctor) == objectCtorString;
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeIsFinite = root.isFinite,
      nativeMin = Math.min;

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
      precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
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
  var objectProto$c = Object.prototype;

  /** Built-in value references. */
  var propertyIsEnumerable$1 = objectProto$c.propertyIsEnumerable;

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
  var Uint8Array = root.Uint8Array;

  /**
   * Creates a clone of `arrayBuffer`.
   *
   * @private
   * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array(result).set(new Uint8Array(arrayBuffer));
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
  var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : undefined,
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
            !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
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
  var objectProto$d = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$a = objectProto$d.hasOwnProperty;

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
      if (!(isPartial ? key in other : hasOwnProperty$a.call(other, key))) {
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
  var objectProto$e = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$b = objectProto$e.hasOwnProperty;

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
      var objIsWrapped = objIsObj && hasOwnProperty$b.call(object, '__wrapped__'),
          othIsWrapped = othIsObj && hasOwnProperty$b.call(other, '__wrapped__');

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
  var nativeMax$1 = Math.max;

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
      index = nativeMax$1(length + index, 0);
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

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeCeil = Math.ceil,
      nativeMax$2 = Math.max;

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
        length = nativeMax$2(nativeCeil((end - start) / (step || 1)), 0),
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

  var all_areas = null;
  var _when_areas = null;
  /* globals jQuery, window, Plotly, fetch */

  var ClimateByLocationWidget = /*#__PURE__*/function () {
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
     * @param {boolean} options.show_historical_observed - Whether or not to show historical observed data if available.
     * @param {boolean} options.show_historical_modeled - Whether or not to show historical modeled data if available.
     * @param {boolean} options.show_projected_rcp45 - Whether or not to show projected modeled RCP4.5 data if available.
     * @param {boolean} options.show_projected_rcp85 - Whether or not to show projected modeled RCP8.5 data if available.
     * @param {boolean} options.responsive - Whether or not to listen to window resize events and auto-resize the graph. Can only be set on instantiation.
     */
    function ClimateByLocationWidget(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, ClimateByLocationWidget);

      this.options = {
        // default values:
        area_id: null,
        unitsystem: "english",
        variable: "tmax",
        frequency: "annual",
        monthly_timeperiod: "2025",
        x_axis_range: null,
        y_axis_range: null,
        data_api_endpoint: 'https://grid2.rcc-acis.org/GridData',
        island_data_url_template: 'island_data/{area_id}.json',
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
        responsive: true
      };
      this.options = merge(this.options, options);

      if (typeof element === "string") {
        element = document.querySelector(this.element);
      } else if (!!jQuery && element instanceof jQuery) {
        element = element[0];
      }

      this.element = element;

      if (!this.element) {
        console.log('Climate By Location widget created with no element. Nothing will be displayed.');
      }

      this.downloadable_dataurls = null;
      this.element.innerHTML = "<div class='graph' style='width: 100%; height: 100%;'></div>";
      this.graphdiv = this.element.querySelector('div.graph');
      /** @type {function} */

      this._update_visibility = null;
      /** @var _when_chart {Promise} - Promise for the most recent plotly graph. */

      this._when_chart = null;
      this.update();

      if (this.options.responsive) {
        window.addEventListener('resize', this.resize.bind(this));
      }
    }
    /*
     * Public instance methods
     */

    /**
     * Gets the variable config object for the currently selected variable.
     * @return {*}
     */


    _createClass(ClimateByLocationWidget, [{
      key: "get_variable_config",
      value: function get_variable_config() {
        var _this = this;

        return find(ClimateByLocationWidget._variables, function (c) {
          return c.id === _this.options.variable;
        });
      }
      /**
       * Gets the county or state that is currently selected.
       */

    }, {
      key: "get_area_label",
      value: function get_area_label() {
        return get(this.get_area(), 'area_label', null) || this.options.area_id;
      }
      /**
       * Gets the area object for the area that is currently selected.
       * @return {{area_id, area_label, area_type, state}}
       */

    }, {
      key: "get_area",
      value: function get_area() {
        return get(ClimateByLocationWidget.get_areas(null, null, this.options.area_id), 0, null);
      }
    }, {
      key: "set_options",
      value: function set_options(options) {
        var old_options = Object.assign({}, this.options);
        this.options = merge({}, old_options, options);

        ClimateByLocationWidget._bool_options.forEach(function (option) {
          if (typeof options[option] === "string") {
            options[option] = options[option].toLowerCase() === "true";
          }
        });

        if (!get(ClimateByLocationWidget, ['_frequencies', this.options.frequency, 'supports_area'], function () {
          return true;
        })(this.options.area_id)) {
          this.options.frequency = ClimateByLocationWidget.get_variables(this.options.area_id)[0].id;
        }

        if (!get(ClimateByLocationWidget, ['variables', this.options.variable, 'supports_area'], function () {
          return true;
        })(this.options.area_id)) {
          this.options.variable = ClimateByLocationWidget.get_variables(this.options.frequency, null, this.options.area_id)[0].id;
        } // if frequency, state, county, or variable changed, trigger a larger update cycle (new data + plots maybe changed):


        if (this.options.frequency !== old_options.frequency || this.options.area_id !== old_options.area_id || this.options.variable !== old_options.variable || this.options.monthly_timeperiod !== old_options.monthly_timeperiod) {
          this.update();
        } else {
          if ((this.options.show_projected_rcp45 !== old_options.show_projected_rcp45 || this.options.show_projected_rcp85 !== old_options.show_projected_rcp85 || this.options.show_historical_observed !== old_options.show_historical_observed || this.options.show_historical_modeled !== old_options.show_historical_modeled) && this._update_visibility !== null) {
            this._update_visibility();
          }

          if (this.options.x_axis_range !== old_options.x_axis_range) {
            this.set_x_axis_range.apply(this, _toConsumableArray(this.options.x_axis_range));
          }
        }

        return this;
      }
      /**
       * This function will set the range of data visible on the graph's x-axis without refreshing the rest of the graph.
       *
       * @param min
       * @param max
       * @returns {boolean}
       */

    }, {
      key: "set_x_axis_range",
      value: function set_x_axis_range(min, max) {
        return (this.options.x_axis_range = [min, max]) && Plotly.relayout(this.graphdiv, {
          'xaxis.range': this.options.x_axis_range
        }) && this.options.x_axis_range;
      }
      /**
       * Requests the widget update according to its current options. Use `set_options()` to change options instead.
       * @returns {Promise<void>}
       */

    }, {
      key: "update",
      value: function () {
        var _update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  this._show_spinner();

                  this._reset_downloadable_dataurls(); // todo re-implement plot clearing?
                  // this.hide_all_plots();


                  if (!(!!this.options.area_id && !!this.options.variable && !!this.options.frequency)) {
                    _context.next = 29;
                    break;
                  }

                  if (!(this.options.frequency === "annual")) {
                    _context.next = 18;
                    break;
                  }

                  if (!ClimateByLocationWidget.is_ak_area(this.options.area_id)) {
                    _context.next = 9;
                    break;
                  }

                  _context.next = 7;
                  return this._update_annual_ak();

                case 7:
                  _context.next = 16;
                  break;

                case 9:
                  if (!ClimateByLocationWidget.is_island_area(this.options.area_id)) {
                    _context.next = 14;
                    break;
                  }

                  _context.next = 12;
                  return this._update_annual_island();

                case 12:
                  _context.next = 16;
                  break;

                case 14:
                  _context.next = 16;
                  return this._update_annual_conus();

                case 16:
                  _context.next = 29;
                  break;

                case 18:
                  if (!(this.options.frequency === "monthly")) {
                    _context.next = 29;
                    break;
                  }

                  if (!ClimateByLocationWidget.is_ak_area(this.options.area_id)) {
                    _context.next = 22;
                    break;
                  }

                  _context.next = 29;
                  break;

                case 22:
                  if (!ClimateByLocationWidget.is_island_area(this.options.area_id)) {
                    _context.next = 27;
                    break;
                  }

                  _context.next = 25;
                  return this._update_monthly_island();

                case 25:
                  _context.next = 29;
                  break;

                case 27:
                  _context.next = 29;
                  return this._update_monthly_conus();

                case 29:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function update() {
          return _update.apply(this, arguments);
        }

        return update;
      }()
      /**
       * Registers an event handler for the specified event. Equivalent to `instance.element.addEventListener(type, listener)`
       */

    }, {
      key: "on",
      value: function on(type, listener) {
        return this.element.addEventListener(type, listener);
      }
      /**
       * Forces chart to resize.
       */

    }, {
      key: "resize",
      value: function resize() {
        var _this2 = this;

        window.requestAnimationFrame(function () {
          Plotly.relayout(_this2.graphdiv, {
            'xaxis.autorange': true,
            'yaxis.autorange': true
          });
        });
      }
      /**
       * Generates an image of the chart and downloads it.
       * @returns {Promise}
       */

    }, {
      key: "download_image",
      value: function download_image() {
        var _window$getComputedSt = window.getComputedStyle(this.element),
            width = _window$getComputedSt.width,
            height = _window$getComputedSt.height;

        width = Number.parseFloat(width) * 1.2;
        height = Number.parseFloat(height) * 1.2;
        return Plotly.downloadImage(this.graphdiv, {
          format: 'png',
          width: width,
          height: height,
          filename: [this.options.get_area_label.bind(this)(), this.options.frequency, this.options.variable, "graph"].join('-').replace(/[^A-Za-z0-9\-]/g, '_') + '.png'
        });
      }
      /**
       * Transform an anchor element to download the historic observed data. Return false on failure / no data.
       * @param link
       * @returns {boolean}
       */

    }, {
      key: "download_hist_obs_data",
      value: function download_hist_obs_data(link) {
        if (!this.downloadable_dataurls.hist_obs) {
          link.href = '#nodata';
          return false;
        }

        link.href = this.downloadable_dataurls.hist_obs;
        link.download = [this.options.get_area_label.bind(this)(), this.options.frequency, "hist_obs", this.options.variable].join('-').replace(/ /g, '_') + '.csv';
        return true;
      }
      /**
       * Transform an anchor element to download the historic modelled data. Return false on failure / no data.
       * @param link
       * @returns {boolean}
       */

    }, {
      key: "download_hist_mod_data",
      value: function download_hist_mod_data(link) {
        if (!this.downloadable_dataurls.hist_mod) {
          link.href = '#nodata';
          return false;
        }

        link.href = this.downloadable_dataurls.hist_mod;
        link.download = [this.options.get_area_label.bind(this)(), this.options.frequency, "hist_mod", this.options.variable].join('-').replace(/ /g, '_') + '.csv';
        return true;
      }
      /**
       * Transform an anchor element to download the projected modelled data. Return false on failure / no data.
       * @param link
       * @returns {boolean}
       */

    }, {
      key: "download_proj_mod_data",
      value: function download_proj_mod_data(link) {
        if (!this.downloadable_dataurls.proj_mod) {
          link.href = '#nodata';
          return false;
        }

        link.href = this.downloadable_dataurls.proj_mod;
        link.download = [this.options.get_area_label.bind(this)(), this.options.frequency, "proj_mod", this.options.variable].join('-').replace(/ /g, '_') + '.csv';
        return true;
      }
      /*
       * Private methods
       */

    }, {
      key: "_update_annual_conus",
      value: function () {
        var _update_annual_conus2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
          var _this3 = this;

          var _yield$Promise$all, _yield$Promise$all2, hist_obs_data, hist_mod_data, proj_mod_data, variable_config, chart_data, precision, i, hist_obs_bar_base, _i, _i2, _i3, _this$_update_axes_ra, _this$_update_axes_ra2, x_range_min, x_range_max, y_range_min, y_range_max;

          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return Promise.all([this._get_historical_observed_livneh_data(), this._get_historical_annual_loca_model_data(), this._get_projected_loca_model_data()]);

                case 2:
                  _yield$Promise$all = _context2.sent;
                  _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 3);
                  hist_obs_data = _yield$Promise$all2[0];
                  hist_mod_data = _yield$Promise$all2[1];
                  proj_mod_data = _yield$Promise$all2[2];
                  variable_config = this.get_variable_config();
                  this.downloadable_dataurls.hist_obs = this._format_export_data(['year', variable_config.id], hist_obs_data);
                  this.downloadable_dataurls.hist_mod = this._format_export_data(['year', 'weighted_mean', 'min', 'max'], hist_mod_data);
                  this.downloadable_dataurls.proj_mod = this._format_export_data(['year', 'rcp45_weighted_mean', 'rcp45_min', 'rcp45_max', 'rcp85_weighted_mean', 'rcp85_min', 'rcp85_max'], proj_mod_data); // unpack arrays

                  chart_data = {
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
                    'rcp85_max': []
                  };
                  precision = 1;

                  for (i = 0; i < hist_obs_data.length; i++) {
                    chart_data['hist_obs_year'].push(round(hist_obs_data[i][0], precision));
                    chart_data['hist_obs'].push(round(hist_obs_data[i][1], precision));

                    if (1961 <= hist_obs_data[i][0] <= 1990) {
                      chart_data['hist_obs_base'].push(round(hist_obs_data[i][1], precision));
                    }
                  }

                  hist_obs_bar_base = mean(chart_data['hist_obs_base']);

                  for (_i = 0; _i < hist_obs_data.length; _i++) {
                    chart_data['hist_obs_diff'].push(round(hist_obs_data[_i][1] - hist_obs_bar_base, precision));
                  }

                  for (_i2 = 0; _i2 < hist_mod_data.length; _i2++) {
                    chart_data['hist_year'].push(hist_mod_data[_i2][0]);
                    chart_data['hist_mean'].push(round(hist_mod_data[_i2][1], precision));
                    chart_data['hist_min'].push(round(hist_mod_data[_i2][2], precision));
                    chart_data['hist_max'].push(round(hist_mod_data[_i2][3], precision));
                  } // repeat 2005 data point to fill gap


                  chart_data['proj_year'].push(hist_mod_data[hist_mod_data.length - 1][0]);
                  chart_data['rcp45_mean'].push(round(hist_mod_data[hist_mod_data.length - 1][1], precision));
                  chart_data['rcp45_min'].push(round(hist_mod_data[hist_mod_data.length - 1][2], precision));
                  chart_data['rcp45_max'].push(round(hist_mod_data[hist_mod_data.length - 1][3], precision));
                  chart_data['rcp85_mean'].push(round(hist_mod_data[hist_mod_data.length - 1][1], precision));
                  chart_data['rcp85_min'].push(round(hist_mod_data[hist_mod_data.length - 1][2], precision));
                  chart_data['rcp85_max'].push(round(hist_mod_data[hist_mod_data.length - 1][3], precision));

                  for (_i3 = 0; _i3 < proj_mod_data.length; _i3++) {
                    chart_data['proj_year'].push(proj_mod_data[_i3][0]);
                    chart_data['rcp45_mean'].push(round(proj_mod_data[_i3][1], precision));
                    chart_data['rcp45_min'].push(round(proj_mod_data[_i3][2], precision));
                    chart_data['rcp45_max'].push(round(proj_mod_data[_i3][3], precision));
                    chart_data['rcp85_mean'].push(round(proj_mod_data[_i3][4], precision));
                    chart_data['rcp85_min'].push(round(proj_mod_data[_i3][5], precision));
                    chart_data['rcp85_max'].push(round(proj_mod_data[_i3][6], precision));
                  }

                  _this$_update_axes_ra = this._update_axes_ranges(min([min(chart_data['hist_year']), min(chart_data['proj_year'])]), max([max(chart_data['hist_year']), max(chart_data['proj_year'])]), min([min(chart_data['hist_min']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]), max([max(chart_data['hist_max']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])])), _this$_update_axes_ra2 = _slicedToArray(_this$_update_axes_ra, 4), x_range_min = _this$_update_axes_ra2[0], x_range_max = _this$_update_axes_ra2[1], y_range_min = _this$_update_axes_ra2[2], y_range_max = _this$_update_axes_ra2[3];
                  Plotly.react(this.graphdiv, [{
                    name: 'Modeled minimum (historical)',
                    x: chart_data['hist_year'],
                    y: chart_data['hist_min'],
                    type: 'scatter',
                    mode: 'lines',
                    fill: 'none',
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_hist_minmax
                    },
                    legendgroup: 'hist',
                    visible: !!this.options.show_historical_modeled ? true : 'legendonly'
                  }, {
                    x: chart_data['hist_year'],
                    // y: chart_data['hist_max_diff'],
                    y: chart_data['hist_max'],
                    // text: chart_data['hist_max'],
                    // hoverinfo: 'text',
                    name: 'Modeled maximum (historical)',
                    type: 'scatter',
                    mode: 'lines',
                    fill: 'tonexty',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_hist_minmax
                    },
                    legendgroup: 'hist',
                    visible: !!this.options.show_historical_modeled ? true : 'legendonly'
                  }, // {
                  //   x: chart_data['hist_year'],
                  //   y: chart_data['hist_mean'],
                  //   type: 'scatter',
                  //   mode: 'lines',
                  //   name: 'Historical Mean',
                  //   line: {color: '#000000'},
                  //   legendgroup: 'hist',
                  //   visible: !!this.options.show_historical_modeled ? true : 'legendonly',
                  // },
                  {
                    x: chart_data['proj_year'],
                    y: chart_data['rcp45_min'],
                    name: 'Modeled minimum (RCP 4.5 projection)',
                    type: 'scatter',
                    mode: 'lines',
                    fill: 'none',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_proj_minmax
                    },
                    legendgroup: 'rcp45',
                    visible: this.options.show_projected_rcp45 ? true : 'legendonly'
                  }, {
                    x: chart_data['proj_year'],
                    y: chart_data['rcp45_max'],
                    name: 'Modeled maximum (RCP 4.5 projection)',
                    fill: 'tonexty',
                    type: 'scatter',
                    mode: 'lines',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_proj_minmax
                    },
                    legendgroup: 'rcp45',
                    visible: this.options.show_projected_rcp45 ? true : 'legendonly'
                  }, {
                    x: chart_data['proj_year'],
                    y: chart_data['rcp85_min'],
                    name: 'Modeled minimum (RCP 8.5 projection)',
                    type: 'scatter',
                    mode: 'lines',
                    fill: 'none',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_proj_minmax
                    },
                    legendgroup: 'rcp85',
                    visible: this.options.show_projected_rcp85 ? true : 'legendonly'
                  }, {
                    x: chart_data['proj_year'],
                    y: chart_data['rcp85_max'],
                    name: 'Modeled maximum (RCP 8.5 projection)',
                    fill: 'tonexty',
                    type: 'scatter',
                    mode: 'lines',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_proj_minmax
                    },
                    legendgroup: 'rcp85',
                    visible: this.options.show_projected_rcp85 ? true : 'legendonly'
                  }, {
                    x: chart_data['hist_obs_year'],
                    y: chart_data['hist_obs_diff'],
                    type: 'bar',
                    yaxis: 'y2',
                    base: hist_obs_bar_base,
                    name: 'Historical Observed',
                    line: {
                      color: this.options.colors.hist.line,
                      width: 0.5
                    },
                    marker: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.hist.bar, this.options.colors.opacity.hist_obs)
                    },
                    legendgroup: 'histobs',
                    visible: !!this.options.show_historical_observed ? true : 'legendonly'
                  }, {
                    x: chart_data['proj_year'],
                    y: chart_data['rcp45_mean'],
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Modeled mean (RCP 4.5 projections, weighted)',
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.line, this.options.colors.opacity.proj_line)
                    },
                    visible: this.options.show_projected_rcp45 ? true : 'legendonly',
                    legendgroup: 'rcp45',
                    yaxis: 'y3'
                  }, {
                    x: chart_data['proj_year'],
                    y: chart_data['rcp85_mean'],
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Modeled mean (RCP 8.5 projections, weighted)',
                    visible: this.options.show_projected_rcp85 ? true : 'legendonly',
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.line, this.options.colors.opacity.proj_line)
                    },
                    legendgroup: 'rcp85',
                    yaxis: 'y3'
                  }], // layout
                  {
                    autosize: true,
                    margin: {
                      l: 50,
                      t: 12,
                      r: 12,
                      b: 60
                    },
                    showlegend: this.options.show_legend,
                    legend: {
                      "orientation": "h"
                    },
                    xaxis: this._get_x_axis_layout(x_range_min, x_range_max),
                    yaxis: this._get_y_axis_layout(y_range_min, y_range_max, variable_config),
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
                  }, // options
                  this._get_plotly_options());

                  this._update_visibility = function () {
                    Plotly.restyle(_this3.graphdiv, {
                      visible: [!!_this3.options.show_historical_modeled ? true : 'legendonly', !!_this3.options.show_historical_modeled ? true : 'legendonly', // !!this.options.show_historical_modeled ? true : 'legendonly',
                      !!_this3.options.show_projected_rcp45 ? true : 'legendonly', !!_this3.options.show_projected_rcp45 ? true : 'legendonly', !!_this3.options.show_projected_rcp85 ? true : 'legendonly', !!_this3.options.show_projected_rcp85 ? true : 'legendonly', !!_this3.options.show_historical_observed ? true : 'legendonly', !!_this3.options.show_projected_rcp45 ? true : 'legendonly', !!_this3.options.show_projected_rcp85 ? true : 'legendonly']
                    });
                  };

                  this._when_chart = new Promise(function (resolve) {
                    _this3.graphdiv.on('plotly_afterplot', function (gd) {
                      resolve(gd);
                    });
                  });

                  this._when_chart.then(this._hide_spinner.bind(this));

                case 30:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function _update_annual_conus() {
          return _update_annual_conus2.apply(this, arguments);
        }

        return _update_annual_conus;
      }()
    }, {
      key: "_update_annual_ak",
      value: function () {
        var _update_annual_ak2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
          var _this4 = this;

          var hist_sdate_year, hist_edate_year, proj_edate_year, variable_config, _this$options, variable, frequency, area_id, unit_conversion_fn, _yield$Promise$all3, _yield$Promise$all4, _yield$Promise$all4$, gfdl_cm3_rcp85_years, gfdl_cm3_rcp85, _yield$Promise$all4$2, ncar_ccsm4_rcp85_years, ncar_ccsm4_rcp85, hist_mod_data, proj_mod_data, rolling_window, i, _i4, chart_data, precision, _i5, _i6, _this$_update_axes_ra3, _this$_update_axes_ra4, x_range_min, x_range_max, y_range_min, y_range_max;

          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  // get data for GFDL-CM3 and NCAR-CCSM4
                  hist_sdate_year = 1970; // let hist_sdate = hist_sdate_year + '-01-01';

                  hist_edate_year = 2005; // let hist_edate = hist_edate_year + '-12-31';

                  proj_edate_year = 2099;
                  variable_config = this.get_variable_config();
                  _this$options = this.options, variable = _this$options.variable, frequency = _this$options.frequency, area_id = _this$options.area_id;
                  unit_conversion_fn = variable_config.unit_conversions[this.options.unitsystem];
                  _context3.next = 8;
                  return Promise.all([this._fetch_acis_data('snap:GFDL-CM3:rcp85', hist_sdate_year, proj_edate_year, variable, frequency, area_id, unit_conversion_fn), this._fetch_acis_data('snap:NCAR-CCSM4:rcp85', hist_sdate_year, proj_edate_year, variable, frequency, area_id, unit_conversion_fn)]);

                case 8:
                  _yield$Promise$all3 = _context3.sent;
                  _yield$Promise$all4 = _slicedToArray(_yield$Promise$all3, 2);
                  _yield$Promise$all4$ = _slicedToArray(_yield$Promise$all4[0], 2);
                  gfdl_cm3_rcp85_years = _yield$Promise$all4$[0];
                  gfdl_cm3_rcp85 = _yield$Promise$all4$[1];
                  _yield$Promise$all4$2 = _slicedToArray(_yield$Promise$all4[1], 2);
                  ncar_ccsm4_rcp85_years = _yield$Promise$all4$2[0];
                  ncar_ccsm4_rcp85 = _yield$Promise$all4$2[1];

                  if (!(!isEqual(gfdl_cm3_rcp85_years, ncar_ccsm4_rcp85_years) || Number.parseInt(gfdl_cm3_rcp85_years[0]) !== hist_sdate_year || Number.parseInt(ncar_ccsm4_rcp85_years[0]) !== hist_sdate_year || Number.parseInt(gfdl_cm3_rcp85_years[gfdl_cm3_rcp85_years.length - 1]) !== proj_edate_year || Number.parseInt(ncar_ccsm4_rcp85_years[ncar_ccsm4_rcp85_years.length - 1]) !== proj_edate_year)) {
                    _context3.next = 18;
                    break;
                  }

                  throw new Error("Unexpected annual data!");

                case 18:
                  // split into hist mod vs proj mod
                  hist_mod_data = [];
                  proj_mod_data = [];
                  rolling_window = 10;

                  for (i = 0; i < hist_edate_year - hist_sdate_year + 1; i++) {
                    //year,gfdl_cm3_rcp85,ncar_ccsm4_rcp85
                    hist_mod_data.push([i + hist_sdate_year, ClimateByLocationWidget._rolling_window_average(gfdl_cm3_rcp85, i), ClimateByLocationWidget._rolling_window_average(ncar_ccsm4_rcp85, i)]);
                  }

                  for (_i4 = hist_edate_year - hist_sdate_year; _i4 <= proj_edate_year - hist_sdate_year + 1; _i4++) {
                    //year,gfdl_cm3_rcp85,ncar_ccsm4_rcp85
                    proj_mod_data.push([_i4 + hist_sdate_year, ClimateByLocationWidget._rolling_window_average(gfdl_cm3_rcp85, _i4), ClimateByLocationWidget._rolling_window_average(ncar_ccsm4_rcp85, _i4)]);
                  }

                  this.downloadable_dataurls.hist_mod = this._format_export_data(['year', 'gfdl_cm3_rcp85', 'ncar_ccsm4_rcp85', "*Note that the values shown have had a ".concat(rolling_window, "-year rolling window average applied.")], hist_mod_data);
                  this.downloadable_dataurls.proj_mod = this._format_export_data(['year', 'gfdl_cm3_rcp85', 'ncar_ccsm4_rcp85', "*Note that the values shown have had a ".concat(rolling_window, "-year rolling window average applied.")], proj_mod_data);
                  chart_data = {
                    'hist_year': [],
                    'hist_min': [],
                    'hist_max': [],
                    'proj_year': [],
                    'rcp85_min': [],
                    'rcp85_max': []
                  };
                  precision = 1;

                  for (_i5 = 0; _i5 < hist_mod_data.length; _i5++) {
                    chart_data['hist_year'].push(hist_mod_data[_i5][0]);
                    chart_data['hist_min'].push(round(Math.min(hist_mod_data[_i5][1], hist_mod_data[_i5][2]), precision));
                    chart_data['hist_max'].push(round(Math.max(hist_mod_data[_i5][1], hist_mod_data[_i5][2]), precision));
                  } // repeat 2005 data point to fill gap


                  chart_data['proj_year'].push(hist_mod_data[hist_mod_data.length - 1][0]);
                  chart_data['rcp85_min'].push(round(Math.min(hist_mod_data[hist_mod_data.length - 1][1], hist_mod_data[hist_mod_data.length - 1][2]), precision));
                  chart_data['rcp85_max'].push(round(Math.max(hist_mod_data[hist_mod_data.length - 1][1], hist_mod_data[hist_mod_data.length - 1][2]), precision));

                  for (_i6 = 0; _i6 < proj_mod_data.length; _i6++) {
                    chart_data['proj_year'].push(proj_mod_data[_i6][0]);
                    chart_data['rcp85_min'].push(round(Math.min(proj_mod_data[_i6][1], proj_mod_data[_i6][2]), precision));
                    chart_data['rcp85_max'].push(round(Math.max(proj_mod_data[_i6][1], proj_mod_data[_i6][2]), precision));
                  }

                  _this$_update_axes_ra3 = this._update_axes_ranges(min([min(chart_data['hist_year']), min(chart_data['proj_year'])]), max([max(chart_data['hist_year']), max(chart_data['proj_year'])]), min([min(chart_data['hist_min']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]), max([max(chart_data['hist_max']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])])), _this$_update_axes_ra4 = _slicedToArray(_this$_update_axes_ra3, 4), x_range_min = _this$_update_axes_ra4[0], x_range_max = _this$_update_axes_ra4[1], y_range_min = _this$_update_axes_ra4[2], y_range_max = _this$_update_axes_ra4[3];
                  Plotly.react(this.graphdiv, [{
                    name: 'Modeled minimum (historical)',
                    x: chart_data['hist_year'],
                    y: chart_data['hist_min'],
                    type: 'scatter',
                    mode: 'lines',
                    fill: 'none',
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_hist_minmax
                    },
                    legendgroup: 'hist',
                    visible: !!this.options.show_historical_modeled ? true : 'legendonly'
                  }, {
                    x: chart_data['hist_year'],
                    y: chart_data['hist_max'],
                    name: 'Modeled maximum (historical)',
                    type: 'scatter',
                    mode: 'lines',
                    fill: 'tonexty',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, 1),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax),
                      width: 0,
                      opacity: 1
                    },
                    legendgroup: 'hist',
                    visible: !!this.options.show_historical_modeled ? true : 'legendonly'
                  }, {
                    x: chart_data['proj_year'],
                    y: chart_data['rcp85_min'],
                    name: 'Modeled minimum (RCP 8.5)',
                    type: 'scatter',
                    mode: 'lines',
                    fill: 'none',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, 1),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
                      width: 0,
                      opacity: 1
                    },
                    legendgroup: 'rcp85',
                    visible: this.options.show_projected_rcp85 ? true : 'legendonly'
                  }, {
                    x: chart_data['proj_year'],
                    y: chart_data['rcp85_max'],
                    name: 'Modeled maximum (RCP 8.5)',
                    fill: 'tonexty',
                    type: 'scatter',
                    mode: 'lines',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, 1),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
                      width: 0,
                      opacity: 1
                    },
                    legendgroup: 'rcp85',
                    visible: this.options.show_projected_rcp85 ? true : 'legendonly'
                  }], // layout
                  {
                    autosize: true,
                    margin: {
                      l: 50,
                      t: 12,
                      r: 12,
                      b: 60
                    },
                    showlegend: this.options.show_legend,
                    legend: {
                      "orientation": "h"
                    },
                    xaxis: this._get_x_axis_layout(x_range_min, x_range_max),
                    yaxis: this._get_y_axis_layout(y_range_min, y_range_max, variable_config)
                  }, // options
                  this._get_plotly_options());

                  this._update_visibility = function () {
                    Plotly.restyle(_this4.graphdiv, {
                      visible: [!!_this4.options.show_historical_modeled ? true : 'legendonly', !!_this4.options.show_historical_modeled ? true : 'legendonly', !!_this4.options.show_projected_rcp85 ? true : 'legendonly', !!_this4.options.show_projected_rcp85 ? true : 'legendonly']
                    });
                  };

                  this._when_chart = new Promise(function (resolve) {
                    _this4.graphdiv.on('plotly_afterplot', function (gd) {
                      resolve(gd);
                    });
                  });

                  this._when_chart.then(this._hide_spinner.bind(this));

                case 37:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function _update_annual_ak() {
          return _update_annual_ak2.apply(this, arguments);
        }

        return _update_annual_ak;
      }()
    }, {
      key: "_update_annual_island",
      value: function () {
        var _update_annual_island2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
          var _this5 = this;

          var data, hist_mod_series, rcp45_mod_series, rcp85_mod_series, variable_config, unit_conversion_fn, hist_sdate_year, hist_mod_data, proj_sdate_year, proj_mod_data, chart_data, precision, i, _i7, _this$_update_axes_ra5, _this$_update_axes_ra6, x_range_min, x_range_max, y_range_min, y_range_max;

          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return this._fetch_island_data(this.options.variable, this.options.area_id);

                case 2:
                  data = _context4.sent;
                  hist_mod_series = data.find(function (series) {
                    return series.scenario === 'historical';
                  });
                  rcp45_mod_series = data.find(function (series) {
                    return series.scenario === 'rcp45';
                  });
                  rcp85_mod_series = data.find(function (series) {
                    return series.scenario === 'rcp85';
                  });
                  variable_config = this.get_variable_config();
                  unit_conversion_fn = variable_config.unit_conversions[this.options.unitsystem]; // reshape hist data to an array of [[year,mean,min,max], ...] (to match how update_annual_conus shapes it's data)

                  hist_sdate_year = Number.parseInt(hist_mod_series.sdate.substr(0, 4));
                  hist_mod_data = hist_mod_series.annual_data.all_mean.reduce(function (_data, v, i) {
                    _data.push([hist_sdate_year + i, unit_conversion_fn(v), unit_conversion_fn(hist_mod_series.annual_data.all_min[i]), unit_conversion_fn(hist_mod_series.annual_data.all_max[i])]);

                    return _data;
                  }, []); // reshape proj data to an array of [[year,rcp45mean,rcp45min,rcp45max,rcp85mean,rcp85min,rcp85max], ...] (to match how update_annual_conus shapes it's data)

                  proj_sdate_year = Number.parseInt(rcp45_mod_series.sdate.substr(0, 4));
                  proj_mod_data = rcp45_mod_series.annual_data.all_mean.reduce(function (_data, v, i) {
                    _data.push([proj_sdate_year + i, unit_conversion_fn(v), unit_conversion_fn(rcp45_mod_series.annual_data.all_min[i]), unit_conversion_fn(rcp45_mod_series.annual_data.all_max[i]), unit_conversion_fn(rcp85_mod_series.annual_data.all_mean[i]), unit_conversion_fn(rcp85_mod_series.annual_data.all_min[i]), unit_conversion_fn(rcp85_mod_series.annual_data.all_max[i])]);

                    return _data;
                  }, []); // format download data.

                  this.downloadable_dataurls.hist_mod = this._format_export_data(['year', 'mean', 'min', 'max'], hist_mod_data);
                  this.downloadable_dataurls.proj_mod = this._format_export_data(['year', 'rcp45_mean', 'rcp45_min', 'rcp45_max', 'rcp85_mean', 'rcp85_min', 'rcp85_max'], proj_mod_data);
                  chart_data = {
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
                    'rcp85_max': []
                  };
                  precision = 1;

                  for (i = 0; i < hist_mod_data.length; i++) {
                    chart_data['hist_year'].push(hist_mod_data[i][0]);
                    chart_data['hist_mean'].push(hist_mod_data[i][1]);
                    chart_data['hist_min'].push(hist_mod_data[i][2]);
                    chart_data['hist_max'].push(hist_mod_data[i][3]);
                  } // repeat 2005 data point to fill gap


                  chart_data['proj_year'].push(hist_mod_data[hist_mod_data.length - 1][0]);
                  chart_data['rcp45_mean'].push(round(hist_mod_data[hist_mod_data.length - 1][1], precision));
                  chart_data['rcp45_min'].push(round(hist_mod_data[hist_mod_data.length - 1][2], precision));
                  chart_data['rcp45_max'].push(round(hist_mod_data[hist_mod_data.length - 1][3], precision));
                  chart_data['rcp85_mean'].push(round(hist_mod_data[hist_mod_data.length - 1][1], precision));
                  chart_data['rcp85_min'].push(round(hist_mod_data[hist_mod_data.length - 1][2], precision));
                  chart_data['rcp85_max'].push(round(hist_mod_data[hist_mod_data.length - 1][3], precision));

                  for (_i7 = 0; _i7 < proj_mod_data.length; _i7++) {
                    chart_data['proj_year'].push(proj_mod_data[_i7][0]);
                    chart_data['rcp45_mean'].push(round(proj_mod_data[_i7][1], precision));
                    chart_data['rcp45_min'].push(round(proj_mod_data[_i7][2], precision));
                    chart_data['rcp45_max'].push(round(proj_mod_data[_i7][3], precision));
                    chart_data['rcp85_mean'].push(round(proj_mod_data[_i7][4], precision));
                    chart_data['rcp85_min'].push(round(proj_mod_data[_i7][5], precision));
                    chart_data['rcp85_max'].push(round(proj_mod_data[_i7][6], precision));
                  }

                  _this$_update_axes_ra5 = this._update_axes_ranges(min([min(chart_data['hist_year']), min(chart_data['proj_year'])]), max([max(chart_data['hist_year']), max(chart_data['proj_year'])]), min([min(chart_data['hist_min']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]), max([max(chart_data['hist_max']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])])), _this$_update_axes_ra6 = _slicedToArray(_this$_update_axes_ra5, 4), x_range_min = _this$_update_axes_ra6[0], x_range_max = _this$_update_axes_ra6[1], y_range_min = _this$_update_axes_ra6[2], y_range_max = _this$_update_axes_ra6[3];
                  Plotly.react(this.graphdiv, [{
                    name: 'Modeled minimum (historical)',
                    x: chart_data['hist_year'],
                    y: chart_data['hist_min'],
                    type: 'scatter',
                    mode: 'lines',
                    fill: 'none',
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_hist_minmax
                    },
                    legendgroup: 'hist',
                    visible: !!this.options.show_historical_modeled ? true : 'legendonly'
                  }, {
                    x: chart_data['hist_year'],
                    // y: chart_data['hist_max_diff'],
                    y: chart_data['hist_max'],
                    // text: chart_data['hist_max'],
                    // hoverinfo: 'text',
                    name: 'Modeled maximum (historical)',
                    type: 'scatter',
                    mode: 'lines',
                    fill: 'tonexty',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_hist_minmax
                    },
                    legendgroup: 'hist',
                    visible: !!this.options.show_historical_modeled ? true : 'legendonly'
                  }, // {
                  //   x: chart_data['hist_year'],
                  //   y: chart_data['hist_mean'],
                  //   type: 'scatter',
                  //   mode: 'lines',
                  //   name: 'Historical Mean',
                  //   line: {color: '#000000'},
                  //   legendgroup: 'hist',
                  //   visible: !!this.options.show_historical_modeled ? true : 'legendonly',
                  // },
                  {
                    x: chart_data['proj_year'],
                    y: chart_data['rcp45_min'],
                    name: 'Modeled minimum (RCP 4.5 projection)',
                    type: 'scatter',
                    mode: 'lines',
                    fill: 'none',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_proj_minmax
                    },
                    legendgroup: 'rcp45',
                    visible: this.options.show_projected_rcp45 ? true : 'legendonly'
                  }, {
                    x: chart_data['proj_year'],
                    y: chart_data['rcp45_max'],
                    name: 'Modeled maximum (RCP 4.5 projection)',
                    fill: 'tonexty',
                    type: 'scatter',
                    mode: 'lines',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_proj_minmax
                    },
                    legendgroup: 'rcp45',
                    visible: this.options.show_projected_rcp45 ? true : 'legendonly'
                  }, {
                    x: chart_data['proj_year'],
                    y: chart_data['rcp85_min'],
                    name: 'Modeled minimum (RCP 8.5 projection)',
                    type: 'scatter',
                    mode: 'lines',
                    fill: 'none',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_proj_minmax
                    },
                    legendgroup: 'rcp85',
                    visible: this.options.show_projected_rcp85 ? true : 'legendonly'
                  }, {
                    x: chart_data['proj_year'],
                    y: chart_data['rcp85_max'],
                    name: 'Modeled maximum (RCP 8.5 projection)',
                    fill: 'tonexty',
                    type: 'scatter',
                    mode: 'lines',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_proj_minmax
                    },
                    legendgroup: 'rcp85',
                    visible: this.options.show_projected_rcp85 ? true : 'legendonly'
                  }, {
                    x: chart_data['proj_year'],
                    y: chart_data['rcp45_mean'],
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Modeled mean (RCP 4.5 projection)',
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.line, this.options.colors.opacity.proj_line)
                    },
                    visible: this.options.show_projected_rcp45 ? true : 'legendonly',
                    legendgroup: 'rcp45'
                  }, {
                    x: chart_data['proj_year'],
                    y: chart_data['rcp85_mean'],
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Modeled mean (RCP 8.5 projection)',
                    visible: this.options.show_projected_rcp85 ? true : 'legendonly',
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.line, this.options.colors.opacity.proj_line)
                    },
                    legendgroup: 'rcp85'
                  }], // layout
                  {
                    autosize: true,
                    margin: {
                      l: 50,
                      t: 12,
                      r: 12,
                      b: 60
                    },
                    showlegend: this.options.show_legend,
                    legend: {
                      "orientation": "h"
                    },
                    xaxis: this._get_x_axis_layout(x_range_min, x_range_max),
                    yaxis: this._get_y_axis_layout(y_range_min, y_range_max, variable_config)
                  }, // options
                  this._get_plotly_options());

                  this._update_visibility = function () {
                    Plotly.restyle(_this5.graphdiv, {
                      visible: [!!_this5.options.show_historical_modeled ? true : 'legendonly', !!_this5.options.show_historical_modeled ? true : 'legendonly', // !!this.options.show_historical_modeled ? true : 'legendonly',
                      !!_this5.options.show_projected_rcp45 ? true : 'legendonly', !!_this5.options.show_projected_rcp45 ? true : 'legendonly', !!_this5.options.show_projected_rcp85 ? true : 'legendonly', !!_this5.options.show_projected_rcp85 ? true : 'legendonly', !!_this5.options.show_projected_rcp45 ? true : 'legendonly', !!_this5.options.show_projected_rcp85 ? true : 'legendonly']
                    });
                  };

                  this._when_chart = new Promise(function (resolve) {
                    _this5.graphdiv.on('plotly_afterplot', function (gd) {
                      resolve(gd);
                    });
                  });

                  this._when_chart.then(this._hide_spinner.bind(this));

                case 30:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function _update_annual_island() {
          return _update_annual_island2.apply(this, arguments);
        }

        return _update_annual_island;
      }()
    }, {
      key: "_update_monthly_conus",
      value: function () {
        var _update_monthly_conus2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
          var _this6 = this;

          var _yield$Promise$all5, _yield$Promise$all6, hist_obs_month_values, proj_mod_month_values, variable_config, hist_obs_sdate_year, hist_obs_edate_year, hist_obs_data, _iterator, _step, month, proj_sdate_year, proj_mod_data, _iterator2, _step2, _month, _month_data, _iterator3, _step3, year_range, year_range_min_idx, _loop, _i9, _arr, chart_data, precision, monthly_timeperiod, col_offset, month_indexes, _i8, _month_indexes, m, _m, _this$_update_axes_ra7, _this$_update_axes_ra8, x_range_min, x_range_max, y_range_min, y_range_max;

          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return Promise.all([this._get_historical_observed_livneh_data(), this._get_projected_loca_model_data()]);

                case 2:
                  _yield$Promise$all5 = _context5.sent;
                  _yield$Promise$all6 = _slicedToArray(_yield$Promise$all5, 2);
                  hist_obs_month_values = _yield$Promise$all6[0];
                  proj_mod_month_values = _yield$Promise$all6[1];
                  variable_config = this.get_variable_config();
                  hist_obs_sdate_year = hist_obs_month_values['01'][0][0];
                  hist_obs_edate_year = hist_obs_month_values['01'][hist_obs_month_values['01'].length - 1][0];
                  hist_obs_data = [];
                  _iterator = _createForOfIteratorHelper(ClimateByLocationWidget._months);

                  try {
                    for (_iterator.s(); !(_step = _iterator.n()).done;) {
                      month = _step.value;
                      hist_obs_data.push([month, mean(hist_obs_month_values[month].map(function (a) {
                        return a[1];
                      }))]);
                    } // reshape from {month: [year, rcp45_mean, rcp45_min, rcp45_max, rcp85_mean, rcp85_min, rcp85_max]} to ['month', '2025_rcp45_mean', '2025_rcp45_min', '2025_rcp45_max', '2025_rcp85_mean', '2025_rcp85_min', '2025_rcp85_max', '2050_rcp45_mean', '2050_rcp45_min', '2050_rcp45_max', '2050_rcp85_mean', '2050_rcp85_min', '2050_rcp85_max', '2075_rcp45_mean', '2075_rcp45_min', '2075_rcp45_max', '2075_rcp85_mean', '2075_rcp85_min', '2075_rcp85_max']

                  } catch (err) {
                    _iterator.e(err);
                  } finally {
                    _iterator.f();
                  }

                  proj_sdate_year = proj_mod_month_values['01'][0][0]; // const proj_edate_year = proj_mod_month_values['01'][proj_mod_month_values['01'].length - 1][0];

                  proj_mod_data = [];
                  _iterator2 = _createForOfIteratorHelper(ClimateByLocationWidget._months);

                  try {
                    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                      _month = _step2.value;
                      _month_data = [];
                      _iterator3 = _createForOfIteratorHelper(ClimateByLocationWidget._monthly_timeperiods);

                      try {
                        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                          year_range = _step3.value;
                          year_range_min_idx = year_range - 15 - proj_sdate_year;

                          _loop = function _loop() {
                            var scenario_column_offset = _arr[_i9];

                            var _loop2 = function _loop2() {
                              var value_i = _arr2[_i10];

                              //mean, min, max
                              _month_data.push(mean(proj_mod_month_values[_month].slice(year_range_min_idx, year_range_min_idx + 30).map(function (a) {
                                return a[1 + scenario_column_offset + value_i];
                              })));
                            };

                            // rcp45, rcp85
                            for (var _i10 = 0, _arr2 = [0, 1, 2]; _i10 < _arr2.length; _i10++) {
                              _loop2();
                            }
                          };

                          for (_i9 = 0, _arr = [0, 3]; _i9 < _arr.length; _i9++) {
                            _loop();
                          }
                        }
                      } catch (err) {
                        _iterator3.e(err);
                      } finally {
                        _iterator3.f();
                      }

                      proj_mod_data.push([_month].concat(_month_data));
                    }
                  } catch (err) {
                    _iterator2.e(err);
                  } finally {
                    _iterator2.f();
                  }

                  this.downloadable_dataurls.hist_obs = this._format_export_data(['month', 'mean', "* Note that the mean is based on monthly data for years  ".concat(hist_obs_sdate_year, "-").concat(hist_obs_edate_year)], hist_obs_data);
                  this.downloadable_dataurls.proj_mod = this._format_export_data(['month', '2025_rcp45_mean', '2025_rcp45_min', '2025_rcp45_max', '2025_rcp85_mean', '2025_rcp85_min', '2025_rcp85_max', '2050_rcp45_mean', '2050_rcp45_min', '2050_rcp45_max', '2050_rcp85_mean', '2050_rcp85_min', '2050_rcp85_max', '2075_rcp45_mean', '2075_rcp45_min', '2075_rcp45_max', '2075_rcp85_mean', '2075_rcp85_min', '2075_rcp85_max'], proj_mod_data);
                  chart_data = {
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
                  precision = 1;
                  monthly_timeperiod = Number.parseInt(this.options.monthly_timeperiod);
                  col_offset = 1 + ClimateByLocationWidget._monthly_timeperiods.indexOf(monthly_timeperiod) * 6; // for some reason unknown to me, the following month cycle is shown.

                  month_indexes = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

                  for (_i8 = 0, _month_indexes = month_indexes; _i8 < _month_indexes.length; _i8++) {
                    m = _month_indexes[_i8];
                    _m = m % 12;
                    chart_data['month'].push(m);
                    chart_data['month_label'].push(ClimateByLocationWidget._months_labels[_m]);
                    chart_data['hist_obs'].push(round(hist_obs_data[_m][1], precision));
                    chart_data['rcp45_mean'].push(round(proj_mod_data[_m][col_offset], precision));
                    chart_data['rcp45_min'].push(round(proj_mod_data[_m][1 + col_offset], precision));
                    chart_data['rcp45_max'].push(round(proj_mod_data[_m][2 + col_offset], precision));
                    chart_data['rcp85_mean'].push(round(proj_mod_data[_m][3 + col_offset], precision));
                    chart_data['rcp85_min'].push(round(proj_mod_data[_m][4 + col_offset], precision));
                    chart_data['rcp85_max'].push(round(proj_mod_data[_m][5 + col_offset], precision));
                  }

                  _this$_update_axes_ra7 = this._update_axes_ranges(month_indexes, month_indexes[month_indexes.length - 1], min([min(chart_data['hist_obs']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]), max([max(chart_data['hist_obs']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])])), _this$_update_axes_ra8 = _slicedToArray(_this$_update_axes_ra7, 4), x_range_min = _this$_update_axes_ra8[0], x_range_max = _this$_update_axes_ra8[1], y_range_min = _this$_update_axes_ra8[2], y_range_max = _this$_update_axes_ra8[3];
                  Plotly.react(this.graphdiv, [{
                    x: chart_data['month'],
                    y: chart_data['rcp45_min'],
                    name: 'Modeled minimum (RCP 4.5 projection)',
                    type: 'scatter',
                    mode: 'lines',
                    fill: 'none',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_proj_minmax
                    },
                    legendgroup: 'rcp45',
                    visible: this.options.show_projected_rcp45 ? true : 'legendonly'
                  }, {
                    x: chart_data['month'],
                    y: chart_data['rcp45_max'],
                    name: 'Modeled maximum (RCP 4.5 projection)',
                    fill: 'tonexty',
                    type: 'scatter',
                    mode: 'lines',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_proj_minmax
                    },
                    legendgroup: 'rcp45',
                    visible: this.options.show_projected_rcp45 ? true : 'legendonly'
                  }, {
                    x: chart_data['month'],
                    y: chart_data['rcp85_min'],
                    name: 'Modeled minimum (RCP 8.5 projection)',
                    type: 'scatter',
                    mode: 'lines',
                    fill: 'none',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_proj_minmax
                    },
                    legendgroup: 'rcp85',
                    visible: this.options.show_projected_rcp85 ? true : 'legendonly'
                  }, {
                    x: chart_data['month'],
                    y: chart_data['rcp85_max'],
                    name: 'Modeled maximum (RCP 8.5 projection)',
                    fill: 'tonexty',
                    type: 'scatter',
                    mode: 'lines',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_proj_minmax
                    },
                    legendgroup: 'rcp85',
                    visible: this.options.show_projected_rcp85 ? true : 'legendonly'
                  }, {
                    x: chart_data['month'],
                    y: chart_data['hist_obs'],
                    type: 'scatter',
                    mode: 'lines',
                    name: "Observed History (".concat(hist_obs_sdate_year, "-").concat(hist_obs_edate_year, " monthly mean)"),
                    line: {
                      color: this.options.colors.hist.line
                    },
                    legendgroup: 'histobs',
                    visible: !!this.options.show_historical_observed ? true : 'legendonly'
                  }, {
                    x: chart_data['month'],
                    y: chart_data['rcp45_mean'],
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Modeled mean (RCP 4.5 projection)',
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.line, this.options.colors.opacity.proj_line)
                    },
                    visible: this.options.show_projected_rcp45 ? true : 'legendonly',
                    legendgroup: 'rcp45'
                  }, {
                    x: chart_data['month'],
                    y: chart_data['rcp85_mean'],
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Modeled mean (RCP 8.5 projection)',
                    visible: this.options.show_projected_rcp85 ? true : 'legendonly',
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.line, this.options.colors.opacity.proj_line)
                    },
                    legendgroup: 'rcp85'
                  }], // layout
                  {
                    autosize: true,
                    margin: {
                      l: 50,
                      t: 12,
                      r: 12,
                      b: 60
                    },
                    showlegend: this.options.show_legend,
                    legend: {
                      "orientation": "h"
                    },
                    xaxis: Object.assign(this._get_x_axis_layout(x_range_min, x_range_max), {
                      tickmode: 'array',
                      tickvals: month_indexes,
                      ticktext: chart_data['month_label']
                    }),
                    yaxis: this._get_y_axis_layout(y_range_min, y_range_max, variable_config)
                  }, // options
                  this._get_plotly_options());

                  this._update_visibility = function () {
                    Plotly.restyle(_this6.graphdiv, {
                      visible: [!!_this6.options.show_historical_modeled ? true : 'legendonly', !!_this6.options.show_historical_modeled ? true : 'legendonly', !!_this6.options.show_projected_rcp45 ? true : 'legendonly', !!_this6.options.show_projected_rcp45 ? true : 'legendonly', !!_this6.options.show_projected_rcp85 ? true : 'legendonly', !!_this6.options.show_projected_rcp85 ? true : 'legendonly', !!_this6.options.show_projected_rcp45 ? true : 'legendonly', !!_this6.options.show_projected_rcp85 ? true : 'legendonly']
                    });
                  };

                  this._when_chart = new Promise(function (resolve) {
                    _this6.graphdiv.on('plotly_afterplot', function (gd) {
                      resolve(gd);
                    });
                  });

                  this._when_chart.then(this._hide_spinner.bind(this));

                case 29:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function _update_monthly_conus() {
          return _update_monthly_conus2.apply(this, arguments);
        }

        return _update_monthly_conus;
      }()
    }, {
      key: "_update_monthly_island",
      value: function () {
        var _update_monthly_island2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
          var _this7 = this;

          var data, hist_mod_series, rcp45_mod_series, rcp85_mod_series, variable_config, unit_conversion_fn, hist_mod_data, _iterator4, _step4, month, proj_sdate_year, proj_mod_data, _iterator5, _step5, _month2, _month_data2, _iterator6, _step6, year_range, _year_range_min_idx, _i12, _arr3, scenario_monthly_data, _i13, _arr4, value_name, chart_data, precision, monthly_timeperiod, col_offset, month_indexes, _i11, _month_indexes2, m, _m, _this$_update_axes_ra9, _this$_update_axes_ra10, x_range_min, x_range_max, y_range_min, y_range_max;

          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.next = 2;
                  return this._fetch_island_data(this.options.variable, this.options.area_id);

                case 2:
                  data = _context6.sent;
                  hist_mod_series = data.find(function (series) {
                    return series.scenario === 'historical';
                  });
                  rcp45_mod_series = data.find(function (series) {
                    return series.scenario === 'rcp45';
                  });
                  rcp85_mod_series = data.find(function (series) {
                    return series.scenario === 'rcp85';
                  });
                  variable_config = this.get_variable_config();
                  unit_conversion_fn = variable_config.unit_conversions[this.options.unitsystem];
                  hist_mod_data = [];
                  _iterator4 = _createForOfIteratorHelper(ClimateByLocationWidget._months);

                  try {
                    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                      month = _step4.value;
                      //year,mean,min,max
                      hist_mod_data.push([month, unit_conversion_fn(mean(hist_mod_series.monthly_data.all_mean[month])), unit_conversion_fn(mean(hist_mod_series.monthly_data.all_min[month])), unit_conversion_fn(mean(hist_mod_series.monthly_data.all_max[month]))]);
                    }
                  } catch (err) {
                    _iterator4.e(err);
                  } finally {
                    _iterator4.f();
                  }

                  proj_sdate_year = Number.parseInt(rcp85_mod_series.sdate.substr(0, 4));
                  proj_mod_data = [];
                  _iterator5 = _createForOfIteratorHelper(ClimateByLocationWidget._months);

                  try {
                    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                      _month2 = _step5.value;
                      _month_data2 = [];
                      _iterator6 = _createForOfIteratorHelper(ClimateByLocationWidget._monthly_timeperiods);

                      try {
                        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                          year_range = _step6.value;
                          _year_range_min_idx = year_range - 15 - proj_sdate_year;

                          for (_i12 = 0, _arr3 = [rcp45_mod_series.monthly_data, rcp85_mod_series.monthly_data]; _i12 < _arr3.length; _i12++) {
                            scenario_monthly_data = _arr3[_i12];

                            for (_i13 = 0, _arr4 = ['mean', 'min', 'max']; _i13 < _arr4.length; _i13++) {
                              value_name = _arr4[_i13];

                              _month_data2.push(unit_conversion_fn(mean(scenario_monthly_data['all_' + value_name][_month2].slice(_year_range_min_idx, _year_range_min_idx + 30))));
                            }
                          }
                        }
                      } catch (err) {
                        _iterator6.e(err);
                      } finally {
                        _iterator6.f();
                      }

                      proj_mod_data.push([_month2].concat(_month_data2));
                    }
                  } catch (err) {
                    _iterator5.e(err);
                  } finally {
                    _iterator5.f();
                  }

                  this.downloadable_dataurls.hist_mod = this._format_export_data(['year', 'mean', 'min', 'max'], hist_mod_data);
                  this.downloadable_dataurls.proj_mod = this._format_export_data(['month', '2025_rcp45_mean', '2025_rcp45_min', '2025_rcp45_max', '2025_rcp85_mean', '2025_rcp85_min', '2025_rcp85_max', '2050_rcp45_mean', '2050_rcp45_min', '2050_rcp45_max', '2050_rcp85_mean', '2050_rcp85_min', '2050_rcp85_max', '2075_rcp45_mean', '2075_rcp45_min', '2075_rcp45_max', '2075_rcp85_mean', '2075_rcp85_min', '2075_rcp85_max'], proj_mod_data);
                  chart_data = {
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
                  precision = 1;
                  monthly_timeperiod = Number.parseInt(this.options.monthly_timeperiod);
                  col_offset = 1 + ClimateByLocationWidget._monthly_timeperiods.indexOf(monthly_timeperiod) * 6; // for some reason unknown to me, the following month cycle is shown.

                  month_indexes = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

                  for (_i11 = 0, _month_indexes2 = month_indexes; _i11 < _month_indexes2.length; _i11++) {
                    m = _month_indexes2[_i11];
                    _m = m % 12;
                    chart_data['month'].push(m);
                    chart_data['month_label'].push(ClimateByLocationWidget._months_labels[_m]);
                    chart_data['hist_min'].push(round(hist_mod_data[_m][1], precision));
                    chart_data['hist_max'].push(round(hist_mod_data[_m][2], precision));
                    chart_data['rcp45_mean'].push(round(proj_mod_data[_m][col_offset], precision));
                    chart_data['rcp45_min'].push(round(proj_mod_data[_m][1 + col_offset], precision));
                    chart_data['rcp45_max'].push(round(proj_mod_data[_m][2 + col_offset], precision));
                    chart_data['rcp85_mean'].push(round(proj_mod_data[_m][3 + col_offset], precision));
                    chart_data['rcp85_min'].push(round(proj_mod_data[_m][4 + col_offset], precision));
                    chart_data['rcp85_max'].push(round(proj_mod_data[_m][5 + col_offset], precision));
                  }

                  _this$_update_axes_ra9 = this._update_axes_ranges(month_indexes, month_indexes[month_indexes.length - 1], min([min(chart_data['hist_min']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]), max([max(chart_data['hist_max']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])])), _this$_update_axes_ra10 = _slicedToArray(_this$_update_axes_ra9, 4), x_range_min = _this$_update_axes_ra10[0], x_range_max = _this$_update_axes_ra10[1], y_range_min = _this$_update_axes_ra10[2], y_range_max = _this$_update_axes_ra10[3];
                  Plotly.react(this.graphdiv, [{
                    name: 'Modeled minimum (historical)',
                    x: chart_data['month'],
                    y: chart_data['hist_min'],
                    type: 'scatter',
                    mode: 'lines',
                    fill: 'none',
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_hist_minmax
                    },
                    legendgroup: 'hist',
                    visible: !!this.options.show_historical_modeled ? true : 'legendonly'
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
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_hist_minmax
                    },
                    legendgroup: 'hist',
                    visible: !!this.options.show_historical_modeled ? true : 'legendonly'
                  }, // {
                  //   x: chart_data['hist_year'],
                  //   y: chart_data['hist_mean'],
                  //   type: 'scatter',
                  //   mode: 'lines',
                  //   name: 'Historical Mean',
                  //   line: {color: '#000000'},
                  //   legendgroup: 'hist',
                  //   visible: !!this.options.show_historical_modeled ? true : 'legendonly',
                  // },
                  {
                    x: chart_data['month'],
                    y: chart_data['rcp45_min'],
                    name: 'Modeled minimum (RCP 4.5 projection)',
                    type: 'scatter',
                    mode: 'lines',
                    fill: 'none',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_proj_minmax
                    },
                    legendgroup: 'rcp45',
                    visible: this.options.show_projected_rcp45 ? true : 'legendonly'
                  }, {
                    x: chart_data['month'],
                    y: chart_data['rcp45_max'],
                    name: 'Modeled maximum (RCP 4.5 projection)',
                    fill: 'tonexty',
                    type: 'scatter',
                    mode: 'lines',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_proj_minmax
                    },
                    legendgroup: 'rcp45',
                    visible: this.options.show_projected_rcp45 ? true : 'legendonly'
                  }, {
                    x: chart_data['month'],
                    y: chart_data['rcp85_min'],
                    name: 'Modeled minimum (RCP 8.5 projection)',
                    type: 'scatter',
                    mode: 'lines',
                    fill: 'none',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_proj_minmax
                    },
                    legendgroup: 'rcp85',
                    visible: this.options.show_projected_rcp85 ? true : 'legendonly'
                  }, {
                    x: chart_data['month'],
                    y: chart_data['rcp85_max'],
                    name: 'Modeled maximum (RCP 8.5 projection)',
                    fill: 'tonexty',
                    type: 'scatter',
                    mode: 'lines',
                    fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
                      width: 0,
                      opacity: this.options.colors.opacity.ann_proj_minmax
                    },
                    legendgroup: 'rcp85',
                    visible: this.options.show_projected_rcp85 ? true : 'legendonly'
                  }, {
                    x: chart_data['month'],
                    y: chart_data['rcp45_mean'],
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Modeled mean (RCP 4.5 projection)',
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.line, this.options.colors.opacity.proj_line)
                    },
                    visible: this.options.show_projected_rcp45 ? true : 'legendonly',
                    legendgroup: 'rcp45'
                  }, {
                    x: chart_data['month'],
                    y: chart_data['rcp85_mean'],
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Modeled mean (RCP 8.5 projection)',
                    visible: this.options.show_projected_rcp85 ? true : 'legendonly',
                    line: {
                      color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.line, this.options.colors.opacity.proj_line)
                    },
                    legendgroup: 'rcp85'
                  }], // layout
                  {
                    autosize: true,
                    margin: {
                      l: 50,
                      t: 12,
                      r: 12,
                      b: 60
                    },
                    showlegend: this.options.show_legend,
                    legend: {
                      "orientation": "h"
                    },
                    xaxis: Object.assign(this._get_x_axis_layout(x_range_min, x_range_max), {
                      tickmode: 'array',
                      tickvals: month_indexes,
                      ticktext: chart_data['month_label']
                    }),
                    yaxis: this._get_y_axis_layout(y_range_min, y_range_max, variable_config)
                  }, // options
                  this._get_plotly_options());

                  this._update_visibility = function () {
                    Plotly.restyle(_this7.graphdiv, {
                      visible: [!!_this7.options.show_historical_modeled ? true : 'legendonly', !!_this7.options.show_historical_modeled ? true : 'legendonly', !!_this7.options.show_projected_rcp45 ? true : 'legendonly', !!_this7.options.show_projected_rcp45 ? true : 'legendonly', !!_this7.options.show_projected_rcp85 ? true : 'legendonly', !!_this7.options.show_projected_rcp85 ? true : 'legendonly', !!_this7.options.show_projected_rcp45 ? true : 'legendonly', !!_this7.options.show_projected_rcp85 ? true : 'legendonly']
                    });
                  };

                  this._when_chart = new Promise(function (resolve) {
                    _this7.graphdiv.on('plotly_afterplot', function (gd) {
                      resolve(gd);
                    });
                  });

                  this._when_chart.then(this._hide_spinner.bind(this));

                case 28:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this);
        }));

        function _update_monthly_island() {
          return _update_monthly_island2.apply(this, arguments);
        }

        return _update_monthly_island;
      }()
    }, {
      key: "_get_historical_observed_livneh_data",
      value: function () {
        var _get_historical_observed_livneh_data2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
          var freq, variable_config, unit_conversion_fn, area, elems, response, values, _iterator7, _step7, _step7$value, key, value, month_values, _iterator8, _step8, _step8$value, _key, _value, v;

          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  freq = this.options.frequency === 'annual' ? 'annual' : 'monthly';
                  variable_config = this.get_variable_config();
                  unit_conversion_fn = variable_config.unit_conversions[this.options.unitsystem];
                  area = this.get_area();
                  elems = [Object.assign(variable_config['acis_elements'][freq], {
                    'area_reduce': area.area_type + '_mean'
                  })];
                  _context7.next = 7;
                  return fetch(this.options.data_api_endpoint, {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(_defineProperty({
                      "sdate": "1950-01-01",
                      "edate": "2013-12-31",
                      "grid": 'livneh',
                      "elems": elems
                    }, area.area_type, area.area_id))
                  });

                case 7:
                  _context7.next = 9;
                  return _context7.sent.json();

                case 9:
                  response = _context7.sent;

                  if (response) {
                    _context7.next = 12;
                    break;
                  }

                  throw new Error("Failed to retrieve ".concat(freq, " livneh data for ").concat(this.options.variable, " and area ").concat(area.area_id));

                case 12:
                  if (!(this.options.frequency === 'annual')) {
                    _context7.next = 17;
                    break;
                  }

                  values = [];
                  _iterator7 = _createForOfIteratorHelper(response.data);

                  try {
                    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                      _step7$value = _slicedToArray(_step7.value, 2), key = _step7$value[0], value = _step7$value[1];

                      if (undefined !== value[this.options.area_id] && String(value[this.options.area_id]) !== '-999' && String(value[this.options.area_id]) !== '') {
                        values.push([key, unit_conversion_fn(value[this.options.area_id])]);
                      }
                    }
                  } catch (err) {
                    _iterator7.e(err);
                  } finally {
                    _iterator7.f();
                  }

                  return _context7.abrupt("return", values);

                case 17:
                  // monthly
                  // build output of [month, [values...]].
                  month_values = Object.fromEntries(ClimateByLocationWidget._months.map(function (m) {
                    return [m, []];
                  }));
                  _iterator8 = _createForOfIteratorHelper(response.data);

                  try {
                    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                      _step8$value = _slicedToArray(_step8.value, 2), _key = _step8$value[0], _value = _step8$value[1];

                      if (undefined !== _value[area.area_id]) {
                        v = parseFloat(_value[area.area_id]);

                        if (v === -999 || !Number.isFinite(v)) {
                          v = 0;
                        }

                        month_values[_key.slice(-2)].push([Number.parseInt(_key.slice(0, 4)), unit_conversion_fn(v)]);
                      }
                    }
                  } catch (err) {
                    _iterator8.e(err);
                  } finally {
                    _iterator8.f();
                  }

                  return _context7.abrupt("return", month_values);

                case 21:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        }));

        function _get_historical_observed_livneh_data() {
          return _get_historical_observed_livneh_data2.apply(this, arguments);
        }

        return _get_historical_observed_livneh_data;
      }()
    }, {
      key: "_get_historical_annual_loca_model_data",
      value: function () {
        var _get_historical_annual_loca_model_data2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
          var sdate_year, edate_year, sdate, edate, unit_conversion_fn, _this$options2, variable, frequency, area_id, data, values, i;

          return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  sdate_year = 1950;
                  edate_year = 2006;
                  sdate = sdate_year + '-01-01';
                  edate = edate_year + '-12-31';
                  unit_conversion_fn = this.get_variable_config().unit_conversions[this.options.unitsystem];
                  _this$options2 = this.options, variable = _this$options2.variable, frequency = _this$options2.frequency, area_id = _this$options2.area_id;
                  _context8.next = 8;
                  return Promise.all([this._fetch_acis_data('loca:wMean:rcp85', sdate, edate, variable, frequency, area_id, unit_conversion_fn), this._fetch_acis_data('loca:allMin:rcp85', sdate, edate, variable, frequency, area_id, unit_conversion_fn), this._fetch_acis_data('loca:allMax:rcp85', sdate, edate, variable, frequency, area_id, unit_conversion_fn)]);

                case 8:
                  data = _context8.sent;
                  values = [];

                  for (i = 0; i < edate_year - sdate_year; i++) {
                    values.push([i + sdate_year, data[0][1][i], data[1][1][i], data[2][1][i]]);
                  }

                  return _context8.abrupt("return", values);

                case 12:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8, this);
        }));

        function _get_historical_annual_loca_model_data() {
          return _get_historical_annual_loca_model_data2.apply(this, arguments);
        }

        return _get_historical_annual_loca_model_data;
      }()
    }, {
      key: "_get_projected_loca_model_data",
      value: function () {
        var _get_projected_loca_model_data2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
          var sdate_year, sdate, edate_year, edate, unit_conversion_fn, _this$options3, variable, frequency, area_id, data, _iterator9, _step9, _step9$value, keys, _, values, i, monthly_values, _get_val, _i14;

          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  sdate_year = this.options.frequency === 'monthly' ? 2010 : 2006;
                  sdate = sdate_year + '-01-01';
                  edate_year = 2099;
                  edate = edate_year + '-12-31';
                  unit_conversion_fn = this.get_variable_config().unit_conversions[this.options.unitsystem];
                  _this$options3 = this.options, variable = _this$options3.variable, frequency = _this$options3.frequency, area_id = _this$options3.area_id;
                  _context9.next = 8;
                  return Promise.all([this._fetch_acis_data('loca:wMean:rcp45', sdate, edate, variable, frequency, area_id, unit_conversion_fn), this._fetch_acis_data('loca:allMin:rcp45', sdate, edate, variable, frequency, area_id, unit_conversion_fn), this._fetch_acis_data('loca:allMax:rcp45', sdate, edate, variable, frequency, area_id, unit_conversion_fn), this._fetch_acis_data('loca:wMean:rcp85', sdate, edate, variable, frequency, area_id, unit_conversion_fn), this._fetch_acis_data('loca:allMin:rcp85', sdate, edate, variable, frequency, area_id, unit_conversion_fn), this._fetch_acis_data('loca:allMax:rcp85', sdate, edate, variable, frequency, area_id, unit_conversion_fn)]);

                case 8:
                  data = _context9.sent;

                  if (!(this.options.frequency === 'annual')) {
                    _context9.next = 30;
                    break;
                  }

                  _iterator9 = _createForOfIteratorHelper(data);
                  _context9.prev = 11;

                  _iterator9.s();

                case 13:
                  if ((_step9 = _iterator9.n()).done) {
                    _context9.next = 19;
                    break;
                  }

                  _step9$value = _slicedToArray(_step9.value, 2), keys = _step9$value[0], _ = _step9$value[1];

                  if (!(keys.length !== edate_year - sdate_year + 1)) {
                    _context9.next = 17;
                    break;
                  }

                  throw new Error('Missing years in projected loca data!');

                case 17:
                  _context9.next = 13;
                  break;

                case 19:
                  _context9.next = 24;
                  break;

                case 21:
                  _context9.prev = 21;
                  _context9.t0 = _context9["catch"](11);

                  _iterator9.e(_context9.t0);

                case 24:
                  _context9.prev = 24;

                  _iterator9.f();

                  return _context9.finish(24);

                case 27:
                  values = [];

                  for (i = 0; i < edate_year - sdate_year; i++) {
                    values.push([i + sdate_year, data[0][1][i], data[1][1][i], data[2][1][i], data[3][1][i], data[4][1][i], data[5][1][i]]);
                  }

                  return _context9.abrupt("return", values);

                case 30:
                  // monthly
                  // build output of {month: [year, rcp45_mean, rcp45_min, rcp45_max, rcp85_mean, rcp85_min, rcp85_max]}.
                  monthly_values = Object.fromEntries(ClimateByLocationWidget._months.map(function (m) {
                    return [m, []];
                  }));

                  _get_val = function _get_val(array, idx) {
                    if (undefined !== array[idx]) {
                      var v = parseFloat(array[idx]);

                      if (v === -999) {
                        v = Number.NaN;
                      }

                      return v;
                    }

                    return Number.NaN;
                  };

                  for (_i14 = 0; _i14 < data[0][0].length; _i14++) {
                    monthly_values[data[0][0][_i14].slice(-2)].push([Number.parseInt(data[0][0][_i14].slice(0, 4)), _get_val(data[0][1], _i14), _get_val(data[1][1], _i14), _get_val(data[2][1], _i14), _get_val(data[3][1], _i14), _get_val(data[4][1], _i14), _get_val(data[5][1], _i14)]);
                  }

                  return _context9.abrupt("return", monthly_values);

                case 34:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9, this, [[11, 21, 24, 27]]);
        }));

        function _get_projected_loca_model_data() {
          return _get_projected_loca_model_data2.apply(this, arguments);
        }

        return _get_projected_loca_model_data;
      }()
      /**
       * Retrieves data from ACIS.
       * @param grid
       * @param sdate
       * @param edate
       * @param variable
       * @param frequency
       * @param area_id
       * @param unit_conversion_fn
       * @return {Promise<[][]>}
       * @private
       */

    }, {
      key: "_fetch_acis_data",
      value: function () {
        var _fetch_acis_data2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(grid, sdate, edate, variable, frequency, area_id, unit_conversion_fn) {
          var area, elems, response, keys, values, _iterator10, _step10, _step10$value, key, value;

          return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  area = ClimateByLocationWidget.get_areas(null, null, area_id)[0];
                  elems = [Object.assign(this.get_variable_config()['acis_elements'][frequency === 'annual' ? 'annual' : 'monthly'], {
                    "area_reduce": area.area_type + '_mean'
                  })];
                  _context10.next = 4;
                  return fetch(this.options.data_api_endpoint, {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(_defineProperty({
                      "grid": grid,
                      "sdate": String(sdate),
                      "edate": String(edate),
                      "elems": elems
                    }, area.area_type, area.area_id))
                  });

                case 4:
                  _context10.next = 6;
                  return _context10.sent.json();

                case 6:
                  response = _context10.sent;
                  keys = [];
                  values = [];
                  _iterator10 = _createForOfIteratorHelper(get(response, 'data', {}));

                  try {
                    for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
                      _step10$value = _slicedToArray(_step10.value, 2), key = _step10$value[0], value = _step10$value[1];

                      if (undefined !== value[area_id] && String(value[area_id]) !== '-999' && String(value[area_id]) !== '') {
                        keys.push(key);
                        values.push(unit_conversion_fn(value[area_id]));
                      }
                    }
                  } catch (err) {
                    _iterator10.e(err);
                  } finally {
                    _iterator10.f();
                  }

                  return _context10.abrupt("return", [keys, values]);

                case 12:
                case "end":
                  return _context10.stop();
              }
            }
          }, _callee10, this);
        }));

        function _fetch_acis_data(_x, _x2, _x3, _x4, _x5, _x6, _x7) {
          return _fetch_acis_data2.apply(this, arguments);
        }

        return _fetch_acis_data;
      }()
      /**
       * Retrieves island data and pre-filters it to just the variable we're interested in.
       * @return {Promise<array<{area_id,scenario,sdate,area_label,gcm_coords,area_type,variable,annual_data:{all_max, all_mean,all_min}, monthly_data:{all_max, all_mean,all_min}}>>}
       * @private
       */

    }, {
      key: "_fetch_island_data",
      value: function () {
        var _fetch_island_data2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(variable, area_id) {
          var _this8 = this;

          var response;
          return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  _context11.next = 2;
                  return fetch(this.options.island_data_url_template.replace('{area_id}', area_id), {
                    method: "GET",
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });

                case 2:
                  _context11.next = 4;
                  return _context11.sent.json();

                case 4:
                  response = _context11.sent;

                  if (response) {
                    _context11.next = 7;
                    break;
                  }

                  throw new Error("No data found for area \"".concat(area_id, "\" and variable \"").concat(variable, "\""));

                case 7:
                  // variable names are slightly different in the island data
                  if (variable === 'days_dry_days') {
                    variable = 'dryday';
                  } else if (variable.startsWith('days_t')) {
                    variable = variable.replace(/days_(.+?)_.+?_([0-9]+)f/, "$1$2F");
                  } else if (variable.startsWith('days_pcpn')) {
                    variable = variable.replace(/.+?([0-9]+)in/, "pr$1in");
                  } else if (variable.endsWith('_65f')) {
                    variable = variable.replace('_65f', '');
                  } else if (variable === 'gddmod') {
                    variable = 'mgdd';
                  } else if (variable === 'pcpn') {
                    variable = 'precipitation';
                  }

                  return _context11.abrupt("return", response.data.filter(function (series) {
                    return series.area_id === _this8.options.area_id && series.variable === variable;
                  }));

                case 9:
                case "end":
                  return _context11.stop();
              }
            }
          }, _callee11, this);
        }));

        function _fetch_island_data(_x8, _x9) {
          return _fetch_island_data2.apply(this, arguments);
        }

        return _fetch_island_data;
      }()
    }, {
      key: "_transform_acis_loca_monthly",
      value: function _transform_acis_loca_monthly(wMean45, min45, max45, wMean85, min85, max85) {
        // TODO completely revise this!
        var data = {};
        [2025, 2050, 2075].forEach(function (yearRange) {
          data[yearRange] = {};

          ClimateByLocationWidget._months.forEach(function (month) {
            var season_month = month;

            if (undefined === data[yearRange][season_month]) {
              data[yearRange][season_month] = {};
            }

            var datasets = {
              'wMean45': wMean45,
              'wMean85': wMean85,
              'min45': min45,
              'max45': max45,
              'min85': min85,
              'max85': max85
            };
            Object.keys(datasets).forEach(function (dataset) {
              if (undefined === data[yearRange][season_month][dataset]) {
                data[yearRange][season_month][dataset] = [];
              }

              for (var year = yearRange - 15; year < yearRange + 15; year++) {
                var year_month = String(year) + '-' + String(month);

                if (datasets[dataset].hasOwnProperty(year_month)) {
                  data[yearRange][season_month][dataset].push(datasets[dataset][year_month]);
                }
              }
            });
          });
        }); // mean values by month

        Object.keys(data).forEach(function (yearRange) {
          Object.keys(data[yearRange]).forEach(function (month) {
            ['wMean45', 'wMean85', 'min45', 'min85', 'max45', 'max85'].forEach(function (valueName) {
              var length = data[yearRange][month][valueName].length;
              var sum = data[yearRange][month][valueName].reduce(function (acc, value) {
                return acc + value;
              }, 0);
              data[yearRange][month][valueName] = sum / length;
            });
          });
        }); // reformat to expected output
        // [ month,2025rcp45_max,2025rcp45_weighted_mean,2025rcp45_min,2025rcp85_max,2025rcp85_weighted_mean,2025rcp85_min,2050rcp45_max,2050rcp45_weighted_mean,2050rcp45_min,2050rcp85_max,2050rcp85_weighted_mean,2050rcp85_min,2075rcp45_max,2075rcp45_weighted_mean,2075rcp45_min,2075rcp85_max,2075rcp85_weighted_mean,2075rcp85_min ]

        var dataByMonth = {};

        ClimateByLocationWidget._months.forEach(function (month) {
          dataByMonth[month] = {};

          ClimateByLocationWidget._monthly_timeperiods.forEach(function (yearRange) {
            ['45', '85'].forEach(function (scenario) {
              ['max', 'wMean', 'min'].forEach(function (valueName) {
                dataByMonth[month][String(yearRange) + 'rcp' + String(scenario) + '_' + String(valueName)] = data[yearRange][month][String(valueName) + String(scenario)];
              });
            });
          });
        });

        var result = [];
        Object.keys(dataByMonth).forEach(function (month) {
          result.push([month, dataByMonth[month]['2025rcp45_wMean'], dataByMonth[month]['2025rcp45_min'], dataByMonth[month]['2025rcp45_max'], dataByMonth[month]['2025rcp85_wMean'], dataByMonth[month]['2025rcp85_min'], dataByMonth[month]['2025rcp85_max'], dataByMonth[month]['2050rcp45_wMean'], dataByMonth[month]['2050rcp45_min'], dataByMonth[month]['2050rcp45_max'], dataByMonth[month]['2050rcp85_wMean'], dataByMonth[month]['2050rcp85_min'], dataByMonth[month]['2050rcp85_max'], dataByMonth[month]['2075rcp45_wMean'], dataByMonth[month]['2075rcp45_min'], dataByMonth[month]['2075rcp45_max'], dataByMonth[month]['2075rcp85_wMean'], dataByMonth[month]['2075rcp85_min'], dataByMonth[month]['2075rcp85_max']]);
        }); // Sort before returning

        result.sort(function (a, b) {
          return (a[0] > b[0]) - (a[0] < b[0]);
        });
        this.downloadable_dataurls.proj_mod = this._format_export_data(['month', '2025_rcp45_weighted_mean', '2025_rcp45_min', '2025_rcp45_max', '2025_rcp85_weighted_mean', '2025_rcp85_min', '2025_rcp85_max', '2050_rcp45_weighted_mean', '2050_rcp45_min', '2050_rcp45_max', '2050_rcp85_weighted_mean', '2050_rcp85_min', '2050_rcp85_max', '2075_rcp45_max', '2075_rcp45_weighted_mean', '2075_rcp45_min', '2075_rcp45_max', '2075_rcp85_weighted_mean', '2075_rcp85_min', '2075_rcp85_max'], result);
        return result;
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

    }, {
      key: "_update_axes_ranges",
      value: function _update_axes_ranges(x_range_min, x_range_max, y_range_min, y_range_max) {
        var _this9 = this;

        if (!!this.options.x_axis_range) {
          this.options.x_axis_range = [Math.max(x_range_min, get(this.options, ['x_axis_range', 0], x_range_min)), Math.min(x_range_max, get(this.options, ['x_axis_range', 1], x_range_max))];
        }

        if (!!this.options.y_axis_range) {
          this.options.y_axis_range = [Math.max(y_range_min, get(this.options, ['y_axis_range', 0], y_range_min)), Math.min(y_range_max, get(this.options, ['y_axis_range', 1], y_range_max))];
        }

        if (Number.isFinite(x_range_min) && Number.isFinite(x_range_max)) {
          window.setTimeout(function () {
            _this9.element.dispatchEvent(new CustomEvent('x_axis_range_change', {
              detail: [x_range_min, x_range_max, get(_this9.options, ['x_axis_range', 0], x_range_min), get(_this9.options, ['x_axis_range', 1], x_range_max)]
            }));

            _this9.element.dispatchEvent(new CustomEvent('y_axis_range_change', {
              detail: [y_range_min, y_range_max, get(_this9.options, ['y_axis_range', 0], y_range_min), get(_this9.options, ['y_axis_range', 1], y_range_max)]
            }));
          });
        }

        return [].concat(_toConsumableArray(this.options.x_axis_range || [x_range_min, x_range_max]), _toConsumableArray(this.options.y_axis_range || [y_range_min, y_range_max]));
      }
    }, {
      key: "_get_y_axis_layout",
      value: function _get_y_axis_layout(y_range_min, y_range_max, variable_config) {
        return {
          type: 'linear',
          range: [y_range_min, y_range_max],
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
    }, {
      key: "_get_x_axis_layout",
      value: function _get_x_axis_layout(x_range_min, x_range_max) {
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
    }, {
      key: "_get_plotly_options",
      value: function _get_plotly_options() {
        return {
          displaylogo: false,
          modeBarButtonsToRemove: ['toImage', 'lasso2d', 'select2d']
        };
      }
    }, {
      key: "_show_spinner",
      value: function _show_spinner() {
        this._hide_spinner();

        var style = "<style>.cwg-spinner { margin-top: -2.5rem; border-radius: 100%;border-style: solid;border-width: 0.25rem;height: 5rem;width: 5rem;animation: basic 1s infinite linear; border-color: rgba(0, 0, 0, 0.2);border-top-color: rgba(0, 0, 0, 1); }@keyframes basic {0%   { transform: rotate(0); }100% { transform: rotate(359.9deg); }} .cwg-spinner-wrapper {display:flex; align-items: center; justify-content: center; }</style>";
        this.element.style.position = 'relative';
        var spinner_el = document.createElement('div');
        spinner_el.classList.add('cwg-spinner-wrapper');
        spinner_el.style.position = 'absolute';
        spinner_el.style.width = "100%";
        spinner_el.style.height = "100%";
        spinner_el.style.left = '0px';
        spinner_el.style.top = '0px';
        spinner_el.style.zIndex = '1000000';
        spinner_el.innerHTML = style + "<div class='cwg-spinner'></div>";
        this.element.appendChild(spinner_el);
      }
    }, {
      key: "_hide_spinner",
      value: function _hide_spinner() {
        if (this.element && this.element.querySelector('.cwg-spinner-wrapper')) {
          this.element.removeChild(this.element.querySelector('.cwg-spinner-wrapper'));
        }
      }
    }, {
      key: "_format_export_data",
      value: function _format_export_data(column_labels, data) {
        var export_data = data.map(function (row) {
          return row.filter(function (cell) {
            return cell !== null;
          });
        });
        export_data.unshift(column_labels);
        return 'data:text/csv;base64,' + window.btoa(export_data.map(function (a) {
          return a.join(', ');
        }).join('\n'));
      }
    }, {
      key: "_reset_downloadable_dataurls",
      value: function _reset_downloadable_dataurls() {
        this.downloadable_dataurls = {
          hist_obs: '',
          hist_mod: '',
          proj_mod: ''
        };
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

    }], [{
      key: "when_variables",
      value: function when_variables(frequency, unitsystem, area_id) {
        return ClimateByLocationWidget.when_areas().then(ClimateByLocationWidget.get_variables.bind(this, frequency, unitsystem, area_id));
      }
      /**
       * Gets available variable options for a specified combination of frequency and area_id. If areas are not loaded, returns empty
       *
       * @param frequency
       * @param unitsystem
       * @param area_id
       * @returns {{id: *, title: *}[]}
       */

    }, {
      key: "get_variables",
      value: function get_variables(frequency, unitsystem, area_id) {
        unitsystem = unitsystem || 'english';
        return ClimateByLocationWidget._variables.filter(function (v) {
          return frequency in v.ytitles && (typeof v.supports_area === "function" ? v.supports_area(area_id) : true);
        }).map(function (v) {
          return {
            id: v.id,
            title: v.title[unitsystem]
          };
        });
      }
      /**
       * Gets available frequency options for a specified area.
       *
       * @param area_id
       * @returns {promise<{id: (string), title: (string)}[]>}
       */

    }, {
      key: "when_frequencies",
      value: function when_frequencies(area_id) {
        return ClimateByLocationWidget.when_areas().then(ClimateByLocationWidget.get_frequencies.bind(this, area_id));
      }
      /**
       * Gets available frequency options for a specified area.
       *
       * @param area_id
       * @returns {{id: (string), title: (string)}[]}
       */

    }, {
      key: "get_frequencies",
      value: function get_frequencies(area_id) {
        return ClimateByLocationWidget._frequencies.filter(function (f) {
          return typeof f.supports_area === "function" ? f.supports_area(area_id) : true;
        }).map(function (v) {
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

    }, {
      key: "when_areas",
      value: function when_areas() {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var area_id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        if (all_areas === null && _when_areas === null) {
          _when_areas = fetch(ClimateByLocationWidget._areas_json_url).then(function (response) {
            return response.json();
          }).then(function (data) {
            if (!data) {
              throw new Error("Failed to retrieve areas!");
            }

            all_areas = data;
          });
        }

        return _when_areas.then(ClimateByLocationWidget.get_areas.bind(this, type, state, area_id));
      }
      /**
       * Gets available areas based on type or the state they belong to (counties only). If called before areas are loaded, returns empty.
       * @param type {string|null} Area type to filter by. Any of 'state', 'county', 'island'.
       * @param state {string|null} Two-digit abbreviation of state to filter by. Implies type='state'
       * @param area_id {string|null} Area id to filter by. Will never return more than 1 result.
       * @returns array<{area_id, area_label, area_type, state}>
       */

    }, {
      key: "get_areas",
      value: function get_areas() {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var area_id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        if (!all_areas) {
          console.warn('Areas not yet loaded! Use when_areas() for async access to areas.');
          return [];
        }

        if (!!area_id) {
          area_id = String(area_id).toLowerCase();
          return all_areas.filter(function (area) {
            return String(area.area_id).toLowerCase() === area_id;
          });
        }

        if (!!state) {
          state = String(state).toUpperCase();
          return all_areas.filter(function (area) {
            return area['area_type'] === 'county' && area.state === state;
          });
        }

        if (!!type) {
          type = String(type).toLowerCase();

          if (!['state', 'county', 'island'].includes(type)) {
            throw Error("Invalid area type \"".concat(type, "\", valid types are 'state','county', and 'island'"));
          }

          return all_areas.filter(function (area) {
            return area['area_type'] === type;
          });
        }

        return all_areas;
      }
      /**
       * Gets available areas based on type or the state they belong to (counties only). Returns first area. If called before areas are loaded, returns empty.
       * @param type {string|null} Area type to filter by. Any of 'state', 'county', 'island'.
       * @param state {string|null} Two-digit abbreviation of state to filter by. Implies type='state'
       * @param area_id {string|null} Area id to filter by. Will never return more than 1 result.
       * @returns array<{area_id, area_label, area_type, state}>
       */

    }, {
      key: "find_area",
      value: function find_area() {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var area_id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var areas = ClimateByLocationWidget.get_areas(type, state, area_id);
        return areas.length > 0 ? areas[0] : null;
      }
      /**
       * This function is used to toggle features based on whether the selected area_id is in Alaska or not.
       *
       * @param area_id
       * @returns {boolean}
       */

    }, {
      key: "is_ak_area",
      value: function is_ak_area(area_id) {
        return String(area_id).startsWith('02') || area_id === 'AK';
      }
      /**
       * This function is used to toggle features based on whether the selected area_id is an island or other non-conus area.
       *
       * @param area_id
       * @returns {boolean}
       */

    }, {
      key: "is_island_area",
      value: function is_island_area(area_id) {
        return get(ClimateByLocationWidget.get_areas(null, null, area_id), [0, 'area_type']) === 'island';
      }
      /**
       * This function is used to toggle features based on whether the selected area_id is a CONUS area.
       *
       * @param area_id
       * @returns {boolean}
       */

    }, {
      key: "is_conus_area",
      value: function is_conus_area(area_id) {
        var non_conus_states = ['HI', 'AK'];

        if (non_conus_states.includes(area_id)) {
          return false;
        }

        var area = ClimateByLocationWidget.get_areas(null, null, area_id);
        return !(get(area, [0, 'area_type']) === 'island') && !(get(area, [0, 'area_type']) === 'county' && non_conus_states.includes(get(area, [0, 'state'])));
      }
      /*
       * Private static properties and methods
       */

    }, {
      key: "_rolling_window_average",

      /**
       * Performs a rolling window average using the given array, returning a single value.
       * @param collection
       * @param year
       * @param window_size
       * @return {number}
       * @private
       */
      value: function _rolling_window_average(collection, year) {
        var window_size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
        return mean(range(window_size).map(function (x) {
          return get(collection, year - x);
        }).filter(function (y) {
          return !!y;
        }));
      }
      /**
       * Utility function to convert F to C
       * @param f
       * @return {number}
       */

    }, {
      key: "_fahrenheit_to_celsius",
      value: function _fahrenheit_to_celsius(f) {
        return 5 / 9 * (f - 32);
      }
      /**
       * Utility function to convert F degree days to C degree days
       * @param fdd
       * @return {number}
       */

    }, {
      key: "_fdd_to_cdd",
      value: function _fdd_to_cdd(fdd) {
        return fdd / 9 * 5;
      }
      /**
       * Utility function inches to mm
       * @param inches
       * @return {number}
       */

    }, {
      key: "_inches_to_mm",
      value: function _inches_to_mm(inches) {
        return inches * 25.4;
      }
      /**
       * Utility function to add an alpha channel to an rgb color. Doesn't play nice with hex colors.
       * @param rgb
       * @param opacity
       * @return {string}
       * @private
       */

    }, {
      key: "_rgba",
      value: function _rgba(rgb, opacity) {
        var _rgb$split$splice$0$s = rgb.split('(').splice(-1)[0].split(')')[0].split(',').slice(0, 3),
            _rgb$split$splice$0$s2 = _slicedToArray(_rgb$split$splice$0$s, 3),
            r = _rgb$split$splice$0$s2[0],
            g = _rgb$split$splice$0$s2[1],
            b = _rgb$split$splice$0$s2[2];

        return "rgba(".concat(r, ",").concat(g, ",").concat(b, ",").concat(opacity, ")");
      }
    }, {
      key: "_variables",
      get: function get() {
        return [{
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
            metric: ClimateByLocationWidget._fahrenheit_to_celsius,
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
          supports_area: function supports_area() {
            return true;
          }
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
            metric: ClimateByLocationWidget._fahrenheit_to_celsius,
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
          supports_area: function supports_area() {
            return true;
          }
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
          supports_area: ClimateByLocationWidget.is_ak_area
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
          supports_area: ClimateByLocationWidget.is_ak_area
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
          supports_area: ClimateByLocationWidget.is_ak_area
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
          supports_area: ClimateByLocationWidget.is_ak_area
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
          supports_area: function supports_area() {
            return true;
          }
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
          supports_area: function supports_area(area_id) {
            return !ClimateByLocationWidget.is_ak_area(area_id);
          }
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
          supports_area: function supports_area(area_id) {
            return !ClimateByLocationWidget.is_ak_area(area_id);
          }
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
          supports_area: function supports_area(area_id) {
            return !ClimateByLocationWidget.is_ak_area(area_id);
          }
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
          supports_area: function supports_area() {
            return true;
          }
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
          supports_area: function supports_area() {
            return true;
          }
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
          supports_area: ClimateByLocationWidget.is_ak_area
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
              english: "Days per year with min above 60°F",
              metric: "Days per year with min above 15.5°C"
            }
          },
          supports_area: ClimateByLocationWidget.is_ak_area
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
          supports_area: function supports_area(area_id) {
            return !ClimateByLocationWidget.is_ak_area(area_id);
          }
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
          supports_area: function supports_area(area_id) {
            return !ClimateByLocationWidget.is_ak_area(area_id);
          }
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
            metric: ClimateByLocationWidget._fdd_to_cdd,
            english: identity
          },
          ytitles: {
            annual: {
              english: "Heating Degree Days (°F-days)",
              metric: "Heating Degree Days (°C-days)"
            }
          },
          supports_area: function supports_area() {
            return true;
          }
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
            metric: ClimateByLocationWidget._fdd_to_cdd,
            english: identity
          },
          ytitles: {
            annual: {
              english: "Cooling Degree Days (°F-days)",
              metric: "Cooling Degree Days (°C-days)"
            }
          },
          supports_area: function supports_area() {
            return true;
          }
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
          supports_area: function supports_area() {
            return true;
          }
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
          supports_area: function supports_area() {
            return true;
          }
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
            metric: ClimateByLocationWidget._fdd_to_cdd,
            english: identity
          },
          ytitles: {
            annual: {
              english: "Thawing Degree Days (°F-days)",
              metric: "Thawing Degree Days (°C-days)"
            }
          },
          supports_area: ClimateByLocationWidget.is_ak_area
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
            metric: ClimateByLocationWidget._fdd_to_cdd,
            english: identity
          },
          ytitles: {
            annual: {
              english: "Freezing Degree Days (°F-days)",
              metric: "Freezing Degree Days (°C-days)"
            }
          },
          supports_area: ClimateByLocationWidget.is_ak_area
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
            metric: ClimateByLocationWidget._inches_to_mm,
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
          supports_area: function supports_area() {
            return true;
          }
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
          supports_area: function supports_area() {
            return true;
          }
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
          supports_area: ClimateByLocationWidget.is_ak_area
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
          supports_area: function supports_area() {
            return true;
          }
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
          supports_area: function supports_area() {
            return true;
          }
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
          supports_area: function supports_area() {
            return true;
          }
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
          supports_area: function supports_area(area_id) {
            return !ClimateByLocationWidget.is_ak_area(area_id);
          }
        }];
      }
    }, {
      key: "_frequencies",
      get: function get() {
        return [{
          id: 'annual',
          title: 'Annual',
          supports_area: function supports_area() {
            return true;
          }
        }, {
          id: 'monthly',
          title: 'Monthly',
          supports_area: function supports_area(area_id) {
            return ClimateByLocationWidget.is_conus_area(area_id) || ClimateByLocationWidget.is_island_area(area_id);
          }
        }];
      }
    }]);

    return ClimateByLocationWidget;
  }();

  _defineProperty(ClimateByLocationWidget, "_areas_json_url", 'areas.json');

  _defineProperty(ClimateByLocationWidget, "_bool_options", ['show_historical_observed', 'show_historical_modeled', 'show_projected_rcp45', 'show_projected_rcp85']);

  _defineProperty(ClimateByLocationWidget, "_months", ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']);

  _defineProperty(ClimateByLocationWidget, "_months_labels", ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);

  _defineProperty(ClimateByLocationWidget, "_monthly_timeperiods", [2025, 2050, 2075]);

  return ClimateByLocationWidget;

})));
