export const description = 'Manages platforms.';
export const command = 'platform <command>';
export const builder = page =>
  page
    .commandDir('platform')
    .usage(`shoutem ${command}\n\n${description}`)
    .strict();
