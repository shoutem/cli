import _ from 'lodash';
import { lastErrorPath } from '../clients/cli-paths';
import { writeJsonFile } from '../extension/data';

function getJsonApiErrorMessage(errors) {
  return _.get(errors, '[0].detail') ||
    _.get(errors, '[0].title') ||
    JSON.stringify(errors);
}

export function getErrorMessage(err) {
  if (_.get(err, 'response.body.errors')) {
    return getJsonApiErrorMessage(err.response.body.errors);
  }

  if (typeof(_.get(err, 'response.body')) === 'string') {
    try {
      const body = JSON.parse(_.get(err, 'response.body'));
      if (body.errors) {
        return getJsonApiErrorMessage(body.errors);
      }
    } catch (err){
    }
  }

  if (err.message) {
    return err.message;
  }

  return err;
}

export async function handleError(err) {
  console.error(getErrorMessage(err));

  const errorJson = JSON.parse(JSON.stringify(err));
  errorJson.stack = err.stack;
  errorJson.message = err.message;
  await writeJsonFile(errorJson, await lastErrorPath());
}
