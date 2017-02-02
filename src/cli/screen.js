/* eslint no-console: 0, no-return-assign: 0 */
export const description = 'Manage extension screens';
export const command = 'screen <command>';
export const builder = screen => screen.commandDir('screen').strict();
