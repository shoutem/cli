import analytics from 'universal-analytics';
import uuid from 'uuid/v4';
import _ from 'lodash';

import { analyticsTrackingId } from '../../config/services';
import { getValue } from './cache-env';
import logger from './logger';
import cache from './cache';

function getClientId() {
  return cache.get('ga-client-id', null, () => uuid());
}

function getAnalyticsVisitor() {
  const clientId = getClientId();

  const visitor = analytics(analyticsTrackingId, clientId);
  reportData.clientId = clientId;

  const { email } = getValue('developer') || {};

  if (email) {
    visitor.set('userId', email);
    reportData.userId = email;
  }

  visitor.set('isDeveloper', true);
  reportData.isDeveloper = true;

  return visitor;
}

async function reportEvent({ category, action, label }) {
  const visitor = getAnalyticsVisitor();

  await visitor.event(category, action, label).send(err => {
    if (err) {
      console.error(err);
    } else {
      logger.info('GA Report completed', {
        category,
        action,
        label,
        clientId: reportData.clientId,
        userId: reportData.userId,
        isDeveloper: reportData.isDeveloper
      });
    }
  });
}

async function reportCliCommand(commandName, canonicalNameOrAppId) {
  await reportEvent({
    category: 'CLI',
    action: commandName,
    label: canonicalNameOrAppId
  });
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
  const { commandName, extensionCanonicalName, appId, reportSent } = reportData;
  const label = extensionCanonicalName || appId;

  if (commandName && !reportSent) {
    await reportCliCommand(commandName, label);
    reportData.reportSent = true;
  }
}
