const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.verifyGitLab = void 0;

const _regenerator = _interopRequireDefault(
  require('@babel/runtime/regenerator'),
);

const _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator'),
);

const _lodash = require('lodash');

const _urlJoin = _interopRequireDefault(require('url-join'));

const _got = require('got');

const _aggregateError = _interopRequireDefault(require('aggregate-error'));

const debug = require('debug')('semantic-release:gitlab');
const _resolveConfig2 = require('./resolve-config');

const _getRepoId = require('./get-repo-id');

const _getError = require('./get-error');

const isNonEmptyString = function isNonEmptyString(value) {
  return (0, _lodash.isString)(value) && value.trim();
};

const isStringOrStringArray = function isStringOrStringArray(value) {
  return (
    isNonEmptyString(value) ||
    ((0, _lodash.isArray)(value) && value.every(isNonEmptyString))
  );
};

const isArrayOf = function isArrayOf(validator) {
  return function(array) {
    return (
      (0, _lodash.isArray)(array) &&
      array.every(function(value) {
        return validator(value);
      })
    );
  };
};

const VALIDATORS = {
  assets: isArrayOf(function(asset) {
    return (
      isStringOrStringArray(asset) ||
      ((0, _lodash.isPlainObject)(asset) && isStringOrStringArray(asset.path))
    );
  }),
};

const verifyGitLab =
  /* #__PURE__ */
  (function() {
    const _ref = (0, _asyncToGenerator2.default)(
      /* #__PURE__ */
      _regenerator.default.mark(function _callee(pluginConfig, context) {
        let repositoryUrl;
        let logger;
        let errors;
        let _resolveConfig;
        let gitlabToken;
        let gitlabUrl;
        let gitlabApiUrl;
        let assets;
        let repoId;
        let projectAccess;
        let groupAccess;
        let _ref2;
        let _ref2$permissions;

        return _regenerator.default.wrap(
          function _callee$(_context) {
            while (1) {
              switch ((_context.prev = _context.next)) {
                case 0:
                  (repositoryUrl = context.options.repositoryUrl),
                    (logger = context.logger);
                  errors = [];
                  (_resolveConfig = (0, _resolveConfig2.resolveConfig)(
                    pluginConfig,
                    context,
                  )),
                    (gitlabToken = _resolveConfig.gitlabToken),
                    (gitlabUrl = _resolveConfig.gitlabUrl),
                    (gitlabApiUrl = _resolveConfig.gitlabApiUrl),
                    (assets = _resolveConfig.assets);
                  repoId = (0, _getRepoId.getRepoId)(
                    context,
                    gitlabUrl,
                    repositoryUrl,
                  );
                  debug('apiUrl: %o', gitlabApiUrl);
                  debug('repoId: %o', repoId);

                  if (!repoId) {
                    errors.push((0, _getError.getError)('EINVALIDGITLABURL'));
                  }

                  if (assets && !VALIDATORS.assets(assets)) {
                    errors.push((0, _getError.getError)('EINVALIDASSETS'));
                  }

                  if (!gitlabToken) {
                    errors.push(
                      (0, _getError.getError)('ENOGLTOKEN', {
                        repositoryUrl,
                      }),
                    );
                  }

                  if (!(gitlabToken && repoId)) {
                    _context.next = 34;
                    break;
                  }

                  logger.log('Verify GitLab authentication (%s)', gitlabApiUrl);
                  logger.log('Verify GitLab token (%s)', gitlabToken);
                  _context.prev = 12;
                  _context.next = 15;
                  return (0, _got.get)(
                    (0, _urlJoin.default)(
                      gitlabApiUrl,
                      '/projects/'.concat(encodeURIComponent(repoId)),
                    ),
                    {
                      headers: {
                        'PRIVATE-TOKEN': gitlabToken,
                      },
                    },
                  ).json();

                case 15:
                  _ref2 = _context.sent;
                  _ref2$permissions = _ref2.permissions;
                  projectAccess = _ref2$permissions.project_access;
                  groupAccess = _ref2$permissions.group_access;

                  if (
                    !(
                      (projectAccess && projectAccess.access_level >= 30) ||
                      (groupAccess && groupAccess.access_level >= 30)
                    )
                  ) {
                    errors.push(
                      (0, _getError.getError)('EGLNOPERMISSION', {
                        repoId,
                      }),
                    );
                  }

                  _context.next = 34;
                  break;

                case 22:
                  _context.prev = 22;
                  _context.t0 = _context.catch(12);
                  logger.log('!!!ERROR!!! (%s)', _context.t0);

                  if (
                    !(
                      _context.t0.response &&
                      _context.t0.response.statusCode === 401
                    )
                  ) {
                    _context.next = 29;
                    break;
                  }

                  errors.push(
                    (0, _getError.getError)('EINVALIDGLTOKEN', {
                      repoId,
                    }),
                  );
                  _context.next = 34;
                  break;

                case 29:
                  if (
                    !(
                      _context.t0.response &&
                      _context.t0.response.statusCode === 404
                    )
                  ) {
                    _context.next = 33;
                    break;
                  }

                  errors.push(
                    (0, _getError.getError)('EMISSINGREPO', {
                      repoId,
                    }),
                  );
                  _context.next = 34;
                  break;

                case 33:
                  throw _context.t0;

                case 34:
                  if (!(errors.length > 0)) {
                    _context.next = 36;
                    break;
                  }

                  throw new _aggregateError.default(errors);

                case 36:
                case 'end':
                  return _context.stop();
              }
            }
          },
          _callee,
          null,
          [[12, 22]],
        );
      }),
    );

    return function verifyGitLab(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();

exports.verifyGitLab = verifyGitLab;
