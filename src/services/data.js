import fs from 'fs-extra';

export function readJsonFile(filePath) {
  try {
    return fs.readJsonSync(filePath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null;
    }
    err.message = `Could not read file ${filePath}\n${err.message}`;
    throw err;
  }
}

export function stringify(json) {
  return `${JSON.stringify(json, null, 2)}\n`;
}

export function writeJsonFile(filePath, json) {
  try {
    fs.writeJsonSync(filePath, json);
  } catch (err) {
    err.message = `Could not write to file ${filePath}\n${err.message}`;
    throw err;
  }
}
