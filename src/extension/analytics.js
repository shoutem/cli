import * as cache from './cache';
import ua from 'universal-analytics';
import uuid from 'uuid/v4';
import { getLocalDataClient } from '../clients/clients-factory';

function getTrackingId() {
  return 'GTM-KT475BW';
}

async function getClientId() {
  return await cache.get('ga-client-id', null, () => uuid());
}

async function getUaVisitor() {
  const clientId = await getClientId();

  const visitor = ua(getTrackingId(), clientId);
  visitor.set('isDeveloper', true);

  return visitor;
}

async function reportEvent(category, action, label, value) {
  const visitor = await getUaVisitor();

  visitor.event(category, action, label, value);
}

export async function reportCliCommand(commandName, fullCommand, canonicalNameOrAppId) {
  await reportEvent('CLI', fullCommand, canonicalNameOrAppId, commandName);
}
