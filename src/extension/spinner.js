import { Spinner } from 'cli-spinner';

let spinners = [];

export function startSpinner(msg) {
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
    const ret = await promise;
    spinner.stop(true);
    return ret;
  } catch (exc) {
    spinner.stop(true);
    throw exc;
  }
}