import StreamSearch from 'streamsearch';
import 'colors';

export default (stream, pattern) => new Promise((resolve, reject) => {
  const search = new StreamSearch(pattern);
  let matched = false;

  search.on('info', isMatch => {
    if (isMatch) {
      resolve();
      matched = true;
    }
  });
  search.on('error', err => reject(err));
  search.on('finish', () => matched ? null : reject(new Error(`Match ${pattern} not found`)));
  stream.on('data', data => search.push(data));
});
