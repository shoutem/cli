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

export function createProgressBar(msg) {
  let progressBar = null;

  return (state) => {
    if (!state) {
      if (progressBar) {
        progressBar.terminate();
      }
      return;
    }

    const { percent, size: { total } } = state;
    if (!progressBar) {
      progressBar = new ProgressBar(`   ${msg} [:bar] :percent (:etas)`, { total, width: 20, clear: true });
    }
    if (percent) {
      progressBar.update(percent);
    } else {
      progressBar.tick();
    }
  };
}
