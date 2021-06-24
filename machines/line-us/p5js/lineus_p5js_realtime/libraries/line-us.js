(function (e) {
  if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
  else if ("function" == typeof define && define.amd) define([], e);
  else {
    var t;
    (t = "undefined" == typeof window ? ("undefined" == typeof global ? ("undefined" == typeof self ? this : self) : global) : window), (t.LineUs = e());
  }
})(function () {
  var t,
    e = Number.isInteger;
  return (function () {
    function s(l, e, n) {
      function t(o, i) {
        if (!e[o]) {
          if (!l[o]) {
            var u = "function" == typeof require && require;
            if (!i && u) return u(o, !0);
            if (r) return r(o, !0);
            var d = new Error("Cannot find module '" + o + "'");
            throw ((d.code = "MODULE_NOT_FOUND"), d);
          }
          var a = (e[o] = { exports: {} });
          l[o][0].call(
            a.exports,
            function (e) {
              var r = l[o][1][e];
              return t(r || e);
            },
            a,
            a.exports,
            s,
            l,
            e,
            n
          );
        }
        return e[o].exports;
      }
      for (var r = "function" == typeof require && require, o = 0; o < n.length; o++) t(n[o]);
      return t;
    }
    return s;
  })()(
    {
      1: [
        function (e, t) {
          const n = e("isomorphic-ws"),
            r = e("p-queue"),
            s = e("p-event"),
            o = e("nanobus"),
            a = e("lowercase-keys"),
            { serialize: i, deserialize: u } = e("./serialize.js"),
            { translate: l, untranslate: d } = e("./translate.js"),
            p = e("./validate.js");
          class h extends o {
            constructor(e) {
              (e = Object.assign({ url: "ws://line-us.local", autoConnect: !0, autoStart: !0, concurrency: 3 }, e)),
                super("line-us"),
                (this.url = e.url),
                (this.autoConnect = e.autoConnect),
                (this.autoStart = e.autoStart),
                (this.concurrency = e.concurrency),
                (this.info = {}),
                (this._ws = null),
                (this._queue = new r({ concurrency: this.concurrency, autoStart: !1 })),
                (this._responseQueue = []),
                (this._state = "disconnected"),
                (this._coordinates = {}),
                (this._queuedPenState = "up"),
                this.autoConnect && this.connect();
            }
            get state() {
              return this._state;
            }
            set state(e) {
              (this._state = e), this.emit("state", e), this.emit(e);
            }
            get coordinates() {
              return this._coordinates;
            }
            set coordinates(e) {
              (this._coordinates = e), this.emit("coordinates", e);
            }
            connect() {
              (this.state = "connecting"),
                (this._ws = new n(this.url)),
                (this._ws.onopen = async () => {
                  let e = await s(this._ws, "message");
                  (e = u(e.data || e)),
                    (this.info = a(e.data)),
                    (this.state = "connected"),
                    (this._queuedPenState = "up"),
                    (this.coordinates = { x: 350, y: 0, z: 1e3 }),
                    (this._ws.onmessage = (e) => {
                      this._responseQueue.shift()(e);
                    }),
                    this.autoStart ? this.start() : this.pause();
                }),
                (this._ws.onclose = () => {
                  (this.state = "disconnected"), this.stop();
                }),
                (this._ws.onerror = (t) => {
                  this.emit("error", "LineUs: websocket error: " + t.error.message);
                });
            }
            disconnect() {
              this._ws.close();
            }
            start() {
              this._queue.start(), (this.state = "drawing");
            }
            async pause({ lift: e = !0 } = {}) {
              return "paused" === this.state
                ? Promise.resolve()
                : (p.lift(e),
                  this._queue.add(
                    () => {
                      const t = this.coordinates.z;
                      if ((this._queue.pause(), (this.state = "paused"), 500 > t && e)) return this._queue.add(() => this._send({ g: "G01", params: { z: t } }), { priority: 1 }), this._send({ g: "G01", params: { z: 1e3 } });
                    },
                    { priority: 1 }
                  ));
            }
            resume() {
              this.start();
            }
            async stop() {
              await this.pause(), this.clear();
            }
            clear() {
              this._queue.clear();
            }
            async send(e) {
              p.cmd(e);
              const { g: t, params: n } = e;
              return n && "z" in n && (500 > n.z ? (this._queuedPenState = "down") : (this._queuedPenState = "up")), "G28" === t.toUpperCase() && (this._queuedPenState = "up"), this._queue.add(() => this._send(e));
            }
            async _send(e) {
              let t = new Promise((e) => {
                this._responseQueue.push(e);
              });
              this._ws.send(i(e));
              // console.log(i(e)); // Print out the GCode that was sent.
              let n = await t;
              switch (((n = u(n.data || n)), n.type)) {
                case "ok":
                  let e = n.data;
                  return "X" in e && ((e = d(a(e))), (this.coordinates = e)), e;
                case "error":
                  throw new Error("LineUs: " + n.data.INFO);
                default:
                  throw new Error("LineUs: unknown response type");
              }
            }
            async penUp() {
              return this.to({ z: 1e3 });
            }
            async penDown() {
              return this.to({ z: 0 });
            }
            async to(e) {
              return p.xyz(e), this.send({ g: "G01", params: l(e) });
            }
            async moveTo(e) {
              return p.xy(e), "down" === this._queuedPenState && (e.z = 1e3), this.to(e);
            }
            async lineTo(e) {
              return p.xy(e), "up" === this._queuedPenState && this.penDown(), this.to(e);
            }
            async home() {
              return this.send({ g: "G28" });
            }
            async getPosition() {
              return this.send({ g: "M114" });
            }
            async getCapabilities() {
              return this.send({ g: "M115" });
            }
            async getDiagnostics() {
              return this.send({ g: "M122" });
            }
            async setCalibration() {
              return this.send({ g: "M374" });
            }
            async clearCalibration() {
              return this.send({ g: "M374", params: { s: "clear" } });
            }
            async setMachineName(e) {
              return p.name(e), this.send({ g: "M550", params: { p: `"${e}"` } });
            }
            async getMachineName() {
              return this.send({ g: "M550" });
            }
            async saveWifiNetwork(e) {
              p.wifi(e);
              const { ssid: t, password: n } = e;
              let r = { s: `"${t}"` };
              return void 0 !== n && (r.p = `"${n}"`), this.send({ g: "M587", params: r });
            }
            async listWifiNetworks() {
              return this.send({ g: "M587" });
            }
            async forgetWifiNetwork(e) {
              p.wifi(e);
              const { ssid: t } = e;
              return this.send({ g: "M588", params: { s: `"${t}"` } });
            }
          }
          t.exports = h;
        },
        { "./serialize.js": 3, "./translate.js": 4, "./validate.js": 5, "isomorphic-ws": 7, "lowercase-keys": 8, nanobus: 10, "p-event": 13, "p-queue": 15 },
      ],
      2: [
        function (e, t) {
          function n(e, t) {
            Array.isArray(t) || (t = [t]),
              t.forEach((t) => {
                t(e);
              });
          }
          const r = e("@sindresorhus/is");
          t.exports = {
            check: n,
            isObject: function (e) {
              if (!r.plainObject(e)) throw new TypeError("input is not an object");
              if (!r.nonEmptyObject(e)) throw new TypeError("input object is empty");
            },
            isNumber: function (e) {
              if (!(r.number(e) || r.numericString(e))) throw new TypeError("input is not a number");
            },
            isString: function (e) {
              if (!r.nonEmptyString(e)) throw new TypeError("input is not a string or is empty");
            },
            isBoolean: function (e) {
              if (!r.boolean(e)) throw new TypeError("input is not a boolean");
            },
            hasKeys: function (e) {
              return (t) => {
                "string" == typeof e && (e = [e]);
                const n = e.every((e) => {
                  if (t.hasOwnProperty(e)) return !0;
                });
                if (!n) throw new TypeError("input object is missing required keys");
              };
            },
            hasSomeKeys: function (e) {
              return (t) => {
                const n = e.some((e) => {
                  if (t.hasOwnProperty(e)) return !0;
                });
                if (!n) throw new TypeError("input object has none of the expected keys");
              };
            },
            checkKeys: function (e) {
              return (t) => {
                Object.keys(e).forEach((r) => {
                  t.hasOwnProperty(r) && n(t[r], e[r]);
                });
              };
            },
          };
        },
        { "@sindresorhus/is": 6 },
      ],
      3: [
        function (e, t) {
          t.exports = {
            serialize: function (e) {
              const t = e.g.toUpperCase();
              let n = [];
              return (
                e.params &&
                  (n = Object.entries(e.params).map((e) => {
                    const [t, n] = e;
                    return [t.toUpperCase(), n].join("");
                  })),
                [t, ...n].join(" ")
              );
            },
            deserialize: function (e) {
              const t = /^\w+/;
              let n = { type: t.exec(e)[0], data: {} },
                r = [];
              for (const t = / (\w+):(?:([^ "]+)|"([^"]+)")/g; (r = t.exec(e)); ) n.data[r[1]] = r[2] || r[3];
              return n;
            },
          };
        },
        {},
      ],
      4: [
        function (e, t) {
          t.exports = {
            translate: function (e) {
              const { x: t, y: n, z: r } = e;
              let s = {};
              return void 0 !== t && (s.x = t + 650), void 0 !== n && (s.y = -n + 1e3), void 0 !== r && (s.z = r), s;
            },
            untranslate: function (e) {
              const { x: t, y: n, z: r } = e;
              return { x: t - 650, y: 1e3 - n, z: r - 0 };
            },
          };
        },
        {},
      ],
      5: [
        function (e, t) {
          const { check: n, isObject: r, isNumber: s, isString: o, isBoolean: a, hasSomeKeys: i, hasKeys: u, checkKeys: l } = e("./check.js");
          t.exports = {
            xy: (e) => {
              n(e, [r, i(["x", "y"]), l({ x: s, y: s })]);
            },
            xyz: (e) => {
              n(e, [r, i(["x", "y", "z"]), l({ x: s, y: s, z: s })]);
            },
            cmd: (e) => {
              n(e, [r, u("g"), l({ g: o, params: r })]);
            },
            lift: (e) => {
              n(e, a);
            },
            name: (e) => {
              n(e, o);
            },
            wifi: (e) => {
              n(e, [r, u("ssid"), l({ ssid: o, password: o })]);
            },
          };
        },
        { "./check.js": 2 },
      ],
      6: [
        function (t, n, r) {
          "use strict";
          function s(e) {
            switch (e) {
              case null:
                return "null";
              case !0:
              case !1:
                return "boolean";
              default:
            }
            switch (typeof e) {
              case "undefined":
                return "undefined";
              case "string":
                return "string";
              case "number":
                return "number";
              case "symbol":
                return "symbol";
              default:
            }
            if (s.function_(e)) return "Function";
            if (s.observable(e)) return "Observable";
            if (Array.isArray(e)) return "Array";
            if (u(e)) return "Buffer";
            const t = l(e);
            if (t) return t;
            if (e instanceof String || e instanceof Boolean || e instanceof Number) throw new TypeError("Please don't use object wrappers for primitive types");
            return "Object";
          }
          Object.defineProperty(r, "__esModule", { value: !0 });
          const o = "undefined" == typeof URL ? t("url").URL : URL,
            a = Object.prototype.toString,
            i = (e) => (t) => typeof t === e,
            u = (e) => !s.nullOrUndefined(e) && !s.nullOrUndefined(e.constructor) && s.function_(e.constructor.isBuffer) && e.constructor.isBuffer(e),
            l = (e) => {
              const t = a.call(e).slice(8, -1);
              return t ? t : null;
            },
            d = (e) => (t) => l(t) === e;
          (function (t) {
            var n = Number.isNaN;
            const r = (e) => "object" == typeof e;
            (t.undefined = i("undefined")),
              (t.string = i("string")),
              (t.number = i("number")),
              (t.function_ = i("function")),
              (t.null_ = (e) => null === e),
              (t.class_ = (e) => t.function_(e) && e.toString().startsWith("class ")),
              (t.boolean = (e) => !0 === e || !1 === e),
              (t.symbol = i("symbol")),
              (t.numericString = (e) => t.string(e) && 0 < e.length && !n(+e)),
              (t.array = Array.isArray),
              (t.buffer = u),
              (t.nullOrUndefined = (e) => t.null_(e) || t.undefined(e)),
              (t.object = (e) => !t.nullOrUndefined(e) && (t.function_(e) || r(e))),
              (t.iterable = (e) => !t.nullOrUndefined(e) && t.function_(e[Symbol.iterator])),
              (t.asyncIterable = (e) => !t.nullOrUndefined(e) && t.function_(e[Symbol.asyncIterator])),
              (t.generator = (e) => t.iterable(e) && t.function_(e.next) && t.function_(e.throw)),
              (t.nativePromise = (e) => d("Promise")(e));
            const s = (e) => !t.null_(e) && r(e) && t.function_(e.then) && t.function_(e.catch);
            (t.promise = (e) => t.nativePromise(e) || s(e)),
              (t.generatorFunction = d("GeneratorFunction")),
              (t.asyncFunction = d("AsyncFunction")),
              (t.boundFunction = (e) => t.function_(e) && !e.hasOwnProperty("prototype")),
              (t.regExp = d("RegExp")),
              (t.date = d("Date")),
              (t.error = d("Error")),
              (t.map = (e) => d("Map")(e)),
              (t.set = (e) => d("Set")(e)),
              (t.weakMap = (e) => d("WeakMap")(e)),
              (t.weakSet = (e) => d("WeakSet")(e)),
              (t.int8Array = d("Int8Array")),
              (t.uint8Array = d("Uint8Array")),
              (t.uint8ClampedArray = d("Uint8ClampedArray")),
              (t.int16Array = d("Int16Array")),
              (t.uint16Array = d("Uint16Array")),
              (t.int32Array = d("Int32Array")),
              (t.uint32Array = d("Uint32Array")),
              (t.float32Array = d("Float32Array")),
              (t.float64Array = d("Float64Array")),
              (t.arrayBuffer = d("ArrayBuffer")),
              (t.sharedArrayBuffer = d("SharedArrayBuffer")),
              (t.dataView = d("DataView")),
              (t.directInstanceOf = (e, t) => Object.getPrototypeOf(e) === t.prototype),
              (t.urlInstance = (e) => d("URL")(e)),
              (t.urlString = (e) => {
                if (!t.string(e)) return !1;
                try {
                  return new o(e), !0;
                } catch (e) {
                  return !1;
                }
              }),
              (t.truthy = (e) => !!e),
              (t.falsy = (e) => !e),
              (t.nan = (e) => n(e));
            const a = new Set(["undefined", "string", "number", "boolean", "symbol"]);
            (t.primitive = (e) => t.null_(e) || a.has(typeof e)),
              (t.integer = (t) => e(t)),
              (t.safeInteger = (e) => Number.isSafeInteger(e)),
              (t.plainObject = (e) => {
                let t;
                return "Object" === l(e) && ((t = Object.getPrototypeOf(e)), null === t || t === Object.getPrototypeOf({}));
              });
            const p = new Set(["Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Uint16Array", "Int32Array", "Uint32Array", "Float32Array", "Float64Array"]);
            t.typedArray = (e) => {
              const t = l(e);
              return null !== t && p.has(t);
            };
            const h = (e) => t.safeInteger(e) && -1 < e;
            (t.arrayLike = (e) => !t.nullOrUndefined(e) && !t.function_(e) && h(e.length)),
              (t.inRange = (e, n) => {
                var r = Math.max,
                  s = Math.min;
                if (t.number(n)) return e >= s(0, n) && e <= r(n, 0);
                if (t.array(n) && 2 === n.length) return e >= s(...n) && e <= r(...n);
                throw new TypeError(`Invalid range: ${JSON.stringify(n)}`);
              });
            const c = ["innerHTML", "ownerDocument", "style", "attributes", "nodeValue"];
            (t.domElement = (e) => t.object(e) && e.nodeType === 1 && t.string(e.nodeName) && !t.plainObject(e) && c.every((t) => t in e)),
              (t.observable = (e) => !!e && (!!(e[Symbol.observable] && e === e[Symbol.observable]()) || !!(e["@@observable"] && e === e["@@observable"]()))),
              (t.nodeStream = (e) => !t.nullOrUndefined(e) && r(e) && t.function_(e.pipe) && !t.observable(e)),
              (t.infinite = (e) => e === 1 / 0 || e === -Infinity);
            const m = (e) => (n) => t.integer(n) && Math.abs(n % 2) === e;
            (t.even = m(0)), (t.odd = m(1));
            const f = (e) => t.string(e) && !1 === /\S/.test(e);
            (t.emptyArray = (e) => t.array(e) && 0 === e.length),
              (t.nonEmptyArray = (e) => t.array(e) && 0 < e.length),
              (t.emptyString = (e) => t.string(e) && 0 === e.length),
              (t.nonEmptyString = (e) => t.string(e) && 0 < e.length),
              (t.emptyStringOrWhitespace = (e) => t.emptyString(e) || f(e)),
              (t.emptyObject = (e) => t.object(e) && !t.map(e) && !t.set(e) && 0 === Object.keys(e).length),
              (t.nonEmptyObject = (e) => t.object(e) && !t.map(e) && !t.set(e) && 0 < Object.keys(e).length),
              (t.emptySet = (e) => t.set(e) && 0 === e.size),
              (t.nonEmptySet = (e) => t.set(e) && 0 < e.size),
              (t.emptyMap = (e) => t.map(e) && 0 === e.size),
              (t.nonEmptyMap = (e) => t.map(e) && 0 < e.size);
            const y = (e, n, r) => {
              if (!1 === t.function_(n)) throw new TypeError(`Invalid predicate: ${JSON.stringify(n)}`);
              if (0 === r.length) throw new TypeError("Invalid number of values");
              return e.call(r, n);
            };
            (t.any = (e, ...t) => y(Array.prototype.some, e, t)), (t.all = (e, ...t) => y(Array.prototype.every, e, t));
          })(s || (s = {})),
            Object.defineProperties(s, { class: { value: s.class_ }, function: { value: s.function_ }, null: { value: s.null_ } }),
            (r.default = s),
            (n.exports = s),
            (n.exports.default = s);
        },
        { url: 22 },
      ],
      7: [
        function (e, t) {
          (function (e) {
            var n = null;
            "undefined" == typeof WebSocket
              ? "undefined" == typeof MozWebSocket
                ? "undefined" == typeof e
                  ? "undefined" == typeof window
                    ? "undefined" != typeof self && (n = self.WebSocket || self.MozWebSocket)
                    : (n = window.WebSocket || window.MozWebSocket)
                  : (n = e.WebSocket || e.MozWebSocket)
                : (n = MozWebSocket)
              : (n = WebSocket),
              (t.exports = n);
          }.call(this, "undefined" == typeof global ? ("undefined" == typeof self ? ("undefined" == typeof window ? {} : window) : self) : global));
        },
        {},
      ],
      8: [
        function (e, t) {
          "use strict";
          t.exports = function (e) {
            for (var t = {}, n = Object.keys(Object(e)), r = 0; r < n.length; r++) t[n[r].toLowerCase()] = e[n[r]];
            return t;
          };
        },
        {},
      ],
      9: [
        function (e, t) {
          function n(e, t) {
            if (!e) throw new Error(t || "AssertionError");
          }
          (n.notEqual = function (e, t, r) {
            n(e != t, r);
          }),
            (n.notOk = function (e, t) {
              n(!e, t);
            }),
            (n.equal = function (e, t, r) {
              n(e == t, r);
            }),
            (n.ok = n),
            (t.exports = n);
        },
        {},
      ],
      10: [
        function (e, t) {
          function n(e) {
            return this instanceof n ? void ((this._name = e || "nanobus"), (this._starListeners = []), (this._listeners = {})) : new n(e);
          }
          var r = e("remove-array-items"),
            s = e("nanotiming"),
            o = e("assert");
          (t.exports = n),
            (n.prototype.emit = function (e) {
              o.ok("string" == typeof e || "symbol" == typeof e, "nanobus.emit: eventName should be type string or symbol");
              for (var t = [], n = 1, r = arguments.length; n < r; n++) t.push(arguments[n]);
              var a = s(this._name + "('" + e.toString() + "')"),
                u = this._listeners[e];
              return u && 0 < u.length && this._emit(this._listeners[e], t), 0 < this._starListeners.length && this._emit(this._starListeners, e, t, a.uuid), a(), this;
            }),
            (n.prototype.on = n.prototype.addListener = function (e, t) {
              return (
                o.ok("string" == typeof e || "symbol" == typeof e, "nanobus.on: eventName should be type string or symbol"),
                o.equal(typeof t, "function", "nanobus.on: listener should be type function"),
                "*" === e ? this._starListeners.push(t) : (!this._listeners[e] && (this._listeners[e] = []), this._listeners[e].push(t)),
                this
              );
            }),
            (n.prototype.prependListener = function (e, t) {
              return (
                o.ok("string" == typeof e || "symbol" == typeof e, "nanobus.prependListener: eventName should be type string or symbol"),
                o.equal(typeof t, "function", "nanobus.prependListener: listener should be type function"),
                "*" === e ? this._starListeners.unshift(t) : (!this._listeners[e] && (this._listeners[e] = []), this._listeners[e].unshift(t)),
                this
              );
            }),
            (n.prototype.once = function (e, t) {
              function n() {
                t.apply(r, arguments), r.removeListener(e, n);
              }
              o.ok("string" == typeof e || "symbol" == typeof e, "nanobus.once: eventName should be type string or symbol"), o.equal(typeof t, "function", "nanobus.once: listener should be type function");
              var r = this;
              return this.on(e, n), this;
            }),
            (n.prototype.prependOnceListener = function (e, t) {
              function n() {
                t.apply(r, arguments), r.removeListener(e, n);
              }
              o.ok("string" == typeof e || "symbol" == typeof e, "nanobus.prependOnceListener: eventName should be type string or symbol"), o.equal(typeof t, "function", "nanobus.prependOnceListener: listener should be type function");
              var r = this;
              return this.prependListener(e, n), this;
            }),
            (n.prototype.removeListener = function (e, t) {
              function n(e, t) {
                if (e) {
                  var n = e.indexOf(t);
                  if (-1 !== n) return r(e, n, 1), !0;
                }
              }
              return (
                o.ok("string" == typeof e || "symbol" == typeof e, "nanobus.removeListener: eventName should be type string or symbol"),
                o.equal(typeof t, "function", "nanobus.removeListener: listener should be type function"),
                "*" === e ? ((this._starListeners = this._starListeners.slice()), n(this._starListeners, t)) : ("undefined" != typeof this._listeners[e] && (this._listeners[e] = this._listeners[e].slice()), n(this._listeners[e], t))
              );
            }),
            (n.prototype.removeAllListeners = function (e) {
              return e ? ("*" === e ? (this._starListeners = []) : (this._listeners[e] = [])) : ((this._starListeners = []), (this._listeners = {})), this;
            }),
            (n.prototype.listeners = function (e) {
              var t = "*" === e ? this._starListeners : this._listeners[e],
                n = [];
              if (t) for (var r = t.length, s = 0; s < r; s++) n.push(t[s]);
              return n;
            }),
            (n.prototype._emit = function (e, t, n, r) {
              if ("undefined" != typeof e && 0 !== e.length) {
                void 0 === n && ((n = t), (t = null)), t && (void 0 === r ? (n = [t].concat(n)) : (n = [t].concat(n, r)));
                for (var s, o = e.length, a = 0; a < o; a++) (s = e[a]), s.apply(s, n);
              }
            });
        },
        { assert: 9, nanotiming: 12, "remove-array-items": 21 },
      ],
      11: [
        function (e, t) {
          function n(e) {
            (this.hasWindow = e), (this.hasIdle = this.hasWindow && window.requestIdleCallback), (this.method = this.hasIdle ? window.requestIdleCallback.bind(window) : this.setTimeout), (this.scheduled = !1), (this.queue = []);
          }
          var r = e("assert"),
            s = "undefined" != typeof window;
          (n.prototype.push = function (e) {
            r.equal(typeof e, "function", "nanoscheduler.push: cb should be type function"), this.queue.push(e), this.schedule();
          }),
            (n.prototype.schedule = function () {
              if (!this.scheduled) {
                this.scheduled = !0;
                var e = this;
                this.method(function (t) {
                  for (var n; e.queue.length && 0 < t.timeRemaining(); ) (n = e.queue.shift()), n(t);
                  (e.scheduled = !1), e.queue.length && e.schedule();
                });
              }
            }),
            (n.prototype.setTimeout = function (e) {
              setTimeout(e, 0, {
                timeRemaining: function () {
                  return 1;
                },
              });
            }),
            (t.exports = function () {
              var e;
              return s ? (!window._nanoScheduler && (window._nanoScheduler = new n(!0)), (e = window._nanoScheduler)) : (e = new n()), e;
            });
        },
        { assert: 9 },
      ],
      12: [
        function (e, t) {
          function n(e) {
            var i = Number.MAX_SAFE_INTEGER;
            function t(t) {
              var n = "end-" + u + "-" + e;
              s.mark(n),
                o.push(function () {
                  var r = null;
                  try {
                    s.measure(e + " [" + u + "]", l, n), s.clearMarks(l), s.clearMarks(n);
                  } catch (t) {
                    r = t;
                  }
                  t && t(r, e);
                });
            }
            if ((a.equal(typeof e, "string", "nanotiming: name should be type string"), n.disabled)) return r;
            var u = (1e4 * s.now()).toFixed() % i,
              l = "start-" + u + "-" + e;
            return s.mark(l), (t.uuid = u), t;
          }
          function r(e) {
            e &&
              o.push(function () {
                e(new Error("nanotiming: performance API unavailable"));
              });
          }
          var s,
            o = e("nanoscheduler")(),
            a = e("assert");
          n.disabled = !0;
          try {
            (s = window.performance), (n.disabled = "true" === window.localStorage.DISABLE_NANOTIMING || !s.mark);
          } catch (t) {}
          t.exports = n;
        },
        { assert: 9, nanoscheduler: 11 },
      ],
      13: [
        function (t, n) {
          "use strict";
          const r = t("p-timeout"),
            s = Symbol.asyncIterator || "@@asyncIterator",
            o = (e) => {
              const t = e.on || e.addListener || e.addEventListener,
                n = e.off || e.removeListener || e.removeEventListener;
              if (!t || !n) throw new TypeError("Emitter is not compatible");
              return { addListener: t.bind(e), removeListener: n.bind(e) };
            },
            a = (t, n, s) => {
              let a;
              const i = new Promise((r, i) => {
                if (((s = Object.assign({ rejectionEvents: ["error"], multiArgs: !1, resolveImmediately: !1 }, s)), !(0 <= s.count && (s.count === 1 / 0 || e(s.count)))))
                  throw new TypeError("The `count` option should be at least 0 or more");
                const u = [],
                  { addListener: l, removeListener: d } = o(t),
                  p = (...e) => {
                    const t = s.multiArgs ? e : e[0];
                    (s.filter && !s.filter(t)) || (u.push(t), s.count === u.length && (a(), r(u)));
                  },
                  h = (e) => {
                    a(), i(e);
                  };
                (a = () => {
                  d(n, p);
                  for (const e of s.rejectionEvents) d(e, h);
                }),
                  l(n, p);
                for (const e of s.rejectionEvents) l(e, h);
                s.resolveImmediately && r(u);
              });
              if (((i.cancel = a), "number" == typeof s.timeout)) {
                const e = r(i, s.timeout);
                return (e.cancel = a), e;
              }
              return i;
            };
          (n.exports = (e, t, n) => {
            "function" == typeof n && (n = { filter: n }), (n = Object.assign({}, n, { count: 1, resolveImmediately: !1 }));
            const r = a(e, t, n),
              s = r.then((e) => e[0]);
            return (s.cancel = r.cancel), s;
          }),
            (n.exports.multiple = a),
            (n.exports.iterator = (e, t, n) => {
              "function" == typeof n && (n = { filter: n }), (n = Object.assign({ rejectionEvents: ["error"], resolutionEvents: [], multiArgs: !1 }, n));
              const { addListener: r, removeListener: a } = o(e);
              let i,
                u = !1,
                l = !1;
              const d = [],
                p = [],
                h = (...e) => {
                  const t = n.multiArgs ? e : e[0];
                  if (0 < d.length) {
                    const { resolve: e } = d.shift();
                    return e({ done: !1, value: t });
                  }
                  p.push(t);
                },
                c = () => {
                  (u = !0), a(t, h);
                  for (const e of n.rejectionEvents) a(e, m);
                  for (const e of n.resolutionEvents) a(e, f);
                  for (; 0 < d.length; ) {
                    const { resolve: e } = d.shift();
                    e({ done: !0, value: void 0 });
                  }
                },
                m = (...e) => {
                  if (((i = n.multiArgs ? e : e[0]), 0 < d.length)) {
                    const { reject: e } = d.shift();
                    e(i);
                  } else l = !0;
                  c();
                },
                f = (...e) => {
                  const t = n.multiArgs ? e : e[0];
                  if (!n.filter || n.filter(t)) {
                    if (0 < d.length) {
                      const { resolve: e } = d.shift();
                      e({ done: !0, value: t });
                    } else p.push(t);
                    c();
                  }
                };
              r(t, h);
              for (const s of n.rejectionEvents) r(s, m);
              for (const s of n.resolutionEvents) r(s, f);
              return {
                [s]() {
                  return this;
                },
                next() {
                  if (0 < p.length) {
                    const e = p.shift();
                    return Promise.resolve({ done: u && 0 === p.length, value: e });
                  }
                  return l ? ((l = !1), Promise.reject(i)) : u ? Promise.resolve({ done: !0, value: void 0 }) : new Promise((e, t) => d.push({ resolve: e, reject: t }));
                },
                return(e) {
                  return c(), { done: u, value: e };
                },
              };
            });
        },
        { "p-timeout": 16 },
      ],
      14: [
        function (e, t) {
          "use strict";
          t.exports = (e, t) => (
            (t = t || (() => {})),
            e.then(
              (e) =>
                new Promise((e) => {
                  e(t());
                }).then(() => e),
              (e) =>
                new Promise((e) => {
                  e(t());
                }).then(() => {
                  throw e;
                })
            )
          );
        },
        {},
      ],
      15: [
        function (e, t) {
          "use strict";
          function n(e, t, n) {
            let r = 0,
              s = e.length;
            for (; 0 < s; ) {
              const o = 0 | (s / 2);
              let a = r + o;
              0 >= n(e[a], t) ? ((r = ++a), (s -= o + 1)) : (s = o);
            }
            return r;
          }
          class r {
            constructor() {
              this._queue = [];
            }
            enqueue(e, t) {
              t = Object.assign({ priority: 0 }, t);
              const r = { priority: t.priority, run: e };
              if (this.size && this._queue[this.size - 1].priority >= t.priority) return void this._queue.push(r);
              const s = n(this._queue, r, (e, t) => t.priority - e.priority);
              this._queue.splice(s, 0, r);
            }
            dequeue() {
              return this._queue.shift().run;
            }
            get size() {
              return this._queue.length;
            }
          }
          class s {
            constructor(e) {
              var t = Number.isFinite;
              if (((e = Object.assign({ carryoverConcurrencyCount: !1, intervalCap: 1 / 0, interval: 0, concurrency: 1 / 0, autoStart: !0, queueClass: r }, e)), !("number" == typeof e.concurrency && 1 <= e.concurrency)))
                throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e.concurrency}\` (${typeof e.concurrency})`);
              if (!("number" == typeof e.intervalCap && 1 <= e.intervalCap)) throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${e.intervalCap}\` (${typeof e.intervalCap})`);
              if (!("number" == typeof e.interval && t(e.interval) && 0 <= e.interval)) throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${e.interval}\` (${typeof e.interval})`);
              (this._carryoverConcurrencyCount = e.carryoverConcurrencyCount),
                (this._isIntervalIgnored = e.intervalCap === 1 / 0 || 0 === e.interval),
                (this._intervalCount = 0),
                (this._intervalCap = e.intervalCap),
                (this._interval = e.interval),
                (this._intervalId = null),
                (this._intervalEnd = 0),
                (this._timeoutId = null),
                (this.queue = new e.queueClass()),
                (this._queueClass = e.queueClass),
                (this._pendingCount = 0),
                (this._concurrency = e.concurrency),
                (this._isPaused = !1 === e.autoStart),
                (this._resolveEmpty = () => {}),
                (this._resolveIdle = () => {});
            }
            get _doesIntervalAllowAnother() {
              return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
            }
            get _doesConcurrentAllowAnother() {
              return this._pendingCount < this._concurrency;
            }
            _next() {
              this._pendingCount--, this._tryToStartAnother();
            }
            _resolvePromises() {
              this._resolveEmpty(), (this._resolveEmpty = () => {}), 0 === this._pendingCount && (this._resolveIdle(), (this._resolveIdle = () => {}));
            }
            _onResumeInterval() {
              this._onInterval(), this._initializeIntervalIfNeeded(), (this._timeoutId = null);
            }
            _intervalPaused() {
              const e = Date.now();
              if (null === this._intervalId) {
                const t = this._intervalEnd - e;
                if (0 > t) this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
                else return null === this._timeoutId && (this._timeoutId = setTimeout(() => this._onResumeInterval(), t)), !0;
              }
              return !1;
            }
            _tryToStartAnother() {
              if (0 === this.queue.size) return clearInterval(this._intervalId), (this._intervalId = null), this._resolvePromises(), !1;
              if (!this._isPaused) {
                const e = !this._intervalPaused();
                if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) return this.queue.dequeue()(), e && this._initializeIntervalIfNeeded(), !0;
              }
              return !1;
            }
            _initializeIntervalIfNeeded() {
              this._isIntervalIgnored || null !== this._intervalId || ((this._intervalId = setInterval(() => this._onInterval(), this._interval)), (this._intervalEnd = Date.now() + this._interval));
            }
            _onInterval() {
              for (
                0 === this._intervalCount && 0 === this._pendingCount && (clearInterval(this._intervalId), (this._intervalId = null)), this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
                this._tryToStartAnother();

              );
            }
            add(e, t) {
              return new Promise((n, r) => {
                this.queue.enqueue(() => {
                  this._pendingCount++, this._intervalCount++;
                  try {
                    Promise.resolve(e()).then(
                      (e) => {
                        n(e), this._next();
                      },
                      (e) => {
                        r(e), this._next();
                      }
                    );
                  } catch (e) {
                    r(e), this._next();
                  }
                }, t),
                  this._tryToStartAnother();
              });
            }
            addAll(e, t) {
              return Promise.all(e.map((e) => this.add(e, t)));
            }
            start() {
              if (this._isPaused) for (this._isPaused = !1; this._tryToStartAnother(); );
            }
            pause() {
              this._isPaused = !0;
            }
            clear() {
              this.queue = new this._queueClass();
            }
            onEmpty() {
              return 0 === this.queue.size
                ? Promise.resolve()
                : new Promise((e) => {
                    const t = this._resolveEmpty;
                    this._resolveEmpty = () => {
                      t(), e();
                    };
                  });
            }
            onIdle() {
              return 0 === this._pendingCount && 0 === this.queue.size
                ? Promise.resolve()
                : new Promise((e) => {
                    const t = this._resolveIdle;
                    this._resolveIdle = () => {
                      t(), e();
                    };
                  });
            }
            get size() {
              return this.queue.size;
            }
            get pending() {
              return this._pendingCount;
            }
            get isPaused() {
              return this._isPaused;
            }
          }
          t.exports = s;
        },
        {},
      ],
      16: [
        function (e, t) {
          "use strict";
          const n = e("p-finally");
          class r extends Error {
            constructor(e) {
              super(e), (this.name = "TimeoutError");
            }
          }
          (t.exports = (e, t, s) =>
            new Promise((o, a) => {
              if ("number" != typeof t || 0 > t) throw new TypeError("Expected `ms` to be a positive number");
              const i = setTimeout(() => {
                if ("function" == typeof s) {
                  try {
                    o(s());
                  } catch (e) {
                    a(e);
                  }
                  return;
                }
                const n = "string" == typeof s ? s : `Promise timed out after ${t} milliseconds`,
                  i = s instanceof Error ? s : new r(n);
                "function" == typeof e.cancel && e.cancel(), a(i);
              }, t);
              n(e.then(o, a), () => {
                clearTimeout(i);
              });
            })),
            (t.exports.TimeoutError = r);
        },
        { "p-finally": 14 },
      ],
      17: [
        function (e, n, r) {
          (function (e) {
            /*! https://mths.be/punycode v1.4.1 by @mathias */ (function (s) {
              var f = String.fromCharCode,
                y = Math.floor;
              function o(e) {
                throw new RangeError(I[e]);
              }
              function a(e, t) {
                for (var n = e.length, r = []; n--; ) r[n] = t(e[n]);
                return r;
              }
              function i(e, t) {
                var n = e.split("@"),
                  r = "";
                1 < n.length && ((r = n[0] + "@"), (e = n[1])), (e = e.replace(q, "."));
                var s = e.split("."),
                  o = a(s, t).join(".");
                return r + o;
              }
              function u(e) {
                for (var t, n, r = [], s = 0, o = e.length; s < o; )
                  (t = e.charCodeAt(s++)), 55296 <= t && 56319 >= t && s < o ? ((n = e.charCodeAt(s++)), 56320 == (64512 & n) ? r.push(((1023 & t) << 10) + (1023 & n) + 65536) : (r.push(t), s--)) : r.push(t);
                return r;
              }
              function l(e) {
                return a(e, function (e) {
                  var t = "";
                  return 65535 < e && ((e -= 65536), (t += O(55296 | (1023 & (e >>> 10)))), (e = 56320 | (1023 & e))), (t += O(e)), t;
                }).join("");
              }
              function d(e) {
                return 10 > e - 48 ? e - 22 : 26 > e - 65 ? e - 65 : 26 > e - 97 ? e - 97 : 36;
              }
              function p(e, t) {
                return e + 22 + 75 * (26 > e) - ((0 != t) << 5);
              }
              function h(e, t, n) {
                var r = 0;
                for (e = n ? C(e / 700) : e >> 1, e += C(e / t); 455 < e; r += 36) e = C(e / 35);
                return C(r + (36 * e) / (e + 38));
              }
              function c(e) {
                var r,
                  s,
                  a,
                  u,
                  p,
                  c,
                  m,
                  f,
                  y,
                  g,
                  _ = [],
                  v = e.length,
                  b = 0,
                  x = 128,
                  A = 72;
                for (s = e.lastIndexOf("-"), 0 > s && (s = 0), a = 0; a < s; ++a) 128 <= e.charCodeAt(a) && o("not-basic"), _.push(e.charCodeAt(a));
                for (u = 0 < s ? s + 1 : 0; u < v; ) {
                  for (p = b, c = 1, m = 36; ; m += 36) {
                    if ((u >= v && o("invalid-input"), (f = d(e.charCodeAt(u++))), (36 <= f || f > C((2147483647 - b) / c)) && o("overflow"), (b += f * c), (y = m <= A ? 1 : m >= A + 26 ? 26 : m - A), f < y)) break;
                    (g = 36 - y), c > C(2147483647 / g) && o("overflow"), (c *= g);
                  }
                  (r = _.length + 1), (A = h(b - p, r, 0 == p)), C(b / r) > 2147483647 - x && o("overflow"), (x += C(b / r)), (b %= r), _.splice(b++, 0, x);
                }
                return l(_);
              }
              function m(e) {
                var r,
                  s,
                  a,
                  i,
                  l,
                  d,
                  c,
                  f,
                  y,
                  g,
                  _,
                  v,
                  b,
                  x,
                  A,
                  I = [];
                for (e = u(e), v = e.length, r = 128, s = 0, l = 72, d = 0; d < v; ++d) (_ = e[d]), 128 > _ && I.push(O(_));
                for (a = i = I.length, i && I.push("-"); a < v; ) {
                  for (c = 2147483647, d = 0; d < v; ++d) (_ = e[d]), _ >= r && _ < c && (c = _);
                  for (b = a + 1, c - r > C((2147483647 - s) / b) && o("overflow"), s += (c - r) * b, r = c, d = 0; d < v; ++d)
                    if (((_ = e[d]), _ < r && 2147483647 < ++s && o("overflow"), _ == r)) {
                      for (f = s, y = 36; ; y += 36) {
                        if (((g = y <= l ? 1 : y >= l + 26 ? 26 : y - l), f < g)) break;
                        (A = f - g), (x = 36 - g), I.push(O(p(g + (A % x), 0))), (f = C(A / x));
                      }
                      I.push(O(p(f, 0))), (l = h(s, b, a == i)), (s = 0), ++a;
                    }
                  ++s, ++r;
                }
                return I.join("");
              }
              var g = "object" == typeof r && r && !r.nodeType && r,
                _ = "object" == typeof n && n && !n.nodeType && n,
                v = "object" == typeof e && e;
              (v.global === v || v.window === v || v.self === v) && (s = v);
              var b,
                x,
                A = /^xn--/,
                j = /[^\x20-\x7E]/,
                q = /[\x2E\u3002\uFF0E\uFF61]/g,
                I = { overflow: "Overflow: input needs wider integers to process", "not-basic": "Illegal input >= 0x80 (not a basic code point)", "invalid-input": "Invalid input" },
                C = y,
                O = f;
              if (
                ((b = {
                  version: "1.4.1",
                  ucs2: { decode: u, encode: l },
                  decode: c,
                  encode: m,
                  toASCII: function (e) {
                    return i(e, function (e) {
                      return j.test(e) ? "xn--" + m(e) : e;
                    });
                  },
                  toUnicode: function (e) {
                    return i(e, function (e) {
                      return A.test(e) ? c(e.slice(4).toLowerCase()) : e;
                    });
                  },
                }),
                "function" == typeof t && "object" == typeof t.amd && t.amd)
              )
                t("punycode", function () {
                  return b;
                });
              else if (!(g && _)) s.punycode = b;
              else if (n.exports == g) _.exports = b;
              else for (x in b) b.hasOwnProperty(x) && (g[x] = b[x]);
            })(this);
          }.call(this, "undefined" == typeof global ? ("undefined" == typeof self ? ("undefined" == typeof window ? {} : window) : self) : global));
        },
        {},
      ],
      18: [
        function (e, t) {
          "use strict";
          function n(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
          }
          t.exports = function (e, t, s, o) {
            (t = t || "&"), (s = s || "=");
            var a = {};
            if ("string" != typeof e || 0 === e.length) return a;
            var u = /\+/g;
            e = e.split(t);
            var l = 1e3;
            o && "number" == typeof o.maxKeys && (l = o.maxKeys);
            var d = e.length;
            0 < l && d > l && (d = l);
            for (var p = 0; p < d; ++p) {
              var h,
                c,
                m,
                f,
                y = e[p].replace(u, "%20"),
                g = y.indexOf(s);
              0 <= g ? ((h = y.substr(0, g)), (c = y.substr(g + 1))) : ((h = y), (c = "")), (m = decodeURIComponent(h)), (f = decodeURIComponent(c)), n(a, m) ? (r(a[m]) ? a[m].push(f) : (a[m] = [a[m], f])) : (a[m] = f);
            }
            return a;
          };
          var r =
            Array.isArray ||
            function (e) {
              return "[object Array]" === Object.prototype.toString.call(e);
            };
        },
        {},
      ],
      19: [
        function (e, t) {
          "use strict";
          function n(e, t) {
            if (e.map) return e.map(t);
            for (var n = [], r = 0; r < e.length; r++) n.push(t(e[r], r));
            return n;
          }
          var r = function (e) {
            switch (typeof e) {
              case "string":
                return e;
              case "boolean":
                return e ? "true" : "false";
              case "number":
                return isFinite(e) ? e : "";
              default:
                return "";
            }
          };
          t.exports = function (e, t, a, i) {
            return (
              (t = t || "&"),
              (a = a || "="),
              null === e && (e = void 0),
              "object" == typeof e
                ? n(o(e), function (o) {
                    var i = encodeURIComponent(r(o)) + a;
                    return s(e[o])
                      ? n(e[o], function (e) {
                          return i + encodeURIComponent(r(e));
                        }).join(t)
                      : i + encodeURIComponent(r(e[o]));
                  }).join(t)
                : i
                ? encodeURIComponent(r(i)) + a + encodeURIComponent(r(e))
                : ""
            );
          };
          var s =
              Array.isArray ||
              function (e) {
                return "[object Array]" === Object.prototype.toString.call(e);
              },
            o =
              Object.keys ||
              function (e) {
                var t = [];
                for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
                return t;
              };
        },
        {},
      ],
      20: [
        function (e, t, n) {
          "use strict";
          (n.decode = n.parse = e("./decode")), (n.encode = n.stringify = e("./encode"));
        },
        { "./decode": 18, "./encode": 19 },
      ],
      21: [
        function (e, t) {
          "use strict";
          t.exports = function (e, t, n) {
            var r,
              s = e.length;
            if (!(t >= s || 0 === n)) {
              n = t + n > s ? s - t : n;
              var o = s - n;
              for (r = t; r < o; ++r) e[r] = e[r + n];
              e.length = o;
            }
          };
        },
        {},
      ],
      22: [
        function (e, t, n) {
          "use strict";
          function r() {
            (this.protocol = null),
              (this.slashes = null),
              (this.auth = null),
              (this.host = null),
              (this.port = null),
              (this.hostname = null),
              (this.hash = null),
              (this.search = null),
              (this.query = null),
              (this.pathname = null),
              (this.path = null),
              (this.href = null);
          }
          function s(e, t, n) {
            if (e && a.isObject(e) && e instanceof r) return e;
            var s = new r();
            return s.parse(e, t, n), s;
          }
          var o = e("punycode"),
            a = e("./util");
          (n.parse = s),
            (n.resolve = function (e, t) {
              return s(e, !1, !0).resolve(t);
            }),
            (n.resolveObject = function (e, t) {
              return e ? s(e, !1, !0).resolveObject(t) : t;
            }),
            (n.format = function (e) {
              return a.isString(e) && (e = s(e)), e instanceof r ? e.format() : r.prototype.format.call(e);
            }),
            (n.Url = r);
          var u = /^([a-z0-9.+-]+:)/i,
            l = /:[0-9]*$/,
            d = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
            p = ["{", "}", "|", "\\", "^", "`"].concat(["<", ">", '"', "`", " ", "\r", "\n", "\t"]),
            h = ["'"].concat(p),
            c = ["%", "/", "?", ";", "#"].concat(h),
            m = ["/", "?", "#"],
            f = /^[+a-z0-9A-Z_-]{0,63}$/,
            y = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
            g = { javascript: !0, "javascript:": !0 },
            _ = { javascript: !0, "javascript:": !0 },
            b = { http: !0, https: !0, ftp: !0, gopher: !0, file: !0, "http:": !0, "https:": !0, "ftp:": !0, "gopher:": !0, "file:": !0 },
            x = e("querystring");
          (r.prototype.parse = function (e, t, n) {
            if (!a.isString(e)) throw new TypeError("Parameter 'url' must be a string, not " + typeof e);
            var r = e.indexOf("?"),
              v = -1 !== r && r < e.indexOf("#") ? "?" : "#",
              A = e.split(v),
              q = /\\/g;
            (A[0] = A[0].replace(q, "/")), (e = A.join(v));
            var I = e;
            if (((I = I.trim()), !n && 1 === e.split("#").length)) {
              var C = d.exec(I);
              if (C)
                return (this.path = I), (this.href = I), (this.pathname = C[1]), C[2] ? ((this.search = C[2]), (this.query = t ? x.parse(this.search.substr(1)) : this.search.substr(1))) : t && ((this.search = ""), (this.query = {})), this;
            }
            var O = u.exec(I);
            if (O) {
              O = O[0];
              var w = O.toLowerCase();
              (this.protocol = w), (I = I.substr(O.length));
            }
            if (n || O || I.match(/^\/\/[^@\/]+@[^@\/]+/)) {
              var S = "//" === I.substr(0, 2);
              S && !(O && _[O]) && ((I = I.substr(2)), (this.slashes = !0));
            }
            if (!_[O] && (S || (O && !b[O]))) {
              for (var L, E = -1, N = 0; N < m.length; N++) (L = I.indexOf(m[N])), -1 !== L && (-1 === E || L < E) && (E = L);
              var z, P;
              (P = -1 === E ? I.lastIndexOf("@") : I.lastIndexOf("@", E)), -1 !== P && ((z = I.slice(0, P)), (I = I.slice(P + 1)), (this.auth = decodeURIComponent(z))), (E = -1);
              for (var L, N = 0; N < c.length; N++) (L = I.indexOf(c[N])), -1 !== L && (-1 === E || L < E) && (E = L);
              -1 === E && (E = I.length), (this.host = I.slice(0, E)), (I = I.slice(E)), this.parseHost(), (this.hostname = this.hostname || "");
              var U = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
              if (!U)
                for (var M, T = this.hostname.split(/\./), N = 0, F = T.length; N < F; N++)
                  if (((M = T[N]), M && !M.match(f))) {
                    for (var W = "", B = 0, K = M.length; B < K; B++) W += 127 < M.charCodeAt(B) ? "x" : M[B];
                    if (!W.match(f)) {
                      var k = T.slice(0, N),
                        R = T.slice(N + 1),
                        G = M.match(y);
                      G && (k.push(G[1]), R.unshift(G[2])), R.length && (I = "/" + R.join(".") + I), (this.hostname = k.join("."));
                      break;
                    }
                  }
              (this.hostname = 255 < this.hostname.length ? "" : this.hostname.toLowerCase()), U || (this.hostname = o.toASCII(this.hostname));
              var D = this.port ? ":" + this.port : "",
                H = this.hostname || "";
              (this.host = H + D), (this.href += this.host), U && ((this.hostname = this.hostname.substr(1, this.hostname.length - 2)), "/" !== I[0] && (I = "/" + I));
            }
            if (!g[w])
              for (var V, N = 0, F = h.length; N < F; N++)
                if (((V = h[N]), -1 !== I.indexOf(V))) {
                  var Q = encodeURIComponent(V);
                  Q === V && (Q = escape(V)), (I = I.split(V).join(Q));
                }
            var X = I.indexOf("#");
            -1 !== X && ((this.hash = I.substr(X)), (I = I.slice(0, X)));
            var J = I.indexOf("?");
            if (
              (-1 === J ? t && ((this.search = ""), (this.query = {})) : ((this.search = I.substr(J)), (this.query = I.substr(J + 1)), t && (this.query = x.parse(this.query)), (I = I.slice(0, J))),
              I && (this.pathname = I),
              b[w] && this.hostname && !this.pathname && (this.pathname = "/"),
              this.pathname || this.search)
            ) {
              var D = this.pathname || "",
                Y = this.search || "";
              this.path = D + Y;
            }
            return (this.href = this.format()), this;
          }),
            (r.prototype.format = function () {
              var e = this.auth || "";
              e && ((e = encodeURIComponent(e)), (e = e.replace(/%3A/i, ":")), (e += "@"));
              var t = this.protocol || "",
                n = this.pathname || "",
                r = this.hash || "",
                s = !1,
                o = "";
              this.host ? (s = e + this.host) : this.hostname && ((s = e + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]")), this.port && (s += ":" + this.port)),
                this.query && a.isObject(this.query) && Object.keys(this.query).length && (o = x.stringify(this.query));
              var i = this.search || (o && "?" + o) || "";
              return (
                t && ":" !== t.substr(-1) && (t += ":"),
                this.slashes || ((!t || b[t]) && !1 != s) ? ((s = "//" + (s || "")), n && "/" !== n.charAt(0) && (n = "/" + n)) : !s && (s = ""),
                r && "#" !== r.charAt(0) && (r = "#" + r),
                i && "?" !== i.charAt(0) && (i = "?" + i),
                (n = n.replace(/[?#]/g, function (e) {
                  return encodeURIComponent(e);
                })),
                (i = i.replace("#", "%23")),
                t + s + n + i + r
              );
            }),
            (r.prototype.resolve = function (e) {
              return this.resolveObject(s(e, !1, !0)).format();
            }),
            (r.prototype.resolveObject = function (e) {
              if (a.isString(e)) {
                var t = new r();
                t.parse(e, !1, !0), (e = t);
              }
              for (var n, o = new r(), u = Object.keys(this), l = 0; l < u.length; l++) (n = u[l]), (o[n] = this[n]);
              if (((o.hash = e.hash), "" === e.href)) return (o.href = o.format()), o;
              if (e.slashes && !e.protocol) {
                for (var d, h = Object.keys(e), c = 0; c < h.length; c++) (d = h[c]), "protocol" !== d && (o[d] = e[d]);
                return b[o.protocol] && o.hostname && !o.pathname && (o.path = o.pathname = "/"), (o.href = o.format()), o;
              }
              if (e.protocol && e.protocol !== o.protocol) {
                if (!b[e.protocol]) {
                  for (var m, f = Object.keys(e), y = 0; y < f.length; y++) (m = f[y]), (o[m] = e[m]);
                  return (o.href = o.format()), o;
                }
                if (((o.protocol = e.protocol), !e.host && !_[e.protocol])) {
                  for (var g = (e.pathname || "").split("/"); g.length && !(e.host = g.shift()); );
                  e.host || (e.host = ""), e.hostname || (e.hostname = ""), "" !== g[0] && g.unshift(""), 2 > g.length && g.unshift(""), (o.pathname = g.join("/"));
                } else o.pathname = e.pathname;
                if (((o.search = e.search), (o.query = e.query), (o.host = e.host || ""), (o.auth = e.auth), (o.hostname = e.hostname || e.host), (o.port = e.port), o.pathname || o.search)) {
                  var x = o.pathname || "",
                    p = o.search || "";
                  o.path = x + p;
                }
                return (o.slashes = o.slashes || e.slashes), (o.href = o.format()), o;
              }
              var s = o.pathname && "/" === o.pathname.charAt(0),
                A = e.host || (e.pathname && "/" === e.pathname.charAt(0)),
                j = A || s || (o.host && e.pathname),
                q = j,
                I = (o.pathname && o.pathname.split("/")) || [],
                g = (e.pathname && e.pathname.split("/")) || [],
                C = o.protocol && !b[o.protocol];
              if (
                (C &&
                  ((o.hostname = ""),
                  (o.port = null),
                  o.host && ("" === I[0] ? (I[0] = o.host) : I.unshift(o.host)),
                  (o.host = ""),
                  e.protocol && ((e.hostname = null), (e.port = null), e.host && ("" === g[0] ? (g[0] = e.host) : g.unshift(e.host)), (e.host = null)),
                  (j = j && ("" === g[0] || "" === I[0]))),
                A)
              )
                (o.host = e.host || "" === e.host ? e.host : o.host), (o.hostname = e.hostname || "" === e.hostname ? e.hostname : o.hostname), (o.search = e.search), (o.query = e.query), (I = g);
              else if (g.length) I || (I = []), I.pop(), (I = I.concat(g)), (o.search = e.search), (o.query = e.query);
              else if (!a.isNullOrUndefined(e.search)) {
                if (C) {
                  o.hostname = o.host = I.shift();
                  var O = !!(o.host && 0 < o.host.indexOf("@")) && o.host.split("@");
                  O && ((o.auth = O.shift()), (o.host = o.hostname = O.shift()));
                }
                return (o.search = e.search), (o.query = e.query), (a.isNull(o.pathname) && a.isNull(o.search)) || (o.path = (o.pathname ? o.pathname : "") + (o.search ? o.search : "")), (o.href = o.format()), o;
              }
              if (!I.length) return (o.pathname = null), (o.path = o.search ? "/" + o.search : null), (o.href = o.format()), o;
              for (var w = I.slice(-1)[0], S = ((o.host || e.host || 1 < I.length) && ("." === w || ".." === w)) || "" === w, L = 0, E = I.length; 0 <= E; E--)
                (w = I[E]), "." === w ? I.splice(E, 1) : ".." === w ? (I.splice(E, 1), L++) : L && (I.splice(E, 1), L--);
              if (!j && !q) for (; L--; L) I.unshift("..");
              j && "" !== I[0] && (!I[0] || "/" !== I[0].charAt(0)) && I.unshift(""), S && "/" !== I.join("/").substr(-1) && I.push("");
              var N = "" === I[0] || (I[0] && "/" === I[0].charAt(0));
              if (C) {
                o.hostname = o.host = N ? "" : I.length ? I.shift() : "";
                var O = !!(o.host && 0 < o.host.indexOf("@")) && o.host.split("@");
                O && ((o.auth = O.shift()), (o.host = o.hostname = O.shift()));
              }
              return (
                (j = j || (o.host && I.length)),
                j && !N && I.unshift(""),
                I.length ? (o.pathname = I.join("/")) : ((o.pathname = null), (o.path = null)),
                (a.isNull(o.pathname) && a.isNull(o.search)) || (o.path = (o.pathname ? o.pathname : "") + (o.search ? o.search : "")),
                (o.auth = e.auth || o.auth),
                (o.slashes = o.slashes || e.slashes),
                (o.href = o.format()),
                o
              );
            }),
            (r.prototype.parseHost = function () {
              var e = this.host,
                t = l.exec(e);
              t && ((t = t[0]), ":" !== t && (this.port = t.substr(1)), (e = e.substr(0, e.length - t.length))), e && (this.hostname = e);
            });
        },
        { "./util": 23, punycode: 17, querystring: 20 },
      ],
      23: [
        function (e, t) {
          "use strict";
          t.exports = {
            isString: function (e) {
              return "string" == typeof e;
            },
            isObject: function (e) {
              return "object" == typeof e && null !== e;
            },
            isNull: function (e) {
              return null === e;
            },
            isNullOrUndefined: function (e) {
              return null == e;
            },
          };
        },
        {},
      ],
      24: [
        function (e, t) {
          t.exports = e("./lib/LineUs.js");
        },
        { "./lib/LineUs.js": 1 },
      ],
    },
    {},
    [24]
  )(24);
});
