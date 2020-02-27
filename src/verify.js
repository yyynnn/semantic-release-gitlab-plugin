import { isString, isPlainObject, isArray } from 'lodash';
import urlJoin from 'url-join';
import { get } from 'got';
import AggregateError from 'aggregate-error';

import { resolveConfig } from './resolve-config';
import { getRepoId } from './get-repo-id';
import { getError } from './get-error';

const debug = require('debug')('semantic-release:gitlab');

const isNonEmptyString = (value) => isString(value) && value.trim();
const isStringOrStringArray = (value) =>
  isNonEmptyString(value) || (isArray(value) && value.every(isNonEmptyString));
const isArrayOf = (validator) => (array) =>
  isArray(array) && array.every((value) => validator(value));

const VALIDATORS = {
  assets: isArrayOf(
    (asset) =>
      isStringOrStringArray(asset) ||
      (isPlainObject(asset) && isStringOrStringArray(asset.path)),
  ),
};

export const verifyGitLab = async (pluginConfig, context) => {
  const {
    options: { repositoryUrl },
    logger,
  } = context;
  const errors = [];
  const { gitlabToken, gitlabUrl, gitlabApiUrl, assets } = resolveConfig(
    pluginConfig,
    context,
  );
  const repoId = getRepoId(context, gitlabUrl, repositoryUrl);
  debug('apiUrl: %o', gitlabApiUrl);
  debug('repoId: %o', repoId);

  if (!repoId) {
    errors.push(getError('EINVALIDGITLABURL'));
  }

  if (assets && !VALIDATORS.assets(assets)) {
    errors.push(getError('EINVALIDASSETS'));
  }

  if (!gitlabToken) {
    errors.push(getError('ENOGLTOKEN', { repositoryUrl }));
  }

  if (gitlabToken && repoId) {
    let projectAccess;
    let groupAccess;

    logger.log('Verify GitLab authentication (%s)', gitlabApiUrl);
    logger.log('Verify GitLab token (%s)', gitlabToken);

    try {
      ({
        permissions: {
          project_access: projectAccess,
          group_access: groupAccess,
        },
      } = await get(
        urlJoin(gitlabApiUrl, `/projects/${encodeURIComponent(repoId)}`),
        {
          headers: { 'PRIVATE-TOKEN': gitlabToken },
        },
      ).json());

      if (
        !(
          (projectAccess && projectAccess.access_level >= 30) ||
          (groupAccess && groupAccess.access_level >= 30)
        )
      ) {
        errors.push(getError('EGLNOPERMISSION', { repoId }));
      }
    } catch (error) {
      logger.log('!!!ERROR!!! (%s)', error);
      if (error.response && error.response.statusCode === 401) {
        errors.push(getError('EINVALIDGLTOKEN', { repoId }));
      } else if (error.response && error.response.statusCode === 404) {
        errors.push(getError('EMISSINGREPO', { repoId }));
      } else {
        throw error;
      }
    }
  }

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }
};
