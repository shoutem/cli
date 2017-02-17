import glob from 'glob-promise';
import _ from 'lodash';

export default async function(patterns) {
  return _.uniq(_.flatten(await Promise.all(patterns.map(p => glob(p)))));
}
