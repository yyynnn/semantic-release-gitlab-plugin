const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.getError = void 0;

const _error = _interopRequireDefault(require('@semantic-release/error'));

const _errors = require('./definitions/errors');

const getError = function getError(code) {
  const ctx =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  const _ERROR_DEFINITIONS$co = _errors.ERROR_DEFINITIONS[code](ctx);
  const { message } = _ERROR_DEFINITIONS$co;
  const { details } = _ERROR_DEFINITIONS$co;

  return new _error.default(message, code, details);
};

exports.getError = getError;
