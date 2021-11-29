import { Spinner } from 'cli-spinner';
import { isVerbose } from './logger';

let spinners = [];

export function startSpinner(msg) {
  if (isVerbose()) {
    console.log(msg);
    return { stop() {} };
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

export async function spinify(promise, msg, successMsg) {
  const spinner = startSpinner(msg);

  try {
    const result = await (typeof promise === 'function' ? promise() : promise);
    spinner.stop(true);
    if (successMsg) {
      console.log(`${msg} [${successMsg.green.bold}]`);
    }
    return result;
  } catch (error) {
    spinner.stop(true);
    if (successMsg) {
      console.log(`${msg} [${'ERROR'.red.bold}]`);
    }
    throw error;
  }
}
