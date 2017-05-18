import 'colors';
import _ from 'lodash';
import stringify from 'json-stringify-safe';
import { lastErrorPath } from '../clients/cli-paths';
import { writeJsonFile } from '../extension/data';
import * as spinner from './spinner';

function getJsonApiErrorMessage(errors) {
  return _.get(errors, '[0].detail') ||
    _.get(errors, '[0].title') ||
    JSON.stringify(errors);
}

export function getErrorMessage(err) {
  if (!err) {
    return '';
  }

  if (err.status === 401) {
    return 'Access denied, use `shoutem login` command to login';
  }

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

let reportInfoPrinted = false;

export async function handleError(err) {
  try {
      spinner.stopAll();
      console.error(getErrorMessage(err).red.bold);

      const errorJson = JSON.parse(stringify(err));
      errorJson.stack = (err || {}).stack;
      errorJson.message = (err || {}).message;
      await writeJsonFile(errorJson, await lastErrorPath());
      if (!reportInfoPrinted) {
        console.error(`\nIf you think this error is caused by bug in the shoutem command, you can report the issue here: ${"https://github.com/shoutem/cli/issues".bold}`.yellow);
        console.error(`Make sure to include the information printed using the ${"`shoutem last-error`".bold} command`.yellow);
        reportInfoPrinted = true;
      }
  } catch (err) {
      console.log(err);
  }
}

export async function executeAndHandleError(func) {
  try {
    await func();
  } catch (err) {
    await handleError(err);
  }
}
