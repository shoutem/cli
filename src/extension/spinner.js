import { Spinner } from 'cli-spinner'
import { isVerbose } from './logger';

let spinners = [];

export function startSpinner(msg) {
  if (isVerbose()) {
    console.log(msg);
    return { stop(){} };
  }

  const spinner = new Spinner(msg);
  spinner.start();

  spinners.push(spinner);

  return spinner;
}

export function stopAll() {
  spinners.forEach(s => s.stop(true));
  spinners = [];
}

export async function spinify(promise, msg) {
  const spinner = startSpinner(msg);

  try {
    return await promise;
  } finally {
    spinner.stop(true);
  }
}
