const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.publishGitLab = void 0;

const _regenerator = _interopRequireDefault(
  require('@babel/runtime/regenerator'),
);

const _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
);

const _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator'),
);

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

const FormData = require('form-data');

const _require = require('fs');

const { createReadStream } = _require;

const _require2 = require('path');

const { resolve } = _require2;

const _require3 = require('fs-extra');

const { stat } = _require3;

const _require4 = require('lodash');

const { isPlainObject } = _require4;

const urlJoin = require('url-join');

const got = require('got');

const debug = require('debug')('semantic-release:gitlab');

const resolveConfig = require('./resolve-config');

const getRepoId = require('./get-repo-id').default;

const getAssets = require('./glob-assets').default;

const publishGitLab =
  /* #__PURE__ */
  (function() {
    const _ref = (0, _asyncToGenerator2.default)(
      /* #__PURE__ */
      _regenerator.default.mark(function _callee2(pluginConfig, context) {
        let cwd;
        let repositoryUrl;
        let _context$nextRelease;
        let gitTag;
        let gitHead;
        let notes;
        let logger;
        let _resolveConfig;
        let gitlabToken;
        let gitlabUrl;
        let gitlabApiUrl;
        let assets;
        let assetsList;
        let repoId;
        let encodedRepoId;
        let encodedGitTag;
        let apiOptions;
        let globbedAssets;

        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                (cwd = context.cwd),
                  (repositoryUrl = context.options.repositoryUrl),
                  (_context$nextRelease = context.nextRelease),
                  (gitTag = _context$nextRelease.gitTag),
                  (gitHead = _context$nextRelease.gitHead),
                  (notes = _context$nextRelease.notes),
                  (logger = context.logger);
                (_resolveConfig = resolveConfig(pluginConfig, context)),
                  (gitlabToken = _resolveConfig.gitlabToken),
                  (gitlabUrl = _resolveConfig.gitlabUrl),
                  (gitlabApiUrl = _resolveConfig.gitlabApiUrl),
                  (assets = _resolveConfig.assets);
                assetsList = [];
                repoId = getRepoId(context, gitlabUrl, repositoryUrl);
                encodedRepoId = encodeURIComponent(repoId);
                encodedGitTag = encodeURIComponent(gitTag);
                apiOptions = {
                  headers: {
                    'PRIVATE-TOKEN': gitlabToken,
                  },
                };
                debug('repoId: %o', repoId);
                debug('release name: %o', gitTag);
                debug('release ref: %o', gitHead);

                if (!(assets && assets.length > 0)) {
                  _context2.next = 17;
                  break;
                }

                _context2.next = 13;
                return getAssets(context, assets);

              case 13:
                globbedAssets = _context2.sent;
                debug('globbed assets: %o', globbedAssets);
                _context2.next = 17;
                return Promise.all(
                  globbedAssets.map(
                    /* #__PURE__ */
                    (function() {
                      const _ref2 = (0, _asyncToGenerator2.default)(
                        /* #__PURE__ */
                        _regenerator.default.mark(function _callee(asset) {
                          let _ref3;
                          let path;
                          let label;
                          let file;
                          let fileStat;
                          let form;
                          let _ref4;
                          let url;
                          let alt;

                          return _regenerator.default.wrap(
                            function _callee$(_context) {
                              while (1) {
                                switch ((_context.prev = _context.next)) {
                                  case 0:
                                    (_ref3 = isPlainObject(asset)
                                      ? asset
                                      : {
                                          path: asset,
                                        }),
                                      (path = _ref3.path),
                                      (label = _ref3.label);
                                    file = resolve(cwd, path);
                                    _context.prev = 2;
                                    _context.next = 5;
                                    return stat(file);

                                  case 5:
                                    fileStat = _context.sent;
                                    _context.next = 12;
                                    break;

                                  case 8:
                                    _context.prev = 8;
                                    _context.t0 = _context.catch(2);
                                    logger.error(
                                      'The asset %s cannot be read, and will be ignored.',
                                      path,
                                    );
                                    return _context.abrupt('return');

                                  case 12:
                                    if (!(!fileStat || !fileStat.isFile())) {
                                      _context.next = 15;
                                      break;
                                    }

                                    logger.error(
                                      'The asset %s is not a file, and will be ignored.',
                                      path,
                                    );
                                    return _context.abrupt('return');

                                  case 15:
                                    debug('file path: %o', path);
                                    debug('file label: %o', label); // Uploaded assets to the project

                                    form = new FormData();
                                    form.append('file', createReadStream(file));
                                    _context.next = 21;
                                    return got
                                      .post(
                                        urlJoin(
                                          gitlabApiUrl,
                                          '/projects/'.concat(
                                            encodedRepoId,
                                            '/uploads',
                                          ),
                                        ),
                                        _objectSpread({}, apiOptions, {
                                          body: form,
                                        }),
                                      )
                                      .json();

                                  case 21:
                                    _ref4 = _context.sent;
                                    url = _ref4.url;
                                    alt = _ref4.alt;
                                    assetsList.push({
                                      label,
                                      alt,
                                      url,
                                    });
                                    logger.log('Uploaded file: %s', url);

                                  case 26:
                                  case 'end':
                                    return _context.stop();
                                }
                              }
                            },
                            _callee,
                            null,
                            [[2, 8]],
                          );
                        }),
                      );

                      return function(_x3) {
                        return _ref2.apply(this, arguments);
                      };
                    })(),
                  ),
                );

              case 17:
                debug(
                  'Update git tag %o with commit %o and release description',
                  gitTag,
                  gitHead,
                );
                _context2.next = 20;
                return got.post(
                  urlJoin(
                    gitlabApiUrl,
                    '/projects/'
                      .concat(encodedRepoId, '/repository/tags/')
                      .concat(encodedGitTag, '/release'),
                  ),
                  _objectSpread({}, apiOptions, {
                    json: {
                      // eslint-disable-next-line @typescript-eslint/camelcase
                      tag_name: gitTag,
                      description: notes && notes.trim() ? notes : gitTag,
                    }, // eslint-disable-line camelcase
                  }),
                );

              case 20:
                if (!(assetsList.length > 0)) {
                  _context2.next = 23;
                  break;
                }

                _context2.next = 23;
                return Promise.all(
                  assetsList.map(function(_ref5) {
                    const { label } = _ref5;
                    const { alt } = _ref5;
                    const { url } = _ref5;
                    debug('Add link to asset %o', label || alt);
                    return got.post(
                      urlJoin(
                        gitlabApiUrl,
                        '/projects/'
                          .concat(encodedRepoId, '/releases/')
                          .concat(encodedGitTag, '/assets/links'),
                      ),
                      _objectSpread({}, apiOptions, {
                        json: {
                          name: label || alt,
                          url: urlJoin(gitlabUrl, repoId, url),
                        },
                      }),
                    );
                  }),
                );

              case 23:
                logger.log('Published GitLab release: %s', gitTag);
                return _context2.abrupt('return', {
                  url: urlJoin(
                    gitlabUrl,
                    encodedRepoId,
                    '/tags/'.concat(encodedGitTag),
                  ),
                  name: 'GitLab release',
                });

              case 25:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2);
      }),
    );

    return function publishGitLab(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();

exports.publishGitLab = publishGitLab;
