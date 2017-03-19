import { Spinner } from 'cli-spinner';

export function startSpinner(msg) {
  const spinner = new Spinner(msg);
  spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');
  spinner.start();

  return spinner;
}
