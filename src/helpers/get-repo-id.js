import parsePath from 'parse-path';
import escapeStringRegexp from 'escape-string-regexp';

export const getRepoId = (
  { envCi: { service } = {}, env: { CI_PROJECT_PATH } },
  gitlabUrl,
  repositoryUrl,
) =>
  service === 'gitlab' && CI_PROJECT_PATH
    ? CI_PROJECT_PATH
    : parsePath(repositoryUrl)
        .pathname.replace(
          new RegExp(`^${escapeStringRegexp(parsePath(gitlabUrl).pathname)}`),
          '',
        )
        .replace(/^\//, '')
        .replace(/\/$/, '')
        .replace(/\.git$/, '');
