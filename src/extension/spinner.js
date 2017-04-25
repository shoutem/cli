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
