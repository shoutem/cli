import 'colors';
import 'exit-code';
import _ from 'lodash';
import stringify from 'json-stringify-safe';

import * as cache from './cache-env';
import * as spinner from './spinner';

function getJsonApiErrorMessage(errors) {
  const generalDetail = _.upperFirst(_.get(errors, '[0].detail') || _.get(errors, '[0].title'));
  const specificDetail = _.upperFirst(_.get(errors, '[0].meta.trace.detail'));

  if (generalDetail && specificDetail && generalDetail !== specificDetail) {
    return `${generalDetail} (${specificDetail})`;
  }

  return specificDetail || generalDetail || '';
}

export function getErrorMessage(err) {
  if (!err) {
    return '';
  }

  if (err.message) {
    return err.message;
  }

  if (err.statusCode === 401 || err.statusCode === 403) {
    return 'Access denied, use `shoutem login` command to login';
  }

  if (_.get(err, 'body.errors')) {
    return getJsonApiErrorMessage(err.body.errors);
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

  return 'Unrecognized error. Run `shoutem last-error` for more additional details'
}

let reportInfoPrinted = false;

export function handleError(err) {
  try {
    if (err) {
      process.exitCode = err.code || -1;
    }

    spinner.stopAll();
    console.error(getErrorMessage(err).red.bold);

    const errorJson = JSON.parse(stringify(err));
    errorJson.stack = (err || {}).stack;
    errorJson.message = (err || {}).message;

    cache.setValue('last-error', errorJson);

    if (!reportInfoPrinted) {
      console.error(`\nUse ${'shoutem last-error'.cyan} for more info`);
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
    handleError(err);
  }
}
