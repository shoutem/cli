/* eslint no-console: 0, no-return-assign: 0 */
export const description = 'Manage application themes';
export const command = 'theme <command>';
export const builder = theme => {
  return theme
    .commandDir('theme')
    .usage(`shoutem ${command}\n\n${description}`)
    .strict();
};
