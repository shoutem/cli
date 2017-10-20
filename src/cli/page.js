export const description = 'Manage settings pages';
export const command = 'page <command>';
export const builder = page => {
  return page
    .commandDir('page')
    .usage(`shoutem ${command}\n\n${description}`)
    .strict();
};
