import opn from 'opn';
import services from '../../config/services';
import { getPlatformConfig } from '../services/platform';
import { executeAndHandleError } from '../services/error-handler';

export const description = 'Opens the app in the shoutem builder dashboard using default browser';
export const command = 'builder [appId]';
export const builder = yargs => {
  return yargs
    .usage(`shoutem ${command} \n\n${description}`);
};

export const handler = args => executeAndHandleError(() => {
  const appId = args.appId || (getPlatformConfig()).appId;
  const url = `${services.appBuilder}/app/${appId}`;
  console.log(url);
  opn(url, { wait: false });
});
