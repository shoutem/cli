import ProgressBar from 'progress';

export function createProgressHandler(msg, total, onFinished) {
  const bar = new ProgressBar(`   ${msg} [:bar] :percent (:etas)`, { total, clear: true });

  return ({ increment }) => {
    bar.tick(increment);

    if (bar.complete && onFinished) {
      onFinished();
    }
  };
}
