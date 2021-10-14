import URI from 'urijs';
import { legacyService } from '../../config/services';
import * as jsonApi from './json-api-client';
import * as logger from '../services/logger';

const legacyServiceUri = new URI(legacyService);

export async function getLatestApps() {
  const body = await jsonApi.get(
    legacyServiceUri
      .clone()
      .segment('/v1/apps')
      .search({ sort: '-modificationTime' }),
  );

  logger.info('getLatestApps', body);
  return body;
}

export async function getApp(appId) {
  const url = legacyServiceUri.clone().segment(`/v1/apps/${appId}`);
  return await jsonApi.get(url);
}

export async function getPublishingProperties(appId) {
  const url = legacyServiceUri
    .clone()
    .segment(`/api/applications/publishing_properties.json`)
    .search({ nid: appId });
  return await jsonApi.get(url);
}
