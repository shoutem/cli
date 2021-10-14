import { prompt } from 'inquirer';

export default async function(message, opts = {}) {
  const { confirmed } = await prompt({
    type: 'confirm',
    message,
    name: 'confirmed',
    ...opts,
  });

  return confirmed;
}
