const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.resolveConfig = void 0;

const _lodash = require('lodash');

const _urlJoin = _interopRequireDefault(require('url-join'));

// eslint-disable-next-line import/prefer-default-export
const resolveConfig = function resolveConfig(_ref, _ref2) {
  const { gitlabUrl } = _ref;
  const { gitlabApiPathPrefix } = _ref;
  const { assets } = _ref;
  let _ref2$envCi = _ref2.envCi;
  _ref2$envCi = _ref2$envCi === void 0 ? {} : _ref2$envCi;
  const { service } = _ref2$envCi;
  const _ref2$env = _ref2.env;
  const { CI_PROJECT_URL } = _ref2$env;
  const { CI_PROJECT_PATH } = _ref2$env;
  const { CI_API_V4_URL } = _ref2$env;
  const { GL_TOKEN } = _ref2$env;
  const { GITLAB_TOKEN } = _ref2$env;
  const { GL_URL } = _ref2$env;
  const { GITLAB_URL } = _ref2$env;
  const { GL_PREFIX } = _ref2$env;
  const { GITLAB_PREFIX } = _ref2$env;
  const userGitlabApiPathPrefix = (0, _lodash.isNil)(gitlabApiPathPrefix)
    ? (0, _lodash.isNil)(GL_PREFIX)
      ? GITLAB_PREFIX
      : GL_PREFIX
    : gitlabApiPathPrefix;
  const userGitlabUrl = gitlabUrl || GL_URL || GITLAB_URL;
  const defaultedGitlabUrl =
    userGitlabUrl ||
    (service === 'gitlab' && CI_PROJECT_URL && CI_PROJECT_PATH
      ? CI_PROJECT_URL.replace(new RegExp('/'.concat(CI_PROJECT_PATH, '$')), '')
      : 'https://gitlab.com');
  return {
    gitlabToken: GL_TOKEN || GITLAB_TOKEN,
    gitlabUrl: defaultedGitlabUrl,
    gitlabApiUrl:
      userGitlabUrl && userGitlabApiPathPrefix
        ? (0, _urlJoin.default)(userGitlabUrl, userGitlabApiPathPrefix)
        : service === 'gitlab' && CI_API_V4_URL
        ? CI_API_V4_URL
        : (0, _urlJoin.default)(
            defaultedGitlabUrl,
            (0, _lodash.isNil)(userGitlabApiPathPrefix)
              ? '/api/v4'
              : userGitlabApiPathPrefix,
          ),
    assets: assets ? (0, _lodash.castArray)(assets) : assets,
  };
};

exports.resolveConfig = resolveConfig;
