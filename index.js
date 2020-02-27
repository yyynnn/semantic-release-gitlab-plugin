/* eslint-disable import/no-unresolved */
/* eslint require-atomic-updates: off */
const verifyGitLab = require('./lib/verify');
const publishGitLab = require('./lib/publish');

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
