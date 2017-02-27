import show from '../commands/show.js';

export const command = 'show';
export const description = 'Shows user status and list of linked extensions';
export async function handler() {
  try {
    await show();
  } catch (err) {
    console.log(err.message || err);
  }
}

export function builder(yargs) {
  return yargs.usage(`shoutem ${command}\n\n${description}`);
}
