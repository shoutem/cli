export const description = 'Manages settings pages.';
export const command = 'page <command>';
export const builder = page => page
  .commandDir('page')
  .usage(`shoutem ${command}\n\n${description}`)
  .strict();
