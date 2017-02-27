/* eslint no-console: 0, no-return-assign: 0 */
export const description = 'Manage application shortcuts';
export const command = 'shortcut <command>';
export const builder = shortcut => {
  return shortcut
    .commandDir('shortcut')
    .usage(`shoutem ${command}\n\n${description}`)
    .strict();
};
