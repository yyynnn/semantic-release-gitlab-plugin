/* eslint require-atomic-updates: off */

import { verifyGitLab } from './helpers/verify';
import { publishGitLab } from './helpers/publish';

let verified;

async function verifyConditions(pluginConfig, context) {
  await verifyGitLab(pluginConfig, context);
  verified = true;
}

async function publish(pluginConfig, context) {
  if (!verified) {
    await verifyGitLab(pluginConfig, context);
    verified = true;
  }

  return publishGitLab(pluginConfig, context);
}

export default { verifyConditions, publish };
