export const description = 'Manages extension screens.';
export const command = 'screen <command>';
export const builder = screen => {
  return screen
    .commandDir('screen')
    .usage(`shoutem ${command}\n\n${description}`)
    .strict();
};
