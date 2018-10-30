import ProgressBar from 'progress';
import { startSpinner } from './spinner';

export function createProgressBar(msg, { total }) {
  return new ProgressBar(
    `   ${msg} [:bar] :percent (remaining :etas)`,
    {
      total,
      clear: true,
      width: 20,
      renderThrottle: 50,
    }
  );
}

export function createProgressHandler({ msg = '', total = 0, onFinished = () => {} }) {
  let bar = null;

  if (total) {
    bar = createProgressBar(msg, { total });
  }

  return (state) => {
    // finished!
    if (!state) {
      if (bar) {
        bar.terminate();
        bar = null;
      }

      onFinished();
      return;
    }

    let { total } = state;
    total = total || 0;

    // total length not known until now
    if (bar === null) {
      if (total > 0) {
        bar = createProgressBar(msg, { total });
      } else {
        bar = startSpinner(msg);
        bar.tick = () => {};
        bar.terminate = () => bar.stop();
      }
    }

    bar.tick(state.length);

    if (bar.complete) {
      onFinished();
    }
  };
}
