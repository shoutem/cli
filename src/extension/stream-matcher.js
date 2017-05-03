import MatchStream from 'match-stream';
import 'colors';

export default (readableStream, opts ) => new Promise((resolve, reject) => {
  let patternFound = false;
  let timeoutObject = null;

  const matcher = new MatchStream({ pattern: opts.pattern }, function (buf, matched) {
    this.push(buf);
    patternFound = patternFound || matched;
    if (!patternFound) {
      return;
    }

    clearTimeout(timeoutObject);
    timeoutObject = setTimeout(() => {
      resolve();
    }, opts.inactivityTimeout || 0);
  });

  try {
    readableStream
      .pipe(matcher)
      .on('error', err => resolve())
      .on('close', () => resolve());
  } catch (err) {
    resolve();
  }
});
