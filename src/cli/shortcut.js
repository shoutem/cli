export const description = 'Manages extension shortcuts.';
export const command = 'shortcut <command>';
export const builder = shortcut => shortcut
  .commandDir('shortcut')
  .usage(`shoutem ${command}\n\n${description}`)
  .strict();
