import URI from 'urijs';
import { legacyService } from '../../config/services';
import jsonApi from './json-api-client';
import logger from '../services/logger';

const legacyServiceUri = new URI(legacyService);

export async function getLatestApps() {
  const request = legacyServiceUri.clone()
    .segment('/v1/apps')
    .search({ sort: '-modificationTime' });

  const body = await jsonApi.get(request);

  logger.info('getLatestApps', body);
  return body;
}

export async function getApp(appId) {
  const url = legacyServiceUri.clone().segment(`/v1/apps/${appId}`);
  return jsonApi.get(url);
}

export async function getPublishingProperties(appId) {
  const url = legacyServiceUri.clone().segment('/api/applications/publishing_properties.json').search({ nid: appId });
  return jsonApi.get(url);
}
