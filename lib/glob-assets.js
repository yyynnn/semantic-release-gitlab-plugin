const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _regenerator = _interopRequireDefault(
  require('@babel/runtime/regenerator'),
);

const _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
);

const _toConsumableArray2 = _interopRequireDefault(
  require('@babel/runtime/helpers/toConsumableArray'),
);

const _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator'),
);

const _path = require('path');

const _lodash = require('lodash');

const _dirGlob = _interopRequireDefault(require('dir-glob'));

const _globby = _interopRequireDefault(require('globby'));

function ownKeys(object, enumerableOnly) {
  const keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    let symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (let i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        (0, _defineProperty2.default)(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key),
        );
      });
    }
  }
  return target;
}

const debug = require('debug')('semantic-release:github');

const _default =
  /* #__PURE__ */
  (function() {
    const _ref = (0, _asyncToGenerator2.default)(
      /* #__PURE__ */
      _regenerator.default.mark(function _callee2(_ref2, assets) {
        let _ref3;

        let cwd;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                cwd = _ref2.cwd;
                _context2.t0 = _lodash.uniqWith;
                _context2.t1 = (_ref3 = []).concat;
                _context2.t2 = _ref3;
                _context2.t3 = _toConsumableArray2.default;
                _context2.next = 7;
                return Promise.all(
                  assets.map(
                    /* #__PURE__ */
                    (function() {
                      const _ref4 = (0, _asyncToGenerator2.default)(
                        /* #__PURE__ */
                        _regenerator.default.mark(function _callee(asset) {
                          let glob;
                          let globbed;
                          return _regenerator.default.wrap(function _callee$(
                            _context,
                          ) {
                            while (1) {
                              switch ((_context.prev = _context.next)) {
                                case 0:
                                  // Wrap single glob definition in Array
                                  glob = (0, _lodash.castArray)(
                                    (0, _lodash.isPlainObject)(asset)
                                      ? asset.path
                                      : asset,
                                  ); // TODO Temporary workaround for https://github.com/mrmlnc/fast-glob/issues/47

                                  _context.t0 = _lodash.uniq;
                                  _context.t1 = [];
                                  _context.t2 = _toConsumableArray2.default;
                                  _context.next = 6;
                                  return (0, _dirGlob.default)(glob, {
                                    cwd,
                                  });

                                case 6:
                                  _context.t3 = _context.sent;
                                  _context.t4 = (0, _context.t2)(_context.t3);
                                  _context.t5 = (0,
                                  _toConsumableArray2.default)(glob);
                                  _context.t6 = _context.t1.concat.call(
                                    _context.t1,
                                    _context.t4,
                                    _context.t5,
                                  );
                                  glob = (0, _context.t0)(_context.t6);

                                  if (
                                    !(
                                      glob.length <= 1 &&
                                      glob[0].startsWith('!')
                                    )
                                  ) {
                                    _context.next = 14;
                                    break;
                                  }

                                  debug(
                                    'skipping the negated glob %o as its alone in its group and would retrieve a large amount of files',
                                    glob[0],
                                  );
                                  return _context.abrupt('return', []);

                                case 14:
                                  _context.next = 16;
                                  return (0, _globby.default)(glob, {
                                    cwd,
                                    expandDirectories: false,
                                    // TODO Temporary workaround for https://github.com/mrmlnc/fast-glob/issues/47
                                    gitignore: false,
                                    dot: true,
                                    onlyFiles: false,
                                  });

                                case 16:
                                  globbed = _context.sent;

                                  if (!(0, _lodash.isPlainObject)(asset)) {
                                    _context.next = 21;
                                    break;
                                  }

                                  if (!(globbed.length > 1)) {
                                    _context.next = 20;
                                    break;
                                  }

                                  return _context.abrupt(
                                    'return',
                                    globbed.map(function(file) {
                                      return _objectSpread({}, asset, {
                                        path: file,
                                        name: (0, _path.basename)(file),
                                      });
                                    }),
                                  );

                                case 20:
                                  return _context.abrupt(
                                    'return',
                                    _objectSpread({}, asset, {
                                      path: globbed[0] || asset.path,
                                    }),
                                  );

                                case 21:
                                  if (!(globbed.length > 0)) {
                                    _context.next = 23;
                                    break;
                                  }

                                  return _context.abrupt('return', globbed);

                                case 23:
                                  return _context.abrupt('return', glob);

                                case 24:
                                case 'end':
                                  return _context.stop();
                              }
                            }
                          },
                          _callee);
                        }),
                      );

                      return function(_x3) {
                        return _ref4.apply(this, arguments);
                      };
                    })(),
                  ), // Sort with Object first, to prioritize Object definition over Strings in dedup
                );

              case 7:
                _context2.t4 = _context2.sent;
                _context2.t5 = (0, _context2.t3)(_context2.t4);

                _context2.t6 = function(asset) {
                  return (0, _lodash.isPlainObject)(asset) ? -1 : 1;
                };

                _context2.t7 = _context2.t1.apply
                  .call(_context2.t1, _context2.t2, _context2.t5)
                  .sort(_context2.t6);

                _context2.t8 = function(a, b) { // Compare `path` property if Object definition, value itself if String
                  return (
                    (0, _path.resolve)(
                      cwd,
                      (0, _lodash.isPlainObject)(a) ? a.path : a,
                    ) ===
                    (0, _path.resolve)(
                      cwd,
                      (0, _lodash.isPlainObject)(b) ? b.path : b,
                    )
                  );
                };

                return _context2.abrupt(
                  'return',
                  (0, _context2.t0)(_context2.t7, _context2.t8),
                );

              case 13:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2);
      }),
    );

    return function(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();

exports.default = _default;
