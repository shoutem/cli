const platformLocationInvalidMessage = 'Error creating platform. Must be located in a directory containing a platform (i.e. root directory of a cloned app), or provide a URL to an archived platform.';
const platformUrlDescription = 'URL to archived platform. If omitted, the platform will be automatically generated from the current directory tree, in which case the user must execute this command from a directory containing a valid platform (i.e. root directory of a cloned app)';

// import/prefer-default-export const can't be default export
// eslint-disable-next-line
export const platformMessages = {
  platformLocationInvalidMessage,
  platformUrlDescription,
};
