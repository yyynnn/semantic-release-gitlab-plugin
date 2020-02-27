const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.ERROR_DEFINITIONS = void 0;

const _slicedToArray2 = _interopRequireDefault(
  require('@babel/runtime/helpers/slicedToArray'),
);

const _util = require('util');

const _httpsGithubComS = 'https://github.com/semantic-release/gitlab#readme'.split(
  '#',
);
const _httpsGithubComS2 = (0, _slicedToArray2.default)(_httpsGithubComS, 1);
const homepage = _httpsGithubComS2[0];

const linkify = function linkify(file) {
  return ''.concat(homepage, '/blob/master/').concat(file);
};

const stringify = function stringify(obj) {
  return (0, _util.inspect)(obj, {
    breakLength: Infinity,
    depth: 2,
    maxArrayLength: 5,
  });
};

function EINVALIDASSETS(_ref) {
  const { assets } = _ref;
  return {
    message: 'Invalid `assets` option.',
    details: 'The [assets option]('
      .concat(
        linkify('README.md#assets'),
        ') must be an `Array` of `Strings` or `Objects` with a `path` property.\nYour configuration for the `assets` option is `',
      )
      .concat(stringify(assets), '`.'),
  };
}

function EINVALIDGITLABURL() {
  return {
    message: 'The git repository URL is not a valid GitLab URL.',
    details:
      'The **semantic-release** `repositoryUrl` option must a valid GitLab URL with the format `<GitLab_URL>/<repoId>.git`.\n\nBy default the `repositoryUrl` option is retrieved from the `repository` property of your `package.json` or the [git origin url](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes) of the repository cloned by your CI environment.',
  };
}

function EINVALIDGLTOKEN(_ref2) {
  const { repoId } = _ref2;
  return {
    message: 'Invalid GitLab token.',
    details: 'The [GitLab token]('
      .concat(
        linkify('README.md#gitlab-authentication'),
        ') configured in the `GL_TOKEN` or `GITLAB_TOKEN` environment variable must be a valid [personal access token](https://docs.gitlab.com/ce/user/profile/personal_access_tokens.html) allowing to push to the repository ',
      )
      .concat(
        repoId,
        '.\n\nPlease make sure to set the `GL_TOKEN` or `GITLAB_TOKEN` environment variable in your CI with the exact value of the GitLab personal token.',
      ),
  };
}

function EMISSINGREPO(_ref3) {
  const { repoId } = _ref3;
  return {
    message: 'The repository '.concat(repoId, " doesn't exist."),
    details: 'The **semantic-release** `repositoryUrl` option must refer to your GitLab repository. The repository must be accessible with the [GitLab API](https://docs.gitlab.com/ce/api/README.html).\n\nBy default the `repositoryUrl` option is retrieved from the `repository` property of your `package.json` or the [git origin url](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes) of the repository cloned by your CI environment.\n\nIf you are using [GitLab Enterprise Edition](https://about.gitlab.com/gitlab-ee) please make sure to configure the `gitlabUrl` and `gitlabApiPathPrefix` [options]('.concat(
      linkify('README.md#options'),
      ').',
    ),
  };
}

function EGLNOPERMISSION(_ref4) {
  const { repoId } = _ref4;
  return {
    message: "The GitLab token doesn't allow to push on the repository ".concat(
      repoId,
      '.',
    ),
    details: 'The user associated with the [GitLab token]('
      .concat(
        linkify('README.md#gitlab-authentication'),
        ') configured in the `GL_TOKEN` or `GITLAB_TOKEN` environment variable must allows to push to the repository ',
      )
      .concat(
        repoId,
        '.\n\nPlease make sure the GitLab user associated with the token has the [permission to push](https://docs.gitlab.com/ee/user/permissions.html#project-members-permissions) to the repository ',
      )
      .concat(repoId, '.'),
  };
}

function ENOGLTOKEN(_ref5) {
  const { repositoryUrl } = _ref5;
  return {
    message: 'No GitLab token specified.',
    details: 'A [GitLab personnal access token]('
      .concat(
        linkify('README.md#gitlab-authentication'),
        ') must be created and set in the `GL_TOKEN` or `GITLAB_TOKEN` environment variable on your CI environment.\n\nPlease make sure to create a [GitLab personnal access token](https://docs.gitlab.com/ce/user/profile/personal_access_tokens.html) and to set it in the `GL_TOKEN` or `GITLAB_TOKEN` environment variable on your CI environment. The token must allow to push to the repository ',
      )
      .concat(repositoryUrl, '.'),
  };
}

const ERROR_DEFINITIONS = {
  ENOGLTOKEN,
  EGLNOPERMISSION,
  EMISSINGREPO,
  EINVALIDGLTOKEN,
  EINVALIDGITLABURL,
  EINVALIDASSETS,
};
exports.ERROR_DEFINITIONS = ERROR_DEFINITIONS;
