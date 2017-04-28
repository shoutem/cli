import * as cache from './cache';
import { getHostEnvName } from '../clients/server-env';
import ua from 'universal-analytics';
import uuid from 'uuid/v4';
import _ from 'lodash';
import { getLocalDataClient } from '../clients/clients-factory';

function getTrackingId() {
  return getHostEnvName() === 'production' ? 'UA-807293-5' : 'UA-807293-12';
}

async function getClientId() {
  return await cache.get('ga-client-id', null, () => uuid());
}

async function getUaVisitor() {
  const clientId = await getClientId();

  const visitor = ua(getTrackingId(), clientId);

  const email = await getLocalDataClient().loadUserEmail();
  if (email) {
    visitor.set('userId', email);
    reportData.userId = email;
  }
  visitor.set('isDeveloper', true);
  reportData.isDeveloper = true;

  return visitor;
}

async function reportEvent(category, action, label, value) {
  const visitor = await getUaVisitor();

  visitor.event(category, action, label, value);
}

async function reportCliCommand(commandName, fullCommand, canonicalNameOrAppId) {
  await reportEvent('CLI', fullCommand, canonicalNameOrAppId, commandName);
}

const reportData = {
  commandName: null,
  extensionCanonicalName: null,
  appId: null,
  argv: [],
  reportSent: false
};

export function setCommandName(name) {
  reportData.commandName = name;

  if (reportData.extensionCanonicalName || reportData.appId) {
    finishReport()
      .catch(console.err);
  }
}

export function setAppId(appId) {
  reportData.appId = appId;

  if (reportData.commandName) {
    finishReport()
      .catch(console.error);
  }
}

export function setExtensionCanonicalName(name) {
  reportData.extensionCanonicalName = name;

  if (reportData.commandName) {
    finishReport()
      .catch(console.error);
  }
}

export function setArgv(argv) {
  reportData.argv = _.drop(argv, 2);
}

async function finishReport() {
  const { commandName, extensionCanonicalName, appId, argv, reportSent } = reportData;
  const label = extensionCanonicalName || appId;

  if (commandName && !reportSent) {
    await reportCliCommand(commandName, argv.join(' '), label);
    reportData.reportSent = true;
    if (getHostEnvName() !== 'production') {
      console.log('Report finished!', reportData);
    }
  }
}
