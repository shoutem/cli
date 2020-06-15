export const description = 'Manage extension shortcuts';
export const command = 'shortcut <command>';
export const builder = shortcut => {
  return shortcut
    .commandDir('shortcut')
    .usage(`shoutem ${command}\n\n${description}`)
    .strict();
};
