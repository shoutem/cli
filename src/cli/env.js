export const command = 'env <command>';
export const description = 'Fetch current version of react-native mobile app to run shoutem apps locally';
export const builder = env => env.commandDir('env').strict();
