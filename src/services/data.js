import fs from "fs-extra";

export async function readJsonFile(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null;
    }
    err.message = `Could not read file ${filePath}\n${err.message}`;
    throw err;
  }
}

export async function writeJsonFile(json, filePath) {
  const str = stringify(json);
  await fs.writeFile(filePath, str, 'utf8');
  return str;
}

export function stringify(json) {
  return `${JSON.stringify(json, null, 2)}\n`;
}
