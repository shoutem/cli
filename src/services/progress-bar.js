import ProgressBar from 'progress';
import { startSpinner } from './spinner';

function createProgressBar(msg, { total }) {
  return new ProgressBar(`   ${msg} [:bar] :percent (remaining :etas)`, {
    total,
    clear: true,
    width: 20,
    renderThrottle: 50,
  });
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

    const { length, total = 0 } = state;

    // total length not known until now
    if (bar === null) {
      if (total > 0) {
        bar = createProgressBar(msg, { total });
      } else {
        bar = startSpinner(msg);
        bar.tick = () => {};
        bar.terminate = () => {
          bar.stop();
        };
      }
    }

    bar.tick(length);
    if (bar.complete) {
      onFinished();
    }
  };
}
