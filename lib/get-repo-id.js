const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.getRepoId = void 0;

const _parsePath = _interopRequireDefault(require('parse-path'));

const _escapeStringRegexp = _interopRequireDefault(
  require('escape-string-regexp'),
);

const getRepoId = function getRepoId(_ref, gitlabUrl, repositoryUrl) {
  let _ref$envCi = _ref.envCi;
  _ref$envCi = _ref$envCi === void 0 ? {} : _ref$envCi;
  const { service } = _ref$envCi;
  const { CI_PROJECT_PATH } = _ref.env;
  return service === 'gitlab' && CI_PROJECT_PATH
    ? CI_PROJECT_PATH
    : (0, _parsePath.default)(repositoryUrl)
        .pathname.replace(
          new RegExp(
            '^'.concat(
              (0, _escapeStringRegexp.default)(
                (0, _parsePath.default)(gitlabUrl).pathname,
              ),
            ),
          ),
          '',
        )
        .replace(/^\//, '')
        .replace(/\/$/, '')
        .replace(/\.git$/, '');
};

exports.getRepoId = getRepoId;
