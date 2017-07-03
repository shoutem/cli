import ProgressBar from 'progress';

function createProgressBar(msg, { total }) {
  return new ProgressBar(
    `   ${msg} [:bar] :percent (remaining :etas)`,
    {
      total,
      clear: true,
      width: 20,
      renderThrottle: 50
    }
  );
}

export function createProgressHandler({ msg, total, onFinished = () => {} }) {
  let bar = null;
  if (total) {
    bar = createProgressBar(msg, { total });
  }

  return state => {
    // finished!
    if (!state) {
      if (bar) {
        bar.terminate();
        bar = null;
      }
      onFinished();
      return;
    }
    const { length, total } = state;

    // total length not known until now
    if (bar === null && total !== undefined) {
      bar = createProgressBar(msg, { total });
    }

    bar.tick(length);
    if (bar.complete) {
      onFinished();
    }
  };
}
